<template>
	<view>
		<web-view :src="htmlSrc" />
	</view>
</template>

<script>
export default {
  name: 'LawyerPrivacyProtocol',
  data() {
    return {
      htmlSrc: 'https://oss.lawkd.com/document/lvshiduan.html'
    }
  },
  onLoad() {
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
</style>
