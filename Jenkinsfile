pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'jananisaravanan9751/complaint-backend'
        DOCKER_PATH = '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"'
    }

    stages {

        stage('Start Test Environment') {
            steps {
                dir('STUDENT') {

                    script {
                        // 🔥 Force clean old containers
                        bat 'docker rm -f complaint-mongo complaint-backend complaint-frontend 2>nul || exit 0'

                        // 🔥 Clean networks
                        bat 'docker network prune -f'

                        // Stop existing containers
                        bat "${DOCKER_PATH} compose down --volumes --remove-orphans"

                        // Start fresh containers
                        bat "${DOCKER_PATH} compose up -d mongodb backend"
                    }

                    // Wait for backend to start
                    powershell '''
                        Write-Host "Waiting for backend to be ready..."
                        Start-Sleep -Seconds 20
                    '''

                    // Verify running containers
                    bat "${DOCKER_PATH} ps"
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
                dir('STUDENT/backend') {
                    bat "docker build -t %DOCKER_IMAGE_BACKEND%:latest ."
                    bat "docker push %DOCKER_IMAGE_BACKEND%:latest"
                }
            }
        }
    }

    post {
        always {
            dir('STUDENT') {
                bat "${DOCKER_PATH} compose down --volumes --remove-orphans"
            }
        }
    }
}