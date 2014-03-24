#!/bin/bash

pdflatex litReview.tex
bibtex litReview

pdflatex litReview.tex
pdflatex litReview.tex

open litReview.pdf
