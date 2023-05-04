<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">协议列表：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="$router.push({ name: 'AppProtocolEdit' })">新增协议</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="getAppProtocolList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.agreement_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="agreement_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="创建时间" align="center" />

        <!-- 协议标识 -->
        <a-table-column dataIndex="name" title="协议标识" align="center" />

        <!-- 协议标题 -->
        <a-table-column dataIndex="title" title="协议标题" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="margin-right: 0px" @click="navToPortocolEdit(record)">编辑</a-button>
          </template>
        </a-table-column>
      </a-table>

      <div ref="mainBar" class="echarts-div" />

      <div ref="echartsMap" class="echarts-map" />

      <div ref="orderEchartsLineRef" class="echarts-div" style="width: 1000px;" />
    </a-card>
  </a-layout>
</template>

<script>
import * as appApi from '@/api/app'
import * as echarts from 'echarts'
import chinaMapJson from "@/lib/china-map.json"
import * as statisticalApi from '@/api/statistical'
import moment from 'moment'

// 注册地图
echarts.registerMap('china', chinaMapJson)

const provinceData = [
  { name: '北京', value: [116.40, 39.90, 110] },
  { name: '河北', value: [114.502461, 38.045474, 110] },
  { name: '山西', value: [112.304436, 37.618179, 110] },
  { name: '内蒙古', value: [114.077429, 44.331087, 110] },
  { name: '辽宁', value: [123.429096, 41.796767, 110] },
  { name: '江苏', value: [119.486506, 32.983991, 110] },
  { name: '山东', value: [118.187759, 36.376092, 110] },

  { name: '上海', value: [121.47, 31.23, 55] },
  { name: '浙江', value: [120.109913, 29.181466, 200], },
  { name: '江西', value: [115.892151, 28.676493, 100], },
  { name: '河南', value: [113.619717, 33.902648, 100], },
  { name: '湖北', value: [114.298572, 30.584355, 100], },
  { name: '湖南', value: [111.711649, 27.629216, 100], },
  { name: '广东', value: [113.280637, 23.125178, 100], },
  { name: '安徽', value: [117.283042, 31.86119, 300], },
  { name: '四川', value: [102.693453, 30.674545, 32] },
  { name: '重庆', value: [107.8839, 30.067297, 32] },
  { name: '贵州', value: [106.880455, 26.826368, 250], },
]

const toolTipData = [
  { name: '北京', value:[{ name: '北京', value: 95 }]},
  { name: '上海', value:[{ name: '上海', value: 80 }]},
  { name: '浙江', value:[{ name: '杭州', value: 99 }, { name: '温州', value: 30 }, { name: '宁波', value: 20 }]},
  { name: '四川', value:[{ name: '成都', value: 66 }, { name: '广元', value: 54 }]},
]

