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
    booleanParam(name: 'publish', defaultValue: false, description: 'Publish to NPM-Registry')
    string(name: 'nextVersion', defaultValue: '0.9.3-s1', description: 'Next version of product (0.9.3-s40[sprint number])')
    string(name: 'gitUserName', defaultValue: 'nobody', description: 'Git commit user name e.g. Alexander Suter')
    string(name: 'gitUserMail', defaultValue: 'nobody@axonivy.com' , description: 'Git commit user email e.g. alexander.suter@axonivy.com')
  }

  stages {
    stage('Build') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            docker.build('node').inside {
              sh 'yarn build'
              sh 'configs/link-integrations.sh'
              dir ('integration/vscode') {
                sh 'yarn build'
              }
              dir ('integration/eclipse') {
                sh 'yarn build'
              }
              dir ('integration/theia') {
                sh 'yarn build'
              }
              archiveArtifacts 'integration/eclipse/webview/app/*'
              archiveArtifacts 'integration/standalone/app/*'
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
              timeout(30) {
                sh 'yarn lint -o eslint.xml -f checkstyle'
                dir ('integration/vscode') {
                  sh 'yarn lint -o eslint.xml -f checkstyle'
                }
                dir ('integration/eclipse') {
                  sh 'yarn lint -o eslint.xml -f checkstyle'
                }
                dir ('integration/theia') {
                  sh 'yarn lint -o eslint.xml -f checkstyle'
                }
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
              sh 'yarn test:ci'
            }
          }
        }
      }
    }

    stage('Deploy (master only)') {
      when {
        allOf {
          branch 'master'
          expression { return currentBuild.currentResult == 'SUCCESS' }
        }
      }
      steps {
        script {
          docker.image('maven:3.6.3-jdk-11').inside {
            maven cmd: '-f integration/eclipse/webview clean deploy -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn'
            maven cmd: '-f integration/standalone clean deploy -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn'
          }
          archiveArtifacts 'integration/eclipse/webview/target/glsp-client-*.zip'
          archiveArtifacts 'integration/standalone/target/glsp-client-standalone*.jar'
        }
      }
    }

    stage('Publish (master only)') {
      when {
        allOf {
          branch 'master'
          expression { return currentBuild.currentResult == 'SUCCESS' && params.publish }
        }
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

            dir ('integration/vscode/webview') {
              sh "yarn upgrade @ivyteam/process-editor@${params.nextVersion}"
            }
            dir ('integration/vscode') {
              sh 'yarn'
            }
            dir ('integration/standalone') {
              sh "yarn upgrade @ivyteam/process-editor@${params.nextVersion}"
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
        junit 'node_modules/**/report.xml'
      }
    }
  }
}
