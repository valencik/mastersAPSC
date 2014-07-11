//Make collection for flattening.
db.NSR3.aggregate(
   {$match: {year: 1971}},
   {$project: {year: 1, type: 1, authors: 1, reactions: 1, structure: 1, radioactivity: 1, physics: 1, moments: 1, compilation: 1, masses: 1}},
   {$out: "cluster"}
)

//Flatten data for clustering in python
db.cluster.find({}).forEach(function (x) {
    switch(x["type"]){
        case 'JOUR': x["type"] = 1; break;
        case 'CONF': x["type"] = 2; break;
        case 'REPT': x["type"] = 3; break;
        case 'BOOK': x["type"] = 4; break;
        case 'PC': x["type"] = 5; break;
        case 'THESIS': x["type"] = 6; break;
        case 'PREPRINT': x["type"] = 7; break;
        default: x["type"] = 8;
    }

    x["authors"] = x["authors"].length;

    (typeof x["reactions"] != 'undefined') ? x["reactions"]=1 : x["reactions"]=0;
    (typeof x["structure"] != 'undefined') ? x["structure"]=1 : x["structure"]=0;
    (typeof x["radioactivity"] != 'undefined') ? x["radioactivity"]=1 : x["radioactivity"]=0;
    (typeof x["physics"] != 'undefined') ? x["physics"]=1 : x["physics"]=0;
    (typeof x["moments"] != 'undefined') ? x["moments"]=1 : x["moments"]=0;
    (typeof x["compilation"] != 'undefined') ? x["compilation"]=1 : x["compilation"]=0;
    (typeof x["masses"] != 'undefined') ? x["masses"]=1 : x["masses"]=0;
    db.cluster1.save(x);
});

//Split SELECTRS into paramType, paramValue, and linkVar
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
