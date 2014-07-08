import numpy
import pymongo

c = pymongo.Connection("localhost")
cluster = c.masters.cluster1
num = cluster.count()
arrays = numpy.empty((num, len(headers)), dtype=int) 

for i, record in enumerate(cluster.find()):
    for x in range(len(headers)):
        arrays[i][x] = record[headers[x]]

for array in arrays: # prove that we did something...
    print(numpy.mean(array))

