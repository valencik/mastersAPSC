#!/usr/bin/perl -pi

use strict;
use warnings;

# This helps with multiline regex
BEGIN {undef $/;}

# Cleaning up the CODEN's
s/^<CODEN   >(JOYR|JUOUR|JOur|PRVCA|Nature|J\{OUR) /<CODEN   >JOUR /g;
s/^<CODEN   >Conf /<CODEN   >CONF /g;
s/^<CODEN   >(REPR|REP>T|REPTT|Rept) /<CODEN   >REPT /g;
s/^<CODEN   >Book /<CODEN   >BOOK /g;
s/^<CODEN   >(THE{SIS|Thesis,) /<CODEN   >THESIS /g;

# Force any remaining problems to simply be type UNKNOWN
s/^<CODEN   >(?!JOUR)(?!REPT)(?!CONF)(?!THESIS)(?!PC)(?!PREPRINT)/<CODEN   >UNKNOWN /g;

# Remove tailing whitespace and tabs
s/\t/  /g;
s/ {2,}&$/&/mg;

# Escape double quotes
s/"/\\"/g;

# Collapse all multiline entries to single line
s/&\n(.)(?!KEYNO)(?!HISTORY)(?!CODEN)(?!REFRENCE)(?!AUTHORS)(?!TITLE)(?!KEYWORDS)(?!SELECTRS)(?!DOI)/$1/mg;

# KEYNO parsing
s/^<KEYNO   >((\d\d\d\d).*)&$/{ "_id": "$1", "year": $2,/mg;

# HISTORY parsing
s/^<HISTORY >(\w+)\s*&/"history":["$1"],/mg;
s/^<HISTORY >(\w+)\s+(\w+)\s*&/"history":["$1", "$2"],/mg;

# CODEN parsing
s/^<CODEN   >((\w*).*)&$/"code": "$1", "type": "$2",/mg;

# REFRENCE parsing
s/^<REFRENCE>(.*)&$/"reference": "$1",/mg;
 
# Authors to an array
s/^<AUTHORS >(.*)&$/"authors":["$1"],/mg;
#The follow never runs with /m, and it runs everywhere with it
#s/[^]], /", "/g if /^"authors":\[/m;
#s/[^]], /", "/g if /"authors":/m;
#s/[^]], /", "/g if /"authors":/;
 
# Title, DOI
s/^<TITLE   >(.*)&$/"title": "$1",/mg;
s/^<DOI     >(.*)&$/"DOI": "$1",/mg;
### 
### # Keywords
### :%g/^<KEYWORDS>/ s/<KEYWORDS>([NRAC]\u\{4,} [RSMP]\u\{4,}\|[NRAC]\u\{4,})[ ,](.*)&\n<SELECTRS>(.*)&$/"\L$1\E": {"sentence": "$2", "selector": "$3"},/ | s/^"(\w\+\s)\=(\w\+)": {/"$2": {/
### 
### # End JSON structures
### s/,\n{/ }\r{/ 
### 
### # Make JSON structures one big line
### s/,\n/, /g 
### 
### # Field values ending in \
### s/\\", "/\\ ", "/g 
### 
### # End the very last JSON doc
### :normal G$F,cw }