export default {
  name: 'AppProtocolPage',
  data() {
    return {
      tabelDataList: [], // 列表
      tabelDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this.getAppProtocolList(page)
          this.pagination.current = page
        },
      },

      // dailyOrderStatData: [], // 每日订单统计数据
      dailyOrderStatData: {
        xAxisData: [],
        yAxisData: [],
      }
    }
  },
  created() {
    this.getAppProtocolList()
  },
  mounted() {
    // this._setBarLineEcharts()
    // this._setChinaMapEcharts()
    // this._setOrderLineEcharts()
  },
  methods: {
    /**
     * 设置中国地图 echarts
     */
    _setChinaMapEcharts() {
      const chinaMapChart = echarts.init(this.$refs.echartsMap)
      const maxSize4Pin = 20
      const minSize4Pin = 5
      const max = 400
      const min = 9

      const chinaMapOption = {
        // 标题组件
        title: { text: '律师分布地图', left: 'center' },
        // 本坐标系特定的 tooltip 设定
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (typeof(params.value)[2] == "undefined") {
                var toolTiphtml = ''
                for(var i = 0;i<toolTipData.length;i++){
                    if(params.name==toolTipData[i].name){
                        toolTiphtml += toolTipData[i].name+':<br />'
                        for(var j = 0;j<toolTipData[i].value.length;j++){
                            toolTiphtml+=toolTipData[i].value[j].name+'：'+toolTipData[i].value[j].value + "位律师<br>"
                        }
                    }
                }
                console.log(toolTiphtml)
                // console.log(convertData(data))
                return toolTiphtml
            } else {
                var toolTiphtml = ''
                for(var i = 0;i<toolTipData.length;i++){
                    if(params.name==toolTipData[i].name){
                        toolTiphtml += toolTipData[i].name+'<br>'
                        for(var j = 0;j<toolTipData[i].value.length;j++){
                            toolTiphtml+=toolTipData[i].value[j].name+'：'+toolTipData[i].value[j].value + " 位律师<br>"
                        }
                    }
                }
                console.log(toolTiphtml)
                // console.log(convertData(data))
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
            // color: ['#afe7ff', '#1a90ff'] // 左边导航条的渐变颜色
            color: ['#00467F', '#A5CC82'] // 蓝绿
          },
          textStyle: {
            color: "#000"
          }
        },
        geo: {
          map: 'china',
          name: '中国地图',
          roam: true, // 拖动缩放
          // label: { show:true },
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
            }
          },
          scaleLimit: {
            min: .5,
            max: 3
          },
          itemStyle: { // 定义样式
            // normal: {
            //   // areaColor: '#FFF5EE',
            //   areaColor: '#fff',
            //   // borderColor: '#000'
            // },
            // emphasis: { // 高亮状态下的样式
            //   areaColor: '#6ac0ff'
            //   // areaColor: '#6ac0ff'
            // }
            normal: {
                // areaColor: '#031525',
                borderColor: '#3B5077',
            },
            emphasis: {
                areaColor: '#2B91B7',
            }
          }
        },
        // 配置属性
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
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
            data: provinceData
          },
          {
            type: 'map',
            map: 'china',
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
                  normal: {
                      show: false
                  },
                  emphasis: {
                      show: false,
                      textStyle: {
                          color: '#fff'
                      }
                  }
              },
              itemStyle: {
                  normal: {
                      // areaColor: '#031525',
                      areaColor: '#B2CAE0',
                      borderColor: '#3B5077',
                  },
                  emphasis: {
                      // areaColor: '#2B91B7'
                      areaColor: '#FFAE00',
                  }
              },
              animation: false,
              data: provinceData
          },
          {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', // 气泡
            // symbolSize: function(val) {
            //     var a = (maxSize4Pin - minSize4Pin) / (max - min)
            //     var b = minSize4Pin - a * min
            //     b = maxSize4Pin - a * max
            //     return a * val[2] + b
            // },
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
            // data: provinceData.slice(0, 2)
            data: provinceData
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: provinceData.sort(function(a, b) {
                return b.value[2] - a.value[2]
            }).slice(0, 5),
            symbolSize: function(val) {
                return val[2] / 10
            },
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
            // zlevel: 3
        },
        ]
      }

      // 绘制图表
      chinaMapChart.setOption(chinaMapOption)
    },
    /**
     * 设置条形图 echarts
     */
    _setBarLineEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const barChart = echarts.init(this.$refs.mainBar)
      barChart.showLoading()
      const barOption = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          name: '轴名称',
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
      barChart.setOption(barOption)
      barChart.hideLoading()
    },
    /**
     * 设置订单折线图 echarts
     */
    _setOrderLineEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const orderLineChart = echarts.init(this.$refs.orderEchartsLineRef)
      orderLineChart.showLoading()
      // 绘制图表
      const barOption = {
        title: { text: '每小时订单数据' },
        tooltip: { trigger: 'axis', },
        legend: { data: ['订单数据图'], left: 'left', },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dailyOrderStatData.xAxisData
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '每日发单',
            type: 'line',
            data: [1, 20, 3, 4, 5, 6, 7, 8, 9, 10, 44, 66, 23, 8, 2, 40, 88, 99, 0, 12, 5, 22, 45, 66],
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#6954f0',
                  },
                  {
                    offset: 1,
                    color: '#fff',
                  },
                ]),
              },
            },
            lineStyle: { color: '#6954f0', },
            itemStyle: { color: '#6954f0', },
          }
        ]
      }
      orderLineChart.setOption(barOption)
      orderLineChart.hideLoading()
    },
    /**
     * 获取 app 协议列表
     */
     async getAppProtocolList(page = 1) {
      const param = { page }
      this.tabelDataLoading = true

       try {
         const { data: appProtocolData } = await appApi.getAppProtocolListApi(param)
         this.tabelDataList = appProtocolData.data
         this.pagination.total = appProtocolData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 进入订单详情
     */
    navToPortocolEdit(record) {
      const protocolId = String(record.agreement_id)
      this.$router.push({ name: 'AppProtocolEdit', query: { protocolId } })
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
}

.label-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}

.echarts-div {
  width: 600px;
  height: 600px;
}
.echarts-map {
  width: 1200px;
  height: 1400px;
}
</style>
