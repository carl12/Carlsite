import hashlib
import hmac
import random
import string


SECRET =b"ASR@#EFQWDFASDzxfasdFAERA"
log = []
def hash_str(s):
    # return hashlib.md5(s).hexdigest()
    return hmac.new(SECRET, s).hexdigest()

def make_salt():
    return make_bytes(''.join(random.choice(string.ascii_letters) for _ in range(5)))

def make_bytes(str_in):
    if type(str_in) is str:
        return str.encode(str_in)   
    else:
        return str_in

def make_str(byte_in):
    return byte_in.decode("utf-8")


def make_pw_hash(name, pw, salt = None):
    name = make_bytes(name)
    pw = make_bytes(pw)
    if not salt:
        salt = make_salt()
    else:
        salt = make_bytes(salt)
    hash = hashlib.sha256(name+pw+salt).hexdigest()
    salt_str = make_str(salt)
    return '{}|{}'.format(hash,salt_str)

def valid_pw(name,pw,h):
    if name and pw and h:
        salt = h.split('|')[1]
        return make_pw_hash(name, pw, salt) == h

def make_secure_val(s):
    if type(s) is str:
        s = str.encode(s)
    hash1 = hash_str(s)
    s_str = s.decode("utf-8")
    #s is a char literal, so we have to convert it to a string to remove b at the start
    return "{}|{}".format(s_str,hash1)



def get_pw_hash(input):
    return input.split("|")[0]

def get_pw_salt(input):
    return input.split("|")[1]


def check_secure_val(h):
    parts = h.split("|")
    # log.append(h)
    # log.append(parts)
    if len(parts) == 2:
        if hash_str(parts[0]) == parts[1]:
            log.append("success")
            return parts[0]



name="steve"
password="hunter2"

pw_hash = make_pw_hash(name, password)
# new_user = User(username = username, pw_hash = pw_hash)
# new_user.put()

print(pw_hash)


# # self.response.headers.add_header("set-cookie", 'user_id=%s' %pw_hash)

# self.write("Welcome! ")
# self.write(new_user.username)
