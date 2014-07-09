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

%g/^<KEYWORDS>/ s/<KEYWORDS>\([NRAC]\u\{4,}\) \([RSMP]\u\{4,}\) \(.*\)&$/"\1 \2": "\3",/

Split up the SELECTRS
From Glavin:

db.NSR2.find({}).forEach(function (x) {
    var old = x["SELECTRS"] || "";
    var s = old.split('.');
    var n = [];
    for (var i = 0, len = s.length; i < len; i++) {
        var v = s[i].trim();
        // Check for valid entry
        if (!v) continue;
        // 
        var d = {};
        //console.log(v);
        var t = v.split(':');
        d['paramType'] = t[0];
        var t2 = t[1].split(';');
        d['paramValue'] = t2[0];
        d['linkVar'] = t2[1];
        n.push(d);
    }
    x["SELECTRS"] = n;
    // save to a new one
    db.NSR3.save(x);
});


\([NRAC]\u\{4,} [RSMP]\u\{4,}\|[NRAC]\u\{4,}\)

“yes”: {"sentence": “Hello”},
“nope yeah”: {"sentence": “Derp”},
