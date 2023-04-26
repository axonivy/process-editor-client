#!/bin/bash

mvn --batch-mode -f integration/eclipse/webview/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f integration/standalone/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f integration/standalone/glsp-test-project/pom.xml versions:set versions:commit -DnewVersion=${1}

yarn install --ignore-scripts
yarn lerna version ${1/SNAPSHOT/next} --no-git-tag-version --no-push --ignore-scripts --exact --yes
