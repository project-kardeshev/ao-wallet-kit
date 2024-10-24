#!/bin/bash

# The version to be released is passed as the first argument to the script
nextRelease_version=$1

# Update the version in src/version.ts
sed -i.bak -e "s/export const version = '.*';/export const version = '${nextRelease_version}';/" src/version.ts && rm src/version.ts.bak

# Update the version in dist/version.d.ts
sed -i.bak -e "s/export const version = '.*';/export const version = '${nextRelease_version}';/" dist/version.d.ts && rm dist/version.d.ts.bak