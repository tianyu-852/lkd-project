<template>
  <div>
    <a-row :gutter="[8, 16]">
      <a-col :xl="18" :lg="24" :md="24" :sm="24">
        <!-- 律师认证 -->
        <a-col :span="24">
          <a-card :bordered="false" :loading="state.loading">
            <a-col :span="24" style="margin: 0px; padding: 0">
              <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 4px">
                <h6 style="margin: 0px; padding-right: 10px">律师认证</h6>
                <div><a-icon type="sync" @click="getdataagain(0)" :spin="state.iconLoading0" /></div>
              </div>
            </a-col>
            <a-col :span="6" style="margin: 0px; padding: 0" v-for="(index, key, i) in lawyerData" :key="key">
              <a-card :bordered="false">
                <div style="display: flex; justify-content: space-between">
                  <p style="font-size: 15px; margin: 0px 0px 12px 0px">{{ wzlawyerdata[i] }}</p>
                  <!-- <a v-if="i === 1" href="#"> 导入</a> -->
                </div>
                <p style="font-size: 30px; margin: 0px">{{ index }}</p>
              </a-card>
            </a-col>
          </a-card>
        </a-col>
        
        <!-- 订单统计 -->
        <a-col :span="24">
          <a-card :bordered="false" :loading="state.loading">
            <a-col :span="24" style="margin: 0px; padding: 0">
              <div style="display: flex; flex-direction: row; align-items: center">
                <h6 style="margin: 0px; padding-right: 10px">订单统计</h6>
                <div><a-icon type="sync" @click="getdataagain(1)" :spin="state.iconLoading1" /></div>

                <a-date-picker
                  format="YYYY-MM-DD"
                  :default-value="orderTimeFactorInfo.curDate"
                  style="width: 130px; margin-left: auto;"
                  @change="onOrderDatePickerChange"
                  :allowClear="false"
                />
              </div>
            </a-col>

            <a-col :span="6" style="margin: 0px; padding: 0" v-for="(oItem, oIndex) in orderDataList" :key="oIndex">
              <a-card :bordered="false">
                <p style="font-size: 15px;">{{ oItem.title }}</p>
                <p style="font-size: 30px;">{{ oItem.number }}</p>
                <div style="font-size: 14px display: flex; flex-direction: row; align-items: center">
                  同比昨日:
                  <span v-if="oItem.rate.direction === 1" style="color: red">
                    {{ oItem.rate.ratio }}% <a-icon type="caret-up" theme="filled" style="color: red" />
                  </span>
                  <span v-else-if="oItem.rate.direction === -1" style="color: green">
                    {{ oItem.rate.ratio }}% <a-icon type="caret-down" theme="filled" style="color: green" />
                  </span>
                  <span v-else style="color: black">相同</span>
                </div>
              </a-card>
            </a-col>
          </a-card>
        </a-col>

        <!-- 案源统计 -->
        <!-- <a-col :span="24">
          <a-card :bordered="false">
            <a-col :span="24" style="margin: 0px; padding: 0">
              <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 4px">
                <h6 style="margin: 0px; padding-right: 10px">案源匹配统计</h6>
                <div><a-icon type="sync" @click="_getDailyCaseSourceMatchStatData()" :spin="state.iconLoading0" /></div>
              </div>
            </a-col>

            <a-col :span="6" style="margin: 0px; padding: 0">
              <a-card :bordered="false">
                <div style="display: flex; justify-content: space-between">
                  <p style="font-size: 15px; margin: 0px 0px 12px 0px">今日电话需求订单数</p>
                </div>
                <p style="font-size: 30px; margin: 0px">{{ dailyCaseSourceMatchStatData.day_demand_num }}</p>
              </a-card>
            </a-col>
            <a-col :span="6" style="margin: 0px; padding: 0">
              <a-card :bordered="false">
                <div style="display: flex; justify-content: space-between">
                  <p style="font-size: 15px; margin: 0px 0px 12px 0px">今日发单人数量</p>
                </div>
                <p style="font-size: 30px; margin: 0px">{{ dailyCaseSourceMatchStatData.day_user_count }}</p>
              </a-card>
            </a-col>
            <a-col :span="6" style="margin: 0px; padding: 0">
              <a-card :bordered="false">
                <div style="display: flex; justify-content: space-between">
                  <p style="font-size: 15px; margin: 0px 0px 12px 0px">今日案源匹配数量</p>
                </div>
                <p style="font-size: 30px; margin: 0px">{{ dailyCaseSourceMatchStatData.today_source_match_num }}</p>
              </a-card>
            </a-col>
          </a-card>
        </a-col> -->
      </a-col>

      <a-col :xl="6" :lg="18" :md="24" :sm="24">
        <a-col v-show="state.ring" :span="24">
          <a-card :loading="state.loading">
            <div>
              <h6>
                <b>用户咨询 </b> <a-icon type="swap" @click="changeRing"></a-icon>
                <a-date-picker
                  :format="dateFormat"
                  :default-value="date"
                  :size="size"
                  style="width: 104px"
                  @change="getVipAgain"
                  :allowClear="false"
                />
              </h6>
            </div>
            <div
              ref="userRing"
              style="
                width: 100%;
                height: 330px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
              "
            ></div>
            <span style="margin-left: calc(50% - 50px); color: #f78c6b"> 总账单:{{ allUserMoney }}</span>
          </a-card>
        </a-col>
        <a-col v-show="!state.ring" :span="24">
          <a-card :loading="state.loading">
            <div>
              <h6>
                <b>律师咨询 </b> <a-icon type="swap" @click="changeRing"></a-icon>
                <a-date-picker
                  :format="dateFormat"
                  :default-value="date"
                  :size="size"
                  style="width: 104px"
                  @change="getLawyerAgain"
                  :allowClear="false" />
              </h6>
            </div>
            <div
              ref="lawyerRing"
              style="
                width: 200px;
                height: 330px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                margin-left: calc(50% - 100px);
              "
            ></div>
            <span style="margin-left: calc(50% - 50px); color: #f78c6b"> 总账单:{{ alllawyermoney }}</span>
          </a-card>
        </a-col>
      </a-col>
    </a-row>

    <!-- app 人数折线图 -->
    <a-row :gutter="[16, 16]">
      <a-col :xl="15" :lg="24">
        <a-card :loading="state.loading">
          <div>
            <a-col :span="10">
              <h6>
                <b>APP活跃人数 </b>
              </h6>
            </a-col>
            <a-col :span="10" :offset="4">
              <a-range-picker
                :format="dateFormat"
                :size="size"
                style="width: 200px"
                @change="getAppAgain"
                :default-value="dates"
                :allowClear="false"
              />
            </a-col>
          </div>
          <a-col :span="24">
            <div ref="zhexiantu" style="width: 90%; height: 400px"></div>
          </a-col>
        </a-card>
      </a-col>
      <a-col :xl="9" :lg="24">
        <a-card :loading="state.loading">
          <div>
            <a-col :span="9">
              <h6>
                <b>新增人数 </b>
              </h6>
            </a-col>
            <a-col :span="10">
              <a-range-picker
                :format="dateFormat"
                :size="size"
                style="width: 185px"
                @change="getAddUserAgain"
                :default-value="dates"
                :allowClear="false"
              />
            </a-col>
          </div>
          <a-col :span="24">
            <div ref="shuangzhutu" style="width: 90%; height: 400px"></div>
          </a-col>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 每日发单 折线图 -->
    <a-row :gutter="[16, 32]">
      <a-col :xl="24">
        <a-card :loading="state.loading">
          <div style="display: flex;">
            <a-date-picker
              format="YYYY-MM-DD"
              :default-value="dailyOrderTimeFactorInfo.curDate"
              style="width: 130px;"
              @change="onDailyOrderDatePickerChange"
              :allowClear="false"
            />
          </div>
          <a-col :span="24">
            <div ref="orderEchartsLineRef" style="width: 100%; height: 400px;" />
          </a-col>
        </a-card>
      </a-col>
    </a-row>
    <!-- 一周总收费折线图 -->
    <a-row :gutter="[16, 32]">
      <a-col :xl="24">
        <a-card :loading="state.loading">
          <div>
            <a-col :span="6" :offset="1">
              <h6>
                <b>一周总收费:{{ alltollnumber }}</b>
              </h6>
            </a-col>
            <a-col :span="6" :offset="11">
              <a-range-picker
                :format="dateFormat"
                :size="size"
                style="width: 200px"
                @change="getTollAgain"
                :default-value="dates"
                :allowClear="false"
              />
            </a-col>
          </div>
          <a-col :span="24">
            <div ref="danzhexian" style="width: 100%; height: 400px"></div>
          </a-col>
        </a-card>
      </a-col>
    </a-row>
    
    <a-modal
      v-model="state.payUserModal"
      title="付费用户列表"
      ok-text="确认"
      cancel-text="关闭"
      @ok="state.payUserModal = false"
      width="900px"
    >
      <a-input-group compact>
        <a-input-search placeholder="请输入手机号/用户名" />
      </a-input-group>
      <a-table bordered :pagination="pagination" :data-source="payUserData" :row-key="(record) => record.user_id">
        <a-table-column key="index" align="center" title="序号">
          <template slot-scope="record">
            {{ record.index }}
          </template>
        </a-table-column>
        <a-table-column key="nickname" title="名字">
          <template slot-scope="record">
            <a-avatar :size="26" icon="user" :src="record.avatar" />
            <label>{{ record.nickname }}</label>
          </template>
        </a-table-column>
        <a-table-column key="mobile" align="center" title="电话号码">
          <template slot-scope="record">
            {{ record.mobile }}
          </template>
        </a-table-column>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { getLawyerDataPage, getOrderDataPage, getAppActiveDataPage, getAddUserDataPage, getTollDataPage, getChargeOrderData, } from '@/api/statistical'
