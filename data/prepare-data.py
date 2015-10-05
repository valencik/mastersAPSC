import csv
import os.path
import pymongo
import subprocess
import sys
import statistics
import math
import functools


def percentile(N, percent, key=lambda x: x):
    """
    Find the percentile of a list of values.
    From: http://code.activestate.com/recipes/511478/

    @parameter N - is a list of values. Note N MUST BE already sorted.
    @parameter percent - a float value from 0.0 to 1.0.
    @parameter key - optional key function to compute value from each element of N.

    @return - the percentile of the values
    """
    if not N:
        return None
    k = (len(N) - 1) * percent
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return key(N[int(k)])
    d0 = key(N[int(f)]) * (c - k)
    d1 = key(N[int(c)]) * (k - f)
    return d0 + d1


# Connect to the local Mongo server
try:
    client = pymongo.MongoClient('localhost', 27017, serverSelectionTimeoutMS=100)
    client.admin.command('ismaster')  # Test command to see if we can connect

    # If we can conenct, reset client to defaults
    print("Successfully connected to MongoDB...")
    client = pymongo.MongoClient('localhost', 27017)
except pymongo.errors.ConnectionFailure:
    sys.exit("ERROR: Could not connect to database, are you sure 'mongod' is running?")

# Create 'masters' database
if 'masters' not in client.database_names():
    print("Database 'masters' was not found, creating...")
else:
    print("Found database 'masters'...")
db = client['masters']

# Import NSR data
if 'NSR' not in db.collection_names():
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
        subprocess.call(["mongoimport", "--db", "masters", "--collection", "NSR",
                         "--type", "json", "--file", "NSR.json"])
    else:
        sys.exit("ERROR: Could not find data files NSR.json or mastersNSRDataDump.tbz2")
print("Found NSR collection...")

# Create collection authorSummary
if 'authorSummary' not in db.collection_names():
    print("Collection authorSummary not found, creating...")
    db.NSR.aggregate([
        {"$project": {"_id": 1, "copyauthors": "$authors", "authors": 1, "year": 1}},
        {"$unwind": "$authors"},
        {"$unwind": "$copyauthors"},
        {"$group": {"_id": "$authors", "coauthors": {"$addToSet": "$copyauthors"},
                    "years": {"$addToSet": "$year"}, "papers": {"$addToSet": "$_id"}}},
        {"$out": "authorSummary"}
    ], allowDiskUse=True)

# Create collection authorSummaryByYear
if 'authorSummaryByYear' not in db.collection_names():
    print("Collection authorSummaryByYear not found, creating...")
    db.NSR.aggregate([
        {"$project": {"_id": 1, "copyauthors": "$authors", "authors": 1, "year": 1}},
        {"$unwind": "$authors"},
        {"$unwind": "$copyauthors"},
        {"$group": {"_id": {"author": "$authors", "year": "$year"}, "coauthors": {
            "$addToSet": "$copyauthors"}, "papers": {"$addToSet": "$_id"}}},
        {"$out": "authorSummaryByYear"}
    ], allowDiskUse=True)


# Generate authorSummary tsv for clustering
if not os.path.exists('author-cluster-input.tsv'):
    print("Aggregating authorSummary data...")
    authorSummary_pipeline = [
        {"$project": {"_id": 0, "author": "$_id", "numCoauthors": {"$size": "$coauthors"},
                      "numYears": {"$size": "$years"}, "numEntries": {"$size": "$papers"}}}
    ]
    results = db.authorSummary.aggregate(authorSummary_pipeline, allowDiskUse=True)
    with open('author-cluster-input.tsv', 'w', newline='') as tsvfile:
        print("Writing authorSummary data to file...")
        cluster_writer = csv.writer(tsvfile, delimiter='\t')
        cluster_writer.writerow(["author", "numCoauthors", "numYears", "numEntries"])
        for document in results:
            cluster_list = [document['author']]
            cluster_list.append(document['numCoauthors'])
            cluster_list.append(document['numYears'])
            cluster_list.append(document['numEntries'])
            cluster_writer.writerow(cluster_list)


