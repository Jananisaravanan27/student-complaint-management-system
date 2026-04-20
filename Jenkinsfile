pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'priyankamanickam/complaint-backend'
    }

    stages {

        stage('Start Test Environment') {
            steps {
                script {
                    // Use modern docker compose
                    bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down --volumes --remove-orphans'
                    bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose up -d mongodb backend'
                }

                // Better wait logic
                powershell '''
                    Write-Host "Waiting for backend to be ready..."
                    Start-Sleep -Seconds 20
                '''

                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" ps'
            }
        }

        stage('Install Test Dependencies') {
            steps {
                dir('tests') {
                    bat "npm install"
                }
            }
        }

        stage('Run Integration Tests') {
            steps {
                dir('tests') {
                    bat "npm test"
                }
            }
        }

        stage('Build and Push Backend Image') {
            steps {
                script {
                    docker.withRegistry('https://docker.io', 'DockerHub') {
                        dir('backend') {
                            def image = docker.build("${DOCKER_IMAGE_BACKEND}:latest")
                            image.push()
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down --volumes --remove-orphans'
        }
    }
}