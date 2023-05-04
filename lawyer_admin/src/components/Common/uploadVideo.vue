<template>
  <div>
    <div class="upLoadDiv" @click="triggers" :style="div_style">
      <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" :style="icon_style" />
      <span>{{ text }}</span>
      <input type="file" ref="imagesBtn" @change="uploadVideo" multiple="multiple" style="display: none" />
    </div>
  </div>
</template>
  <script>
import { getUserConfigOss } from '@/api/common'
export default {
  name: 'UploadVideo',
  components: {},
  props: {
    text: {
      type: String,
      default: '上传文件',
    },
    iconHeight: {
      type: String,
      default: '26px',
    },
    iconWidth: {
      type: String,
      default: '26px',
    },
    height: {
      type: String,
      default: '100px',
    },
    width: {
      type: String,
      default: '100px',
    },
    folder: {
      // 上传到oss的文件夹
      type: String,
      default: 'fundraise',
    },
  },
  data() {
    return {}
  },
  computed: {
    div_style() {
      return 'height:' + this.height + ';' + 'width:' + this.width
    },
    icon_style() {
      return 'height:' + this.iconHeight + ';' + 'width:' + this.iconWidth
    },
  },
  watch: {
    folder(value) {
      this.folder = value
    },
  },
  created() {
    this.uploadVideo()
  },
  mounted() {},
  methods: {
    triggers() {
      this.$refs.imagesBtn.dispatchEvent(new MouseEvent('click'))
    },
    uploadVideo(event) {
      const that = this
      if (event) {
        var file = event.target.files[0]
        getUserConfigOss(file).then((data) => {
          that.$emit('beginUpload', true)
          const OSS = require('ali-oss')
          const client = new OSS({
            region: data.data.region,
            accessKeyId: data.data.accessKeyId,
            accessKeySecret: data.data.accessKeySecret,
            stsToken: data.data.stsToken,
            bucket: data.data.bucket,
          })
          var d = new Date()
          const WantYear = d.getFullYear()
          const youWantMonet = d.getMonth()
          const youWantDate = d.getDate()
          const WantMonet = youWantMonet < 10 ? '0' + String(youWantMonet + 1) : youWantMonet + 1
          const WantDate = youWantDate < 10 ? '0' + String(youWantDate) : youWantDate
          const youWant = WantYear + '-' + WantMonet + '-' + WantDate
          // var youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          const object = that.folder + '/' + youWant + '/' + file.lastModified + file.name
          // object  参数为文件名 格式：上传文件夹名称/日期/时间/时间戳+文件名， 例：advertisement/2021-01-01/1627522859123Test.jpg
          // file表示上传的文件，支持HTML5 file和Blob类型。
          client
            .put(object, file)
            .then(function (data) {
              console.log(data)
              that.$emit('uploadVideo', data.url)
              that.$emit('beginUpload', false)
            })
            .then(function (r2) {})
            .catch(function (err) {
              console.error('error: %j', err)
            })
        })
      }
    },
  },
}
</script>
 <style scoped>
.upLoadDiv {
  border: 2px dashed #0000004c;
  border-radius: 8px;
  color: #787e8d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
