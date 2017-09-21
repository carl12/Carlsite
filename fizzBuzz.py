# TODO: add entry box for fizzbuzzing instead of doing it manually
    # Add functionality to delete items from to do list
    # Change heading to something prettier

import webapp2
import jinja2
import os
from handlers import Handler




class ShoppingList(Handler):
    def get(self):
        items = self.request.get_all('food')
        self.render("shopping_list.html", items = items)

class FizzBuzz(Handler):
    def get(self):
        in1 = self.request.get("n")
        if in1 and in1.isdigit():
            n = int(in1)    
            self.render("fizzbuzz.html",n=n)
        else:
            self.render("fizzPrompt.html")


pages = [('/shoppinglist', ShoppingList),
         ('/fizzbuzz',FizzBuzz)]
