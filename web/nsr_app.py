from pymongo import MongoClient
from flask import Flask

# Setup the connection to MongoDB and get the NSR collection
client = MongoClient('localhost', 27017)
db = client.masters
nsr = db.NSR

# Create our instance of the Flask class
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'First result: %s' % str(nsr.find_one())

# If executed directly from python interpreter, run local server
if __name__ == '__main__':
    app.run()
