import csv
import jellyfish

def dist_calc(author_pair):
    dist = jellyfish.damerau_levenshtein_distance(author_pair[0], author_pair[1])
    if dist <= 3:
        author_pair.append(dist)
        return author_pair
    else:
        return False
    
with open('author-cluster-input.tsv', 'r', newline='') as tsvfile:
    reader = csv.DictReader(tsvfile, delimiter='\t', )
    authors = []
    for line in reader:
        authors.append(line['author'])

with open('author-name-ld-distance.tsv', 'w', newline='') as tsvfile:
    dist_writer = csv.writer(tsvfile, delimiter='\t')
    dist_writer.writerow(["author1", "author2", "ld_dist"])
    for i,first_author in enumerate(authors):
        for second_author in authors[i+1:]:
            dist_pair = dist_calc([first_author, second_author])
            if dist_pair:
                dist_writer.writerow(dist_pair)
