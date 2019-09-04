# QuLaXin

## 安装依赖模块，首先项目必须有这一步
```
npm install
```

### 开启开发环境
```
npm run serve
```

### 运行打包，等待运行完成会在目录生成一个dist的文件
```
npm run build
```

### 接口域名的配置在根目录的api.js里面，同时需要配置一下vue.config.js
```
api.js的配置
baseURL: 'http://mp.guanggaodaren.com/'

vue.config.js的配置
target: 'http://mp.guanggaodaren.com/api/v1/',
```
### 项目部署
```
将dist目录里的文件全部放置在域名访问的根目录即可
```
