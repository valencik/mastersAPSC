/* Define the main worker or execution function */
function forceDirectedGraph(error, nodes, links, options) {
    // Setup spacing
    var margin = {top: -5, right: -5, bottom: -5, left: -5};
    var width = self.frameElement ? 960 : innerWidth;
    var height = self.frameElement ? 500 : innerHeight;
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    // Set the color scale we want to use
    var color = d3.scale.category20();

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    // Establish/instantiate an SVG container object
    var svg = d3.select("#charts") .append("svg")
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

    if (options.labels) {
        // Draw the node labels
        var texts = svg.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .text(function(d) { return d.name; }); 
    }

    // Establish the dynamic force behavor of the nodes
    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width,height])
        .linkDistance([20])
        .charge([-20])
        //.gravity(0.3)
        .start();

    // Draw the edges/links between the nodes
    var edges = container.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#999")
        .style("stroke-opacity", ".6")
        .style("stroke-width", 1);
        //.attr("marker-end", "url(#end)"); //add arrow ends

    // Draw the nodes themselves
    var nodes = container.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("opacity", 0.5)
        .style("fill", function(d,i) { return color(i); })
        .style("stroke", "#fff")
        .style("stroke-width", "1.5px")
        .call(force.drag);

    // Run the Force effect
    force.on("tick", function() {
        edges.attr("x1", function(d) { return d.source.x; })
             .attr("y1", function(d) { return d.source.y; })
             .attr("x2", function(d) { return d.target.x; })
             .attr("y2", function(d) { return d.target.y; });
        nodes.attr("cx", function(d) { return d.x; })
             .attr("cy", function(d) { return d.y; })
        if(options.labels){
            texts.attr("transform", function(d) {
                     return "translate(" + d.x + "," + d.y + ")";
                     });
        }
    }); // End tick func

    // Zooming function
    function zoomed() {
      container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

}; // End forceDirectedGraph worker func
