import pymongo
import sys
import csv
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
        {"$match": {"selectors": {"$exists": True}}},
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
index = similarities.Similarity('./', sparse_vectors, num_features=len(frequency))
index.num_best = 20

#with open('similar-papers-cosine-selectors.tsv', 'w', newline='') as tsvfile:
#    print("Writing similar papers data to file...")
#    sim_writer = csv.writer(tsvfile, delimiter='\t')
#    for i,paper in enumerate(corpus):
#        sims = index[tfidf[dictionary.doc2bow(corpus[i])]]
#        sim_list = [keynum_list[hisim[0]] for hisim in sims if hisim[1] > 0.65]
#        sim_list.insert(0, keynum_list[i])
#        sim_writer.writerow(sim_list)

for i,paper in enumerate(corpus):
    sims = index[tfidf[dictionary.doc2bow(corpus[i])]]
    sim_list = [{"paper": keynum_list[hisim[0]], "score": hisim[1]} for hisim in sims if hisim[1] > 0.65 and hisim[0] != i]
    db.simNSR.update_one({"_id": keynum_list[i]},{"$set": {"simPapers": sim_list}})
