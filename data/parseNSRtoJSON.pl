#!/usr/bin/perl -pi

use strict;
use warnings;

# This helps with multiline regex
BEGIN {undef $/;}

#Fix erroneous verticle bars
s/\(\|\|\)/\\leftrightarrow/mg; # 2006VO15 and 2007EL04
s/\|\|V{-tb}\|\|/\\vert |V{-tb} \\vert/; # 2007AB22
s/\|\|g/\|g/mg; #2009RE20 2011KU10 2012KR07
#s/measured E\|g,I\|\|g\. Data/measured E|g,I|g. Data/; #2007MIZO
s/the \(\\{\+3\\}He,t\) Reaction/the ({+3}He,t) Reaction/; #1984VAZR
s/A\\\|'/\\AA/; #1996RA31

# Cleaning up the CODEN's
s/^<CODEN   >(JOYR|JUOUR|JOur|PRVCA|Nature|J\{OUR) /<CODEN   >JOUR /mg;
s/^<CODEN   >Conf /<CODEN   >CONF /mg;
s/^<CODEN   >(REPR|REP>T|REPTT|Rept) /<CODEN   >REPT /mg;
s/^<CODEN   >Book /<CODEN   >BOOK /mg;
s/^<CODEN   >(THE{SIS|Thesis,) /<CODEN   >THESIS /mg;

# Force any remaining problems to simply be type UNKNOWN
s/^<CODEN   >(?!JOUR)(?!REPT)(?!CONF)(?!THESIS)(?!PC)(?!PREPRINT)(?!BOOK)/<CODEN   >UNKNOWN /mg;

# Escape double quotes
s/"/\\"/g;

# Collapse all multiline entries to single line
s/&\n(.)(?!KEYNO)(?!HISTORY)(?!CODEN)(?!REFRENCE)(?!AUTHORS)(?!TITLE)(?!KEYWORDS)(?!SELECTRS)(?!DOI)/$1/mg;

# Remove tailing whitespace and tabs
s/ +&$/&/mg;
s/\t/ /mg;
s/, ,/, /g; #Fix empty separated values

# Basic parsing
s/^<KEYNO   >(.*)&$/{\n"_id":"$1",/mg;
s/^<HISTORY >(.*)&$/"history":["$1"],/mg;
s/^<CODEN   >(.*)&$/"code":"$1",/mg;
s/^<REFRENCE>(.*)&$/"reference":"$1",/mg;
s/^<AUTHORS >(.*)&$/"authors":["$1"],/mg;
s/^<TITLE   >(.*)&$/"title":"$1",/mg;
s/^<DOI     >(.*)&$/"DOI":"$1",/mg;
s/^<KEYWORDS>(.*)&$/"keywords":["$1"],/mg;
s/^<SELECTRS>(.*)&$/"selectors":["$1"],/mg;

# Remove double whitespace
s/ {2,}/ /g;

# End JSON structures
s/,\n{/\n}\n{/mg; 
s/,$/\n}/;
