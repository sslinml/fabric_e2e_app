#!/bin/bash

cd ../basic-network
./stop.sh

docker rm -f $(docker ps -aq)

docker rmi -f $(docker images | grep "dev\|none\|test-vp\|peer[0-9]-" | awk '{print $3}')

#docker-compose -f docker-compose.yaml down --volumes

# remove the local state
rm -f ~/.hfc-key-store/*