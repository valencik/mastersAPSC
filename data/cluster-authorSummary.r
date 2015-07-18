# This script cluster the author summary data with kmeans
# Statistics are also recorded using the clusterSim package

# Parse commandline arguments
args<-commandArgs(TRUE)
if(length(args)<3) {
    stop("Expected format: Rscript <inputfile.tsv> <min#clusters> <max#clusters>")
}
inputFile = args[1]
numCentersMin = as.numeric(args[2])
numCentersMax = as.numeric(args[3])
if (numCentersMin > numCentersMax) {
    stop("The minimum number of cluster centers must be less or equal to the maximum")
}
outDir = "results/"

# Import clusterSim library
# http://cran.r-project.org/web/packages/arules/index.html
if (!require("clusterSim"))
{
  install.packages("clusterSim", dep=TRUE, repos="http://mirror.its.dal.ca/cran/")
    if(!require("clusterSim")) stop("Package not found")
}
library("clusterSim")


# Read input file into transaction object
writeLines("Reading in data file...")
# Read input file into data frame
data=read.table(inputFile, header=TRUE, sep='\t', row.names=1, quote="")
col=ncol(data)

# Cluster data using K-Means
writeLines("Starting K-Means...")
for (numCenters in numCentersMin:numCentersMax) {
    if (numCenters == numCentersMin){
        analysisAppend = FALSE
    } else {
        analysisAppend = TRUE
    }

    writeLines("Clustering...")
    km = kmeans(x=data, centers=numCenters, iter.max=1000, nstart=20)
    
    # Calculate various cluster analysis measurements from clusterSim
    writeLines("Starting DB analysis with clusterSim...")
    dbi = index.DB(data, km$cluster, centrotypes="centroids", p=2, q=2)
    writeLines("Starting G1 analysis with clusterSim...")
    g1i = index.G1(data, km$cluster, centrotypes="centroids")

    # Record cluster analysis measurements to file
    writeLines("Recording clustering results to file...")
    clusterIndexes = rbind(numCenters, km$betweenss, km$tot.withinss, km$totss, dbi$DB, g1i)
    write(clusterIndexes, file=paste0(outDir, "cluster-analysis.csv"), append=analysisAppend, ncolumns=6, sep=',')

    # Write cluster centers to a file
    write(t(km$centers), file=paste0(outDir, numCenters,"cluster-centers.csv"), ncolumns=col, sep=',')
    
    # Write cluster membership to a file
    write(t(cbind(array(row.names(data)),km$cluster)), file=paste0(outDir, numCenters,"cluster-memberships.csv"), ncolumns=2, sep=',')
    
    # Write the sizes of the clusters to a file
    write((km$size), file=paste0(outDir, numCenters,"cluster-sizes.csv"), ncolumns=numCenters, sep=',')

    # Some plotting
    png(filename=paste0("images/", numCenters, "clusters.png"), width=1200, height=1200)
    plot(data, col=km$cluster)
}
