#!/usr/bin/env bash

###############################################################################
## RNP Quickstart Script
###############################################################################
started_at=$(date +"%s")

echo "-----> Provisioning containers"
docker-compose up -d
echo ""

web=$(docker-compose ps | grep web-dev_1 | awk '{print $1}')

# Run Sequalize's migrations.
echo "-----> Running application migrations"
docker exec -it "$web" sequelize db:migrate
echo ""

ended_at=$(date +"%s")

minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Done in ${minutes}m${seconds}s"