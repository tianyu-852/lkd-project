<template>
  <web-view v-if="webUrl" :src="webUrl" />
</template>

<script>
export default {
  name: 'WebView',
  data() {
    return {
      webUrl: ''
    };
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    Object.keys(eventChannel).length && eventChannel.on('webViewEvt', data => {
      const { webUrl, navTitle } = data;
      this.webUrl = webUrl;
      navTitle && uni.setNavigationBarTitle({ title: navTitle });
    });
  },
};
</script>

<style>
</style>
