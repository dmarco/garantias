#!/usr/bin/env bash

set -e   # (errexit) Exit if any subcommand or pipeline returns a non-zero status
set -u   # (nounset) Exit on any attempt to use an uninitialised variable

cd /usr/app
npm run build

exec npm run start
