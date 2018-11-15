import logging
import webapp2
import helloWorld
import blog
import fizzBuzz
import asciiC
import rot13
import rss
import machiKoro
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






front_page = [
('/', FrontPage),
('/about', AboutPage),
]

all_pages = front_page + blog.pages + helloWorld.pages + fizzBuzz.pages + asciiC.pages + rot13.pages +rss.pages +  machiKoro.pages + phaser.pages


app = webapp2.WSGIApplication(all_pages, debug=True)
