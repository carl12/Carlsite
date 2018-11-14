import logging
import webapp2
import helloWorld
import blog
import fizzBuzz
import asciiC
import rot13
import rss
import about
import machiKoro
from handlers import Handler


def blog_key(name = 'default'):
    return db.Key.from_path('blogs',name)

class PhaserPage(Handler):
	def get(self):
		self.render("phaserTest.html")

class FrontPage(Handler):
    def get(self):
        self.render("frontPage.html")




front_page = [
('/', FrontPage),
('/phaser', PhaserPage),
]

all_pages = front_page + blog.pages + helloWorld.pages + fizzBuzz.pages + asciiC.pages + rot13.pages +rss.pages + about.pages + machiKoro.pages


app = webapp2.WSGIApplication(all_pages, debug=True)
