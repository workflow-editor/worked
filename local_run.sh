#!/usr/bin/env bash

ENV_FILE="local_env";
REQUIRED_ENV_VARS=('NODE_ENV' 'REACT_APP_API_URL');

[ ! -f ${ENV_FILE} ] && echo Environment file not found && exit 1;

echo Sourcing ${ENV_FILE};
set -a;
source ./${ENV_FILE};
set +a;

echo Checking environment variables;
for i in "${REQUIRED_ENV_VARS[@]}"; do

    if [[ -v ${i} ]]; then
        echo ${i} exists;
    else
        echo ${i} not set, aborted!;
        exit 1;
    fi
done

# cmd
npm start