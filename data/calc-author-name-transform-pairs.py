import argparse
import csv
from collections import defaultdict
import re

parser = argparse.ArgumentParser()
parser.add_argument('filename')
args = parser.parse_args()
author_list = args.filename

spacing = re.compile(r'\s*')
punc = re.compile(r'[^a-zA-Z0-9]')

names_lower = defaultdict(list)
names_nospace = defaultdict(list)
names_nopunc = defaultdict(list)

def build_transformation_dicts(inputfile):
    with open(inputfile, 'r', newline='') as tsvfile:
        reader = csv.DictReader(tsvfile, delimiter='\t')
        for line in reader:
            author = line['author']
            lower = author.lower()
            names_lower[lower].append(author)
            nospace = re.sub(spacing, '', author).lower()
            names_nospace[nospace].append(author)
            nopunc = re.sub(punc, '', author).lower()
            names_nopunc[nopunc].append(author)

def write_transformation_pairs(dictionary, filename):
    with open(filename, 'w', newline='') as tsvfile:
        pair_writer = csv.writer(tsvfile, delimiter='\t')
        for k in dictionary.keys():
            if len(dictionary[k]) >= 2:
                pair_writer.writerow(dictionary[k])

build_transformation_dicts(author_list)
write_transformation_pairs(names_lower, 'author-lower-pairs.tsv')
write_transformation_pairs(names_nospace, 'author-nospace-pairs.tsv')
write_transformation_pairs(names_nopunc, 'author-nopunc-pairs.tsv')
