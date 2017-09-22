# TODO: update algorithm to something more efficient and elegant

import webapp2
import cgi
import codecs
from handlers import Handler

# lim = [65,90,97,122]
# split = [(lim[0]+lim[1]+0.0)/2,(lim[2]+lim[3]+0.0)/2]

# def rot13(s=""):
#     for i in range(lim[0],int(split[0])+1):
#         s=s.replace(chr(i+13),chr(0))
#         s=s.replace(chr(i),chr(i+13))
#         s=s.replace(chr(0),chr(i))

#     for i in range(lim[2],int(split[1])+1):
#         s=s.replace(chr(i+13),chr(0))
#         s=s.replace(chr(i),chr(i+13))
#         s=s.replace(chr(0),chr(i))
#     return s

def rot13(s=""):
    return codecs.encode(s,'rot_13')

def escape_html(s):
    return cgi.escape(s,quote = True)


class ROT13(Handler):

    def write_form(self, message=""):
        self.response.out.write(form % {"message":escape_html(message)})

    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        self.render('rot13.html')

    def post(self):
        self.response.headers['Content-Type'] = 'text/html'
        a = self.request.get("text")
        if a:
            # self.write_form(rot13(a))
            self.render('rot13.html',message=rot13(a))
        else:
            # self.write_form(rot13())
            self.render('rot13.html')


pages = [('/rot13',ROT13)]

