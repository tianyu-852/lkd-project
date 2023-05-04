<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="top-prefix">
        <span class="focus-text">用户数量:{{ pagination.total }}</span>
        <!-- 会员类型 -->
        <div>
          <span>会员类型：</span>
          <a-select :default-value="0" class="top-select" v-model="vipType" @change="getSearchPage">
            <a-select-option v-for="type in types" :value="type.value" :key="type.label">
              {{ type.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 搜索输入框 -->
        <a-input allow-clear placeholder="搜索手机号/用户名" v-model="search" @keyup.enter="getSearchPage" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="getSearchPage">搜索</a-button>
      </div>
    </a-layout-header>

    <a-layout-header class="tool-module">
      <!-- 应用类型 -->
      <div>
        <span>应用类型：</span>
        <a-select :default-value="0" class="top-select" v-model="appType" style="width: 130px" @change="getSearchPage">
          <a-select-option v-for="type in APPList" :value="type.value" :key="type.label">
            {{ type.label }}
          </a-select-option>
        </a-select>
      </div>
      <!-- 注册平台 -->
      <div>
        <span>注册平台：</span>
        <a-select v-model="registerDeviceType" class="top-select" style="width: 130px" placeholder="请选择" @change="getSearchPage">
          <a-select-option v-for="rItem in registerPlatformSelectList" :value="rItem.value" :key="rItem.value">
            {{ rItem.label }}
          </a-select-option>
        </a-select>
      </div>

      <!-- 标签筛选 -->
      <div style="margin-right: 10px;">
        <span>标签筛选：</span>
        <a-select v-model="labelFactor" style="width: 130px" allowClear placeholder="请选择" @change="getSearchPage">
          <a-select-option v-for="rItem in labelSelectList" :value="rItem.value" :key="rItem.value">
            {{ rItem.label }}
          </a-select-option>
        </a-select>
      </div>

      <span>地区筛选：</span>
      <a-cascader :options="regionCascaderList" style="margin-left: 6px;" placeholder="请选择地区" @change="onUserRegionCascaderChangeEvt" />
    </a-layout-header>

    <a-layout-header class="tool-module">
      <!-- 注册时间段 -->
      <div>
        <span>注册时间段：</span>
        <a-range-picker
          v-model="registerTimeFactor"
          @change="onRegisterRangePickerChange"
          @ok="getUserPage(1, 0, '')"
          style="width: 340px;"
          format="YYYY-MM-DD HH:mm:ss"
          :disabled="notBehaviorFactor"
          :show-time="{
            hideDisabledOptions: true,
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }"
        />
      </div>

      <!-- <span style="margin-left: 10px; margin-right: 10px;">无行为用户筛选(一个月内注册): </span>
      <a-switch v-model="notBehaviorFactor" @change="onNotBehaviorSwitchChangeEvt" /> -->
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="getUserPage(pagination.current, vipType, search)">刷新</a-button>
      </div>

      <a-table
        :data-source="data"
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => String(record.user_id)"
        :scroll="{ x: 1800 }"
        bordered
      >
        <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->

        <!-- 用户昵称 -->
        <a-table-column key="nickname" title="用户昵称" align="center" :width="270">
          <template slot-scope="record">
            <div style="text-align: center">
              <span>{{ record.nickname }}</span>
              <img v-show="record.is_enterprise_auth === 1" :src="require('@/assets/user/qy_icon@2x.png')" style="width: 56px; height: 15px" />

              <br />
              <template v-if="record.call_count">
                <a-tag color="#41b583" style="margin-top: 4px; border-radius: 4px;">共发起 {{ record.call_count }}次 电话咨询</a-tag>
                <div v-if="record.call_last_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: '#41b583' }">
                  <span>上一次咨询时间: {{ record.call_last_time }}</span>
                </div>
              </template>

              <div>最后登录时间：{{ record.active_at }}</div>
              <div>最后登录地址：{{ record.location_address }}</div>

              <!-- <a-button type="primary" size="small" @click="openPhoneOrderModal(record)">发布电话咨询</a-button> -->
            </div>
          </template>
        </a-table-column>

        <!-- 手机号 -->
        <a-table-column key="mobile" data-index="mobile" title="用户手机号" align="center" :width="140" />

        <!-- 注册时间 -->
        <a-table-column key="register_at" title="注册时间" align="center" :width="140">
          <template slot-scope="record">
            <div style="text-align: center">{{ record.register_at }}</div>
            <!-- {{ record.register_address }} -->
          </template>
        </a-table-column>

        <!-- 注册应用 -->
        <a-table-column key="source_type" data-index="source_type" title="注册应用" align="center" :width="140" />
        
        <!-- 注册平台 -->
        <a-table-column key="register_device_type" data-index="register_device_type" title="注册平台" align="center" :width="140" />

        <!-- 最后活跃时间|地点 -->
        <!-- <a-table-column key="active_at" title="最后登录时间|地点" align="center" :width="260">
          <template slot-scope="record">
            <div>{{ record.active_at }} {{ record.location_address }}</div>
          </template>
        </a-table-column> -->

        <!-- 手机品牌 -->
        <a-table-column align="center" width="200px">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>手机品牌</span>
            <a-select v-model="phoneBrandFactor" allowClear @change="getUserPage(1)" style="width: 140px">
              <a-select-option v-for="type in phoneBrandSelectList" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            <div class="column-remark-wrap">
              <div class="remark-info">
                <div v-if="record.phone_brand" class="remark">{{ record.phone_brand }}</div>
              </div>
              
              <div class="remark-plus" @click="openUpdateUserPhoneBrandModal(record)">
                <a-icon type="plus-circle" />
              </div>
            </div>
          </template>
        </a-table-column>

        <!-- 会员类型 -->
        <a-table-column key="vip_type" data-index="vip_type" title="会员类型" align="center" />

        <!-- 律师函数量 -->
        <a-table-column data-index="lawyer_letter_num" title="律师函数量" align="center" />

        <!-- 状态 -->
        <a-table-column key="status" title="状态" align="center">
          <template slot-scope="record">
            <a-popconfirm placement="top" ok-text="是的" cancel-text="不是" @confirm="setUserStatus(record)">
              <template slot="title">
                <p>是否要{{ userStatusTextReverse(record.status) }}该用户</p>
              </template>
              <div class="user-status clickable" :class="userStatusClass(record.status)" v-show="!record.isLoading">
                <div class="user-status-icon" :class="userIconClass(record.status)"></div>
                <span>{{ userStatusText(record.status) }}</span>
              </div>
            </a-popconfirm>

            <div class="user-status text-primary" v-show="record.isLoading">
              <q-spinner-facebook />
            </div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="240px">
          <template slot-scope="text, record">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center" >
              <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">详情</a-button>
              <a-popconfirm placement="leftBottom" ok-text="清除" cancel-text="取消" @confirm="blockedUsers(record.user_id)" >
                <template slot="title">
                  <span>
                    请确认是否清空数据? 确认后，将清除该用户的所有问答、<br />
                    评论、回复、点赞，并在APP内，所有列表不展示
                  </span>
                </template>
                <a-button style="margin: 5px; color: #ffffff; background-color: #f1c40f; border-color: #f1c40f" size="small" >清除</a-button>
              </a-popconfirm>
              <user-muted-button v-model="record.is_muted" :user-id="String(record.user_id)" style="width: 58px; height: 34px" />
              <a-popconfirm title="请确认是否减少他的律师函数量?" ok-text="确定" cancel-text="取消" @confirm="confirmPostLawyerLetter(record)">
                <a-button type="link" style="padding: 0;">减少律师函</a-button>
              </a-popconfirm>
              <!-- 消费记录 -->
              <a-button type="link" style="margin: 5px" size="small" @click="navToUserExpenseRecordPage(record)">消费记录</a-button>

              <a-button style="margin: 5px" size="small" @click="openApproveEnterpriseModal(record)">认证法务公司</a-button>
              <!-- 转预认证律师 -->
              <!-- <a-button v-if="record.is_lawyer_staff" type="link" style="margin: 5px; color: #41b583;" size="small">已转为预认证</a-button>
              <a-popconfirm v-else-if="userInfo && openVipRoleList.includes(userInfo.name)" title="是否转预认证律师?" @confirm="confirmTransferReadyAuthLawyer(record)">
                <a-button type="link" style="margin: 5px; color: #1790ff;" size="small">转预认证律师</a-button>
              </a-popconfirm> -->

              <!-- <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                <a-popconfirm title="设为「有效」用户?" @confirm="confirmSetValidUser(record, 1)">
                  <a-button type="link" style="padding: 0; color: #41b583;">设为有效用户</a-button>
                </a-popconfirm>
                <a-popconfirm title="设为「无效」用户?" @confirm="confirmSetValidUser(record, 0)">
                  <a-button type="link" style="padding: 0; color: #f56c6c;">设为无效用户</a-button>
                </a-popconfirm>
              </template> -->
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 手机品牌 modal -->
    <a-modal
      class="phone-modal"
      v-model="phoneBrandModal.isShowPhoneBrandModal"
      title="更新手机品牌"
      :width="400"
      :afterClose="() => { phoneBrandModal.phone_brand = ''; phoneBrandModal.userId = 0; }"
      destroyOnClose
      @ok="onUpdateUserPhoneBrandModalOkEvt"
    >
      <div class="remark-modal">
        <div class="modal-body">
          <a-input v-model="phoneBrandModal.phone_brand" placeholder="请输入手机品牌" />
        </div>
      </div>
    </a-modal>

    <!-- 发布电话咨询 modal -->
    <a-modal
      class="phoneOrder-modal"
      v-model="createPhoneOrderModal.isShowCreatePhoneOrderModal"
      :width="400"
      title="发布电话咨询"
      destroyOnClose
      :afterClose="onCreatePhoneOrderModalCloseEvt"
      @ok="onCreatePhoneOrderModalOkEvt"
    >
      <div class="createPhoneOrder-modal">
        <div class="createPhoneOrder-item">
          <div class="createPhoneOrder-item-left">用户</div>
          <div class="createPhoneOrder-item-right">
            <a-input v-model="createPhoneOrderModal.userName" placeholder="请输入用户名" />
          </div>
        </div>
        <div class="createPhoneOrder-item">
          <div class="createPhoneOrder-item-left">用户手机号</div>
          <div class="createPhoneOrder-item-right">
            <a-input v-model="createPhoneOrderModal.userMobile" placeholder="请输入用户手机号" />
          </div>
        </div>
        <div class="createPhoneOrder-item">
          <div class="createPhoneOrder-item-left">问题类型</div>
          <div class="createPhoneOrder-item-right">
            <a-select v-model="createPhoneOrderModal.category_id" style="width: 184px" @change="onPhoneOrderSelectChangeEvt">
              <a-select-option v-for="type in phoneOrderCategorySelectList" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select></div>
        </div>
        <div class="createPhoneOrder-item">
          <div class="createPhoneOrder-item-left">律师地域</div>
          <div class="createPhoneOrder-item-right">
            <a-cascader :options="regionCascaderList" placeholder="请选择地区" @change="onPhoneOrderCascaderChangeEvt" />
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 企业认证 modal -->
    <a-modal
      class="nativeNum-modal"
      v-model="approveEnterpriseModal.isShowApproveModal"
      title="认证法务公司"
      :width="500"
      :afterClose="() => { approveEnterpriseModal.nickname = ''; approveEnterpriseModal.enterpriseName = ''; approveEnterpriseModal.approveModalImageType = ''; }"
      destroyOnClose
      @ok="onApproveEnterpriseModalOkEvt"
    >
      <div class="nativeNum-modal-box">
        <!-- 用户名称 -->
        <div class="nativeNum-item">
          <div class="form-key">用户名称：</div>
          <div>{{ approveEnterpriseModal.nickname }}</div>
        </div>

        <!-- 认证公司名称 -->
        <div class="nativeNum-item">
          <div class="form-key">认证公司名称：</div>
          <a-input style="width: 200px" v-model="approveEnterpriseModal.enterpriseName" placeholder="请输入认证公司名称" />
        </div>

        <!-- 公司头像 -->
        <div class="nativeNum-item">
          <span class="form-key">公司头像:</span>
          <div class="image-wrap">
            <div v-if="approveEnterpriseModal.avatar" class="image-item" v-viewer>
              <img class="image" :src="approveEnterpriseModal.avatar" />
              <a-icon class="icon-close" type="close-circle" @click.stop="approveEnterpriseModal.avatar = ''" />
            </div>

            <div v-else class="image-upload" @click="chooseAdvertImage('avatarImage')">
              <a-icon type="plus" style="fontSize: 26px" />
            </div>
          </div>
        </div>

        <!-- 公司刑象图 -->
        <div class="nativeNum-item">
          <span class="form-key">公司刑象图:</span>
          <div class="image-wrap">
            <div v-for="(iItem, iIndex) in approveEnterpriseModal.figureImage" :key="iIndex" class="image-item" v-viewer >
              <img class="image" :src="iItem" />
              <a-icon class="icon-close" type="close-circle" @click.stop="approveEnterpriseModal.figureImage.splice(iIndex, 1)" />
            </div>

            <div v-if="approveEnterpriseModal.figureImage.length < 9" class="image-upload" @click="chooseAdvertImage('figureImage')">
              <a-icon type="plus" style="fontSize: 26px" />
            </div>
          </div>
        </div>

        <!-- 公司简介 -->
        <div class="nativeNum-item">
          <span class="form-key">活动描述:</span>
          <a-textarea style="width: 100%;" :auto-size="{ minRows: 3 }" v-model="approveEnterpriseModal.enterpriseIntro" placeholder="公司简介..." />
        </div>

        <!-- 公司宣传图 -->
        <div class="nativeNum-item">
          <span class="form-key">公司宣传图:</span>
          <div class="image-wrap">
            <div v-for="(iItem, iIndex) in approveEnterpriseModal.publicImage" :key="iIndex" class="image-item" v-viewer >
              <img class="image" :src="iItem" />
              <a-icon class="icon-close" type="close-circle" @click.stop="approveEnterpriseModal.publicImage.splice(iIndex, 1)" />
            </div>

            <div v-if="approveEnterpriseModal.publicImage.length < 9" class="image-upload" @click="chooseAdvertImage('publicImage')">
              <a-icon type="plus" style="fontSize: 26px" />
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 图片 input 多文件上传  -->
    <input
      v-if="isShowAdvertImageFileInput"
      id="input"
      ref="fileInputAdvertImageRef"
      type="file"
      style="display: none;"
      accept="image/*"
      multiple
      @change="onAdvertImageInputFileChange"
    />
  </a-layout>
</template>

<script>
import { getUserPage as getUserPageApi, setUserStatus, deleteUserDeleteCommunity, postLawyerLetterApi } from '@/api/user'
import moment from 'moment'
import * as userApi from '@/api/user'
import * as lawyerApi from '@/api/lawyer'
import * as causeSourceApi from '@/api/causeSourceApi'
import fileUtil from '@/utils/fileUtil'
import UserMutedButton from '@/components/User/UserMutedButton'
import { mapState } from 'vuex'

// 手机品牌 modal
const PHONE_BRAND_MODAL = {
  isShowPhoneBrandModal: false,
  userId: 0,
  phone_brand: '',
}

// 创建电话咨询 modal
const CREATE_PHONE_ORDER_MODAL = {
  isShowCreatePhoneOrderModal: false,
  user_id: '',
  category_id: '',
  category: '',
  lawyer_province_id: '',
  lawyer_city_id: '',
  userName: '',
  userMobile: '',
}

// 认证企业 modal
const APPROVE_ENTERPRISE_MODAL = {
  isShowApproveModal: false,
  userId: 0,
  nickname: '', // 名称
  enterpriseName: '', // 企业名称
  avatar: '', // 头像
  enterpriseIntro: '', // 企业简介
  figureImage: [], // 公司刑象图
  publicImage: [], // 公司宣传图
}

export default {
  name: 'UserIndexPage',
  components: { UserMutedButton },
  data() {
    return {
      isShowAdvertImageFileInput: true, // 是否显示上传案源图片 input
      approveModalImageType: '', //  图片类型，

      selectedRowKeys: [],
      HistoryData: [],
      data: [],
      search: '',
      bannedTime: '',
      bannedDescription: '',
      state: {
        confirmModal: false,
        loading: false,
      },

      // APP 类型
      appType: 0,
      APPList: [
        { label: '不限', value: 0, },
        { label: '百姓律师', value: 1, },
        { label: '企业律云', value: 2, },
        { label: '律师端', value: 3, },
      ],

      // 会员类型
      vipType: 0,
      types: [
        { label: '不限', value: 0, },
        { label: '已开通', value: 1, },
        { label: '未开通', value: 2, },
        { label: '已过期', value: 3, },
      ],

      // 注册平台 select 列表
      registerPlatformSelectList: [
        { label: '不限', value: -1, },
        { label: '苹果', value: 0, },
        { label: '安卓', value: 1, },
        { label: '微信小程序', value: 2, },
        { label: '字节小程序', value: 5, },
        { label: '快手小程序', value: 6, },
      ],
      registerDeviceType: -1, // 注册平台类型

      // 标签 select 列表
      labelSelectList: [
        { label: '发过电话咨询', value: 13, },
        { label: '发过私聊', value: 14, },
        { label: '发过帖子', value: 15, },
      ],
      labelFactor: '', // 已选标签

      // 有/无效 用户
      effectUser: 0,
      effectUserSelectList: [ { label: '有效用户', value: 1, }, { label: '无效用户', value: 0, }, ],

      regionCascaderList: [], // 地区 cascader 列表
      regionFactorInfo: { province_id: '', city_id: '' }, // 地区条件

      // 注册时间过滤条件
      registerTimeFactorInfo: { startDate: '', endDate: '', },
      registerTimeFactor: [],
      notBehaviorFactor: false, // 无行为筛选
      
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getUserPage(page, this.vipType, this.search)
          this.pagination.current = page
        },
      },
      phoneBrandModal: { ...PHONE_BRAND_MODAL }, // 手机品牌 modal

      phoneBrandSelectList: [
        { label: '苹果', value: '苹果', },
        { label: '华为', value: '华为', },
        { label: '三星', value: '三星', },
        { label: 'vivo', value: 'vivo', },
        { label: 'OPPO', value: 'OPPO', },
        { label: '魅族', value: '魅族', },
        { label: '其他', value: '其他', },
      ],
      phoneBrandFactor: '',

      createPhoneOrderModal: { ...CREATE_PHONE_ORDER_MODAL }, // 创建电话咨询订单 modal
      phoneOrderCategorySelectList: [], // 电话咨询订单 select 列表

      approveEnterpriseModal: { ...APPROVE_ENTERPRISE_MODAL }, // 赠送本地案源条数 modal
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),

    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['vipType'] = this.vipType
      condition['search'] = this.search
      condition['fromType'] = 'UserPage' // 用户详情跳转用的参考数据
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('userListCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.vipType = condition.vipType
      this.search = condition.search
      this.pagination.current = condition.current
      window.sessionStorage.removeItem('userListCondition')
      this.getUserPage(condition.current, condition.vipType, condition.search)
    } else if (this.$route.params.mobile) {
      this.search = this.$route.params.mobile
      this.getUserPage(1, 0, this.$route.params.mobile)
    } else {
      this.getUserPage(1, 0, '')
    }

    this._getRegionList()
    this._getPhoneOrderCategoryList()
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    moment,
    beforeunloadFn(e) {
      sessionStorage.setItem('userListCondition', JSON.stringify(this.conditionData))
    },
    redirectDetail(record) {
      sessionStorage.setItem('userListCondition', JSON.stringify(this.conditionData))
      const userId = String(record.user_id)
      this.$router.push({ name: 'UserDetail', params: { userId } })
    },
    getSearchPage() {
      this.pagination.current = 1
      this.getUserPage(1, this.vipType, this.search)
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
        this.regionCascaderList = _regioinOptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取电话咨询订单 分类列表
     */
     async _getPhoneOrderCategoryList(page = 1) {
       try {
         const { data: categoryData } = await userApi.getPhoneOrderCategoryApi()
         const _tempSelectList = []
         for (const lItem of categoryData.tag_data) {
           const selectOpt = { label: lItem.lawyer_tag, value: lItem.lawyer_tag_id }
           _tempSelectList.push(selectOpt)
         }

         this.phoneOrderCategorySelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听地区筛选选择 事件
     */
    onUserRegionCascaderChangeEvt(value, selectedOptions) {
      this.regionFactorInfo.province_id = value[0]
      this.regionFactorInfo.city_id = value[1]
      this.getUserPage()
    },

    /**
     * 获取用户列表
     */
    getUserPage(page = 1, vipType = 0, search = '') {
      this.state.loading = true
      const param = {
        page,
        vip_type: vipType,
        search,
        is_view_deleted: '',
        source_type: this.appType,
        register_device_type: this.registerDeviceType,
        is_effect: -1,
        is_behavior: -1,
      }

      // 无行为用户筛选
      if (this.notBehaviorFactor) {
        param.is_behavior = 0
      }

      // 时间筛选
      if (this.registerTimeFactor.length) {
        param.register_start_time = moment(this.registerTimeFactor[0]).format('YYYY-MM-DD HH:mm:ss')
        param.register_end_time = moment(this.registerTimeFactor[1]).format('YYYY-MM-DD HH:mm:ss')
      }

      // 地区筛选
      if (this.regionFactorInfo.city_id) param.location_city_id = this.regionFactorInfo.city_id
      // 标签筛选
      if (this.labelFactor) param.user_label_id = this.labelFactor

      // 添加手机品牌筛选
      if (this.phoneBrandFactor) {
        if (this.phoneBrandFactor === '其他') {
          param.is_other = 1
          param.phone = JSON.stringify(this.phoneBrandSelectList.map(item => item.value).filter(itm => itm !== '其他'))
        } else {
          param.phone = this.phoneBrandFactor
        }
      }
      
      getUserPageApi(param)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          data.data.map((item) => {
            item.isLoading = false
          })
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },

    /**
     * 注册时间 RangePicker 发生变化的回调
     */
    onRegisterRangePickerChange(date, dateStrAry) {
      console.log(dateStrAry)
      // 清空时间选择 重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this.getUserPage(1, 0, '')
    },

    /**
     * 24小时内
     */
    onNotBehaviorSwitchChangeEvt(checked) {
      console.log(checked)
      if (checked) {
        this.registerTimeFactor[0] = moment().add(-31, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
        this.registerTimeFactor[1] = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.registerTimeFactor = []
      }
      this.getUserPage(1, 0, '')
      // if (checked) this.time12HourFactor = false
      // this._getCauseSourceClueData()
    },
    
    userStatusTextReverse(status) {
      return this.userStatusText(status === 1 ? 0 : 1)
    },
    userStatusText(status) {
      switch (status) {
        case 0:
          return '启用'
        case 1:
          return '禁用'
      }
    },
    userStatusClass(status) {
      return {
        'user-status-blue': status === 0,
        'user-status-yellow': status === 1,
      }
    },
    userIconClass(status) {
      return {
        'user-status-blue-background': status === 0,
        'user-status-yellow-background': status === 1,
      }
    },
    blockedUsers(id) {
      deleteUserDeleteCommunity(id).then(() => {
        this.$message.success('清除成功')
      })
    },
    setUserStatus(record) {
      const status = record.status === 1 ? 0 : 1
      const text = `${this.userStatusText(status)}成功`

      record.isLoading = true

      setUserStatus(record.user_id, status)
        .then(() => {
          this.$message.success(text)
          record.status = status
        })
        .finally(() => {
          record.isLoading = false
        })
    },
    onSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    /**
     * 减少律师函数量
     */
    async confirmPostLawyerLetter(record) {
      try {
        const { data } = await postLawyerLetterApi({ user_id: record.user_id })
        // 更新当页数据
        this.getUserPage(this.pagination.current, this.vipType, this.search)
        this.$notification.success({ message: '操作成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开更新手机品牌 modal
     */
    openUpdateUserPhoneBrandModal(record) {
      this.phoneBrandModal.userId = record.user_id
      this.phoneBrandModal.phone_brand = record.phone_brand
      this.phoneBrandModal.isShowPhoneBrandModal = true
    },

    /**
     * 更新手机品牌
     */
    async onUpdateUserPhoneBrandModalOkEvt() {
      const { phoneBrandModal } = this
      const param = {
        user_id: phoneBrandModal.userId,
        phone_brand: phoneBrandModal.phone_brand.trim(),
      }
      this.phoneBrandModal.isShowPhoneBrandModal = false

      try {
         await lawyerApi.updateUserPhoneBrandApi(param)
         this.$notification.success({ message: '更新成功', duration: 3 })
         this.getUserPage(this.pagination.current, this.vipType, this.search)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 转为预认证律师
     */
    async confirmTransferReadyAuthLawyer(record) {
      const param = { user_id: record.user_id, }

      try {
         await lawyerApi.transferReadyAuthLawyerApi(param)
         this.$notification.success({ message: '转移成功', duration: 3 })
         this.getUserPage(this.pagination.current, this.vipType, this.search)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 导航用户 消费记录 页面
     */
    navToUserExpenseRecordPage(record) {
      sessionStorage.setItem('lawyerInfoSession', JSON.stringify({ avatar: record.avatar, nickname: record.nickname, mobile: record.mobile, user_id: record.user_id }))
      this.$router.push({ name: 'LawyerExpenseRecordRoute' })
    },

    /**
     * 监听地区筛选选择 事件
     */
    onPhoneOrderCascaderChangeEvt(value, selectedOptions) {
      this.createPhoneOrderModal.lawyer_province_id = value[0]
      this.createPhoneOrderModal.lawyer_city_id = value[1]
    },

    /**
     * 打开发布电话咨询 modal
     */
    openPhoneOrderModal(record) {
      this.createPhoneOrderModal.userName = record.nickname
      this.createPhoneOrderModal.userMobile = record.mobile
      this.createPhoneOrderModal.user_id = record.user_id
      this.createPhoneOrderModal.isShowCreatePhoneOrderModal = true
    },

    /**
     * 监听电话咨询 select change 事件
     */
    onPhoneOrderSelectChangeEvt(value) {
      const _findCategoryItem = this.phoneOrderCategorySelectList.find(item => item.value === value)
      console.log(_findCategoryItem)
      if (_findCategoryItem) {
        this.createPhoneOrderModal.category = _findCategoryItem.label
      }
    },

    /**
     * 监听创建电话咨询 modal close 事件
     */
    onCreatePhoneOrderModalCloseEvt() {
      this.createPhoneOrderModal = { ...CREATE_PHONE_ORDER_MODAL }
    },

    /**
     * 监听创建电话咨询 modal ok 事件
     */
    async onCreatePhoneOrderModalOkEvt() {
      if (!this.createPhoneOrderModal.category_id) return this.$message.warning('请选择问题分类')
      if (!this.createPhoneOrderModal.lawyer_city_id) return this.$message.warning('请选择律师地域')
      
      const param = {
        demand_type_id: 13,
        user_id: this.createPhoneOrderModal.user_id,
        lawyer_province_id: this.createPhoneOrderModal.lawyer_province_id,
        lawyer_city_id: this.createPhoneOrderModal.lawyer_city_id,
        category: this.createPhoneOrderModal.category,
        category_id: this.createPhoneOrderModal.category_id,
        other_contact: JSON.stringify({ name: this.createPhoneOrderModal.userName, mobile: this.createPhoneOrderModal.userMobile })
      }
      this.createPhoneOrderModal.isShowCreatePhoneOrderModal = false

      try {
         await userApi.createPhoneOrderApi(param)
         this.$notification.success({ message: '发布成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 设置是否有效用户
     */
    async confirmSetValidUser(record, status) {
      const param = { user_id: record.user_id, is_effect: status }

      try {
         await userApi.setValidUserApi(param)
         this.$notification.success({ message: '设置成功', duration: 3 })
         this.getUserPage(this.pagination.current, this.vipType, '')
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 打开认证企业 modal
     */
    openApproveEnterpriseModal(record) {
      this.approveEnterpriseModal.userId = record.user_id
      this.approveEnterpriseModal.nickname = record.nickname
      this.approveEnterpriseModal.isShowApproveModal = true
    },

    chooseAdvertImage(imgType) {
      this.isShowAdvertImageFileInput = true
      this.approveModalImageType = imgType
      this.$nextTick(() => {
        this.$refs.fileInputAdvertImageRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onAdvertImageInputFileChange(event) {
      const file = event.target.files[0]
      this.isShowAdvertImageFileInput = false
      
      try {
        const fileUrl = await fileUtil.uploadFile(file)
        // 企业头像
        if (this.approveModalImageType === 'avatarImage') {
          this.approveEnterpriseModal.avatar = fileUrl
        } else if (this.approveModalImageType === 'figureImage') {
          this.approveEnterpriseModal.figureImage.push(fileUrl)
        } else if (this.approveModalImageType === 'publicImage') {
          this.approveEnterpriseModal.publicImage.push(fileUrl)
        }
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听赠送本地案源条数 ok 事件
     */
    async onApproveEnterpriseModalOkEvt() {
      const { approveEnterpriseModal } = this
      if (!approveEnterpriseModal.enterpriseName.trim()) return this.$message.warning('请输入企业名称')

      const param = {
        user_id: approveEnterpriseModal.userId,
        nickname: approveEnterpriseModal.enterpriseName.trim(),
        introduction: approveEnterpriseModal.enterpriseIntro.trim(),
        avatar: approveEnterpriseModal.avatar,
        images: JSON.stringify(approveEnterpriseModal.figureImage),
        propaganda_images: JSON.stringify(approveEnterpriseModal.publicImage),
      }

      this.approveEnterpriseModal.isShowApproveModal = false      
      try {
         await userApi.postUserApproveEnterpriseApi(param)
         this.$notification.success({ message: '认证成功', duration: 3 })
         this.getUserPage(this.pagination.current, this.vipType, this.search)
       } catch (error) {
         console.log(error)
       }
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    height: 90px;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    &-prefix {
      display: flex;
      align-items: center;
    }

    &-select {
      margin-right: 20px;
      width: 100px;
    }

    &-date {
      width: 220px;
      margin-right: 16px;
    }

    input {
      width: 170px;
      margin-right: 20px;
    }

    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}

.user-status {
  display: flex;
  align-items: center;
  justify-content: center;

  &-icon {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3980ea;
    margin-right: 8px;
  }

  &-blue-background {
    background: #3980ea;
  }

  &-yellow-background {
    background: #ff9700;
  }

  &-blue {
    color: #3980ea;
  }

  &-yellow {
    color: #ff9700;
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

.phone-modal {
  /deep/.ant-modal-close,
  /deep/.ant-modal-header,
  /deep/.ant-modal-footer {
    display: block;
  }
  /deep/.ant-modal-body {
    padding: 20px;
  }
}

/deep/.ant-modal-close,
/deep/.ant-modal-header,
/deep/.ant-modal-footer {
  display: none;
}
/deep/.ant-modal-body {
  padding: 0;
  border-radius: 8px;
}

.tool-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  height: 60px;
  padding: 0;
  padding-left: 10px;
}

.phoneOrder-modal {
  /deep/.ant-modal-close,
  /deep/.ant-modal-header,
  /deep/.ant-modal-footer {
    display: block;
  }
  /deep/.ant-modal-body {
    padding: 20px;
  }
}

.createPhoneOrder-modal {
  .createPhoneOrder-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .createPhoneOrder-item-left {
      font-size: 14px;
      font-weight: bold;
      min-width: 80px;
    }
    .createPhoneOrder-item-right {
      flex: 1;
    }
  }
}

.nativeNum-modal {
  /deep/.ant-modal-close,
  /deep/.ant-modal-header,
  /deep/.ant-modal-footer {
    display: block;
  }
  /deep/.ant-modal-body {
    padding: 20px;
  }
  .nativeNum-modal-box {
    .nativeNum-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 30px;
      &:last-child { margin-bottom: 0; }
      .form-key {
        min-width: 100px;
        font-size: 14px;
        font-weight: 600;
      }
      .image-wrap {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        width: 100%;
        .image-item {
          position: relative;
          cursor: pointer;
          height: 100px;
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
          height: 100px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: #f5f5f5;
          border: dashed 1px #666;
        }
      }
    }
  }
}
</style>
