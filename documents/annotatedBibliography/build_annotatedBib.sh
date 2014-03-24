#!/bin/bash

pdflatex annotatedBib.tex
bibtex annotatedBib

pdflatex annotatedBib.tex
pdflatex annotatedBib.tex

open annotatedBib.pdf
