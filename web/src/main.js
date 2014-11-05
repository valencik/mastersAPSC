// Wait for DOM to finish loading.
$(document).ready(function() {

    //Enable debugging output
    var verbose = true;

    //Create the unique() function using a set
    var unique = function(array) {
        var o = {}, i, l = array.length, r = [];
        for(i=0; i<l;i+=1) o[array[i]] = array[i];
        for(i in o) r.push(o[i]);
        return r;
    };

    //Server aggregation requests
    var aggregate = function(collection, pipeline, options, callback) {
        $.get(
            "/api/v1/"+collection+"/aggregate",
            {
                "pipeline": JSON.stringify(pipeline || []),
                "options": JSON.stringify(options || {})
            }
        ).done(function(results) {
            return callback && callback(results);
        });
    };

    //Aggregation and nvd3 graph generation
    var graph = function(selector, title, collection, pipeline, options, queryType, callback) {
        aggregate(collection, 
            pipeline,
            options,
            function(results) {
                if(verbose){console.log("Graph: %s", queryType.graph);};
                if(verbose){console.log("Returned array size="+results.length);};
                
                switch(queryType.type){
                    case 'yearly':
                        var data = [{
                            key: title,
                            values: results
                        }];
                        break;
                    case 'yearlyMultiType':
                        //initial the data array
                        data = [];
                        types = ["JOUR", "REPT", "CONF", "THESIS", "PC", "UNKNOWN", "PREPRINT", "BOOK"];
                        for (var i=0; i< types.length; i++) {
                            data[i] = {key: types[i], values: []};
                            for (var year=queryType.minYear; year<=queryType.maxYear; year++) {
                                    data[i].values[year-queryType.minYear] = {x: year, y: 0}
                                } 
                        }

                        //populate the data array with results
                        for (var i=0; i< types.length; i++) { //over all types
                            var indexT = null;
                            for (var ti=0; ti < results.length; ti++) {
                                if(results[ti].key === types[i]) { //find a matching type in results[]
                                    indexT =  ti;
                                    //if(verbose){console.log(types[i] +"--->"+ results[indexT].key);};
                                    break;
                                } 
                            } //end of results.length matching
                            if (indexT == null) {break;} //if we didn't find a match, move to new type
                            for (var year=queryType.minYear; year<=queryType.maxYear; year++) { //over all years
                                for (var mi = 0; mi < results[indexT].values.length; mi++) { //over all returned years in results
                                    if(results[indexT].values[mi].x === year) {
                                        data[i].values[year-queryType.minYear] = {x: year, y: results[indexT].values[mi].y} 
                                    }
                                    else { continue; }
                                }

                            } 
                        }
                        break;
                    default:
                        console.log("Error: No queryType.type detected.");
                }//end of switch queryType.type
        
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
                }

            });//end of aggregate callback
    };//end of graph function

    var search = $("#omnisearchform");
    search.submit(function(ev){

        //queryterm is the user inputted search text
        var searchterms = search.serializeArray();
        var queryterm = searchterms[0].value;
        if(verbose){console.log("queryterm:"+queryterm);};

        //Break the queryterm into key:value pairs
        queryItems = queryterm.split(/ (?=\w+:)/);

        //Remove old charts
        $("#billboard").remove();
        $("#charts").empty();

        switch (queryItems[0].split(":")[0]){
            case 'author':
                authorName = queryItems[0].split(":")[1]
                if(verbose){console.log("Searching for author "+authorName);};
                $("#charts").append('<svg id="authorSearch"></svg>');

                // Copy of prolific authors
                queryType = {type: "yearly", graph: "pieChart", minYear: 1896, maxYear: 2014}
                graph("#charts svg#authorSearch", "NSR Data", "NSR", 
                    [
                         //Broken: {$match: {$text: {$search: authorName}},
                         { $match: {authors: authorName}},
                         { $unwind: "$authors"},
                         { $group: { _id: "$authors", total: { $sum: 1} } },
                         { $sort: {total: -1} },
                         { $limit: 20 },
                         { $project: {_id: 0, label: "$_id", value: "$total" } }
                    ], {},
                    queryType,
                    function(chart, data){
                        chart.labelThreshold(.01)
                        .donut(true).donutLabelsOutside(true).donutRatio(0.3)
                        .showLabels(true).showLegend(true);
                    }
                );
                break;
                
            case 'collab':
                collabType = queryItems[0].split(":")[1]
                if(verbose){console.log("Search collabType: "+collabType);};

                var reYearArray = /(?:^(\d{4})-(\d{4})$)|(?:^(\d{4}))/.exec(collabType);
                if (reYearArray){
                    if(reYearArray[3]){
                        var matchObject = { "$match": {"year": parseInt(reYearArray[3])}};
                    }
                    if(reYearArray[1] && reYearArray[2]){
                        var matchObject = { "$match": {"year": {"$gte": parseInt(reYearArray[1]), "$lte": parseInt(reYearArray[2])}}};
                    }
                }
                if(verbose){console.log(reYearArray);};
                if(verbose){console.log(matchObject);};


                // Building force-directed graph
                aggregate("NSR", 
                    [
                         matchObject,
                         { $project: {_id: 0, authors: "$authors"}}
                    ], {},
                    function(results){
                        authorArrayFDG(results);
                    }
                ); //end of aggregate
                break;
                
            default:
                //Remove old charts, put in new ids
                $("#charts").append('<svg id="search"></svg>');

                // Multi Bar Chart
                queryType = {type: "yearlyMultiType", graph: "multiBarChart", minYear: 1896, maxYear: 2011}
                graph(
                    "#charts svg#search", 
                    "NSR Data", 
                    "NSR", 
                    [
                          {$match: {$text: {$search: queryItems[0]}}},
                          {$group: { _id: {type: "$type", year: "$year"}, total: { $sum: 1} } }, 
                          {$sort: {"_id.year": 1}},
                          {$group: {_id: "$_id.type", values: {$push: {x: "$_id.year", y: "$total"}}}}, 
                          {$project: {_id:0, key: "$_id", values: "$values"}}
                   ],
                    {},
                    queryType,
                    function(chart, data) {
                        //chart.xAxis.tickValues([1899,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010]);
                        chart.reduceXTicks(true);
                    }
                );//end multibar graph
        }

        ev.preventDefault();
    });//end of search


//
//   GRAPH MODELS
//

    //Define discreteBarChart
    discreteBarChart = function(selector, title, data, callback) {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })    //Specify the data accessors.
            .y(function(d) { return d.value })
            .staggerLabels(false)
            .tooltips(true) 
            .showValues(false)
            .transitionDuration(350)
            ;

        callback && callback(chart);
        d3.select(selector)
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
      };

    //Define pieChart
    pieChart = function(selector, title, data, callback) {
        var chart = nv.models.pieChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .showLabels(true);

        callback && callback(chart, data);
        d3.select(selector)
            .datum(data[0].values)
            .transition().duration(350)
            .call(chart);

        return chart;
      };

    //Define lineWithFocusChart
    lineWithFocusChart = function(selector, title, data, callback) {
        var chart = nv.models.lineWithFocusChart();

        callback && callback(chart, data);
        d3.select(selector).enter().append()
            .datum(data)
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
      };

    //Define multiBarChart 
    multiBarChart = function(selector, title, data, callback) {
        var chart = nv.models.multiBarChart()
          //.transitionDuration(350)
          .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(90)      //Angle to rotate x-axis labels.
          .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.05)    //Distance between each group of bars.
        ;
    
        chart.xAxis
            .tickFormat(d3.format('f'));
    
        chart.yAxis
            .tickFormat(d3.format('f'));

        d3.select(selector)
            .datum(data)
            .transition().duration(1)
            .call(chart);
    
        nv.utils.windowResize(chart.update);
        return chart;
    };

    //Make a force-directed graph with an array of author lists in results
    var authorArrayFDG = function(results){
	//console.log("CF:", results)

	var arrays = [];
	var authors = [];
	var nodes = [];
	var links = [];
	var authorArray = [];

	for(i=0; i<results.length; i++){
	    authorArray = results[i].authors;
	    //Do not include invalid author arrays
	    if(typeof  authorArray !== "undefined"){
		arrays.push(authorArray)
	    }
	}

	//Flatten the array and then unique it
        //https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript/10865042#10865042
	authors = unique(authors.concat.apply(authors, arrays));

        //Push author-name objects into nodes array
	for(i=0; i<authors.length; i++){nodes.push({"name": authors[i]})}
	//console.log("CFnode:", nodes)

	//Loop over returned array and build links to nodes
	for (i=0; i<arrays.length; i++){
	    //Only multi element arrays will have links
	    if(arrays[i].length > 1){
		//if(verbose){console.log("CF4 array[i]:", arrays[i]);};
		//Link each element to each other element
		for(j=0; j<arrays[i].length; j++){
		    //if(verbose){console.log("CF5 array[i][j]:", arrays[i][j]);};
		    for(k=j+1; k<arrays[i].length; k++){
			//if(verbose){console.log("CF6 array[i][k]:", arrays[i][k]);};
			links.push({"source": authors.indexOf(arrays[i][j]), "target": authors.indexOf(arrays[i][k])})
		    }
		}
	    }
	}
	//Create options object from queryItems
	var options = {};
	for (i=1; i<queryItems.length; i++){
	    options[queryItems[i].split(":")[0]] = JSON.parse(queryItems[i].split(":")[1]);
	}

	//Graph force-direct graph from force.js
	forceDirectedGraph(null, nodes, links, options);

    }//end of function(results)

