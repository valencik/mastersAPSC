from pymongo import MongoClient
import csv

client = MongoClient('localhost', 27017)
db = client.masters
nsr = db.newAuthorSummary

#db.newAuthorSummary.aggregate([{$project: {_id: 1, numCoauthors: {$size: "$coauthors"}, numYears: {$size: "$years"}, numEntries: {$size: "$papers"}}}])
selectorAuthors_pipeline = [
    {"$project": {"_id": 1, "numCoauthors": {"$size": "$coauthors"}, "numYears": {"$size": "$years"}, "numEntries": {"$size": "$papers"}}}
]
results = nsr.aggregate(selectorAuthors_pipeline, allowDiskUse=True)

with open('author-cluster-input.tsv', 'w', newline='') as tsvfile:
    transaction_writer = csv.writer(tsvfile, delimiter='\t')
    for document in results:
        transaction_list = [document['_id']]
        transaction_list.append(document['numCoauthors'])
        transaction_list.append(document['numYears'])
        transaction_list.append(document['numEntries'])
        transaction_writer.writerow(transaction_list)
