pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'priyankamanickam/complaint-backend'   // change to your repo
        // Full paths – update these to match your machine
        DOCKER_COMPOSE = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker-compose.exe'
        NODE = 'C:\\Program Files\\nodejs\\node.exe'
        NPM = 'C:\\Program Files\\nodejs\\npm.cmd'
    }

    stages {
        stage('Start Test Environment') {
            steps {
                script {
                    bat "${env.DOCKER_COMPOSE} down --volumes --remove-orphans || true"
                    bat "${env.DOCKER_COMPOSE} up -d mongodb backend"
                    powershell 'Start-Sleep -Seconds 15'
                }
            }
        }

        // stage('Install Test Dependencies') {
        //     steps {
        //         dir('tests') {
        //             bat "${env.NPM} install axios"
        //         }
        //     }
        // }

        stage('Run Integration Tests') {
        steps {
            dir('tests') {
                bat "${env.NPM} install"
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
            bat "${env.DOCKER_COMPOSE} down --volumes --remove-orphans || true"
        }
    }
}