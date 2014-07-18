#TODO Import only the minimum modules necessary
import numpy
import pymongo
import pylab as pl

from sklearn.feature_extraction import DictVectorizer
from sklearn.decomposition import PCA
from sklearn import cluster

#Connect to MongoDB and get data to cluster
c = pymongo.Connection("localhost")
collection = c.masters.j11clusterNorm
clusterCursor = collection.find({},{"_id": 0})

#Feature Extraction with sklearn on MongoDB cursor
#http://scikit-learn.org/stable/modules/feature_extraction.html
#vec.fit_transform returns sparse data, we use toarray() to convert to dense.
#vec = DictVectorizer(dtype=int)
vec = DictVectorizer()
denseData = vec.fit_transform(clusterCursor).toarray()

#Output some data attributes
print("Retrieved", denseData.shape[0], "elements.")
print("Data has", denseData.shape[1], "dimensions")

##Decompisition
#pca = PCA(n_components=2)
#pca.fit(denseData)
#reducedData = pca.transform(denseData)

#Clustering
k_means = cluster.KMeans(n_clusters=3)
k_means.fit(denseData)

#Plotting

##Plot clusters in reduced dimensionality
#pl.scatter(reducedData[:, 0], reducedData[:, 1], c=k_means.predict(denseData))

##Plot number of authors per year
#pl.scatter(denseData[:, 9], denseData[:, 0], c=k_means.predict(denseData))
#pl.show()


#coincidence testing
cmat = numpy.array([[0, 0, 0, 1], [0, 0, 1, 0], [0, 0, 1, 1], [0, 1, 0, 0], [0, 1, 0, 1]])
cdim = numpy.shape(cmat)[1]
print("Making coincidence matrix with", cdim, "rows")
coinMat = numpy.zeros(shape=(cdim,cdim), dtype=numpy.int)

for row in cmat:
    if row.sum() == 1:
        i1 = numpy.where(row==1)[0][0]
        i2 = i1
        #print("i1:", i1, " i2:", i2)
        coinMat[i1][i2] += 1
    if row.sum() == 2:
        i1, i2 = numpy.where(row==1)[0]
        #print("i1:", i1, " i2:", i2)
        coinMat[i1][i2] += 1
        coinMat[i2][i1] += 1

print("Original Matrix (cmat)")
print(cmat)
print("Coincidence Matrix")
print(coinMat)

pl.matshow(coinMat, fignum=1, cmap=pl.cm.gray)
pl.show()
