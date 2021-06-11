pipeline {  
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '5'))
  }

  triggers {
    cron '@midnight'
  }

  stages {
    stage('Build') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            docker.build('node').inside {
              sh 'yarn build'
              archiveArtifacts 'server/diagram/*'
            }
          }
        }
      }
    }

    stage('Codechecks (ESLint)') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            docker.build('node').inside {
              timeout(30){
                sh "yarn lint -o eslint.xml -f checkstyle"
              }
            }
          }
        }
      }
    }

    stage('Tests (Mocha)') {
      steps { 
        script {
          docker.build('node').inside {
            timeout(30) {
              sh "yarn test:ci"
            }
          }
        }
      }
    }

    stage('Deploy (master only)') {
      when {
        branch 'master'
      }
      steps { 
        script {
          docker.image('maven:3.6.3-jdk-11').inside {
            maven cmd: "-f integration/eclipse/webview clean deploy"
          }
          archiveArtifacts '**/target/glsp-client-*.zip'
        }
      }
    }
  }
  post {
    always {
      // Record & publish ESLint issues
      recordIssues enabledForFailure: true, publishAllIssues: true, aggregatingResults: true, 
      tools: [esLint(pattern: 'node_modules/**/*/eslint.xml')], 
      qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]]

      withChecks('Tests') {
        junit 'node_modules/**/report.xml'
      }
    }
  }
}
