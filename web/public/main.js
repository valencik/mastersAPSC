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
                console.log(data);
                
                switch(graphType){
                    case 'discreteBarChart':
                        nv.addGraph(discreteBarChart(selector, title, data, callback));
                        console.log("Graphing discreteBarChart")
                        break;
                    case 'pieChart':
                        nv.addGraph(pieChart(selector, title, data, callback));
                        console.log("Graphing pieChart")
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
            { $group: { _id: "$keyNumber.yearPublication", total: { $sum: 1} } },
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
    types = ["JOUR", "CONF", "REPT", "BOOK", "PC", "THESIS", "PREPRINT"];
    graph(
        "#charts svg#doctypes", 
        "NSR Data", 
        "NSR3", 
        [
             { $match: { "CODEN.0": { $in: types } } },
             { $unwind: "$CODEN" },
             { $match: { "CODEN": { $in: types } } },
             { $group: { _id: "$CODEN", total: { $sum: 1 } }},
             { $project : {_id : 0, label : "$_id", value : "$total"} },
             { $sort: {value: -1} }
        ],
        {},
        graphType,
        function(chart, data){console.log("Printed Bar Chart of doctypes: "+data);}
    );

    // Doctype Pie
    graphType = "pieChart";
    types = ["JOUR", "CONF", "REPT", "BOOK", "PC", "THESIS", "PREPRINT"];
    graph(
        "#charts svg#doctypes2", 
        "NSR Data", 
        "NSR3", 
        [
             { $match: { "CODEN.0": { $in: types } } },
             { $unwind: "$CODEN" },
             { $match: { "CODEN": { $in: types } } },
             { $group: { _id: "$CODEN", total: { $sum: 1 } }},
             { $project : {_id : 0, label : "$_id", value : "$total"} },
             { $sort: {value: -1} }
        ],
        {},
        graphType,
        function(chart, data){
            console.log("pie pie pie: "+data);
            chart.labelThreshold(.01)
            .donut(true).donutLabelsOutside(true).donutRatio(0.2);
        }
    );

    // Prolific authors
    graphType = "pieChart";
for (i=1950; i<=1970; i=i+10) {
    graph("#charts svg#prolific"+(i-1900), "NSR Data", "NSR3", 
        [
             { $match: {"keyNumber.yearPublication": {$gt: i, $lte: i+10}}},
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


});
