#!/bin/bash

set -euxo pipefail
shopt -s inherit_errexit

pushd employee-award-portal
git pull origin master
docker-compose -f .circleci/docker-compose.yml down
docker-compose -f .circleci/docker-compose.yml up --build -d
