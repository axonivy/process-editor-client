#!/bin/bash

mvn --batch-mode versions:set-property versions:commit -f integration/standalone/pom.webtest.xml -Dproperty=project.build.plugin.version -DnewVersion=${2} -DallowSnapshots=true
