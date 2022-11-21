#!/bin/bash

# First unlink to be sure we link the folders form this workspace
# Unlink shows an error if it was not linked before, just ingore
yarn unlink --cwd editor
yarn link --cwd editor

yarn unlink --cwd node_modules/sprotty
yarn link --cwd node_modules/sprotty


yarn unlink --cwd node_modules/@eclipse-glsp/client
yarn link --cwd node_modules/@eclipse-glsp/client

yarn unlink --cwd node_modules/@eclipse-glsp/protocol
yarn link --cwd node_modules/@eclipse-glsp/protocol

yarn link @ivyteam/process-editor --cwd integration/eclipse

yarn link sprotty --cwd integration/eclipse

yarn link @eclipse-glsp/client --cwd integration/eclipse

yarn link @eclipse-glsp/protocol --cwd integration/eclipse
