#Thesis

##System analysis
>Description of the application domain, existing tools, and functional analysis of a comprehensive application that will be helpful to the physicists.

The NNDC maintains the [NSR website](http://www.nndc.bnl.gov/nsr/) with simple search features.
They offer a quick search, and searching via text, keynumber, and various indexed key fields.
Each search function is hidden in either a separate interface or a drop down menu.


##Application
>Designing an interface for such an application

The proposed application attempts to unify the various search functions into a single web app interface.
Furthermore the app presents new types of analysis for the user.

## Algorithmic development
Starting with some of the naive algorithms, and then going to graph theory. A review of graph theoretic concepts and piecing them together for the application on hand.

##Implementation
Various technologies used. Advantages and disadvantages of these technologies and justification of final choices.

##Demonstration
Demonstration of the application. How everything that was promised is delivered. If certain things could not be delivered, why not.

##Results
How the application uncovers some of the previously unknown and interesting results.

## NodeJS demo
summary homepage "I won't focus much on this today"
`collab:1946`
`collab:1946 labels:1`
`collab:1946 labels:1 authormin:1`
This trims of lonesome authors sufficiently, however it does not scale well.
Consider the path-graphs with two vertices, if I felt they were not particularly informative I might want to remove them with authormin:2
`collab:1946 labels:1 authormin:2`
However, in the process I lose ALL path graphs, even the 4 vertice, 'Bohr, Hole, Siegbahn, Petersson'
The [code to do this is quite simple](https://github.com/valencik/mastersAPSC/blob/6eb34dfb20a4d0eed6e1513f8265585911f82c8c/web/src/main.js#L306) and that is basically the problem.
With this code base I am not really dealing with graph data structures.

## Python code switch
On that note, in the last week I have rewritten a huge portion of my code so that it can use many existing graph libraries.
This might seem drastic but I believe it is already paying for itself in what it offers.
So let's look at another year, say 1955. There is one large graph and many smaller ones.
`collab:1955`
With the new code, that actually understands graph data structures I can apply more intelligent filters like grabbing just the largest subgraph.
`collab:1955 topnetwork:1`
It is important to note that this change in approach is much more than just making neat visualizations.
It is actually crucial for analysis.
I've turned a chunk of my data problems into graph problems now, and as a result I can apply decades worth of graph theory to my data.

#Tools
An overview of tools and their uses.
 
## Gephi
- Gephi analysis, modularity, average shortest path

## ipython notebook
- Filtering sub graphs
- Histogram of sub graph sizes


# Annotated Bibliography
50 years of kmeans
###Facebook paper
A good overview of the process

Medical clusters and MDS paper
