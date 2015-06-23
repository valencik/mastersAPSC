from pymongo import MongoClient
import csv

client = MongoClient('localhost', 27017)
db = client.masters
nsr = db.NSR

#db.NSR.aggregate([{$match: {"selectors.type":"N"}},{$unwind: "$selectors"},{$unwind: "$authors"},{$group: {_id: "$selectors.value", authors: {$addToSet: "$authors"}}},{$out: "transactionsSelectorAuthors"}],{allowDiskUse:true})
selectorAuthors_pipeline = [
    {"$match": {"selectors.type":"N"}},
    {"$unwind": "$selectors"},
    {"$unwind": "$authors"},
    {"$group": {"_id": "$selectors.value", "authors": {"$addToSet": "$authors"}}}
]
results = nsr.aggregate(selectorAuthors_pipeline, allowDiskUse=True)

with open('tsa.tsv', 'w', newline='') as tsvfile:
    transaction_writer = csv.writer(tsvfile, delimiter='\t')
    for document in results:
        transaction_list = document['authors']
        transaction_list.insert(0, document['_id'])
        transaction_writer.writerow(transaction_list)
