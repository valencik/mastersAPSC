import pymongo
import sys
import statistics
import math
import functools
from collections import defaultdict
from gensim import corpora, models, similarities


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
    sys.exit("ERROR: Database 'masters' was not found. Inspect database and run 'prepare-data.py' if needed.")
else:
    print("Found database 'masters'...")
db = client['masters']


# Get the selectors for all papers
selectors_pipeline = [
        {"$match": {"selectors": {"$exists": True}, "year": {"$gt": 1985}}},
        {"$project": {"_id":1, "selectors":1}}
]
results = db.NSR.aggregate(selectors_pipeline, allowDiskUse=True)

# Build the corpus
corpus = []
keynum_list = []
for document in results:
    vec = []
    for selector in document['selectors']:
        if selector['value'] != "OTHER":
            #vec.append((selector['type'], selector['value']))
            vec.append(selector['type'] + " " + selector['value'])
    keynum_list.append(document['_id'])
    corpus.append(vec)

# Trim the corpus
frequency = defaultdict(int)
for selector_list in corpus:
    for token in selector_list:
        frequency[token] += 1
corpus = [[token for token in selector_list if frequency[token] > 1]
         for selector_list in corpus]

# Make a corpura dictionary
dictionary = corpora.Dictionary(corpus)
dictionary.save('selector-corpus.dict') # store the dictionary, for future reference

sparse_vectors = [dictionary.doc2bow(selector_list) for selector_list in corpus]
corpora.MmCorpus.serialize('selector-sparse-vectors.mm', sparse_vectors) # store to disk, for later use

# Initialize a transform
tfidf = models.TfidfModel(sparse_vectors)
index = similarities.Similarity('./', sparse_vectors, num_features=23704)
index.num_best = 8

sims = index[tfidf[dictionary.doc2bow(corpus[3])]]
print(keynum_list[3] + "  " + str(corpus[3]) + " <-- query")
for i,x in iter(sims):
    print(keynum_list[i] + "  " + str(corpus[i]) + " " + str(x))

#db.authorSummary.update_one({"_id": author},{"$set": {"cluster": cluster_membership}})
