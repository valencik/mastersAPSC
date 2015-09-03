import csv
import os.path
import pymongo
import subprocess
import sys
import argparse

# Parse command line input (filename of cluster memberships)
parser = argparse.ArgumentParser()
parser.add_argument('filename', type=argparse.FileType('r'))
args = parser.parse_args()
membership_document = args.filename

# Connect to the local Mongo server
try:
    client = pymongo.MongoClient('localhost', 27017, serverSelectionTimeoutMS=100)
    client.admin.command('ismaster')  # Test command to see if we can connect

    # If we can conenct, reset client to defaults
    print("Successfully connected to MongoDB...")
    client = pymongo.MongoClient('localhost', 27017)
except pymongo.errors.ConnectionFailure:
    sys.exit("ERROR: Could not connect to database, are you sure 'mongod' is running?")

# Check for 'masters' database
if 'masters' not in client.database_names():
    sys.exit("ERROR: Database 'masters' was not found. Inspect database and run 'prepare-data.py' if needed.")
else:
    print("Found database 'masters'...")
db = client['masters']


# Update collection authorSummary
if 'authorSummary' not in db.collection_names():
    sys.exit("ERROR: Collection 'authorSummary' was not found. Inspect database and run 'prepare-data.py' if needed.")
else:
    author_reader = csv.reader(membership_document, delimiter=',')
    for author_line in author_reader:
        author = author_line[0]
        cluster_membership = author_line[1]
        db.authorSummary.update_one({"_id": author},{"$set": {"cluster": cluster_membership}})
