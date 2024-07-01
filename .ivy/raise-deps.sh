#!/bin/bash
set -e

sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" packages/*/package.json
npm run update:axonivy:next
if [ "$DRY_RUN" = false ]; then
  npm install
fi
