/* Define the main worker or execution function */
// Possible options for the force graph are:
// radius [5]
// links [30]
// charge [-120]
// friction [0.8]
// gravity [0.1]
// labels [off]
// drag [off]

function forceDirectedGraph(error, nodes, links, options) {

    // Set up seeded random number generator
    Math.seedrandom('hello.');
    console.log(Math.random());

    // Setup spacing
    var margin = {top: -5, right: -5, bottom: -5, left: -5};
    var width = self.frameElement ? 960 : innerWidth;
    var height = self.frameElement ? 500 : innerHeight;
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    // Intialize variables for semantic zooming
    var scaleFactor = 1;
    var translation = [0,0];

    // Optional radius customization or set default
    var radius = options.radius || 5;
    // Set the color scale we want to use
    var color = d3.scale.category20();

    // Set the zoom minimum and maximum levels
    var zoom = d3.behavior.zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", zoomed);

    // Establish/instantiate an SVG container object
    d3.select("#charts svg").remove()
    var svg = d3.select("#charts").append("svg")
        .attr("height",height)
        .attr("width",width)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(zoom);

    // Make an invisible rectangle to facilitate zooming/dragging anywhere
    var rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all");

    // Initialize container
    var container = svg.append("g");
    container.append("g");

    // Establish the dynamic force behavor of the nodes
    var force = d3.layout.force()
        .on("tick", tick)
        .nodes(nodes)
        .links(links)
        .size([width,height])
        .linkDistance(options.links || 30)
        .charge(options.charge || -120)
        .friction(options.friction || 0.8)
        .gravity(options.gravity || 0.1)
        .start();

    // Draw the edges/links between the nodes
    var edges = container.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#999")
        .style("stroke-opacity", ".8")
        .style("stroke-width", 1);

    // Options node labels
    if (options.labels) {
        var texts = container.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .text(function(d) { return d.id; });
    }

    // Draw the nodes themselves
    var nodes = container.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", radius)
        .style("fill", function(d,i) { return color(i); })
        .style("stroke", "#fff")
        .style("stroke-width", "1.5px")

    // Optional dragging
    if (options.drag){nodes.call(force.drag);}

    // Set positions of elements
    function tick() {
        edges.attr("x1", function(d) { return translation[0] + scaleFactor*d.source.x; })
             .attr("y1", function(d) { return translation[1] + scaleFactor*d.source.y; })
             .attr("x2", function(d) { return translation[0] + scaleFactor*d.target.x; })
             .attr("y2", function(d) { return translation[1] + scaleFactor*d.target.y; });
        nodes.attr("cx", function(d) { return translation[0] + scaleFactor*d.x; })
             .attr("cy", function(d) { return translation[1] + scaleFactor*d.y; });
        if(options.labels){
             texts.attr("x", function(d) { return translation[0]+ radius + scaleFactor*d.x; })
                  .attr("y", function(d) { return translation[1]+ radius + scaleFactor*d.y; });
        }
    } // End tick func

    // Zooming function
    function zoomed() {
      scaleFactor = d3.event.scale;
      translation = d3.event.translate;
      tick(); //update positions
    }

}; // End forceDirectedGraph worker func

function stackedBar(data) {
    d3.select("#charts svg").remove()
    d3.select("#charts").append("svg").attr("width", 1000).attr("height", 750)
    nv.addGraph(function() {
        var chart = nv.models.multiBarChart();

        d3.select('#charts svg')
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        chart.update()

        return chart;
    });
}
