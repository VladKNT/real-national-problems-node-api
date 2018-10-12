#!/usr/bin/env bash

###############################################################################
## Start tests
###############################################################################
started_at=$(date +"%s")

echo "-----> Provisioning containers"
docker-compose -f docker-compose.test.yml up -d
echo ""

web=$(docker ps | grep web-test_1 | awk '{print $NF}')
db=$(docker ps | grep db-test_1 | awk '{print $NF}')

# Installing npm packages.
echo "-----> Installing npm packages"
docker exec -it "$web" npm install
echo ""


# Run Sequalize's migrations.
echo "-----> Running application migrations"
docker exec -it "$web" sequelize db:migrate
echo ""

# Run Sequalize's seeders creation.
echo "-----> Installing seeders (fake data)"
docker exec -it "$web" sequelize db:seed:all
echo ""

# Run tests.
echo "-----> Run tests"
docker exec -it "$web" npm run test
echo ""

# Drop tables.
echo "-----> Drop tables"
docker exec -it "$web" sequelize db:migrate:undo:all
echo ""

# Stop containers.
echo "-----> Stop containers"
docker stop "$web"
docker stop "$db"
echo ""

ended_at=$(date +"%s")

minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Done in ${minutes}m${seconds}s"
