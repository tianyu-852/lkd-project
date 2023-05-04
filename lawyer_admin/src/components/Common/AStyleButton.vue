<template>
  <div class="a-style-button clickable" @click="() => $emit('click')">
    {{ text }}

    <img
      v-if="icon"
      :src="arrow"
      class="a-style-button-icon"
    />
  </div>
</template>

<script>
import arrow from '@/assets/common/sm_arrow.png'

export default {
  name: "AStyleButton",
  props: {
    text: {
      default: '',
      type: String
    },
    icon: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      arrow
    }
  }
}
</script>

<style scoped lang="less">
.a-style-button {
  font-size: 14px;
  font-family: PingFang SC, serif;
  font-weight: bold;
  color: #3980EA;

  &-icon {
    width: 6px;
    height: 11px;
  }
}

</style>