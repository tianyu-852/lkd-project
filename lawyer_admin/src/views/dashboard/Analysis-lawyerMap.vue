<template>
  <div>
    <a-card>
      <div ref="lawyerEchartsMap" class="echarts-map" />
    </a-card>
    
    <a-card style="margin-top: 30px;">
      <div ref="lawyerBestEchartsMap" class="echarts-map" />
    </a-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import chinaMapJson from "@/lib/china-map.json"
import * as statisticalApi from '@/api/statistical'

// 注册地图
echarts.registerMap('china', chinaMapJson)

const mapDataList = [
  { name:"北京声", value: [116.405285,39.904989,177] },
  {"name":"天津","value":[117.190182,39.125596,42]},
  {"name":"河北","value":[114.502461,38.045474,102]},{"name":"山西","value":[112.549248,37.857014,81]},{"name":"内蒙古","value":[111.670801,40.818311,47]},{"name":"辽宁","value":[123.429096,41.796767,67]},{"name":"吉林","value":[125.3245,43.886841,82]},{"name":"黑龙江","value":[126.642464,45.756967,66]},{"name":"上海","value":[121.472644,31.231706,24]},{"name":"江苏","value":[118.767413,32.041544,92]},{"name":"浙江","value":[120.153576,30.287459,114]},{"name":"安徽","value":[117.283042,31.86119,109]},{"name":"福建","value":[119.306239,26.075302,116]},{"name":"江西","value":[115.892151,28.676493,91]},{"name":"山东","value":[117.000923,36.675807,119]},{"name":"河南","value":[113.665412,34.757975,137]},{"name":"湖北","value":[114.298572,30.584355,116]},{"name":"湖南","value":[112.982279,28.19409,114]},{"name":"重庆","value":[106.504962,29.533155,91]},{"name":"四川","value":[104.065735,30.659462,125]},{"name":"贵州","value":[106.713478,26.578343,62]},{"name":"云南","value":[102.712251,25.040609,83]},{"name":"西藏","value":[91.132212,29.660361,9]},{"name":"陕西","value":[108.948024,34.263161,80]},{"name":"甘肃","value":[103.823557,36.058039,56]},{"name":"青海","value":[101.778916,36.623178,10]},{"name":"宁夏","value":[106.278179,38.46637,18]},{"name":"新疆","value":[87.617733,43.792818,67]},{"name":"广东","value":[113.280637,23.125178,123]},{"name":"广西","value":[108.320004,22.82402,59]},{"name":"海南","value":[110.33119,20.031971,14]}]

var toolTipData = [ 
    {name:"北京",value:[{name:"文科",value:95},{name:"理科",value:82}]},
    {name:"天津",value:[{name:"文科",value:22},{name:"理科",value:20}]},
    {name:"河北",value:[{name:"文科",value:60},{name:"理科",value:42}]},
    {name:"山西",value:[{name:"文科",value:40},{name:"理科",value:41}]},
    {name:"内蒙古",value:[{name:"文科",value:23},{name:"理科",value:24}]},
    {name:"辽宁",value:[{name:"文科",value:39},{name:"理科",value:28}]},
    {name:"吉林",value:[{name:"文科",value:41},{name:"理科",value:41}]},
    {name:"黑龙江",value:[{name:"文科",value:35},{name:"理科",value:31}]},
    {name:"上海",value:[{name:"文科",value:12},{name:"理科",value:12}]},
    {name:"江苏",value:[{name:"文科",value:47},{name:"理科",value:45}]},
    {name:"浙江",value:[{name:"文科",value:57},{name:"理科",value:57}]},
    {name:"安徽",value:[{name:"文科",value:57},{name:"理科",value:52}]},
    {name:"福建",value:[{name:"文科",value:59},{name:"理科",value:57}]},
    {name:"江西",value:[{name:"文科",value:49},{name:"理科",value:42}]},
    {name:"山东",value:[{name:"文科",value:67},{name:"理科",value:52}]},
    {name:"河南",value:[{name:"文科",value:69},{name:"理科",value:68}]},
    {name:"湖北",value:[{name:"文科",value:60},{name:"理科",value:56}]},
    {name:"湖南",value:[{name:"文科",value:62},{name:"理科",value:52}]},
    {name:"重庆",value:[{name:"文科",value:47},{name:"理科",value:44}]},
    {name:"四川",value:[{name:"文科",value:65},{name:"理科",value:60}]},
    {name:"贵州",value:[{name:"文科",value:32},{name:"理科",value:30}]},
    {name:"云南",value:[{name:"文科",value:42},{name:"理科",value:41}]},
    {name:"西藏",value:[{name:"文科",value:5},{name:"理科",value:4}]},
    {name:"陕西",value:[{name:"文科",value:38},{name:"理科",value:42}]},
    {name:"甘肃",value:[{name:"文科",value:28},{name:"理科",value:28}]},
    {name:"青海",value:[{name:"文科",value:5},{name:"理科",value:5}]},
    {name:"宁夏",value:[{name:"文科",value:10},{name:"理科",value:8}]},
    {name:"新疆",value:[{name:"文科",value:36},{name:"理科",value:31}]},
    {name:"广东",value:[{name:"文科",value:63},{name:"理科",value:60}]},
    {name:"广西",value:[{name:"文科",value:29},{name:"理科",value:30}]},
    {name:"海南",value:[{name:"文科",value:8},{name:"理科",value:6}]},
]

