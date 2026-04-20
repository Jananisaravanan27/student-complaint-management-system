pipeline {
agent any

environment {
    DOCKER_IMAGE_BACKEND = 'priyankamanickam/complaint-backend'
}

stages {

    // 🔥 Fix: Always start fresh
    stage('Clean Workspace') {
        steps {
            deleteDir()
        }
    }

    // 🔥 Pull latest code
    stage('Checkout') {
        steps {
            checkout scm
        }
    }

    // 🔥 Start Docker services
    stage('Start Test Environment') {
        steps {
            dir('STUDENT') {
                script {
                    bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" rm -f complaint-mongo complaint-backend || exit 0'
                    bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down --volumes --remove-orphans || exit 0'
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

    // 🔍 Debug (can remove later)
    stage('DEBUG - Check files') {
        steps {
            dir('STUDENT/tests') {
                bat 'echo CURRENT DIR:'
                bat 'cd'
                bat 'echo FILES:'
                bat 'dir'
            }
        }
    }

    // 📦 Install dependencies
    stage('Install Test Dependencies') {
        steps {
            dir('STUDENT/tests') {
                bat "npm install"
            }
        }
    }

    // 🧪 Run tests
    stage('Run Integration Tests') {
        steps {
            dir('STUDENT/tests') {
                bat "npm test"
            }
        }
    }

    // 🐳 Build & push backend image
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

// 🧹 Cleanup
post {
    always {
        dir('STUDENT') {
            bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down --volumes --remove-orphans || exit 0'
        }
    }
}

}