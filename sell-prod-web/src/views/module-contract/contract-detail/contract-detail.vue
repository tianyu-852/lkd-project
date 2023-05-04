<template>
  <div class="contract-detail-main">
    <el-button type="primary">{{ msg }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'ContractDetail',
  data() {
    return {
      msg: '合同详情'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
