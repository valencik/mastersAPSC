import re
import csv

with open('myoutput.tsv', 'r') as tsvfile:
    #Rule looks like: {"J.Pereira","L.Audouin","T.Enqvist"} => {"P.Napolitani"}
    rules_reader = csv.reader(tsvfile, delimiter='\t')
    rules_iter = iter(rules_reader)
    next(rules_iter) #skip tsv header
    for rule in rules_iter:
        rule_no_brackets = re.sub(r'[{}]',r'',rule[1])
        rule_lhs,rule_rhs = re.split(r' => ',rule_no_brackets, maxsplit=1)
        rule_lhs = re.split(r',', rule_lhs)
        print(rule_lhs)
