# This script uses apriori algorithm from arules package to calculate association rules.
# The resulting rules are then pruned for duplicates and written to a file.

# Parse commandline arguments
args<-commandArgs(TRUE)
if(length(args)<4) {
    stop("Expected format: Rscript <inputfile.tsv> <outputfile.tsv> <support> <confidence>")
}
inputFile = args[1]
outputFile = args[2]
supportParam = as.numeric(args[3])
confParam = as.numeric(args[4])

# Import arules library
# http://cran.r-project.org/web/packages/arules/index.html
if (!require("arules"))
{
  install.packages("arules", dep=TRUE, repos="http://mirror.its.dal.ca/cran/")
    if(!require("arules")) stop("Package not found")
}
library("arules")

# TODO error checking on provided arguments

# Read input file into transaction object
writeLines("Reading in transaction file...")
transactions = read.transactions(file=inputFile, format="basket", sep="\t", rm.duplicates=TRUE)
writeLines("Read transaction file. Dimensions:")
dim(transactions)


# Run apriori on transactions with provided support and confidence parameters
writeLines("Calculating association rules...")
rules = apriori(data=transactions, parameter=list(support=supportParam, conf=confParam))

# Remove duplicate rules
writeLines("Sorting rules...")
rules.sorted = sort(rules, by="lift")
writeLines("Pruning rules...")
rules.set = is.subset(rules.sorted, rules.sorted)
rules.set[lower.tri(rules.set, diag=TRUE)] <- NA
redundant = colSums(rules.set, na.rm=TRUE) >= 1
rules.pruned = rules.sorted[!redundant]

# Write the prunned rules to a file
writeLines("Writing rules to file...")
write(rules.pruned, file=outputFile, quote=FALSE, sep = "\t", col.names = NA)
