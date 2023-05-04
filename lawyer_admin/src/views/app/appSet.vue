
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">APP功能设置</span>
    </a-layout-header>

    <a-card class="content">
      <div class="set-module">
        <!-- 电话咨询价格设置 -->
        <div class="set-item phone-consult">
          <div class="set-header">
            <span>电话咨询价格设置</span>
            <a-popconfirm title="请确认是否更新电话咨询价格?" @confirm="confirmUpdatePhoneConsultInfo">
              <a-button type="primary">保存</a-button>
            </a-popconfirm>
          </div>

          <!-- 日常咨询价格 -->
          <div class="opt-item">
            <div class="opt-left">日常咨询价格</div>
            <div class="opt-right">
              <a-input class="input" v-model="phoneConsultInfo.price" placeholder="请输入价格" allowClear />
              <span style="margin-left: 6px;">元</span>
            </div>
          </div>

          <!-- 免费时间段 -->
          <div class="opt-item">
            <div class="opt-left">免费时间段</div>
            <div class="opt-right">
              <a-switch v-model="phoneConsultInfo.isFree" />
            </div>
          </div>

          <!-- 时间-->
          <div class="opt-item">
            <div class="opt-left">时间</div>
            <div class="opt-right">
              <a-time-picker v-model="phoneConsultInfo.startTime" :default-value="phoneConsultInfo.startTime" format="HH:mm" />
              <span style="margin: 10px;">至</span>
              <a-time-picker v-model="phoneConsultInfo.endTime" :default-value="phoneConsultInfo.endTime" format="HH:mm" />
            </div>
          </div>

          <!-- 价格 -->
          <div class="opt-item">
            <div class="opt-left">价格</div>
            <div class="opt-right">
              <span style="margin-left: 6px;">0</span>
              <span style="margin-left: 6px;">元</span>
            </div>
          </div>
        </div>

        <!-- 提现方式设置 -->
        <div class="set-item wallet-withdrawal">
          <div class="set-header">
            <span>提现方式设置</span>
            <a-popconfirm title="请确认是否更新提现方式?" @confirm="confirmUpdateAppWithdrawalInfo">
              <a-button type="primary">保存</a-button>
            </a-popconfirm>
          </div>

          <div class="withdrawal-item" @click="appWithdrawalInfo.wechat = appWithdrawalInfo.wechat === 1 ? 0 : 1">
            <a-icon type="wechat" :style="{ fontSize: '22px', color: '#08c160' }" />
            <span style="margin-left: 10px;">微信</span>
            <img v-if="appWithdrawalInfo.wechat" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
            <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
          </div>

          <div class="withdrawal-item" @click="appWithdrawalInfo.alipay = appWithdrawalInfo.alipay === 1 ? 0 : 1">
            <a-icon type="alipay-circle" :style="{ fontSize: '22px', color: '#1777ff' }" />
            <span style="margin-left: 10px;">支付宝</span>
            <img v-if="appWithdrawalInfo.alipay" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
            <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
          </div>
        </div>

        <!-- 律师接单设置 -->
        <div class="set-item lawyer-order">
          <div class="set-header">
            <span>律师接单设置</span>
            <a-popconfirm title="请确认是否更新律师接单方式?" @confirm="confirmUpdateLawyerOrderInfo">
              <a-button type="primary">保存</a-button>
            </a-popconfirm>
          </div>

          <div class="order-set-wrap">
            <div class="order-set-title">优选律师权限</div>
            <div class="order-set-items">
              <div class="order-set-item" @click="lawyerOrderInfo.bestEnterpriseConsult = lawyerOrderInfo.bestEnterpriseConsult === 1 ? 0 : 1">
                <span style="margin-left: 10px;">企业咨询</span>
                <img v-if="lawyerOrderInfo.bestEnterpriseConsult" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              </div>
              <div class="order-set-item" @click="lawyerOrderInfo.bestPersonConsult = lawyerOrderInfo.bestPersonConsult === 1 ? 0 : 1">
                <span style="margin-left: 10px;">个人咨询</span>
                <img v-if="lawyerOrderInfo.bestPersonConsult" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              </div>
            </div>
          </div>

          <div class="order-set-wrap">
            <div class="order-set-title">非优选律师权限</div>
            <div class="order-set-items">
              <div class="order-set-item" @click="lawyerOrderInfo.reverseBestEnterpriseConsult = lawyerOrderInfo.reverseBestEnterpriseConsult === 1 ? 0 : 1">
                <span style="margin-left: 10px;">企业咨询</span>
                <img v-if="lawyerOrderInfo.reverseBestEnterpriseConsult" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              </div>
              <div class="order-set-item" @click="lawyerOrderInfo.reverseBestPersonConsult = lawyerOrderInfo.reverseBestPersonConsult === 1 ? 0 : 1">
                <span style="margin-left: 10px;">个人咨询</span>
                <img v-if="lawyerOrderInfo.reverseBestPersonConsult" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              </div>
            </div>
          </div>
          
          <div class="order-set-wrap">
            <!-- 时间-->
            <div class="order-set-items" style="align-items: center;">
              <img v-if="lawyerOrderInfo.isOpenTime" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" @click="lawyerOrderInfo.isOpenTime = 0" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" @click="lawyerOrderInfo.isOpenTime = 1" />
              <span style="margin-rigth: 5px;">开始时间</span>
              <div class="order-set-right">
                <a-time-picker v-model="lawyerOrderInfo.startTime" :default-value="lawyerOrderInfo.startTime" format="HH:mm" />
                <span style="margin: 5px;">结束时间</span>
                <a-time-picker v-model="lawyerOrderInfo.endTime" :default-value="lawyerOrderInfo.endTime" format="HH:mm" />
              </div>
            </div>
          </div>
        </div>

        <!-- 服务热线设置 -->
        <div class="set-item phone-income">
          <div class="set-header">
            <span>全国统一服务热线</span>
            <a-popconfirm title="请确认是否更新服务热线?" @confirm="confirmUpdateServePhoneInfo">
              <a-button type="primary">保存</a-button>
            </a-popconfirm>
          </div>

          <div class="opt-item">
            <div class="opt-left">文案</div>
            <div class="opt-right">
              <a-input class="input" v-model="servePhoneInfo.servePhoneDesc" placeholder="请输入文案" allowClear />
            </div>
          </div>

          <div class="opt-item">
            <div class="opt-left">电话号码</div>
            <div class="opt-right">
              <a-input class="input" v-model="servePhoneInfo.servePhone" placeholder="请输入电话号码" allowClear />
            </div>
          </div>

          <div class="opt-item">
            <div class="opt-left">是否开启</div>
            <div class="opt-right">
              <a-switch v-model="servePhoneInfo.isOpen" />
            </div>
          </div>
        </div>

        <!-- 电话咨询分享设置 -->
        <div class="set-item phone-income">
          <div class="set-header">
            <span>电话咨询分享设置</span>
            <a-popconfirm title="请确认是否更新分享设置?" @confirm="confirmUpdatePhoneConsultShareNum">
              <a-button type="primary">保存</a-button>
            </a-popconfirm>
          </div>

          <div class="opt-item">
            <div class="opt-left">
              <a-input class="input" v-model="phoneConsultShareInfo.freeOrderNum" placeholder="请输入免费单数" allowClear />
            </div>
            <div class="opt-right">
              单后需要分享
            </div>
          </div>
        </div>

        <!-- 电话咨询有效时间 -->
        <div class="set-item phone-time">
          <div class="set-header">
            <span>电话咨询有效时间</span>
            <a-popconfirm title="请确认是否更新电话有效时间?" @confirm="confirmUpdatePhoneVaildTime">
              <a-button type="primary">保存</a-button>
            </a-popconfirm>
          </div>

          <div class="opt-item">
            <span>通话时长</span>
            <div class="opt-left">
              <a-input class="input" v-model="phoneTimeInfo.settle_time" placeholder="请输入时长" allowClear />
            </div>
            <div class="opt-right">
              秒以上
            </div>
          </div>

          <a-textarea v-model="phoneTimeInfo.text" placeholder="请输入文案" :rows="5" />
        </div> 

        <!-- 律师广告文案 -->
        <div class="set-item phone-income">
          <div class="set-header">
            <span>律师广告文案设置</span>
            <a-popconfirm title="请确认是否更新广告文案?" @confirm="confirmUpdateAdvertInfoEvt">
              <a-button type="primary">保存</a-button>
            </a-popconfirm>
          </div>

          <div class="opt-item">
            <div class="opt-left">百姓律师广告：</div>
            <div class="opt-right">
              <a-input class="input" v-model="lawyerAdvertInfo.baixinApp" placeholder="请输入文案" allowClear />
            </div>
          </div>

          <div class="opt-item">
            <div class="opt-left">律师端广告：</div>
            <div class="opt-right">
              <a-input class="input" v-model="lawyerAdvertInfo.lawyerApp" placeholder="请输入文案" allowClear />
            </div>
          </div>
        </div>

        <!-- 律师端资源说明设置 -->
        <div class="set-item lawyerApp-res">
          <div class="set-header">
            <span>律师端说明设置</span>
            <a-popconfirm title="请确认是否更新地址?" @confirm="confirmUpdateLawyerAppResInfoEvt">
              <a-button type="primary">保存</a-button>
            </a-popconfirm>
          </div>

          <div class="opt-item">
            <div class="opt-left">视频讲解：</div>
            <div class="opt-right">
              <video :src="lawyerAppResInfo.video" controls width="240px" height="120px" />
            </div>
            <a-button type="primary" size="small" @click="chooseLawyerAppResVideo">更新视频</a-button>
          </div>

          <div class="opt-item">
            <div class="opt-left">广告图片：</div>
            <div class="opt-right">
              <div class="image-wrap" v-viewer>
                <img style="width: 100%; height: 100%;" :src="lawyerAppResInfo.image">
                <a-icon class="icon-close" type="close-circle" @click.stop="lawyerAppResInfo.image = ''" />
                <a-button type="primary" size="small" @click="chooseLawyerAppResImage">更新图片</a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 自动发单设置 -->
        <div class="set-item auto-pubOrder">
          <div class="set-header">
            <span>自动发单设置</span>
            <a-button type="primary" size="small" @click="autoPubOrderModal.isShowAddModal = true">新增</a-button>
          </div>

          <div v-for="(iItem, iIndex) of autoPubOrderList" :key="iIndex" class="opt-item">
            <span>间隔</span>
            <div class="opt-left" style="margin-right: 6px;">
              <span style="color: #1790ff; margin: 0 6px;">{{ iItem.interval_time }}</span>
              分钟，自动发布 1 条与上一订单属性相同的订单
            </div>

            <a-popconfirm title="请确认是否删除自动发单项?" @confirm="confirmDelAutoPubOrderEvt(iItem)">
              <a-button type="danger" size="small">删除</a-button>
            </a-popconfirm>
          </div>
        </div> 
      </div>
    </a-card>

    <!-- 图片 input 单文件上传 -->
    <input
      id="input"
      ref="fileInputLawyerResImgRef"
      type="file"
      style="display: none;"
      accept="image/*"
      @change="onLawyerAppResInputFileChange"
    >

    <!-- 视频 input 单文件上传 -->
    <input
      id="input"
      ref="fileInputLawyerResVideoRef"
      type="file"
      style="display: none;"
      accept="video/*"
      @change="onLawyerAppVideoResInputFileChange"
    >

    <!-- 自动发单 modal -->
    <a-modal
      v-model="autoPubOrderModal.isShowAddModal"
      title="新增间隔自动发单项"
      :width="500"
      :afterClose="() => { autoPubOrderModal.intervalTime = ''; }"
      destroyOnClose
      @ok="onAutoPubOrderOkEvt"
    >
      <div class="remark-modal">
        <div class="modal-body">
          <span>间隔</span>
          <div class="opt-left" style="margin-right: 6px;">
            <a-input style="width: 80px; margin: 0 6px;" v-model="autoPubOrderModal.intervalTime" placeholder="间隔" allowClear />
            分钟，自动发布 1 条与上一订单属性相同的订单
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as appApi from '@/api/app'
import * as commonApi from '@/api/common'
import fileUtil from '@/utils/fileUtil'
import moment from 'moment'
const OSS = require('ali-oss')

