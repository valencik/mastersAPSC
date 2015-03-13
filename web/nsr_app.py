from pymongo import MongoClient
from flask import Flask, jsonify, request

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

# API: topauthors
# returns an array of authors in given year sorted by publication number
@app.route('/api/topauthors')
def aggregate():
    topauthors_params = request.args
    year_id = int(topauthors_params['year'])
    limit_id = 2
    if 'limit' in topauthors_params:
        limit_id = int(topauthors_params['limit'])
    topauthors_pipeline = [
        {"$match": {"year": year_id}},
        {"$unwind": "$authors"},
        {"$group": {"_id": "$authors", "total": {"$sum": 1}}},
        {"$sort": {"total": -1} },
        {"$limit": limit_id}
    ]
    results = jsonify(nsr.aggregate(topauthors_pipeline))
    return results


# If executed directly from python interpreter, run local server
if __name__ == '__main__':
    app.run(debug=True)
