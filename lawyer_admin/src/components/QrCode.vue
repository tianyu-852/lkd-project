<template>
  <div>
    <VueQr
      :text="text"
      :size="350"
      logoSrc="http://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png"
    />
  </div>
</template>

<script>

import VueQr from 'vue-qr'

export default {
  components: {VueQr},
  name: "QrCode",
  props: {
    text: {
      type: String,
      default: ''
    }
  },
}
</script>

<style scoped>

</style>