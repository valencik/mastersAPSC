/* Set the diagrams Height & Width */
    var h = 700, w = 950;
/* Set the color scale we want to use */
    var color = d3.scale.category20();
// /* Build the directional arrows for the links/edges */
//         svg.append("svg:defs")
//                     .selectAll("marker")
//                     .data(["end"]) 
//                     .enter().append("svg:marker")
//                     .attr("id", String)
//                     .attr("viewBox", "0 -5 10 10")
//                     .attr("refX", 15)
//                     .attr("refY", -1.5)
//                     .attr("markerWidth", 6)
//                     .attr("markerHeight", 6)
//                     .attr("orient", "auto")
//                     .append("svg:path")
//                     .attr("d", "M0,-5L10,0L0,5");

/* Define the main worker or execution function */
function makeDiag(error, nodes, links) {
/* Establish/instantiate an SVG container object */
    var svg = d3.select("#charts")
                    .append("svg")
                    .attr("height",h)
                    .attr("width",w);
    /* Draw the node labels first */
   var texts = svg.selectAll("text")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .attr("fill", "black")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "12px")
                    .text(function(d) { return d.name; }); 
    /* Establish the dynamic force behavor of the nodes */
    var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([w,h])
                    .linkDistance([40])
                    .charge([-100])
                    //.gravity(0.3)
                    .start();
    /* Draw the edges/links between the nodes */
    var edges = svg.selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                    .style("stroke", "#999")
                    .style("stroke-opacity", ".6")
                    .style("stroke-width", 1);
                    //.attr("marker-end", "url(#end)"); //add arrow ends
    /* Draw the nodes themselves */                
    var nodes = svg.selectAll("circle")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("r", 8)
                    .attr("opacity", 0.5)
                    .style("fill", function(d,i) { return color(i); })
                    .style("stroke", "#fff")
                    .style("stroke-width", "1.5px")
                    .call(force.drag);
    /* Run the Force effect */
    force.on("tick", function() {
               edges.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
               nodes.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
               texts.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                        });
               }); // End tick func
}; // End makeDiag worker func