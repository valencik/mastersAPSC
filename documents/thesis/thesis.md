%- TODO Fix citations
%- TODO Add equation numbers, figure number (pandoc filters)
%- TODO Make double spaced, set margins somewhere
%- Text mining?
---
title:  'Masters of Science in Applied Science Thesis'
author:
- name: Andrew Valencik
  affiliation: Saint Mary\'s University
author: Andrew Valencik
date: July 15th 2015
bibliography: bibliography.yaml
csl: american-physics-society.csl
link-citations: true
...

\listoflistings


Thesis Introduction
===================

%- The problem and its setting
%- Proposed methodology to solve problem
The National Nuclear Data Center prepares an evaluated database of nuclear science literature that poses a rich opportunity for knowledge discovery directed at the scientific work and study.
Identifying trends and patterns in the meta data of over 200,000 documents may reveal latent structures of the progress and collaboration among the scientific community.
The knowledge discovery and data mining process should reveal trends in the collective scientific study of nuclear structure, processes, and detection.
Additionally, categorizing trends may provide predictive power in determining a worthwhile area of study or application of a technique.
The analysis outcomes of studying literature meta data may provide useful when analyzing bodies of work from other disciplines.
This knowledge may have implications in other similar scientific fields.
%- We are building an application for users to use
The ultimate goal is to enable further analysis on the body of nuclear science literature.

%- Define research setting and sum-up what has been done
%- Point towards what should be done, why?
%- What is the problem? What will I study?
The academic field of nuclear science is over one hundred years old, starting with the discovery of radiation.
This discovery is the first of many entries in the Nuclear Science References database, collected, cataloged, distributed, and evaluated by the National Nuclear Data Center. [@Kurgan200603]
%- TODO this ending is insufficient
The NSR has over 210,000 entries documenting the body of nuclear science literature, which provides the opportunity for knowledge discovery on the literature's meta data.


%- What do we know already?
%- How will this advance our knowledge?
%- Explain your choice of model. Advantages? Suitability from theoretical point of view? practical reasons for using it?
%- Significance, timeliness, and importance of project.
Information retrieval has been repeatedly improved by large search engines like Google.
And while nuclear science literature is a specialized field, Google Scholar is capable of searching many peer reviewed journal articles.
The NSR provides meta data that can be converted to semantic information for advanced querying capabilities.
This work is a cross disciplinary work, combining data mining technique with domain knowledge in nuclear physics.


System Analysis
===============
> Description of the application domain, existing tools, and functional analysis of a comprehensive application that will be helpful to the physicists.
%- Get some screenshots of the NSR website. (automate?)
%- Does the NSR website offer visualizations?
%- Easy method of exporting data?
%- Links to papers? Yes, DOI when available.
%- How capable is it as a tool to explore further work?

%- Introduction to NSR data?

