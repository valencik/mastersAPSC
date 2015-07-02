#!/usr/bin/env bash -e

#Temporary comment filter for custom markdown
sed '/^%- .*$/d' thesis.md > thesis_no_comments.md

pandoc --table-of-contents --number-sections --standalone \
  --include-in-header=header.tex --include-before-body=beforebody.tex \
  --filter ./minted.py \
  thesis_no_comments.md --output Thesis.tex

pdflatex -shell-escape Thesis.tex
pdflatex -shell-escape Thesis.tex

pandoc --table-of-contents --number-sections --standalone \
  --css=web_pandoc.css \
  thesis_no_comments.md --output Thesis.html

open Thesis.pdf
