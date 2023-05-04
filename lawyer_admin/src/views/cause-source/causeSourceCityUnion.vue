<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">一城一律</span>

      <span style="font-size: 14px; font-weight: 500; margin-left: 20px;">地区筛选：</span>
      <a-cascader :options="regionCascaderList" placeholder="请选择地区" @change="onRegionCascaderFactorChangeEvt" />

      <div style="margin-left: auto;">
        <a-button type="primary" @click="openBestFormModal.isShowOpenFormModal = true">新增律师</a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="advertSeatActiveTabKey">
        <!-- 投放中 -->
        <a-tab-pane key="1" :tab="'投放中 ' + '(' + tableVolidPagination.total + ')'">
          <a-table
            :data-source="tableValidList"
            :loading="tableValidLoading"
            :pagination="tableVolidPagination"
            :rowKey="record => String(record.local_case_source_release_id)"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.lawyer.nickname"
                    :avatar="record.lawyer.avatar"
                    :mobile="record.lawyer.mobile"
                    :user-id="String(record.lawyer.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province }}</span>
                  <span v-if="record.city">-{{ record.city }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 有效期 -->
            <a-table-column title="有效期" align="center">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.start_time }}</div>
                  <div>至</div>
                  <div>{{ record.end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 案源匹配数量 -->
            <a-table-column title="案源匹配/总(条数)" align="center">
              <template slot-scope="record">
                <div><span style="color: #409eff;">{{ record.match_num }}</span> / {{ record.num }}</div>
              </template>
            </a-table-column>

            <!-- 服务费 -->
            <a-table-column title="服务费" align="center">
              <template slot-scope="record">
                <div style="color: #409eff;">￥{{ record.service_charge }}</div>
              </template>
            </a-table-column>

            <!-- 保证金 -->
            <a-table-column title="保证金" align="center">
              <template slot-scope="record">
                <div>￥{{ record.guarantee_money }}</div>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" :width="200">
              <template slot-scope="record">
                <a-button type="link" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.lawyer.user_id) } })">查看律师</a-button>
                <a-button type="link" @click="navToCityUnionLawyerMatchCauseSourcePage(record)">案源详情</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 待投放 -->
        <a-tab-pane key="0" :tab="'待投放 ' + '(' + tableUnStartPagination.total + ')'">
          <a-table
            :data-source="tableUnStartList"
            :loading="tableUnStartLoading"
            :pagination="tableUnStartPagination"
            :rowKey="record => String(record.local_case_source_release_id)"
            :scroll="{ x: 1700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.lawyer.nickname"
                    :avatar="record.lawyer.avatar"
                    :mobile="record.lawyer.mobile"
                    :user-id="String(record.lawyer.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province }}</span>
                  <span v-if="record.city">-{{ record.city }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 有效期 -->
            <a-table-column title="有效期" align="center">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.start_time }}</div>
                  <div>至</div>
                  <div>{{ record.end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 案源匹配数量 -->
            <a-table-column title="案源匹配条数" align="center">
              <template slot-scope="record">
                <div><span style="color: #409eff;">{{ record.match_num }}</span></div>
              </template>
            </a-table-column>

            <!-- 服务费 -->
            <a-table-column title="服务费" align="center">
              <template slot-scope="record">
                <div style="color: #409eff;">￥{{ record.service_charge }}</div>
              </template>
            </a-table-column>

            <!-- 保证金 -->
            <a-table-column title="保证金" align="center">
              <template slot-scope="record">
                <div>￥{{ record.guarantee_money }}</div>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" :width="200">
              <template slot-scope="record">
                <a-button type="link" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.lawyer.user_id) } })">查看律师</a-button>
                <a-button type="link" @click="navToCityUnionLawyerMatchCauseSourcePage(record)">案源详情</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 已过期 -->
        <a-tab-pane key="2" :tab="'已过期 ' + '(' + tableExpirePagination.total + ')'">
          <a-table
            :data-source="tableExpireList"
            :loading="tableExpireLoading"
            :pagination="tableExpirePagination"
            :rowKey="record => String(record.local_case_source_release_id)"
            :scroll="{ x: 1700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.lawyer.nickname"
                    :avatar="record.lawyer.avatar"
                    :mobile="record.lawyer.mobile"
                    :user-id="String(record.lawyer.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province }}</span>
                  <span v-if="record.city">-{{ record.city }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 有效期 -->
            <a-table-column title="有效期" align="center">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.start_time }}</div>
                  <div>至</div>
                  <div>{{ record.end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 案源匹配数量 -->
            <a-table-column title="案源匹配/总(条数)" align="center">
              <template slot-scope="record">
                <div><span style="color: #409eff;">{{ record.match_num }}</span> / {{ record.num }}</div>
              </template>
            </a-table-column>

            <!-- 服务费 -->
            <a-table-column title="服务费" align="center">
              <template slot-scope="record">
                <div style="color: #409eff;">￥{{ record.service_charge }}</div>
              </template>
            </a-table-column>

            <!-- 保证金 -->
            <a-table-column title="保证金" align="center">
              <template slot-scope="record">
                <div>￥{{ record.guarantee_money }}</div>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" :width="200">
              <template slot-scope="record">
                <a-button type="link" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.lawyer.user_id) } })">查看律师</a-button>
                <a-button type="link" @click="navToCityUnionLawyerMatchCauseSourcePage(record)">案源详情</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 添加合作律师 表单 modal -->
    <a-modal
      v-model="openBestFormModal.isShowOpenFormModal"
      :width="400"
      title="添加合作律师"
      destroyOnClose
      @ok="onOpenFormModalOkEvt"
    >
      <div class="open-form-modal">
        <div class="open-form-item">
          <div class="form-key">选择律师：</div>
          <div v-if="openBestFormModal.lawyer.user_id" style="display: flex;">
            <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="openBestFormModal.lawyer.avatar" />
            <div style="font-size: 16px; font-weight: bold;">
              <div>{{ openBestFormModal.lawyer.nickname }}</div>
              <div style="font-size: 15px; color: #999;">{{ openBestFormModal.lawyer.mobile }}</div>
            </div>
          </div>
          <a-button v-if="openBestFormModal.lawyer.user_id" type="primary" style="background: #f56c6c; border-color: #f56c6c; margin-left: 10px;" @click="openBestFormModal.lawyer = {}">更换</a-button>
          <a-button v-else type="primary" @click="openOpenBestModal">选择</a-button>
        </div>

        <!-- 投放地区 -->
        <div class="open-form-item">
          <span class="form-key">投放地区:</span>
          <a-cascader :options="regionCascaderList" :allowClear="false" placeholder="请选择地区" @change="onRegionCascaderChangeEvt" />
        </div>

        <!-- 开始时间 -->
        <div class="open-form-item">
          <span class="form-key">开始时间:</span>
          <a-date-picker v-model="openBestFormModal.start_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>

        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">结束时间:</span>
          <a-date-picker v-model="openBestFormModal.end_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>

        <!-- 保证金 -->
        <div class="open-form-item">
          <span class="form-key">保证金:</span>
          <a-input allow-clear placeholder="保证金" v-model="openBestFormModal.guarantee_price" style="width: 192px" />
        </div>

        <!-- 服务费 -->
        <div class="open-form-item">
          <span class="form-key">服务费:</span>
          <a-input allow-clear placeholder="服务费" v-model="openBestFormModal.price" style="width: 192px" />
        </div>

      </div>
    </a-modal>

    <!-- 选择律师 modal -->
    <a-modal
      v-model="openBestModal.isShowOpenLawyerModal"
      :width="600"
      destroyOnClose
      :afterClose="() => { openBestModal.page = 1; }"
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
  </a-layout>
