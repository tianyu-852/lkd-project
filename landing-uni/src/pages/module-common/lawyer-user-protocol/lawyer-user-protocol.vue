<template>
	<view>
    <web-view :src="htmlSrc" />
	</view>
</template>

<script>
export default {
  name: 'LawyerUserProtocol',
  data() {
    return {
      htmlSrc: 'https://oss.lawkd.com/document/web/lawyer-user-protocol.html'
    }
  },
  onLoad() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
