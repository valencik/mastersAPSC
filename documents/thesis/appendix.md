Appendix
========

![Number of entries contributed by an author related to the number of years the author has published.](images/nyne-heatmap.png){#fig:nyne-linear}

![Number of coauthors associated with an author related to the number of years the author has published.](images/nync-heatmap.png){#fig:nync-linear}

![Number of coauthors associated with an author related to the number of entries the author has published.](images/nenc-heatmap.png){#fig:nenc-linear}

![Complete 1940 author graph.](images/complete-graph-1940.pdf){#fig:complete-graph-1940}

``` {#blk:papersWithoutNAuthors .javascript caption="The mongoshell code to determine the results shown in Table \ref{tbl:papersWithoutNAuthors}" fontsize=\small baselinestretch=1 breaklines=true, linenos=true }
for (i=0; i<=10; i++){
    db.NSR.aggregate([
        {$project: {_id: 1, authors: 1, year: 1}},
        {$unwind: "$authors"},
        {$group: {_id: "$authors", numEntries: {$sum: 1}, papers: {$addToSet: "$_id"}}},
        {$match: {"numEntries": {$gte: i}}},
        {$unwind: "$papers"},
        {$group: {_id: "$papers", uniqueKey: {$sum: {$multiply: [1, 0]}}}},
        {$group: {_id: "$uniqueKey", papersRemaining: {$sum:1}}}
    ], {allowDiskUse: true})
    .forEach(function(myDoc) {
        print( "user: " + myDoc.papersRemaining ); }
    ) }
```


\pagebreak


The code used to prepare, manipulate, and transform the NSR dataset is included in this appendix.
The organization loosely follows the order one might follow to recreate this work.
Note that the most updated version of these programs should be available at [https://github.com/valencik/mastersAPSC](https://github.com/valencik/mastersAPSC).


## prepare-data.py

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{python}{../../data/prepare-data.py}


\pagebreak

## update-database.py

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{python}{../../data/update-database.py}


\pagebreak

## calc-author-name-dist.py

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{python}{../../data/calc-author-name-dist.py}


\pagebreak

## calc-author-name-transform-pairs.py

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{python}{../../data/calc-author-name-transform-pairs.py}


\pagebreak

## calc-cosine-sims.py

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{python}{../../data/calc-cosine-sims.py}


\pagebreak

## parse-arules-output.py

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{python}{../../data/parse-arules-output.py}


\pagebreak

## nsr_app.py

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{python}{../../web/nsr_app.py}


\pagebreak

## main.js

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{javascript}{../../web/static/main.js}


\pagebreak

## force-graph.js

\inputminted[baselinestretch=1, breaklines=true, linenos=true]{javascript}{../../web/static/force-graph.js}

\pagebreak

