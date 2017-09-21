# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import logging
import webapp2
import helloWorld
import blog
import fizzBuzz
import asciiC
import rot13
from handlers import Handler


def blog_key(name = 'default'):
    return db.Key.from_path('blogs',name)


class FrontPage(Handler):
    def get(self):
        self.render("frontPage.html")





front_page = [('/', FrontPage)]
all_pages = front_page + blog.pages + helloWorld.pages + fizzBuzz.pages + asciiC.pages + rot13.pages


app = webapp2.WSGIApplication(all_pages, debug=True)
