pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'priyankamanickam/complaint-backend'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Start Test Environment') {
            steps {
                dir('STUDENT') {
                    script {
                        // Force remove old containers (fix conflict issue)
                        bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm -f complaint-mongo complaint-backend || exit 0'

                        // Clean environment
                        bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down --volumes --remove-orphans || exit 0'

                        // Start fresh containers
                        bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose up -d mongodb backend'
                    }

                    powershell '''
                        Write-Host "Waiting for backend to be ready..."
                        Start-Sleep -Seconds 20
                    '''

                    bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" ps'
                }
            }
        }

        stage('DEBUG - Check files') {
            steps {
                dir('STUDENT/tests') {
                    bat 'echo CURRENT DIRECTORY:'
                    bat 'cd'
                    bat 'echo FILES:'
                    bat 'dir'
                }
            }
        }

        stage('Install Test Dependencies') {
            steps {
                dir('STUDENT/tests') {
                    bat "npm install"
                }
            }
        }

        stage('Run Integration Tests') {
            steps {
                dir('STUDENT/tests') {
                    bat "npm test"
                }
            }
        }

        stage('Build and Push Backend Image') {
            steps {
                script {
                    docker.withRegistry('https://docker.io', 'DockerHub') {
                        dir('STUDENT/backend') {
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
            dir('STUDENT') {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down --volumes --remove-orphans || exit 0'
            }
        }
    }
}