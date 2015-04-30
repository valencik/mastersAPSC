// Wait for DOM to finish loading.
$(document).ready(function() {

    // Enable debugging output
    var verbose = false;

    // Searches made with the navbar search form
    var search = $("#omnisearchform");
    search.submit(function(ev){

        //queryterm is the user inputted search text
        var searchterms = search.serializeArray();
        var queryterm = searchterms[0].value;
        if(verbose){console.log("queryterm:"+queryterm);};

        // Break the queryterm into key:value pairs
        queryItems = queryterm.split(/ (?=\w+:)/);

        // Remove old charts
        $("#billboard").remove();
        $("#charts").empty();

        // Handle the passed search command
        switch (queryItems[0].split(":")[0]){
            case 'collab':
                collabParam = queryItems[0].split(":")[1]
                if(verbose){console.log("Search collabParam: "+collabParam);};

                //Create options object from queryItems
                var options = {};
                for (i=1; i<queryItems.length; i++){
                    options[queryItems[i].split(":")[0]] = JSON.parse(queryItems[i].split(":")[1]);
                }

                // Parse collab: input for single year or range
                var reYearArray = /(?:^(\d{4})-(\d{4})$)|(?:^(\d{4}))/.exec(collabParam);
                if (reYearArray){
                    if(reYearArray[3]){
                        if(options.topnetwork){
                            d3.xhr("/api/authornetwork/"+parseInt(reYearArray[3])+"?topnetwork="+options.topnetwork)
                            .get(function(error, data){
                                graphData = JSON.parse(data.response)
                                forceDirectedGraph(null, graphData.nodes, graphData.links, options);
                            })
                        } else {
                            d3.xhr("/api/authornetwork/"+parseInt(reYearArray[3]))
                            .get(function(error, data){
                                graphData = JSON.parse(data.response)
                                forceDirectedGraph(null, graphData.nodes, graphData.links, options);
                            })
                        }
                    }
                    if(reYearArray[1] && reYearArray[2]){
                        console.log("Ranges not yet supported");
                    }
                }
                break;
                
            case 'nuclide':
                nuclideParam = queryItems[0].split(":")[1]
                if(verbose){console.log("Search nuclideParam: "+nuclideParam);};

                //Create options object from queryItems
                var options = {};
                for (i=1; i<queryItems.length; i++){
                    options[queryItems[i].split(":")[0]] = JSON.parse(queryItems[i].split(":")[1]);
                }

                // Parse nuclide: input for single year or range
                if(options.topnetwork){
                    d3.xhr("/api/searchnetwork?nuclide="+nuclideParam+"?topnetwork="+options.topnetwork)
                    .get(function(error, data){
                        graphData = JSON.parse(data.response)
                        forceDirectedGraph(null, graphData.nodes, graphData.links, options);
                    })
                } else {
                    d3.xhr("/api/searchnetwork?nuclide="+nuclideParam)
                    .get(function(error, data){
                        graphData = JSON.parse(data.response)
                        forceDirectedGraph(null, graphData.nodes, graphData.links, options);
                    })
                }
                break;

            default:
                break;

        }//end of switch on search command

        ev.preventDefault();
    });//end of search

}); //Thats all folks
