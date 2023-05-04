<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text" style="margin-right: 10px;">本地案源</span>

      <a-input allow-clear placeholder="搜索姓名/手机号" v-model="searchKey" @keyup.enter="_getCauseSourceVaildList" style="margin: 0 5px; width: 180px" />
      <a-button type="primary" style="margin-right: 10px;" @click="_getCauseSourceVaildList">搜索</a-button>

      <!-- 时间筛选 -->
      <a-range-picker
        @change="onRangePickerChange"
        @ok="refreshTableData()"
        style="width: 344px; margin: 0 10px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />

      <a-button type="primary" style="margin-left: auto" @click="openPublishCauseSourceModal">发布新案源</a-button>
      <a-button v-if="userInfo && openVipRoleList.includes(userInfo.name)" type="primary" style="margin-left: 10px; background: #41b583; border-color: #41b583;" @click="$router.push({ name: 'CauseSourceNativeSetRoute' })">免费领取设置</a-button>
    </a-layout-header>

    <a-layout-header class="tool-module">
      <span>地区筛选：</span>
      <a-cascader :options="regionSelectList" placeholder="请选择地区" @change="onRegionFactorCascaderChangeEvt" />

      <span style="margin-left: 10px;">来源筛选：</span>
      <a-select style="width: 100px; margin-left: 4px;" allowClear v-model="sourceValueFactor" @change="onSourceSelectChangeEvt">
        <a-select-option v-for="sItem in sourceSelectList" :value="sItem.value" :key="sItem.value">
          {{ sItem.label }}
        </a-select-option>
      </a-select>

      <span style="margin-left: 10px;;">已售次数筛选：</span>
      <a-select style="width: 130px; margin-left: 4px;" allowClear v-model="buyNumValueFactor" @change="onSourceSelectChangeEvt">
        <a-select-option v-for="sItem in buyNumSelectList" :value="sItem.value" :key="sItem.value">
          {{ sItem.label }}
        </a-select-option>
      </a-select>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <div v-if="stateData" class="state-module">
          <div class="state-wrap" style="margin-bottom: 6px;">
            <div class="state-item"><span>今日已售线索：</span><span style="color: #1790ff">{{ stateData.today_sell_num }}条;</span></div>
            <div class="state-item"><span>今日购买线索：</span><span style="color: #1790ff">{{ stateData.today_buy_num }}次;</span></div>
            <div class="state-item"><span>今日赠送线索：</span><span style="color: #1790ff">{{ stateData.today_give_away_num }}条;</span></div>
            <div class="state-item"><span>今日收益：</span><span style="color: #1790ff">￥{{ stateData.today_income }}元;</span></div>
          </div>
          <div class="state-wrap">
            <div class="state-item"><span>已售 1 次线索(总)：</span><span style="color: #333">{{ stateData.single_sale }}条;</span></div>
            <div class="state-item"><span>已售 2 次线索(总)：</span><span style="color: #333">{{ stateData.secondary_sale }}条;</span></div>
            <div class="state-item"><span>已售 3 次线索(总)：</span><span style="color: #333">{{ stateData.triple_sale }}条;</span></div>
          </div>
        </div>
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <!-- 进行中 -->
        <a-tab-pane key="1" :tab="'进行中 ' + '(' + tableVolidPagination.total + ')'">
          <a-table
            :data-source="tableValidList"
            :loading="tableValidLoading"
            :pagination="tableVolidPagination"
            :rowKey="(record) => String(record.local_case_source_id)"
            :scroll="{ x: 1500 }"
            bordered
          >
            <!-- 用户 -->
            <a-table-column key="nickname" title="用户" align="center" :width="200">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.case_user.nickname"
                    :avatar="record.case_user.avatar"
                    :mobile="record.case_user.mobile"
                    :user-id="String(record.case_user.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 地区-->
            <a-table-column title="地区" align="center">
              <template slot-scope="record">
                <div>{{ record.province }}/{{ record.city }}</div>
              </template>
            </a-table-column>

            <!-- 案源标签 -->
            <a-table-column dataIndex="lawyer_tag" title="案源标签" align="center" />

            <!-- 金额 -->
            <a-table-column dataIndex="price" title="金额" align="center" />

            <!-- 购买律师 -->
            <a-table-column title="购买律师" align="center">
              <template slot-scope="record">
                <a-popover title="购买律师">
                  <template slot="content">
                    <div v-for="(lItem, lIndex) in record.lawyer_list" :key="lIndex" style="margin-bottom: 6px; cursor: pointer;" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(lItem.user_id) } })">
                      <img style="width: 30px; height: 30px; border-radius: 50%; margin-right: 6px;" :src="lItem.avatar" />
                      <span style="font-weight: 500;">{{ lItem.nickname }}</span>
                    </div>
                  </template>
                  <div><span :style="{ color: record.buy_num > 0 ? '#1790ff' : '#999' }">{{ record.buy_num }}</span>/<span>{{ record.max_num }}</span> </div>
                </a-popover>
              </template>
            </a-table-column>

            <!-- 状态 -->
            <a-table-column title="状态" align="center">
              <template slot-scope="record">
                <div>
                  <span v-if="record.status === 0" style="color: #1790ff">正常</span>
                  <span v-else-if="record.status === 1" style="color: #e6a23c">已过期(7天以上)</span>
                  <span v-else-if="record.status === 2" style="color: #ff4d4f">购买上限</span>
                </div>
              </template>
            </a-table-column>

            <!-- 案源来源 -->
            <a-table-column title="案源来源" align="center">
              <template slot-scope="record">
                <div>
                  <span v-if="record.source === 0" >系统匹配</span>
                  <span v-else style="color: #1790ff">后台创建</span>
                </div>
              </template>
            </a-table-column>

            <!-- 发布时间 -->
            <a-table-column dataIndex="created_at" title="发布时间" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" :width="170">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px; color: #f56c6c;" @click="openOpenBestModal(record)">分配律师</a-button>
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'UserDetail', params: { userId: String(record.case_user.case_source_user_id) } })">查看用户</a-button>
                <!-- <a-popconfirm title="请确认是否删除?" ok-text="确认" cancel-text="取消" @confirm="delCauseSourceFeature(record)">
                  <a-button type="link" style="padding: 0; color: #ff4d4f;">关闭</a-button>
                </a-popconfirm> -->
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 本地案源 -->
        <a-tab-pane key="2" :tab="'已购买 ' + '(' + tablePayPagination.total + ')'">
          <a-table
            :data-source="tablePayList"
            :loading="tablePayLoading"
            :pagination="tablePayPagination"
            :rowKey="(record) => String(record.local_lawyer_case_source_id)"
            :scroll="{ x: 1400 }"
            bordered
          >
            <!-- 用户 -->
            <a-table-column title="用户" align="center" :width="200">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.case_user.nickname"
                    :avatar="record.case_user.avatar"
                    :mobile="record.case_user.mobile"
                    :user-id="String(record.case_user.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 购买律师 -->
            <a-table-column title="购买律师" align="center" :width="200">
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

            <!-- 地区-->
            <a-table-column title="地区" align="center">
              <template slot-scope="record">
                <div>{{ record.province }}/{{ record.city }}</div>
              </template>
            </a-table-column>

            <!-- 案源标签 -->
            <a-table-column dataIndex="lawyer_tag" title="案源标签" align="center" />

            <!-- 购买时间 -->
            <a-table-column dataIndex="pay_time" title="购买时间" align="center" />

            <!-- 金额 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                <span>金额</span>
                <a-select style="width: 120px; margin-top: 5px;" v-model="payModeActiveType" allowClear @change="_getCauseSourcePayList()">
                  <a-select-option v-for="sItem in payModeSelectList" :value="sItem.value" :key="sItem.value">
                    {{ sItem.label }}
                  </a-select-option>
                </a-select>
              </div>
              
              <template slot-scope="record">
                <div>￥{{ record.price }}<span v-if="record.type_text" style="color: #1790ff;">（{{ record.type_text }}）</span></div>
              </template>
            </a-table-column>

            <!-- 支付方式 -->
            <a-table-column dataIndex="pay_method_text" title="支付方式" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" fixed="right" align="center" :width="170">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'UserDetail', params: { userId: String(record.case_user.user_id) } })">查看用户</a-button>
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.lawyer.user_id) } })">查看律师</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 历史投放 -->
        <a-tab-pane key="3" :tab="'已关闭 ' + '(' + tableExpirePagination.total + ')'">
          <a-table
            :data-source="tableExpireList"
            :loading="tableExpireLoading"
            :pagination="tableExpirePagination"
            :rowKey="(record) => String(record.local_case_source_id)"
            :scroll="{ x: 1300 }"
            bordered
          >
            <!-- 用户 -->
            <a-table-column key="nickname" title="用户" align="center" :width="200">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.case_user.nickname"
                    :avatar="record.case_user.avatar"
                    :mobile="record.case_user.mobile"
                    :user-id="String(record.case_user.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 地区-->
            <a-table-column title="地区" align="center">
              <template slot-scope="record">
                <div>{{ record.province }}/{{ record.city }}</div>
              </template>
            </a-table-column>

            <!-- 案源标签 -->
            <a-table-column dataIndex="lawyer_tag" title="案源标签" align="center" />

            <!-- 购买律师 -->
            <a-table-column title="购买律师" align="center">
              <template slot-scope="record">
                <a-popover title="购买律师">
                  <template slot="content">
                    <div v-for="(lItem, lIndex) in record.lawyer_list" :key="lIndex" style="margin-bottom: 6px; cursor: pointer;" @click="$router.push({ name: 'LawyerDetail', params: { userId: lItem.user_id } })">
                      <img style="width: 30px; height: 30px; border-radius: 50%; margin-right: 6px;" :src="lItem.avatar" />
                      <span style="font-weight: 500;">{{ lItem.nickname }}</span>
                    </div>
                  </template>
                  <div><span :style="{ color: record.buy_num > 0 ? '#1790ff' : '#999' }">{{ record.buy_num }}</span>/<span>{{ record.max_num }}</span> </div>
                </a-popover>
              </template>
            </a-table-column>

            <!-- 金额 -->
            <a-table-column dataIndex="price" title="金额" align="center" />

            <!-- 案源来源 -->
            <a-table-column title="案源来源" align="center">
              <template slot-scope="record">
                <div>
                  <span v-if="record.source === 0">系统匹配</span>
                  <span v-else style="color: #1790ff">后台创建</span>
                </div>
              </template>
            </a-table-column>

            <!-- 发布时间 -->
            <a-table-column dataIndex="created_at" title="发布时间" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" fixed="right" align="center" :width="120">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'UserDetail', params: { userId: String(record.case_user.case_source_user_id) } })">查看用户</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 发布线索 modal -->
    <a-modal
      v-model="causeSourceNativeModalInfo.isShowPublishModal"
      title="发布线索"
      :width="400"
      @ok="confirmPublishCauseSourceNative"
    >
      <div class="publish-modal">
        <!-- 联系电话 -->
        <div class="publish-info-item">
          <div class="publish-info-left">
            <div class="info-title">联系电话：</div>
          </div>
          <div class="publish-info-middle">
            <a-input v-model="causeSourceNativeModalInfo.user_mobile" class="input" :maxLength="11" placeholder="联系手机号" allowClear />
          </div>
        </div>
        <!-- 所在地区 -->
        <div class="publish-info-item">
          <div class="publish-info-left">
            <div class="info-title">所在地区：</div>
          </div>
          <div class="publish-info-middle">
            <a-cascader :options="regionSelectList" placeholder="请选择地区" @change="onPublischCauseSourceRegionCascaderChangeEvt" />
          </div>
        </div>
        <!-- 案源标签 -->
        <div class="publish-info-item">
          <div class="publish-info-left">
            <div class="info-title">案源标签：</div>
          </div>
          <div class="publish-info-middle">
            <a-input v-model="causeSourceNativeModalInfo.lawyer_tag" class="input" :maxLength="10" placeholder="案源标签" allowClear />
          </div>
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
import * as causeSourceApi from '@/api/causeSourceApi'
import * as lawyerApi from '@/api/lawyer'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import UserVipCell from '@/components/User/UserVipCell'
import moment from 'moment'
import { mapState } from 'vuex'

