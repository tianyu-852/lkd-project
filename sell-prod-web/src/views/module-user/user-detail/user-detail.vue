<template>
  <div class="user-detail-main">
    <el-button type="primary">{{ msg }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'UserDetail',
  data() {
    return {
      msg: '用户详情'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
