#!/bin/bash
set -e

sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" packages/*/package.json
yarn update:axonivy:next
yarn install --ignore-scripts
