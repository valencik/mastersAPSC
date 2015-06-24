Masters of Science in Applied Science
=====================================
 

Timeline
========

May 21 -  Outlined Application and Algorithmic development
June 11 - Planned features
June 18 - Began association mining
June 25 - Finishing association mining 
July  2 - Clustering data
July 16 - Connecting app to KDD results
July 26 - Prepare rough draft?
July 30 - Away
August  6 - Away
September - Finish
October  - Submit to committee
November - Defend


Tasks to complete
=================

## Writing
+ Begin introduction and theory section
+ Use literature review from APSC course as guideline
+ Write out parts of the thesis in jot notes and goals

## Analysis
+ Who should a given author work with?
  - Authors with similar keywords that the original author has not already published with
+ What keyword pairs have the highest author correlation
+ Waveforms of a datatype's occurrences wrt time

## Testing
+ Test different index types, perhaps composite has advantages

## App
+ Write user level documentation
+ Single author view
+ Single keyword view
+ Single year view
+ Enable better searching
+ Construct an API for app usage
+ Enable filters and cutoffs, particularly for graph results

##Data
+ Make author collection that can be searched for partial author names
  - unwind on authors, remove initials, save as new collection, index
+ Make keyword collection similar in purpose to author collection
+ Collection for special search terms?
  - Or can this be handled at app level?
+ Calculate similarity matrices for a submit of authors in repeatable manner
  - This does not need to be done in an automated/live fashion yet
+ Cluster the authors using the similarity results

## Maintenance (low priority)
+ Remove the dependency on nvd3
+ Create a script for mongo importing and index creation

## Wishlist
+ Data overlay on chart of nuclides (heatmap)
+ Cluster waveforms of time series data
