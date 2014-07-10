#Should improve imports for speed
import numpy
import pymongo
import pylab as pl

from sklearn.feature_extraction import DictVectorizer
from sklearn.decomposition import PCA
from sklearn import cluster

#Connect to MongoDB and get data to cluster
c = pymongo.Connection("localhost")
collection = c.masters.cluster1

#The find filter should be as follows:
#{"type": 1, "physics": 1, "reactions": 1, "_id": 0, "moments": 1, "year": 1, "masses": 1, "structure": 1, "compilation": 1, "radioactivity": 1}
clusterCursor = collection.find({},{"type": 1, "physics": 1, "reactions": 1, "_id": 0, "moments": 1, "masses": 1, "structure": 1, "compilation": 1, "radioactivity": 1})

#Feature Extraction with sklearn on MongoDB cursor
#http://scikit-learn.org/stable/modules/feature_extraction.html
#vec.fit_transform returns sparse data, we use toarray() to convert to dense.
vec = DictVectorizer(dtype=int)
denseData = vec.fit_transform(clusterCursor).toarray()

#Decompisition
pca = PCA(n_components=2)
pca.fit(denseData)
reducedData = pca.transform(denseData)

#Clustering
k_means = cluster.KMeans(n_clusters=3)
k_means.fit(denseData)

#Plotting
pl.scatter(reducedData[:, 0], reducedData[:, 1], c=k_means.predict(denseData))
pl.show()
