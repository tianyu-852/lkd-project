<template>
  <q-card class="dialog">
    <div class="dialog-top">
      <template v-if="mode === 'title'">
        <div class="dialog-top-item"></div>
        <span class="dialog-top-item" style="text-align: center">{{ title }}</span>
        <div class="dialog-top-item">
          <img
            class="dialog-top-item-img clickable"
            :src="closeSrc"
            @click="$emit('close')"
            @mousemove="closeSrc = closeHoverIcon"
            @mouseleave="closeSrc = closeIcon"
          />
        </div>
      </template>
      <template v-else>
        <slot name="title" />

        <img
          class="dialog-top-item-img clickable"
          :src="closeSrc"
          @click="$emit('close')"
          @mousemove="closeSrc = closeHoverIcon"
          @mouseleave="closeSrc = closeIcon"
        />
      </template>
    </div>

    <div style="height: 100%">
      <slot />
    </div>
  </q-card>
</template>

<script>
export default {
  name: "CommonDialog",
  props: {
    title: String,
    mode: {
      type: String,
      default: 'title', // title模式 就是带标题的dialog customize自定义头部
    }
  },
  data() {
    return {
      closeIcon: require('@/assets/icons/gb_icon.png'),
      closeHoverIcon: require('@/assets/icons/gb_icon_hov.png'),
      closeSrc: '',
    }
  },
  created() {
    this.closeSrc = this.closeIcon
  }
}
</script>

<style lang="less" scoped>
.dialog {
  min-width: 400px;
  min-height: 300px;

  &-top {
    background: #EBEEF5;
    display: flex;
    min-height: 48px;
    border-radius: 8px 8px 0px 0px;
    font-size: 16px;
    color: #222222;
    align-items: center;

    &-item {
      flex: 1;

      &-img {
        float: right;
        margin-right: 24px;
      }
    }
  }
}
</style>