// 本地案源 modal
const NATIVE_CAUSESOURCE_MODAL = {
  isShowPublishModal: false, // 是否显示附件 modal
  province_id: '', // 地域省份 id
  city_id: '', // 地域城市 id
  user_mobile: '', // 用户手机号
  lawyer_tag: '', // 案源标签
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
  local_case_source_id: '', // 案源记录 id
}

export default {
  name: 'CauseSourceNativePage',
  components: { UserVipCell, TextWithRowButton },
  filters: {
    userFileFilter(fileId, userFileList) {
      const fileInfo = userFileList.find(item => item.admin_file_id === fileId)
      if (fileInfo) return fileInfo.title
    }
  },
  data() {
    return {
      activeTabKey: '1',

      openBestModal: { ...OPENBEST_MODAL }, // 选择律师 modal
      
      tableValidList: [], // 有效案源列表
      tableValidLoading: false,
      tableVolidPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSourceVaildList(page)
          this.tableVolidPagination.current = page
        },
      },

      tableExpireList: [], // 已关闭案源
      tableExpireLoading: false,
      tableExpirePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSourceExpireList(page)
          this.tableExpirePagination.current = page
        },
      },

      payModeSelectList: [{ label: '购买', value: '2' }, { label: '赠送', value: '1' }], // 支付方式 select 列表
      payModeActiveType: '', // 选中的套餐 id

      tablePayList: [], // 已购买案源
      tablePayLoading: false,
      tablePayPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSourcePayList(page)
          this.tablePayPagination.current = page
        },
      },

      searchKey: '', // 搜索用户过关键字
      regionFactorInfo: { province_id: '', city_id: '' }, // 地区条件
      regionSelectList: [], // 律师地区 select 列表

      // 时间条件
      timeFactorInfo: { startDate: '', endDate: '' },

      causeSourceNativeModalInfo: Object.assign({}, NATIVE_CAUSESOURCE_MODAL), // 本地案源 modal

      sourceSelectList: [ { label: '后台发布', value: 1 }, { label: '系统匹配', value: 0 }, ], // 案源来源 select 列表
      sourceValueFactor: '', // 来源条件

      buyNumSelectList: [ { label: '已售 1 次', value: 1 }, { label: '已售 2 次', value: 2 }, { label: '已售 3 次', value: 3 }, { label: '已售 3+ 次', value: 4 }, { label: '已售 0 次', value: 0 }, ], // 购买次数 select 列表
      buyNumValueFactor: '', // 购买次数条件

      stateData: null, // 统计数据
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getCauseSourceVaildList()
    this._getCauseSourcePayList()
    this._getCauseSourceExpireList()

    this._getRegionList()
    this._getCaseSourceNativeState()
  },
  methods: {
    moment,
    // getData,

    /**
     * 获取本地案源统计数据
     */
    async _getCaseSourceNativeState() {
      try {
        const { data: stateData } = await causeSourceApi.getCaseSourceNativeStateApi()
        this.stateData = stateData
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
        const lawyerRegionCommonCityList = lawyerRegionData.cities

        var _regioinOptionList = []
        for (let i = 0; i < lawyerRegionCommonCityList.length; i++) {
          _regioinOptionList.push({ label: lawyerRegionCommonCityList[i].name, value: lawyerRegionCommonCityList[i].district_id, children: [] })
          for (let j = 0; j < lawyerRegionCommonCityList[i].cities.length; j++) {
            _regioinOptionList[i].children.push({ label: lawyerRegionCommonCityList[i].cities[j].name, value: lawyerRegionCommonCityList[i].cities[j].district_id })
          }
        }

        this.regionSelectList = _regioinOptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.timeFactorInfo.startDate = dateStrAry[0]
      this.timeFactorInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this._getCauseSourceVaildList()
    },

    /**
     * 监听地区筛选选择 事件
     */
    onRegionFactorCascaderChangeEvt(value, selectedOptions) {
      this.regionFactorInfo.province_id = value[0]
      this.regionFactorInfo.city_id = value[1]
      // this._getCauseSourceVaildList()
      this.refreshTableData()
    },

    /**
     * 获取案源有效 table 列表
     */
    async _getCauseSourceVaildList(page = 1) {
      const param = {
        page,
        size: this.tableVolidPagination.pageSize,
        status: 1,
        sort: 1,
      }

      // 已售条数筛选
      typeof this.buyNumValueFactor == 'number' && (param.buy_num = this.buyNumValueFactor) 
      // 来源筛选
      typeof this.sourceValueFactor !== 'string' && (param.source = this.sourceValueFactor) 
      // 搜索筛选
      this.searchKey.trim() && (param.name = this.searchKey.trim())
      // 时间筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)
      // 地区筛选
      if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_id = this.regionFactorInfo.province_id
        param.city_id = this.regionFactorInfo.city_id
      }

      this.tableValidLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceNativeListApi(param)
        this.tableValidList = causeSourceData.data
        this.tableVolidPagination.total = causeSourceData.total
        this.tableVolidPagination.current = page
        this.tableValidLoading = false
      } catch (error) {
        this.tableValidLoading = false
        console.log(error)
      }
    },

    /**
     * 获取已购买 table 列表
     */
     async _getCauseSourcePayList(page = 1) {
       const param = { page, size: this.tablePayPagination.pageSize }
       // 来源筛选
       typeof this.sourceValueFactor !== 'string' && (param.source = this.sourceValueFactor) 
       // 搜索筛选
       this.searchKey.trim() && (param.name = this.searchKey.trim())
       // 时间筛选
       this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
       this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)
       // 地区筛选
       if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
          param.province_id = this.regionFactorInfo.province_id
          param.city_id = this.regionFactorInfo.city_id
        }
       // 支付方式
       this.payModeActiveType && (param.type = this.payModeActiveType)
       this.tablePayLoading = true

       try {
         const { data: causeSourceNativeData } = await causeSourceApi.getLawyerCaseSourceNativeListApi(param)
         this.tablePayList = causeSourceNativeData.data
         this.tablePayPagination.total = causeSourceNativeData.total
         this.tablePayPagination.current = page
         this.tablePayLoading = false
       } catch (error) {
         this.tablePayLoading = false
         console.log(error)
       }
    },

    /**
     * 获取案源关闭 table 列表
     */
    async _getCauseSourceExpireList(page = 1) {
      const param = {
        page,
        size: this.tableExpirePagination.pageSize,
        status: 2,
        sort: 1,
      }

      // 已售条数筛选
      typeof this.buyNumValueFactor == 'number' && (param.buy_num = this.buyNumValueFactor) 
      // 来源筛选
      typeof this.sourceValueFactor !== 'string' && (param.source = this.sourceValueFactor) 
      // 搜索筛选
      this.searchKey.trim() && (param.name = this.searchKey.trim())
      // 时间筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)
      // 地区筛选
      if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_id = this.regionFactorInfo.province_id
        param.city_id = this.regionFactorInfo.city_id
      }

      this.tableExpireLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceNativeListApi(param)
        this.tableExpireList = causeSourceData.data
        this.tableExpirePagination.total = causeSourceData.total
        this.tableExpirePagination.current = page
        this.tableExpireLoading = false
      } catch (error) {
        this.tableExpireLoading = false
        console.log(error)
      }
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      if (this.activeTabKey === '1') this._getCauseSourceVaildList(this.tableVolidPagination.current)
      if (this.activeTabKey === '2') this._getCauseSourcePayList(this.tablePayPagination.current)
      if (this.activeTabKey === '3') this._getCauseSourceExpireList(this.tableExpirePagination.current)
    },

    /**
     * 后台发布 switch change 事件
     */
    onSourceSelectChangeEvt() {
      // this._getCauseSourceVaildList()
      this.refreshTableData()
    },

    /**
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      const userId = String(record.lawyer.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },

    /**
     * 打开发布本地案源 modal
     */
    openPublishCauseSourceModal() {
      this.causeSourceNativeModalInfo.isShowPublishModal = true
    },

    /**
     * 监听案源发布 modal 地区 事件
     */
    onPublischCauseSourceRegionCascaderChangeEvt(value, selectedOptions) {
      this.causeSourceNativeModalInfo.province_id = value[0]
      this.causeSourceNativeModalInfo.city_id = value[1]
    },

    /**
     * 发布 本地案源
     */
    async confirmPublishCauseSourceNative() {
      const { causeSourceNativeModalInfo } = this
      if (!causeSourceNativeModalInfo.user_mobile.trim()) return this.$message.warning('请输入手机号')
      if (!causeSourceNativeModalInfo.city_id) return this.$message.warning('请选择所在地区')
      if (!causeSourceNativeModalInfo.lawyer_tag.trim()) return this.$message.warning('请填写案源标签')
      this.causeSourceNativeModalInfo.isShowPublishModal = false

      const param = {
        mobile: causeSourceNativeModalInfo.user_mobile.trim(), // 当事人姓名
        province_id: causeSourceNativeModalInfo.province_id, // 省份 id
        city_id: causeSourceNativeModalInfo.city_id, // 城市 id
        lawyer_tag: causeSourceNativeModalInfo.lawyer_tag.trim(), // 案源标签
      }

      try {
        await causeSourceApi.createCaseSourceNativeApi(param)
        this.$notification.success({ message: '发布成功', duration: 3 })
        this.causeSourceNativeModalInfo = JSON.parse(JSON.stringify(NATIVE_CAUSESOURCE_MODAL))
        // 发布成功以后重新展示数据
        this._getCauseSourceVaildList(this.tableVolidPagination.current)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开选择律师 modal
     */
    async openOpenBestModal(record) {
      if (this.openBestModal.searchLawyerKeyword.trim()) this.openBestModal.page = 1
      const param = { page: this.openBestModal.page, size: 20, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getLawyerPage(param)
        if (this.openBestModal.page === 1) {
          this.openBestModal.waitOpenBestLawyerList = []
          // 获取特定的律师
          const { data: specificLawyerData } = await lawyerApi.getLawyerSpecialIncomeSetListApi({ page: 1, size: 300, type: 5 })
          this.openBestModal.waitOpenBestLawyerList.push(...specificLawyerData.data.map(item => item.user))
        }


        this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data.map(item => ({ ...item, balance: '0' })))
        this.openBestModal.total = waitOpenBestData.total

        this.openBestModal.local_case_source_id = record.local_case_source_id
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
        const param = { page: this.openBestModal.page, size: 20, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
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
     * 监听选择选律师列表 modal ok 事件 | 分配本地案源给律师
     */
    async onOpenModalOkEvt() {
      const { openBestModal } = this
      if (!openBestModal.local_case_source_id) return this.$message.warning('请选择案源')
      if (!openBestModal.activeLawyer.user_id) return this.$message.warning('请选择律师')
      this.openBestModal.isShowOpenLawyerModal = false

      const param = { local_case_source_id: openBestModal.local_case_source_id, user_id: openBestModal.activeLawyer.user_id }
      try {
        await causeSourceApi.dispatchNativeCauseSourceToLawyerApi(param)
        this.$notification.success({ message: '分配成功', duration: 3 })
        this._getCauseSourceVaildList(this.tableVolidPagination.current)
        this.openBestModal.activeLawyer = {}
        this.openBestModal.searchLawyerKeyword = ''
        this.openBestModal.waitOpenBestLawyerList = []
        this.openBestModal.page = 1
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除案源精选
     * !注：未使用
     */
    async delCauseSourceFeature(record) {
      const param = { order_no: record.local_case_source_id }
      try {
        const { data: causeSourceData } = await causeSourceApi.delCauseSourceFeatureApi(param)
        this._getCauseSourceVaildList(this.tableVolidPagination.current)
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

.tool-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  height: 60px;
  padding: 0;
  padding-left: 10px;
}


.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .state-module {
      .state-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        .state-item {
          font-size: 14px;
          font-weight: bold;
          margin-right: 20px;
          margin-bottom: 8px;
        }
      }
    }
  }
  // 列 标签
  .column-label {
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
  .column-image {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    .image-item {
      height: 80px;
      cursor: pointer;
    }
  }
  .column-file {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 6px;
    .file-item {
      font-size: 12px;
      color: #0085FF;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      /* ! autoprefixer: off */
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }
}

// 发布线索 modal
.publish-modal {
  .publish-info-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #333;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .publish-info-left {
      min-width: 100px;
      .info-title {
        font-size: 14px;
        font-weight: 600;
      }
    }
    .publish-info-middle {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .input {
        width: 180px;
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
