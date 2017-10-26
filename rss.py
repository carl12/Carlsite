import logging
import webapp2
import urllib2
from xml.dom import minidom
from google.appengine.ext import db
from lib import myHash
from handlers import Handler


rss_path='/rss'



class FeedSet(db.Model):
    title = db.StringProperty(required = True)
    links = db.ListProperty(str,required = True)
    priority = db.IntegerProperty()


class Article():
    def __init__(self, title, link, date, image=None, description=''):
        self.title = title
        self.link = link
        self.date = date
        self.image = image
        self.description = description
#     @classmethod
#     def by_id(cls, uid):
#         return User.get_by_id(uid, parent=users_key())

# def users_key(group = 'default'):
#     return db.Key.from_path('users',group)





class MainPage(Handler):
    def get(self):
        feed = db.GqlQuery("SELECT * FROM FeedSet")

        feed1 = FeedSet(title='feed1',links=['http://rss.nytimes.com/services/xml/rss/nyt/Africa.xml','https://www.bing.com'],priority=2)
        
        p = urllib2.urlopen('http://rss.nytimes.com/services/xml/rss/nyt/Africa.xml')

        c = p.read()
        domo = minidom.parseString(c)
        items = domo.getElementsByTagName('item')
        articles = []
        # self.write('asdf')
        for item in items:
            title = item.getElementsByTagName('title')[0].childNodes[0].nodeValue
            link = item.getElementsByTagName('link')[0].childNodes[0].nodeValue
            img_el = item.getElementsByTagName('media:content')
            image = img_el[0].getAttribute('url') if img_el else None
            description = item.getElementsByTagName('description')[0].childNodes[0].nodeValue
            date = item.getElementsByTagName('pubDate')[0].childNodes[0].nodeValue
            # self.write('asdf')
            articles.append(Article(title,link,date,image,description))
    
        self.render('rss.html',articles=articles)

    def post(self):
        pass


# class NewPost(BlogHandler):
#     def render_newPost(self, path=blog_path, title="", text="", error=""):
#         self.render("newPost.html", path=path, title=title, text=text, error=error)

#     def get(self):
#         if self.user:
#             self.render_newPost()  
#         else: 
#             self.redirect('login')

#     def post(self):
#         if self.user:
#             title = self.request.get("title")
#             text = self.request.get("text")
#             if title and text:
#                 p  = Post(title=title, text=text)
#                 p.put()
#                 postId = str(p.key().id())
#                 self.redirect(postId)
#             else:
#                 error = "Please enter both"
#                 self.render_newPost(title, text, error)
#         else: 
#             self.redirect('')

# class PostPage(BlogHandler):
#     def get(self, post_id):
#         p = Post.get_by_id(int(post_id))

#         if p:
#             self.render("permalink.html", post = p, id = post_id)
#         else:
#             self.error(404)

# class UserSignup(BlogHandler):
#     def render_signup(self, nameE="",pwE="",emailE="", stored=["",""]):
#         self.render("signup.html",nameE=nameE,pwE=pwE,emailE=emailE,stored=stored)

#     def get(self):
#         #render html for signup (which has some validation)
#         self.render_signup()


#     def post(self):
#         # read username
#         username = self.request.get("username")
#         password = self.request.get("password")
#         confirmPassword = self.request.get("confirmPassword")
#         email = self.request.get("email")
#         if not username or not password or not confirmPassword:
#             self.render_signup("Please complete all required fields","","",[username,email])
#             return
#         elif password != confirmPassword:
#             self.render_signup("","Passwords do not match","",[username,email])
#             return
#         elif invalid_email(email):
#             self.render_signup("","","Invalid email",[username,email])


#         #check db for user with that name

#         if User.by_name(username):
#             self.render_signup("Username already taken")
#             #redirect to newuser
#         else:
            
#             u = User.register(username, password, email)
#             u.put()
#             # new_user = User(username = username, pw_hash = pw_hash)
#             # new_user.put()

#             self.set_secure_cookie('user_id',username)
#             self.redirect("welcome")
#         #check if user exists
#         #set user cookie (with hash stuff)
#         #enter user into database (later)
#         #redirect to welcome page with user name

# class UserLogin(BlogHandler):
#     def get(self):
#         self.render('login-form.html')

#     def post(self):
#         #gather info from header
#         username = self.request.get('username')
#         password = self.request.get('password')
#         #check if user exists
#         u = User.login(username, password)
#         if u:
#             self.login(u)
#             self.redirect('/blog')
#         else: 
#             self.render('login-form.html', error='Invalid login')

#         #check password against hash

#         #redirect to front page


# class UserLogout(BlogHandler):
#     def get(self):
#         self.logout()
#         self.redirect('/blog')




# class Welcome(BlogHandler):
#     def get(self):
#         cookie = self.request.cookies.get("user_id",0)
#         if cookie:
#             user = myHash.check_secure_val(cookie)
#             if user:
#                 self.write("Welcome! "+ user)
#                 return
#         self.redirect("signup")


pages = [
(rss_path, MainPage)
]