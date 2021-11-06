#!/bin/bash

DIR=`dirname $0`
DIR=`cd ${DIR}; pwd`

echo "Running SQL proxy"

cloud_sql_proxy \
  -instances=gssb-library-c7c5e:us-central1:spils=tcp:3307 \
  -credential_file=${DIR}/functions/config/gssb-library-c7c5e-cloud-sql-dd579be31370.json
