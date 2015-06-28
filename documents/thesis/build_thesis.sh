#!/usr/bin/env bash

#Temporary comment filter for custom markdown
sed '/^%- .*$/d' thesis.md > thesis_no_comments.md

pandoc thesis_no_comments.md -o Thesis.pdf

open Thesis.pdf
