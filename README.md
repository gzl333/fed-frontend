# frontend

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
### 克隆项目到本地,并安装
进入PowerShell命令行，进入想保存本项目的目录位置，并执行以下命令：
```
git clone https://gitee.com/gosc-cnic/frontend.git
cd frontend
npm install
```

### 开发模式运行：会对项目进行编译及热更新
```
npm run serve
```

### 生产模式打包：会对项目进行编译及压缩
```
npm run build
```

### 代码自动审查修复
```
npm run lint
```
