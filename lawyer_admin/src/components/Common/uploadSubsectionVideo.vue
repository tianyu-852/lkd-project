<template>
  <div>
    <div class="upLoadDiv" @click="triggers" :style="div_style">
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
      default: 'temp',
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
          console.log(data)
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
          var youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          const object = that.folder + '/' + youWant + '/' + file.lastModified + file.name
          let tempCheckpoint

          // 定义上传方法。
          async function multipartUpload() {
            try {
              // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
              // 您可以通过自定义文件名（例如exampleobject.txt）或目录（例如exampledir/exampleobject.txt）的形式，实现将文件上传到当前Bucket或Bucket中的指定目录。
              const result = await client.multipartUpload('exampleobject.txt', file, {
                progress: function (p, checkpoint) {
                  // checkpoint参数用于记录上传进度，断点续传上传时将记录的checkpoint参数传入即可。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
                  tempCheckpoint = checkpoint
                },
                parallel: 4,
                // 设置分片大小。默认值为1 MB，最小值为100 KB。
                partSize: 1024 * 1024,
                meta: { year: 2020, people: 'test' },
                mime: 'text/plain',
              })
            } catch (e) {
              console.log(e)
            }
          }

          // 开始分片上传。
          multipartUpload()

          // // 暂停分片上传。
          // client.cancel();
          // 恢复上传。
          // const resumeclient = new OSS(ossConfig);
          // async function resumeUpload() {
          //   try {
          //     const result = await resumeclient.multipartUpload(
          //       "exampleobject.txt",
          //       file,
          //       {
          //         progress: function (p, checkpoint) {
          //           tempCheckpoint = checkpoint;
          //         },
          //         checkpoint: tempCheckpoint,
          //         meta: { year: 2020, people: "test" },
          //         mime: "text/plain",
          //       }
          //     );
          //   } catch (e) {
          //     console.log(e);
          //   }
          // }

          // resumeUpload();
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
