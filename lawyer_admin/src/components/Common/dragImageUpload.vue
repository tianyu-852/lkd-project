<template>
  <div>
    <div>
      <div class="drag_image_area" ref="drag_image_area" :style="'height:' + areaHeight + ';' + 'width:' + areaWidth">
        <a-spin v-show="state.uploadLoading" />
        <span v-show="state.uploadLoading"> 正在上传 </span>
        <span v-show="!state.uploadLoading">拖动图片到虚线框内，或者点击<a @click="triggers">此处</a></span>
      </div>
      <input type="file" ref="imagesBtn" @change="uploadVideo" multiple="multiple" style="display: none" />
    </div>
  </div>
</template>
  <script>
import { UploadFiles } from '@/api/common'
export default {
  name: 'dragImageIndex',
  components: {},
  props: {
    areaHeight: {
      type: String,
      default: '10rem',
    },
    areaWidth: {
      type: String,
      default: '30rem',
    },
  },
  data() {
    return {
      state: {
        dropActive: false,
        uploadLoading: false,
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const dropArea = this.$refs.drag_image_area
    dropArea.addEventListener('drop', this.dropEvent, false)
    dropArea.addEventListener('dragleave', (e) => {
      e.stopPropagation()
      e.preventDefault()
      this.dropActive = false
    })
    dropArea.addEventListener('dragenter', (e) => {
      e.stopPropagation()
      e.preventDefault()
      this.dropActive = true
    })
    dropArea.addEventListener('dragover', (e) => {
      e.stopPropagation()
      e.preventDefault()
      this.dropActive = true
    })
  },
  methods: {
    triggers() {
      this.$refs.imagesBtn.dispatchEvent(new MouseEvent('click'))
    },
    dropEvent(e) {
      this.dropActive = false
      e.stopPropagation()
      e.preventDefault()
      this.uploadFile(e.dataTransfer.files)
    },
    uploadFile(file) {
      this.state.uploadLoading = true
      // 渲染上传文件
      console.log(file[0], 'file')
      if (file && file.length) {
        var images1 = []
        for (let i = 0; i < file.length; i++) {
          if (
            file[i].type === 'image/jpeg' ||
            file[i].type === 'image/png' ||
            file[i].type === 'image/jpg' ||
            file[i].type === 'image/BMP'
          ) {
            images1.push(file[i])
          } else {
            this.$message.warning('只允许上传图片，第' + (i + 1) + '个文件自动忽略')
          }
        }
        console.log(images1)
        UploadFiles(images1).then((data) => {
          // 上传文件方法，必要时要改成上传到阿里云
          console.log(data.data)
          this.$emit('imageReturn', data.data)
          this.state.uploadLoading = false
          this.$message.success('上传成功')
        })
      }
    },
    uploadVideo(event) {
      var file = [event.target.files[0]]
      console.log(file)
      UploadFiles(file).then((data) => {
        console.log(data.data)
        this.$emit('imageReturn', data.data)
        this.state.uploadLoading = false
        this.$message.success('上传成功')
      })
    },
  },
}
</script>
 <style scoped lang="less">
.drag_image_area {
  border: 2px dashed #e8e8e8;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
}
</style>
