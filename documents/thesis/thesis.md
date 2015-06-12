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



Miscellaneous
=============
> A section for all the lonely topics out there.


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
