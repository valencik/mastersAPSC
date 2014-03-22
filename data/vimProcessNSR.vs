:%s/ \{2,}&$/\&/g "remove trailing whitespace before '&' end of line
:%s/"/\\"/g "escape double quotes
:%s/&\n\([^<]\)/\1/g "Collapse all multiline entries to single line
:%s/&\n<\(KEYNO\)\@!\(HISTORY\)\@!\(CODEN\)\@!\(REFRENCE\)\@!\(AUTHORS\)\@!\(TITLE\)\@!\(KEYWORDS\)\@!\(SELECTRS\)\@!\(DOI\)\@!/</g "Lines that start with lessthan
:%s/<\(.*\)>\(.*\)&/"\1": "\2",/g "To JSON 
:%s/^"KEYNO\s\+": "\(.*",\)/{ "KEYNO": "\1/g "Start JSON struct 
:%s/\(^"\u\+\)\@<=\s*"/"/g "Remove trailing whitespace in tags 
:%s/\(^"REFRENCE": ".*\)\@<=\s(\(\d\d\d\d\))"/", "YEAR": "\2"/g "Make year field
:%s/",\n{/" }\r{/g "End JSON structures that don't have a DOI
:%s/",\n/", /g "Make JSON structures one big line
:w output.dat
:q!
