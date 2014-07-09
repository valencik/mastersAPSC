" Vim Script to clean the NSR database before parsing.
" Created by Andrew Valencik
" Last modified: March 30, 2014

:let t = localtime()
:%s/^<CODEN   >JOYR /<CODEN   >JOUR /
:%s/^<CODEN   >JUOUR /<CODEN   >JOUR /
:%s/^<CODEN   >JOur /<CODEN   >JOUR /
:%s/^<CODEN   >PRVCA /<CODEN   >JOUR /
:%s/^<CODEN   >Nature /<CODEN   >JOUR /
:2235799s/^<CODEN   >J{OUR /<CODEN   >JOUR /

:236873s/^<CODEN   >/<CODEN   >PREPRINT /

:%s/^<CODEN   >Conf /<CODEN   >CONF /

:%s/^<CODEN   >REPR /<CODEN   >REPT /
:%s/^<CODEN   >REP>T /<CODEN   >REPT /
:%s/^<CODEN   >REPTT /<CODEN   >REPT /
:%s/^<CODEN   >Rept /<CODEN   >REPT /

:%s/^<CODEN   >Book /<CODEN   >BOOK /

:706773s/^<CODEN   >THE{SIS /<CODEN   >THESIS /
:2232400s/^<CODEN   >Thesis, /<CODEN   >THESIS /

:%s/^<CODEN   > \{70}/<CODEN   >UNKNOWN /
:%s/^<CODEN   >AFYSA /<CODEN   >UNKNOWN /
:47628s/^<CODEN   >/<CODEN   >UNKNOWN /

:echo "Regex (coden & reference): ".(localtime()-t)." s"
"Save and quit
:w outputcleanNSR.dat
:q!
