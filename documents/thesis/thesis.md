---
title:  'Masters of Science in Applied Science Thesis'
author:
- name: Andrew Valencik
  affiliation: Saint Mary\'s University
author: Andrew Valencik
date: September 8th 2015
bibliography: bibliography.yaml
csl: american-physics-society.csl
link-citations: true
...

\listoffigures
\listoflistings
\listoftables


Introduction
============

%- The problem and its setting
%- Proposed methodology to solve problem
The United States National Nuclear Data Center prepares an evaluated database of nuclear science literature that poses a rich opportunity for knowledge discovery directed at the scientific work and study.
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
This discovery is the first of many entries in the Nuclear Science References database, collected, cataloged, distributed, and evaluated by the National Nuclear Data Center [@Kurgan200603].
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


%- Description of the application domain, existing tools, and functional analysis of a comprehensive application that will be helpful to the physicists.
%- Get some screenshots of the NSR website. (automate?)
%- Does the NSR website offer visualizations?
%- Easy method of exporting data?
%- How capable is it as a tool to explore further work?
## The Nuclear Science References Website
The NNDC maintains the [NSR website](http://www.nndc.bnl.gov/nsr/) which serves a simple interface to the Nuclear Science References database.
They offer four primary search interfaces, a quick search, text search, indexed search, and keynumber search.
The quick search interface is shown in figure {@fig:nsrweb1}.

![The main interface for the NNDC's NSR website. Captured June 28th 2015](images/web-NSR-main-June-28-2015.png) {#fig:nsrweb1}

The search functions are separated in either different pages or different text boxes.
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
For example, Author and First Author direct to a simple search interface that allows some partial matches against the list of known authors.

### Result Analysis
Search queries are remembered and presented in the 'Combine View' tab.
You can combine the results of recent queries with boolean logic.
Analysis is offered on the search queries which displays how many nuclides, authors, journals, and publication years the query involved.

## Proposed Improvements
The primary function of the developed application is increased accessibility to exploration of the Nuclear Science References data.
This includes the authors documented, the papers recorded and keyworded, their links, and all available metadata for the nearly 120 years.
The application makes use of a web interface to aid in increasing accessibility.
All one needs in order to use the application is a modern web browser.
Interactive visualizations are used to encourage exploring the data.
Additionally, the new database structure that is developed in this work enables searches that were previously cumbersome or impossible.


The Data and Database
=====================
%- Data Structure and Representation?
An early and difficult stage in any data science project is data acquisition.
Thankfully the National Nuclear Data Center has composed the Nuclear Science References database already.
For this work, a full database dump of the NSR was acquired on January 29th 2014.
For simplicity, the data acquired from the NNDC on January 29th will be referred to as if it were the complete NSR database.
All efforts have been taken to ensure the research procedures can easily be extended and repeated on new NSR data.

## Data Preparation
The NSR data was provided in a custom EXCHANGE format @winchell2007nuclear.
This format is flat text that is not suitable for direct analysis.
The data needs to be easily parseable so data can be separated.
The easiest approach is to transform the data into a common format for which parsers already exist.
%- TODO refresh what the difference is between parsing and text searching

%- TODO get reference for JSON format
JavaScript Object Notation, or JSON, was chosen as the final data format.
This choice was almost entirely motivated by the author's familiarity with JSON.
While other data formats could have sufficed (perhaps YAML, for example) certain common data formats like comma separated values (csv) would have been more difficult.
This is primarily because of the requirement for arrays in the data.
This requirement is discussed further in the [Data Representation](#data-representation) section.

%- NSR EXCHANGE format discussion
%- TODO add figure reference
An example of the raw data for a single paper can be seen in snippet @rawNSRentry.
The NSR has 9 possible types of fields which are shown in Table @tbl:NSRidentifiers.
Each entry can only have one of each field type except for `<KEYWORDS>` and `<SELECTRS>` which exist as a pair and an entry can have multiple pairs of them.

Identifiers   Description
-----------   -----------
`<KEYNO   >`  Reference keynumber
`<HISTORY >`  Administrative record
`<CODEN   >`  Standard form reference
`<REFRENCE>`  Free text reference
`<AUTHORS >`  Author names
`<TITLE   >`  Reference title
`<KEYWORDS>`  Keyword abstract
`<SELECTRS>`  Indexing parameter list
`<DOI     >`  Digital object identifier

Table: The nine legal record identifiers from the Nuclear Science References Coding Manual @winchell2007nuclear. {#tbl:NSRidentifiers}

The `<KEYNO   >` field is a unique key number assigned to each NSR entry.
When a particular entry was added to the database or last modified is encoded in the `<HISTORY >` field.
The `<CODEN   >` and `<REFRENCE>` fields contain information about the journal or other type of resource the document came from.
The `<AUTHORS >` field is a comma separated list of author names.
The author list is the key component in doing any sort of graph analysis of the data.
The `<TITLE   >` field is a free text field representing the title of the reference with a custom set of abbreviations for special characters like Greek letters.
Temporarily jumping ahead, the `<DOI     >` field contains the digital object identifier code that uniquely links to the source document.
%- Write about the KEYWORDS and SELECTRS

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
%- ROBY explain this in a caption

%- NSR to JSON
Transforming the NSR data to JSON is possible with a series of search and replace commands using regular expressions.
This series of search and replace commands are recorded in the Perl[^why-perl] script parseNSRtoJSON.pl in the data directory.
The result of the scripts is a file with a valid JSON structure for each NSR entry.

[^why-perl]: Perl is used here as it remains one of the best RegEx implementations, and allowed for scripts that read as a simple ordered list of transformations to apply.
%- TODO Show/reference the JSON format of example raw NSR data

## Data Representation
In order to produce a good data schema, thought must be given to the data representation.
Consideration should be given to the types of queries that will be made on the data.
%- year as int allows <, >, and =
%- author array has first, last, size, unwind
For example the author field is likely best represented as an array of strings, with each unique author being a separate element in the array.
This attaches information about how many authors an entry has to our schema.

%- Getting into SQL vs NoSQL here...
An early requirement of the data representation was to handle the author list as an array.
An author is a type of entity in the data.
In a relational database the authors would have their own tables, separate from papers, as they are separate entities.
This means a table and data scheme would need to be created for the papers and then a separate table and scheme for the authors, and similarly for keywords, selectors, and history.
It is certainly possible to store the NSR data in a relational model.
It was however much less work to convert the original data into a data scheme that used arrays.
This is the primary motivator for not using a standard relational database.


The optimal schema for the SELECTRS field is not initially obvious.
The current schema has SELECTRS parsed into a 3 dimensional array.
Each 'selector' has a type, value, and a link variable.
The following types are valid:
\begin{quote}
N, T, P, G, R, S, M, D, C, X, A, or Z, which stand for nuclide, target, parent, daughter, reaction, subject, measured, deduced, calculated, other subject, mass range, and charge range, respectively.
\end{quote}
The value changes based on the type. The link variable is used to tie together multiple selectors.
%- TODO Provide an example of multiple selectors being connected

%- ROBY write a paragraph that factually states your final representation
An example of the final data representation used by the work is shown in figure ???.
The `_id` is used as the unique identifier in the MongoDB collection.
`year` is an integer and represents the year the resource was published.
`history` is an array that contains encoded information representing dates when the original NSR document was added and/or modified.
`code` is a copy of `CODEN` from the NSR data.
`type` describes what publication type (journal, thesis, conference paper, etc) the resource is.
`reference` is a copy of `REFRENCE` from the NSR data.
`authors` is an array of string elements representing the authors who published that resource.
`title` is a string, formatted for LaTeX, that represents the title of the resource.
`keywords` is an array of strings that represent the KEYWORD sentences as described in the NSR manual.
`selectors` is an array of objects that contain the type, value, and subkey information generated by the keyword entry by the NSR.
Finally, the `DOI` is a Digital Object Identifier for the published resource.

```
{
  "_id": "1988AB01",
  "year": 1988,
  "history": [
    "A19880309",
    "M19880315"
  ],
  "code": "JOUR PRVCA 37 401",
  "type": "JOUR",
  "reference": "Phys.Rev. C37, 401 (1988)",
  "authors": [
    "A.Abzouzi",
    "M.S.Antony"
  ],
  "title": "Calculation of Energy Levels of {+232}Th,{+232}{+-}{+238}U for K(\\pi ) = 0{++} Ground State Bands",
  "keywords": [
    "NUCLEAR STRUCTURE {+232}Th,{+232},{+234},{+236},{+238}U; calculated levels,band features. Semi-empirical formalism."
  ],
  "selectors": [
    {
      "type": "N",
      "value": "232TH",
      "subkey": "A"
    },
    {
      "type": "N",
      "value": "232U",
      "subkey": "A"
    },
    {
      "type": "N",
      "value": "234U",
      "subkey": "A"
    },
    {
      "type": "N",
      "value": "236U",
      "subkey": "A"
    },
    {
      "type": "N",
      "value": "238U",
      "subkey": "A"
    },
    {
      "type": "C",
      "value": "OTHER",
      "subkey": "A"
    }
  ],
  "DOI": "10.1103\/PhysRevC.37.401"
}
```

## The Database

MongoDB was chosen primarily because of the authors familiarity with it.
Additionally it has nice features such as JSON support, an aggregation framework, and is easy to setup.
Other NoSQL databases like CouchDB support JSON and would likely work just as well.
It is worth mentioning that MongoDB and CouchDB are comparatively new database systems.
Postgres also supports JSON and is a mature database system.
Because MySQL is so prevalent it is worth mentioning explicitly why it was not chosen.
MySQL is a relational database and would thus not support the arrays in the data scheme as outline in the previous section.

### MongoDB
With the data representation complete and the data formatted correctly and imported to MongoDB, we can consider the database operations.
The most common operation will be some sort of search or lookup.
%- MongoDB Indexes
To optimize this process we instruct MongoDB to index our data on important or frequently referenced fields such as "authors" and "year".
Indexing speeds up search queries in a manner similar to sorting a series of data elements.
MongoDB allows for many different types of indexes.
We create a single field indexes on the id, year, authors, selectors type, selectors value, and type fields.
This enables fast lookups for documents according to the indexed fields.
For example it would be quick to find all the documents with type 'Journal' and year '1983'.
Where as the search for all documents with keyword "fisson" has not been optimized by the previously mentioned indexes.

Since our author field is really an array of string elements, we can use a single field index on it without issue.
However, on field like the title or keywords a single field index will fall short of helping us find partial matches.
For example, searching for documents with the word "neutron" in the title will not be sped up by a single field index.
For this task we leverage MongoDB's text indexes.
%- TODO Confirm that this is true, perhaps even demonstrate it

### MongoDB Aggregation Framework
The MongoDB Aggregation Framework is powerful and enables a lot of data manipulation.
There are a handful of simple aggregation operations that can be piped together to build complex queries.
All aggregation operations take in a list of data documents, manipulate them in some way, and then output the results to the next operation.

**match** The `match` operation acts as a filter, returning only the documents that meet the specified criteria.
```
Insert simple example here
```

**project** The `project` operation manipulates each individual document renaming, omitting, or changing each field according to the input parameters.
```
Insert simple example here
```

**unwind** The `unwind` operation acts on an array field of the input documents.
It creates a new document for each element in the array, with all fields duplicated exist the array field which is equal to the element.
```
Insert simple example here
```

**group** The `group` operation can combine similar documents and can perform calculations based on that combination.
A common usage is to sum a value, perhaps price, of all the input documents.
```
Insert simple example here
```

There are some additional, more straightforward operations such as `sort`, `limit`, `skip`, and `redact`.
The final results form an aggregation query can be saved to a collection using the `out` operation, or can be returned to the calling application through the many MongoDB APIs.

Thankfully, MongoDB is currently a popular database and there exists lots of tutorials and example applications.
The MongoDB documentation is available at ???.
All MongoDB interactions in this work use the python driver, `pymongo`.
You can find the `pymongo` documentation at ???.

Data Summarization
==================
%- What? Created summaries and ranked info in a web app.
%- Why? Visualizations are important in understanding data. As are summaries and rankings.
%- How? MongoDB aggregations to D3 charts.
Data summarization is necessary to begin to understand our data.
Preliminary visualizations help in this task.
A histogram of database entries per year is shown in figure !!!.
This very quickly demonstrates that the majority of documents in the NSR were published in the last 50 years.

Early stages in data visualization were used to learn about the dataset as a whole.
Answering simple questions like how many papers are in the database?
When were those papers written?

## Visualizations

There are two primary visual methods for displaying summary information in this application.
The histograms show how a particular slice of the database evolves over time.
The pie charts demonstrate the relative sizes of portions of the data.
For example, out of a slice of data, perhaps all of the data, how many entries are papers and journals?

![A histogram of papers publish from 1896 to 2014](/Users/andrew/Dropbox/Masters/roughFigures/NSRyearlyhistogram.pdf){#fig:nsrhisto}

## Rankings

For a particular selection of NSR data, it can be useful to know the rankings for important data fields.
For example, if a user searches an author on the application they are presented with a ranked list of their most frequent coauthors, keywords, and nuclides.


Network Analysis and Visualization
==================================
%- What? Enabled graph data structure operations on NSR author data.
%- Why? This is not possible with existing NSR data... Why useful?
%- How? Using python library Networkx to build graph datastructures. D3 and Gephi for visualizations
All previous analysis of the NSR data has focused on the content of each entry in a flat manner.
However, the list of authors of a paper can be used to build a network or graph of the authors.
It is worth noting in this thesis, the word 'graph' will always refer to the mathematical representation of a set of objects and their links.
The first graph constructed in this app was a graph where each node represents an author, and each edge or link represents a coauthorship.

## Graph Layout Algorithms
The visualization of large graphs is computational intensive and produces complex images.
These images are perhaps of questionable usefulness.
The resulting shape or 'layout' of a graph is dependent on the graph layout algorithm used.
Figures @fig:nsr1989graphyifanhu and @fig:nsr1989graph use the exact same input data but two different layout algorithms (Yifan Hu ML and Atlas 2 respectively).

![Network Graph of 1989. Nodes are authors coloured by modularity, and edges are a common publication.](/Users/andrew/Dropbox/Masters/gephi/images/NSR-1989-biggest-modularity-degree-yifanhuML.pdf){#fig:nsr1989graphyifanhu}

![Network Graph of 1989. Nodes are authors coloured by modularity, and edges are a common publication.](/Users/andrew/Dropbox/Masters/gephi/images/NSR-1989-biggest-modularity-degree.png){#fig:nsr1989graph}

%- D3 force graphs? citations, layout algorithm, what forces?
The D3 graphs produced in the web application use the D3.js Force directed graph routines.

## Nuclide Graphs
Almost any parameter can be used as a filter to produce an author network graph.
The selector values present an interesting opportunity in this case.
We can filter the NSR data to only include entries that involved a particular nuclide.

## Implementation
%- Citation
The Python library Networkx is used to create the graph data structures, which can then be sent to our visualization code, or be exported for analysis with other tools.
Networkx has a collection of algorithms and functions used to analyze and manipulate the graphs.
Such manipulations include identifying and sorting disconnected subgraphs within a slice of data.
For example, figures @fig:nsr1989graphyifanhu and @fig:nsr1989graph are use only the largest connected graph of all the NSR entries in the year 1989.
There were ??? other smaller graphs disconnected from the largest graph in 1989.

## Future Work
Treating the NSR database as a graph data structure opens up a lot of avenues for future work.
With a graph with authors as nodes and their publications determining the edges, the result is a social network of collaborating scientists.
This opens up the data to future work in other fields such the social sciences or large network analysis.

### Exporting Graph Data
The Networkx library has support for writing the graph data structures to multiple file types.
Example code for exporting the 1989 data to `gexf` format for analysis in Gephi or similar tools is available ???.


Author Name Analysis
====================

## Author Fingerprinting
%- build collection of all unique author names (101095)
%- calculate the edit distances of all the author names (more than 5 billion calculations...)
%- There are 41254 "authors" that appear once
%- I would like to not actually write that number in the thesis, but instead compute and reference it.
A 2014 paper from Boris report a total of 96200 unique authors.

Author search has been improved by implementing a suggestion system for partial author name searches.
When we search for "Svenne" we can see there are both J.P.Svenne and J.Svenne.
In the original NSR application it would be a manual task to discern the two author names.
Our improvement is to add an author clustering scheme that shows the similarity of authors.
Here we can see that JP Svenne and J Svenne are likely to be the same author.
> Also use "Austin" S.M.Austin, Sam.Austin
When a similarity measure is above a certain threshold the matching grouping of authors is automatic.

This similarlity measurement could happen either online (immediately after the user submits a query) or offline (before the app is presented to users).
Because our database is static and manually updated with new entries periodically, the offline approach makes sense.
And additional benefit to the offline approach is that it can be easily moderated and tweaked with user submitted suggestions.
A possible example being an author name misspelling that only occurs once. (not enough times to measure similarity against)

### Levenshtein Distance
String edit distance measures such as the Levenshtein Distance offer an easy first approach to analyzing the author names.
The Levenshtein distance is one type of string metric to evaluate the difference between two sequences of characters.
A distance of 1 is attributed to ever single character edit necessary to transform one of the input strings into the other.
Single character edits include an insertion of a character, a deletion, or a substitution.

> TODO Present an example (for each: insertion, deletion, substitution) using actual author names from the NSR.

The Python library Jellyfish makes it quite easy to use a few different distance metrics.
Nevertheless, calculating any measure for all pairs of authors is a large task.
A quick estimate of $100,000$ authors means $5,000,000,000$ unique (unordered) pairs to calculate.
Thankfully this is not entirely prohibitive to calculate on modest hardware.
It does however, produce a large amount of data, so filtering is absolutely necessary.

A small Python script, using Jellyfish, was prepared to calculate the Levenshtein Distance for each author name pair.
Only pair with a distance less than 4 were written to file.
%- 3 is higher than necessary
This analysis reveals over 20 million author pairs for further analysis.

> TODO Discuss pairs with a distance of 1

> TODO Discuss pairs with a distance of 4

> TODO Discuss limitations of "non informed" string edit distances.

### Extending the String Metric
"Adam Sarty" and "A.Sarty" should actually have a small distance in our application.
This type of analysis would require a significant modification to the existing string metrics.
There are many open source implementations of string distance functions, so a modification is not out of the question.

Another approach could simplify the list of authors while accepting potential loss of information.
The current number of unique authors after perl parsing is $100147$, if we remove all authors that include *" the "* in their name we reduce to $98788$ authors.
This has the effect of removing collaborations from the author list.
This may or may not be desired for some analysis.
In attempting to find author with typos and similar data entry mistakes in their names this filtering is unlikely to have significant impact.
Author name fields representing collaborations are often long and have small string distances to one another as they informative part of their name is typically an acronym.

Continuing this approach of throwing away some data to narrow our results, removing all spaces returns on $97411$ unique authors.
And removing all characters but alphabetical ones returns $95366$ unique authors.
It is worth recalling that Pritychenko reports 96200 unique authors in his 2014 paper.

%- TODO Evaluate how much more detail I should go into on 'further tools'

There are other more advanced tools from the field of information and language theory that could be used as well.
Simple transducers could be specified to calculate the author name abbreviations in an efficient manner.
However this presents a significant departure from the rest of the work.


Associating Mining
==================

## Similar "Objects"
%- TODO Determine which parts of the following discussion should be in algorithmic development
%- ROBY very nice introduction!
The ultimate goal of the Similar Objects feature is to provide a flexible recommender system that supports recommending different types of objects within the database.
An obvious use case of this feature is to find similar authors to those the user is currently inspecting or searching.
However the system should be extendible to also recommend similar keywords or periods in time, for example.
Implementing this feature requires a significant amount of offline data mining and analysis.
Once the analysis is done, the runtime of the application need only do quick lookups in tables to find the desired results.

With this in mind, the high level summary of this analysis stage is to build data object classifiers and labels and then enable the user interface to search and display those labels.

There are a number of metrics used in producing the data object labels.
Similar authors could be authors who publish together, or authors who do not publish together but publish with similar keywords.
The latter is likely more interesting to users, as it could suggest similar authors they are unaware of.

As the NSR database spans several decades, each data object presents time series information.
Finding similar authors separated in time could be interesting.

### Association Mining with Apriori
%- They are really just describing which selector values appear often together in the same paper, and that is not particularly illuminating domain knowledge.
%- TODO cite the arules package
As a preliminary test with association rule learning, we prepare our data for use with the Apriori algorithm in the *arules* package in R.

> TODO Work through an example and explain the algorithm.

The Apriori algorithm returns list of association rules that have support and confidence values above the minimum amount specified.
This list almost certainly contains duplicate information.
Sometimes of the form A->B and B->A
In the case of nuclides found in selector values, we often see multiple rules involving different permutations of a list of common isotopes.

%- Program workflow
It is pretty easily to flatten our data as needed using the MongoDB aggregation framework.
A python script *prepare-data.py* has been developed to prepare the data for analysis.
The resulting data is then handled by the R script *apriori-dedup.r*.
The R script writes the output of the apriori algorithm to a file.
Another python script, *parse-arules-output.py*, then parses the R apriori output to be in a more usable csv format.

At this stage, there is a list association rules relating authors through their use of keywords.
Most of these rules likely involve authors that have published together.
However, finding the rules with authors who have not published together would present interesting information.
Specifically, a filter is created to return authors who have published using the same keyword in different papers, and have never authored a paper together.

%- I could make a list of the total coauthors for any given author.
%- Then I could cheaply lookup an author in an association rule (perhaps the rhs author) and see if i find the other authors in the rule.
%- Pawan has suggested another method: taking the difference of two sets of rules.
%- One produced using any initial criteria as long as the rules are associations of authors, and the second rules produced from coauthorship data.
%- Testing both methods could be interesting and should not be terribly difficult.


Cluster Analysis
================
%- Introduce and discuss the algorithms used in application features
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
K-means clustering is a cluster analysis technique that can group data objects in $k$ clusters based on minimizing their distances with respect to cluster centroids.
K-means is a partitional clustering algorithm.

Say we have a finite set of objects,  $X = {x_1, x_2, ..., x_n}$ where each is a data object in $d$ dimensions.
We can create $k$ clusters $C = {c_1, c_2, ..., c_k}$ where $k <= n$.
The process starts by randomly choosing $k$ points, ${x_1, ..., x_k}$ to be the centroids of a cluster.
Iterate over each object $x$ and assign it to a cluster $c$ based on the minimization of some parameter, for now, Euclidean distance.
The new centroids are now computed and the process is repeated until cluster stability is achieved.
The goal is to minimize the total sum of squared errors between the centroids and all objects (see equation {@eq:kmeans}). 

$$
J(C) = \sum^K_{k=1} \sum_{x_i \in c_k} \left| x_i - \mu_k \right| ^2
$$ {#eq:kmeans}

%- Kmeans step by step from "Data clustering: 50 years beyond K-means" by Anil K. Jain
![Step by step illustration of K-means algorithm. (a) The initial input data. (b) Three seed points are chosen as the starting 'centroids' and the data points are assigned to the cluster with the closest seed point. (c) (d) The centroids of the new clusters are calculated, and data labels updated; (e) the iteration stops when the clusters converge.](images/Kmeans-iterations-Jain09.pdf){#fig:kmeansJain}

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

There is a considerable amount of multivariate data in the NSR database.
In order to gain insight from this data, only a section or slice should be considered initially.
In this section, the authors will be analyzed with the attempt to identify groups or clusters of authors who behave similarly.

An aggregation query is used to summarize our data in preparation for clustering.
This query saves, for each author, their total number of coauthors, their total number of years publishing, and their total number of publications.
To help evaluate this summarization of authors, three heatmaps of this data are presented in figures @fig:nyne-log, @fig:nync-log, and @fig:nenc-log.

Figure @fig:nyne-log shows an expected trend; authors who publish over more years tend to have more publications overall.
Each of these figures shows that there are a large number of authors that have published only a few times.
Additionally, there are comparatively few authors who have published many times.
In anticipation of this result, the heatmap coloring is on a logarithmic scale, while the axes are linear.
Without the log color scale, the plots would be washed out by the incredibly many author who have published only once.
(To appease the curious, linearly coloured heatmaps are shown in the Appendix, figures @fig:nyne-linear, @fig:nync-linear, and @fig:nenc-linear.)

![Number of entries an author has given the number of years they have published.](../../data/images/nyne-log-heatmap.png){#fig:nyne-log}

![Number of coauthors an author has given the number of years they have published.](../../data/images/nync-log-heatmap.png){#fig:nync-log}

![Number of coauthors an author has given the number of entries they have published.](../../data/images/nenc-log-heatmap.png){#fig:nenc-log}

The three heatmaps show that the 3 dimensional data is not well segmented and is instead rather continuous.
This is a result of our input data being continuous in nature.
Clustering more categorical data could lead to more discrete or separated clusters.
Nevertheless the cluster results of this data could be used to aid in classifying authors.

The same data points from figures @fig:nyne-linear, @fig:nync-linear, and @fig:nenc-linear are shown in the subplots of figure @fig:kmeans-authors1.
The color of each data point in figure @fig:kmeans-authors1 represent which cluster that author belongs to.
This cluster membership was determined through the K-means algorithm set to find 5 centers (see [K-means Clustering](#k-means-clustering)).

![Initial clustering on authors with Kmeans](../../data/images/5clusters-kmeans-authors1.png){#fig:kmeans-authors1}

%- Get citation!
Determining the ideal number of clusters is a difficult problem. !!!
Figure @fig:kmeans-authors1 uses 5 clusters and demonstrates again that the data is continuous.
As a result the clusters function as segmentations along a continuous spectrum.
As the number of clusters increases, the size of the segmentations decrease.
%- Clustering segmentation is all happening on one axis up to a certain point.
%- Eventually the segmentations partition the data with respect to other variables.

%- Want data with more dimensionality
The numEntries and numCoauthors data presented in the heatmaps is not the whole story.
An author could have published 20 papers in 1995 and only 1 paper in 1996, their resulting numYears value for that range would be 2.
Let's try clustering with more dimensionality to our data.
Instead of a single number representing an authors number of publications, a parameter of their distribution of publications over time could be used.
How many papers has a given author published in the beginning of their career?
The end of their career, or most recently?

%- Need authors with many publications
In order to break up the number of entries over time like this, each author needs to have multiple entries over multiple years.
This excludes a lot of authors.
Recall their are !!! 45511 !!! authors with only a single publication in the database.
That is 40445 out of 100147, roughly $40\%$ of the total unique authors.

%- Demonstrate that removing all single publication authors is not as harmful as it might seem
How much of the database is affected if every author who has only published once is removed?
This question can be answered directly with the MongoDB database.
First every paper is taken and duplicated for every single author in that paper's author list.
There is now a database object for each author in each paper.
Every time an author's name appears that is one publication count for that author.
Next, each database object that has an author that has a publication count of one is erased.
Finally the unique remaining papers are the ones that have authors with more than one publication count.
Table @tbl:papersWithoutNAuthors show the number of papers that remain once all the authors with a specified publication count are removed.

%- TODO develop a better (continuous) way to calculate these numbers
Entry Number Cutoff   Papers Remaing
-------------------   --------------
0                     212835
1                     187741
2                     185404
3                     183410
4                     181315

Table: Papers affected by removal of authors with N or less papers. {#tbl:papersWithoutNAuthors}

%- Summarize the Author cut off results
The values presented in Table @tbl:papersWithoutNAuthors suggest that the bulk of the papers in the NSR are associated with authors who publish more than just a few times.
This is result means that filtering out low publication authors in additional analysus does not affect the majority of the NSR entries.
%- Demonstrate that 1993JA17 and 1996JA24 disappear correctly

%- TODO present the results from limited author clustering


Conclusions
===========
%- Conclude with discussion of contributions.
%- How the application uncovers some of the previously unknown and interesting results.


Miscellaneous
=============
> A section for all the lonely topics out there.

## Future Work
- Time series profile clustering. Show me other objects that evolved like this one.
- Chart of nuclides, table of elements visualizations
- Research predictions, suggestions
- Author/Group/Journal profiling (innovative, follower, prolific...) (likely better done with citation info)
- Anything involving other data like citations

## Contributions
- Data parsing and cleaning
- Visualization and summarization
- Exploration

## References to cite
- 50 years of kmeans
- Facebook paper A good overview of the process
- Medical clusters and MDS paper
[Graph Node Similarity](http://argo.matf.bg.ac.rs/publications/2011/similarity.pdf)


Appendix
========


![Number of entries an author has given the number of years they have published.](../../data/images/nyne-heatmap.png){#fig:nyne-linear}

![Number of coauthors an author has given the number of years they have published.](../../data/images/nync-heatmap.png){#fig:nync-linear}

![Number of coauthors an author has given the number of entries they have published.](../../data/images/nenc-heatmap.png){#fig:nenc-linear}


Bibliography
============
