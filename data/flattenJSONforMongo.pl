#!/usr/bin/perl -pi

use strict;
use warnings;

# This helps with multiline regex
BEGIN {$/ = "}\n";}


# Flatten JSON for mongoimport
s/{\n/{/mg;
s/,\n"/, "/mg;
s/\n}/ }/mg;

# Escape all the backslashes
s/\\(?!")/\\\\/mg;
