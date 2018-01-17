import logging
import webapp2
from google.appengine.ext import db
from lib import myHash
from handlers import Handler


blog_path='/blog'

class BlogHandler(Handler):

    def render_str(self, template, **params):
        params['user'] = self.user
        return super(BlogHandler, self).render_str(template, **params)
        

    def set_secure_cookie(self, name, val):
        cookie_val = myHash.make_secure_val(val)
        self.response.headers.add_header(
            'set-cookie','{}={}; Path=/'.format(name,cookie_val))


    def read_secure_cookie(self, name):
        cookie_val = self.request.cookies.get(name)
        return cookie_val and myHash.check_secure_val(cookie_val)

    def login(self, user):
        self.set_secure_cookie('user_id',user.username)

    def logout(self):
        self.response.headers.add_header('set-cookie','user_id=; Path=/')

    def initialize(self, *a, **kw):
        webapp2.RequestHandler.initialize(self,*a,**kw)
        username = self.read_secure_cookie('user_id')
        self.user = username and User.by_name(username)

def blog_key(name = 'default'):
    return db.Key.from_path('blogs',name)


class Post(db.Model):
    title = db.StringProperty(required = True)
    text = db.TextProperty(required = True)
    created = db.DateTimeProperty(auto_now_add = True)
    last_modified = db.DateTimeProperty(auto_now_add = True)

def users_key(group = 'default'):
    return db.Key.from_path('users',group)

class User(db.Model):
    username = db.StringProperty(required = True)
    pw_hash = db.StringProperty(required = True)
    email = db.StringProperty()

    @classmethod
    def by_name(cls, username):
        u = User.all().filter('username =',username).get()
        return u

    @classmethod
    def by_id(cls, uid):
        return User.get_by_id(uid, parent=users_key())

    @classmethod 
    def register(cls, username, pw, email=None):
        pw_hash = myHash.make_pw_hash(username,pw)
        return User(parent=users_key(),
                    username=username,
                    pw_hash=pw_hash,
                    email=email)

    @classmethod
    def login(cls, name, pw):
        u = cls.by_name(name)
        if u and myHash.valid_pw(name, pw, u.pw_hash):
            return u


def invalid_email(email):
    return False

class MainPage(BlogHandler):
    def render_front(self, path=blog_path, title="", art="", error=""):
        posts = db.GqlQuery("SELECT * FROM Post ORDER BY created DESC LIMIT 10 ")
        self.render("frontBlog.html", posts=posts, path=path)

    def get(self):
        self.render_front()


class NewPost(BlogHandler):
    def render_newPost(self, path=blog_path, title="", text="", error=""):
        self.render("newPost.html", path=path, title=title, text=text, error=error)

    def get(self):
        if self.user:
            self.render_newPost()  
        else: 
            self.redirect('login')

    def post(self):
        if self.user:
            title = self.request.get("title")
            text = self.request.get("text")
            if title and text:
                p  = Post(title=title, text=text)
                p.put()
                postId = str(p.key().id())
                self.redirect(postId)
            else:
                error = "Please enter both"
                self.render_newPost(title, text, error)
        else: 
            self.redirect('')

class PostPage(BlogHandler):
    def get(self, post_id):
        p = Post.get_by_id(int(post_id))

        if p:
            self.render("permalink.html", post = p, id = post_id)
        else:
            self.error(404)

class UserSignup(BlogHandler):
    def render_signup(self, nameE="",pwE="",emailE="", stored=["",""]):
        self.render("signup.html",nameE=nameE,pwE=pwE,emailE=emailE,stored=stored)

    def get(self):
        #render html for signup (which has some validation)
        self.render_signup()


    def post(self):
        # read username
        username = self.request.get("username")
        password = self.request.get("password")
        confirmPassword = self.request.get("confirmPassword")
        email = self.request.get("email")
        if not username or not password or not confirmPassword:
            self.render_signup("Please complete all required fields","","",[username,email])
            return
        elif password != confirmPassword:
            self.render_signup("","Passwords do not match","",[username,email])
            return
        elif invalid_email(email):
            self.render_signup("","","Invalid email",[username,email])


        #check db for user with that name

        if User.by_name(username):
            self.render_signup("Username already taken")
            #redirect to newuser
        else:
            
            u = User.register(username, password, email)
            u.put()
            # new_user = User(username = username, pw_hash = pw_hash)
            # new_user.put()

            self.set_secure_cookie('user_id',username)
            self.redirect("welcome")
        #check if user exists
        #set user cookie (with hash stuff)
        #enter user into database (later)
        #redirect to welcome page with user name

class UserLogin(BlogHandler):
    def get(self):
        self.render('login-form.html',extra="asdf")

    def post(self):
        #gather info from header
        username = self.request.get('username')
        password = self.request.get('password')
        #check if user exists
        u = User.login(username, password)
        if u:
            self.login(u)
            self.redirect('/blog')
        else: 
            self.render('login-form.html', error='Invalid login', extra='asdf')

        #check password against hash

        #redirect to front page


class UserLogout(BlogHandler):
    def get(self):
        self.logout()
        self.redirect('/blog')




class Welcome(BlogHandler):
    def get(self):
        cookie = self.request.cookies.get("user_id",0)
        if cookie:
            user = myHash.check_secure_val(cookie)
            if user:
                self.render('welcomeUser.html',userName=user)
                return
        self.redirect("signup") 


pages = [
(blog_path, MainPage),
(blog_path+'/', MainPage),
(blog_path+'/newpost', NewPost),
(blog_path+'/([0-9]+)', PostPage),
(blog_path+'/signup', UserSignup),
(blog_path+'/logout', UserLogout),
(blog_path+'/login', UserLogin),
(blog_path+'/welcome', Welcome)
]