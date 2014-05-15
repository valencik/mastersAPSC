" Vim Script to convert NSR data to JSON
" Created by Andrew Valencik
" Last modified: March 23, 2014

"Remove trailing whitespace and tabs
:let t = localtime()
:%s/\t/  /g
:%s/ \{2,}&$/\&/g 
:echo "Regex (whitespace): ".(localtime()-t)." s"

"Escape double quotes
:let t = localtime()
:%s/"/\\"/g 
:echo "Regex (double quotes): ".(localtime()-t)." s"

"Collapse all multiline entries to single line
:let t = localtime()
:%s/&\n\([^<]\)/\1/g 
:echo "Regex (multiline): ".(localtime()-t)." s"

"Lines that start with lessthan
:let t = localtime()
:%s/&\n<\(KEYNO\)\@!\(HISTORY\)\@!\(CODEN\)\@!\(REFRENCE\)\@!\(AUTHORS\)\@!\(TITLE\)\@!\(KEYWORDS\)\@!\(SELECTRS\)\@!\(DOI\)\@!/</g 
:echo "Regex (less than): ".(localtime()-t)." s"

"KEYNO parsing
:let t = localtime()
:%s/^<KEYNO   >\(\(\d\d\d\d\).*\)&$/{ "year": \2, "KEYNO": "\1",/g
:%s/^<HISTORY >\(.*\)&$/"HISTORY": "\1",/g
:echo "Regex (keyno & history): ".(localtime()-t)." s"

"Coden and Reference to JSON
:let t = localtime()
:%s/^<CODEN   >\(\(\w*\).*\)&$/"code": "\1", "type": "\2",/g
:%s/^<REFRENCE>\(.*\)&$/"REFRENCE": "\1",/g
:echo "Regex (coden & reference): ".(localtime()-t)." s"

"Authors to an array
:let t = localtime()
:%s/^<AUTHORS >\(.*\)&$/"authors": ["\1"],/g
:%s/\(^"authors": \[".*\)\@<=, /", "/g
:echo "Regex (authors): ".(localtime()-t)." s"

"Title, Keywords, Selectors, DOI
:let t = localtime()
:%s/^<TITLE   >\(.*\)&$/"TITLE": "\1",/g
:%s/^<KEYWORDS>\(.*\)&$/"KEYWORDS": "\1",/g
:%s/^<SELECTRS>\(.*\)&$/"SELECTRS": "\1",/g
:%s/^<DOI     >\(.*\)&$/"DOI": "\1",/g
:echo "Regex (title, keywords, selectrs, DOI): ".(localtime()-t)." s"

"End JSON structures
:let t = localtime()
:%s/,\n{/ }\r{/g 
:echo "Regex (end json): ".(localtime()-t)." s"

"Make JSON structures one big line
:let t = localtime()
:%s/,\n/, /g 
:echo "Regex (one line): ".(localtime()-t)." s"

"Field values ending in \
:let t = localtime()
:%s/\\", "/\\ ", "/g 
:echo "Regex (ending in \ ): ".(localtime()-t)." s"

"End the very last JSON doc
:normal G$F,cw }

"Save and quit
:w output.dat
:q!

" ---- TIME TO RUN ----
"time vim -S vimProcessNSR.vs NSRDump.out
"
"real	1m58.469s
"user	1m49.242s
"sys	0m6.962s