import * as statisticalApi from '@/api/statistical'
import JSONbig from 'json-bigint'
import * as echarts from 'echarts'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'AnalysisPage',
  mixins: [baseMixin],
  components: {},
  data() {
    return {
      state: {
        iconLoading0: false,
        iconLoading1: false,
        loading: true,
        ring: true,
        payUserModal: false,
      },
      payUserData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 8, // 默认每页显示数量
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
        onChange: (page) => {
          // this.getLawyerPage(page, this.search)
          this.pagination.current = page
        },
      },
      dateFormat: 'YYYY-MM-DD',
      startDate: '',
      endDate: '',
      alltollnumber: 0,
      date: moment().format('YYYY-MM-DD'),
      dates: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      size: 'small',
      wzlawyerdata: ['待审核律师', '预注册', '未登录认证', '已认证'],
      wzorderdata: ['总电话咨询(次)', '付费用户(人)', '接通量', '未接通'],
      lawyerData: [],

      orderDataList: [], // 下单统计
      orderTimeFactorInfo: { curDate: moment().format('YYYY-MM-DD'), },

      testtoll: [],
      userRingData: [
        { value: 0, name: '免费咨询', number: 0 },
        { value: 735, name: '深度咨询', number: 0 },
        { value: 580, name: '合同文书', number: 0 },
        { value: 484, name: '诉讼委托', number: 0 },
        { value: 484, name: '见面咨询', number: 0 },
      ],
      lawyerRingData: [
        { value: 735, name: '律师开通保障计划', number: 0 },
        { value: 580, name: '律师开通小铺', number: 0 },
      ],
      appData: {
        data: { user: [], lawyer: [] },
        x: [],
      },
      userData: {
        data: { user: [], lawyer: [] },
        x: [],
      },
      tollData: {
        x: [],
      },
      // 每日订单统计数据
      dailyOrderStatData: { xAxisData: [], yAxisData: [], },
      dailyOrderTimeFactorInfo: { curDate: moment().format('YYYY-MM-DD'), },
      // 案源匹配统计
      dailyCaseSourceMatchStatData: { day_demand_num: 0, day_user_count: 0, today_source_match_num: 0 }
    }
  },
  computed: {
    allUserMoney() {
      let money = 0
      for (let i = 0; i < this.userRingData.length; i++) {
        money = money + Number(this.userRingData[i].value)
      }
      return money.toFixed(2)
    },
    alllawyermoney() {
      let money = 0
      for (let i = 0; i < this.lawyerRingData.length; i++) {
        money = money + Number(this.lawyerRingData[i].value)
      }
      return money.toFixed(2)
    },
  },
  created() {
    this.getLawyerData()
    this.getOrderData()
    this._getDailyOrderStatData()
    // this._getDailyCaseSourceMatchStatData()
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.getChargeOrderData(moment().format('YYYY-MM-DD'))
        this.getAppActiveData(moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'))
        this.getAddUserData(moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'))
        this.getTollData(moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'))
      }, 500)
    })
  },
  methods: {
    myEcharts() {
      var myChart = echarts.init(this.$refs.zhexiantu)
      var option
      option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['活跃用户', '活跃律师'],
          left: '3%',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.appData.x,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '活跃用户',
            type: 'line',
            data: this.appData.data.user,
          },
          {
            name: '活跃律师',
            type: 'line',
            data: this.appData.data.lawyer,
          },
        ],
      }

      option && myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    myEcharts1() {
      var myChart1 = echarts.init(this.$refs.shuangzhutu)
      var option1

      option1 = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['新增用户', '新增律师'],
          left: '3%',
        },
        toolbox: {
          show: false,
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.userData.x,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '新增用户',
            type: 'bar',
            data: this.userData.data.user,
          },
          {
            name: '新增律师',
            type: 'bar',
            data: this.userData.data.lawyer,
          },
        ],
      }

      option1 && myChart1.setOption(option1)
      window.addEventListener('resize', function () {
        myChart1.resize()
      })
    },
    myEcharts2() {
      var myChart2 = echarts.init(this.$refs.danzhexian)
      var option2
      option2 = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            return (
              '日卡:' +
              params[0].data.day_vip_money +
              '&nbsp元' +
              '</br>' +
              '月卡:' +
              params[0].data.month_vip_money +
              '&nbsp元' +
              '</br>' +
              '季卡:' +
              params[0].data.quarterly_vip_money +
              '&nbsp元' +
              '</br>' +
              '年卡:' +
              params[0].data.year_vip_money +
              '&nbsp元' +
              '</br>' +
              '	案件分析总金额:' +
              params[0].data.lawyer_charge_call_phone_money +
              '&nbsp元' +
              '</br>' +
              '	合同文书总金额:' +
              params[0].data.lawyer_charge_contract_money +
              '&nbsp元' +
              '</br>' +
              '	诉讼委托总金额:' +
              params[0].data.lawyer_charge_litigation_money +
              '&nbsp元' +
              '</br>' +
              '	线下见面总金额:' +
              params[0].data.lawyer_charge_meet_money +
              '&nbsp元' +
              '</br>' +
              '	律师开通法律小铺收益:' +
              params[0].data.lawyer_enable_store_money +
              '&nbsp元' +
              '</br>' +
              '	律师开通保障计划收益:' +
              params[0].data.lawyer_guarantee_money +
              '&nbsp元' +
              '</br>' +
              '合计:' +
              params[0].data.value +
              '&nbsp元'
            )
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        legend: {
          data: ['一天(元)'],
          left: '3%',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.tollData.x,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '一天(元)',
            type: 'line',
            stack: '总量',
            data: this.testtoll,
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
      option2 && myChart2.setOption(option2)
      window.addEventListener('resize', function () {
        myChart2.resize()
      })
    },
    myEcharts3() {
      var myChart3 = echarts.init(this.$refs.userRing)
      var option3
      option3 = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          bottom: '30px',
          itemGap: 20,
          orient: 'horizontal',
          data: ['免费咨询', '深度咨询', '合同文书', '诉讼委托', '见面咨询'],
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
            return name + ' ' + tarValue + '人   '
          },
        },
        series: [
          {
            name: '咨询方式',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            bottom: '100px',
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
    myEcharts4() {
      var myChart4 = echarts.init(this.$refs.lawyerRing)
      var option4
      option4 = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          bottom: '30px',
          data: ['律师开通保障计划', '律师开通小铺'],
          formatter: function (name) {
            var data = option4.series[0].data
            var tarValue
            for (var i = 0, l = data.length; i < l; i++) {
              if (data[i].name === name) {
                tarValue = data[i].number
              }
            }

            return name + ' ' + tarValue + '人   '
          },
        },
        series: [
          {
            name: '付费途径',
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            bottom: '100px',
            label: {
              show: false,
              position: 'center',
            },
            data: this.lawyerRingData,
          },
        ],
      }
      option4 && myChart4.setOption(option4)
      window.addEventListener('resize', function () {
        myChart4.resize()
      })
    },

    getdataagain(n) {
      if (n === 0) {
        this.state.iconLoading0 = true
        this.getLawyerData()
      } else {
        this.state.iconLoading1 = true
        this.getOrderData()
      }
    },
    moment,
    getLawyerAgain(value, time) {
      this.getChargeOrderData(time)
    },
    getVipAgain(value, time) {
      this.getChargeOrderData(time)
    },
    getAppAgain(value, time) {
      this.getAppActiveData(time[0], time[1])
    },
    getAddUserAgain(value, time) {
      this.getAddUserData(time[0], time[1])
    },
    getTollAgain(value, time) {
      this.getTollData(time[0], time[1])
    },
    // 获取律师审核数据
    getLawyerData() {
      getLawyerDataPage()
        .then(({ data }) => {
          this.lawyerData = data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.state.loading = false
          this.state.iconLoading0 = false
        })
    },
    /**
     * 监听每日发单 DatePicker 发生变化的回调
     */
    onDailyOrderDatePickerChange(date, dateStr) {
      this.dailyOrderTimeFactorInfo.curDate = dateStr
      this._getDailyOrderStatData()
    },
    /**
     * 获取每日发订单 统计数据
     */
    async _getDailyOrderStatData() {
      const param = { day: this.dailyOrderTimeFactorInfo.curDate }
      try {
        const { data: dailyOrderStatData } = await statisticalApi.getDailyOrderStatDataApi(param)
        this.dailyOrderStatData.xAxisData = dailyOrderStatData.map(item => item.hour)
        this.dailyOrderStatData.yAxisData = dailyOrderStatData.map(item => item.count)
        this._setOrderLineEcharts()
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 获取每日案源匹配 统计数据
     */
    async _getDailyCaseSourceMatchStatData() {
      try {
        const { data: dailyPhoneOrderStatData } = await statisticalApi.getDailyCaseSourceMatchStatDataApi()
        this.dailyCaseSourceMatchStatData = dailyPhoneOrderStatData
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 设置订单折线图 echarts
     */
    _setOrderLineEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const orderLineChart = echarts.init(this.$refs.orderEchartsLineRef, null)
      orderLineChart.showLoading()
      // 绘制图表
      const barOption = {
        title: { text: '每日发单数据' },
        tooltip: { trigger: 'axis', },
        legend: { data: ['订单数据图'], left: 'left', },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dailyOrderStatData.xAxisData
        },
        yAxis: { type: 'value', },
        series: [
          {
            name: '发单量',
            type: 'line',
            data: this.dailyOrderStatData.yAxisData,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#6954f0', },
                  { offset: 1, color: '#fff', },
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
      window.addEventListener('resize', function () {
        orderLineChart.resize()
      })
    },
    /**
     * 下单统计 DatePicker 发生变化的回调
     */
    onOrderDatePickerChange(date, dateStr) {
      this.orderTimeFactorInfo.curDate = dateStr
      this.getOrderData()
    },
    /**
     * 获取下单统计数据
     */
    getOrderData() {
      const param = { date: this.orderTimeFactorInfo.curDate }
      getOrderDataPage(param)
        .then(({ data }) => {
          this.orderDataList = data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.state.iconLoading1 = false
          this.state.loading = false
        })
    },
    getChargeOrderData(date) {
      getChargeOrderData(date).then((data) => {
        this.userRingData[0].number = data.data.call_phone_number
        this.userRingData[1].value = data.data.charge_call_phone_money
        this.userRingData[1].number = data.data.charge_call_phone_number
        this.userRingData[2].value = data.data.charge_meet_money
        this.userRingData[2].number = data.data.charge_meet_number
        this.userRingData[3].value = data.data.charge_litigation_money
        this.userRingData[3].number = data.data.charge_litigation_number
        this.userRingData[4].value = data.data.charge_contract_money
        this.userRingData[4].number = data.data.charge_contract_number
        this.lawyerRingData[0].value = data.data.guarantee_money
        this.lawyerRingData[0].number = data.data.guarantee_number
        this.lawyerRingData[1].value = data.data.enable_store_money
        this.lawyerRingData[1].number = data.data.enable_store_number
        this.myEcharts3()
        this.myEcharts4()
      })
    },
    // 获取用户活跃数据
    getAppActiveData(startDate, endDate) {
      getAppActiveDataPage(startDate, endDate)
        .then(({ data }) => {
          this.appData.x = []
          this.appData.data.user = []
          this.appData.data.lawyer = []
          for (let i = 0; i < data.length; i++) {
            this.appData.x.push(data[i].created_date)
            this.appData.data.user.push(data[i].user_active_number)
            this.appData.data.lawyer.push(data[i].lawyer_active_number)
          }
          this.myEcharts()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    // 获取用户注册数据
    getAddUserData(startDate, endDate) {
      getAddUserDataPage(startDate, endDate)
        .then(({ data }) => {
          this.userData.x = []
          this.userData.data.user = []
          this.userData.data.lawyer = []
          for (let i = 0; i < data.length; i++) {
            this.userData.x.push(data[i].created_date)
            this.userData.data.user.push(data[i].user_register_number)
            this.userData.data.lawyer.push(data[i].lawyer_auth_number)
          }
          this.myEcharts1()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    getTollData(startDate, endDate) {
      // 收费统计
      getTollDataPage(startDate, endDate)
        .then(({ data }) => {
          data = JSON.parse(JSONbig.stringify(data))
          this.tollData.x = []
          let alltoll = 0
          this.testtoll = data
          for (let i = 0; i < data.length; i++) {
            this.tollData.x.push(data[i].created_date)
            this.testtoll[i]['value'] = data[i].total_money
            alltoll = alltoll + Number(data[i].total_money)
          }
          this.alltollnumber = alltoll.toFixed(2)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.$nextTick(() => {
            this.myEcharts2()
          })
          this.state.loading = false
        })
    },
    changeRing() {
      this.state.ring = !this.state.ring
      this.getChargeOrderData(moment().format('YYYY-MM-DD'))
    },
  },
}
</script>

<style lang="less" scoped>
.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}
.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
