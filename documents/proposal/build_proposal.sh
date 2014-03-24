#!/bin/bash

pdflatex researchProposal.tex
bibtex researchProposal

pdflatex researchProposal.tex
pdflatex researchProposal.tex

open researchProposal.pdf
