#!/bin/bash
set -e

sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" packages/*/package.json
yarn update:axonivy:next
if [ "$DRY_RUN" = false ]; then
  yarn install --ignore-scripts
fi
