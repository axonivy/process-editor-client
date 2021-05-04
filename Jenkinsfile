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
            sh 'yarn'
          }

          if (env.BRANCH_NAME == 'master') {
            docker.image('maven:3.6.3-jdk-11').inside {
              maven cmd: "clean deploy"
            }
          }          
          archiveArtifacts 'target/glsp-client-*.zip'
        }
      }
    }
  }
}
