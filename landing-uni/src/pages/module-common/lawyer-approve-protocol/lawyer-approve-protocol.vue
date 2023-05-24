<template>
	<view>
		<web-view :src="htmlSrc" />
	</view>
</template>

<script>
export default {
  name: 'LawyerApproveProtocol',
  data() {
    return {
      htmlSrc: 'https://oss.lawkd.com/document/web/lawyer-approve-protocol.html'
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
