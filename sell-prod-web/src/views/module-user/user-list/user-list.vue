<template>
  <div class="userlist-module">
    <el-button type="primary">{{ msg }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      msg: '用户列表'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
