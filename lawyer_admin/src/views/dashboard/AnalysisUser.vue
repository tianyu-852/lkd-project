<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="18">
        <a-card :bordered="false" :loading="loading">
          <a-col :span="24">
            <a-col :span="7">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: center">
                <h6 style="margin: 0px; padding-right: 10px">每日用户活跃数据</h6>
                <div><a-icon type="sync" @click="getdataagain" :spin="iconloading" /></div>
              </div>
            </a-col>
            <a-col :span="6" :offset="11">
              <a-date-picker
                :format="dateFormat"
                :default-value="moment().format('YYYY-MM-DD')"
                @change="onchange"
                :allowClear="false"
              />
            </a-col>
          </a-col>
          <a-col :span="6" style="margin: 0px; padding: 0" v-for="(index, key) in wzorderdata" :key="key">
            <a-card :bordered="false">
              <p style="font-size: 15px; margin: 0px">{{ index.title }}</p>
              <p style="font-size: 30px; margin: 0px">{{ index.value.number }}</p>
              <div style="font-size: 14px">
                同比昨日：
                <span v-if="index.value.ratio.direction === 1" style="color: red">
                  {{ index.value.ratio.ratio }}% <a-icon type="caret-up" theme="filled" style="color: red" />
                </span>
                <span v-else-if="index.value.ratio.direction === -1" style="color: green">
                  {{ index.value.ratio.ratio }}% <a-icon type="caret-down" theme="filled" style="color: green" />
                </span>
                <span v-else style="color: black">相同</span>
              </div>
            </a-card>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <div>
            <h6 style="margin: 0">
              <b>收费 </b>
              <a-date-picker
                :format="dateFormat"
                :default-value="moment().format('YYYY-MM-DD')"
                size="small"
                style="width: 110px; margin: 0"
                @change="getUserAgain"
                :allowClear="false"
              />
            </h6>
          </div>
          <div
            ref="huanzhuangtu"
            style="
              width: 90%;
              height: 299px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            "
          ></div>
          <span style="margin-left: calc(50% - 50px); color: #f78c6b"> 总收费：{{ allmoney }}</span>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card :loading="loading">
          <a-col :span="24">
            <a-col :span="6">
              <h6><b>用户总活跃：</b>{{ allnumber }}人</h6>
            </a-col>
            <a-col :span="5" :offset="12">
              <a-date-picker
                :format="dateFormat"
                :default-value="moment().format('YYYY-MM-DD')"
                @change="onchange1"
                :allowClear="false"
              />
            </a-col>
          </a-col>
          <a-col :span="24">
            <div ref="zhexianmianjitu" style="width: 100%; height: 400px"></div>
            <router-link :to="{ name: 'AnalysisLawyer', path: '/dashboard/AnalysisLawyer' }">
              <a-button> <a-icon type="swap" />切换至律师数据</a-button>
            </router-link>
          </a-col>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getOrderDataPage, getUserRelatedDate, getUserActiveDataPage, getChargeOrderData } from '@/api/statistical'
