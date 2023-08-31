pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '5'))
  }

  triggers {
    cron '@midnight'
  }

  parameters {
    string(name: 'engineSource', defaultValue: 'https://product.ivyteam.io/', description: 'Engine page url')
  }

  stages {
    stage('Build') {
      steps {
        script {
          catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
            docker.build('node').inside {
              sh 'yarn build'
              archiveArtifacts 'integration/eclipse/build/*'
              archiveArtifacts 'integration/standalone/build/*'
            }
          }
        }
      }
    }

    stage('Codechecks (ESLint)') {
      steps {
        script {
          catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
            docker.build('node').inside {
              timeout(30) {
                sh 'yarn lint -o eslint.xml -f checkstyle'
              }
            }
          }
        }
      }
    }

    stage('Tests (Mocha)') {
      steps {
        script {
          catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
            docker.build('node').inside {
              timeout(30) {
                sh 'yarn test:ci'
              }
            }
          }
        }
      }
    }

    stage('Web Tests (Playwright)') {
      steps {
        script {
          docker.build('node-webtest', '-f integration/standalone/Dockerfile .').inside {
            dir ('integration/standalone/glsp-test-project') {
              maven cmd: "-ntp verify -Dengine.page.url=${params.engineSource}"
            }
          }
          archiveArtifacts artifacts: 'integration/standalone/test-results/**', allowEmptyArchive: true
          archiveArtifacts artifacts: 'integration/standalone/glsp-test-project/target/**/ivy.log', allowEmptyArchive: true
        }
      }
    }

    stage('Deploy (Maven)') {
      when {
        expression { isReleaseOrMasterBranch() && currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        script {
          docker.image('maven:3.8.6-eclipse-temurin-17').inside {
            maven cmd: '-ntp -f integration/eclipse clean deploy -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn'
            maven cmd: '-ntp -f integration/standalone clean deploy -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn'
          }
          archiveArtifacts 'integration/eclipse/target/editor-client-eclipse-*.zip'
          archiveArtifacts 'integration/standalone/target/editor-client-standalone*.jar'
        }
      }
    }

    stage('Publish (NPM)') {
      when {
        expression { isReleaseOrMasterBranch() && currentBuild.changeSets.size() > 0 }
      }
      steps {
        script {
          docker.build('node').inside {
            sh 'yarn build'
            withNPM(npmrcConfig:'npmjs-registry.ivyteam.io') {
              sh 'yarn publish:next'
            }
          }
        }
      }
    }

  }
  post {
    always {
      discoverGitReferenceBuild defaultBranch: 'master'
      // Record & publish ESLint issues
      recordIssues enabledForFailure: true, publishAllIssues: true, aggregatingResults: true,
      tools: [esLint(pattern: 'node_modules/**/*/eslint.xml')],
      qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]]

      withChecks('Tests') {
        junit testDataPublishers: [[$class: 'StabilityTestDataPublisher']], testResults: 'node_modules/**/report.xml'
      }
    }
  }
}

def isReleaseOrMasterBranch() {
  return env.BRANCH_NAME == 'master' || env.BRANCH_NAME.startsWith('release/') 
}
