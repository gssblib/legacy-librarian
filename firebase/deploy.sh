#!/bin/bash -eu

DIR=`dirname $0`
DIR=`cd ${DIR}; pwd`

echo "Compiling Angular"

cd ${DIR}/../client2
npm install
node_modules/@angular/cli/bin/ng build --prod --base-href "/"
node_modules/@angular/cli/bin/ng build public --prod --base-href "/"

echo "Installing server dependencies"

cd ${DIR}/../server
npm install

echo "Deploying for ${DIR}"

cd ${DIR}/functions
npm install

export NODE_CONFIG_DIR=${DIR}/functions/config
export NODE_ENV=production

echo "Using ${NODE_CONFIG_DIR}/${NODE_ENV}.json"

firebase deploy
