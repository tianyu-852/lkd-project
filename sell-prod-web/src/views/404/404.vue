<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <!-- 左侧 -->
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/image/404/404.png" alt="404">
        <img class="pic-404__child left" src="@/assets/image/404/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="@/assets/image/404/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="@/assets/image/404/404_cloud.png" alt="404">
      </div>
      <!-- 右侧 -->
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__headline">{{ msg }}</div>
        <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</div>
        <a href="/" class="bullshit__return-home">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '404',
  data() {
    return {
      msg: '网管说这个页面你不能进......'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
