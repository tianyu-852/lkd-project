<template>
  <div id="box">
    <div class="box-canvas">
      <canvas id="canvasName"></canvas>
    </div>
    <div class="box-btn">
      <a-button @click="rotate('canvasName', 'left')">顺时针90°</a-button>
      <a-button @click="rotate('canvasName', 'right')">逆时针90°</a-button>
    </div>
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
    rotate(pid, direction) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const minStep = 0
      const maxStep = 3
      const img = document.getElementById(pid)
      if (img == null) return
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      const height = document.getElementById('canvasName').height
      const width = document.getElementById('canvasName').width
      console.log(height)
      console.log(width)
      var step = img.getAttribute('step')
      if (step == null) {
        step = minStep
      }
      if (direction === 'right') {
        // 向右转
        step++
        // 旋转到原位置，即超过最大值
        step > maxStep && (step = minStep)
      } else {
        // 向左转
        step--
        step < minStep && (step = maxStep)
      }
      img.setAttribute('step', step)
      var canvas = document.getElementById('pic_' + pid)
      if (canvas == null) {
        img.style.display = 'none'
        canvas = document.createElement('canvas')
        canvas.setAttribute('id', 'pic_' + pid)
        img.parentNode.appendChild(canvas)
      }
      // 旋转角度以弧度值为参数
      var degree = (step * 90 * Math.PI) / 180
      var ctx = canvas.getContext('2d')
      console.log(step)
      switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height, width, height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, 0, 0, -width, -height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0, width, height)
          break
      }
      // 将图片转为base64
      var ss = canvas.toDataURL(0.92)
      // 将base64转为文件
      this.dataURL = this.dataURLtoFile(ss)
    },
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
      })
    },
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