export default {
  name: 'AnalysisLawyerMapPage',
  data() {
    return {
      lawyerLayoutStatData: {}, // 律师分布统计数据
      bestLawyerLayoutStatData: {}, // 优选律师分布统计数据
    }
  },
  created() {
  },
  mounted() {
    this._getLawyerLayoutStatData()
    this._getBestLawyerLayoutStatData()
  },
  methods: {
    /**
     * 获取律师分布统计数据
     */
     async _getLawyerLayoutStatData() {
      const param = { type: 1 }

       try {
         const { data: lawyerLayoutStatData } = await statisticalApi.getLawyerLayoutStatDataApi(param)
         this.lawyerLayoutStatData = lawyerLayoutStatData
         this._setLawyerMapEcharts()
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取优选律师分布统计数据
     */
     async _getBestLawyerLayoutStatData() {
      const param = { type: 2 }
       try {
         const { data: bestLawyerLayoutStatData } = await statisticalApi.getLawyerLayoutStatDataApi(param)
         this.bestLawyerLayoutStatData = bestLawyerLayoutStatData
         this._setLawyerBestMapEcharts()
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 设置律师分布地图 echarts
     */
    _setLawyerMapEcharts() {
      const lawyerMapChart = echarts.init(this.$refs.lawyerEchartsMap)
      // 律师省份分布数据
      const lawyerProvinceData = this.lawyerLayoutStatData.province_data.map(item => ({ ...item }))
      // 律师城市分布数据
      const lawyerProvinceToolTipData = this.lawyerLayoutStatData.toolTipData
      lawyerMapChart.showLoading()

      const lawyerMapOption = {
        title: { text: '律师分布-地图' },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (typeof(params.value)[2] == "undefined") {
              var toolTiphtml = ''
              for(var i = 0; i < lawyerProvinceToolTipData.length; i++) {
                if (params.name == lawyerProvinceToolTipData[i].name) {
                  toolTiphtml += lawyerProvinceToolTipData[i].name + '<br>'
                  for (var j = 0; j < lawyerProvinceToolTipData[i].children.length; j++) {
                    toolTiphtml += lawyerProvinceToolTipData[i].children[j].name + '：' + lawyerProvinceToolTipData[i].children[j].value + "位律师<br>"
                  }
                }
              }

              return toolTiphtml
            } else {
              var toolTiphtml = ''
              for(var i = 0; i< lawyerProvinceToolTipData.length; i++){
                if (params.name == lawyerProvinceToolTipData[i].name) {
                  toolTiphtml += lawyerProvinceToolTipData[i].name + '<br>'
                  for (var j = 0; j < lawyerProvinceToolTipData[i].children.length; j++) {
                    toolTiphtml += lawyerProvinceToolTipData[i].children[j].name + '：' + lawyerProvinceToolTipData[i].children[j].value + " 位律师<br>"
                  }
                }
              }
              
              return toolTiphtml
            }
          }
        },
        //左侧小导航图标
        visualMap: {
          show: true,
          x: 'left',
          y: 'center',
          min: 0, // 最小值
          max: 300, // 最大值
          text: ['300', '0'],
          realtime: true,
          calculable: false,
          // seriesIndex: [1],
          inRange: {
            color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#2a99f4', '#41b583'] // 蓝绿
          },
        },
        geo: {
          map: 'china',
          name: '律师分布',
          roam: true, // 拖动缩放
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
            }
          },
          layoutCenter: ['50%', '50%'],
          layoutSize: '100%',
          scaleLimit: {
            min: 1,
            max: 3
          },
          itemStyle: {
            normal: {
              borderColor: '#3B5077',
            },
            emphasis: {
              areaColor: '#2B91B7',
            }
          }
        },
        series: [
          {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            // symbolSize: function(val) {
            //   return val[2] / 10
            // },
            symbolSize: 6,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#05C3F9'
              }
            },
            data: lawyerProvinceData,
          },
          {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', // 气泡
            symbolSize: 50,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 10,
                },
                formatter (value) {
                  return value.data.value[2]
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#F62157', //标志颜色
              }
            },
            zlevel: 6,
            data: lawyerProvinceData.filter(item => item.value[2] > 0),
          },
          {
            name: '前五名',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            // symbolSize: function(val) {
            //   return val[2] / 10
            // },
            symbolSize: 15,
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#9dddff',
                shadowBlur: 10,
                shadowColor: 'yellow'
              }
            },
            zlevel: 1,
            data: lawyerProvinceData.filter(item => item.value[2] > 0).sort(function(a, b) {
              return b.value[2] - a.value[2]
            }).slice(0, 5),
          },
          // {
          //   type: 'map',
          //   map: 'china',
          //   geoIndex: 0,
          //   aspectScale: 0.75, //长宽比
          //   showLegendSymbol: false, // 存在legend时显示
          //   label: {
          //     normal: {
          //       show: true
          //     },
          //     emphasis: {
          //       show: false,
          //       textStyle: {
          //         color: '#fff'
          //       }
          //     }
          //   },
          //   roam: true,
          //   itemStyle: {
          //     normal: {
          //       areaColor: '#031525',
          //       borderColor: '#3B5077',
          //     },
          //     emphasis: {
          //       areaColor: '#2B91B7'
          //     }
          //   },
          //   animation: false,
          //   // data: mapDataList
          //   data: this.lawyerLayoutStatData.province_data,
          // },
        ]
      }

      // 绘制地图图表
      lawyerMapChart.setOption(lawyerMapOption)
      lawyerMapChart.hideLoading()
    },
    /**
     * 设置优选律师分布地图 echarts
     */
    _setLawyerBestMapEcharts() {
      const bestLawyerMapChart = echarts.init(this.$refs.lawyerBestEchartsMap)
      // 律师省份分布数据
      const lawyerProvinceData = this.bestLawyerLayoutStatData.province_data.map(item => ({ ...item }))
      // 律师城市分布数据
      const lawyerProvinceToolTipData = this.bestLawyerLayoutStatData.toolTipData

      bestLawyerMapChart.showLoading()
      const bestLawyerMapOption = {
        title: { text: '优选律师分布-地图' },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (typeof(params.value)[2] == "undefined") {
              var toolTiphtml = ''
              for(var i = 0; i < lawyerProvinceToolTipData.length; i++) {
                if (params.name == lawyerProvinceToolTipData[i].name) {
                  toolTiphtml += lawyerProvinceToolTipData[i].name + '<br>'
                  for (var j = 0; j < lawyerProvinceToolTipData[i].children.length; j++) {
                    toolTiphtml += lawyerProvinceToolTipData[i].children[j].name + '：' + lawyerProvinceToolTipData[i].children[j].value + " 位优选律师<br>"
                  }
                }
              }
              console.log(toolTiphtml)
              return toolTiphtml
            } else {
              var toolTiphtml = ''
              for(var i = 0; i< lawyerProvinceToolTipData.length; i++){
                if (params.name == lawyerProvinceToolTipData[i].name) {
                  toolTiphtml += lawyerProvinceToolTipData[i].name + '<br>'
                  for (var j = 0; j < lawyerProvinceToolTipData[i].children.length; j++) {
                    toolTiphtml += lawyerProvinceToolTipData[i].children[j].name + '：' + lawyerProvinceToolTipData[i].children[j].value + " 位优选律师<br>"
                  }
                }
              }
              console.log(toolTiphtml)
              return toolTiphtml
            }
          }
        },
        //左侧小导航图标
        visualMap: {
          show: true,
          x: 'left',
          y: 'center',
          min: 0, // 最小值
          max: 50, // 最大值
          text: ['50', '0'],
          realtime: true,
          calculable: false,
          // seriesIndex: [1],
          inRange: {
            color: ['#2a99f4', '#41b583']
          },
        },
        geo: {
          map: 'china',
          name: '律师分布地图',
          roam: true, // 拖动缩放
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
            }
          },
          layoutCenter: ['50%', '50%'],
          layoutSize: '100%',
          scaleLimit: {
            min: 1,
            max: 3
          },
          itemStyle: {
            normal: {
              borderColor: '#3B5077',
            },
            emphasis: {
              areaColor: '#2B91B7',
            }
          }
        },
        series: [
          {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            // symbolSize: function(val) {
            //   return val[2] / 10
            // },
            symbolSize: 6,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#05C3F9'
              }
            },
            data: lawyerProvinceData,
          },
          {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', // 气泡
            symbolSize: 50,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 10,
                },
                formatter (value){
                  return value.data.value[2]
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#F62157', //标志颜色
              }
            },
            zlevel: 6,
            data: lawyerProvinceData.filter(item => item.value[2] > 0),
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            // symbolSize: function(val) {
            //   return val[2] / 10
            // },
            symbolSize: 15,
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                }
            },
            itemStyle: {
                normal: {
                  color: '#9190f6',
                  shadowBlur: 10,
                  shadowColor: '#6954f0'
                }
            },
            zlevel: 1,
            data: lawyerProvinceData.filter(item => item.value[2] > 0).sort(function(a, b) {
              return b.value[2] - a.value[2]
            }).slice(0, 5),
          },
        ]
      }

      // 绘制图表
      bestLawyerMapChart.setOption(bestLawyerMapOption)
      bestLawyerMapChart.hideLoading()
    },
  }
}
</script>

<style lang="less" scoped>
  .echarts-map {
    width: 70%;
    height: 900px;
  }
</style>
