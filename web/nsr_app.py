from pymongo import MongoClient
from flask import Flask, jsonify, request, render_template
import networkx as nx
from networkx.readwrite import json_graph
from itertools import combinations

# Setup the connection to MongoDB and get the NSR collection
client = MongoClient('localhost', 27017)
db = client.masters
nsr = db.NSR

# Create our instance of the Flask class
app = Flask(__name__)

# Enable CORS
# https://gist.github.com/blixt/54d0a8bf9f64ce2ec6b8
# This should be investigated for security concerns
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Methods'] = 'DELETE, GET, POST, PUT'
        headers = request.headers.get('Access-Control-Request-Headers')
        if headers:
            response.headers['Access-Control-Allow-Headers'] = headers
    return response
app.after_request(add_cors_headers)

# Root site route
@app.route('/')
def hello_world():
    return render_template('summary-homepage.html', header='NSR Data Visuals')

# Route for find_one(year)
@app.route('/api/year/<int:year_id>')
def find_year(year_id):
    first_doc = nsr.find_one({"year": year_id})
    title = first_doc['title']
    return "The first title in {year} is: {title}".format(year=year_id, title=title)

# API: author report
# returns a report on the authors statistics
@app.route('/api/author/<author_id>')
def author_report(author_id):
    results = nsr.find({"authors": author_id})
    docs = []
    nodes = set()
    for document in results:
        docs.append(document)
        if 'authors' in document:
            nodes.update(document['authors'])

    return render_template('authorReport.html',
        author=author_id,
        author_num=len(nodes)-1,
        paper_num=len(docs),
        first_doc_year=docs[0]['year'],
        last_doc_year=docs[-1]['year'],
        docs=docs
    )

# API: topauthors
# returns an array of authors in given year sorted by publication number
@app.route('/api/topauthors/<int:year_id>')
def topauthors(year_id):
    topauthors_params = request.args
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
    results = jsonify(nsr.aggregate(topauthors_pipeline)['result'])
    return results

# API: authornetwork
# returns a network of authors
@app.route('/api/authornetwork/<int:year_id>')
def authornetwork(year_id):
    authornetwork_params = request.args
    authornetwork_pipeline = [
        {"$match": {"year": year_id}},
        {"$project": {"_id": 0, "authors": "$authors"}}
    ]
    results = nsr.aggregate(authornetwork_pipeline)['result']
    G = nx.Graph()
    nodes = set()
    for author_list in results:
        if 'authors' in author_list:
            nodes.update(author_list['authors'])
            for i in combinations(author_list['authors'], 2):
                G.add_edge(i[0], i[1])
    G.add_nodes_from(nodes)
    graphs = list(nx.connected_component_subgraphs(G))
    graphs.sort(key = lambda x: -x.number_of_edges())
    if 'topnetwork' in authornetwork_params:
        top_num = int(authornetwork_params['topnetwork'])
        data = json_graph.node_link_data(graphs[top_num-1])
    else:
        data = json_graph.node_link_data(G)
    return jsonify(data)


# If executed directly from python interpreter, run local server
if __name__ == '__main__':
    app.run(debug=True)
