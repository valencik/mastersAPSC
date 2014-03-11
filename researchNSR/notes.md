Representation
+ What defines a paper object?
- Authors, Keywords, [experiment, theory, review]?

Initial Grouping
+  Multiple views of clustering
-  Group based on author, techniques, elements...

Meta-Clustering
+  Regroup/cluster based around a predetermined group
-  Discover 'research groups' based on authors publishing together, now group papers by this.

Regex
+ To one line `:%s/\(^<.*\)&\(\_.[^<].*$\)/\1\2/g`
+ To JSON `:%s/<\(.*\)>\(.*\)&/"\1": "\2",/g`
+ Start JSON struct `:%s/^\("KEYNO\)\s\+": "\(.*",\)/{ \1": "\2/g`
+ End JSON structure `:%s/"DOI\s\+": "\(.*\)",/"DOI": "\1" }/g`
