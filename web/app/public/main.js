// Wait for DOM to finish loading.
$(document).ready(function() {
    // Ready!
    console.log('READY!');

    $.ajax({
        type: "GET",
        url: "/yearSummary",
        dataType: "json",
        success: function(yearResults){
            console.log("AJAX", yearResults);
            data = yearResults;
            nv.addGraph(graphit);
        },
        error: function(error){
            input.removeClass('loading');
            throw "Ajax error!";
        }
    });    
    
    
    graphit = function() {  
      var chart = nv.models.discreteBarChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .staggerLabels(true)
          //.staggerLabels(historicalBarChart[0].values.length > 8)
          .tooltips(false)
          .showValues(true)
          .transitionDuration(250)
          ;
      console.log("data : "+data); 
      graphData = [ { key: "title", values: [data] } ]
      d3.select('#chart1 svg')
          .datum(graphData)
          .call(chart);
    
      nv.utils.windowResize(chart.update);
    
      return chart;
    }
   
 
});
