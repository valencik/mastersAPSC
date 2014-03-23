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

    var graph = function(selector, title, collection, pipeline, options) {

        // Discrete Bar graph
        aggregate(collection, 
            pipeline,
            options,
            function(results) {
                var data = [{
                    key: title,
                    values: results
                }];
                console.log(data);

                nv.addGraph(function() {
                  var chart = nv.models.discreteBarChart()
                      .x(function(d) { return d.label })    //Specify the data accessors.
                      .y(function(d) { return d.value })
                      .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
                      .tooltips(true)        //Don't show tooltips
                      .showValues(false)       //...instead, show the bar value right on top of each bar.
                      .transitionDuration(350)
                      ;

                      chart.yAxis.tickFormat(d3.format('.0f'));
                      chart.xAxis.tickValues([1899,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010]);

                  d3.select(selector)
                      .datum(data)
                      .call(chart);

                  nv.utils.windowResize(chart.update);

                  return chart;
                });
        });

    };

    // Graph yearly summary
    var years = [];
    for(i=1896; i<=2014; i++) { years.push(i.toString()) }
    graph(
        "#charts svg#yearly", 
        "NSR Data", 
        "NSR", 
        [
            { $match: { YEAR: { $in: years } } }, 
            { $group: { _id: "$YEAR", total: { $sum: 1 } } }, 
            { $sort: { _id: 1 } },
            { $project : {_id : 0, label : "$_id", value : "$total"} },
        ],
        {}
    );



});
