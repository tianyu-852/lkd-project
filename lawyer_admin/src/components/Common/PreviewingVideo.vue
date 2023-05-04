<template>
  <div>
    <div :style="'height:' + areaHeight + ';width:' + areaWidth">
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        @pause="pausePlay($event)"
        :options="playerOptions"
      />
    </div>
  </div>
</template>
  <script>
export default {
  name: 'PreviewingVideoIndex',
  components: {},
  props: {
    showUrl: {
      type: String,
      default: '',
    },
    areaHeight: {
      type: String,
      default: '',
    },
    areaWidth: {
      type: String,
      default: '',
    },
    videoType: {
      type: String,
      default: 'video/mp4',
    },
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        autoplay: false,
        muted: false,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [
          {
            type: 'video/mp4',
            src: '',
          },
        ],
        poster: '',
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,
        },
      },
    }
  },
  computed: {},
  watch: {
    showUrl(value) {
      this.playerOptions.sources[0].src = value
    },
    videoType(value) {
      this.playerOptions.sources[0].type = value
    },
  },
  created() {},
  mounted() {},
  methods: {
    pausePlay(player) {
      player.pause()
    },
    // handleEdit(index, row) {
    //   this.editFormVisible = true
    //   this.editForm = Object.assign({}, row)
    //   if (this.$refs.videoPlayer === undefined) {
    //     this.playerOptions.sources[0] = {
    //       type: 'video/mp4',
    //       src: row.video,
    //     }
    //   } else {
    //     const palyer = this.$refs.videoPlayer.player
    //     palyer.src(row.video)
    //   }
    // },
  },
}
</script>
 <style scoped lang="less">
// .video-js .vjs-big-play-button {
//   // 设置播放按钮的形状与位置
// }
</style>
