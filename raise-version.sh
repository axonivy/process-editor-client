#!/bin/bash

mvn --batch-mode -f integration/eclipse/webview/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f integration/standalone/pom.xml versions:set versions:commit -DnewVersion=${1}