// 备注信息 modal info
const REMARK_MODAL_INFO = {
  isShowAddModal: false, // 是否显示
  intervalTime: '', // 间隔时长 分钟
}

export default {
  name: 'AppSetPage',
  data() {
    return {
      // 电话咨询
      phoneConsultInfo: {
        price: '',
        isFree: true,
        startTime: '',
        endTime: '',
        free_price: 0
      },
      // 提现方式
      appWithdrawalInfo: {
        wechat: 0,
        alipay: 0,
      },
      // 律师接单方式
      lawyerOrderInfo: {
        bestEnterpriseConsult: 0, // 优选律师企业咨询
        bestPersonConsult: 0, // 优选律师个人咨询
        reverseBestEnterpriseConsult: 0, // 非优选律师企业咨询
        reverseBestPersonConsult: 0, // 非优选律师个人咨询
        isOpenTime: 0, // 是否开启非优选律师 时间段限制
        startTime: '',
        endTime: '',
      },
      // 电话咨询收益
      phoneIncomeInfo: {
        callTime: '', // 通话时长
      },

      // 电话咨询有效时长
      phoneTimeInfo: {
        text: '', // 文案
        settle_time: '', // 时长(秒)
      },

      // 服务热线
      servePhoneInfo: {
        servePhoneDesc: '', // 文案
        servePhone: '', // 电话
        isOpen: false,
      },

      // 电话咨询分享
      phoneConsultShareInfo: {
        freeOrderNum: '0', // 免费单数
      },

      // 律师广告
      lawyerAdvertInfo: {
        baixinApp: '',
        lawyerApp: '',
      },

      // 律师端广告图
      lawyerAppResInfo: {
        video: '',
        image: '',
      },

      autoPubOrderModal: { ...REMARK_MODAL_INFO }, // 跟进记录 modal 
      autoPubOrderList: [], // 间隔自动发布订单列表
    }
  },
  created() {
    this.getAppConfigInfo()
    this._getAutoPubOrderItemList()
  },
  methods: {
    moment,
    /**
     * 获取 app 配置信息
     */
    async getAppConfigInfo() {
      try {
        const { data: appConfigData } = await appApi.getAppConfgApi()
        // 设置电话咨询配置信息 
        this.phoneConsultInfo.price = appConfigData.telephone_counseling.price
        this.phoneConsultInfo.isFree = appConfigData.telephone_counseling.is_free ? true : false
        appConfigData.telephone_counseling.start_time && (this.phoneConsultInfo.startTime = moment(appConfigData.telephone_counseling.start_time, 'HH:mm'))
        appConfigData.telephone_counseling.end_time && (this.phoneConsultInfo.endTime = moment(appConfigData.telephone_counseling.end_time, 'HH:mm'))

        // 设置提现方式配置信息
        this.appWithdrawalInfo.wechat = appConfigData.app_withdrawal.wechat
        this.appWithdrawalInfo.alipay = appConfigData.app_withdrawal.alipay

        // 律师接单方式
        this.lawyerOrderInfo.bestEnterpriseConsult = appConfigData.lawyer_config.optimization_lawyer.enterprise_consultation
        this.lawyerOrderInfo.bestPersonConsult = appConfigData.lawyer_config.optimization_lawyer.individual_counseling
        this.lawyerOrderInfo.reverseBestEnterpriseConsult = appConfigData.lawyer_config.lawyer.enterprise_consultation
        this.lawyerOrderInfo.reverseBestPersonConsult = appConfigData.lawyer_config.lawyer.individual_counseling
        appConfigData?.lawyer_config?.lawyer?.lawyer_phone_date?.is_open && (this.lawyerOrderInfo.isOpenTime = appConfigData.lawyer_config.lawyer.lawyer_phone_date.is_open)
        appConfigData?.lawyer_config?.lawyer?.lawyer_phone_date?.time?.start_time && (this.lawyerOrderInfo.startTime = moment(appConfigData.lawyer_config.lawyer.lawyer_phone_date.time.start_time, 'HH:mm'))
        appConfigData?.lawyer_config?.lawyer?.lawyer_phone_date?.time?.end_time && (this.lawyerOrderInfo.endTime = moment(appConfigData.lawyer_config.lawyer.lawyer_phone_date.time.end_time, 'HH:mm'))

        // 全国服务热线
        this.servePhoneInfo.servePhoneDesc = appConfigData.telephone_hot_line_setup.notice
        this.servePhoneInfo.servePhone = appConfigData.telephone_hot_line_setup.phone
        this.servePhoneInfo.isOpen = appConfigData.telephone_hot_line_setup.is_open ? true : false

        // 电话咨询分享
        this.phoneConsultShareInfo.freeOrderNum = appConfigData.free_counsel_max_num
        // 电话咨询有效时长
        this.phoneTimeInfo.text = appConfigData.phone_valid.text
        this.phoneTimeInfo.settle_time = `${ appConfigData.phone_valid.settle_time }`

        // 律师广告文案
        this.lawyerAdvertInfo.baixinApp = appConfigData.adv_txt['0']
        this.lawyerAdvertInfo.lawyerApp = appConfigData.adv_txt['3']

        // 律师端广告图
        this.lawyerAppResInfo.video = appConfigData.lawyer_explain_bar.video
        this.lawyerAppResInfo.image = appConfigData.lawyer_explain_bar.image
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 确认更新 App 电话咨询信息
     */
    async confirmUpdatePhoneConsultInfo() {
      if (!this.phoneConsultInfo.price.trim()) return this.$message.warning('请输入咨询价格')
      if (!this.phoneConsultInfo.startTime) return this.$message.warning('请选择开始时间')
      if (!this.phoneConsultInfo.endTime) return this.$message.warning('请选择结束时间')

      // 结束时间是否大于开始时间
      const timeIsAfter = moment(this.phoneConsultInfo.endTime).isAfter(this.phoneConsultInfo.startTime)
      if (!timeIsAfter) return this.$message.warning('请选择正确的时间段')

      const setValue = {
        price: this.phoneConsultInfo.price,
        is_free: this.phoneConsultInfo.isFree ? 1 : 0,
        start_time: moment(this.phoneConsultInfo.startTime).format('HH:mm'),
        end_time: moment(this.phoneConsultInfo.endTime).format('HH:mm'),
        free_price: 0,
      }
      
      const param = {
        type: 'TELEPHONE_COUNSELING',
        value: JSON.stringify(setValue)
      }

      try {
        const { data: resPhoneConsultData } = await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新电话咨询成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 确认更新 App 提现方式
     */
    async confirmUpdateAppWithdrawalInfo() {
      const setValue = {
        wechat: this.appWithdrawalInfo.wechat,
        alipay: this.appWithdrawalInfo.alipay
      }
      
      const param = {
        type: 'APP_PAY',
        value: JSON.stringify(setValue)
      }

      try {
        const { data: resWithdrawalData } = await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新提现方式成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 确认更新 服务热线信息
     */
    async confirmUpdateServePhoneInfo() {
      const setValue = {
        notice: this.servePhoneInfo.servePhoneDesc.trim(),
        is_open: this.servePhoneInfo.isOpen ? 1 : 0,
        phone: this.servePhoneInfo.servePhone.trim(),
      }
      
      const param = {
        type: 'TELEPHONE_HOTLINE_SETUP',
        value: JSON.stringify(setValue)
      }

      try {
        const { data: resWithdrawalData } = await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新服务热线成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 确认更新 免费发电话咨询单次数
     */
    async confirmUpdatePhoneConsultShareNum() {
      const setValue = {
        free_counsel_max_num: this.phoneConsultShareInfo.freeOrderNum.trim(),
      }
      
      const param = {
        type: 'FREE_COUNSEL_MAX_NUM',
        value: JSON.stringify(setValue)
      }

      try {
        await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新电话时长成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 确认更新 免费发电话咨询单次数
     */
    async confirmUpdatePhoneVaildTime() {
      const setValue = {
        text: this.phoneTimeInfo.text.trim(),
        settle_time: this.phoneTimeInfo.settle_time.trim(),
      }
      
      const param = {
        type: 'PHONE_VALID',
        value: JSON.stringify(setValue)
      }

      try {
        await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新时长成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 确认更新 律师广告文案
     */
    async confirmUpdateAdvertInfoEvt() {
      const setValue = {
        0: this.lawyerAdvertInfo.baixinApp.trim(),
        3: this.lawyerAdvertInfo.lawyerApp.trim(),
      }
      
      const param = {
        type: 'ADV_TXT',
        value: JSON.stringify(setValue)
      }

      try {
        const { data: resWithdrawalData } = await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新广告文案成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 确认更新 律师接单 方式
     */
    async confirmUpdateLawyerOrderInfo() {
      const setValue = {
        lawyer_config: {
          optimization_lawyer: {
            enterprise_consultation: this.lawyerOrderInfo.bestEnterpriseConsult,
            individual_counseling:  this.lawyerOrderInfo.bestPersonConsult
          },
          lawyer: {
            enterprise_consultation: this.lawyerOrderInfo.reverseBestEnterpriseConsult,
            individual_counseling:  this.lawyerOrderInfo.reverseBestPersonConsult
          },
        },
        lawyer_phone_config: {
          is_open: this.lawyerOrderInfo.isOpenTime,
          time: {
            start_time: moment(this.lawyerOrderInfo.startTime).format('HH:mm'),
            end_time: moment(this.lawyerOrderInfo.endTime).format('HH:mm'),
          }
        }
      }
      
      const param = {
        type: 'LAWYER_CONFIG',
        value: JSON.stringify(setValue)
      }

      try {
        const { data: lawyerOrderData } = await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新律师接单方式成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择视频
     * https://juejin.cn/post/6844903697667850248
     */
    chooseLawyerAppResVideo() {
      this.$nextTick(() => {
        // this.$refs.fileInputCSImageRef.click() 
        this.$refs.fileInputLawyerResVideoRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onLawyerAppVideoResInputFileChange(event) {
      const file = event.target.files[0]

      try {
        const ossRes = await commonApi.getOSSConfigApi()
        const ossClient = new OSS({
          region: 'oss-cn-hangzhou',
          bucket: 'lvkuaidavideo',
          accessKeyId: ossRes.AccessKeyId,
          accessKeySecret: ossRes.AccessKeySecret,
          stsToken: ossRes.SecurityToken,
        })

        const fileName = '/app/adv-video.mp4'
        const ossUploadRes = await ossClient.put(fileName, file)
        this.lawyerAppResInfo.video = ossUploadRes.url
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择图片
     * https://juejin.cn/post/6844903697667850248
     */
    chooseLawyerAppResImage() {
      this.$nextTick(() => {
        // this.$refs.fileInputCSImageRef.click() 
        this.$refs.fileInputLawyerResImgRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onLawyerAppResInputFileChange(event) {
      const file = event.target.files[0]

      try {
        const imageUrl = await fileUtil.uploadFile(file)
        this.lawyerAppResInfo.image = imageUrl
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 确认更新 律师端资源 图片
     */
    async confirmUpdateLawyerAppResInfoEvt() {
      const setValue = {
        video: this.lawyerAppResInfo.video,
        image: this.lawyerAppResInfo.image,
      }
      
      const param = {
        type: 'LAWYER_EXPLAIN_BAR',
        value: JSON.stringify(setValue)
      }

      try {
        await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新律师端广告资源成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取 自动间隔发单 列表
     */
     async _getAutoPubOrderItemList() {
       try {
         const { data: autoPubOrderData } = await appApi.getAutoPubOrderListApi()
         this.autoPubOrderList = autoPubOrderData
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听 间隔自动发单 modal ok 事件
     */
    async onAutoPubOrderOkEvt() {
      if (!this.autoPubOrderModal.intervalTime.trim()) return this.$message.warning(`请填写间隔时间`)
      if (this.autoPubOrderList.length) {
        if (Number(this.autoPubOrderModal.intervalTime.trim()) <= this.autoPubOrderList.at(-1).interval_time) {
          return this.$message.warning(`间隔时间需要大于${ this.autoPubOrderList.at(-1).interval_time }分钟`)
        }
      }

      const param = { interval_time: this.autoPubOrderModal.intervalTime.trim() }
      this.autoPubOrderModal.isShowAddModal = false
      
      try {
         await appApi.postAutoPubOrderApi(param)

         this.$notification.success({ message: '添加成功', duration: 3 })
         this._getAutoPubOrderItemList()
       } catch (error) {
         console.log(error)
       }
    },
    /**
     * 删除 间隔自动发单项
     */
    async confirmDelAutoPubOrderEvt(record) {
      const param = { automatic_config_id: record.automatic_config_id }
      try {
        await appApi.delAutoPubOrderApi(param)
        this.$notification.success({ message: '删除成功', duration: 3 })
        this._getAutoPubOrderItemList()
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
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

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  margin-left: auto;
  cursor: pointer;
}

.content {
  margin-top: 16px;
  background: #f4f5f5;
  .set-module {
    .set-item {
      float: left;
      min-width: 400px;
      min-height: 400px;
      border-radius: 10px;
      margin-right: 20px;
      margin-bottom: 20px;
      background: #fff;
      padding: 20px;
      .set-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 18px;
      }
      // 电话咨询价格设置
      &.phone-consult {
        .opt-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          font-size: 16px;
          font-weight: 600;
          .opt-right {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }
      }
      // 提现方式设置
      &.wallet-withdrawal {
        .withdrawal-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 14px;
          font-weight: bold;
          height: 50px;
          border-radius: 6px;
          border: 1px solid #ccc;
          padding: 0 10px;
          margin-bottom: 20px;
          cursor: pointer;
          .checkbox-img {
            width: 18px;
            height: 18px;
            margin-right: 6px;
            margin-left: auto;
          }
        }
      }
      // 律师接单设置
      &.lawyer-order {
        .order-set-wrap {
          margin-bottom: 20px;
          .order-set-title {
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .order-set-items {
            display: flex;
            justify-content: flex-start;
            .order-set-item {
              flex: 1;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-size: 14px;
              font-weight: bold;
              height: 50px;
              border-radius: 6px;
              border: 1px solid #ccc;
              padding: 0 10px;
              cursor: pointer;
              &:first-child { margin-right: 10px; }
              .checkbox-img {
                width: 18px;
                height: 18px;
                margin-right: 6px;
                margin-left: auto;
              }
            }
            .order-set-left {
              font-size: 16px;
              font-weight: 600;
              margin-right: 20px;
            }
          }
        }
      }
      // 电话咨询收益设置
      &.phone-income {
        .opt-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          font-size: 16px;
          font-weight: 600;
          .opt-right {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }
      }
      // 电话咨询时长
      &.phone-time {
        .opt-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          font-size: 16px;
          font-weight: 600;
          .opt-right {
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
        }
      }
      // 电话咨询时长
      &.lawyerApp-res {
        .opt-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          font-size: 16px;
          font-weight: 600;
          .opt-right {
            // display: flex;
            // justify-content: flex-start;
            // align-items: center;
            .image-wrap {
              position: relative;
              width: 210px;
              height: 90px;
              cursor: pointer;
              .icon-close {
                position: absolute;
                top: -8px;
                right: -8px;
                font-size: 20px;
                cursor: pointer;
              }
            }
          }
        }
      }
      // 自动发单
      &.auto-pubOrder {
        .opt-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 14px;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}

.remark-modal {
  .modal-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
