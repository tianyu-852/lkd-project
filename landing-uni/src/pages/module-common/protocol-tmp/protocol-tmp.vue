<template>
  <view style="padding: 30rpx;">
    <view class="protocol-html" v-html="protocolHtml"></view>
  </view>
</template>

<script>
import { getProtocolTmpApi } from "@/apis/apis.js"

export default {
  name: 'protocolTmp',
  data() {
    return {
      protocolFlag: '',
      protocolHtml: ''
    }
  },
  onLoad(query) {
    this.protocolFlag = query.name
    this._getProtocolTmpDetail()
  },
  methods: {
    /**
     * 获取模板信息
     */
    async  _getProtocolTmpDetail() {
      const param = { name: this.protocolFlag }
      try {
        const { data: protocolData } = await getProtocolTmpApi(param)
        uni.setNavigationBarTitle({ title: protocolData.data.title })
        this.protocolHtml = protocolData.data.content
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style scoped>
.protocol-html >>> p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>
