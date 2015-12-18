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

        default:
            // Send entire input to /api/search
            d3.xhr("/api/search?input="+search)
            .get(function(error, data){
                response = JSON.parse(data.response)
                listEntries(response.entries)
            })
            break;

    }//end of switch on search command

    ev.preventDefault();
};//end of search
