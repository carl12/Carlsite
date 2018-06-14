from handlers import Handler

class MachiPage(Handler):
    def get(self):
        self.render("machiKoro.html")



pages = [('/machikoro', MachiPage)]