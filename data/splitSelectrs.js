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

db.cluster.find({}).forEach(function (x) {
    switch(x["type"]){
        case 'JOUR':
            x["type"] = 1
            break;
        case 'CONF':
            x["type"] = 2
            break;
        case 'REPT':
            x["type"] = 3
            break;
        case 'BOOK':
            x["type"] = 4
            break;
        case 'PC':
            x["type"] = 5
            break;
        case 'THESIS':
            x["type"] = 6
            break;
        case 'PREPRINT':
            x["type"] = 7
            break;
        default:
            x["type"] = 8
    }

    (typeof x["reactions"] != 'undefined') ? x["reactions"]=1 : x["reactions"]=0;
    (typeof x["structure"] != 'undefined') ? x["structure"]=1 : x["structure"]=0;
    (typeof x["radioactivity"] != 'undefined') ? x["radioactivity"]=1 : x["radioactivity"]=0;
    (typeof x["physics"] != 'undefined') ? x["physics"]=1 : x["physics"]=0;
    (typeof x["moments"] != 'undefined') ? x["moments"]=1 : x["moments"]=0;
    (typeof x["compilation"] != 'undefined') ? x["compilation"]=1 : x["compilation"]=0;
    (typeof x["masses"] != 'undefined') ? x["masses"]=1 : x["masses"]=0;
    db.cluster1.save(x);
});

                switch(queryType.graph){
                    case 'discreteBarChart':
                        nv.addGraph(discreteBarChart(selector, title, data, callback));
                        break;
                    case 'multiBarChart':
                        nv.addGraph(multiBarChart(selector, title, data, callback));
                        break;
                    case 'pieChart':
                        nv.addGraph(pieChart(selector, title, data, callback));
                        break;
                    case 'lineWithFocusChart':
                        nv.addGraph(lineWithFocusChart(selector, title, data, callback));
                        break;
                    default:
                        console.log("# No valid graph type detected.")
