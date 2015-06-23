Thesis Introduction
===================

The introduction will be written later.

System analysis
===============
> Description of the application domain, existing tools, and functional analysis of a comprehensive application that will be helpful to the physicists.

The NNDC maintains the [NSR website](http://www.nndc.bnl.gov/nsr/) with simple search features.
They offer a quick search, and searching via text, keynumber, and various indexed key fields.
Each search function is hidden in either a separate interface or a drop down menu.


Research Proposal
=================
> Examining the usage of the previously written research proposal.

The proposal was written when I thought the majority of my contribution would be analysis (not application development).
Analysis discussion from the proposal could be useful in the demonstration section of the thesis.
The 'Data Preparation' subsection of Methodology is still applicable.
However, it is rather brief and could be expanded to include discussion.
Cluster analysis is still useful in author fingerprinting discussion.


Application
===========
> Designing an interface for such an application

The proposed application attempts to unify the various search functions into a single web app interface.
Furthermore the app presents new types of analysis for the user.

Perhaps write this after the demonstration section. (We build/propose the tool that does the things demonstrated.)


Algorithmic development
=======================
> Introduce and discuss the algorithms used in various application features

Starting with some of the naive algorithms, and then going to graph theory.
A review of graph theoretic concepts and piecing them together for the application on hand.

## The Data and Database
The data from the NSR is in a custom format.
I developed a schema that would work well with the queries in mind and the MongoDB database software.
The data needed to be cleaned and transformed into the desired scheme before being imported into MongoDB.

With the data representation complete and the data formatted correctly and imported to MongoDB, we can consider the database operations.
The most common operation will be some sort of search or lookup.
To optimize this process we instruct MongoDB to index our data on various fields.
Indexing speeds up search queries in a manner similar to sorting a series of data elements.
MongoDB allows for many different types of indexes.
We create a single field indexes on the id, year, authors, selectors type, selectors value, and type fields.
This enables very fast lookups for documents according to the indexed fields.
For example it would be very quick to find all the documents with type 'Journal' and year '1983'.
Where as the search for all documents with keyword "fisson" has not been optimized by the previously mentioned indexes.

We can create an index of the document years at the mongo shell with the following command:
```javascipt
db.NSR.createIndex({year: 1})
```

Since our author field is really an array of string elements, we can use a single field index on it without issue.
However, on field like the title or keywords a single field index will fall short of helping us find partial matches.
For example, searching for documents with the word "neutron" in the title will not be sped up by a single field index.
For this task we leverage MongoDB's text indexes.


Implementation
==============
> Introduce and discuss the various technologies used.

Advantages and disadvantages of these technologies and justification of final choices.
- Perl parsing, regular expressions and speed
- MongoDB, schema and aggregation framework
- Gephi analysis, modularity, average shortest path

## Python

Python has a strong following and support in the scientific community.
There are numerous scientific libraries that are freely available and easy to setup.
So while python may not be the obvious choice for a web application today, its abundance of available libraries pays off quickly.

[Flask](http://flask.pocoo.org) a small web framework used to power the web application.


Demonstration
=============
> Demonstrate how the application can be used to perform analysis of the NSR.

Demonstration of the application.
How everything that was promised is delivered.
If certain things could not be delivered, why not.
Discrete list of features I want to advertise to users.
A use case of answering a question with this tool.
Additionally, it might be useful to show that this is more difficult using the old NSR website.

## Author Fingerprinting
Author search has been improved by implementing a suggestion system for partial author name searches.
When we search for "Svenne" we can see there are both J.P.Svenne and J.Svenne.
In the original NSR application it would be a manual task to discern the two author names.
Our improvement is to add an author clustering scheme that show's us the similarity of authors.
Here we can see that JP Svenne and J Svenne are likely to be the same author.
> Also use "Austin" S.M.Austin, Sam.Austin
When a similarity measure is above a certain threshold the matching grouping of authors is automatic.

This similarlity measurement could happen either online (immediately after the user submits a query) or offline (before the app is presented to users).
Because our database is static and manually updated with new entries periodically, the offline approach makes sense.
And additional benefit to the offline approach is that it can be easily moderated and tweaked with user submitted suggestions.
A possible example being an author name misspelling that only happen once. (not enough times to measure similarity against)

### Author Fingerprinting - implementation notes
build collection of all unique author names (101095)
calculate the edit distances of all the author names (more than 5 billion calculations...)
There are 41254 "authors" that appear once

## Similar "Objects"
Is the process of finding similar authors different enough from the process of finding similar papers to warrant separate treatment?
This could be somewhat related to the author fingerprinting, in terms of implementation details

This is a task where we want the analysis done offline, and just simple lookups done when the app is being used.
I need to come up with a metric for simularity for these documents/objects.
Similar authors could be authors who publish together, but should certainly include authors who do not publish together but publish with similar keywords.
This is likely more interesting to users, as it could suggest similar authors they are unaware of.
It would also be neat to see how time affects this.
Was there a similar author 20 years prior?

Spoke to Pawan about this, he suggests it can be done quite easily with association mining.
So the work ahead would likely be to perform association mining on the entire dataset offline and then construct an API in the web application to connect user input to the results of the mining.

An easy first approach could be to use Apriori on authors and selector values (essentially isotopes)

I have used the apriori algorithm on selector.values.
I think the results are not that valuable.
They are really just descirbing which selector values appear often together in the same paper, and that is not particularly illuminating domain knowledge.

### Running Apriori on Selector Values or Authors
As a preliminary test with association rule learning, we prepare our data for use with the Apriori algorithm in the *arules* package in R.
It is pretty easily to flatten our data as needed using the MongoDB aggregation framework.
Getting the data for finding association rules among the authors is rather trivial and involves only a $project stage to simplify the documents to only include the fields we want.
Because the R packages for interacting with mongo are not official, we made a new collection of the data we wanted to analyze and then exported that to csv.
And in fact, because our data fields contain commas, we massage this csv data into tab separated values, tsv.


## Time series visualizations
How does an "object" evolve over time?
This could be an author, keyword, group of authors, etc.

## Network visualization and exploration
Treating the data as a network or graph is unique to our application.
This is a feature that warrants a lot of attention.

## Simplified, unified search
The present interface requires the specification of types of searches, we can infer this.
If the user typed an author's name, then we can search for papers of that author.
Similarly if the user typed a keyword or phrase like "nuclear halo" we can search for papers involving that keyword.
> Check how possible this is currently!

## Data exporting?
Being able to save the current visualizations, graph data structures, or flat csv data could be of use.
> Check how possible this is currently!


Miscellaneous
=============
> A section for all the lonely topics out there.

## Future work?
Does it make sense to think about a future work section now?
If yes:

- Time series profile clustering. Show me other objects that evolved like this one.
- Chart of nuclides, table of elements visualizations
- Research predictions, suggestions
- Author/Group/Journal profiling (innovative, follower, prolific...)

## Contributions

- Data parsing and cleaning
- Visualization and summarization
- Exploration


Results
=======
> Conclude with discussion of contributions.

How the application uncovers some of the previously unknown and interesting results.



Annotated Bibliography
======================

- 50 years of kmeans

- Facebook paper
A good overview of the process

- Medical clusters and MDS paper



References to Investigate
=========================

[Graph Node Similarity](http://argo.matf.bg.ac.rs/publications/2011/similarity.pdf)
