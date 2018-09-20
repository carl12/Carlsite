import logging
import urllib2
# from urllib.request import urlopen
import json
from xml.dom import minidom
from google.appengine.ext import db
from handlers import Handler
from lib import apiKey


IP_URL ="http://api.ipstack.com/"
keyStr = "?access_key="+ apiKey.ipStack_key

def get_coords(ip):
    # ip = '50.193.21.147' # test ip address
    url = IP_URL + ip + keyStr
    content = None
    try:
        content = urllib2.urlopen(url).read()
    except urllib2.URLError: 
        logging.error('urlerror occurred')
        logging.info(url)
        return
    if content:
        try:
            content = json.loads(content)
            lat = content['latitude']
            lon = content['longitude']
            return db.GeoPt(lat,lon)
        except:
            logging.error('some sort of error getting lat and long')
            return
    else:
        logging.info('no content')

GMAPS_URL = 'http://maps.google.com/maps/api/staticmap?size=380x263&sensor=false&'
def gmaps_img(points):
    markers = '&'.join('markers={},{}'.format(p.lat,p.lon) for p in points)
    return GMAPS_URL + markers     


class Art(db.Model):
    title = db.StringProperty(required = True)
    art = db.TextProperty(required = True)
    created = db.DateTimeProperty(auto_now_add = True)
    coords = db.GeoPtProperty()

class AsciiPage(Handler):
    def render_front(self, title="", art="", error=""):
        artCursor = db.GqlQuery("SELECT * FROM Art ORDER BY created DESC ")
        arts = list(artCursor)
        points=[]
        points = filter(None, (a.coords for a in arts))
        img_url = None
        if points: 
            img_url = gmaps_img(points)
        self.render("asciiHome.html", 
                    title=title, 
                    art=art, 
                    error=error, 
                    arts=arts, 
                    img_url=img_url)

    def get(self):
        self.write(self.request.remote_addr)
        self.write(repr(get_coords(self.request.remote_addr)))
        self.render_front()

    def post(self):
        title = self.request.get("title")
        art = self.request.get("art")
        if title and art:
            a = Art(title=title, art=art)
            coords = get_coords(self.request.remote_addr)
            coords = None
            if coords: 
                a.coords = coords
            a.put()
            #lookup user's coordinates from ip

            # to prevent message - you must resubmit - when reloading
            self.redirect("")
        else:
            error = "we need both art and a title"
            self.render_front(title,art,error)
ascii_path = "/ascii"
pages = [(ascii_path, AsciiPage)]
