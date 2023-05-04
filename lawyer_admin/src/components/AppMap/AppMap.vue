<template>
  <div>
    <AutoComplete style="width: 100%" placeholder="请输入目标地址大概位置" @search="handleSearch" @select="pressEnter">
      <template slot="dataSource">
        <a-select-option v-for="(i, key) in result" :key="key + i.id" :value="i.address + key">
          {{ i.title }} 详细地址：
          {{ i.address }}
        </a-select-option>
      </template>
    </AutoComplete>
    <div>
      <span>当前选中地址的详细位置:</span>
      {{ address }}
    </div>
    <div style="width: 635px; height: 500px; display: flex">
      <div v-if="appMap" id="AppMap" style="width: 635px; height: 500px" />
    </div>
  </div>
</template>
  <script>
import { webAddress, webLocation } from '@/api/common'
import { AutoComplete } from 'ant-design-vue'
import { TMap } from './TMap'
import { getFundraisingSuggestion } from '@/api/fundraising'
var map
export default {
  name: 'MapIndex',
  components: {
    AutoComplete,
  },
  props: {
    // keyMap: {
    //   type: Object,
    //   default: () => {
    //     return []
    //   },
    // },
    // address: {
    //   type: String,
    //   default: '',
    // },
    lawyerUserId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      appMap: true,
      address: '',
      uploadData: {
        lng: '',
        lat: '',
        address: '',
      },
      value: '',
      dataSource: [],
      result: [],
    }
  },
  computed: {},
  watch: {
    // immediate: true,
    // address(value) {
    //   this.address = value
    //   console.log(value)
    // },
  },
  created() {},
  mounted() {
    this.init(28.000124, 120.702457)
  },
  methods: {
    handleSearch(value) {
      if (value) {
        console.log(this.lawyerUserId)
        getFundraisingSuggestion(value, this.lawyerUserId).then((data) => {
          this.result = data.data.data
          console.log(this.result)
        })
      } else {
        this.result = []
      }
    },
    pressEnter(e) {
      // 根据地址获得经纬度
      console.log(e)
      console.log('我选择了')
      const value = e.substr(0, e.length - 1)
      console.log(value)
      webAddress(value).then((data) => {
        console.log(data)
        this.uploadData.lng = data.data.lng
        this.uploadData.lat = data.data.lat
        this.uploadData.province = data.data.province
        this.uploadData.city = data.data.city
        this.address = data.data.address
        this.uploadData.address = data.data.address
        console.log(this.uploadData)
        this.init(this.uploadData.lat, this.uploadData.lng)
        this.$emit('uploadAddress', this.uploadData)
      })
      // this.init(27.922879, 120.636712)
    },

    init(lngs, lats) {
      if (lngs !== 28.000124 && lats !== 120.636712) {
        map.destroy()
      }
      const that = this
      var center
      console.log(lngs, lats)
      // 定义地图中心点坐标 可默认也可以传值，赋值

      center = new window.TMap.LatLng(lngs, lats)

      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      map = new window.TMap.Map(document.getElementById('AppMap'), {
        center: center, // 设置地图中心点坐标
        zoom: 17.2, // 设置地图缩放级别 https://lbs.qq.com/webApi/javascriptGL/glGuide/glMap
        pitch: 0, // 设置俯仰角 https://lbs.qq.com/getPoint/#Z
        rotation: 0, // 设置地图旋转角度
      })

      var markerLayer = new window.TMap.MultiMarker({
        map: map,

        // geometries: [markerGeo],
      })
      // map.on('center_changed', () => {
      //   markerGeo.position = map.getCenter()
      //   markerLayer.updateGeometries([markerGeo])
      // })
      markerLayer.setGeometries([])
      markerLayer.add({
        position: new window.TMap.LatLng(lngs, lats),
      })
      map.on('click', function (evt) {
        var lat = evt.latLng.getLat().toFixed(6)
        var lng = evt.latLng.getLng().toFixed(6)
        markerLayer.setGeometries([])
        markerLayer.add({
          position: evt.latLng,
        })

        console.log(lat + ',' + lng)
        webLocation(lng, lat).then((data) => {
          console.log(data.data)
          const address = data.data.address
          const province = data.data.province // 省份
          const city = data.data.city // 城市
          // const district = data.data.district // 区
          var splitFirst = String(address.split(province)).split(city)
          var text = String(splitFirst).split(',')
          // var ResultString = splitFirst.join('')
          that.address = text[2]
          console.log('地址', text[2])
          that.uploadData.province = data.data.province
          that.uploadData.city = data.data.city
          that.uploadData.lng = data.data.lng
          that.uploadData.lat = data.data.lat
          that.uploadData.address = text[2]
          console.log(that.uploadData)
          that.$emit('uploadAddress', that.uploadData)
        })
      })
    },
  },
}
</script>
 <style scoped>
</style>
