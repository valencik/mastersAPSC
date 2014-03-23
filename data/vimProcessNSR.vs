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

"KEYNO parsing
:let t = localtime()
:%s/^<KEYNO   >\(\(\d\d\d\d\).*\)&$/{ "keyNumber": { "KEYNO": "\1", "yearPublication": \2,/g
:%s/^<HISTORY >\(.*\)&$/"HISTORY": "\1" },/g
:echo "Regex (keyno & history): ".(t-localtime())." s"

"Coden and Reference to JSON
:let t = localtime()
:%s/^<CODEN   >\(.*\)&$/"CODEN": "\1",/g
:%s/^<REFRENCE>\(.*\)&$/"REFRENCE": "\1",/g
:echo "Regex (coden & reference): ".(t-localtime())." s"

"Authors to an array
:let t = localtime()
:%s/^<AUTHORS >\(.*\)&$/"authors": ["\1"],/g
:%s/\(^"authors": \[".*\)\@<=, /", "/g
:echo "Regex (Authors): ".(t-localtime())." s"

"Title, Keywords, Selectors, DOI
:let t = localtime()
:%s/^<TITLE   >\(.*\)&$/"TITLE": "\1",/g
:%s/^<KEYWORDS>\(.*\)&$/"KEYWORDS": "\1",/g
:%s/^<SELECTRS>\(.*\)&$/"SELECTRS": "\1",/g
:%s/^<DOI     >\(.*\)&$/"DOI": "\1",/g
:echo "Regex (Title, keywords, selectrs, DOI): ".(t-localtime())." s"

"End JSON structures
:let t = localtime()
:%s/",\n{/" }\r{/g 
:echo "Regex (end json): ".(t-localtime())." s"

"Make JSON structures one big line
:let t = localtime()
:%s/,\n/, /g 
:echo "Regex 10: ".(t-localtime())." s"

"Save and quit
:w output.dat
:q!

" ---- TIME TO RUN ----
"time vim -S vimProcessNSR.vs NSRDump.out
"
"real	1m58.469s
"user	1m49.242s
"sys	0m6.962s