## The Nuclear Science References Website
The NNDC maintains the [NSR website](http://www.nndc.bnl.gov/nsr/) which serves a simple interface to the Nuclear Science References database.
They offer four primary search interfaces, a quick search, text search, indexed search, and keynumber search.
The quick search interface is shown in figure {@fig:nsrweb1}.

![The main interface for the NNDC's NSR website. Captured June 28th 2015](images/web-NSR-main-June-28-2015.png) {#fig:nsrweb1}

The various search functions are separated in either different pages or different text boxes.
Some options and customizations are set through drop down menus.
For example the searching of indexed fields, including the selector values, is separate from the text search.

### Quick Search
The quick search functionality is shown on the NSR homepage, it is likely the most commonly used interface.
It enables searching by author name, nuclide, or reaction.
Two types of filters are available to limit the results: a year range, and reference type which can return only experimental or theory entries.
Each of the search fields show examples of the type of search as well.
For example the author field shows you can search for an author using their first initials and their last name, or simply just their last name.

### Text Search
The text search interface enables text searching in the title, keywords, or both fields.
The search is not case sensitive and requires a search string of at least three characters in length.
Phrases can be used by enclosing them in quotes.
The user can specify a publication year range, or choose a date to filter when the entries were added to the database.
Additionally the user can enable 'primary only' or 'require measured quantity' flags.
The results can be sorted in ascending or descending order and presented in HTML, BibTex, Text, Keynum, or Exchange formats.
%- The quick search results do not offer these output customizations.

### Indexed Search
%- Author fingerprinting will improve the author 'browse' button
The interface for indexed searching is quite similar to the Text search.
The most important difference is the functionality offered by the browse buttons for the search parameters.
The user can select a parameter of the following types:
Author, FirstAuthor, Nuclide, Target, Parent, Daughter, Subject, Measured, Deduced, Calculated, Reaction, Incident, Outgoing, Journal, Topic, Z(range)
For each of the types available the browser button will redirect to another page that either details the possible values or provides another search through the possible values.
For example, Author and First Author direct to a simple search interface that allows some partial matches againsts the list of known authors.

### Result Analysis
Search queries are remembered and presented in the 'Combine View' tab.
You can combine the results of recent queries with various boolean logic.
Analysis is offered on the search queries which displays how many nuclides, authors, journals, and publication years the query invovled.

## Proposed Improvements
The primary function of the developed application is increased accessibility to exploration of the Nuclear Science References data.
This includes the authors documented, the papers recorded and keyworded, their links, and all available metadata for the nearly 120 years.
The application makes use of a web interface to aid in increasing accessibility.
All one needs in order to use the application is a modern web browser.
Interactive visualizations are used to encourage exploring the data.
The hope is that this work will enable and encourage future works either with the NSR data or similar databases of information.


Application
===========
%- Designing an interface for such an application
%- Perhaps write this after the demonstration section.
%- (We build/propose the tool that does the things demonstrated.)

The proposed application attempts to unify the various search functions into a single web app interface.
Furthermore the app presents new types of analysis for the user.
At a high level, the interface is composed of a search area that takes in user input and then generates a database query to retrieve the relevant data.
This data is then presented with a number of visualization options.


The Data and Database
=====================
%- TODO expand
The most preliminary step is acquiring the Nuclear Science References from the National Nuclear Data Center.
A full database dump was acquired on January 29th 2014.
This dump of the NSR data will hereinafter be referred to as if it were the complete NSR database.
All efforts have been taken to ensure the research procedures can very easily be extended and repeated on new NSR data.

## Data Preparation
Before the data can be imported into MongoDB it must be parsed into a JSON format.
The NSR data is provided in a custom EXCHANGE format. @winchell2007nuclear
%- TODO add figure reference
An example of the raw data for a single paper can be seen in figure !!!
A series of simple search and replace commands using regular expressions can be applied to transform the data into a different structure more compatible with our database.

In particular, this work uses a series of simple perl scripts to apply the regular expression transformations.
%- FOOTNOTE Perl is used here as it remains one of the best regex tools, and allowed for scripts that read as a list of regexs to apply.
The result a valid JavaScript Object Notation, or JSON, structure for each NSR entry.

%- TODO Show/reference the JSON format of example raw NSR data

## Data Representation
%- TODO discuss the NSR format. *Each* field on the newly created JSON
In order to produce a good data schema, thought must be given to the data representation.
Consideration should be given to the types of queries that will be made on the data.
%- year as int allows <, >, and =
%- author array has first, last, size, unwind
For example the author field is likely best represented as an array of strings, with each unique author being a separate element in the array.
This attaches information about how many authors an entry has to our schema.

The optimal schema for the SELECTRS field is not initially obvious.
The current schema has SELECTRS parsed into a 3 dimensional array.
Each 'selector' has a type, value, and a link variable.
The following types are valid:
\begin{quote}
N, T, P, G, R, S, M, D, C, X, A, or Z, which stand for nuclide, target, parent, daughter, reaction, subject, measured, deduced, calculated, other subject, mass range, and charge range, respectively.
\end{quote}
The value changes based on the type. The link variable is used to tie together multiple selectors.
%- TODO Provide an example

``` {#rawNSRentry caption="An example NSR entry showing the raw NSR data format."}
<KEYNO   >1988AB01                                                              &
<HISTORY >A19880309 M19880315                                                   &
<CODEN   >JOUR PRVCA 37 401                                                     &
<REFRENCE>Phys.Rev. C37, 401 (1988)                                             &
<AUTHORS >A.Abzouzi, M.S.Antony                                                 &
<TITLE   >Calculation of Energy Levels of {+232}Th,{+232}{+-}{+238}U for K(|p) =&
 0{++} Ground State Bands                                                       &
<KEYWORDS>NUCLEAR STRUCTURE {+232}Th,{+232},{+234},{+236},{+238}U; calculated le&
vels,band features. Semi-empirical formalism.                                   &
<SELECTRS>N:232TH;A. N:232U;A. N:234U;A. N:236U;A. N:238U;A. C:OTHER;A.         &
<DOI     >10.1103/PhysRevC.37.401                                               &
```

## The Database - MongoDB
%- Data imported into MongoDB
With the data representation complete and the data formatted correctly and imported to MongoDB, we can consider the database operations.
The most common operation will be some sort of search or lookup.
A small python program is shown in figure ??? that saves the results of a MongoDB aggregation query to a tsv file.

``` {#pymongotrans .python caption="Saving the results of an eggregate query to file"}
from pymongo import MongoClient
import csv

client = MongoClient('localhost', 27017)
db = client.masters
nsr = db.NSR

selectorAuthors_pipeline = [
    {"$match": {"selectors.type":"N"}},
    {"$unwind": "$selectors"},
    {"$unwind": "$authors"},
    {"$group": {"_id": "$selectors.value", "authors": {"$addToSet": "$authors"}}}
]
results = nsr.aggregate(selectorAuthors_pipeline, allowDiskUse=True)

with open('tsa.tsv', 'w', newline='') as tsvfile:
    transaction_writer = csv.writer(tsvfile, delimiter='\t')
    for document in results:
        transaction_list = document['authors']
        transaction_list.insert(0, document['_id'])
        transaction_writer.writerow(transaction_list)
```

%- MongoDB Indexes
To optimize this process we instruct MongoDB to index our data on various fields.
Indexing speeds up search queries in a manner similar to sorting a series of data elements.
MongoDB allows for many different types of indexes.
We create a single field indexes on the id, year, authors, selectors type, selectors value, and type fields.
This enables very fast lookups for documents according to the indexed fields.
For example it would be very quick to find all the documents with type 'Journal' and year '1983'.
Where as the search for all documents with keyword "fisson" has not been optimized by the previously mentioned indexes.

We can create an index of the document years at the mongo shell with the following command:

``` {.javascript caption="Create an index on the 'year' field in Mongo Shell"}
db.NSR.createIndex({year: 1})
```

Since our author field is really an array of string elements, we can use a single field index on it without issue.
However, on field like the title or keywords a single field index will fall short of helping us find partial matches.
For example, searching for documents with the word "neutron" in the title will not be sped up by a single field index.
For this task we leverage MongoDB's text indexes.
%- TODO Confirm that this is true, perhaps even demonstrate it

## Data Summarization
%- Form data mining problems, questions, queries
%- Interpretation
Data summarization is necessary to begin to understand our data.
Preliminary visualizations help in this task.
A histogram of database entries per year is shown in figure !!!.
This very quickly demonstrates that the majority of documents in the NSR were published in the last 50 years.

%- TODO histogram of papers per year


Algorithmic development
=======================
%- Introduce and discuss the algorithms used in various application features
%- Cluster analysis in research proposal is still useful.
%- Starting with some of the naive algorithms, and then going to graph theory.
%- A review of graph theoretic concepts and piecing them together for the application on hand.

## Classification and Cluster Analysis
Classification and clustering are related approaches to organizing data elements into groups for further analysis.
Classification is the process of deciding what group a particular datum should most optimally belong to.
Clustering is the grouping of multiple data points such that those belonging to a group are more similar in some manner than those outside of that group.

Clustering can be broken into two main groups, hierarchical and partitional.
Both groups have applications in this study.
The citation structure or authorship of the literature is likely to be hierarchical in nature.
%- TODO expand on hierarchical bit or remove it
Partitional clustering should prove useful in determining the sub genres and fields of study within the body of work.

Various aspects of the data will be clustered with differing techniques based on the data type.
The methodology for a basic clustering technique, K-means clustering is discussed.

### K-means Clustering
K-means clustering is a cluster analysis technique that can group data objects in $K$ clusters based on minimizing their distances with respect to cluster centroids.
K-means is a partitional clustering algorithm.

Say we have a finite set of objects,  $X = {x_1, x_2, ..., x_n}$ where each is a data object in $d$ dimensions.
We can create $k$ clusters $C = {c_1, c_2, ..., c_k}$ where $k <= n$.
The process starts by randomly choosing $k$ points, ${x_1, ..., x_k}$ to be the centroids of a cluster.
Iterate over each object $x$ and assign it to a cluster $c$ based on the minimization of some parameter, for now, Euclidean distance.
The new centroids are now computed and the process is repeated until cluster stability is achieved.
The goal is to minimize the total sum of squared errors between the centroids and all objects. 
\begin{equation} \label{kmeans}
J(C) = \sum^K_{k=1} \sum_{x_i \in c_k} \left| x_i - \mu_k \right| ^2
\end{equation}

%- \begin{figure}[!hb]
%-     \centering
%-     \includegraphics[width=\linewidth]{../literatureReview/kmeansJain.pdf}
%-     \caption{Step by step illustration of K-means algorithm. (a) The initial input data. (b) Three seed points are chosen as the starting 'centroids' and the data points are assigned to the cluster with the closest seed point. (c) (d) The centroids of the new clusters are calculated, and data labels updated; (e) the iteration stops when the clusters converge.}
%-     \label{fig:K-Means-Jain}
%- \end{figure}

Three parameters for K-means must be specified initially, the number of clusters, initial centroid guesses, and the distance metric.
The metric is the function on a space that describes how two points differ from one another, i.e. distance.
Euclidean distance is typically used, leading to ball or sphere shaped clusters. @Jain2010651

The chosen number of clusters has a huge impact on the data partitions.
Some heuristics exist to aid in determining an optimal $k$. @tibshirani2001estimating
In practice, K-means is normally run multiple times with varying $k$ values and the best is selected by a domain expert.
However, measurements of cluster effectiveness will be shown.
%- TODO DB index, G1 index

## Initial Author Clustering
%- Cluster with author, numCoauthors, numEntries, numYears first
%- Then develope more advanced clusterings by increasing the number of parameters used to describe these points.
%- e.g. Use values at a range of different percentiles.

We use an aggregation query to summarize our data in preparation for clusting.
This query saves, for each author, their total number of coauthors, their total number of years publishing, and their total number of publications.
This serves as a good first characterization of author types.
We should be able to see very prolific authors with high numbers of entries.


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
%- Analysis discussion from the proposal could be useful in the demonstration section of the thesis.

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
(I would like to not actually write that number in the thesis, but instead compute and reference it.)

## Similar "Objects"

The ultimate goal of the Similar Objects feature is to provide a flexible recommender system that supports recommending different types of objects within the database.
The most obvious usecase of this feature is to find similar authors to those the user is currently inspecting or searching.
However the system should be extendable to also recommend similar keywords or periods in time, for example.
Implementing this feature requires a significant amount of offline data mining and analysis.
Once the analysis is done, the runtime of the application need only do quick lookups in tables to find the desired results.

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

The Apriori algorithm returns list of association rules that have support and confidence values above the minimum amount specified.
This list almost certainly contains duplicate information.
Sometimes of the form A->B and B->A
In the case of nuclides found in selector values, we often see multiple rules involving various different permutations of a list of common isotopes.

Now I have a list of association rules, and I want to filter them to see only rules that involve authors who have not published together.
Specifically I want authors who have published using the same keyword in different papers, and have never authored a paper together.

I could make a list of the total coauthors for any given author.
Then I could cheaply lookup an author in an association rule (perhaps the rhs author) and see if i find the other authors in the rule.
If not, then this is an interesting rule. If so, it is likely considerably less interesting.

Pawan has suggested another method: taking the difference of two sets of rules.
One produced using any initial criteria as long as the rules are associations of authors, and the second rules produced from coauthorship data.
Testing both methods could be interesting and should not be terribly difficult.

A small python script has been written to parse the arules apriori output rules into python lists.
From here we can use the data for analysis such has database queries, or simply produce more standard csv/tsv records.


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
- Author/Group/Journal profiling (innovative, follower, prolific...) (likely better done with citation info)
- Anything involving other data like citations

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


Bibliography
============
