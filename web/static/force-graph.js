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
    var color = d3.scale.category10();

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
            .attr("x", function(d) { return d.x + 5; })
            .attr("y", function(d) { return d.y + 5; })
            .text(function(d) { return d.id; });
    }

    // Draw the nodes themselves
    var nodes = container.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", radius)
        .style("fill", function(d,i) { return color(d.k); })
        .style("stroke", "#fff")
        .style("stroke-width", "1px")
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

        var title = typeof nsr.title === "undefined" ? "NA" : nsr.title
        entry.append("span").attr("class", "title").text(title);

        var score = typeof nsr.score === "undefined" ? "" : nsr.score
        entry.append("span").attr("class", "score").text(score);

        var authors = typeof nsr.authors === "undefined" ? "NA" : nsr.authors.join(", ")
        entry.append("p").attr("class", "authors").text(authors);

        var selectors = typeof nsr.selectors === "undefined" ? "NA" : nsr.selectors.join(", ")
        entry.append("p").attr("class", "selectors").text("Selectors: " + selectors);
    })

}
