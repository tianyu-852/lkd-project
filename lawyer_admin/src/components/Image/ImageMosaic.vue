<template>
  <div id="box">
    <canvas id="canvasName"></canvas>
    <!-- <button id="clearAll">还原</button>
    <button id="save">保存</button> -->
  </div>
</template>
  <script>
import Mosaic from 'image-mosaic'
import { uploadImage } from '@/api/common'
export default {
  name: 'Index',
  components: {},
  props: {
    imgSrc: {
      type: String,
      default: '',
    },
    imgHeight: {
      type: Number,
      default: 500,
    },
    imgWidth: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      dataURL: '',
      ctx: {},
    }
  },
  computed: {},
  watch: {
    imgSrc() {
      this.initMosaic()
    },
  },
  created() {},
  mounted() {
    this.initMosaic()
  },

  methods: {
    drawImageToCanvas() {
      const that = this
      const canvas = document.getElementById('canvasName')
      const ctx = canvas.getContext('2d')
      let imageUrl
      if (this.imgSrc) {
        imageUrl = this.imgSrc
      }
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.crossOrigin = 'Annoymous'
        image.onload = function () {
          let height = image.height
          let width = image.width
          while (height > that.imgHeight) {
            // 图片等比缩放
            height = height * 0.9
            width = width * 0.9
          }
          canvas.width = width
          canvas.height = height
          ctx.drawImage(this, 0, 0, width, height)
          resolve(ctx)
        }
        image.src = imageUrl
      })
    },
    initMosaic() {
      this.drawImageToCanvas().then((ctx) => {
        this.ctx = ctx
        const mosaic = new Mosaic(ctx)
        const MouseEvents = {
          init() {
            mosaic.context.canvas.addEventListener('mousedown', MouseEvents.mousedown)
          },
          mousedown() {
            mosaic.context.canvas.addEventListener('mousemove', MouseEvents.mousemove)
            document.addEventListener('mouseup', MouseEvents.mouseup)
          },
          mousemove(e) {
            if (e.shiftKey) {
              mosaic.eraseTileByPoint(e.layerX, e.layerY)
              return
            }
            mosaic.drawTileByPoint(e.layerX, e.layerY)
          },
          mouseup() {
            mosaic.context.canvas.removeEventListener('mousemove', MouseEvents.mousemove)
            document.removeEventListener('mouseup', MouseEvents.mouseup)
          },
        }
        MouseEvents.init()
        // document.querySelector('#clearAll').addEventListener(
        //   'click',
        //   () => {
        //     mosaic.eraseAllTiles()
        //   },
        //   true
        // )
        // document.querySelector('#save').addEventListener(
        //   'click',
        //   () => {
        //     var dataURL = document.querySelector('#canvasName').toDataURL('image/png')
        //     // console.log(document.querySelector('#canvasName').toDataURL('image/png'))
        //     // uploadImage(dataURL).then((data) => {
        //     this.$emit('save', dataURL)
        //     //   console.log(data)
        //     // })
        //   },
        //   true
        // )
      })
    },

    /**
     * @method 将base64转换为file对象
     * @param {String} dataURL base64地址
     * @param {String} fileName 文件名称
     * @param {String} fileType 图片类型 默认image/jpg
     * @return {Object} file对象
     */
    dataURLtoFile(dataurl, filename) {
      // 将base64转换为文件
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {
        type: mime,
      })
    },
    saveImage() {
      var dataURL = document.querySelector('#canvasName').toDataURL('image/png')
      var data = this.dataURLtoFile(dataURL)
      uploadImage(data).then((data) => {
        this.$emit('save', data.data.url)
      })
    },
  },
}
</script>
<style scoped lang='less'>
#box {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  .box-canvas {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
    width: 500px;
    height: 500px;
  }
  .box-btn {
    margin-top: 20px;
    button {
      margin: 0 100px;
    }
  }
}
</style>