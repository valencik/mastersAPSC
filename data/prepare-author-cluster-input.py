import sys
from pymongo import MongoClient
import csv

# Connect to the main database
client = MongoClient('localhost', 27017)
db = client.masters
collections = db.collection_names()
if not 'NSR' in collections:
    sys.exit("ERROR: NSR collection not found.")

#Create the authorSummary collection
if not 'authorSummary' in db.collection_names():
    db.NSR.aggregate([
        {"$project": {"_id": 1, "copyauthors": "$authors", "authors": 1, "year": 1, "selectors": 1}},
        {"$unwind": "$authors"},
        {"$unwind": "$copyauthors"},
        {"$group": {"_id": "$authors", "coauthors": {"$addToSet": "$copyauthors"}, "years": {"$addToSet": "$year"},
            "papers": {"$addToSet": "$_id"}}},
        {"$out": "authorSummary"}
    ], allowDiskUse=True)

# Flatten the authorSummary data for clustering
authorSummary_pipeline = [
    {"$project": {"_id": 1, "numCoauthors": {"$size": "$coauthors"}, "numYears": {"$size": "$years"},
        "numEntries": {"$size": "$papers"}}}
    ]
results = db.authorSummary.aggregate(authorSummary_pipeline, allowDiskUse=True)

# Write the flattened data to a tsv file
with open('author-cluster-input.tsv', 'w', newline='') as tsvfile:
    transaction_writer = csv.writer(tsvfile, delimiter='\t')
    for document in results:
        transaction_list = [document['_id']]
        transaction_list.append(document['numCoauthors'])
        transaction_list.append(document['numYears'])
        transaction_list.append(document['numEntries'])
        transaction_writer.writerow(transaction_list)
