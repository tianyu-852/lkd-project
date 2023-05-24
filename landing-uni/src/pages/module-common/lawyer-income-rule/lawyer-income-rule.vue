<template>
	<view>
		<web-view :src="htmlSrc" />
	</view>
</template>

<script>
export default {
  name: 'LawyerIncomeRule',
  data() {
    return {
      htmlSrc: 'https://oss.lawkd.com/document/web/rights_agreement.html'
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
