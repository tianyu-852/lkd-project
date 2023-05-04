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
        <q-btn v-if="!lawyerUpdateAddrInfo" color="positive" @click="saveImage">保存</q-btn>
      </div>
    </div>

    <div class="image-handle-btn-group" v-else>
      <div class="center">
        <q-btn class="margin-right-16" @click="state.top = 'canvas'">取消</q-btn>
        <q-btn color="positive" @click="save">保存</q-btn>
      </div>
    </div>

    <!-- 图片 -->
    <div class="image-handle-info">
      <!-- 工作单位 -->
      <div class="image-handle-info-item law-office-info-item">
        <div class="law-office-info">
          <span v-if="value.lawyer_grade === 1">律所名称:</span>
          <span v-else>{{ value.lawyer_grade === 3 ? '执业机构' : '工作单位' }}:</span>
          <q-input v-model="value.lawyer_office" style="width: 240px;" outlined placeholder="当前律师事务所" />
          <a-button v-if="!lawyerUpdateAddrInfo" class="search-btn" type="primary" @click="searchLawOfficeMap">搜索</a-button>
        </div>
        <!-- 律师更新地址 -->
        <div v-if="lawyerUpdateAddrInfo">
          <div v-if="lawyerUpdateAddrInfo.old_lawyer_office_address" style="display:flex; justify-content: flex-start; align-items: center; margin-top: 4px;">
            <span>旧地址：</span>
            <a-textarea style="width: 240px;" :auto-size="{ maxRows: 2 }" :value="lawyerUpdateAddrInfo.old_lawyer_office_address" placeholder="律所旧地址" />
          </div>

          <div style="display:flex; justify-content: flex-start; align-items: center; margin-top: 4px;">
            <span style="color: #f56c6c;">新地址：</span>
            <a-textarea style="width: 190px;" :auto-size="{ maxRows: 2 }" :value="lawyerUpdateAddrInfo.lawyer_office_address" placeholder="律所新地址" />
            <a-button class="search-btn" type="primary" size="small" @click="submitReadLawyerUpdateAddrLog">修改</a-button>
          </div>
        </div>

        <!-- 律师审核 -->
        <template v-else>
          <div v-if="value.lawyer_office_lng && value.lawyer_office_lat" class="law-office-loc">
            <span style="margin-right: 8px;">经度：{{ value.lawyer_office_lng }}</span>
            <span>纬度：{{ value.lawyer_office_lat }}</span>
          </div>
          <span v-if="value.lawyer_office_address" class="law-office-address">地址：{{ value.lawyer_office_address }}</span>
          <img v-if="value.lawyer_office_lng || value.lawyer_office_lat || value.lawyer_office_address" class="law-office-delimg" :src="require('@/assets/lawyer/lajixiang.png')" @click="removeLawOfficeLoc" />
        </template>
      </div>
      
      <!-- 资格执证号 -->
      <div class="image-handle-info-item" v-show="value.lawyer_grade_chinese !== '法学生'">
        <span>{{ value.lawyer_grade === 3 ? '统一证件编号' : '资格执证号' }}:</span>
        <q-input v-model="value.license_number" outlined placeholder="当前律师资格执政号" @input="autoWorkYear" />
      </div>

      <!-- 性别 -->
      <div class="image-handle-info-item">
        <span>性别：</span>
        <a-radio-group v-model="sex" @change="chooseSex">
          <a-radio value="1" style="width: 100px">男</a-radio>
          <a-radio value="2" style="width: 100px">女</a-radio>
        </a-radio-group>
      </div>
      
      <!-- 律师所在省 -->
      <div class="image-handle-info-item">
        <span>{{ value.lawyer_grade === 3 ? '工作者所在省' : '律师所在省' }}:</span>
        <q-select
          filled
          v-model="province"
          use-input
          fill-input
          input-debounce="0"
          :options="provinces"
          @filter="filterProvince"
          style="width: 170px"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">这个是真的找不到啊</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <!-- 律师所在市 -->
      <div class="image-handle-info-item">
        <span>{{ value.lawyer_grade === 3 ? '工作者所在市' : '律师所在市' }} :</span>
        <q-select filled v-model="city" fill-input input-debounce="0" :options="cities">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">这个是真的找不到啊</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      
      <!-- 执业时间 -->
      <!-- <div class="image-handle-info-item" v-show="value.lawyer_grade_chinese !== '法学生' || value.lawyer_grade_chinese !== '实习律师'" > -->
      <div class="image-handle-info-item" v-if="value.lawyer_grade !== 1 && value.lawyer_grade !== 5">
        <span>{{ value.lawyer_grade === 3 ? '发证日期' : '执业时间' }}:</span>
        <q-input v-if="value.lawyer_grade === 3" v-model="value.issueDate" placeholder="例：2015-01-01" />
        <q-input v-else v-model.number="value.start_work_time" outlined placeholder="执业时间(类似2015)" />
      </div>
    </div>

    <!-- 搜索律所地址 modal -->
    <!-- 废弃 -->
    <div v-if="isShowSearchModal" class="search-modal">
      <a-icon class="icon-close" type="close-circle" @click.stop="isShowSearchModal = false" />
      <div v-for="(lItem, lIndex) in lawOfficeSearchList" :key="lIndex" class="search-item" @click="changeLawOfficeItem(lItem)">
        <div class="title">{{ lItem.title }}</div>
        <div class="address">{{ lItem.address }}</div>
        <div class="loc">
          <span style="margin-right: 20px;">经度：{{ lItem.location.lng }}</span>
          <span>纬度：{{ lItem.location.lat }}</span>
        </div>
      </div>
      <!-- 空数据 -->
      <a-empty v-if="!lawOfficeSearchList.length" description="未搜索到律师地址" />
      <div v-if="!lawOfficeSearchList.length" class="input-loc-wrap">
        <!-- 律所经度 item -->
        <div class="iniput-loc-item">
          <div class="iniput-title">律所经度：</div>
          <a-input class="input" v-model="lawOfficeInputInfo.lawyer_office_lng" style="width: 220px;" placeholder="请输入律所经度" allowClear />
        </div>
        <!-- 律所纬度 -->
        <div class="iniput-loc-item">
          <div class="iniput-title">律所纬度：</div>
          <a-input class="input" v-model="lawOfficeInputInfo.lawyer_office_lat" style="width: 220px;" placeholder="请输入律所纬度" allowClear />
        </div>
        <!-- 律所地址 -->
        <div class="iniput-loc-item">
          <div class="iniput-title">律所地址：</div>
          <a-input class="input" v-model="lawOfficeInputInfo.lawyer_office_address" style="width: 220px;" placeholder="请输入律所地址" allowClear />
        </div>
        <a-button type="primary" style="float: right; margin-right: 66px;" @click="confirmInputLawOfficeLoc">确认</a-button>
      </div>
    </div>
  </q-card>
