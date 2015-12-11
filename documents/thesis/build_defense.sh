#!/usr/bin/env bash
set -e

cp defense.md ~/Dropbox/Masters/
# Temporary comment filter for custom markdown
echo "Removing custom markdown comments..."
sed '/^%- .*$/d' defense.md > no_comments_defense.md

echo "Converting to RevealJS with Pandoc..."
pandoc -s -i -t revealjs no_comments_defense.md -o slides.html

echo "Embarassing gross hack..."
toend=$(wc -l slides.html | egrep -o "[0-9]+")
trim=$((toend - 19))
head -n $trim slides.html > my_slides.html
cat reveal-bottom.txt >> my_slides.html

open my_slides.html
