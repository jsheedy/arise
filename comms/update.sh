#!/bin/bash

mv comms.json comms.json-`date +%s`
url='http://arise.velotronheavyindustries.com/communications/json/'
curl $url |gzip -d > comms.json
