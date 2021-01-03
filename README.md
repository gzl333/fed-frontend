# GOSC-FrontEnd

## 简介
GOSC前端，基于Vue.js 3.0 + TypeScript

## Windows开发环境搭建
### 1. 安装nvm包，搭建多版本的nodejs环境
1. 卸载之前安装的nodejs，并保证以下目录已经删除：
```
C:\Program Files\nodejs
C:\Users\<username>\AppData\Roaming\npm
```
2. 下载以下文件并安装:
```
https://github.com/coreybutler/nvm-windows/releases/download/1.1.7/nvm-setup.zip
```
3. 进入PowerShell命令行，并执行以下命令：
```
nvm node_mirror https://npm.taobao.org/mirrors/node/    
                         //使用taobao的nodejs源，在国内网速较快
nvm install 14.15.3      //安装14.15.3版本的nodejs，也可根据个人需求额外安装其它版本
nvm list                 //查看已经安装的nodejs版本
nvm on                   //启动nvm
nvm use xx.xx.x          //切换nodejs版本，本项目使用14.15.3版本
node -v                  //查看正在使用nodejs的版本
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
nrm ls                    //查看可选源地址
nrm test                  //测试所有源的网速
nrm use taobao            //使用taobao源，通常是国内最快的
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
### 1. 卸载之前安装的VSCode软件，并保证以下目录已经删除：
```
C:\Users\<username>\.vscode
C:\Users\<username>\AppData\Roaming\Code
C:\Users\<username>\AppData\Local\Programs\Microsoft VS Code
```
### 2. 下载并安装VSCode软件
安装过程中，在**选择附加任务**一页，将全部任务勾选，方便开发中使用。    
如下所示：
```
 附加任务:
      附加快捷方式:
         创建桌面快捷方式(D)
      其他:
         将“通过 Code 打开”操作添加到 Windows 资源管理器文件上下文菜单
         将“通过 Code 打开”操作添加到 Windows 资源管理器目录上下文菜单
         将 Code 注册为受支持的文件类型的编辑器
         添加到 PATH (重启后生效)
```

### 3. 在VSCode中安装ESLint插件，版本在v2.1以上
这里使用其代码审查、代码格式化功能。  
ESlint安装后，会请求调用本地项目中ESLint模块的权限，点击Allow Everywhere。  
进入ESLint插件设置页面：
    1）在ESlint>Format一项中，勾选Format功能：Enables ESlint as a formatter.

### 4. 在VSCode中安装Vetur插件，版本在v0.31以上
这里使用其Vue3代码高亮及提示功能。  
进入Vetur插件设置页面：  
    1）在**Vetur>Format**一项中，**取消勾选 Enable/disable the Vetur document formatter.** 否则Format功能会与ESLint冲突。  
    2）在**Vetur>Experimental:Template Interpolation Service**一项中，**勾选 Enable template interpolation service that offers hover/definition/references in Vue interpolations.**开启后，Vetur可对template部分中的TS代码进行高亮提示。

### 5. 开启VSCode保存时自动格式化代码功能
开启Format on Save功能后，每次保存文件均会调用ESLint自动格式化代码，十分方便。  
进入VSCode设置页面：
    1）在**User>Text Editor>Formatting**页面中，**勾选Format on Save**功能。  

### 6. 检查VSCode的设置文件  
打开VSCode的设置文件：
```
C:\Users\<username>\AppData\Roaming\Code\User\settings.json
```
其内容应如下所示,则表示配置成功：
```
{
    "eslint.format.enable": true,
    "vetur.format.enable": false,
    "vetur.experimental.templateInterpolationService": true,
    "editor.formatOnSave": true
}
```
如果配置多于如上所示，则表示有其它插件的配置信息写入，请自行确保不与上述配置冲突。

## DEBUG
### 1. git pull最新代码后，执行npm run serve显示缺少module或其它问题，导致无法运行
可能原因：项目仍在初期阶段，package.json中的配置随时可能修改，导致新配置的包需要手动安装。  
解决方案：在项目根目录下，执行：npm install   
