%-    Research Proposal
%- The 'Data Preparation' subsection of Methodology is still applicable.
%- However, it is rather brief and could be expanded to include discussion.


Thesis Introduction
===================

%- The problem and its setting
%- Proposed methodology to solve problem
The National Nuclear Data Center prepares an evaluated database of nuclear science literature that poses a rich opportunity for knowledge discovery directed at the scientific work and study.
Identifying trends and patterns in the meta data of over 200,000 documents may reveal latent structures of the progress and collaboration among the scientific community.
This knowledge may have implications in other similar scientific fields, but most prominently it may provide predictive power within the nuclear science domain.

%- Define research setting and sum-up what has been done
%- Point towards what should be done, why?
%- What is the problem? What will I study?
The academic field of nuclear science is over one hundred years old, starting with the discovery of radiation.
This discovery is the first of many entries in the Nuclear Science References database, collected, cataloged, distributed, and evaluated by the National Nuclear Data Center. \\citep{Kurgan200603}
The NSR has over 210,000 entries documenting the body of nuclear science literature, which provides the opportunity for knowledge discovery on the literature's meta data.


%- What do we know already?
%- How will this advance our knowledge?
%- Explain your choice of model. Advantages? Suitability from theoretical point of view? practical reasons for using it?
%- Significance, timeliness, and importance of project.
Information retrieval has been repeatedly improved by large search engines like Google.
And while nuclear science literature is a specialized field, Google Scholar is capable of searching many peer reviewed journal articles.
The NSR provides meta data that can be converted to semantic information for advanced querying capabilities.
This work is a cross disciplinary work, combining data mining technique with domain knowledge in nuclear physics.


System analysis
===============
> Description of the application domain, existing tools, and functional analysis of a comprehensive application that will be helpful to the physicists.

The NNDC maintains the [NSR website](http://www.nndc.bnl.gov/nsr/) which serves a simple interface to the Nuclear Science References database.
They offer a quick search, and searching via text, keynumber, and various indexed key fields.
The various search functions are separated in either different pages or different text boxes.
Some options and customizations are set through drop down menus.
For example the searching of indexed fields, including the selector values, is separate from the text search.

![The main interface for the NNDC's NSR website. Captured June 28th 2015](images/web-NSR-main-June-28-2015.png)

- Get some screenshots of the NSR website. (automate?)
- Does the NSR website offer visualizations?
- Easy method of exporting data?
- Links to papers?
- How capable is it as a tool to explore further work?

The primary function of the developed application is increased accessibility to exploration of the Nuclear Science References data.
The authors documented, the papers recorded and keyworded, their links, and all available metadata for the nearly 120 years.
The application makes use of a web interface as the browser is the most widely available runtime environment.
Interactive visualizations are used to encourage exploring the data.
The hope is that this work will spawn future works either with the NSR data or similar databases of information.


Application
===========
> Designing an interface for such an application

The proposed application attempts to unify the various search functions into a single web app interface.
Furthermore the app presents new types of analysis for the user.

Perhaps write this after the demonstration section. (We build/propose the tool that does the things demonstrated.)


Algorithmic development
=======================
> Introduce and discuss the algorithms used in various application features
%- Cluster analysis in research proposal is still useful.

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
