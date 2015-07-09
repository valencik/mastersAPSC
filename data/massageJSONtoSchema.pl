#!/usr/bin/perl -pi

use strict;
use warnings;

# Extract year to its own field
s/^"_id":"((\d\d\d\d).*)",$/"_id":"$1",\n"year":$2,/g;

# Extract type into its own field
s/^"code":"((\w*).*)",$/"code":"$1",\n"type":"$2",/g;

# Turn author names into array elements
s/([^]]), /$1", "/g if /^"authors":\[/;
s/", "Jr."/, Jr."/g if /^"authors":\[/; #Fix the Jr's

# Turn history stamps into array elements
s/(\b) (\b)/$1", "$2/g if /^"history":\[/;

# Split selectors
s/([A-Z]):(.*?);(.*?)\./{"type":"$1", "value":"$2", "subkey":"$3"},/g if /^"selectors":\[/;
s/^"selectors":\["/"selectors":\[/g;
s/}, *"]/}]/ if /^"selectors":\[/;

# Turn NSR free text fields into valid LaTeX
# Special characters in NSR according to NSR Manual
s/\|A/A /g;
s/\|B/B /g;
s/\|C/H /g;
s/\|D/\\Delta /g;
s/\|E/E /g;
s/\|F/\\Phi /g;
s/\|G/\\Gamma /g;
s/\|H/X /g;
s/\|I/I /g;
s/\|J/\\sim /g;
s/\|K/K /g;
s/\|L/\\Lambda /g;
s/\|M/M /g;
s/\|N/N /g;
s/\|O/O /g;
s/\|P/\\Pi /g;
s/\|Q/\\Theta /g;
s/\|R/R /g;
s/\|S/\\Sigma /g;
s/\|T/T /g;
s/\|U/\\Upsilon /g;
s/\|V/\\nabla /g;
s/\|W/\\Omega /g;
s/\|X/\\Xi /g;
s/\|Y/\\Psi /g;
s/\|Z/Z /g;
s/\|a/\\alpha /g;
s/\|b/\\beta /g;
s/\|c/\\eta /g;
s/\|d/\\delta /g;
s/\|e/\\varepsilon /g;
s/\|f/\\phi /g;
s/\|g/\\gamma /g;
s/\|h/\\chi /g;
s/\|i/\\iota /g;
s/\|j/\\epsilon /g;
s/\|k/\\kappa /g;
s/\|l/\\lambda /g;
s/\|m/\\mu /g;
s/\|n/\\nu /g;
s/\|o/o /g;
s/\|p/\\pi /g;
s/\|q/\\theta /g;
s/\|r/\\rho /g;
s/\|s/\\sigma /g;
s/\|t/\\tau /g;
s/\|u/\\upsilon /g;
s/\|w/\\omega /g;
s/\|x/\\xi /g;
s/\|y/\\psi /g;
s/\|z/\\zeta /g;
s/\|'/^\\circ /g;
s/\|`/\\ell /g;
s/\|\(/\\gets /g;
s/\|\)/\\to /g;
s/\|\*/\\times /g;
s/\|\+/\\pm /g;
s/\|\-/\\mp /g;
s/\|\./\\propto /g;
s/\|4/< /g;
s/\|5/> /g;
s/\|6/\\surd /g;
s/\|7/\\int /g;
s/\|8/\\prod /g;
s/\|9/\\sum /g;
s/\|</\\le /g;
s/\|=/\\ne /g;
s/\|>/\\ge /g;
s/\|\?/\\approx /g;
s/\|@/\\infty /g;
s/\|\[/\\{ /g;
s/\|\\/\\vert /g;
s/\|\]/\\} /g;
s/\|^/\\uparrow /g;
s/\|_/\\downarrow /g;

# Remove double whitespace
s/ {2,}/ /g;
