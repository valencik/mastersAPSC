import csv
import os.path
import pymongo
import subprocess
import sys

# Connect to the local Mongo server
try:
    client = pymongo.MongoClient('localhost', 27017, serverSelectionTimeoutMS=100)
    client.admin.command('ismaster') # Test command to see if we can connect

    # If we can conenct, reset client to defaults
    print("Successfully connected to MongoDB...")
    client = pymongo.MongoClient('localhost', 27017)
except pymongo.errors.ConnectionFailure:
    sys.exit("ERROR: Could not connect to database, are you sure 'mongod' is running?")

# Create 'masters' database
if not 'masters' in client.database_names():
    print("Database 'masters' was not found, creating...")
else:
    print("Found database 'masters'...")
db = client['masters']

# Import NSR data
if not 'NSR' in db.collection_names():
    if not os.path.isfile("NSR.json"):
        if os.path.isfile("mastersNSRDataDump.tbz2"):
            print("Could not find database file NSR.json...")
            print("Found mastersNSRDataDump.tbz2, extracting...")
            subprocess.call(["tar",  "-xf", "mastersNSRDataDump.tbz2"])
            subprocess.call(["mv",  "NSRDump.out", "NSR.json"])
            print("Running perl magic...")
            subprocess.call(["perl", "parseNSRtoJSON.pl", "NSR.json"])
            subprocess.call(["perl", "massageJSONtoSchema.pl", "NSR.json"])
            subprocess.call(["perl", "flattenJSONforMongo.pl", "NSR.json"])
    if os.path.isfile("NSR.json"):
        print("NSR collection not found, importing NSR.json with mongoimport...")
        subprocess.call(["mongoimport",  "--db",  "masters",  "--collection",  "NSR",  "--type",  "json",  "--file",  "NSR.json"])
    else:
        sys.exit("ERROR: Could not find data files NSR.json or mastersNSRDataDump.tbz2")
print("Found NSR collection...")

# Create collection authorSummary
if not 'authorSummary' in db.collection_names():
    print("Collection authorSummary not found, creating...")
    db.NSR.aggregate([
        {"$project": {"_id": 1, "copyauthors": "$authors", "authors": 1, "year": 1, "selectors": 1}},
        {"$unwind": "$authors"},
        {"$unwind": "$copyauthors"},
        {"$group": {"_id": "$authors", "coauthors": {"$addToSet": "$copyauthors"}, "years": {"$addToSet": "$year"},
            "papers": {"$addToSet": "$_id"}}},
        {"$out": "authorSummary"}
    ], allowDiskUse=True)


# Generate authorSummary tsv for clustering
print("Aggregating authorSummary data...")
authorSummary_pipeline = [
    {"$project": {"_id": 1, "numCoauthors": {"$size": "$coauthors"}, "numYears": {"$size": "$years"},
        "numEntries": {"$size": "$papers"}}}
    ]
results = db.authorSummary.aggregate(authorSummary_pipeline, allowDiskUse=True)
with open('author-cluster-input.tsv', 'w', newline='') as tsvfile:
    print("Writing authorSummary data to file...")
    transaction_writer = csv.writer(tsvfile, delimiter='\t')
    for document in results:
        transaction_list = [document['_id']]
        transaction_list.append(document['numCoauthors'])
        transaction_list.append(document['numYears'])
        transaction_list.append(document['numEntries'])
        transaction_writer.writerow(transaction_list)

# Generate transactions tsv for association rule learning
print("Aggregating transaction data...")
selectorAuthors_pipeline = [
    {"$match": {"selectors.type":"N"}},
    {"$unwind": "$selectors"},
    {"$unwind": "$authors"},
    {"$group": {"_id": "$selectors.value", "authors": {"$addToSet": "$authors"}}}
]
results = db.NSR.aggregate(selectorAuthors_pipeline, allowDiskUse=True)
with open('transactionsSelectorAuthors.tsv', 'w', newline='') as tsvfile:
    print("Writing transaction data to file...")
    transaction_writer = csv.writer(tsvfile, delimiter='\t')
    for document in results:
        transaction_list = document['authors']
        transaction_list.insert(0, document['_id'])
        transaction_writer.writerow(transaction_list)
