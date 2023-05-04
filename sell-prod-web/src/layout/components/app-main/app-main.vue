<template>
  <div class="app-module">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