</template>

<script>
import * as lawyerApi from '@/api/lawyer'
import { VueCropper } from 'vue-cropper'
import Mosaic from 'image-mosaic'
import { mapActions, mapMutations } from 'vuex'
import jsmd5 from 'js-md5'

export default {
  name: 'LawyerImageHandler',
  components: { VueCropper },
  props: {
    value: { type: Object, default: () => ({}) },
    image: { type: String, default: '', },
    lawyerUpdateAddrInfo: { type: Object, default: () => null },
  },
  computed: {
    cities() {
      if (this.value.province_district_id === '') {
        return []
      } else {
        const province = this.allProvinces.find((province) => this.value.province_district_id === province.value)

        if (province) {
          return province.cities
        }

        return []
      }
    },
  },
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

      lawOfficeSearchList: [], // 律所搜索地址
      isShowSearchModal: false, // 是否显示搜索 modal
      lawOfficeInputInfo: {
        lawyer_office_lng: '', // 律所经度
        lawyer_office_lat: '', // 律所纬度
        lawyer_office_address: '', // 律所地址
      }
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
    province: {
      immediate: true,
      handler(province) {
        if (province === null) {
          this.province = {
            label: this.value.province,
            value: this.value.province_district_id,
            cities: [],
          }

          this.city = {
            label: this.value.city,
            value: this.value.city_district_id,
          }
          return
        }
        this.sex = String(this.value.gender)
        this.value.province = province.label
        this.value.province_district_id = province.value
      },
    },
    city: {
      immediate: true,
      handler(city) {
        if (city === null) {
          return
        }
        this.value.city = city.label
        this.value.city_district_id = city.value
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
    console.log(this.value)
  },
  methods: {
    chooseSex() {
      this.value.gender = this.sex
    },
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
    filterProvince(val, update) {
      if (val === '') {
        update(() => {
          this.provinces = this.allProvinces
        })
        return
      }

      update(() => {
        this.provinces = this.allProvinces.filter((v) => v.label.indexOf(val) > -1)
      })
    },
    autoWorkYear(licenseNumber) {
      if (
        this.value.apply_lawyer_grade !== 1 &&
        this.value.apply_lawyer_grade !== 5 &&
        (this.value.start_work_time || '').length === 0 &&
        licenseNumber.length >= 9
      ) {
        const value = Object.assign(this.value)
        value.start_work_time = licenseNumber.substr(5, 4)
        this.$emit('input', value)
      }
    },
    /**
     * 搜索律所地图地址
     */
    async searchLawOfficeMap() {
      const { lawyer_office } = this.value
      if (!lawyer_office || !lawyer_office.trim()) return this.$message.warning('请先输入律所名称')

      // const mapKey = 'DWPBZ-3MAY3-NNM3R-3ZES7-5NEXZ-J6BNX'
      const mapKey = '5XEBZ-SKTRX-JSQ47-7UP3U-6EPNZ-ZEBCW'
      // const mapSign = jsmd5(`/ws/place/v1/suggestion/?key=${ mapKey }&keyword=${ lawyer_office.trim() }&output=jsonp`)

      try {
        const searchRes = await this.$jsonp('https://apis.map.qq.com/ws/place/v1/suggestion', {
          key: mapKey,
          keyword: lawyer_office.trim(),
          output: 'jsonp'
          // sig: mapSign,
        })
        // console.log(searchRes)
        
        if (!searchRes.status) {
          const lawOfficeSearchList = searchRes.data
          this.lawOfficeSearchList = lawOfficeSearchList
          this.isShowSearchModal = true

          console.log(lawOfficeSearchList)
        }
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 选择律所
     */
    changeLawOfficeItem(lawOfficeItem) {
      console.log(lawOfficeItem)
      this.value.lawyer_office_lng = lawOfficeItem.location.lng
      this.value.lawyer_office_lat = lawOfficeItem.location.lat
      this.value.lawyer_office_address = lawOfficeItem.address
      this.isShowSearchModal = false
    },
    /**
     * 移除律所地址
     */
    removeLawOfficeLoc() {
      this.value.lawyer_office_lng = ''
      this.value.lawyer_office_lat = ''
      this.value.lawyer_office_address = ''
    },
    /**
     * 确认律所输入地址
     */
    confirmInputLawOfficeLoc() {
      if (!this.lawOfficeInputInfo.lawyer_office_lng.trim()) return this.$message.warning('请先输入律所经度')
      if (!this.lawOfficeInputInfo.lawyer_office_lat.trim()) return this.$message.warning('请先输入律所纬度')
      if (!this.lawOfficeInputInfo.lawyer_office_address.trim()) return this.$message.warning('请先输入律所地址')

      this.value.lawyer_office_lng = this.lawOfficeInputInfo.lawyer_office_lng.trim()
      this.value.lawyer_office_lat = this.lawOfficeInputInfo.lawyer_office_lat.trim()
      this.value.lawyer_office_address = this.lawOfficeInputInfo.lawyer_office_address.trim()
      this.isShowSearchModal = false
      // 重置输入律所地址信息
      this.lawOfficeInputInfo.lawyer_office_lng = ''
      this.lawOfficeInputInfo.lawyer_office_lat = ''
      this.lawOfficeInputInfo.lawyer_office_address = ''
    },

    /**
     * 提交律师修改地址 记录
     */
    async submitReadLawyerUpdateAddrLog() {
      const { lawyerUpdateAddrInfo } = this

      try {
         await lawyerApi.postLawyerUpdateAddrLogApi({ lawyer_update_log_id: lawyerUpdateAddrInfo.lawyer_update_log_id })
         this.$notification.success({ message: '操作成功', duration: 3 })
         //  this._getBestLawyerPustList(this.pagination.current)
         this.$router.back(-1)
       } catch (error) {
         console.log(error)
       }
    }
  },
}
</script>

<style lang="less" scoped>
.image-handle {
  // max-width: 860px;
  max-width: 940px;
  // min-width: 1000px;
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
    // height: 200px;
    padding: 24px 12px;
    display: grid;
    // grid-template-columns: repeat(3, 33.33%);
    grid-template-columns: repeat(3, 1fr);
    // grid-gap: 20px;
    grid-row-gap: 20px;
    &-item {
      position: relative;
      display: flex;
      align-items: center;
      &.law-office-info-item {
        display: block;
        .law-office-info {
          display: flex;
          align-items: center;
        }
        .law-office-loc {
          margin-top: 6px;
        }
        .law-office-delimg {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
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
      .search-btn {
        margin-left: 6px;
      }
      .search-wrap {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        height: 100px;
        background: red;
      }
    }
  }
}

.search-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  border-radius: 50px;
  padding: 20px;
  z-index: 999;
  background: #fff;
  overflow-y: auto;
  box-shadow: 1px 2px 20px #000;
  .search-item {
    margin-bottom: 20px;
    cursor: pointer;
    .title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    .address {
      font-size: 14px;
      font-weight: 500;
      color: #666;
    }
    .loc {
      font-size: 12px;
      color: #999;
    }
  }
  .icon-close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px;
  }
  .input-loc-wrap {
    margin-top: 20px;
    .iniput-loc-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
    }
  }
}
</style>