</template>

<script>
import moment from 'moment'
import UserVipCell from '@/components/User/UserVipCell'
import * as advertApi from '@/api/advertApi'
import * as lawyerApi from '@/api/lawyer'
import * as causeSourceApi from '@/api/causeSourceApi'
const JSONbig = require('json-bigint')

// 添加合作律师 表单 modal
const OPENBEST_FORM_MODAL = {
  isShowOpenFormModal: false,

  lawyer: {}, // 律师 信息
  province_id: -1, // 地区省 id
  city_id: -1, // 地区市 id
  
  guarantee_price: '', // 保障金
  price: '', // 服务费
  start_time: '', // 开始时间
  end_time: '', // 结束时间
}

// 开通 选择律师 modal
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
  name: 'CauseSourceCityUnionPage',
  components: { UserVipCell },
  filters: {},
  data() {
    return {
      advertSeatActiveTabKey: '1', // 当前激活数据 tab 面板的 key

      regionFactorInfo: { province_id: 0, city_id: 0 }, // 地区条件
      regionCascaderList: [], // 地区 cascader 列表

      openBestModal: { ...OPENBEST_MODAL }, // 开通选择律师 modal
      openBestFormModal: { ...OPENBEST_FORM_MODAL }, // 广告位 modal

      tableValidList: [], // 投放中
      tableValidLoading: false, // 投放中数据是否加载中
      tableVolidPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerAdvertValidList(page)
          this.tableVolidPagination.current = page
        },
      },

      tableUnStartList: [], // 待投放
      tableUnStartLoading: false, // 待投放数据是否加载中
      tableUnStartPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerAdvertUnStartList(page)
          this.tableUnStartPagination.current = page
        },
      },

      tableExpireList: [], // 已过期
      tableExpireLoading: false, // 历史投放数据是否加载中
      tableExpirePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerAdvertExpireList(page)
          this.tableExpirePagination.current = page
        },
      },
    }
  },
  beforeCreate() { that = this },
  created() {
    this._getRegionList()

    this._getLawyerAdvertValidList()
    this._getLawyerAdvertUnStartList()
    this._getLawyerAdvertExpireList()
  },
  methods: {
    moment,

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
        this.regionCascaderList = [ ..._regioinOptionList ]
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听地区筛选选择 事件
     */
    onRegionCascaderFactorChangeEvt(value) {
      this.regionFactorInfo.province_id = value[0]
      this.regionFactorInfo.city_id = value[1]

      this._getLawyerAdvertValidList()
      this._getLawyerAdvertUnStartList()
      this._getLawyerAdvertExpireList()
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      this._getLawyerAdvertValidList()
      this._getLawyerAdvertUnStartList()
      this._getLawyerAdvertExpireList()
    },

    /**
     * 投放中列表
     */
     async _getLawyerAdvertValidList(page = 1) {
       const param = {
        page,
        size: this.tableVolidPagination.pageSize,
        province_id: this.regionFactorInfo.province_id || 0,
        city_id: this.regionFactorInfo.city_id || 0,
        status: 2,
       }
       this.tableValidLoading = true

       try {
         const { data: advertPositionData } = await causeSourceApi.getCauseSourceCityUnionLawyerApi(param)
         this.tableValidList = advertPositionData.data
         this.tableVolidPagination.total = advertPositionData.total
         this.tableVolidPagination.current = page
         this.tableValidLoading = false
       } catch (error) {
         this.tableValidLoading = false
         console.log(error)
       }
     },

     /**
     * 待投放列表
     */
     async _getLawyerAdvertUnStartList(page = 1) {
       const param = {
        page,
        size: this.tableVolidPagination.pageSize,
        province_id: this.regionFactorInfo.province_id || 0,
        city_id: this.regionFactorInfo.city_id || 0,
        status: 1,
       }
       this.tableUnStartLoading = true

       try {
         const { data: advertPositionData } = await causeSourceApi.getCauseSourceCityUnionLawyerApi(param)
         this.tableUnStartList = advertPositionData.data
         this.tableUnStartPagination.total = advertPositionData.total
         this.tableUnStartPagination.current = page
         this.tableUnStartLoading = false
       } catch (error) {
         this.tableUnStartLoading = false
         console.log(error)
       }
     },

     /**
     * 历史投放列表
     */
     async _getLawyerAdvertExpireList(page = 1) {
       const param = {
        page,
        size: this.tableVolidPagination.pageSize,
        province_id: this.regionFactorInfo.province_id || 0,
        city_id: this.regionFactorInfo.city_id || 0,
        status: 3,
       }
       this.tableExpireLoading = true

       try {
         const { data: advertPositionData } = await causeSourceApi.getCauseSourceCityUnionLawyerApi(param)
         this.tableExpireList = advertPositionData.data
         this.tableExpirePagination.total = advertPositionData.total
         this.tableExpirePagination.current = page
         this.tableExpireLoading = false
       } catch (error) {
         this.tableExpireLoading = false
         console.log(error)
       }
     },

    /**
     * 打开选择律师 modal
     */
    async openOpenBestModal() {
      if (this.openBestModal.searchLawyerKeyword.trim()) this.openBestModal.page = 1
      const param = { page: this.openBestModal.page, size: 30, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getLawyerPage(param)
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
        const param = { page: this.openBestModal.page, size: 30, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
        this.openBestModal.isSpinning = true

        try {
          const { data: waitOpenBestData } = await lawyerApi.getLawyerPage(param)
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

      this.openBestFormModal.lawyer = openBestModal.activeLawyer
      this.openBestModal.isShowOpenLawyerModal = false
    },

    /**
     * 监听地区筛选选择 事件
     */
    onRegionCascaderChangeEvt(value, selectedOptions) {
      this.openBestFormModal.province_id = value[0]
      this.openBestFormModal.city_id = value[1]
    },

    /**
     * 监听开通表单 modal ok 事件
     */
    async onOpenFormModalOkEvt() {
      const { openBestFormModal } = this
      if (!openBestFormModal.lawyer.user_id) return this.$message.warning('请选择律师')
      if (openBestFormModal.city_id < 0) return this.$message.warning('请选择地区')
      if (!openBestFormModal.start_time) return this.$message.warning('请选择开始时间')
      if (!openBestFormModal.end_time) return this.$message.warning('请选择结束时间')

      if (!openBestFormModal.guarantee_price.trim()) return this.$message.warning('请选择输入保障金')
      if (!openBestFormModal.price.trim()) return this.$message.warning('请选择输入服务费')

      this.openBestFormModal.isShowOpenFormModal = false

      const param = {
        user_id: openBestFormModal.lawyer.user_id, // 律师 id
        province_id: openBestFormModal.province_id,
        city_id: openBestFormModal.city_id || 0,
        start_time: moment(openBestFormModal.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(openBestFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
        guarantee_money: openBestFormModal.guarantee_price.trim(),
        service_charge: openBestFormModal.price.trim(),
       }

       try {
         await causeSourceApi.postCauseSourceCityUnionLawyerApi(param)
         this.openBestFormModal = Object.assign({}, OPENBEST_FORM_MODAL) // 重置
         this.refreshTableData()
         this.$notification.success({ message: '添加成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }

    },

    /**
     * 删除广告
     */
    async delAdvert(advertRecord) {
      const { advertisement_id } = advertRecord
      if (!advertisement_id) return

      try {
        await advertApi.delLawyerAdvertPositionApi({ advertisement_id })
        this.refreshTableData()
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 查看合作律师匹配的案源详情页
     */
    navToCityUnionLawyerMatchCauseSourcePage(record) {
      sessionStorage.setItem('bestLawyerDetail', JSON.stringify(record.lawyer))
      this.$router.push({ name: 'CauseSourceCityUnionDetailRoute', query: { causeSourceReleaseId: String(record.local_case_source_release_id) } })
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
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .qrcode-image {
    cursor: pointer;
    .qrcode-img {
      width: 180px;
      height: 80px;
    }
  }
}

.advert-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
      min-width: 74px;
    }
    .input {
      flex: 1;
    }
    .advert-sort-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .advert-sort-item {
        cursor: pointer;
        padding-right: 20px;
        margin-right: 30px;
      }
    }
  }
}

.open-form-modal {
  .open-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .form-key {
      min-width: 70px;
      font-size: 14px;
      font-weight: 600;
    }
    .image-wrap {
      width: 50%;
      .image-item {
        position: relative;
        cursor: pointer;
        height: 80px;
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
        height: 80px;
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

.open-modal {
  .open-body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    max-height: 280px;
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

.cropper-modal {
  height: 400px;
}
</style>
