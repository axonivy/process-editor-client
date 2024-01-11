#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/process-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/process-editor-inscription@${1}" --registry $REGISTRY
npm unpublish "@axonivy/process-editor-protocol@${1}" --registry $REGISTRY
