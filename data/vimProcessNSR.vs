" Vim Script to convert NSR data to JSON
" Created by Andrew Valencik
" Last modified: March 23, 2014

"Remove trailing whitespace and tabs
:let t = localtime()
:%s/\t/  /g
:%s/ \{2,}&$/\&/
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
:%s/&\n<\(KEYNO\)\@!\(HISTORY\)\@!\(CODEN\)\@!\(REFRENCE\)\@!\(AUTHORS\)\@!\(TITLE\)\@!\(KEYWORDS\)\@!\(SELECTRS\)\@!\(DOI\)\@!/</ 
:echo "Regex (less than): ".(localtime()-t)." s"


" Start Scheme Building
"

"KEYNO parsing
:let t = localtime()
:%s/^<KEYNO   >\(\(\d\d\d\d\).*\)&$/{ "_id": "\1", "year": "\2",/
:echo "Regex (keyno): ".(localtime()-t)." s"

"HISTORY parsing
:let t = localtime()
:%g/^<HISTORY >/ s/^<HISTORY >/"history":["/ | s/ \(\w\)/", "\1/g | s/&$/"],/
:echo "Regex (history): ".(localtime()-t)." s"

"Coden and Reference to JSON
:let t = localtime()
:%s/^<CODEN   >\(\(\w*\).*\)&$/"code": "\1", "type": "\2",/
:%s/^<REFRENCE>\(.*\)&$/"REFRENCE": "\1",/
:echo "Regex (coden & reference): ".(localtime()-t)." s"

"Authors to an array
:let t = localtime()
:%g/^<AUTHORS >/ s/^<AUTHORS >/"authors":["/ | s/, \(\w\)/", "\1/g | s/&$/"],/ | s/", "Jr."/, Jr."/g
":%s/^<AUTHORS >\(.*\)&$/"authors": ["\1"],/
":%s/\(^"authors": \[".*\)\@<=, Jr./ Jr./g
":%s/\(^"authors": \[".*\)\@<=, /", "/g
:echo "Regex (authors): ".(localtime()-t)." s"

"Title, Keywords, Selectors, DOI
:let t = localtime()
:%s/^<TITLE   >\(.*\)&$/"TITLE": "\1",/
:%s/^<KEYWORDS>\(.*\)&$/"KEYWORDS": "\1",/
:%s/^<SELECTRS>\(.*\)&$/"SELECTRS": "\1",/
:%s/^<DOI     >\(.*\)&$/"DOI": "\1",/
:echo "Regex (title, keywords, selectrs, DOI): ".(localtime()-t)." s"

"End JSON structures
:let t = localtime()
:%s/,\n{/ }\r{/ 
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
:w! output.dat
:q!

" ---- TIME TO RUN ----
"time vim -S vimProcessNSR.vs NSRDump.out
"
"real	1m58.469s
"user	1m49.242s
"sys	0m6.962s
