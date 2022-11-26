pipeline{
    // 任务使用节点配置
    agent any


    // 环境变量
    environment {
        // 产品名称(全小写)
        WAREHOUSE_NAME = "doia"


        // 服务名称(小驼峰式)
        SERVICE_NAME = "doiaWeb"


        // tar包生成的目录
        PROJECT_DIR = "publish"


        // 开发环境信息
        sit_branch = "develop"
        sit_env_ip = "10.0.9.17"
        sit_env_user = "root"
        sit_env_port = "36000"
        sit_env_passwd = "ovirtadmin123"


        // UAT环境IP
        uat_ip = "10.0.9.17"


        // 代码语言（sonar代码规范检查）
        code_language="js"


        // 归档文件名
        artifacts_file_path="${PROJECT_DIR}/${SERVICE_NAME}-*.tar.gz"


        // git 仓库地址
        git_url="https://git.cloudwise.com/DOIA/doia-web-2.0.git"


        // sonar 登陆token
        sonar_token="adecebc77b4a9a7072638a4d3a913a358840b51b"


        // jenkins 默认只读账户
        git_credentials_id="44e015f2-ee2d-4b10-ab06-d11819d47034"
    }


    // 加载编译环境
    tools {
        jdk 'jdk1.8.202'
        maven 'maven3.3.9'
        nodejs 'nodejs14.17.5'
    }


    // 手动部署时所需参数
    parameters {
        string defaultValue: 'develop', description: '输入你要构建的分支：', name: 'branch', trim: true
        string defaultValue: '10.0.9.17', description: '输入你要部署的环境IP：', name: 'env_ip', trim: true
        string defaultValue: '36000', description: '输入你要部署的环境端口：', name: 'env_port', trim: true
        string defaultValue: 'root', description: '输入你要部署的环境用户名：', name: 'env_user', trim: true
        string defaultValue: 'ovirtadmin123', description: '输入你要部署的环境密码：', name: 'env_passwd', trim: true
    }


    // 配置流水线本身属性
    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder logRotator(artifactDaysToKeepStr: '5', artifactNumToKeepStr: '5', daysToKeepStr: '5', numToKeepStr: '5')
    }


    // merge or push 自动触发获取构建信息
    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'trigger_kind', value: '$.object_kind'],
                [key: 'project_name', value: '$.project.name'],
                [key: 'git_http_url', value: '$.project.git_http_url'],
                [key: 'push_username', value: '$.user_name'],
                [key: 'push_branch', value: '$.ref'],
                [key: 'merge_username', value: '$.user.username'],
                [key: 'merge_state', value: '$.object_attributes.state'],
                [key: 'merge_source_branch', value: '$.object_attributes.source_branch'],
                [key: 'merge_target_branch', value: '$.object_attributes.target_branch']
            ],
            genericHeaderVariables: [
                [key: 'X-Gitlab-Event']
            ],
            causeString: 'Automatically triggered by ${trigger_kind}',
            token: 'doia-doiaWeb-devops',
            tokenCredentialId: '',
            printContributedVariables: false,
            printPostContent: true,
            silentResponse: false,
            regexpFilterExpression: '(master|dev)$', regexpFilterText: '$push_branch'
        )
    }



    stages {


        // 拉取指定分支代码
        stage("git checkout") {
            failFast true
            parallel {


                // 自动拉取 merge 的目标分支代码
                stage ("git checkout by automatically") {
                    when {
                        allOf {
                            triggeredBy "GenericCause"
                        }
                    }
                    steps {
                        // 删除工作空间
                        deleteDir()

                        script {
                            sh '''
                                echo "========Automatically triggered by ${push_username:-${merge_username}} ${project_name}@${push_branch:-${merge_source_branch}} to ${push_branch:-${merge_target_branch}}========"
                               '''
                            if ( "${x_gitlab_event}" == "Push Hook" ) {
                                env["merge_target_branch"] = "default"
                                env["merge_state"] = "default"
                            }else {
                                env["push_branch"] = "default"
                            }
                            if ( "${merge_target_branch}" == "${sit_branch}" ) {
                                env["branch"] = "${merge_target_branch}"
                                env["env_ip"] = "${sit_env_ip}"
                                env["env_port"] = "${sit_env_port}"
                                env["env_user"] = "${sit_env_user}"
                                env["env_passwd"] = "${sit_env_passwd}"
                            }else if ( "${push_branch}" == "refs/heads/${sit_branch}" ){
                                env["branch"] = "${push_branch}" - 'refs/heads/'
                                env["env_ip"] = "${sit_env_ip}"
                                env["env_port"] = "${sit_env_port}"
                                env["env_user"] = "${sit_env_user}"
                                env["env_passwd"] = "${sit_env_passwd}"
                            }else {
                                echo "This branch is not allowed to be built automatically"
                                sh "exit 1"
                            }
                            if ( "${merge_state}" == "merged" || "${x_gitlab_event}" == 'Push Hook' ) {
                                env["git_url"] = "${git_http_url}"
                                println "====== 正在拉取${git_url} ${branch}代码..."
                                checkout([$class: 'GitSCM', branches: [[name: "${branch}"]], extensions: [[$class: 'CloneOption', noTags: false, reference: '', shallow: false, timeout: 20]], userRemoteConfigs: [[credentialsId: "${git_credentials_id}", url: "${git_url}"]]])
                            }else {
                                echo "This state ${merge_state} does not require a pull code"
                            }
                        }
                    }
                }


                // 手动拉取分支代码&&上游pipeline触发
                stage ("git checkout by manually") {
                    when {
                        anyOf {
                            triggeredBy cause: "UserIdCause"
                            triggeredBy cause: "BuildUpstreamCause"
                        }
                    }
                    steps {
                        // 删除工作空间
                        deleteDir()

                        script {
                            println "====== 正在拉取${git_url} ${branch}代码..."
                            checkout([$class: 'GitSCM', branches: [[name: "${branch}"]], extensions: [[$class: 'CloneOption', noTags: false, reference: '', shallow: false, timeout: 20]], userRemoteConfigs: [[credentialsId: "${git_credentials_id}", url: "${git_url}"]]])
                        }
                    }
                }
            }
        }


        // 执行 sonar 静态扫描
        stage('SonarQube analysis'){
            when {
                anyOf {
                    triggeredBy cause: "UserIdCause"
                    triggeredBy cause: "BuildUpstreamCause"
                    expression { "${merge_state}" == 'merged' }
                    expression { "${x_gitlab_event}" == 'Push Hook' }
                }
            }
            steps {
                script{
                    try {
                        retry(2) {
                            sonarQubeAnalysis()
                        }
                    } catch (e) {
                        echo 'Something failed, I should sound the build task!'+ e.getMessage()
                        throw e
                    }
                }
            }
            post {
                failure {
                    echo "sonar branch: ${branch} analysis failure!"
                    sh "exit 1"
                }
            }
        }

        // 执行代码编译
        stage("build code") {
            when {
                anyOf {
                    triggeredBy cause: "UserIdCause"
                    triggeredBy cause: "BuildUpstreamCause"
                    expression { "${merge_state}" == 'merged' }
                    expression { "${x_gitlab_event}" == 'Push Hook' }
                }
            }
            steps {
                script{
                    try {
                        buildCode()
                    } catch (e) {
                        echo 'Something failed, I should sound the build task!'+ e.getMessage()
                        throw e
                    }
                }
            }
            post {
                failure {
                    echo "build branch: ${branch} code failure!"
                    sh "exit 1"
                }
            }
        }


        // 上传制品库&构建镜像&自动部署
        stage("upload and build images and deploy") {
            failFast true
            parallel {


                // 上传制品到制品库
                stage("upload tar to jfrog") {
                    when {
                        allOf {
                            expression { "${env_ip}" == "${uat_ip}" }
                        }
                    }
                    steps {
                        script{
                            try {
                                getConfigInfo()
                                uploadArtifactory()
                            } catch (e) {
                                echo 'Something failed, I should sound the build task!'+ e.getMessage()
                                throw e
                            }
                        }
                    }
                    post {
                        failure {
                            echo "upload tar to jfrog: failure!"
                            sh "exit 1"
                        }
                    }
                }


                // 执行 docker 镜像构建
                stage("build docker images") {
                    when {
                        allOf {
                            expression { "${env_ip}" == "${uat_ip}" }
                        }
                    }
                    steps {
                        script{
                            try {
                                getConfigInfo()
                                dockerImageBuild()
                            } catch (e) {
                                echo 'Something failed, I should sound the build task!'+ e.getMessage()
                                throw e
                            }
                        }
                    }
                    post {
                        failure {
                            echo "build docker images: failure!"
                            sh "exit 1"
                        }
                        success {
                            echo "delete local image now!"
                            sh "docker rmi ${DOCKER_IMAGE}"
                        }
                    }
                }


                // 执行自动部署到指定环境
                stage('deploy project to sever and auto test') {
                    stages {
                        stage("deploy project to server") {
                            when {
                                anyOf {
                                    triggeredBy cause: "UserIdCause"
                                    triggeredBy cause: "BuildUpstreamCause"
                                    expression { "${merge_state}" == 'merged' }
                                    expression { "${x_gitlab_event}" == 'Push Hook' }
                                }
                            }
                            steps {
                                deployProject()
                            }
                            post {
                                failure {
                                    getConfigInfo()
                                    rockBack()
                                    echo "deploy project to remote sever ${env_ip} failure!"
                                }
                            }
                        }
                    }
                }


                // 执行归档操作
                stage('archive') {
                    when {
                        anyOf {
                            triggeredBy cause: "UserIdCause"
                            triggeredBy cause: 'BuildUpstreamCause'
                            expression { "${merge_state}" == 'merged' }
                            expression { "${x_gitlab_event}" == 'Push Hook' }
                        }
                    }
                    steps {
                        archiveArtifacts artifacts: "**/${artifacts_file_path}", followSymlinks: false
                    }
                    post {
                        failure {
                            echo "The ${artifacts_file_path} archive failure!"
                        }
                    }
                }
            }
        }
    }
}



