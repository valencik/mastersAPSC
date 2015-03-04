---
title: "Methodology Part I"
date: 2014-07-21
template: posts.hbt
preview: A rough overview of the history of the NSR project.
---
I first contacted Boris at the NNDC and requested a raw data dump of the NSR database.
He was kind enough to upload a copy to a SMU server.
The raw data came in around 180mb but compressed to about 20mb.
This represented all NSR entries from 1896 to 2014 that had been added as of January 2014.

The NSR data format appears to be proprietary to the NSR.
The [Nuclear Science References Coding Manual](http://www.bnl.gov/isd/documents/35620.pdf) was more than helpful here.
Initial steps involved learning the given data representation.

Preliminary parsing and translating of the NSR data to JSON was done in vim.
The human coded parts of the NSR are not without errors.
I have made a conscious goal to inform the NNDC of the errors for future correction.
Currently these errors are only "recorded" in the sense that I have rules to fix them in the parsing scripts.

The NSR data can be turned into valid JSON data with simple search and replace commands powered by regex.
However, some modification to the data representation requires additional handling.
At the current stage this is still done with vim script, but should likely be migrated to python in the future.

Before the data representation was finalized, the process of data visualization came to task.
This has been web driven using nvd3, powered by D3.js from the beginning.
In developing various visualizations, I began to piece together a high level architecture of the data representation and knowledge base.
Ideally we want to separate data models and data views.
Then the user constructs a query which is parsed and resolved into a set of data that is fit into a range of data models and then data views.
This will present itself as a variety of tools for selecting data and then another variety of tools for visualizing that data.

Currently the data is stored in a database (MongoDB) and can be queried over a web interface.
However, the data as also been accessed through python for usage with the machine learning library [scikit-learn.](http://scikit-learn.org/stable/)
Staying put in a single language/environment (Python, R, JS, vim, unix) has proven difficult for me.
This is likely due to a lack of familiarity with the data mining techniques at hand.

<!--
Natural language
information retrieval
data mining
scikit-learn
problems.
-->