//
//   GRAPH VIEWS
//

    // Graph yearly summary
    queryType = {type: "yearly", graph: "discreteBarChart", minYear: 1896, maxYear: 2011}
    graph(
        "#charts svg#yearly", 
        "NSR Data", 
        "NSR", 
        [
            { $group: { _id: "$year", total: { $sum: 1} } },
            { $sort: {_id: 1} },
            {$project: {_id: 0, label: "$_id", value: "$total" } } 
        ],
        {},
        queryType,
        function(chart){
            chart.yAxis.tickFormat(d3.format('.0f'));
            chart.xAxis.tickValues([1899,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010]);
        }
    );

    // Doctype Bar Chart
    queryType = {type: "yearly", graph: "discreteBarChart", minYear: 1896, maxYear: 2011}
    graph(
        "#charts svg#doctypes", 
        "NSR Data", 
        "NSR", 
        [
             { $group: { _id: "$type", total: { $sum: 1} } },
             { $sort: {total: -1}},
             { $limit: 8},
             { $sort: {_id: -1}},
             { $limit: 7},
             { $project : {_id : 0, label : "$_id", value : "$total"} },
             { $sort: {value: -1} }
        ],
        {},
        queryType,
        function(chart, data){
        }
    );

    // Doctype Pie
    queryType = {type: "yearly", graph: "pieChart", minYear: 1896, maxYear: 2011}
    graph(
        "#charts svg#doctypes2", 
        "NSR Data", 
        "NSR", 
        [
             { $group: { _id: "$type", total: { $sum: 1} } },
             { $sort: {total: -1}},
             { $limit: 8},
             { $sort: {_id: -1}},
             { $limit: 7},
             { $project : {_id : 0, label : "$_id", value : "$total"} },
             { $sort: {value: -1} }
        ],
        {},
        queryType,
        function(chart, data){
            chart.labelThreshold(.01)
            .donut(true).donutLabelsOutside(true).donutRatio(0.2);
        }
    );

    // Prolific authors
    queryType = {type: "yearly", graph: "pieChart", minYear: 1950, maxYear: 1980}
