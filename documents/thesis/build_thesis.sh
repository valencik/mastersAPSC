#!/usr/bin/env bash -e

# Get the American Physics Society CSL file
if [ ! -f american-physics-society.csl ];
then
  echo "Downloading the American Physics Society CSL file..."
  wget -q https://raw.githubusercontent.com/citation-style-language/styles/master/american-physics-society.csl
fi

# Temporary comment filter for custom markdown
echo "Removing custom markdown comments..."
sed '/^%- .*$/d' thesis.md > thesis_no_comments.md

echo "Invoking Pandoc for TeX file creation..."
pandoc --table-of-contents --number-sections --standalone \
  --include-in-header=header.tex --include-before-body=beforebody.tex \
  --filter ./minted-listings.py \
  --filter pandoc-fignos \
  --filter pandoc-tablenos \
  --filter pandoc-eqnos \
  --filter pandoc-citeproc \
  thesis_no_comments.md --output Thesis.tex

echo "Calling pdflatex..."
pdflatex -shell-escape Thesis.tex
pdflatex -shell-escape Thesis.tex

echo "Invoking Pandoc for HTML file creation..."
pandoc --table-of-contents --number-sections --standalone \
  --css=web_pandoc.css \
  --mathjax=https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML \
  --filter pandoc-fignos \
  --filter pandoc-tablenos \
  --filter pandoc-eqnos \
  --filter pandoc-citeproc \
  thesis_no_comments.md --output Thesis.html

echo "Opening PDF..."
open Thesis.pdf
