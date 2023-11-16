#!/bin/bash
set -e

VERSION="v1.1.5"
URL="https://softphone.v9.com.vn/releases/download/${VERSION}/release.zip"
LOCK=".libs.lock"
DEST=".libs.zip"
DOWNLOAD=true

if ! type "curl" > /dev/null; then
    echo "Missed curl dependency" >&2;
    exit 1;
fi
if ! type "tar" > /dev/null; then
    echo "Missed tar dependency" >&2;
    exit 1;
fi

if [ -f ${LOCK} ]; then
    CURRENT_VERSION=$(cat ${LOCK})

    if [ "${CURRENT_VERSION}" == "${VERSION}" ];then
        DOWNLOAD=false
    fi
fi

if [ "$DOWNLOAD" = true ]; then
    curl -L --silent "${URL}" -o "${DEST}"
    unzip "${DEST}"
    rm -f "${DEST}"

    echo "${VERSION}" > ${LOCK}
fi