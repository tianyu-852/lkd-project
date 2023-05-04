<template>
  <div>
    <!-- <button class="btn">点击效果</button> -->
    <!-- <input type="file" ref="imagesBtn" @change="upload" /> -->

    <!-- 进度条 -->
    <canvas id="canvasArea" width="300" height="160" />
    <a-input @keyup.enter="draw(value)" v-model="value" style="width: 200px" />
    <!-- <a-progress type="dashboard" :percent="50" gapDegree="145" /> -->
    <span>{{ timeData }}秒</span>
    <!-- 动画过渡 -->
    <button @click=";(textLoading = !textLoading), timeReduce()">点了</button>
    <div>
      <transition-group name="text">
        <p v-show="textLoading" key="123" style="color: red; font-weight: bold; font-size: 40px">节后不买</p>
        <img
          v-show="textLoading"
          key="456"
          src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/default.png"
          style="width: 100px; height: 100px"
        />
      </transition-group>
      <transition name="text">
        <p v-show="textLoading">jiehoubumaia</p>
      </transition>
    </div>

    <!-- <imageHandler
      image="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/default.png"
      @close="closeImage"
      @save="saveImage"
    /> -->
    <!-- <userTable /> -->
    {{ dateYear }}
    <!-- 拖动上传 -->
    <dragImageUpload />

    <!-- 上传文件 -->
    <uploadVideo />

    <!-- 地图 -->
    <button @click="getLawyerData">返回</button>
    <div style="width: 500px; height: 500px; background: #ffffff" ref="CHINAMap"></div>
    <!-- <img :src="image" alt="" /> -->
  </div>
</template>
  <script>
