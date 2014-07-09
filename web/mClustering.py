import numpy
import pymongo
import pylab as pl

from sklearn.feature_extraction import DictVectorizer
from sklearn.decomposition import PCA

#Connect to MongoDB and get data to cluster
c = pymongo.Connection("localhost")
collection = c.masters.cluster1

#The find filter should be as follows:
#{"type": 1, "physics": 1, "reactions": 1, "_id": 0, "moments": 1, "year": 1, "masses": 1, "structure": 1, "compilation": 1, "radioactivity": 1}
clusterCursor = collection.find({},{"type": 1, "physics": 1, "reactions": 1, "_id": 0, "moments": 1, "masses": 1, "structure": 1, "compilation": 1, "radioactivity": 1})

#Feature Extraction with sklearn
#http://scikit-learn.org/stable/modules/feature_extraction.html
vec = DictVectorizer(dtype=int)

cdata = vec.fit_transform(clusterCursor).toarray()

#decompisition
pca = PCA(n_components=2)
pca.fit(cdata)
x = pca.transform(cdata)
pl.scatter(x[:, 0], x[:, 1])

pl.show()
