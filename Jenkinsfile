pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '5'))
  }

  triggers {
    cron '@midnight'
  }

  environment {
    NPM_TOKEN = credentials('npm-registry.ivyteam.io-publish-token')
  }

  parameters {
    string(name: 'engineSource', defaultValue: 'https://product.ivyteam.io/', description: 'Engine page url')
    booleanParam(name: 'publish', defaultValue: false, description: 'Publish to NPM-Registry')
    string(name: 'nextVersion', defaultValue: '0.9.3-s1', description: 'Next version of product (0.9.3-s40[sprint number])')
    string(name: 'gitUserName', defaultValue: 'nobody', description: 'Git commit user name e.g. Alexander Suter')
    string(name: 'gitUserMail', defaultValue: 'nobody@axonivy.com' , description: 'Git commit user email e.g. alexander.suter@axonivy.com')
  }

  stages {
    stage('Build') {
      steps {
        script {
          catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
            docker.build('node').inside {
              sh 'yarn build'
              archiveArtifacts 'integration/eclipse/app/*'
              archiveArtifacts 'integration/standalone/app/*'
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
        expression { isReleaseOrMasterBranch() && currentBuild.currentResult == 'SUCCESS' && params.publish }
      }
      steps {
        script {
          docker.build('node').inside {
            sh "git config --global user.name '${params.gitUserName}'"
            sh "git config --global user.email '${params.gitUserMail}'"
            def releaseBranch = "release-${params.nextVersion}"
            sh "git checkout -b ${releaseBranch} ${env.BRANCH_NAME}"
            sh "echo //npm-registry.ivyteam.io/repository/private/:_authToken=${env.NPM_TOKEN} > .npmrc"
            sh "yarn lerna version ${params.nextVersion} --yes && yarn publish:package"
            sh 'rm .npmrc'

            dir ('integration/eclipse/webview') {
              sh "yarn upgrade @ivyteam/process-editor@${params.nextVersion}"
            }
            dir ('integration/eclipse') {
              sh 'yarn'
            }

            sh 'git commit --all --amend --no-edit'

            withEnv(['GIT_SSH_COMMAND=ssh -o StrictHostKeyChecking=no']) {
              sshagent(credentials: ['github-axonivy']) {
                sh "git tag -f v${params.nextVersion}"
                sh 'git remote set-url origin git@github.com:axonivy/glsp-editor-client.git'
                sh "git push -u origin ${releaseBranch}"
                sh "git push origin v${params.nextVersion}"
              }
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
        junit testDataPublishers: [[$class: 'AttachmentPublisher'], [$class: 'StabilityTestDataPublisher']], testResults: 'node_modules/**/report.xml'
      }
    }
  }
}

def isReleaseOrMasterBranch() {
  return env.BRANCH_NAME == 'master' || env.BRANCH_NAME.startsWith('release/') 
}
