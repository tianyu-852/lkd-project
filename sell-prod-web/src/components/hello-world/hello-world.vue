<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="box">
      盒子
    </div>

    <el-radio v-model="radio" label="1">备选项</el-radio>
    <el-radio v-model="radio" label="2">备选项</el-radio>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      radio: 1
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
