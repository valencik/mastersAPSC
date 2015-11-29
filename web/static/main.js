// Enable debugging output
var verbose = true;

// Searches made with the navbar search form
document.getElementById("omnisearch").addEventListener("search", omniSearch);

function omniSearch(ev){

    if(verbose){console.log("Running omniSearch()...");};

    // Break the search value into key:value pairs
    var search = document.getElementById("omnisearch").value;
    var queryItems = search.split(/ (?=\w+:)/);
    var command = queryItems[0].split(":")[0];
    var commandParam = queryItems[0].split(":")[1]

    //Create options object from queryItems
    var options = {};
    for (i=1; i<queryItems.length; i++){
        queryItem = queryItems[i].split(":")
        options[queryItem[0]] = JSON.parse(queryItem[1]);
    }
    if(!options.topnetwork) options.topnetwork = 0;

    // Erase the current #charts output
    document.getElementById("charts").innerHTML = '';

    // Handle the passed search command
    switch (command){
        case 'collab':
            if(verbose){console.log("Search collabParam: "+commandParam);};

            // Parse collab: input for single year or range
            var reYearArray = /(?:^(\d{4})-(\d{4})$)|(?:^(\d{4}))/.exec(commandParam);
            if (reYearArray){
                if(reYearArray[3]){
                    d3.xhr("/api/yearnetwork/"+parseInt(reYearArray[3])+"?topnetwork="+options.topnetwork)
                    .get(function(error, data){
                        graphData = JSON.parse(data.response)
                        forceDirectedGraph(null, graphData.nodes, graphData.links, options);
                    })
                }
                if(reYearArray[1] && reYearArray[2]){
                    console.log("Ranges not yet supported");
                }
            } else {
                d3.xhr("/api/authornetwork?author="+commandParam+"&topnetwork="+options.topnetwork)
                .get(function(error, data){
                    graphData = JSON.parse(data.response)
                    forceDirectedGraph(null, graphData.nodes, graphData.links, options);
                })
            }
            break;

        case 'nuclide':
            if(verbose){console.log("Search nuclideParam: "+commandParam);};

            // Parse nuclide: input for single year or range
            d3.xhr("/api/searchnetwork?nuclide="+commandParam+"&topnetwork="+options.topnetwork)
            .get(function(error, data){
                graphData = JSON.parse(data.response)
                forceDirectedGraph(null, graphData.nodes, graphData.links, options);
            })
            break;

        default:
            // Send entire input to /api/search
            d3.xhr("/api/search?input="+search)
            .get(function(error, data){
                response = JSON.parse(data.response)
                stackedBar(response.years)
            })
            break;

    }//end of switch on search command

    ev.preventDefault();
};//end of search
