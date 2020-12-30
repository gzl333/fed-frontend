# GOSC-FrontEnd

## 简介
GOSC前端，基于Vue.js 3.0 + TypeScript

## Windows开发环境搭建
### 1. 安装nvm包，搭建多版本的nodejs环境
1. 卸载之前安装的nodejs，并保证以下目录已经删除：
```
C:\Program Files\nodejs
C:\Users\<user>\AppData\Roaming\npm
```
2. 下载以下文件并安装:
```
https://github.com/coreybutler/nvm-windows/releases/download/1.1.7/nvm-setup.zip
```
3. 进入PowerShell命令行，并执行以下命令：
```
nvm install 14.15.3    //安装14.15.3版本的nodejs，也可根据个人需求额外安装其它版本
nvm list               //查看已经安装的nodejs版本
nvm on                 //启动nvm
nvm use xx.xx.x        //切换nodejs版本，本项目使用14.15.3版本
node                   //启动nodejs，可看到正在使用的版本
```
至此nodejs环境已经安装完毕

### 2. 配置PowerShell安全策略，方便npm命令执行
以管理员模式运行PowerShell，并执行以下命令：
```
set-ExecutionPolicy RemoteSigned      //选择：[A] 全是(A)
```
### 3. 安装nrm源管理包
进入PowerShell并执行以下命令：
```
npm install -g nrm        //全局安装nrm包
npm ls                    //查看可选源地址
npm test                  //测试所有源的网速
npm use taobao            //使用taobao源，通常是国内最快的
npm config get registry   //查看当前所使用的源地址
```

## 项目安装
### 1. 克隆项目到本地,并安装
进入PowerShell命令行，进入想保存本项目的目录位置，并执行以下命令：
```
git clone https://gitee.com/gosc-cnic/frontend.git
cd frontend
npm install
```

### 2. 开发模式运行：会对项目进行编译及热更新
```
npm run serve
```

### 3. 生产模式打包：会对项目进行编译及压缩
```
npm run build
```

### 4. 代码自动审查修复
```
npm run lint
```

## VSCode开发工具搭建
### 1. 下载并安装VisualStudio Code软件

### 2. 安装ESLint插件
这里使用其代码审查、格式化功能。
安装后会请求调用本地项目中ESLint模块的权限，可允许全局权限或者局部权限。
必须在其设置中开启Format功能。

### 3. 安装Vetur插件
这里使用其vue3代码高亮及提示功能。
必须在Vetur的设置中关闭Format功能，否则与ESLint冲突。

### 4. 开启VSCode保存时自动格式化代码功能
强烈推荐在VSCode设置中，开启Format on Save功能。
开启后，每次代码保存均会调用ESLint进行代码格式化，十分方便。
