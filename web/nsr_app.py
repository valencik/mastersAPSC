from pymongo import MongoClient
from flask import Flask

# Setup the connection to MongoDB and get the NSR collection
client = MongoClient('localhost', 27017)
db = client.masters
nsr = db.NSR

# Create our instance of the Flask class
app = Flask(__name__)


# Root site route
@app.route('/')
def hello_world():
    return 'Hello World!'

# Route for find_one(year)
@app.route('/year/<int:year_id>')
def find_year(year_id):
    first_doc = nsr.find_one({"year": year_id})
    title = first_doc['title']
    return "The first title in {year} is: {title}".format(year=year_id, title=title)


# If executed directly from python interpreter, run local server
if __name__ == '__main__':
    app.run(debug=True)
