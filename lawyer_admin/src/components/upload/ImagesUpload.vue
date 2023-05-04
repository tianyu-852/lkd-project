<template>
  <div class="clearfix">
    <a-upload
      :beforeUpload="handlebeforeUpload"
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < uploadLength">
        <a-icon type="plus" />
        <div class="ant-upload-text">{{ uploadDescription }}</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel" style="height: 1000px; width: 800px">
      <img alt="example" :src="previewImage" style="height: 500px; width: 500px" />
    </a-modal>
  </div>
</template>
<script>
import { Modal } from 'ant-design-vue'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'imagesUpload',
  components: {
    Modal,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    uploadDescription: {
      type: String,
      default: '上传图片',
    },
    uploadLength: {
      type: Number,
      default: 4,
    },
    uploadShowWidht: {
      type: Number,
      default: 600,
    },
    uploadShowHeight: {
      type: Number,
      default: 550,
    },
    uploadHeight: {
      type: String,
      default: '104px',
    },

    uploadWidht: {
      type: String,
      default: '208px',
    },
    uploadType: {
      type: Array,
      default: function () {
        return ['.jpg', '.png']
      },
    },
    uploadSize: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
  },
  created() {},
  mounted() {
    this.changeCss()
  },
  methods: {
    changeCss() {
      var root = document.getElementsByClassName('ant-upload-list-picture-card-container')
      console.log(root)
      root = ' width:' + this.uploadWidht + ' ;height:' + this.uploadHeight

      console.log(' width:' + this.uploadWidht + ' ;height:' + this.uploadHeight)
    },
    handlebeforeUpload(file) {
      // 限制图片 格式、size、分辨率
      const isJPG = file.type === 'image/jpeg'
      const isJPEG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      if (!(isJPG || isJPEG || isGIF || isPNG)) {
        Modal.error({
          title: '只能上传JPG 、JPEG 、GIF、 PNG格式的图片~',
        })
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (isLt2M > this.uploadSize) {
        Modal.error({
          title: '超过2M限制，不允许上传~',
        })
        return
      }
      return false
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
      this.$emit(this.title + 'List', this.fileList)
      console.log(' width:' + this.uploadWidht + ' ;height:' + this.uploadHeight)
      console.log('给父组件传送图片数组,名字为传入的title和List拼接')
    },
  },
}
</script>
<style lang="less" scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.ant-modal-content {
  width: 600px;
  height: 550px;
}
/* .ant-upload-list-picture-card-container {
  width: 200px;
  height: 104px;
}
.ant-upload-list-picture-card .ant-upload-list-item {
  width: 200px;
  height: 104px;
} */
</style>