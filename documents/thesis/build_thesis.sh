#!/usr/bin/env bash

#Temporary comment filter for custom markdown
sed '/^%- .*$/d' thesis.md > thesis_no_comments.md

pandoc --table-of-contents --number-sections thesis_no_comments.md --output Thesis.pdf

open Thesis.pdf
