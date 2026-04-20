pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'jananisaravanan9751/complaint-backend'
    }

    stages {

        stage('Start Test Environment') {
            steps {
                script {
                    bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down --volumes --remove-orphans'
                    bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose up -d mongodb backend'
                }

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
                dir('backend') {
                    bat 'docker build -t jananisaravanan9751/complaint-backend:latest .'
                    bat 'docker push jananisaravanan9751/complaint-backend:latest'
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