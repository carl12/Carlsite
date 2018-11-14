from handlers import Handler

class PhaserDemo(Handler):
	def get(self):
		self.render("phaserTest.html")

class Phaser1(Handler):
	def get(self):
		self.render("phaser1/part1.html")



pages = [
('/p-demo', PhaserDemo),
('/p1', Phaser1),
]
