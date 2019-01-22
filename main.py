import logging
import webapp2
import helloWorld
import blog
import fizzBuzz
import asciiC
import rot13
import rss
import phaser
from handlers import Handler


def blog_key(name = 'default'):
    return db.Key.from_path('blogs',name)

class FrontPage(Handler):
    def get(self):
        self.render("frontPage.html")

class AboutPage(Handler):
    def get(self):
        self.render("about.html")

class MachiPage(Handler):
    def get(self):
        self.render("machiKoro.html")

class IstanPage(Handler):
    def get(self):
        self.render("instanbul.html")








front_page = [
('/', FrontPage),
('/about', AboutPage),
('/machikoro', MachiPage),
('/istanbul', IstanPage),
]

all_pages = front_page + blog.pages + helloWorld.pages + fizzBuzz.pages + asciiC.pages + rot13.pages +rss.pages + phaser.pages


app = webapp2.WSGIApplication(all_pages, debug=True)
