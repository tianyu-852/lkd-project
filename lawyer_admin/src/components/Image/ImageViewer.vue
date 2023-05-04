<template>
  <viewer :images="images" @inited="inited">
    <img v-for="(src, index) in images" :src="src" :key="src + index" v-show="isShowImage" />
  </viewer>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'

Vue.use(Viewer)

export default {
  comments: [Viewer],
  name: 'ImageViewer',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    isShowImage: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    deep: true,
    images(value) {
      this.images = value
    },
  },
  data() {
    return {
      viewer: null,
    }
  },
  methods: {
    inited(viewer) {
      this.viewer = viewer
    },
    show() {
      console.log(this.viewer)
      this.viewer.show()
    },
  },
}
</script>

<style scoped>
</style>
