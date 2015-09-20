%- Aggregations in prepare-data.py?
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
linestretch: 1.5
...

\listoffigures
\listoflistings
\listoftables


Introduction
============
%- The problem and its setting
%- Proposed methodology to solve problem
The United States [National Nuclear Data Center](http://www.nndc.bnl.gov) prepares an evaluated database of nuclear science literature that poses a rich opportunity for knowledge discovery directed at the scientific work and study.
Identifying trends and patterns in the meta data of over 200,000 documents may reveal latent structures of the progress and collaboration among the scientific community.
The knowledge discovery and data mining process should reveal trends in the collective scientific study of nuclear structure, processes, and detection.
Additionally, categorizing trends may provide predictive power in determining a worthwhile area of study or application of a technique.
The analysis outcomes of studying literature meta data may provide useful when analyzing bodies of work from other disciplines.
This knowledge may have implications in other similar scientific fields.
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
The quick search results do not offer these output customizations.

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
The United States National Nuclear Data Center (NNDC) has composed the Nuclear Science References (NSR) database.
A full database dump of the NSR was acquired on January 29th 2014.
For simplicity, the data acquired from the NNDC on that date will be referred to as if it were the complete NSR database.
All efforts have been taken to ensure the research procedures can easily be extended and repeated on new NSR data.

## Data Preparation
The NSR data is maintained in a custom EXCHANGE format @winchell2007nuclear.
This format is flat text that is not suitable for direct analysis.
To fully utilize the daya, it needs to be easily parseable into a data structure for analysis and use.
The approach least likely to introduce errors is to transform the data into a common format for which parsers already exist.

[JavaScript Object Notation](http://json.org), or JSON, was chosen as the data format for this work.
While other data formats could have sufficed (perhaps [YAML](http://yaml.org), for example), certain common data formats like comma separated values (csv) would have been more difficult.
JSON met the requirements, including those for arrays and has the advantage of being openly available, well-supported, with a handy user community, and it was familiar to the author.
This requirement is discussed further in the [Data Representation](#data-representation) section.

%- NSR EXCHANGE format discussion
An example of the raw data for a single paper can be seen in snippet @blk:rawNSRentry.
The NSR has 9 possible types of fields which are shown in Table @tbl:NSRidentifiers.
Each entry can only have one of each field type except for `<KEYWORDS>` and `<SELECTRS>` which exist as a pair and an entry can have multiple pairs of them.

``` {#blk:rawNSRentry .text caption="An example NSR entry showing the raw NSR data format." fontsize=\small baselinestretch=1}
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
These abbreviations are detailed in the NSR coding manual, and have been translated to their \LaTeX counterparts in this work.
The `<DOI     >` field contains the digital object identifier code that uniquely links to the source document.
The two fields, `<KEYWORDS>` and `<SELECTRS>` have the most structure and require special attention which is given in section [Keyword Abstracts](#keyword-abstracts).

%- NSR to JSON
Transforming the NSR data to JSON is possible with a series of search and replace commands using regular expressions.
This series of search and replace commands are recorded in the Perl[^why-perl] script parseNSRtoJSON.pl in the data directory.
The result of the scripts is a file with a valid JSON structure for each NSR entry.

[^why-perl]: Perl is used here as it remains one of the best RegEx implementations, and allowed for scripts that read as a simple ordered list of transformations to apply.

### Keyword Abstracts

```
This section will summarize the lengthy discussion of the keyword abstracts from
the NSR manual. And add to that, the parts which have been used in this work.
```

> "What distinguishes NSR from more general bibliographic databases is the level of detail provided in the keyword abstracts."
The `<KEYWORDS>` field is written by the maintainers of the NSR database, and then used to generate the `<SELECTRS>` field.

## Data Representation
The data representation is the result of careful consideration of the types of queries to be made on the data.
The data schema uses data types that best reflect out the data will be used.
For example, with data spanning 120 years, it is helpful to filter the data based on a numeric year value.
As such the `year` value in the data schema will be an integer.
Therefore we construct a simple query to get all the entries from the 1970's.

``` {#blk:NSR1970s .python caption="Python code to get all NSR entries from 1970 to 1979." fontsize=\small baselinestretch=1}
import pymongo
db = pymongo.MongoClient()['masters']
db.NSR.find({"year": {"$gte": 1970, "$lt": 1980}})
```

%- Author data structure
A more complex example is the list of authors for a NSR entry.
The author field is best represented as an array of strings, with each unique author being a separate string element in the array.
The representation of the author list as an array instead of a free text field is beneficial as the author list is now a data structure.
With this structure comes information and ease of computing different properties of that data.
The length of the array tells us how many authors collaborated on a given NSR entry.
And since arrays are ordered, we can easily determine the first author[^first-author] of an entry.
While it is possible to extract the same information from a free text field, parsing our data into data structures create structures that are compatible with many tools, such as our database.
Users of the database can now sort papers by their number of authors, or count the number of times someone was first author on an entry.
Additionally, almost every aggregation query[^see-aggregation] made in this work relies on unwinding a data array at some stage.

[^first-author]: The significance, if any, of being first author changes amongst journals. A clever data scientist would want to consider the `<REFRENCE>` information along with any first author analysis.
[^see-aggregation]: See the [MongoDB Aggregation Framework](#mongodb-aggregation-framework) section for more details.

%- Getting into SQL vs NoSQL here...
It is possible to store the NSR data in a relational model.
However, it is more efficient to convert the original data into a data schema that uses arrays.
This is the primary motivator for not using a standard relational database.
In a relational database the authors would have their own tables, separate from papers, as they are separate entities.
This would mean a table and data schema would need to be created for the papers and then a separate table and schema for the authors, and similarly for keywords, selectors, and history.

### Selectors
The selectors are generated from the keyword abstracts.
The current schema has `<SELECTRS>` parsed into a 3 dimensional array with `type`, `value`, and `subkey` variables.
The following quote from the NSR Coding Manual @winchell2007nuclear describes the valid `type`s:

> N, T, P, G, R, S, M, D, C, X, A, or Z, which stand for nuclide, target, parent, daughter, reaction, subject, measured, deduced, calculated, other subject, mass range, and charge range, respectively.

The type of data for `value` changes based on the value of the `type`.
For `type`s N, T, P, and G, the `value` is a nuclide written in the form AX with A equal to the mass number, and X equal to the chemical symbol.
The value for A may have any number of digits.
X may be one, two, or three letters.
The `subkey` variable is used to link together multiple selectors of the same keyword sentence.

%- TODO Provide an example of multiple selectors being connected

%- ROBY write a paragraph that factually states your final representation
An example of the final data representation used by the work is shown in figure {@blk:rawNSRJSON}.
The `_id` is used as the unique identifier in the MongoDB collection.
`year` is an integer and represents the year the resource was published.
`history` is an array that contains encoded information representing dates when the original NSR document was added and/or modified.
`code` is a copy of `CODEN` from the NSR data.
`type` describes what publication type (journal, thesis, conference paper, etc) the resource is.
`reference` is a copy of `REFRENCE` from the NSR data.
`authors` is an array of string elements representing the authors who published that resource.
`title` is a string, formatted for \LaTeX, that represents the title of the resource.
`keywords` is an array of strings that represent the KEYWORD sentences as described in the NSR manual.
`selectors` is an array of objects that contain the type, value, and subkey information generated by the keyword entry by the NSR.
Finally, the `DOI` is a Digital Object Identifier for the published resource.

``` {#blk:rawNSRJSON .json caption="An example NSR entry showing the final NSR JSON structure." fontsize=\footnotesize breaklines=true baselinestretch=1}
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

## The Database - MongoDB

[MongoDB](https://www.mongodb.org) is an open source NoSQL document store database system.
It was chosen because it is open source, easy to use, well supported, and the author is familiar with it.
Additionally it has nice features such as JSON support, an aggregation framework, and is easy to setup.
Other NoSQL databases like CouchDB support JSON and may have been acceptable as well.
MongoDB and CouchDB are both comparatively new database systems.
Postgres also supports JSON and is a mature database system.
Because MySQL is so prevalent it is worth mentioning explicitly why it was not chosen.
Despite the prevalence of MySQL, it was not chosen because it is a relational database and would thus not support the arrays in the data schema as outlined in [Data Preparation](#data-preparation).

A document store database such as MongoDB enables simple transformations of each NSR entry into a Mongo document (as discussed in [Data Preparation](#data-preparation)).
In a relational database system such as MySQL, each NSR entry would have to be split up, with different pieces of information populating different database tables.
Authors would be a type of entity in their own authors table, that each NSR entry in an NSR table would link to.
This type of relationship would be necessary for keywords and selectors as well.

As reported in [Data Representation](#data-representation) section, a JSON structure was constructed for each entry in the NSR database.
To populate the MongoDB database, these JSON structures were flattened into a single file, and imported into a MongoDB collection using the [`mongoimport` tool](http://docs.mongodb.org/manual/reference/program/mongoimport/).

### Indexing the Data
%- TODO can I tie this to anything Borris says about usage?
The most common operations on the correctly formated data after it was imported to MongoDB were searches or lookups.
To optimize this process we instruct MongoDB to index our data on important or frequently referenced fields such as "authors" and "year".
Indexing speeds up search queries in a manner similar to sorting a series of data elements.
MongoDB allows for many different types of indexes.
We create a single field indexes on the `_id`, `year`, `authors`, `selectors.type`, `selectors.value`, and `type` fields[^dot-notation].
This enables fast lookups for documents[^documents] according to the indexed fields.
For example it would be quick to find all the documents with type 'Journal' and year '1983'.
Where as the search for all documents with keyword "fisson" has not been optimized by the previously mentioned indexes.

[^dot-notation]: We use dot notation to denote that `selectors.type` refers to the `type` field of the `selectors` object.
[^documents]: Recall that MongoDB is a 'document' store database, and each NSR entry has been imported as a 'document' in the MongoDB collection.

```
insert a single example of the speedup we get with indexing
```

Since our author field is really an array of string elements, we could use a single field index on it without issue.
However, on fields such as the title or keywords a single field index does not locate partial matches.
For example, searching for documents with the word "neutron" in the title will not be sped up by a single field index.
For this task we leverage MongoDB's text indexes.

```
this text field discussion is not useful
```

%- Other concerns and code
There are additional concerns in hosting a database server and web application.
Typically a database is hosted on a dedicated server, separate from the web application, and perhaps not publicly facing.
These issues, and additional performance configurations will not be further addressed in this work.
They are however addressed in the code repository for this work available at `include a link!!!`.

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

There are some additional, more straightforward, operations such as `sort`, `limit`, `skip`, and `redact`.
The final results from an aggregation query can be saved to a collection using the `out` operation, or can be returned to the calling application through the many MongoDB APIs.

%- Documentation links
MongoDB is currently a popular database and there exists tutorials and example applications.
The MongoDB documentation is available at [docs.mongodb.org/manual](http://docs.mongodb.org/manual/).
All MongoDB interactions in this work use the python driver, `pymongo`.
The `pymongo` documentation can be found at [api.mongodb.org/python/current](http://api.mongodb.org/python/current/).

### Future Work
An extension to this work is to support additional database systems.
The prevalence of MySQL is motivation to support it.
However, in continuing with the desire to use a NoSQL database system, the work could be extended to support CouchDB with relative ease.


Data Summarization
==================
%- What? Created summaries and ranked info in a web app.
%- Why? Visualizations are important in understanding data. As are summaries and rankings.
%- How? MongoDB aggregations to D3 charts.

```
NOTE: This section currently has weak mentions of the actual application built.
With no real introduction of the application, mentions of it feel out of place...
```

Through data summarization we can learn the first-order characteristics of the data set.
The goal is obtain a broad perspective of the structure and composition of the data set.
For example, there are 212835 entries in the data set[^our-data-set] that span from 1896 to 2014.
We can answer questions such as "What percentage of all entries are journal articles?"
As Table @tbl:typesAll shows, the majority of the document types in the NSR are journal articles.
The next most popular are reports, and conference preceedings.
There are fewer books and preprint than there are unknown and unlabel entries.
The python code to produce these results is shown in Snippet @typesAllCode.

[^our-data-set]: Recall that the data set used in this work is a snapshot of the entire NSR data as dowloaded in January 2014.

Type       Amount   Percentage
----       ------   ----------
THESIS     1934     0.908\%
PREPRINT   779      0.366\%
BOOK       107      0.050\%
PC         1661     0.780\%
CONF       16836    7.910\%
REPT       24554    11.53\%
JOUR       165477   77.74\%
UNKNOWN    1487     0.698\%

Table: The amounts of each type of NSR entry in the whole data set. {#tbl:typesAll}

``` {#blk:typesAllCode .python caption="The aggregation query to get amount of types in the NSR." fontsize=\small baselinestretch=1}
import pymongo
db = pymongo.MongoClient()['masters']
db.NSR.aggregate([{"$group": {"_id": "$type", "count": {"$sum": 1}}}])
```

%- Slice of author
The summarization analysis can conveniently be applied to subsets of the data.
The data can be filtered to only involve a particular author.
This provides answers to questions such as "what percentage of A.J.Sarty's contributions were journal articles?"
Table @tbl:typesAJSarty shows A.J.Sarty has primarily worked on journal articles, with one preprint article.
The code for this query, which is shown in Snippet @blk:typesAJSarty, simply adds a `$match` operation to Snippet @blk:typesAllCode.

Type       Amount   Percentage
----       ------   ------
PREPRINT   1        5\%
JOUR       21       95\%

Table: Different types of NSR entries for author A.J.Sarty. {#tbl:typesAJSarty}

``` {#blk:typesAJSarty .python caption="Aggregation query to get the types of an author's publications." fontsize=\small baselinestretch=1}
import pymongo
db = pymongo.MongoClient()['masters']
db.NSR.aggregate([{"$match": {"authors": "A.J.Sarty"}},
                  {"$group": {"_id": "$type", "count": {"$sum": 1}}}])
```

%- Slice of time
The data can also be partitioned or sliced in time.
This also use to ask questions such as "what percentage of 1989 entries are journal articles?"
As we can see from Table @tbl:types1989 the $72.06\%$ of the NSR entries are journal articles.
This percentage is different than that of the whole work (as shown in Table @tbl:typesAll), but not by a significant amount.
It does highlight a particular interest that the data is not uniform.
%- To understand how the data changes with resepect to time we can use visualizations.

Type       Amount   Percentage
----       ------   ----------
THESIS     16       0.398\%
PREPRINT   21       0.523\%
BOOK       7        0.174\%
PC         14       0.348\%
CONF       331      8.248\%
REPT       732      18.24\%
JOUR       2892     72.06\%

Table: Different types of NSR entries in 1989. {#tbl:types1989}

%- Rankings
For a particular selection of NSR data, it is useful to know the rankings for important data fields.
For example, when a user searches an author on the application they are presented with a ranked list of their most frequent coauthors, keywords, and nuclides.
This type of analysis can of course be applied to the whole dataset as well.
Table {#tbl:prolific-authors} shows the authors with the highest count of NSR entries in the entire database.

```
NOTE: This section needs more discussion...
```

Author              Number of Publications
------              ----------------------
R.V.F.Janssens                992
M.P.Carpenter                 787
A.Faessler                    736
J.H.Hamilton                  703
I.Ahmad                       694
B.A.Brown                     690
I.Y.Lee                       671
W.Greiner                     637
A.O.Macchiavelli              624
T.L.Khoo                      614

Table: The top 10 most prolific authors in the NSR database. {#tbl:prolific-authors}

## Visualizations

Visualizations provide a summary of data at a glance.
Consider Figure {@fig:nsrhisto}, it quickly demonstrates that the majority of NSR entries were published in the last 50 years.

![A histogram of all NSR entries published from 1896 to 2014](images/NSRyearlyhistogram.pdf){#fig:nsrhisto}

The low publication numbers in the first 50 years turned out to be a useful property of the dataset.
It permitted testing data analysis code on small portions of the data (years pre 1950), before applying the code to the full dataset.
This was particularly helpful in developing the network analysis code and visualizations, as post 1950 the networks can be too large to process quickly.

There are two primary visual methods for displaying summary information in this application: histograms and pie charts.
The histograms, as seen in Figure @fig:nsrhisto, can show how a particular slice of the database evolves over time.
It is also useful to see amounts in categorical data.
Figure @fig:viz-types-histo shows the amount of each different document type in the NSR database.

![A histogram showing the contribution types](images/viz-types-NSR-histo.png){#fig:viz-types-histo}

The pie charts are useful to demonstrate the relative sizes of portions of the data.
Again the docuent type amounts are shown in Figure @viz-types-pie as a pie chart.
Figures @fig:viz-types-histo and @fig:viz-types-pie are visual representations of the data in Table @tbl:typesAll.

![A pie chart showing the types of NSR entries](images/viz-types-NSR-pie.png){#fig:viz-types-pie}


Network Analysis and Visualization
==================================
%- What? Enabled graph data structure operations on NSR author data.
%- Why? This is not possible with existing NSR data... Why useful?
%- How? Using python library Networkx to build graph datastructures. D3 and Gephi for visualizations
All previous analysis of the NSR data has focused on the content of each entry in a flat manner.
However, the list of authors of a paper can be used to build a network or graph of the authors.
(In this work, the word 'graph' will always refer to the mathematical representation of a set of objects and their links.)
The first graphs constructed in this work had each node represent an author, and each edge or link represent a coauthorship.
An example can be seen in Figure @fig:small-graph-1940.

![A single component of the 1940 author graph.](images/small-graph-1940.pdf){#fig:small-graph-1940}

Figure @fig:small-graph-1940  is a single component of the complete 1940 author graph (shown in Appendix Figure @fig:complete-graph1940).
It has 7 nodes, each is a different author, and 12 edges which represent a coauthorship between the two nodes.
`M.Ikawa` has publish with everyone in the graph.
We can use this knowledge in a database query to get the papers that make up this graph (see @blk:graph1940s).

``` {#blk:graph1940s .python caption="Python code to get the NSR entries in Figure @fig:small-graph-1940." fontsize=\small baselinestretch=1}
import pymongo
db = pymongo.MongoClient()['masters']
db.NSR.find({"year": 1940, "authors": "M.Ikawa"})
```

The results of the database query (shown in Snippet @blk:graph1940s-results) reveal there were 3 papers in 1940 that contributed to this graph.
One paper titled "Fission Products of Uranium by Fast Neutrons" has authors `Y.Nishina`, `T.Yasaki`, `K.Kimura`, and `M.Ikawa`.
The other papers, titled "Neutron Induced Radioactivity in Columbium" and "Artificial Radioactivity Induced in Zr and Mo" respectively are both authored by `R.Sagane`, `S.Kojima`, `G.Miyamoto`, and `M.Ikawa`.
This demonstrates a limitation in the current graph visualization.
`G.Miyamoto` and `M.Ikawa` have published together twice (in 1940) but their edge looks no different than the edge between `Y.Nishina` and `T.Yasski`.
Most graph libraries allow for a lot of customization and embedding of data.
In a future work, the graphing routines could be modified to represent the number of copublications along the graph edges.
This could be done as a text label, or perhaps an added thickness to the edge line.

``` {#blk:graph1940s-results .json caption="JSON documents for the NSR entries in Figure @fig:small-graph-1940." fontsize=\footnotesize breaklines=true baselinestretch=1}
{
  "_id": "1940NI03",
  "year": 1940,
  "history": [
    "A19800701",
    "M19860317"
  ],
  "code": "JOUR PHRVA 58 660",
  "type": "JOUR",
  "reference": "Phys.Rev. 58, 660 (1940)",
  "authors": [
    "Y.Nishina",
    "T.Yasaki",
    "K.Kimura",
    "M.Ikawa"
  ],
  "title": "Fission Products of Uranium by Fast Neutrons",
  "DOI": "10.1103\/PhysRev.58.660"
}
{
  "_id": "1940SA06",
  "year": 1940,
  "history": [
    "A19800701",
    "M20010110"
  ],
  "code": "JOUR PPMJA 22 174",
  "type": "JOUR",
  "reference": "Proc.Phys.-Math.Soc.Japan 22, 174 (1940)",
  "authors": [
    "R.Sagane",
    "S.Kojima",
    "G.Miyamoto",
    "M.Ikawa"
  ],
  "title": "Neutron Induced Radioactivity in Columbium"
}
{
  "_id": "1940SA08",
  "year": 1940,
  "history": [
    "A19800701",
    "M19980402"
  ],
  "code": "JOUR PHRVA 57 1179",
  "type": "JOUR",
  "reference": "Phys.Rev. 57, 1179 (1940)",
  "authors": [
    "R.Sagane",
    "S.Kojima",
    "G.Miyamoto",
    "M.Ikawa"
  ],
  "title": "Artificial Radioactivity Induced in Zr and Mo",
  "DOI": "10.1103\/PhysRev.57.1179"
}
```

%- Multiple components
We can also visualize graphs with multiple components.
Disconnected components, like those visible in Figure @fig:first50years, are groups of authors who have published together and not with any author in another component.
There is only ever one node per author identifier.
Most graphs produced from yearly data queries will have multiple components.
As the data slice forming the graph gets larger the main fully connected component gets much larger than the rest of the components.
%- I did some analysis on this for the whole dataset

![Network graph of the first 50 years of NSR data](images/First-50-Years-NSR-Authors.pdf){#fig:first50years}

%- Large graphs
The visualization of large graphs is computationally intensive and produces complex images.
All the graphs produced in the web application are done so using a modified version of [Mike Bostock's Force Directed Graph example](http://bl.ocks.org/mbostock/4062045).

%- Size
Above a certain size, these images are of questionable usefulness.
The resulting shape or 'layout' of a graph is dependent on the graph layout algorithm used.
Figures @fig:nsr1989graphyifanhu and @fig:nsr1989graph use the exact same input data but two different layout algorithms (Yifan Hu ML and Atlas 2 respectively).
The position of the nodes and edges in these figures are products of the layout algorithm used.
The colour of the nodes is determined by Gephi's modularity function @gephiModularityAlgorithm.
The modularity of a graph is a measure of structure.
The graph is partitioned into communities where there are dense intra-community connections and sparse inter-community connections.

![Network Graph of 1989. Nodes are authors coloured by modularity, and edges are a common publication.](images/NSR-1989-biggest-modularity-degree-yifanhuML.pdf){#fig:nsr1989graphyifanhu}

![Network Graph of 1989. Nodes are authors coloured by modularity, and edges are a common publication.](images/smNSR-1989-biggest-modularity.png){#fig:nsr1989graph}

## Nuclide Graphs
Almost any parameter can be used as a filter to produce an author network graph.
The selector values present an interesting opportunity in this case.
We can filter the NSR data to only include entries that involved a particular nuclide.
Figure @li11graph shows an author node graph for all the NSR entries that have `LI11` as a selector value.
All of the components have been kept in the visualization.

```
Include discussion on component size distributions.
```

![Network graph of authors publishing on Lithium-11](images/lithium11-graph.pdf){#fig:li11graph}

## Implementation
%- Citation
The Python library [Networkx](https://networkx.github.io) is used to create the graph data structures, which can then be sent to our visualization code, or be exported for analysis with other tools.
Networkx has a collection of algorithms and functions used to analyze and manipulate the graphs.
Such manipulations include identifying and sorting disconnected subgraphs within a slice of data.
For example, figures @fig:nsr1989graphyifanhu and @fig:nsr1989graph use only the largest connected graph of all the NSR entries in the year 1989.
There were !!! other smaller graphs disconnected from the largest graph in 1989.

## Future Work
Treating the NSR database as graph data opens up avenues for future work.
A graph with authors as nodes and their publications determining the edges provides a social network of collaborating scientists.
Thus the data is made available for future work in other fields such the social sciences or large network analysis.

Another area of interest is in graph clustering, the results of which could be compared to those from the [Cluster Analysis](#cluster-analysis) section.

### Exporting Graph Data
The Networkx library has support for writing the graph data structures to multiple file types.
They are written to a JSON object before being served to the web application, for example.
Additionally they can be written to `gexf`, `GML`, `GraphML` and [others](http://networkx.readthedocs.org/en/latest/reference/readwrite.html).
These files can then be imported into other analysis applications like Gephi.
Example code for exporting the 1989 data to `gexf` format is available at `include link!!!`.


Author Name Analysis
====================

The NSR database, before and after the data preparation in this work, contains mistakes, typos, and minor errors.
In this section, we describe the analysis which identifies and mitigates these issues.
Some terms must be defined.
We will use the word "author" (formatted plainly and without quotes) to refer to an individual human being who contributed to a work that is documented in the NSR database.
The term "identifier" (also formatted plainly and without quotes) will refer to the string of text that occurs in the database.
The actual identifier strings will always appear in a fixed width typeface.
For example, an author may be Andrew Valencik, and he may have more than one identifier such as `A.Valencik`, `A. Valencik`, and or `A.C.Valencik`.

This analysis locates multiple identifiers in the database that correspond to single authors.
This may be caused by typos, changes in formatting, and differences in style from one publication to the next.
Authors themselves may opt in some publications to be identified by more than one initial and only one in others.

Pritychenko reports 96200 unique authors in his 2014 paper @Pritychenko14.
However, at the end of the data preparation stage in this work, the database reported 100147 unique identifiers.
An accurate total author count is not particularly important for this work.
However, correctly identifying and including all authors when doing network analysis is important.

Currently there are 41254 unique identifiers that appear only once in the NSR database.
Some portion of those are author name variances that only occur once.
Knowing that portion is important to understanding something about the database; in the [Initial Author Clustering](#initial-author-clustering) section we investigated how the database changed as we removed identifiers (referred to as just "authors" in that section) below a publication threshold.
This analysis depends on correctly identifying the number of authors who have published a given number of times.
Typos in the list of authors render such an analysis in inaccurate.

After the data preparation and importing step the database contains identifiers `A.Herzan` and `A. Herzan`.
These two identifiers have 12 and 1 publication(s) respectively.
Although there are two identifiers in the database, it is highly improbable that the presence of a space in one indicates a second author.
In the [Further Analysis](#further-analysis) subsection we will discuss methods to determine if the multiple identifiers represent the same author.
In this subsection, the analysis described finds identifiers that are similar to one another.

%- Online vs offline
Searching for similar identifiers could happen either online (immediately after the user submits a query) or offline (before the app is presented to users).
Because our database is static and manually updated with new entries periodically, the offline approach makes sense.
An additional benefit to the offline approach is that it can be easily moderated and tweaked with user submitted suggestions.
The general problem is referred to as approximate string matching.
If the supplied query was `A.Herzan`, then `A. Herzan` would be considered an approximate string match.
This type of match could be found without much sophistication.
However, we want to also consider more difficult matches like `J.Svenne` and `J.P.Svenne`.
Approximate string matching libraries often use the Levenshtein Distance metric to compare strings.

### Levenshtein Distance
String edit distance measures such as the Levenshtein Distance offer an easy first approach to analyzing the author names.
The Levenshtein distance is one type of string metric to evaluate the difference between two sequences of characters.
A distance of 1 is attributed to every single character edit necessary to transform one of the input strings into the other.
Single character edits include an insertion of a character, a deletion, or a substitution.

```
TODO Present an example (for each: insertion, deletion, substitution)
```

The Python library [Jellyfish](http://jellyfish.readthedocs.org/en/latest/)  makes it quite easy to use a few different distance metrics.
Nevertheless, calculating any measure for all pairs of authors is a large task.
A quick estimate of $100,000$ authors means $5,000,000,000$ unique (unordered) pairs to calculate.
Thankfully this is not entirely prohibitive to calculate on modest hardware.
It does, however, produce a large amount of data, making filtering absolutely necessary.

A small Python script, using Jellyfish, was prepared to calculate the Levenshtein Distance for each author name pair.
Only pairs with a distance less than 4 were written to file.
This analysis reveals over 20 million author pairs for further analysis.

```
TODO Discuss pairs with a distance of 1
TODO Discuss pairs with a distance of 4
TODO Discuss limitations of "non informed" string edit distances.
```

### Transformations
Three simple string transformations have been constructed to locate similar identifiers.
The first stage transforms all the characters in the name string to lower case.
$1936$ author names become non-unique when reduced to only lower case letters.

``` {#blk:names-lower .text caption="Identifiers which become duplicates after transformation 1." fontsize=\small baselinestretch=1}
C.Le Brun	C.Le brun	C.le Brun
P.Fan	P.fan
A.De Waard	A.de Waard
R.Del Moral	R.del Moral
J.M.Van Den Cruyce	J.M.Van den Cruyce	J.M.van den Cruyce
```

The second stage takes the lower case identifiers and removes all spaces.
There are $2619$ identifiers that have duplicates when reduced to lower case letters with no spaces.

``` {#blk:names-nospace .text caption="Identifiers which become duplicates after transformations 1 and 2." fontsize=\small baselinestretch=1}
B.N.Subba Rao	B.N.Subbarao
R.M.Del Vecchio	R.M.DelVecchio	R.M.Delvecchio	R.M.del Vecchio
J.Adam, Jr.	J.Adam,Jr.
M.Le Vine	M.LeVine	M.Levine
C.Ciofi Degli Atti	C.Ciofi Degliatti	C.Ciofi degli Atti
C.Le Brun	C.Le brun	C.LeBrun	C.Lebrun	C.le Brun
```

Finally, we remove all punctuation as well, which results in $6561$ identifiers that are not unique.
A python script, `calc-author-name-transform-pairs.py` has been prepared to perform these transformations and write the identifiers which form duplicates to a file.

``` {#blk:names-nopunc .text caption="Identifiers which become duplicates after transformations 1, 2, and 3." fontsize=\small baselinestretch=1}
B.V.T.Rao	B.V.Trao
A.M.Laird	A.M<.Laird
H.-R.Kissener	H.R.Kissener
W.-X.Huang	W.-x.Huang	W.X.Huang
C.Le Brun	C.Le Brun,	C.Le brun	C.LeBrun	C.Lebrun	C.le Brun
```

As the progression of transformations shows, an identifier that becomes non-unique in transformation 1 will continue to appear in the output results of transformations 2 and 3.
Some authors have been represented up to 6 different ways.
Surnames composed of multiple words separated by spaces appear to be the most prone to multiple representations.
The output of transformation 3 provides a reasonable list to apply additional analysis to.
There are 3063 groups of identifiers identified as duplicates in the transformation 3 analysis (and 6561 identifiers in total).

We have reduced, by two orders of magnitude, the number of identifiers that should be subject to additional analysis.
With the transformed list, it is worth repeating analysis.
Performing the Levenshtein distance analysis on the 'nopunc' list will locate identifiers where an initial has been omitted as an edit distance of 1.
For example the edit distance of 'J.P.Svenne' and 'J.Svenne' is 2 before the transformations and 1 afterwards.
%- Sam Austin

Performing the Levenshtein distance analysis will still fall short of identifying identifiers where the first name is fully spelled out.
`Adam Sarty` and `A.Sarty` are both valid identifies for a single author.
An application to locate multiple identifiers of this type would require a significant modification to the existing string metrics.
There are many open source implementations of string distance functions, so a modification is not out of the question.

Another approach could simplify the list of authors while accepting potential loss of information.
The current number of unique identifiers after data preparation is $100147$, if we remove all identifiers that include "` the `" in their name we reduce to $98788$ identifiers.
This has the effect of removing collaborations from the author list.
This may or may not be desired for some analyses.
In attempting to find authors multiply represented in the database, this filtering is unlikely to have significant impact.
Identifiers representing collaborations are often long and have small string distances to one another as they informative part of their name is typically an acronym.

### Further Analysis
%- Clustering? no. Graph analysis.
%- Can I come up with a # of publication independent clustering schema?
%- Probably not, and so the graph analysis would be quite useful here!
%- Also use "Austin" S.M.Austin, Sam.Austin
Now that we have such a reduced list of candidate identifiers that may represent the same author, we can afford to run more expensive analysis on them.
The product of the analysis described above is a list of candidates which may represent cases of multiple identifiers for a single author.
To locate multiply-identified single authors, that candidate list must be examined.
Since the list in comparatively small we propose computation expensive analyses may be performed to achieve that end.
The expensive analysis should be comparing neighbors in the network.
We could find all the neighbours of two given nodes and see how many overlap.
With this we should also consider what the chance of having common neighbours is for any two random nodes.
A first approximation would be to consider the degree of the neighbours.
Common neighbours with a low degree are less likely to be common through random chance.
%- (!!! better example than the Curie's? !!!)
Note that this analysis likely falls short of addressing some copublishers with the same surname.
%- ROBY Except that if they are actually publishing together then the name appears twice in the same list.
%- ROBY If it's a variance or typo that shouldn't happen (because they are not publishing with themselves)


Association Mining
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

```
TODO: Work through an example and explain the algorithm.
```

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

There is a list association rules relating authors through their use of keywords.
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
Entry Number Cutoff   Papers Remaining   Difference
-------------------   ----------------   ----------
0                     212835
1                     187741             25094
2                     185404             2337
3                     183410             1994
4                     181315             2095

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
