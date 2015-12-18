#!/usr/bin/env bash
set -e

# Quick backup to Dropbox
cp thesis.md ~/Dropbox/Masters/

# Get the American Physics Society CSL file
if [ ! -f american-physics-society.csl ];
then
  echo "Downloading the American Physics Society CSL file..."
  wget -q https://raw.githubusercontent.com/citation-style-language/styles/master/american-physics-society.csl
fi

# Temporary comment filter for custom markdown
echo "Removing custom markdown comments..."
sed '/^%- .*$/d' thesis.md > no_comments_thesis.md

# Concatenate Appendix and Bibliography
cat appendix.md >> no_comments_thesis.md
cat bibliography-stub.md >> no_comments_thesis.md

echo "Invoking Pandoc for TeX file creation..."
pandoc --table-of-contents --number-sections --standalone \
  --include-in-header=header.tex --include-before-body=beforebody.tex \
  --columns=120 \
  --filter ./minted-listings.py \
  --filter pandoc-fignos \
  --filter pandoc-tablenos \
  --filter pandoc-eqnos \
  --filter pandoc-citeproc \
  no_comments_thesis.md --output NSR-Thesis.tex

echo "Calling pdflatex..."
pdflatex -shell-escape NSR-Thesis.tex
pdflatex -shell-escape NSR-Thesis.tex

echo "Invoking Pandoc for HTML file creation..."
pandoc --table-of-contents --number-sections --standalone \
  --css=web_pandoc.css \
  --mathjax=https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML \
  --filter pandoc-fignos \
  --filter pandoc-tablenos \
  --filter pandoc-eqnos \
  --filter pandoc-citeproc \
  no_comments_thesis.md --output NSR-Thesis.html

echo "Opening PDF..."
open NSR-Thesis.pdf
