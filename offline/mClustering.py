#TODO Import only the minimum modules necessary
import numpy
import pymongo
#import pylab as pl
import matplotlib
import matplotlib.pyplot as pl

from sklearn.feature_extraction import DictVectorizer
from sklearn.decomposition import PCA
from sklearn import cluster

#Connect to MongoDB and get data to cluster
c = pymongo.Connection("localhost")
collection = c.masters.j11clusterB
clusterCursor = collection.find({},{"_id": 0})

#Feature Extraction with sklearn on MongoDB cursor
#http://scikit-learn.org/stable/modules/feature_extraction.html
vec = DictVectorizer(dtype=int)
#We use toarray() to convert sparse data to dense.
denseData = vec.fit_transform(clusterCursor).toarray()

#Output some data attributes
print("Retrieved", denseData.shape[0], "elements.")
print("Data has", denseData.shape[1], "dimensions")

##Decompisition
#pca = PCA(n_components=2)
#pca.fit(denseData)
#reducedData = pca.transform(denseData)

##Clustering
#k_means = cluster.KMeans(n_clusters=3)
#k_means.fit(denseData)

#Plotting

##Plot clusters in reduced dimensionality
#pl.scatter(reducedData[:, 0], reducedData[:, 1], c=k_means.predict(denseData))

##Plot number of authors per year
#pl.scatter(denseData[:, 9], denseData[:, 0], c=k_means.predict(denseData))
#pl.show()

#Build Coincidence Matrix coinMat
cmat = denseData[:,1:7]
cdim = numpy.shape(cmat)[1]
coinMat = numpy.zeros(shape=(cdim,cdim), dtype=numpy.int)
clarge = []
print("Made coincidence matrix with", cdim, "rows and columns")

#Read through data and check for coincidences
for row in cmat:
    rowSum = row.sum()
#    if rowSum == 1:
#        i1 = numpy.where(row==1)[0][0]
#        i2 = i1
#        coinMat[i1][i2] += 1
    if rowSum == 2:
        i1, i2 = numpy.where(row==1)[0]
        coinMat[i1][i2] += 1
#        coinMat[i2][i1] += 1
    if rowSum >= 3:
        clarge.append(row)

#Construct plots
labels = ['compilation', 'masses', 'moments', 'physics', 'radioactivity', 'reactions', 'structure']

fig = pl.figure()
ax = fig.add_subplot(111)
#Override matplotlib normalization function to use log colours.
cax = ax.matshow(coinMat, cmap=pl.cm.Spectral_r, norm=matplotlib.colors.LogNorm())
fig.colorbar(cax)

ax.set_xticklabels(['']+labels)
ax.set_yticklabels(['']+labels)
pl.title('Coincidence Matrix for Keyword Abstracts')
pl.show()
