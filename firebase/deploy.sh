#!/bin/bash

DIR=`dirname $0`
DIR=`cd ${DIR}; pwd`

echo "Deploying for ${DIR}"

cd ${DIR}/functions
npm install

export NODE_CONFIG_DIR=${DIR}/functions/config
export NODE_ENV=production

echo "Using ${NODE_CONFIG_DIR}/${NODE_ENV}.json"

firebase deploy
