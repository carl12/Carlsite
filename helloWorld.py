

from handlers import Handler

class HelloWorld(Handler):
	def get(self):
		self.write("Hello World!")

pages = [
('/helloworld',HelloWorld)
]