# Generate authorSummaryByYear tsv for clustering
if not os.path.exists('author-cluster-entry-quartiles-input.tsv'):
    print("Aggregating authorSummaryByYear data...")
    authorSummaryByYear_pipeline = [
        {"$group": {"_id": "$_id.author", "yearData": { "$push":
            {"year": "$_id.year", "numCoauthors": {"$size": "$coauthors"}, "numEntries": {"$size": "$papers"}}}}},
        {"$project": {"author": "$_id", "yearData": 1, "numYears": {"$size": "$yearData"}}}
    ]
    results = db.authorSummaryByYear.aggregate(authorSummaryByYear_pipeline, allowDiskUse=True)
    with open('author-cluster-entry-quartiles-input.tsv', 'w', newline='') as tsvfile:
        print("Writing authorSummaryByYear data to file...")
        cluster_writer = csv.writer(tsvfile, delimiter='\t')
        cluster_writer.writerow(["author", "careerLength", "meanCoauthors",
                                 "numEntries", "numEntries033", "numEntries066", "numEntries100"])
        for document in results:
            years = []
            entries = []
            coauthors = []
            for yearDatum in document['yearData']:
                years.append(yearDatum['year'])
                coauthors.append(yearDatum['numCoauthors'])
                entries.append(yearDatum['numEntries'])
            assert int(len(years)) == int(document['numYears']), "len(years) should be equal to numYears"
            if sum(entries) <= 10: continue
            years, entries = zip(*sorted(zip(years,entries), key=lambda x: x[0]))
            sumEntries = [entries[years.index(t)] if t in years else 0 for t in range(min(years), max(years)+1)]
            assert len(sumEntries) == max(years)-min(years)+1
            for i, entry in enumerate(sumEntries):
                if i >= 1:
                    sumEntries[i] = sumEntries[i] + sumEntries[i - 1]
            assert sumEntries[-1] == sum(entries), "sumEntries[-1] should be equal to sum(entries)"
            numEntries033 = percentile(sumEntries, 0.33)
            numEntries066 = percentile(sumEntries, 0.66) - numEntries033
            numEntries100 = sumEntries[-1] - numEntries066 - numEntries033
            cluster_list = [document['author']]
            cluster_list.append(max(years) - min(years)+1)
            cluster_list.append(statistics.mean(coauthors))
            cluster_list.append(sumEntries[-1])
            cluster_list.append(numEntries033 / sumEntries[-1])
            cluster_list.append(numEntries066 / sumEntries[-1])
            cluster_list.append(numEntries100 / sumEntries[-1])
            cluster_writer.writerow(cluster_list)

# Generate paper -> author transactions tsv
if not os.path.exists('transactions-papers-authors.tsv'):
    print("Generating papers -> authors transaction tsv files for association rule learning...")
    pipeline = [
        {"$match": {"authors": {"$exists": True}}},
        {"$project": {"_id": 0, "authors": "$authors"}}
    ]
    results = db.NSR.aggregate(pipeline, allowDiskUse=True)
    with open('transactions-papers-authors.tsv', 'w', newline='') as tsvfile:
        transaction_writer = csv.writer(tsvfile, delimiter='\t')
        for document in results:
            transaction_writer.writerow(document['authors'])

# Generate papers -> selectors transactions tsv
if not os.path.exists('transactions-papers-selectors.tsv'):
    print("Generating papers -> selectors transaction tsv files for association rule learning...")
    pipeline = [
        {"$match": {"selectors": {"$exists": True}}},
        {"$project": {"_id": 0, "selectors": 1}}
    ]
    results = db.NSR.aggregate(pipeline, allowDiskUse=True)
    with open('transactions-papers-selectors.tsv', 'w', newline='') as tsvfile:
        transaction_writer = csv.writer(tsvfile, delimiter='\t')
        for document in results:
            selector_list = [s['type'] + " " + s['value'] for s in document['selectors']]
            transaction_writer.writerow(selector_list)

# Generate selectors -> authors transactions tsv
if not os.path.exists('transactions-selectors-authors-set.tsv'):
    print("Generating selectors -> authors transaction tsv files for association rule learning...")
    pipeline = [
        {"$match": {"selectors": {"$exists": True}}},
        {"$unwind": "$selectors"},
        {"$unwind": "$authors"},
        {"$group": {"_id": "$selectors", "authors": {"$addToSet": "$authors"}}},
        {"$project": {"_id": 0, "authors": "$authors"}}
    ]
    results = db.NSR.aggregate(pipeline, allowDiskUse=True)
    with open('transactions-selectors-authors-set.tsv', 'w', newline='') as tsvfile:
        transaction_writer = csv.writer(tsvfile, delimiter='\t')
        for document in results:
            transaction_writer.writerow(document['authors'])
