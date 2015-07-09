#!/usr/bin/env bash -e

cp NSRDump.out NSR.json
perl parseNSRtoJSON.pl NSR.json
perl massageJSONtoSchema.pl NSR.json
perl flattenJSONforMongo.pl NSR.json

mongoimport -d masters -c NSR --type json --file NSR.json
