<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :sm="24" :md="24" :xl="24">
        <a-card :bordered="false" :loading="loading">
          <a-col :span="24">
            <a-col :span="5">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: center">
                <h6 style="margin: 0px; padding-right: 10px">每日律师活跃数据</h6>
                <div><a-icon type="sync" @click="getdataagain" :spin="iconloading" /></div>
              </div>
            </a-col>

            <a-col :span="6" :offset="13">
              <a-date-picker
                :format="dateFormat"
                :default-value="moment().format('YYYY-MM-DD')"
                @change="onchange"
                :allowClear="false"
              />
            </a-col>
          </a-col>
          <a-col :span="6" style="margin: 0px; padding: 0" v-for="(index, key) in wzlawyerdata" :key="key">
            <a-card :bordered="false">
              <div style="display: flex; justify-content: space-between">
                <p style="font-size: 15px; margin: 0px">{{ index.title }}</p>
                <!-- <a v-if="i === 1" href="#"> 导入</a> -->
              </div>
              <p style="font-size: 30px; margin: 0px">{{ index.value }}</p>
            </a-card>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card :loading="loading">
          <a-col :span="24">
            <a-col :span="6">
              <h6><b>律师总活跃：</b>{{ allnumber }}人</h6>
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
            <div ref="zhexianmianjitu1" style="width: 100%; height: 400px"></div>
            <router-link :to="{ name: 'AnalysisUser', path: '/dashboard/AnalysisUser' }">
              <a-button> <a-icon type="swap" />切换至用户数据 </a-button>
            </router-link>
          </a-col>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { getLawyerDataPage, getLawyerRelatedDate, getLawyerActiveDataPage } from '@/api/statistical'
import * as echarts from 'echarts'
import moment from 'moment'
export default {
  data() {
    return {
      loading: true,
      dateFormat: 'YYYY-MM-DD',
      lawyerData: [],
      dataechartsX: [],
      dataechartsY: [],
      allnumber: [],
      iconloading: false,
      choosetime: '',
    }
  },
  computed: {
    wzlawyerdata() {
      if (this.lawyerData.length !== 0) {
        return [
          { title: '浏览人数', value: this.lawyerData.lawyer_question_view_number.number },
          { title: '私聊人数', value: this.lawyerData.lawyer_im_number.number },
          { title: '回帖人数', value: this.lawyerData.lawyer_question_commenter_number.number },
          { title: '接听人数', value: this.lawyerData.lawyer_recv_phone_number.number },
          { title: '认证律师(人)', value: this.lawyerData.lawyer_auth_number.number },
          { title: '升级优选律师(人)', value: this.lawyerData.lawyer_better_number.number },
          { title: '缴纳保证金(元)', value: this.lawyerData.lawyer_guarantee_money.number },
          { title: '回复过私聊(人)', value: this.lawyerData.lawyer_use_im_number.number },
          { title: '总金额(元)', value: this.lawyerData.total_money.number },
        ]
      } else {
        return [
          {
            title: '',
            value: 0,
          },
        ]
      }
    },
  },
  methods: {
    moment,
    getlawyerData(date) {
      getLawyerRelatedDate(date)
        .then(({ data }) => {
          this.lawyerData = data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.iconloading = false
          this.loading = false
        })
    },
    onchange(value, time) {
      this.choosetime = time
      this.getlawyerData(time)
    },
    onchange1(value, time) {
      this.getlawyeractive(time)
      this.myEcharts()
    },
    getlawyeractive(date) {
      getLawyerActiveDataPage(date).then((data) => {
        let number = 0
        this.dataechartsX = []
        this.dataechartsY = []
        for (let i = 0; i < data.data.hours.length; i++) {
          this.dataechartsX.push(data.data.hours[i].created_at)
          this.dataechartsY.push(data.data.hours[i].lawyer_active_number)
          number = number + Number(data.data.hours[i].lawyer_active_number)
        }
        this.allnumber = number
        this.myEcharts()
      })
    },
    /**
     * 活跃律师 折线图
     */
    myEcharts() {
      var myChart
      if (myChart !== null && myChart !== '' && myChart !== undefined) {
        myChart.dispose()
      }
      this.$nextTick(() => {
        myChart = echarts.init(this.$refs.zhexianmianjitu1)
        option && myChart.setOption(option)
      })
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
          data: ['活跃律师'],
          left: '3%',
        },
        tooltip: {
          trigger: 'axis',
        },
        series: [
          {
            name: '活跃律师',
            data: this.dataechartsY,
            type: 'line',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#5C90F9',
                  },
                  {
                    offset: 1,
                    color: '#fff',
                  },
                ]),
              },
            },
          },
        ],
      }
      myChart = null
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    getdataagain() {
      this.iconloading = true
      this.getlawyerData(this.choosetime)
    },
  },
  created() {
    this.getlawyerData(moment().format('YYYY-MM-DD'))
  },
  mounted() {
    const time = moment().format('YYYY-MM-DD')
    this.choosetime = time
    setTimeout(() => {
      this.getlawyeractive(time)
    }, 500)
  },
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/default.less';
</style>