for (i=1950; i<=1970; i=i+10) {
    graph("#charts svg#prolific"+(i-1900), "NSR Data", "NSR", 
        [
             { $match: {"year": {$gt: i, $lte: i+10}}},
             { $unwind: "$authors"},
             { $group: { _id: "$authors", total: { $sum: 1} } },
             { $match: {total: {$gt: i-1925} } },
             { $project: {_id: 0, label: "$_id", value: "$total" } }
        ], {},
        queryType,
        function(chart, data){
            chart.labelThreshold(.01)
            .donut(true).donutLabelsOutside(true).donutRatio(0.3)
            .showLabels(false).showLegend(false);
            //function isBigEnough(value) {
            //  return function(element, index, array) {
            //    return (element.value >= value);
            //  }
            //}
            //d3.select("#charts svg#prolific70").datum(data[0].values.filter(isBigEnough(40))).transition().duration(350).call(chart);
        }
    );
}


    // Multi Bar Chart
    queryType = {type: "yearlyMultiType", graph: "multiBarChart", minYear: 1965, maxYear: 1985}
    graph(
        "#charts svg#yearlyMulti", 
        "NSR Data", 
        "NSR", 
        [
              {$match: {"year": {$gte: 1965, $lte: 1985}}},
              {$group: { _id: {type: "$type", year: "$year"}, total: { $sum: 1} } }, 
              {$sort: {"_id.year": 1}},
              {$group: {_id: "$_id.type", values: {$push: {x: "$_id.year", y: "$total"}}}}, 
              {$project: {_id:0, key: "$_id", values: "$values"}}

       ],
        {},
        queryType,
        function(chart, data){
        }
    );




}); //Thats all folks
