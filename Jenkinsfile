pipeline {  
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '5'))
  }

  triggers {
    cron '@midnight'
  }

  stages {
    stage('build') {
      steps {
        script {
          docker.build('node').inside {
            sh 'npm install --global yarn'
            sh 'yarn'
            archiveArtifacts 'server/diagram/*'
          }

          if (env.BRANCH_NAME == 'master') {
            docker.image('maven:3.6.3-jdk-11').inside {
              maven cmd: "clean deploy"
            }
          }          
        }
      }
    }
  }
}
