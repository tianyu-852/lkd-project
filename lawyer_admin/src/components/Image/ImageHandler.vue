<template>
  <q-card class="image-handle">
    <div class="image-handle-container">
      <div class="image-handle-cropper">
        <div class="image-handle-container-between">
          <div class="center column white" v-show="state.top === 'cut'">
            <img :src="left" class="clickable" @click="$refs.cropper.rotateLeft()" />
          </div>
        </div>
        <div>
          <canvas v-show="state.top === 'canvas' || state.top === 'mosaic'" ref="canvas" width="600" height="400" />
        </div>
        <vueCropper
          class="image-handle-cropper-cut"
          v-show="state.top === 'cut'"
          ref="cropper"
          :img="currentImage"
          :autoCrop="true"
        />
        <div class="image-handle-container-between">
          <div class="center column white" v-show="state.top === 'cut'">
            <img :src="right" class="clickable" @click="$refs.cropper.rotateRight()" />
          </div>
        </div>
      </div>
    </div>

    <div class="image-handle-btn-group" v-if="state.top === 'canvas'">
      <div class="image-handle-btn-left">
        <div class="clickable margin-right-16 image-handle-btn-left-image-btn" @click="cut">
          <img :src="cutImage" />
          <span>剪裁</span>
        </div>

        <div class="image-handle-btn-left-image-btn clickable" @click="mosaicHandle">
          <img :src="mskImage" />
          <span>马赛克</span>
        </div>
      </div>

      <div>
        <q-btn class="margin-right-16" @click="$emit('close')">关闭</q-btn>
        <q-btn color="positive" @click="saveImage">保存</q-btn>
      </div>
    </div>

    <div class="image-handle-btn-group" v-else>
      <div class="center">
        <q-btn class="margin-right-16" @click="state.top = 'canvas'">取消</q-btn>
        <q-btn color="positive" @click="save">保存</q-btn>
      </div>
    </div>
  </q-card>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import Mosaic from 'image-mosaic'
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'ImageHandler',
  components: { VueCropper },
  props: {
    image: {
      type: String,
      default: '',
    },
  },
  computed: {},
  data() {
    return {
      cutImage: require('@/assets/icons/cj_icon_sel.png'),
      mskImage: require('@/assets/icons/msk_icon_sel.png'),
      right: require('@/assets/icons/yxz.png'),
      left: require('@/assets/icons/zxz.png'),
      autoCrop: false,
      state: {
        top: 'canvas',
      },
      currentImage: null,
      provinces: [],
      allProvinces: [],
      province: null,
      city: null,
      sex: '',
    }
  },
  watch: {
    image: {
      immediate: true,
      handler(image) {
        this.$nextTick(() => {
          this.currentImage = image
          this.updateImage(image, true)
        })
      },
    },
  },
  created() {
    this.setDistrictList().then((data) => {
      this.allProvinces = this.provinces = data.map((province) => {
        return {
          label: province.name,
          value: province.district_id,
          cities: province.cities.map((city) => {
            return {
              label: city.name,
              value: city.district_id,
            }
          }),
        }
      })
    })
  },
  methods: {
    ...mapActions(['getDistrictList']),
    ...mapMutations(['getCity', 'getProvinces']),
    setDistrictList() {
      return this.getDistrictList()
    },
    cut() {
      this.state.top = this.state.top === 'cut' ? 'canvas' : 'cut'
    },
    mosaicHandle() {
      const canvas = this.$refs.canvas
      this.state.top = 'mosaic'

      const ctx = canvas.getContext('2d')
      const mosaic = new Mosaic(ctx, {
        tileWidth: 10,
        tileHeight: 10,
        brushSize: 3,
      })

      const MouseEvents = {
        init: function init() {
          mosaic.context.canvas.addEventListener('mousedown', MouseEvents.mousedown)
        },
        mousedown: function mousedown() {
          mosaic.context.canvas.addEventListener('mousemove', MouseEvents.mousemove)
          document.addEventListener('mouseup', MouseEvents.mouseup)
        },
        mousemove: function mousemove(e) {
          if (e.shiftKey) {
            mosaic.eraseTileByPoint(e.layerX, e.layerY)
            return
          }
          mosaic.drawTileByPoint(e.layerX, e.layerY)
        },
        mouseup: function mouseup() {
          mosaic.context.canvas.removeEventListener('mousemove', MouseEvents.mousemove)
          document.removeEventListener('mouseup', MouseEvents.mouseup)
        },
      }

      MouseEvents.init()
    },
    saveImage() {
      this.$emit('save', this.currentImage)
    },
    save() {
      switch (this.state.top) {
        case 'cut':
          this.saveCutImage()
          break
        case 'mosaic':
          this.saveMosaic()
          break
      }

      this.state.top = 'canvas'
    },
    saveMosaic() {
      this.state.top = 'canvas'
      const imgUrl = this.$refs.canvas.toDataURL('image/png')
      this.updateImage(imgUrl)
      // this.currentImage = imgUrl
    },
    saveCutImage() {
      // 获取截图的blob数据
      this.$refs.cropper.getCropData((data) => {
        this.updateImage(data)
      })

      this.cut()
    },

    updateImage(imageURL, isZoom = true) {
      const cv = this.$refs.canvas
      const ctx = cv.getContext('2d')
      const img = new Image()

      ctx.fillStyle = '#636363'
      ctx.beginPath()
      ctx.fillRect(0, 0, 600, 400)
      ctx.closePath()

      img.src = imageURL
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        let height = img.height
        let width = img.width

        if (isZoom) {
          while (height > 400) {
            height = height * 0.9
            width = width * 0.9
          }
        }
        this.currentImage = imageURL
        ctx.drawImage(img, 0, 0, width, height)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.image-handle {
  max-width: 850px;

  &-container {
    display: flex;
    width: 850px;
    height: 400px;

    &-between {
      width: 100px;
      height: 400px;
    }
  }

  &-cropper {
    display: flex;
    width: 850px;
    height: 400px;
    background: #636363;

    &-cut {
      width: 600px;
      height: 400px;
    }
  }

  &-btn-left {
    display: flex;

    &-image-btn {
      font-size: 16px;

      img {
        filter: grayscale(100%);
        margin-right: 6px;
      }

      &:hover {
        filter: none;
        color: #3980ea;

        img {
          filter: none;
        }
      }
    }
  }

  &-btn-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    width: 100%;
    height: 70px;
    background: #ebeef5;
  }

  &-info {
    width: 100%;
    height: 200px;
    padding: 24px 12px;
    display: grid;
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(2, 50%);

    &-item {
      display: flex;
      align-items: center;

      span {
        font-size: 14px;
        margin-right: 6px;
      }
      label {
        width: 175px;
      }
      input {
        width: 175px;
      }
    }
  }
}
</style>