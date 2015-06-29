#!/usr/bin/env bash

#Temporary comment filter for custom markdown
sed '/^%- .*$/d' thesis.md > thesis_no_comments.md

pandoc --table-of-contents --number-sections  \
  --include-in-header=header.tex --include-before-body=beforebody.tex \
  --filter ./minted.py \
  thesis_no_comments.md --output Thesis.tex

pdflatex -shell-escape Thesis.tex

open Thesis.pdf
