pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'priyankamanickam/complaint-backend'
        NODE = 'C:\\Program Files\\nodejs\\node.exe'
        NPM = 'C:\\Program Files\\nodejs\\npm.cmd'
    }

    stages {

        stage('Start Test Environment') {
            steps {
                script {
                    bat "docker compose down --volumes --remove-orphans || exit 0"
                    bat "docker compose up -d mongodb backend"
                    powershell 'Start-Sleep -Seconds 15'
                }
            }
        }

        stage('Install Test Dependencies') {
            steps {
                dir('tests') {
                    bat "${env.NPM} install"
                }
            }
        }

        stage('Run Integration Tests') {
            steps {
                dir('tests') {
                    bat "${env.NPM} test"
                }
            }
        }

        stage('Build and Push Backend Image') {
            steps {
                script {
                    docker.withRegistry('https://docker.io', 'DockerHub') {
                        def image = docker.build("${DOCKER_IMAGE_BACKEND}:latest", "./backend")
                        image.push()
                    }
                }
            }
        }
    }

    post {
        always {
            bat "docker compose down --volumes --remove-orphans || exit 0"
        }
    }
}