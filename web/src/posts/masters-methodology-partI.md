---
title: "Methodology Part I"
date: 2014-07-21
template: posts.hbt
preview: A rough overview of NSR project's process to date.
---
I first contacted Boris at the NNDC and requested a raw data dump of the NSR database.
He was kind enough to upload a copy to a SMU server.
The raw data came in around 180mb but compressed to about 20mb.

The data format is proprietary (not confirmed) to the NSR.
Initial steps involved learning the given data representation.
The NSR manual (link to pdf) was more than helpful here.

Preliminary parsing and translating of the NSR data to JSON was done in vim.
The human coded parts of the NSR is not without errors.
I have made a conscious goal to inform the NNDC of the errors for future correction.
Currently these errors are only "recorded" in the sense that I have rules to fix them in the parsing scripts.

The NSR data can be turned into valid JSON data with simple search and replace commands powered by regex.
However, some modification to the data representation require additionally handling.
At the current stage this is still done with vim script, but should likely be migrated to python in the future.

Before the data representation was finalized, the process of data visualization came to task.
This has been web driven using nvd3, powered by D3.js from the beginning.
In developing various visualizations did I begin to piece together high level architecture of the data representation and knowledge base.
Ideally we want to separate data models and data views.
Then the user constructs a query which is parsed and resolved into a set of data that is fit into a range of data models and then data views.

Python, R, JS, vim, unix
Natural language
information retrieval
data mining
scikit-learn
problems.
