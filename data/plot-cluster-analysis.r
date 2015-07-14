data = read.csv("results/cluster-analysis.csv", header=FALSE)
x = data[,1]

png("results/totss-many-clusters.png", width=800, height=800)
plot(x, data[,2], main="Kmeans Total Sum of Squares", xlab="Number of clusters", ylab="km$totss")
dev.off()

png("results/withinss-many-clusters.png", width=800, height=800)
plot(x, data[,3], main="Kmeans Total Within Cluster Sum of Squares", xlab="Number of clusters", ylab="km$tot.withinss")
dev.off()

png("results/betweenss-many-clusters.png", width=800, height=800)
plot(x, data[,4], main="Kmeans Between Sum of Squares", xlab="Number of clusters", ylab="km$betweenss")
dev.off()

png("results/dbi-many-clusters.png", width=800, height=800)
plot(x, data[,5], main="Davies Bouldin Index", xlab="Number of clusters", ylab="D.B. Index")
dev.off()

png("results/g1-many-clusters.png", width=800, height=800)
plot(x, data[,6], main="G1 Index", xlab="Number of clusters", ylab="G1 Index")
dev.off()
