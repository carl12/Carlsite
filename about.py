from handlers import Handler

class AboutPage(Handler):
    def get(self):
        self.render("about.html")


pages = [('/about', AboutPage)]