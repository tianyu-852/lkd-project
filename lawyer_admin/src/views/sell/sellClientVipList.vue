<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
      </div>
      
      <span class="focus-text">{{ vip_type === 1 ? '会员开通人数' : '会员已过期人数' }}：{{ pagination.total }}</span>

      <!-- 搜索输入框 -->
      <div class="mobile-input-wrap">
        <a-input allow-clear placeholder="搜索手机号" v-model="searchMobile" @keyup.enter="getSearchData" style="margin: 0 5px; width: 140px" />
        <a-button type="primary" @click="getSearchData">搜索</a-button>
      </div>

      <!-- 时间筛选 -->
      <a-range-picker
        class="date-range-picker"
        @change="onDateChange"
        @ok="getSearchData"
        :placeholder="['开始日期', '结束日期']"
        :default-value="[filterInfo.startDate, filterInfo.endDate]"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
        }"
      />

      <!-- 销售 select -->
      <!-- <a-select style="width: 100px; margin-left: 10px;" v-model="exportvipType">
        <a-select-option v-for="vItem in exportVipTypeSelectList" :value="vItem.value" :key="vItem.value">
          {{ vItem.label }}
        </a-select-option>
      </a-select> -->

      <!-- 销售 select -->
      <!-- <a-select style="width: 100px; margin-left: 4px;" v-model="exportSellId">
        <a-select-option v-for="sItem in exportSellSelectList" :value="sItem.value" :key="sItem.value">
          {{ sItem.label }}
        </a-select-option>
      </a-select> -->
      <!-- 导出文件按钮 -->
      <!-- <a-popconfirm v-if="exportSellId !== 0" title="请确认是否导出?" ok-text="导出" cancel-text="取消" @confirm="exportClientFile(exportSellId)">
        <a-button style="margin: 0 5px; background: #2cbf78; border-color: #2cbf78; color: #fff">导出客户</a-button>
      </a-popconfirm> -->

      <!-- <a-popconfirm v-else title="请确认是否导出?" ok-text="导出" cancel-text="取消" @confirm="loopExportClientFile">
        <a-button style="margin: 0 5px; background: #2cbf78; border-color: #2cbf78; color: #fff">逐个客户</a-button>
      </a-popconfirm> -->
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <template v-if="selectedTableRowKeys.length">
          <div class="selected-title">已选中 {{ selectedTableRowKeys.length }} 项</div>
          <a-button icon="export" size="small" style="margin-left: 10px; margin-left: 30px;" @click="openTransferModal">转移</a-button>
        </template>

        <!-- 负责销售 -->
        <div v-if="layoutType === 1">
          <span style="font-size: 16px; font-weight: 500;">负责销售：</span>
          <a-select style="width: 100px; margin-top: 5px;" v-model="customer_id" @change="getSearchData">
            <a-select-option v-for="sItem in sellSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getQiyeClientList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :dataSource="clientDataList"
        :loading="clientDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.customer_log_id)"
        :rowSelection="{ selectedRowKeys: selectedTableRowKeys, onChange: onTableRowSelectChange }"
        :scroll="{ x: 1000 }"
        bordered
      >

        <!-- 手机号码 -->
        <a-table-column key="user" title="手机号码" align="center" fixed="left" width="160px">
          <template slot-scope="record">
            <div class="column-user-phone-wrap">
              <div>{{ record.mobile }}</div>
              <div class="call-wrap" @click="workbenchCallPhone(record)">
                <img class="call-img" :src="require('@/assets/service/call-phone.png')" />
              </div>
            </div>
          </template>
        </a-table-column>

        <!-- 注册时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="注册时间" align="center" width="150px" />

        <!-- 会员类型 -->
        <a-table-column align="center" width="134px">
          <div slot="title">会员类型</div>
          <template slot-scope="record">
            {{ record.vip_name || '无' }}
          </template>
        </a-table-column>

        <!-- 开通时间 -->
        <a-table-column dataIndex="vip_new_time" title="开通时间" align="center" width="150px" />

        <!-- 过期时间 -->
        <a-table-column dataIndex="vip_expired_time" title="过期时间" align="center" width="150px" />
        
        <!-- 注册平台 -->
        <a-table-column align="center" width="130px">
          <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span>注册平台</span>
            <a-select style="width: 100px; margin-top: 5px;" v-model="registerDeviceType" @change="getSearchData">
              <a-select-option v-for="sItem in registerPlatformSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>

          <template slot-scope="record">
            {{ record.register_device_type || '没有记录' }}
          </template>
        </a-table-column>

        <!-- 当前负责销售 -->
        <a-table-column v-if="customer_id === -1" align="center" width="130px">
          <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span>负责销售</span>
          </div>
          <template slot-scope="record">
            {{ record.customer_name || '暂无' }}
          </template>
        </a-table-column>

        <!-- 跟进记录 -->
        <a-table-column key="remark" title="跟进记录" align="center" width="200px">
          <template slot-scope="record">
            <div class="column-remark-wrap">
              <a-popover v-if="record.remark_info">
                <span slot="title">{{ record.remark_info.remark_creator }}</span>
                <template slot="content">
                  <div style="width: 360px;">{{ record.remark_info.remark }}</div>
                  <div>{{ record.remark_info.remark_time }}</div>
                </template>
                <div class="remark-info">
                  <div class="remark">{{ record.remark_info.remark }}</div>
                  <div class="remark-time">{{ record.remark_info.remark_time }}</div>
                </div>
              </a-popover>
              
              <div class="remark-plus" @click="openAddRemarkModal(record)">
                <a-icon type="plus-circle" />
              </div>
            </div>
          </template>
        </a-table-column>

        <!-- 标签 -->
        <a-table-column title="标签" align="center" width="160px">
          <template slot-scope="record">
            <div v-if="record.customer_labels" class="column-label-wrap" @click="openPutLabelModal(record, 1)">
              <a-tag v-for="(lItem, lIndex) in record.customer_labels" :key="lIndex" color="blue">{{ lItem.name }}</a-tag>
            </div>
            <a-tag v-else style="background: #fff; borderStyle: dashed; cursor: pointer;" @click="openPutLabelModal(record, 0)">
              <a-icon type="plus" />添加标签
            </a-tag>
          </template>
        </a-table-column>

        <a-table-column />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="190px">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 5px;" @click="openDetailDrawer(record)">详情</a-button>
            <a-button type="link" style="padding: 0;" @click="openVipModal(record)">会员服务</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 转移客户 modal -->
    <a-modal
      v-model="isShowTransferModal"
      :width="500"
      :afterClose="onTransferModalAfterClose"
      destroyOnClose
    >
      <div class="transfer-modal">
        <div class="modal-header">转移客户</div>
        <div class="transfer-title">指定销售人员</div>
        <a-select style="width: 100%" placeholder="请选择销售人员" @change="onTransferModalChangeEvt">
          <a-select-option v-for="sItem in transferSellSelectList" :value="sItem.value" :key="sItem.value">
            {{ sItem.label }}
          </a-select-option>
        </a-select>

        <div class="modal-footer">
          <a-button @click="isShowTransferModal = false">取消</a-button>
          <a-button type="primary" style="background: #1790ff; border-color: #1790ff; margin-left: 20px;" @click="onTransferModalOkEvt">确定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 跟进记录 modal -->
    <a-modal
      v-model="remarkModal.isShowRemarkModal"
      :width="600"
      :afterClose="() => { remarkModal.remark = ''; remarkModal.recordId = 0; }"
      destroyOnClose
    >
      <div class="remark-modal">
        <div class="modal-header">添加跟进记录</div>
        <div class="modal-body">
          <a-textarea v-model="remarkModal.remark" placeholder="请输入跟进记录信息" :auto-size="{ minRows: 4 }" />
        </div>

        <div class="modal-footer">
          <a-button @click="remarkModal.isShowRemarkModal = false">取消</a-button>
          <a-button type="primary" style="background: #1790ff; border-color: #1790ff; margin-left: 20px;" @click="addRemarkRecord">确定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 标签 modal -->
    <a-modal
      v-model="isShowLabelModal"
      :width="600"
      :afterClose="() => labelCheckedIds = []"
      destroyOnClose
    >
      <div class="label-modal">
        <div class="modal-header">{{ labelModalType === 1 ? '更新标签' : '添加标签' }}</div>
        <div class="modal-body">
          <a-checkbox-group :defaultValue="labelCheckedIds" @change="onLabelCheckboxChange">
            <a-row>
              <a-col v-for="lItem in labelCheckboxList" :key="lItem.customer_label_id" :span="8">
                <a-checkbox :value="lItem.customer_label_id">{{ lItem.name }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>

        <div class="modal-footer">
          <a-button @click="isShowLabelModal = false">取消</a-button>
          <a-button type="primary" style="background: #1790ff; border-color: #1790ff; margin-left: 20px;" @click="onLabelModalOkEvt">确定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 会员服务 modal -->
    <a-modal
      v-model="vipModal.isShowVipModal"
      :width="500"
      :afterClose="onVipModalAfterClose"
      destroyOnClose
    >
      <div class="vip-modal">
        <div class="modal-header">会员服务</div>
        <div class="modal-body">
          <a-textarea v-model="vipModal.content" class="input-textarea" placeholder="请输入" :auto-size="{ minRows: 4 }" />
        </div>

        <div class="modal-footer">
          <a-button v-for="(vItem, vIndex) in vipList" :key="vIndex" type="primary" @click="sendVipMsgToUser(vItem.vip_id)">{{ vItem.vip_name }}{{ vItem.origin_price }}元</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 详情 drawer -->
    <a-drawer
      :title="deatilDrawer.clientRecord ? deatilDrawer.clientRecord.name : '详情'"
      :width="400"
      :visible="deatilDrawer.isShowDetailDrawer"
      @close="onDetailDrawerCloseEvt"
    >
      <div class="deatil-drawer">
        <a-tabs v-model="deatilDrawer.tabActiveKey" default-active-key="1">
          <!-- 跟进记录 -->
          <a-tab-pane key="1" tab="跟进记录">
            <div v-if="!deatilDrawer.isLoadClientRemarking && deatilDrawer.clientRemarkList.length" class="tabPane-remark-wrap">
              <div v-for="(rItem, rIndex) in deatilDrawer.clientRemarkList" :key="rIndex" class="remark-item">
                <div class="remark-creator">{{ rItem.admin_nickname }}</div>
                <div class="remark-content">{{ rItem.remark }}</div>
                <div class="remark-time">{{ rItem.created_at }}</div>
              </div>
            </div>
            <a-empty v-else-if="!deatilDrawer.isLoadClientRemarking && !deatilDrawer.clientRemarkList.length" />
            <a-spin v-else />
          </a-tab-pane>
          <!-- 通话记录 -->
          <a-tab-pane key="2" tab="通话记录" force-render>
            <div v-if="deatilDrawer.clientCallRecordList.length" class="tabPane-remark-wrap">
              <div v-for="(rItem, rIndex) in deatilDrawer.clientCallRecordList" :key="rIndex" class="call-item">
                <div class="call-file-wrap">
                  <div class="call-audio-title">
                    {{ rItem.callFileUrl ? '通话录音' : '无通话录音' }}
                    <span v-if="!rItem.callFileUrl">-{{ rItem.contactDisposition | callContactDisFilter }}</span>
                  </div>
                  <audio v-if="rItem.callFileUrl" class="call-audio" controls :src="rItem.callFileUrl" />
                </div>
                <div class="call-time">{{ rItem.callStartTime }}</div>
              </div>
            </div>
            <a-empty v-else-if="!deatilDrawer.clientCallRecordList.length" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-drawer>

    <!-- 阿里云呼 -->
    <div class="workbench-module">
      <div class="workbench-wrap">
        <div id="workbench"></div>
      </div>
      <div class="open-workbench-btn" @click="handleWBDisplay">云呼</div>
    </div>
  </a-layout>
</template>

<script>
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import moment from 'moment'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import * as sellApi from '@/api/sellApi'
import { mapState } from 'vuex'
import axios from 'axios'

// 转移销售人员信息
const SELL_TRANSFER_INFO = { toSellId: 0 }

// 跟进记录 modal info
const REMARK_MODAL_INFO = {
  remark: '', // 备注内容
  isShowRemarkModal: false, // 是否显示
  recordId: 0, // 待操作记录 id
}

// vip modal info
const VIP_MODAL_INFO = {
  isShowVipModal: false, // 是否显示
  userId: '', // 用户 id
  content: '您好，我是刚刚跟您电话沟通的法律管家，您可以直接点击下方开通咱们的会员，享受优质法律咨询'
}

// 详情 drawer info
const DETAIL_DRAWER_INFO = {
  isShowDetailDrawer: false, // 是否显示
  tabActiveKey: '1', // tab 激活 key
  clientRecord: null, // 客户记录
  clientRemarkList: [], // 客户跟进记录列表
  clientCallRecordList: [], // 客户通话记录列表
  isLoadClientRemarking: false, // 是否正在加载客户跟进记录 ing
}

export default {
  name: 'SellClientVipList',
  components: { TextWithRowButton },
  filters: {
    // 电话结束原因
    callContactDisFilter(value) {
      let _value = ''
      if (value === 'Success') _value = '正常'
      if (value === 'NoAnswer') _value = '未接通'
      if (value === 'Reject') _value = '客户拒接'
      if (value === 'AbandonedRing') _value = '振铃放弃'
      if (value === 'AbandonedInQueue') _value = '排队放弃'
      if (value === 'AbandonedInContactFlow') _value = 'IVR中放弃'
      return _value
    },
    // 选中的销售
    // selectedSell(value) {
      
    // },
  },
  data() {
    return {
      clientDataList: [], // 客户数据列表
      clientDataLoading: true, // 销售数据是否加载中
      selectedTableRowKeys: [], // 选中的 table 的 key 数组（ids）

      rouerSellUserId: 0, // 路由销售 id
      layoutType: 1, // 布局类型
      
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getQiyeClientList(page)
          this.pagination.current = page
        },
      },

      // 过滤条件
      filterInfo: {
        startDate: moment().add(-1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss'), // 开始时间
        endDate: moment().format('YYYY-MM-DD HH:mm:ss'), // 结束时间
      },

      searchMobile: '', // 搜索手机号

      sourceSelectList: [{ label: '全部', value: -1 }, { label: '飞鱼', value: 1 }, { label: '企业律云', value: 0 }, { label: '百姓律师', value: 2 }, { label: '百姓/企业', value: 3, } ], // 来源 select 列表
      source_tag: -1, // 选中的来源信息

      // 会员类型
      vip_type: 1,
      vipTypeSelectList: [
        { label: '未开通', value: 2, },
        { label: '已过期', value: 3, },
      ],

      // 平台 select 列表
      registerPlatformSelectList: [
        { label: '不限', value: -1, },
        { label: '苹果', value: 0, },
        { label: '安卓', value: 1, },
        { label: '微信小程序', value: 2, },
        { label: '字节小程序', value: 5, },
        { label: '快手小程序', value: 6, },
      ],
      registerDeviceType: -1, // 平台类型

      sellSelectList: [ { label: '全部', value: -1 } ], // 负责销售 select 列表
      customer_id: -1, // 选中的销售 Id

      exportSellSelectList: [], // 导出销售 select 列表
      exportSellId: -1, // 导出销售选中的销售 Id

      // 会员类型
      exportvipType: 0,
      exportVipTypeSelectList: [
        { label: '不限', value: 0, },
        { label: '未开通', value: 2, },
        { label: '已开通', value: 1, },
        { label: '已过期', value: 3, },
      ],

      isShowTransferModal: false, // 是否打开转移 Modal
      transferModalInfo: Object.assign({}, SELL_TRANSFER_INFO), // 转移客户 modal 信息
      transferSellSelectList: [], // 转移销售 select 列表

      isShowLabelModal: false, // 是否打开标签 Modal
      labelCheckboxList: [], // 标签 checkbox 列表
      labelCheckedIds: [], // 选中的标签 ids
      labelModalType: 0, // 标签 Modal 类型 0: 添加 1: 更新
      putClientLogId: 0, // 待更新客户

      // remarkModal: Object.assign({}, REMARK_MODAL_INFO), // 跟进记录 modal 
      remarkModal: { ...REMARK_MODAL_INFO }, // 跟进记录 modal 

      vipModal: { ...VIP_MODAL_INFO }, // 会员服务 modal 
      vipList: [], // vip列表

      deatilDrawer: { ...DETAIL_DRAWER_INFO }, // 详情 drawer

      workbenchLoginStatus: false, // 云呼上线状态
      workbenchBorderShowStatus: false, // 云呼叫工作平台弹框是否显示
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  async created() {
    this.vip_type = Number(this.$route.query.vipType) // url vip类型

    await this._geVipListApi()
    await this._getSellServiceList()
    this._getSellLabelList()
    this._getQiyeClientList()
  },
  mounted() {
    // 初始话云呼实例
    this.initWorkBench()
  },
  methods: {
    moment,
    /**
     * 云呼相关初始化
     */
    initWorkBench() {
      const _this = this
      // 处理请求源
      const ajaxOrigin = process.env.NODE_ENV === 'production' ? 'https://api.lawkd.com' : 'https://devapi.lawkd.com'
      window.workbench = new window.WorkbenchSdk({
        dom: 'workbench', // 挂载的元素
        width: '200px', // 面板的宽
        height: '460px', // 面板的高
        instanceId: 'lvkuaida',
        regionId: 'cn-shanghai', // 云呼服务器部署的集群
        ajaxOrigin: ajaxOrigin, // 请求源
        ajaxPath: '/api/web/ali/cloud/call', // 请求路径
        ajaxMethod: 'post', // 请求方式
        ajaxHeaders: {
          'X-Device-Type': 'admin',
          'X-Api-Version': 'v1',
          'X-Nonce': Math.random().toString(36).slice(-10),
          'X-Timestamp': new Date().getTime().toString().substr(0, 10),
          'Authorization': storage.get(ACCESS_TOKEN),
        },
        afterCallRule: 15,  // 挂机后的话后处理时间
        header: false, // 是否展示头部
        defaultVisible: false, // 默认是否展示面板
        useOpenApiSdk: false,
        exportErrorOfApi: true, // Toast提示接口的错误信息
        moreActionList: ['mobilePhoneAnswer', 'break', 'offline'],
        // sideNavList: ['呼入', '呼出', '通话记录', '转接', '监听', '我的工作', '设备检测', '设置'],
        sideNavList: ['呼入', '呼出', '通话记录', '设备检测', '设置'],
        // SDK对象实例化完成时触发
        onInit() {
          console.log('onInit')
          // window.workbench.register() // 想实现自动上线在此注册
          // window.workbench.changeVisible(true) // 实现初始化后显示面板
          // _this.workbenchBorderShowStatus = true
        },
        // 签入、上线时触发
        onLogIn() {
          console.log('上线成功')
          window.workbench.changeVisible(true) // 实现初始化后显示面板
          _this.workbenchLoginStatus = true // 上线成功
          _this.workbenchBorderShowStatus = true // 显示作坐席面板
          _this.$message.success('云呼上线成功')
        },
        onRegister(config) {
          console.log('注册', config)
        },
        // 当有一些错误信息的时候触发，可以获取error信息
        onErrorNotify(error) {
          console.log(error)
        },
        // 来电时触发，可以在该函数内获取到一个对象
        onCallComing(connid) {
          console.log('来电:', connid)
        },
        // 去电、拨号振铃时触发，可以在该函数内获取到一个对象
        onCallDialing(connid) {
          console.log('去电:', connid)
        },
        // 任何状态改变都会触发该函数
        onStatusChange(code) {
          console.log('任何状态改变:', code)
        },
        // 通话建立连接时触发
        onCallEstablish(callDetail) {
          console.log('通话建立连接:', callDetail)
        },
        // 通话结束时触发
        onCallRelease(callDetail) {
          console.log('通话结束时触发:', callDetail)
        },
        // 挂机时触发
        onHangUp(type) {
          console.log('通话结束时触发:', type)
        }
      })
    },

    /**
     * 获取获取 vip 列表
     */
     async _geVipListApi() {
       try {
         const { data: vipListData } = await sellApi.geVipListApi()
         this.vipList = vipListData
       } catch (error) {
         console.log(error)
       }
    },
    
    /**
     * 获取销售人员列表
     */
     async _getSellServiceList() {
       const page = 1
       const size = 50
       try {
         const { data: sellListData } = await sellApi.getSellListApi(page, size)
         // 处理销售列表
         for (const dItem of sellListData.data) {
           const selectOpt = { label: dItem.name, value: dItem.customer_id, }
           this.sellSelectList.push(selectOpt)
         }

         // 导出销售 select
         this.exportSellSelectList = [...this.sellSelectList]
         this.exportSellSelectList.splice(1, 0, { label: '逐个全部', value: 0 })

         // 过滤出我「销售」自己账号
         if (this.userInfo.seller.info) {
           const userSellerId = this.userInfo.seller.info.customer_id
           this.sellSelectList = this.sellSelectList.filter(item => item.value === userSellerId)
           this.customer_id = userSellerId // 选中的销售 Id

           this.exportSellSelectList = this.sellSelectList
           this.exportSellId = userSellerId // 选中的销售 Id
         }

          // url 路由销售 id
         if (this.$route.query.sellUserId) {
           this.customer_id = this.$route.query.sellUserId && Number(this.$route.query.sellUserId)
           // 非全部则过滤数组
           if (this.$route.query.sellUserId > 0) {
             this.sellSelectList = this.sellSelectList.filter(item => item.value === Number(this.$route.query.sellUserId))
           }
         }
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取企业律云用户列表
     */
    async _getQiyeClientList(page = 1) {
       this.clientDataLoading = true

       // 请求参数
       const param = {
         page,
         size: this.pagination.pageSize,
         mobile: this.searchMobile.trim(),
         start_time: this.filterInfo.startDate,
         end_time: this.filterInfo.endDate,
         vip_type: this.vip_type, // 会员类型
         register_device_type_id: this.registerDeviceType // 注册平台
        }

       // 添加来源筛选条件
       if (this.source_tag > -1) param.source_tag = this.source_tag
       // 添加销售筛选条件
       if (this.customer_id > 0) param.customer_id = this.customer_id

       try {
         const { data: qiyeUserData } = await sellApi.getQiyeClientApi(param)
         this.pagination.total = qiyeUserData.total
         this.clientDataList = qiyeUserData.data
         this.pagination.current = page
         
         this.selectedTableRowKeys = []
         this.clientDataLoading = false
       } catch (error) {
         this.clientDataLoading = false
         console.log(error)
       }
    },

    /**
     * RangePicker 发生变化的回调
     */
    onDateChange(date, dateStrAry) {
      this.filterInfo.startDate = dateStrAry[0]
      this.filterInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this._getQiyeClientList()
    },

    /**
     * 获取标签列表
     */
     async _getSellLabelList() {
       const param = { page: 1, size: 50 }

       try {
         const { data: labelListData } = await sellApi.getSellLabelListApi(param)
         this.labelCheckboxList = labelListData.data
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 重新搜索
     */
    getSearchData() {
      this._getQiyeClientList()
    },

    /**
     * 导出客户文件文件
     */
    exportClientFile(exportSellId) {
      if (this.filterInfo.startDate && this.filterInfo.endDate) {
        return new Promise((resolve, reject) => {
          axios({
            url: process.env.VUE_APP_API_BASE_URL + '/web/customer/management/customer/log/export',
            methods: 'get',
            params: {
              start_time: this.filterInfo.startDate,
              end_time: this.filterInfo.endDate,
              vip_type: this.exportvipType,
              customer_id: exportSellId > 0 ? exportSellId : undefined
            },
            responseType: 'blob',
            headers: {
              Authorization: this.$store.getters.token,
              'X-Timestamp': new Date().getTime().toString().substr(0, 10),
              'X-Nonce': Math.random().toString(36).slice(-10),
              'X-Api-Version': 'v1',
              'X-Device-Type': 'admin',
            },
          }).then(response => {
            console.log(response)
            if (response.data.type === 'application/json') {
              const reader = new FileReader()
              reader.readAsText(response.data, 'utf-8')
              reader.onload = () => {
                this.$message.error(JSON.parse(reader.result).message)
              }
            } else {
              // const name = this.filterInfo.startDate + '-' + this.filterInfo.endDate
              const name = this.exportSellSelectList.find(item => item.value === exportSellId)?.label
              var blob = new Blob([response.data], {
                // type: 'application/zip',
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              })
              var downloadElement = document.createElement('a')
              var href = window.URL.createObjectURL(blob)
              downloadElement.href = href
              downloadElement.download = name
              document.body.appendChild(downloadElement)
              downloadElement.click()
              document.body.removeChild(downloadElement)
              window.URL.revokeObjectURL(href)
            }
            resolve()
          })
        })
      } else {
        this.$message.error('请选择一个时间区间')
      }
    },

    /**
     * 循环导出客户文件
     */
    async loopExportClientFile() {
      const filterExportList = this.exportSellSelectList.filter(item => item.value > 0)
      console.log(filterExportList)

      for (const exItem of filterExportList) {
        await this.exportClientFile(exItem.value)
      }
    },

    /**
     * 监听行选中事件
     */
    onTableRowSelectChange(selectedRowKeys) {
      this.selectedTableRowKeys = selectedRowKeys
    },

    /**
     * 打开转移客户 modal
     */
    openTransferModal() {
      this.isShowTransferModal = true
      this._getTransferSellList()
    },

    /**
     * 转移客户 Modal 完全关闭后的回调
     */
    onTransferModalAfterClose() {
      // 重置转移销售人员信息
      this.transferModalInfo = Object.assign({}, SELL_TRANSFER_INFO)
    },

    /**
     * 监听转移客户 modal change事件 
     */
    onTransferModalChangeEvt(value) {
      this.transferModalInfo.toSellId = value
    },

    /**
     * 确定转移客户事件
     */
    async onTransferModalOkEvt() {
      const { transferModalInfo } = this
      if (!transferModalInfo.toSellId) return this.$message.warning('请指定销售人员')
      if (!this.selectedTableRowKeys.length) return this.$message.warning('请选择转移客户')

      this._transferBatchClientToAssignSell(transferModalInfo.toSellId, this.selectedTableRowKeys)
      this.isShowTransferModal = false
    },

    /**
     * 批量转移客户到指定销售
     * @param {Number} toSellId 指定转移销售
     */
    async _transferBatchClientToAssignSell(toSellId, transferClientIds) {
      const param = { type: 2, customer_id: toSellId, customer_log_ids: JSON.stringify(transferClientIds) }
      
      try {
        const { data: transferData } = await sellApi.transferBatchClientToAssignSellApi(param)
        this.$notification.success({ message: '转移成功', duration: 3 })
        // 更新当页数据
        this._getQiyeClientList(this.pagination.current)
        this.selectedTableRowKeys = []
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取转移销售人员列表
     */
     async _getTransferSellList() {
       const page = 1
       const size = 50
       try {
         const { data: sellListData } = await sellApi.getSellListApi(page, size)
         const tempTransferSelectList = []
         
         // 处理销售列表
         for (const dItem of sellListData.data) {
           const selectOpt = { label: dItem.name, value: dItem.customer_id, }
           tempTransferSelectList.push(selectOpt)
         }

         this.transferSellSelectList = tempTransferSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 打开添加跟进记录 modal
     */
    openAddRemarkModal(record) {
      this.remarkModal.recordId = record.customer_log_id
      this.remarkModal.isShowRemarkModal = true
    },

    /**
     * 添加跟进记录
     */
    async addRemarkRecord() {
      if (!this.remarkModal.remark.trim().length) return this.$message.warning('请输入跟进记录')
      const param = { remark: this.remarkModal.remark.trim(), customer_log_id: this.remarkModal.recordId }
      this.remarkModal.isShowRemarkModal = false

      try {
         const data = await sellApi.putQiyeClientRemarkApi(param)

         this.$notification.success({ message: '添加记录成功', duration: 3 })
        //  this.remarkModal = { ...REMARK_MODAL_INFO }
         // 更新当页数据
         this._getQiyeClientList(this.pagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * checkbox 变化时回调事件
     */
    onLabelCheckboxChange(checkedValues) {
      this.labelCheckedIds = checkedValues
    },


    /**
     * 打开 添加标签 modal
     */
    async openPutLabelModal(record, labelModalType) {
      this.labelModalType = labelModalType
      this.putClientLogId = record.customer_log_id // 待更新销售 id

      this._getSellLabelList()

      if (this.labelModalType === 1) {
        const labelCheckedIds = record.customer_labels.map(item => item.customer_label_id)
        this.labelCheckedIds = labelCheckedIds
      }

      this.isShowLabelModal = true
    },

    /**
     * 确定转移客户事件
     */
    async onLabelModalOkEvt() {
      const { labelCheckedIds } = this
      if (!labelCheckedIds.length) return this.$message.warning('请至少选中一个标签')

      this._putClientLabel(labelCheckedIds)
      this.isShowLabelModal = false
    },

    /**
     * 更新客户标签
     */
    async _putClientLabel(labelCheckedIds) {
      const { putClientLogId } = this
      if (!putClientLogId) return

      const param = { customer_label_ids: JSON.stringify(labelCheckedIds) }
      
      try {
        const { data } = await sellApi.putClientAddLabelApi(putClientLogId, param)
        this._getQiyeClientList(this.pagination.current)
        this.putClientLogId = 0
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取客户跟进记录列表
     */
     async _getClientRemarkList() {
      this.deatilDrawer.isLoadClientRemarking = true
      const param = { page: 1, size: 50, customer_log_id: this.deatilDrawer.clientRecord.customer_log_id }

      try {
       const { data: clientRemarkData } = await sellApi.getClientRemarkListApi(param)
        this.deatilDrawer.clientRemarkList = clientRemarkData.data
        this.deatilDrawer.isLoadClientRemarking = false
       } catch (error) {
         this.deatilDrawer.isLoadClientRemarking = false
         console.log(error)
       }
    },

    /**
     * 会员服务 Modal 完全关闭后的回调
     */
    onVipModalAfterClose() {
      // 重置会员服务信息
      this.vipModal = Object.assign({}, VIP_MODAL_INFO)
    },

    /**
     * 打开详情 drawer
     */
    openVipModal(record) {
      this.vipModal.userId = record.user_id
      this.vipModal.isShowVipModal = true
    },

    /**
     * 获取客户跟进记录列表
     */
    async sendVipMsgToUser(vipId) {
      console.log(vipId)
      if (!this.vipModal.content.trim()) return this.$message.warning('请输入内容')
      const param = { vip_id: vipId, invitees_user_id: this.vipModal.userId, content: this.vipModal.content }
      console.log(param)

      try {
        const { data } = await sellApi.sendVipMsgApi(param)
        this.vipModal.isShowVipModal = false
        this.$notification.success({ message: '发送成功', duration: 3 })
      } catch (error) {
        this.vipModal.isShowVipModal = false
        console.log(error)
      }
    },

    /**
     * 获取通话记录列表
     */
     async _getCallRecordList(mobileNum) {
      try {
        const callListparams = { action: 'ListCallDetailRecords', product: 'CloudCallCenter', region: 'cn-shanghai', version: '2020-07-01' }
        // const callListData = { PageNumber: 1, PageSize: 50, instanceId: 'lvkuaida', CalledNumber: '15328058249', StartTime: moment().add(-1, 'y').valueOf() }
        // const callListData = { PageNumber: 1, PageSize: 50, instanceId: 'lvkuaida', calledNumber: '15328058249' }
        const callListData = { PageNumber: 1, PageSize: 50, instanceId: 'lvkuaida', CalledNumber: mobileNum, StartTime: moment().add(-1, 'y').valueOf() }

        const { data: callRecordData } = await sellApi.getCloudCallListApi(callListparams, callListData)
        const callRecordList = callRecordData.list
        if (!callRecordList) return

        for (const callRecordItem of callRecordList) {
          // console.log(callRecordItem)
          callRecordItem.callFileUrl = '' // 通话文件
          callRecordItem.callStartTime = moment(callRecordItem.startTime).format('YYYY-MM-DD HH:mm:ss')

          if (callRecordItem.contactDisposition === 'Success') {
            const callFileparams = { action: 'GetMonoRecording', product: 'CloudCallCenter', region: 'cn-shanghai', version: '2020-07-01' }
            const callFileData = { contactId: callRecordItem.contactId, instanceId: 'lvkuaida' }
            const { data: callFileInfoData } = await sellApi.getCloudCallListApi(callFileparams, callFileData)
            callRecordItem.callFileUrl = callFileInfoData.fileUrl // 通话文件 url
          }
        }

        this.deatilDrawer.clientCallRecordList = callRecordList
       } catch (error) {
         this.deatilDrawer.isLoadClientRemarking = false
         console.log(error)
       }
    },

    /**
     * 打开详情 drawer
     */
    openDetailDrawer(record) {
      this.deatilDrawer.clientRecord = record
      this._getClientRemarkList()
      this._getCallRecordList(record.mobile)
      this.deatilDrawer.isShowDetailDrawer = true
    },

    /**
     * 关闭详情 drawer
     */
    onDetailDrawerCloseEvt() {
      this.deatilDrawer = { ...DETAIL_DRAWER_INFO }
    },

    /**
     * 打开云呼面板
     */
    handleWBDisplay() {
      if (this.workbenchBorderShowStatus) {
        window.workbench.changeVisible(false)
        this.workbenchBorderShowStatus = false
      } else {
        window.workbench.changeVisible(true)
        this.workbenchBorderShowStatus = true
      }
    },

    /**
     * 调取阿里云呼拨打电话
     */
    workbenchCallPhone(record) {
      const { workbenchLoginStatus } = this
      if (!workbenchLoginStatus) return window.workbench.register()
      const mobile = record.mobile
      // 拨打电话
      window.workbench.call(mobile, '', (callDetail) => {
        console.log('拨打电话:', callDetail)
      })

      window.workbench.changeVisible(true)
      this.workbenchBorderShowStatus = true
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
    .back {
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
      .icon-back {
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
    .date-range-picker {
      margin-left: auto;
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
    .selected-title {
      font-size: 14px;
      font-weight: bold;
    }
  }
  // 列 用户电话
  .column-user-phone-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    .call-wrap {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      cursor: pointer;
      .call-img {
        width: 100%;
        height: 100%;
      }
    }
  }
  // 更近记录
  .column-remark-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .remark-info {
      width: 140px;
      margin-right: 5px;
      text-align: left;
      .remark {
        color: #333;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .remark-plus {
      cursor: pointer;
      .anticon-plus-circle {
        cursor: pointer;
      }
    }
  }
  // 列 标签
  .column-label-wrap {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    cursor: pointer;
    .ant-tag {
      margin-right: 0;
      max-width: 100px;
      cursor: pointer;
      
      -webkit-line-clamp: 1;
      white-space: normal;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

/deep/.ant-modal-close,
/deep/.ant-modal-header,
/deep/.ant-modal-footer {
  display: none;
}
/deep/.ant-modal-body {
  padding: 0;
}
/deep/.ant-modal-content {
  border-radius: 16px 8px 16px 8px;
}

// 转移 modal
.transfer-modal {
  padding: 20px;
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .transfer-title {
    margin-bottom: 10px;
  }
  .modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      width: 80px;
      height: 30px;
    }
  }
}

// 标签 modal
.remark-modal {
  padding: 20px;
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      width: 80px;
      height: 30px;
    }
  }
}

// 标签 modal
.label-modal {
  padding: 20px;
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .modal-body {
    height: 200px;
    overflow-y: auto;
    .ant-checkbox-group {
      width: 100%;
      .ant-row {
        .ant-col {
          margin-bottom: 20px;
        }
      }
    }
  }
  .modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      width: 80px;
      height: 30px;
    }
  }
}

// vip modal
.vip-modal {
  padding: 20px;
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .modal-body {
    .input-textarea {
      font-size: 20px;
      background: #F5F5F5;
    }
  }
  .modal-footer {
    margin-top: 20px;
    display: flex;
    align-items: center;
    button {
      flex: 1;
      width: 80px;
      height: 40px;
      background: #1790ff;
      border-color: #1790ff;
      margin-right: 20px;
      &:last-child { margin-left: 0; }
    }
  }
}

// 详情 drawer
.deatil-drawer {
  .tabPane-remark-wrap {
    .remark-item {
      margin-bottom: 10px;
      .remark-creator {
        font-size: 14px;
        margin-bottom: 8px;
      }
      .remark-content {
        font-size: 14px;
        margin-bottom: 4px;
      }
      .remark-time {
        font-size: 12px;
        color: #8f949c;
      }
    }
  }
  .call-item {
    margin-bottom: 20px;
    .call-file-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .call-audio-title {
        font-size: 14px;
        margin-right: 10px;
      }
      .call-audio {
        width: 66%;
        height: 40px;
      }
    }
    .call-time {
      font-size: 14px;
      color: #8f949c;
      margin-top: 8px;
    }
  }
}

// 云呼模块
.workbench-module {
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 999;
  .workbench-wrap {
    background: #fff;
    margin-bottom: 20px;
  }
  .open-workbench-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: auto;
    color: #fff;
    background: #1790ff;
    cursor: pointer;
  }
}

</style>
