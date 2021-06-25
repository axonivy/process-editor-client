#!/bin/bash

yarn link --cwd editor
yarn link --cwd node_modules/sprotty
yarn link --cwd node_modules/inversify
yarn link @ivyteam/process-editor --cwd integration/vscode
yarn link sprotty --cwd integration/vscode 
yarn link inversify --cwd integration/vscode 
