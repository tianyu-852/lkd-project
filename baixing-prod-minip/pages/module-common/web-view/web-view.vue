<template>
  <web-view v-if="webUrl" :src="webUrl" />
</template>

<script>
export default {
  name: 'WebView',
  data() {
    return {
      webUrl: ''
      // webUrl: 'https://h5.lawkd.com/protocol-tmp?name=enterprise_vip_agreement_url'
    };
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    
    if (routeParam.webUrl) {
      this.webUrl = routeParam.webUrl
    } else {
      const eventChannel = this.getOpenerEventChannel();
      Object.keys(eventChannel).length && eventChannel.on('webViewEvt', data => {
        console.log('接收数据：', data)
        
        const { webUrl, navTitle } = data;
        this.webUrl = webUrl;
        navTitle && uni.setNavigationBarTitle({ title: navTitle });
      });
    }
  },
};
</script>

<style>
</style>