// 执行构建指令
def buildCode() {
    sh """
        npm install
        npm run build
        npm run cicd
        """
    echo "build branch: ${branch} code success!"
}



// 获取服务包信息
def getConfigInfo() {
    // 获取服务包路径
    env["SERVER_PATH"] = sh(script: 'ls ${artifacts_file_path}', returnStdout: true).trim()


    // 获取服务包名称
    env["SERVER_TARNAME"] = sh(script: 'basename $(ls ${artifacts_file_path})', returnStdout: true).trim()


    // 获取服务包版本号
    env["SERVER_VERSION"] = sh(script: 'echo `basename $(ls ${artifacts_file_path})`|cut -d- -f2', returnStdout: true).trim()


    // 获取服务包 commitID
    env["COMMITID"] = sh(script: 'echo `basename $(ls ${artifacts_file_path})`|cut -d- -f4|cut -d. -f1', returnStdout: true).trim()


    // 获取全小写的服务名称，构建镜像时使用
    env["SERVER_NAME"] = sh(script: 'echo ${SERVICE_NAME}|tr "A-Z" "a-z"', returnStdout: true).trim()
}



// sonar 代码检查
def sonarQubeAnalysis() {


    sonarqubeScannerHome = tool name: 'sonarqube'
    withSonarQubeEnv('sonarqube') {
        sh "${sonarqubeScannerHome}/bin/sonar-scanner -X " +
        "-Dsonar.host.url=${SONAR_HOST_URL} " +
        "-Dsonar.login=${sonar_token} " +
        "-Dsonar.language=${code_language} " +
        "-Dsonar.projectKey=${SERVICE_NAME} " +
        "-Dsonar.projectName=${SERVICE_NAME} " +
        "-Dsonar.projectBaseDir=. " +
        "-Dsonar.projectVersion=${BUILD_NUMBER} " +
        "-Dsonar.sources=. " +
        "-Dsonar.sourceEncoding=UTF-8 " +
        "-Dsonar.dynamicAnalysis=reuseReports "
    }
}



