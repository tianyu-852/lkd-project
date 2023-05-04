# 销售端产品 minip

- 上架平台：微信小程序
- 开发工具：VSCode（推荐）

### 技术栈

（主）uniapp@2 + vuex + uni-simple-router + uview-ui@1.8 + scss + luch-request + day.js

（次）eslint + editorconfig

### 项目结构生成脚手架

- npm install -g @vue/cli

- vue create -p dcloudio/uni-preset-vue sell-prod-minip

### 运行开发版微信小程序

- npm install 安装项目相关依赖

- npm start 编译运行开发版微信小程序

- 微信开发者工具导入目录 dist/dev/mp-weixin

### 构建生产版微信小程序

- npm install 安装项目相关依赖

- npm build 编译运行生产版微信小程序

- 微信开发者工具导入目录 dist/build/mp-weixin

- 上传代码发布

## 前端长整数精度丢失问题

> 问题原因：

在 JS 中，由于 Number 类型的值也包含了小数，最大值为：9007199254740993（2^53 - 1）长度约 16 位。因此当后端返回超过 16 位的 Long 型字段转为 json 时，前端 JS 得到的数据将由于溢出而导致精度丢失。

> 问题解决：

**注：项目所使用 luch-request@3.0.7 版本目前还不支持解决精度丢失问题**

文章参考：

[记一次前端长整数精度丢失问题](https://blog.51cto.com/u_15067249/2908604)

[前端：接收后端数据出现精度丢失-多种解决方式](https://blog.51cto.com/u_15585699/5192081)

解决步骤：

- 首先下载 luch-request 源码到 src/lib/luch-request

- 安装 json-bigint（npm install json-bigint --save）

- 修改 src/lib/luch-request/adapters/index.js

```js
// 引入第三方库
const JSONbig = require('json-bigint');

try {
  // 对可能字符串不是json 的情况容错
  if (typeof response.data === 'string') {
    // response.data = JSON.parse(response.data)
    response.data = JSONbig.parse(response.data) // 使用 json-bigint做解析，防止精度丢失
  }
  // eslint-disable-next-line no-empty
} catch (e) {
}
```

- 修改 src/common/api/httpRequest.js

```js
import Request from '@/common/lib/luch-request';

/**
 * 全局配置修改 setConfig
 */
http.setConfig(config => {
  config.header = {
    ...config.header
  };

  // 添加这行代码
  config.dataType = 'string';

  return config;
});
```


