" Vim Script to convert NSR data to JSON
" Created by Andrew Valencik
" Last modified: March 23, 2014

"remove trailing whitespace before '&' end of line
:let t = localtime()
:%s/ \{2,}&$/\&/g 
:echo "Regex 1: ".(t-localtime())." s"

"escape double quotes
:let t = localtime()
:%s/"/\\"/g 
:echo "Regex 2: ".(t-localtime())." s"

"Collapse all multiline entries to single line
:let t = localtime()
:%s/&\n\([^<]\)/\1/g 
:echo "Regex 3: ".(t-localtime())." s"

"Lines that start with lessthan
:let t = localtime()
:%s/&\n<\(KEYNO\)\@!\(HISTORY\)\@!\(CODEN\)\@!\(REFRENCE\)\@!\(AUTHORS\)\@!\(TITLE\)\@!\(KEYWORDS\)\@!\(SELECTRS\)\@!\(DOI\)\@!/</g 
:echo "Regex 4: ".(t-localtime())." s"

"To JSON 
:let t = localtime()
:%s/<\(.*\)>\(.*\)&/"\1": "\2",/g 
:echo "Regex 5: ".(t-localtime())." s"

"Start JSON struct 
:let t = localtime()
:%s/^"KEYNO\s\+": "\(.*",\)/{ "KEYNO": "\1/g 
:echo "Regex 6: ".(t-localtime())." s"

"Remove trailing whitespace in tags 
:let t = localtime()
:%s/\(^"\u\+\)\@<=\s*"/"/g 
:echo "Regex 7: ".(t-localtime())." s"

"Split KEYNO into KEYNO and yearPublication
:let t = localtime()
:%s/"KEYNO": "\(\(\d\d\d\d\).*\)"/"keyNumber": { "KEYNO": "\1", "yearPublication": \2 } /g
:echo "Regex 8: ".(t-localtime())." s"

"End JSON structures that don't have a DOI
:let t = localtime()
:%s/",\n{/" }\r{/g 
:echo "Regex 9: ".(t-localtime())." s"

"Make JSON structures one big line
:let t = localtime()
:%s/,\n/", /g 
:echo "Regex 10: ".(t-localtime())." s"

"Save and quit
:w output.dat
:q!

" ---- TIME TO RUN ----
"time vim -S vimProcessNSR.vs NSRDump.out
"
"real	3m37.537s
"user	3m24.598s
"sys	0m8.055s
