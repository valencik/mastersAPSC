Masters of Science in Applied Science
=====================================
 
###Andrew Valencik  

Schedule
========

May 21 -  Outlined Application and Algorithmic development
May 28 -   
June  4 -   
June 11 -   
June 18 - Planned finish date (150 pages)  
June 25 - Final draft to Roby  
July  2 - Thesis submitted to committee  
July 16 - 
July 30 - 
August  6 - 
August 13 - Defend
August 20 - Submit corrections  
August 27 -
September  3 - 
September 10 - 


Tasks to complete
=================

#Highest level
+ Mine the data (CS), come up with a statement (physics)
+ Label, thesis necessary and wants

## Writing
+ Begin introduction and theory section
  - Use literature review from APSC course as guideline
+ Write out parts of the thesis in jot notes and goals

## Analysis
+ Who should a given author work with?
  - Authors with similar keywords that the original author has not already published with
+ What keyword pairs have the highest author correlation
+ Waveforms of a datatype's occurrences wrt time
+ Cluster waveforms

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
+ Remove dependencies on metalsmith
+ Remove the dependency on nvd3
+ Remove vim dependency for data cleaning/parsing/formatting
  - Look into node modules for regex and parsing
+ Create a script for mongo importing and index creation

## Wishlist
+ Data overlayed on chart of nuclides
  - built a heatmap of search results
