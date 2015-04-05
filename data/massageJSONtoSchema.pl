#!/usr/bin/perl -pi

use strict;
use warnings;

# Extract year to its own field
s/^"_id":"((\d\d\d\d).*)",$/"_id":"$1",\n"year":$2,/g;

# Extract type into its own field
s/^"code":"((\w*).*)",$/"code":"$1",\n"type":"$2",/g;

# Turn author names into array elements
s/[^]], /", "/g if /^"authors":\[/;
s/", "Jr."/, Jr."/g if /^"authors":\[/; #Fix the Jr's

# Turn history stamps into array elements
s/ /", "/g if /^"history":\[/;

# Split selectors
#    "T:241AM;A. R:(N,2N);A. N:240AM;A. 
s/([A-Z]):(.*?);(.*?)\./{"type":"$1", "value":"$2", "subkey":"$3"},/g if /^"selectors":\[/;
s/^"selectors":\["/"selectors":\[/g;
s/},"],$/}],/ if /^"selectors":\[/;
