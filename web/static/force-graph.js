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

    d3.select("#charts").remove()
    var svg = d3.select("div#contentContainer")
       .append("div")
       .classed("svg-container", true) //container class to make it responsive
       .attr("id", "charts")
       .append("svg")
       //responsive SVG needs these 2 attributes and no width and height attr
       //.attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", "0 0 1000 1000")
       //class to make it responsive
       .classed("svg-content-responsive", true);

    var container = svg.append("g")

    // Optional radius customization or set default
    var radius = options.radius || 5;
    // Set the color scale we want to use
    var color = d3.scale.category20();

    // Draw the edges/links between the nodes
    var edges = container.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#666")
        .style("stroke-opacity", ".2")
        .style("stroke-width", 1)
        .attr("x1", function(d) { return nodes[d.source].x; })
        .attr("y1", function(d) { return nodes[d.source].y; })
        .attr("x2", function(d) { return nodes[d.target].x; })
        .attr("y2", function(d) { return nodes[d.target].y; });

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
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })

}; // End forceDirectedGraph worker func

function stackedBar(data) {
    d3.select("#charts").remove()
    d3.select("#contentContainer").append("div").attr("id", "charts").append("svg")
        .attr("width", 600).attr("height", 400)
    nv.addGraph(function() {
        var chart = nv.models.multiBarChart().stacked(true);

        chart.xAxis
            .tickFormat(d3.format(''));

        chart.yAxis
            .tickFormat(d3.format(''));

        d3.select('#charts svg')
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        chart.update()

        return chart;
    });
}

function listEntries(data) {
    d3.select("#charts").remove()
    d3.select("#contentContainer").append("div").attr("id", "charts")
    data.forEach(function (nsr){
        d3.select("#charts").append("div").attr("class", "nsrEntry").attr("id", "id" + nsr._id)
        var entry = d3.select("#id" + nsr._id)
        entry.append("span").attr("class", "year").text(nsr.year);
        entry.append("span").attr("class", "title").text(nsr.title);
        entry.append("p").attr("class", "authors").text(nsr.authors.join(", "));
        entry.append("p").attr("class", "selectors").text("Selectors: " + nsr.selectors.join(", "));
    })

}

function fixedGraph(nodes, links, options) {

    d3.select("#charts").remove()
    var svg = d3.select("#contentContainer").append("div").attr("id", "charts").append("svg")
        .attr("height",900)
        .attr("width",900)

    var force = self.force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .gravity(0.05)
        .friction(0)
        .distance(100)
        .charge(-100)
        .size([900,900])
        .start();

    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

    var node = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 4.5)
        .call(node_drag);

    function dragstart(d, i) {
        force.stop(); // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        tick();
    }

    function dragend(d, i) {
        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        tick();
        force.resume();
    }


    force.on("tick", tick);

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

       node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
    force.aplha(0.01);
};
