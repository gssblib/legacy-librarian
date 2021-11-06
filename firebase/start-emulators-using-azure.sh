#!/bin/bash

DIR=`dirname $0`
DIR=`cd ${DIR}; pwd`

echo "Running emulators for ${DIR}"

cd ${DIR}/functions
npm install

export NODE_CONFIG_DIR=${DIR}/functions/config
export NODE_ENV=azure
export GOOGLE_APPLICATION_CREDENTIALS=${DIR}/functions/config/gssb-library-c7c5e-firebase-adminsdk-1gafi-a5c1873ec3.json

echo "Using ${NODE_CONFIG_DIR}/${NODE_ENV}.json"

firebase emulators:start
