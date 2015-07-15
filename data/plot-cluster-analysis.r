# Get ggplot2, and RColorBrewer libraries
# http://cran.r-project.org/web/packages/ggplot2/index.html
# http://cran.r-project.org/web/packages/RColorBrewer/index.html
if (!require("ggplot2"))
{
  install.packages("ggplot2", dep=TRUE, repos="http://mirror.its.dal.ca/cran/")
    if(!require("ggplot2")) stop("Package not found")
}
if (!require("RColorBrewer"))
{
  install.packages("RColorBrewer", dep=TRUE, repos="http://mirror.its.dal.ca/cran/")
    if(!require("RColorBrewer")) stop("Package not found")
}
library("ggplot2")
library("RColorBrewer")


data = read.csv(file="author-cluster-input.tsv", sep='\t', header=TRUE, row.names=1)


# Plot heat maps
rf = colorRampPalette(rev(brewer.pal(11,'Spectral')))
r = rf(32)

nyne = ggplot(data, aes(numYears,numEntries))
png("images/nyne-heatmap.png", width=800, height=800)
nyne + stat_bin2d(bins=50) +  scale_fill_gradientn(colours=r, trans="log")

nync = ggplot(data, aes(numYears,numCoauthors))
png("images/nync-heatmap.png", width=800, height=800)
nync + stat_bin2d(bins=50) +  scale_fill_gradientn(colours=r, trans="log")

nenc = ggplot(data, aes(numEntries,numCoauthors))
png("images/nenc-heatmap.png", width=800, height=800)
nenc + stat_bin2d(bins=50) +  scale_fill_gradientn(colours=r, trans="log")


# Plot Cluster Images
data = read.csv("results/cluster-analysis.csv", header=FALSE)
x = data[,1]

png("results/totss-many-clusters.png", width=800, height=800)
plot(x, data[,2], main="Kmeans Total Sum of Squares", xlab="Number of clusters", ylab="km$totss")

png("results/withinss-many-clusters.png", width=800, height=800)
plot(x, data[,3], main="Kmeans Total Within Cluster Sum of Squares", xlab="Number of clusters", ylab="km$tot.withinss")

png("results/dbi-many-clusters.png", width=800, height=800)
plot(x, data[,5], main="Davies Bouldin Index", xlab="Number of clusters", ylab="D.B. Index")

png("results/g1-many-clusters.png", width=800, height=800)
plot(x, data[,6], main="G1 Index", xlab="Number of clusters", ylab="G1 Index")