// 上传至制品库
def uploadArtifactory() {
    def server = Artifactory.server 'Artifactory-repo'
    def uploadSpec = """{
        "files": [{
            "pattern": "${SERVER_PATH}",
            "target": "Products-Repo/${WAREHOUSE_NAME}/${SERVICE_NAME}/${SERVER_TARNAME}"
        }]
    }"""
    server.upload(uploadSpec)
}



// 构建 docker 镜像
def dockerImageBuild() {
    try {
        DOCKER_IMAGE = "${WAREHOUSE_ADDRESS}/${WAREHOUSE_NAME}/${SERVER_NAME}:${SERVER_VERSION}-${COMMITID}"
        echo "docker build docker image: ${DOCKER_IMAGE}"
        sh "tar -zxf ${SERVER_PATH} -C ."
        sh "docker build -f Dockerfile -t ${DOCKER_IMAGE} ."
        sh "rm -rf ${SERVICE_NAME}"


        echo "docker login harbor image warehouse"
        sh "docker login ${WAREHOUSE_ADDRESS} -u ${CREDS_HARBOR_REGISTRY_USR} -p ${CREDS_HARBOR_REGISTRY_PSW}"


        echo "push image to harbor"
        sh "docker push ${DOCKER_IMAGE}"


        echo "build docker images success!"
    } catch (e) {
        println 'Something failed, I should sound the build docker images task!'+ e.getMessage()
        throw e
    }
}


// 获取部署服务器信息
def getRemoteServer(server_ip, server_port, server_login_user, server_login_passwd) {
    def remote = [:]
    remote.name = server_ip
    remote.host = server_ip
    remote.port = server_port.toInteger()
    remote.user = server_login_user
    remote.password = server_login_passwd
    remote.allowAnyHosts = true


    return remote
}


// 部署服务至相应环境
def deployProject() {
    echo "start deploy project in server..."
    rserver = getRemoteServer(env_ip, env_port, env_user, env_passwd)
    // 上传文件
    sshPut remote: rserver, from: sh(script: 'ls $artifacts_file_path', returnStdout: true).trim(), into: '/data/omp/packages/upgrade_packages'
    sshCommand remote: rserver, command:
    """
        # ------------------  执行服务升级  ------------------
        bash /data/omp/scripts/deploy upgrade ${SERVICE_NAME}
    """
    echo "deploy project in ${env_ip} success!"
}


// 升级失败回滚
def rockBack() {
    echo "deploy failure, roll back now..."
    rserver = getRemoteServer(env_ip, env_port, env_user, env_passwd)
    sshCommand remote: rserver, command:
    """
        # ------------------  执行回滚 ------------------
        bash /data/omp/scripts/deploy roll_back ${SERVICE_NAME}
        rm -rf /data/omp/packages/upgrade_packages/${SERVER_TARNAME}
    """
}