const path = require('path');
const resolve = dir => path.join(__dirname, dir); // 拼接路径

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'));
    // .set('@components', resolve('src/components'))
    // .set('@static', resolve('src/static'));
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      // https://vueschool.io/articles/vuejs-tutorials/globally-load-sass-into-your-vue-js-applications/
      sass: {
        // @/ 是 src/ 的别名
        data: `
          @import "@/common/style/common.scss";
        `
      }
    }
  }
};
