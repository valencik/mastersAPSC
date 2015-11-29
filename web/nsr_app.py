from pymongo import MongoClient
from flask import Flask, jsonify, request, render_template
import networkx as nx
from networkx.readwrite import json_graph
from itertools import combinations
from collections import defaultdict
import re
import json
from bson import json_util
from bson.objectid import ObjectId

def toJson(data):
    """
    Convert Mongo object(s) to JSON
    """
    return json.dumps(data, default=json_util.default)

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
    return render_template('index.html', header='NSR Data Visuals')

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
    nsr_results = nsr.find({"authors": author_id})
    docs = []
    nodes = set()
    for document in nsr_results:
        docs.append(document)
        if 'authors' in document:
            nodes.update(document['authors'])

    summary_results = db.authorSummary.find_one({"_id": author_id})
    if 'cluster' in summary_results:
        cluster_id=summary_results['cluster']

    return render_template('authorReport.html',
        author=author_id,
        author_num=len(nodes)-1,
        paper_num=len(docs),
        first_doc_year=docs[0]['year'],
        last_doc_year=docs[-1]['year'],
        docs=docs,
        cluster=cluster_id
    )

# Page: Recommended papers based on cosine score
@app.route('/recpapers/<author_id>')
def paper_recommend(author_id):
    recpapers_pipeline = [
        {"$match": {"authors": author_id}},
        {"$unwind": "$simPapers"},
        {"$group": {"_id": "$simPapers.paper", "score": {"$avg": "$simPapers.score"}}},
        {"$sort": {"score": -1}}
    ]
    recommended_papers = db.simNSR.aggregate(recpapers_pipeline)

    # save the score for each recommended paper
    scores = dict()
    for paper in recommended_papers:
        scores[paper['_id']] = paper['score']

    # get the full documents for each paper
    results = nsr.find({"_id": {"$in": [x for x in scores.keys()]}})

    # build up the docs list to render
    docs = []
    for document in results:
        score = scores[document['_id']]
        if 'authors' in document:
            if author_id in document['authors']: continue
            headline = str(document['authors'])[1:-1].replace("'", "")
            if len(headline) > 90: headline = headline[0:90] + "..."
        document['author_headline'] = headline
        document['score'] = "{:6.4f}".format(score)
        docs.append(document)

    # sort the docs by score
    docs.sort(key=lambda x: x['score'], reverse=True)

    return render_template('recommendedPapersForAuthor.html',
        author=author_id,
        author_num="???",
        paper_num=len(docs),
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
    results = jsonify(nsr.aggregate(topauthors_pipeline))
    return results

# API: yearnetwork
# returns a network of authors
@app.route('/api/yearnetwork/<int:year_id>')
def yearnetwork(year_id):
    yearnetwork_params = request.args
    yearnetwork_pipeline = [
        {"$match": {"year": year_id}}
    ]
    data = authorgraph(yearnetwork_pipeline, yearnetwork_params)
    return jsonify(data)

# API: authornetwork
# returns a network of authors
@app.route('/api/authornetwork')
def authornetwork():
    authornetwork_params = request.args
    author_id = authornetwork_params['author']
    print(author_id)
    authornetwork_pipeline = [
        {"$match": {"authors": author_id}}
    ]
    data = authorgraph(authornetwork_pipeline, authornetwork_params)
    return jsonify(data)

# API: searchnetwork
# returns a network of authors
@app.route('/api/searchnetwork')
def searchnetwork():
    searchnetwork_params = request.args
    if 'nuclide' in searchnetwork_params:
        search_nuclide = searchnetwork_params['nuclide'].upper()
        searchnetwork_pipeline = [
            {"$match": {"selectors.type":"N", "selectors.value":search_nuclide}}
        ]
    data = authorgraph(searchnetwork_pipeline, searchnetwork_params)
    return jsonify(data)

# Author graph function
def authorgraph(pipeline, options):
    pipeline.append({"$project": {"_id": 0, "authors": "$authors"}})
    results = nsr.aggregate(pipeline)
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
    if 'topnetwork' in options and int(options['topnetwork']) != 0:
        top_num = int(options['topnetwork'])
        data = json_graph.node_link_data(graphs[top_num-1])
    else:
        data = json_graph.node_link_data(G)
    return data

@app.route('/api/search')
def parse_search():
    """
    We apply a series of RegEx to the user search query and then modify
    the default query object passed to MongoDB.
    """
    search = request.args['input']
    print("NSR> recieved search: " + search)
    pipeline = []

    year_list = re.findall(r"(?<![:=_])([12][0-9]{3})+", search)
    if len(year_list) == 1:
        pipeline.append({"$match": {"year": int(year_list[0])}})
    if len(year_list) == 2:
        year_start = int(min(year_list))
        year_end = int(max(year_list))
        pipeline.append({"$match": {"year": {"$gte": year_start, "$lte": year_end}}})
    if len(year_list)  > 2:
        pipeline.append({"$match": {"year": {"$in": year_list}}})

    author_tuples = re.findall(r"(?<![:=_])(([a-zA-Z]\.){1,3}[a-zA-Z-]+)+", search)
    if len(author_tuples) >= 1:
        author_list = [author[0] for author in author_tuples]
        pipeline.append({"$match": {"authors": {"$in": author_list}}})

    nuclide_tuples = re.findall(r"(?<![:=_])([0-9]{1,3}[a-zA-Z]{1,3})+", search)
    if len(nuclide_tuples) >= 1:
        nuclide_list = [nuclide.upper() for nuclide in nuclide_tuples]
        pipeline.append({"$match": {"selectors.value": {"$in": nuclide_list}}})

    pipeline.append({"$project":
        {"_id": 1, "year": 1, "authors": 1, "type": 1, "selectors": "$selectors.value"}})
    results = nsr.aggregate(pipeline)

    # Iterate over mongo docs and update default values in _json vars
    # This can throw IndexErrors which I am not catching
    documents = []
    years_dict = defaultdict(int)

    for doc in results:
        documents.append(doc)
        doc_year = int(doc['year'])

        years_dict[doc_year] += 1

    year_json = [{'x': year, 'y': years_dict[year]} for year in range(min(years_dict.keys()), max(years_dict.keys()) + 1)]

    # Convert everything to JSON and ship it to the client
    return toJson({'years': year_json, 'entries': documents})


# If executed directly from python interpreter, run local server
if __name__ == '__main__':
    app.run(debug=True)
