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

yarn unlink --cwd node_modules/vscode-jsonrpc
yarn link --cwd node_modules/vscode-jsonrpc

yarn link @ivyteam/process-editor --cwd integration/vscode
yarn link @ivyteam/process-editor --cwd integration/eclipse
yarn link @ivyteam/process-editor --cwd integration/theia

yarn link sprotty --cwd integration/vscode
yarn link sprotty --cwd integration/eclipse
yarn link sprotty --cwd integration/theia

yarn link @eclipse-glsp/client --cwd integration/vscode
yarn link @eclipse-glsp/client --cwd integration/eclipse
yarn link @eclipse-glsp/client --cwd integration/theia

yarn link @eclipse-glsp/protocol --cwd integration/vscode
yarn link @eclipse-glsp/protocol --cwd integration/eclipse
yarn link @eclipse-glsp/protocol --cwd integration/theia

yarn link vscode-jsonrpc --cwd integration/vscode
yarn link vscode-jsonrpc --cwd integration/eclipse
yarn link vscode-jsonrpc --cwd integration/theia
