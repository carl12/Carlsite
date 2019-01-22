import logging
import webapp2
import helloWorld
import blog
import fizzBuzz
import asciiC
import rot13
import rss
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
        self.render("istanbul.html")

class PhaserDemo(Handler):
	def get(self):
		self.render("phaserTest.html")

class Phaser1(Handler):
	def get(self):
		self.render("phaser1/part1.html")









front_page = [
('/', FrontPage),
('/about', AboutPage),
('/machikoro', MachiPage),
('/istanbul', IstanPage),
('/phaser', PhaserDemo),
('/p1', Phaser1),
]

all_pages = front_page + blog.pages + helloWorld.pages + fizzBuzz.pages + asciiC.pages + rot13.pages +rss.pages


app = webapp2.WSGIApplication(all_pages, debug=True)