import * as echarts from 'echarts'
import moment from 'moment'
export default {
  data() {
    return {
      loading: true,
      dateFormat: 'YYYY-MM-DD',
      date: '',
      listData: [
        {
          title: '',
          value: {
            number: 0,
            ratio: {
              direction: 0,
              ratio: 0,
            },
          },
        },
      ],
      orderData: [],
      dataechartsX: [],
      dataechartsY: [],
      allnumber: [],
      iconloading: false,
      choosetime: '',
      userRingData: [
        { value: 100, name: '深度咨询', number: 0 },
        { value: 400, name: '合同文书', number: 0 },
        { value: 300, name: '诉讼委托', number: 0 },
        { value: 200, name: '见面咨询', number: 0 },
      ],
    }
  },
  computed: {
    allmoney() {
      let money = 0
      for (let i = 0; i < this.userRingData.length; i++) {
        money = money + Number(this.userRingData[i].value)
      }
      return money.toFixed(2)
    },

    wzorderdata() {
      if (this.orderData.length !== 0) {
        return [
          { title: '发帖数量', value: this.orderData.user_questioner_number },
          { title: '私聊人数', value: this.orderData.user_im_number },
          { title: '回复人数', value: this.orderData.user_question_commenter_number },
          { title: '电话咨询人数', value: this.orderData.user_call_phone_number },
          // { title: '深度咨询(人)', value: this.orderData.lawyer_charge_call_phone_number },
          { title: '合同文书(人)', value: this.orderData.lawyer_charge_contract_number },
          { title: '诉讼委托(人)', value: this.orderData.lawyer_charge_litigation_number },
          // { title: '见面咨询(人)', value: this.orderData.lawyer_charge_meet_number },
          { title: '发送过私聊(人)', value: this.orderData.user_use_im_number },
        ]
      } else {
        return [
          {
            title: '',
            value: {
              number: 0,
              ratio: {
                direction: 0,
                ratio: 0,
              },
            },
          },
        ]
      }
    },
  },
  methods: {
    moment,
    getOrderData(date) {
      getUserRelatedDate(date)
        .then(({ data }) => {
          this.orderData = data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.iconloading = false
          this.loading = false
        })
      getChargeOrderData(date).then((data) => {
        this.userRingData[0].value = data.data.charge_call_phone_money
        this.userRingData[0].number = data.data.charge_call_phone_number
        this.userRingData[1].value = data.data.charge_meet_money
        this.userRingData[1].number = data.data.charge_meet_number
        this.userRingData[2].value = data.data.charge_litigation_money
        this.userRingData[2].number = data.data.charge_litigation_number
        this.userRingData[3].value = data.data.charge_contract_money
        this.userRingData[3].number = data.data.charge_contract_number
      })
    },
    onchange(value, time) {
      this.choosetime = time
      this.getOrderData(time)
    },
    onchange1(value, time) {
      this.getOrderactive(time)
    },
    getOrderactive(date) {
      getUserActiveDataPage(date).then((data) => {
        let number = 0
        this.dataechartsX = []
        this.dataechartsY = []
        for (let i = 0; i < data.data.hours.length; i++) {
          this.dataechartsX.push(data.data.hours[i].created_at)
          this.dataechartsY.push(data.data.hours[i].user_active_number)
          number = number + Number(data.data.hours[i].user_active_number)
        }
        this.allnumber = number
        this.myEcharts()
        this.myEcharts3()
      })
    },
    myEcharts() {
      var myChart
      if (myChart !== null && myChart !== '' && myChart !== undefined) {
        myChart.dispose()
      }
      myChart = echarts.init(this.$refs.zhexianmianjitu)
      var option

      option = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dataechartsX,
        },
        yAxis: {
          type: 'value',
        },
        legend: {
          data: ['活跃用户'],
          left: '3%',
        },
        tooltip: {
          trigger: 'axis',
        },
        series: [
          {
            name: '活跃用户',
            data: this.dataechartsY,
            type: 'line',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#73DEB3',
                  },
                  {
                    offset: 1,
                    color: '#fff',
                  },
                ]),
              },
            },
            lineStyle: {
              color: '#73DEB3',
            },
            itemStyle: {
              color: '#73DEB3',
            },
          },
        ],
      }

      option && myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    getdataagain() {
      this.iconloading = true
      this.getOrderData(this.choosetime)
    },

    myEcharts3() {
      var myChart3 = echarts.init(this.$refs.huanzhuangtu)
      var option3
      option3 = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '65%',
          orient: 'vertical',
          left: '10%',
          data: ['深度咨询', '合同文书', '诉讼委托', '见面咨询'],
          formatter: function (name) {
            var data = option3.series[0].data
            var total = 0
            var tarValue
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) {
                tarValue = data[i].number
              }
            }
            var p = (tarValue / total) * 100
            return name + ' ' + tarValue + '人'
          },
        },
        series: [
          {
            name: '付费途径',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            bottom: '40%',
            label: {
              show: false,
              position: 'center',
            },
            data: this.userRingData,
          },
        ],
      }
      option3 && myChart3.setOption(option3)
      window.addEventListener('resize', function () {
        myChart3.resize()
      })
    },
    getUserAgain(value, time) {
      getChargeOrderData(time).then((data) => {
        this.userRingData[0].value = data.data.charge_call_phone_money
        this.userRingData[0].number = data.data.charge_call_phone_number
        this.userRingData[1].value = data.data.charge_meet_money
        this.userRingData[1].number = data.data.charge_meet_number
        this.userRingData[2].value = data.data.charge_litigation_money
        this.userRingData[2].number = data.data.charge_litigation_number
        this.userRingData[3].value = data.data.charge_contract_money
        this.userRingData[3].number = data.data.charge_contract_number
        this.myEcharts3()
      })
      console.log('刷新数据，重新画圆', time)
    },
  },
  created() {
    this.getOrderData(moment().format('YYYY-MM-DD'))
  },
  mounted() {
    const time = moment().format('YYYY-MM-DD')
    this.choosetime = time
    this.$nextTick(() => {
      setTimeout(() => {
        this.getOrderactive(time)
      }, 500)
    })
  },
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/default.less';
</style>
