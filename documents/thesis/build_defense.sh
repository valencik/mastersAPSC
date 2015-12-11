#!/usr/bin/env bash
set -e

cp defense.md ~/Dropbox/Masters/
# Temporary comment filter for custom markdown
echo "Removing custom markdown comments..."
sed '/^%- .*$/d' defense.md > no_comments_defense.md

pandoc -s -i -t revealjs no_comments_defense.md -o slides.html
open slides.html
