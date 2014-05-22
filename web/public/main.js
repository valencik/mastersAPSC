// Wait for DOM to finish loading.
$(document).ready(function() {
    // Ready!
    console.log('READY!');

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

    var graph = function(selector, title, collection, pipeline, options, graphType, callback) {
        aggregate(collection, 
            pipeline,
            options,
            function(results) {
                var data = [{
                    key: title,
                    values: results
                }];
                console.log("Graph: %s", graphType);
                console.log(data);
                
                switch(graphType){
                    case 'discreteBarChart':
                        nv.addGraph(discreteBarChart(selector, title, data, callback));
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

            });
    };

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

    multiBarChart = function(selector, title, data, callback) {
        var chart = nv.models.multiBarChart()
          .transitionDuration(350)
          .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(0)      //Angle to rotate x-axis labels.
          .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.1)    //Distance between each group of bars.
        ;
    
        chart.xAxis
            .tickFormat(d3.format(',f'));
    
        chart.yAxis
            .tickFormat(d3.format(',.1f'));
    
        d3.select('#chart1 svg')
            .datum(data)
            .call(chart);
    
        nv.utils.windowResize(chart.update);
        return chart;
    };


//
//   GRAPH VIEWS
//

    // Graph yearly summary
    graphType = "discreteBarChart";
    graph(
        "#charts svg#yearly", 
        "NSR Data", 
        "NSR3", 
        [
            { $group: { _id: "$year", total: { $sum: 1} } },
            { $sort: {_id: 1} },
            {$project: {_id: 0, label: "$_id", value: "$total" } } 
        ],
        {},
        graphType,
        function(chart){
            chart.yAxis.tickFormat(d3.format('.0f'));
            chart.xAxis.tickValues([1899,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010]);
        }
    );

    // Doctype Bar Chart
    graphType = "discreteBarChart";
    graph(
        "#charts svg#doctypes", 
        "NSR Data", 
        "NSR3", 
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
        graphType,
        function(chart, data){
        }
    );

    // Doctype Pie
    graphType = "pieChart";
    graph(
        "#charts svg#doctypes2", 
        "NSR Data", 
        "NSR3", 
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
        graphType,
        function(chart, data){
            chart.labelThreshold(.01)
            .donut(true).donutLabelsOutside(true).donutRatio(0.2);
        }
    );

    // Prolific authors
    graphType = "pieChart";
for (i=1950; i<=1970; i=i+10) {
    graph("#charts svg#prolific"+(i-1900), "NSR Data", "NSR3", 
        [
             { $match: {"year": {$gt: i, $lte: i+10}}},
             { $unwind: "$authors"},
             { $group: { _id: "$authors", total: { $sum: 1} } },
             { $match: {total: {$gt: i-1925} } },
             { $project: {_id: 0, label: "$_id", value: "$total" } }
        ], {},
        graphType,
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


    // Yearly papers with View Finder
    graphType = "lineWithFocusChart";
    types = ["JOUR", "CONF", "REPT", "BOOK", "PC", "THESIS", "PREPRINT"];
    types.forEach(function(i){graph(
        "#charts svg#yearlyFinder", 
        i, 
        "NSR3", 
        [
            { $match: {"type": i}},
            { $group: { _id: "$year", total: { $sum: 1} } },
            { $sort: {_id: 1} },
            { $project: {_id: 0, x: "$_id", y: "$total" } } 
        ],
        {},
        graphType,
        function(chart){
            chart.xAxis
              .tickFormat(d3.format(',f'));
          
            chart.yAxis
              .tickFormat(d3.format(',.2f'));
          
            chart.y2Axis
              .tickFormat(d3.format(',.2f'));
            //chart.yAxis.tickFormat(d3.format('.0f'));
            //chart.xAxis.tickValues([1899,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010]);
        }
    )}
);


    // Multi Bar Chart
    graphType = "multiBarChart";
    graph(
        "#charts svg#multi", 
        "NSR Data", 
        "NSR3", 
        [
            {$group: { _id: {type: "$type", year: "$year"}, total: { $sum: 1} } },
            {$sort: {"sum": -1}},
            {$project: {_id: 0, type: "$_id.type", x: "$_id.year", y: "$total"}},
            {$group: {_id: "$type", values: {$addToSet: {x: "$x", y: "$y"}}}},
            {$project: {_id:0, key: "$_id", values: "$values"}}
       ],
        {},
        graphType,
        function(chart, data){
        }
    );




}); //Thats all folks
