<template>
  <div>
    <audio controls ref="audio" :src="src">
      Your browser does not support the
      <code>audio</code> element.
    </audio>
  </div>
</template>

<script>
export default {
  name: 'SingleAudioPlayer',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  watch: {
    src(src) {
      this.$refs.audio.load()
      console.log(src, this.$refs.audio)
    },
  },
}
</script>

<style scoped>
</style>
