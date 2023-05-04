<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span style="margin-left: 6px;">新增律师广告投放</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="base-module">
        <!-- 投放地区 -->
        <div class="base-item">
          <div class="base-key">选择地区：</div>
          <a-cascader :options="regionCascaderList" :allowClear="false" placeholder="请选择地区" @change="onRegionCascaderChangeEvt" />
        </div>

        <!-- 排序位置 -->
        <div v-if="advertModalInfo.city_id > 0" class="base-item">
          <div class="base-key">排序位置：</div>
          <div class="advert-position-wrap">
            <div v-for="(aItem, aIdex) in advertPositionSelectList" :key="aIdex" class="advert-position-item" @click="changeAdvertSortNum(aItem, aIdex)">
              <img v-if="aItem.sort === advertModalInfo.weight" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>{{ aItem.desc }}（金额：￥{{ aItem.money }}）</span>
            </div>
          </div>
        </div>
        <!-- 多选投放时间 -->
        <div v-if="advertModalInfo.weight" class="base-item">
          <div class="base-key">投放时间：</div>
          <a-select v-model="advertModalInfo.selectedDateList" style="width: 400px;" mode="multiple">
            <a-select-option v-for="rItem in advertDateSelectList" :value="rItem.value" :key="rItem.label" :disabled="rItem.value | advertDateDisableFilter">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <!--  -->
        <div v-if="advertModalInfo.selectedDateList.length > 0" class="base-item">
          <div class="base-key"></div>
          <a-button type="primary" @click="openInfoConfirmModal">下一步</a-button>
        </div>
      </div>
    </a-card>

    <!-- 信息确认 modal -->
    <a-modal
      v-model="isShowInfoConfirmModal"
      :width="500"
      destroyOnClose
      title="信息确认"
      @ok="onInfoConfirmModalOkEvt"
    >
      <div class="infoConfirm-modal-box">
        <!-- 投放地区 -->
        <div class="infoConfirm-item">
          <div class="infoConfirm-left">投放地区：</div>
          <div class="infoConfirm-right">{{ advertModalInfo.province_cn }}-{{ advertModalInfo.city_cn }}</div>
        </div>
        <!-- 排序位置 -->
        <div v-if="advertModalInfo.weight" class="infoConfirm-item">
          <div class="infoConfirm-left">投放位置：</div>
          <div class="infoConfirm-right">
            <span>{{ advertPositionSelectList[advertModalInfo.weight - 1].desc }}</span>
          </div>
        </div>

        <!-- 投放时间 -->
        <div class="infoConfirm-item">
          <div class="infoConfirm-left">投放时间：</div>
          <div class="infoConfirm-right">
            <span>{{ advertModalInfo.selectedDateList[0] }}</span>
            <a-popover title="投放时间段">
              <template slot="content">
                <p v-for="(aItem, aIndex) in advertModalInfo.selectedDateList" :key="aIndex" style="margin-bottom: 4px; font-size: 14px; font-weight: bold;">{{ aItem }}</p>
              </template>
              <a-button type="link" style="padding-right: 0;">更多</a-button>
            </a-popover>
          </div>
        </div>
        <!-- 金额 -->
        <div class="infoConfirm-item">
          <div class="infoConfirm-left">支付金额：</div>
          <div class="infoConfirm-right">￥{{ advertModalInfo.payment_money }}</div>
        </div>
        <div class="infoConfirm-item">
          <div class="infoConfirm-left">选择律师：</div>
          <div v-if="advertModalInfo.lawyer.user_id" style="display: flex;">
            <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="advertModalInfo.lawyer.avatar" />
            <div style="font-size: 16px; font-weight: bold;">
              <div>{{ advertModalInfo.lawyer.nickname }}</div>
              <div style="font-size: 15px; color: #999;">{{ advertModalInfo.lawyer.mobile }}</div>
            </div>
          </div>
          <a-button v-else type="primary" @click="openOpenBestModal">选择</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 支付确认 modal -->
    <a-modal
      v-model="isShowPayConfirmModal"
      :width="600"
      destroyOnClose
      title="支付信息确认"
      @ok="onPayConfirmModalOkEvt"
    >
      <div class="infoConfirm-modal-box">
        <!-- 投放地区 -->
        <div class="infoConfirm-item">
          <div class="infoConfirm-left">投放律师：</div>
          <div class="infoConfirm-right">
            <div style="display: flex;">
              <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="advertModalInfo.lawyer.avatar" />
              <div style="font-size: 16px; font-weight: bold;">
                <div>{{ advertModalInfo.lawyer.nickname }}</div>
                <div style="font-size: 15px; color: #999;">{{ advertModalInfo.lawyer.mobile }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 投放地区 -->
        <div class="infoConfirm-item">
          <div class="infoConfirm-left">支付金额：</div>
          <div class="infoConfirm-right">
            <span style="font-size: 13px; margin-right: 6px;">原本金额</span>
            <a-input :value="advertModalInfo.payment_money" style="width: 80px;" disabled placeholder="总金额" />
            <span style="font-size: 13px; margin:0 6px;">-</span>
            <span style="font-size: 13px; margin-right: 6px;">优惠金额</span>
            <a-input v-model="advertModalInfo.money_reduction" style="width: 80px;" placeholder="优惠金额" />
            <span style="font-size: 13px; margin:0 6px;">=</span>
            <span style="font-size: 13px; margin-right: 6px;">实际金额</span>
            <a-input v-model="advertRealityPrice" disabled style="width: 80px;" placeholder="实际金额" />
          </div>
        </div>

        <!-- 律师账户余额 -->
        <div class="infoConfirm-item">
          <div class="infoConfirm-left" style="cursor: pointer;" @click="advertModalInfo.payment_type = '0'">
            <img v-if="advertModalInfo.payment_type === '0'" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
            <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
            <span>律师账户余额：</span>
          </div>
          <div class="infoConfirm-right">
            <span style="color: #409eff;">￥{{ advertModalInfo.lawyer.balance }}（余额全抵扣: {{ advertRealityPrice }}）</span>
          </div>
        </div>

        <!-- 律师账户余额 -->
        <div class="infoConfirm-item">
          <div class="infoConfirm-left" style="cursor: pointer;" @click="advertModalInfo.payment_type = '4'">
            <img v-if="advertModalInfo.payment_type === '4'" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
            <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
            <span>线下付款金额：</span>
          </div>
          <div class="infoConfirm-right">
            <a-input v-model="advertRealityPrice" disabled style="width: 80px;" placeholder="实际金额" />

            <span style="margin-left: 10px;">打款截图：</span>

            <div class="image-wrap">
              <div v-if="advertModalInfo.images.length" class="image-item" v-viewer >
                <img class="image" :src="advertModalInfo.images[0]" />
                <a-icon class="icon-close" type="close-circle" @click.stop="advertModalInfo.images = []" />
              </div>

              <div v-else class="image-upload" @click="chooseCauseSourceImage">
                <a-icon type="plus" style="fontSize: 26px" />
              </div>
            </div>
          </div>
        </div>
      </div></a-modal>

    <!-- 选择律师 modal -->
    <a-modal
      v-model="openBestModal.isShowOpenLawyerModal"
      :width="600"
      destroyOnClose
      @ok="onOpenModalOkEvt"
    >
      <div slot="title">
        <span style="font-size: 18px; font-wight: 500; margin-right: 8px;">选择律师</span>
        <a-input allow-clear placeholder="搜索姓名/手机号" v-model="openBestModal.searchLawyerKeyword" @keyup.enter="openOpenBestModal" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="openOpenBestModal">搜索</a-button>
      </div>
      <div class="open-modal">
        <a-spin :spinning="openBestModal.isSpinning">
          <div class="open-body" @scroll="onOpenModalScrollEvt">
            <div v-for="(cItem, cIndex) in openBestModal.waitOpenBestLawyerList" :key="cIndex" class="checked-item" @click="openBestModal.activeLawyer = cItem">
              <img :src="cItem.avatar" style="width: 30px; height: 30px; margin-right: 6px;" />
              <div>
                <div>{{ cItem.nickname }}</div>
                <div style="font-size: 14px; color: #999;">{{ cItem.mobile }}</div>
              </div>
              <img v-if="cItem.user_id === openBestModal.activeLawyer.user_id" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
            </div>
          </div>
        </a-spin>
      </div>
    </a-modal>

    <!-- 图片 input 单文件上传  -->
    <input
      v-if="isShowCSImageFileInput"
      id="input"
      ref="fileInputCSImageRef"
      type="file"
      style="display: none;"
      accept="image/*"
      @change="onCSImageInputFileChange"
    >
  </a-layout>
</template>

<script>
import moment from 'moment'
import JSONbig from 'json-bigint'
import fileUtil from '@/utils/fileUtil'
import * as lawyerApi from '@/api/lawyer'
import * as advertApi from '@/api/advertApi'
import * as causeSourceApi from '@/api/causeSourceApi'

// 律师广告
const LAWYER_ADVERT = {
  lawyer: {}, // 律师 信息
  province_id: -1, // 地区省 id
  city_id: -1, // 地区市 id
  province_cn: '', // 地区省 中文
  city_cn: '', // 地区省 中文

  selectedDateList: [], // 已选投放日期列表
  weight: 0, // 排序 num 可选：1,2,3
  weightSelected: [], // 该城市已选 排序 列表

  payment_money: '0', // 应支付金额
  money_reduction: '0', // 优惠金额
  payment_type: '', // 支付方式 0：余额 4：线下
  images: [], // 线下付款截图
}

// 开通优选 选择律师 modal
const OPENBEST_MODAL = {
  isShowOpenLawyerModal: false,
  waitOpenBestLawyerList: [], // 待开通优选律师列表
  page: 1,
  total: 0,
  isSpinning: false, // 是否真正加载中
  searchLawyerKeyword: '', // 搜索律师关键字
  activeLawyer: {}, // 选中的律师 id
}

let that

export default {
  name: 'AdvertLawyerAddPage',
  filters: {
    advertDateDisableFilter(value) {
      const _startDate = value.split('至')[0]
      let _disable = false
      const _findDate = that.advertDateDisabledList.find(item => item.started_at === _startDate)
      if (_findDate) _disable = true
      return _disable
    }
  },
  data() {
    return {
      regionCascaderList: [], // 地区 cascader 列表
      advertPositionSelectList: [{ sort: 1, money: '', desc: '第一位' }, { sort: 2, money: '', desc: '第二位' }, { sort: 3, money: '', desc: '第三位' }],
      advertModalInfo: Object.assign({}, LAWYER_ADVERT), // 律师广告 modal 信息

      isShowInfoConfirmModal: false, // 是否打开信息确认 modal
      isShowPayConfirmModal: false, // 是否打开支付信息确认 modal
      openBestModal: { ...OPENBEST_MODAL }, // 开通优选律师 modal

      lawyerAdvertPriceInfo: {}, // 律师广告价格 信息
      totalCityList: [], // 全部城市列表

      advertDateSelectList: [], // 广告投放可选时间段
      advertDateDisabledList: [], // 广告投禁选时间段

      isShowCSImageFileInput: true, // 是否显示上传案源图片 input
    }
  },
  computed: {
    // 广告实际价格
    advertRealityPrice() {
      return Number(this.advertModalInfo.payment_money) - Number(this.advertModalInfo.money_reduction)
    }
  },
  beforeCreate() { that = this },
  created() {
    this._calcAdvertDateSelectList()
    this._getLawyerAdvertPriceList()
    this._getRegionList()
  },
  methods: {
    moment,

    /**
     * 计算广告日期可选列表
     */
    _calcAdvertDateSelectList() {
      const stepNum = 4
      const _startDate = '2022-12-10 00:00:00'
      const _selectDateList = [
        [moment(_startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(_startDate).add(stepNum, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      ]

      for (let i = 1; i < 100; i++) {
        const prevSelectDate = _selectDateList.at(-1).at(-1) // 取数组最后一个时间段的 结束时间
        const _stepStarDate = moment(prevSelectDate).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
        const _stepEndDate = moment(prevSelectDate).add(5, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
        _selectDateList.push([_stepStarDate, _stepEndDate])
      }

      // 转换成 select 选项值
      const _tempSelectList = []
      for (const sItem of _selectDateList) {
        const selectOpt = { label: sItem[0] + ' 至 ' + sItem[1], value: sItem[0] + '至' + sItem[1] }
        _tempSelectList.push(selectOpt)
      }
      this.advertDateSelectList = _tempSelectList
    },

    /**
     * 获取广告价格列表
     */
    async _getLawyerAdvertPriceList() {
      try {
         const { data: priceData } = await advertApi.getLawyerAdvertPriceInfoApi()
         const zhixiaCityList = priceData.filter(item => item.city_type === 2)
         const shengHuiCityList = priceData.filter(item => item.city_type === 1)
         const qiTaCityList = priceData.filter(item => item.city_type === 0)
         // 2: 直辖市 1: 省会 0: 其他城市
         this.lawyerAdvertPriceInfo = { '2': zhixiaCityList, '1': shengHuiCityList, '0': qiTaCityList }
       } catch (error) {
         console.log(error)
       }
    },
    /**
     * 获取地区列表
     */
    async _getRegionList() {
      try {
        const { data: lawyerRegionData } = await causeSourceApi.getLawyerRegionListApi()
        const regionCommonCityList = lawyerRegionData.cities

        var _regioinOptionList = []
        for (let i = 0; i < regionCommonCityList.length; i++) {
          _regioinOptionList.push({ label: regionCommonCityList[i].name, value: regionCommonCityList[i].district_id, children: [] })
          for (let j = 0; j < regionCommonCityList[i].cities.length; j++) {
            _regioinOptionList[i].children.push({ label: regionCommonCityList[i].cities[j].name, value: regionCommonCityList[i].cities[j].district_id })
          }
        }
        this.regionCascaderList = [
          // { label: '全国', value: 0, children: [{ label: '全国', value: 0 }] },
          ..._regioinOptionList
        ]
        // 取出全部城市列表 拉平一维数组
        this.totalCityList = regionCommonCityList.map(item => item.cities).flat()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听地区筛选选择 事件
     */
    onRegionCascaderChangeEvt(value, selectedOptions) {
      this._resetAdvertModalInfo()
      
      this.advertModalInfo.province_id = value[0]
      this.advertModalInfo.city_id = value[1]
      this.advertModalInfo.province_cn = selectedOptions[0].label
      this.advertModalInfo.city_cn = selectedOptions[1].label

      const _findCity = this.totalCityList.find(item => item.district_id === this.advertModalInfo.city_id)
      let cityPriceList = []
      if (_findCity) cityPriceList = this.lawyerAdvertPriceInfo[`${ _findCity.city_type }`]
      // 确定广告位置价格
      this.advertPositionSelectList[0].money = cityPriceList.find(item => item.number === '1').money
      this.advertPositionSelectList[1].money = cityPriceList.find(item => item.number === '2').money
      this.advertPositionSelectList[2].money = cityPriceList.find(item => item.number === '3').money
    },

    /**
     * 选择广告排序（位置）
     */
    changeAdvertSortNum(advertItem, advertIndex) {
      this._resetAdvertModalInfo()
      this.advertModalInfo.weight = advertItem.sort
      this._getAdvertSelectedDateList(this.advertModalInfo.weight)
    },

    /**
     * 获取广告时间禁选列表
     */
    async _getAdvertSelectedDateList(advertWeight) {
      const param = {
        city_id: this.advertModalInfo.city_id,
        weight: advertWeight
      }
      try {
         const { data: advertSelectedData } = await advertApi.getAdvertSelectedDateApi(param)
         this.advertDateDisabledList = advertSelectedData
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听广告投放时间段 select change 事件
     */
    _resetAdvertModalInfo() {
      this.advertModalInfo.lawyer = {}
      this.advertModalInfo.weight = 0
      this.advertModalInfo.selectedDateList = []
      this.advertModalInfo.payment_money = '0'
      this.advertModalInfo.money_reduction = '0'
      this.advertModalInfo.payment_type = ''
      this.advertModalInfo.images = []
    },

    /**
     * 打开信息确认 modal
     */
    openInfoConfirmModal() {
      if (this.advertModalInfo.city_id < 0) return this.$message.warning('请选择投放地区')
      if (!this.advertModalInfo.weight) return this.$message.warning('请选择投放位置')
      if (!this.advertModalInfo.selectedDateList.length) return this.$message.warning('请选择投放时间段')

      const price = this.advertPositionSelectList[this.advertModalInfo.weight - 1].money
      this.advertModalInfo.payment_money = Number(price) * this.advertModalInfo.selectedDateList.length
      this.isShowInfoConfirmModal = true
    },

    /**
     * 监听信息确认 modal ok事件
     */
    async onInfoConfirmModalOkEvt() {
      if (!this.advertModalInfo.lawyer.user_id) return this.$message.warning('请选择律师')
      this.isShowInfoConfirmModal = false
      this.isShowPayConfirmModal = true
      this._getLawyerDetail()
    },

    /**
     * 获取律师详情
     */
    _getLawyerDetail() {
      lawyerApi.getLawyerDetail(JSONbig.stringify((this.advertModalInfo.lawyer.user_id)))
        .then(({ data }) => {
          // 律师账户余额
          this.advertModalInfo.lawyer.balance = data.balance
        })
    },

    /**
     * 选择案源图片
     * https://juejin.cn/post/6844903697667850248
     */
    chooseCauseSourceImage() {
      this.isShowCSImageFileInput = true
      this.$nextTick(() => {
        // this.$refs.fileInputCSImageRef.click() 
        this.$refs.fileInputCSImageRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onCSImageInputFileChange(event) {
      const file = event.target.files[0]
      this.isShowCSImageFileInput = false

      try {
        const imgURL = await fileUtil.uploadFile(file)
        this.advertModalInfo.images = [imgURL]
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 添加律师广告投放
     */
     async onPayConfirmModalOkEvt() {
      const { advertModalInfo } = this
      const _selectedDateList = advertModalInfo.selectedDateList.map(item => item.split('至'))
      const times = []
      // 重组时间段结构
      for (const tItem of _selectedDateList) {
        times.push({ started_at: tItem[0], stopped_at: tItem[1] })
      }
      if (!times.length) return this.$message.warning('请选择投放时间段')
      if (!advertModalInfo.lawyer.user_id) return this.$message.warning('请选择投放律师')
      if (!advertModalInfo.payment_type) return this.$message.warning('请选支付方式')
      
       const param = {
         user_id: advertModalInfo.lawyer.user_id, // 律师 id

         advertisement_position_id: '459309374742024193',
         type: 0,
         show_type: -1,
         user_type: 2,
         banner: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/icon/Lawyer_icon_ADV%403x.png',
         province_id: advertModalInfo.province_id,
         city_id: advertModalInfo.city_id || 0,
         weight: advertModalInfo.weight,
         times: JSON.stringify(times), // 投放时间段
         payment_type: advertModalInfo.payment_type, // 支付方式
         payment_money: advertModalInfo.payment_money, // 平台原价
         money_reduction: this.advertModalInfo.money_reduction, // 优惠元子
         images: JSON.stringify(advertModalInfo.images)
       }

       this.isShowPayConfirmModal = false
       try {
         await advertApi.postAddAdvertApi(param)
         this.$notification.success({ message: '添加成功', duration: 3 })
         this.$router.back()
       } catch (error) {
         console.log(error)
       }
     },

    /**
     * 打开选择律师 modal
     */
    async openOpenBestModal() {
      if (this.openBestModal.searchLawyerKeyword.trim()) this.openBestModal.page = 1
      const param = { page: this.openBestModal.page, size: 20, type: 2, nickname: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getWaitOpenBestLawyerListApi(param)
        if (this.openBestModal.page === 1) this.openBestModal.waitOpenBestLawyerList = []

        this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data.map(item => ({ ...item, balance: '0' })))
        this.openBestModal.total = waitOpenBestData.total
        this.openBestModal.isShowOpenLawyerModal = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听 开通律师列表 modal scroll 事件
     */
    async onOpenModalScrollEvt(event) {
      const openModalScrollTop = event.target.scrollTop
      const openModalClientHeight = event.target.clientHeight
      const openModalScrollHeight = event.target.scrollHeight

      if (openModalScrollTop + openModalClientHeight >= openModalScrollHeight - 50) {
        if (this.openBestModal.waitOpenBestLawyerList.length >= this.openBestModal.total) return
        if (this.openBestModal.isSpinning) return

        ++this.openBestModal.page
        const param = { page: this.openBestModal.page, size: 20, type: 1 }
        this.openBestModal.isSpinning = true
        try {
          const { data: waitOpenBestData } = await lawyerApi.getWaitOpenBestLawyerListApi(param)
          this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data)
          this.openBestModal.total = waitOpenBestData.total
          this.openBestModal.isSpinning = false
        } catch (error) {
          this.openBestModal.isSpinning = false
          console.log(error)
        }
       }
    },

    /**
     * 监听选择选律师列表 modal ok 事件
     */
    onOpenModalOkEvt() {
      const { openBestModal } = this
      if (!openBestModal.activeLawyer.user_id) return this.$message.warning('请选择开通律师')

      this.advertModalInfo.lawyer = openBestModal.activeLawyer
      this.openBestModal.isShowOpenLawyerModal = false
    },
  }
}
</script>

<style lang="less" scoped>
.header-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
  .back-wrap {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
}

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  margin-left: auto;
  cursor: pointer;
}

.content {
  margin-top: 16px;
  .base-module {
    margin-left: 200px;
    .base-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .base-key {
        font-size: 14px;
        font-weight: bold;
        min-width: 100px;
      }
      .advert-position-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .advert-position-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-right: 30px;
          cursor: pointer;
        }
      }
    }
  }
}

.infoConfirm-modal-box {
  .infoConfirm-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .infoConfirm-left {
      font-size: 14px;
      font-weight: bold;
      min-width: 80px;
    }
    .infoConfirm-right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 15px;
      font-weight: bold;
      .image-wrap {
        width: 120px;
        height: 120px;
        .image-item {
          position: relative;
          cursor: pointer;
          height: 100%;
          .image {
            width: 100%;
            height: 100%;
          }
          .icon-close {
            position: absolute;
            top: -8px;
            right: -8px;
            font-size: 20px;
            cursor: pointer;
          }
        }
        .image-upload {
          position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
          border: dashed 1px #666;
        }
      }
    }
  }
}

.open-modal {
  .open-body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    max-height: 300px;
    overflow: auto;
    .checked-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      height: 50px;
      border-radius: 6px;
      padding: 0 4px;
      border: 1px solid #ccc;
      cursor: pointer;
      .checkbox-img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        margin-left: auto;
      }
    }
  }
}
</style>