import { getLawyerDistribution } from '@/api/lawyer'
import axios from 'axios'
import { postAppAndroidUpload } from '@/api/app'
import { getProvince } from '@/utils/util'
import { getRongPage } from '@/api/user'
import md5 from 'js-md5'
import userTable from '@/components/test/userTable.vue'
import imageHandler from '@/components/Image/ImageHandler.vue'
import dragImageUpload from '@/components/Common/dragImageUpload.vue'
import uploadVideo from '@/components/Common/uploadVideo.vue'
import * as echarts from 'echarts'
import '@/utils/map/china'
export default {
  name: 'testIndex',
  components: { userTable, imageHandler, dragImageUpload, uploadVideo },
  props: {},
  data() {
    return {
      textLoading: true,
      baseData: '',
      value: '',
      label: {
        name: '12321',
        age: '123214',
      },
      image: '',
      cityList: [],
      mapList: [],
      provinceChoose: '',
      timeData: 10,
    }
  },
  computed: {
    dateYear() {
      var d = new Date('December 28 ,2021 23:00:00')
      var c = new Date()
      const WantYear = d.getFullYear()
      const youWantMonet = d.getMonth()
      const youWantDate = d.getDate()
      const WantMonet = youWantMonet < 10 ? '0' + String(youWantMonet + 1) : youWantMonet + 1
      const WantDate = youWantDate < 10 ? '0' + String(youWantDate) : youWantDate
      const youWant = WantYear + '-' + WantMonet + '-' + WantDate
      var youC = c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate()
      return youWant + ' - - - ' + youC
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.draw('80')
    const { name, age } = this.label // 等于下面两行缩写
    // const name = this.label.name
    // const age = this.label.age
    const a = [1, 2, 3]
    const b = [...a, 4, 5]
    console.log(b)
    console.log(name, age)
    this.getLawyerData()
    getRongPage(1, 0).then((data) => {
      console.log(data)
    })
  },
  methods: {
    timeReduce() {
      setTimeout(() => {
        this.timeData = this.timeData - 1
        if (this.timeData > 0) {
          this.timeReduce()
        } else {
          this.$message.success('已经1分钟了哦！')
          this.timeData = 0
        }
        console.log(this.timeData)
      }, 1000)
    },
    getLawyerData() {
      getLawyerDistribution().then((data) => {
        this.cityList = []
        for (let i = 0; i < data.data.length; i++) {
          const a = {
            name: data.data[i].name,
            value: data.data[i].number,
          }
          this.cityList.push(a)
        }

        this.mapList = data.data
        this.MyCHINAMap('china')
      })
    },
    MyCHINAMap(mapName) {
      const that = this
      var myChart3 = echarts.init(this.$refs.CHINAMap)
      var option3
      // if (that.provinceChoose) {
      //   const provinceJson = require('@/utils/map/province/' + that.provinceChoose + '.json')
      //   echarts.registerMap(that.provinceChoose, provinceJson)
      // }

      option3 = {
        title: {
          text: '百姓律师注册律师分布地图',
          left: 'center',
          top: 20,
          color: 'blue',
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          // formatter: '{b}:{c} 人',
          formatter: function (data) {
            // var list = option3.series[0].data
            // var tarValue = 0
            // for (var i = 0, l = list.length; i < l; i++) {
            //   if (list[i].name === data.name) {
            //     tarValue = list[i].value
            //   }
            // }
            if (!data.value) {
              data.value = 0
            }
            return data.name + ': ' + data.value + '人   '
          },
        },
        series: [
          {
            name: '律师分布',
            type: 'map',
            map: mapName,
            roam: true,
            itemStyle: {
              emphasis: {
                borderWidth: 1,
                borderColor: '#3498db',
                areaColor: '#fff',
                label: {
                  show: true,
                  textStyle: {
                    color: '#000000',
                  },
                },
              },
            },
            data: that.cityList,
          },
        ],
        visualMap: {
          left: 'right',
          min: 0,
          max: mapName === 'china' ? 300 : 100,
          text: ['多', '少'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#ffffff', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
          },
        },
      }
      option3 && myChart3.setOption(option3)
      myChart3.on('click', function (params) {
        myChart3.clear()
        // 点击事件 加载对应省份的js文件
        var list = that.mapList
        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i].name.slice(0, 2) === params.name.slice(0, 2)) {
            if (getProvince(list[i].name)) {
              that.mapList = list[i].children
              that.showProvince(getProvince(list[i].name), list[i].children)
            } else {
              that.$router.push({
                name: 'Lawyer',
                query: { parent_district_id: list[i].parent_district_id, district_id: list[i].district_id },
              })
            }
          }
        }
      })
      window.addEventListener('resize', function () {
        myChart3.resize()
      })
    },
    showProvince(name, data) {
      const that = this
      that.provinceChoose = name
      this.cityList = []
      for (let i = 0; i < data.length; i++) {
        const a = {
          name: data[i].name,
          value: data[i].number,
        }
        this.cityList.push(a)
      }
      this.loadScript('$' + name + 'JS', '@/utils/map/province/' + name + '.js', function () {
        that.MyCHINAMap(name)
      })
    },
    loadScript(scriptId, url, callback) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      if (script.readyState) {
        //IE
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null
            callback()
          }
        }
      } else {
        //Others
        script.onload = function () {
          callback()
        }
      }
      script.src = url
      script.id = scriptId
      document.getElementsByTagName('head')[0].appendChild(script)
    },
    MyProvinceMap(mapName) {
      console.log(mapName)
    },
    closeImage() {
      console.log(1)
    },
    saveImage(image) {
      this.image = image
    },
    upload(e) {
      // 测试git
      const files = e.srcElement.files[0] // 获取到上传文件的对象
      var reader = new FileReader()
      reader.readAsDataURL(files) // 参数为上传的文件对象 传值进去就会触发以下onload方法
      reader.onload = function (e) {
        const Base64 = require('js-base64').Base64
        const arr = new Int8Array(e.result)
        // 取文件编译码的前十位
        const arr1 = arr.subarray(0, 10)
        // 取文件编译码的后十位
        const arr2 = arr.subarray(arr.length - 11, arr.length - 1)
        // 拼接前十位和后十位，和文件大小转成字符串
        const val = arr1.join('') + arr2.join('') + files.size
        // 计算出文件md5值打印到控制台
        console.log(md5(val))
        console.log(md5('330328'))
        // 对该md5值进行base64编码
        const md5Data = Base64.encode(md5(val))
        postAppAndroidUpload(md5Data).then((data) => {
          console.log(data.data[0])
          console.log(files.size / 1024 / 1024 + 'MB')
          const form = new FormData()
          form.append('file', files)
          axios({
            headers: {
              'Content-Length': files.size,
              'Content-Type': 'application/vnd.android.package-archive',
              'Content-MD5': md5Data,
            },
            method: 'put',
            url: data.data[0],
            data: form,
          })
        })
      }
    },
    draw(percent, sR) {
      if (percent < 0 || percent > 100) {
        return
      }
      if (sR < Math.PI / 2 || sR >= (3 / 2) * Math.PI) {
        return
      }
      const canvas = document.getElementById('canvasArea') // this.$refs.canvasArea
      const cxt = canvas.getContext('2d')
      const cWidth = canvas.width
      const cHeight = canvas.height
      const baseColor = '#EEEEEE'
      const coverColor = '#5584FD'
      const PI = Math.PI
      sR = sR || PI // 默认圆弧的起始点弧度为π/2
      var finalRadian = sR + ((PI + (PI - sR) * 2) * percent) / 100 // 红圈的终点弧度
      var step = (PI + (PI - sR) * 2) / 100 // 一个1%对应的弧度大小
      var text = 0 // 显示的数字
      var timer = setInterval(function () {
        cxt.clearRect(0, 0, cWidth, cHeight)
        var endRadian = sR + text * step
        // 画灰色圆弧
        drawCanvas(cWidth / 2, (cHeight * 3) / 4, 80, sR, sR + (PI + (PI - sR) * 2), baseColor, 10)
        // 画红色圆弧
        drawCanvas(cWidth / 2, (cHeight * 3) / 4, 80, sR, endRadian, coverColor, 10)
        // 画红色圆头
        // 红色圆头其实就是一个圆，关键的是找到其圆心，涉及到三角函数知识，自己画个图一看就明了
        const angle = 2 * PI - endRadian // 转换成逆时针方向的弧度（三角函数中的）
        const xPos = Math.cos(angle) * 80 + cWidth / 2 // 红色圆 圆心的x坐标
        const yPos = -Math.sin(angle) * 80 + (cHeight * 3) / 4 // 红色圆 圆心的y坐标
        drawCanvas(xPos, yPos, 2, 0, 2 * PI, coverColor, 5)
        cxt.fillText('5000', (cWidth * 2) / 5, (cHeight * 3) / 5 + 15)
        // 数字
        cxt.fillStyle = coverColor
        cxt.font = '20px PT Sans'
        var textWidth = cxt.measureText(text + '%').width
        // cxt.fillText(text + '%', cWidth / 2 - textWidth / 2, (cHeight * 3) / 4 + 15)
        cxt.fillText('总曝光次/数', cWidth / 3, (cHeight * 3) / 4 + 15)
        text++
        if (endRadian.toFixed(2) >= finalRadian.toFixed(2)) {
          clearInterval(timer)
        }
      }, 30)
      function drawCanvas(x, y, r, sRadian, eRadian, color, lineWidth) {
        cxt.beginPath()
        cxt.lineCap = 'round'
        cxt.strokeStyle = color
        cxt.lineWidth = lineWidth
        cxt.arc(x, y, r, sRadian, eRadian, false)
        cxt.stroke()
      }
    },
  },
}
</script>
 <style scoped lang="less">
.btn {
  min-height: 32px;
  min-width: 70px;
  border: 1px solid #f1c40f;
  background-color: #f1c40f;
  border-radius: 4px;
  color: #ffffff;
  position: relative;
}
.btn:focus {
  outline: none;
}
.btn:after {
  content: '';
  display: block;
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  pointer-events: none;
  background-color: #ffcc00;
  background-repeat: no-repeat;
  background-position: 50%;
  opacity: 0;
  transition: all 0.3s;
}
.btn:active:after {
  opacity: 0.3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0s;
}
.text-enter-active {
  transition: opacity 1s;
}
.text-enter {
  opacity: 0;
}
.text-leave-active {
  transition: opacity 10s;
}
.text-leave-to {
  opacity: 0;
}
</style>
