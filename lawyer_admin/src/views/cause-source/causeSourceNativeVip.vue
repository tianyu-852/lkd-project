<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text" style="margin-right: 10px;">案源会员</span>

      <!-- <a-input allow-clear placeholder="搜索姓名/手机号" v-model="searchKey" @keyup.enter="_getCauseSource365VaildList" style="margin: 0 5px; width: 180px" />
      <a-button type="primary" style="margin-right: 10px;" @click="_getCauseSource365VaildList">搜索</a-button> -->

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

      <a-button v-if="userInfo && openVipRoleList.includes(userInfo.name)" type="primary" style="margin-left: auto" @click="openOpenBestModal">开通案源会员</a-button>
    </a-layout-header>

    <!-- <a-layout-header class="tool-module">
      <span>地区筛选：</span>
      <a-cascader :options="regionSelectList" placeholder="请选择地区" @change="onRegionFactorCascaderChangeEvt" />
    </a-layout-header> -->

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs class="a-tabs-nav" v-model="activeTabNavKey" :animated="false">
        <!-- 365套餐 -->
        <a-tab-pane key="1" tab="365套餐">
          <a-tabs v-model="active365TabKey" size="small" :tabBarStyle="{ fontSize: '16px' }">
            <!-- 进行中 -->
            <a-tab-pane key="1" :tab="'进行中 ' + '(' + table365VolidPagination.total + ')'">
              <a-table
                :data-source="table365ValidList"
                :loading="table365ValidLoading"
                :pagination="table365VolidPagination"
                :rowKey="(record) => String(record.local_package_warehouse_id)"
                :scroll="{ x: 1500 }"
                bordered
              >
                <!-- 律师 -->
                <a-table-column key="nickname" title="律师" align="center" :width="200">
                  <template slot-scope="record">
                    <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                      <user-vip-cell
                        :nickname="record.user.nickname"
                        :avatar="record.user.avatar"
                        :mobile="record.user.mobile"
                        :user-id="String(record.user.user_id)"
                        size="sm"
                      />
                    </div>
                  </template>
                </a-table-column>

                <!-- 开通套餐 -->
                <a-table-column title="开通套餐" align="center" width="220px">
                  <template slot-scope="record">
                    <div class="column-menu-wrap" :style="{ color:'#666' }">
                      <div>{{ record.optimization_plan || '365套餐' }}</div>
                    </div>
                  </template>
                </a-table-column>

                <!-- 套餐时间 -->
                <a-table-column title="套餐时间" align="center" width="200px">
                  <template slot-scope="record">
                    <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                      <div>{{ record.open_time }}</div>
                      <div>至</div>
                      <div>{{ record.end_time }}</div>
                    </div>
                  </template>
                </a-table-column>

                <!-- 金额 -->
                <!-- <a-table-column dataIndex="price" title="price" align="center" /> -->
                <a-table-column title="金额" align="center">
                  <template slot-scope="record">
                    <span>￥{{ record.price }}</span>
                  </template>
                </a-table-column>

                <!-- 支付方式 -->
                <a-table-column dataIndex="payment_type_text" title="支付方式" align="center" />

                <!-- 购买来源 -->
                <a-table-column title="购买来源" align="center">
                  <template slot-scope="record">
                    <div>
                      <span>{{ record.source_text }}</span>
                    </div>
                  </template>
                </a-table-column>

                <!-- 创建时间 -->
                <a-table-column dataIndex="created_at" title="创建时间" align="center" />

                <!-- 操作 -->
                <a-table-column key="action" title="操作" align="center" fixed="right" :width="120">
                  <template slot-scope="record">
                    <a-button type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.user.user_id) } })">查看律师</a-button>
                  </template>
                </a-table-column>
              </a-table>
            </a-tab-pane>

            <!-- 本地案源 -->
            <a-tab-pane key="2" :tab="'待开始 ' + '(' + table365WaitPagination.total + ')'">
              <a-table
                :data-source="table365WaitList"
                :loading="table365WaitLoading"
                :pagination="table365WaitPagination"
                :rowKey="(record) => String(record.local_lawyer_case_source_id)"
                :scroll="{ x: 1400 }"
                bordered
              >
                <!-- 律师 -->
                <a-table-column key="nickname" title="律师" align="center" :width="200">
                  <template slot-scope="record">
                    <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                      <user-vip-cell
                        :nickname="record.user.nickname"
                        :avatar="record.user.avatar"
                        :mobile="record.user.mobile"
                        :user-id="String(record.user.user_id)"
                        size="sm"
                      />
                    </div>
                  </template>
                </a-table-column>

                <!-- 开通套餐 -->
                <a-table-column title="开通套餐" align="center" width="220px">
                  <template slot-scope="record">
                    <div class="column-menu-wrap" :style="{ color:'#666' }">
                      <div>{{ record.optimization_plan || '365套餐' }}</div>
                    </div>
                  </template>
                </a-table-column>

                <!-- 套餐时间 -->
                <a-table-column title="套餐时间" align="center" width="200px">
                  <template slot-scope="record">
                    <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                      <div>{{ record.open_time }}</div>
                      <div>至</div>
                      <div>{{ record.end_time }}</div>
                    </div>
                  </template>
                </a-table-column>

                <!-- 金额 -->
                <a-table-column dataIndex="price" title="金额" align="center" />

                <!-- 支付方式 -->
                <a-table-column dataIndex="payment_type_text" title="支付方式" align="center" />

                <!-- 购买来源 -->
                <a-table-column title="购买来源" align="center">
                  <template slot-scope="record">
                    <div>
                      <span>{{ record.source_text }}</span>
                    </div>
                  </template>
                </a-table-column>

                <!-- 创建时间 -->
                <a-table-column dataIndex="created_at" title="创建时间" align="center" />

                <!-- 操作 -->
                <a-table-column key="action" title="操作" align="center" fixed="right" :width="120">
                  <template slot-scope="record">
                    <a-button type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.user.user_id) } })">查看律师</a-button>
                  </template>
                </a-table-column>
              </a-table>
            </a-tab-pane>

            <!-- 已到期 -->
            <a-tab-pane key="3" :tab="'已到期 ' + '(' + table365ExpirePagination.total + ')'">
              <a-table
                :data-source="table365ExpireList"
                :loading="table365ExpireLoading"
                :pagination="table365ExpirePagination"
                :rowKey="(record) => String(record.local_lawyer_case_source_id)"
                :scroll="{ x: 1400 }"
                bordered
              >
                <!-- 律师 -->
                <a-table-column key="nickname" title="律师" align="center" :width="200">
                  <template slot-scope="record">
                    <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                      <user-vip-cell
                        :nickname="record.user.nickname"
                        :avatar="record.user.avatar"
                        :mobile="record.user.mobile"
                        :user-id="String(record.user.user_id)"
                        size="sm"
                      />
                    </div>
                  </template>
                </a-table-column>

                <!-- 开通套餐 -->
                <a-table-column title="开通套餐" align="center" width="220px">
                  <template slot-scope="record">
                    <div class="column-menu-wrap" :style="{ color:'#666' }">
                      <div>{{ record.optimization_plan || '365套餐' }}</div>
                    </div>
                  </template>
                </a-table-column>

                <!-- 套餐时间 -->
                <a-table-column title="套餐时间" align="center" width="200px">
                  <template slot-scope="record">
                    <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                      <div>{{ record.open_time }}</div>
                      <div>至</div>
                      <div>{{ record.end_time }}</div>
                    </div>
                  </template>
                </a-table-column>

                <!-- 金额 -->
                <a-table-column dataIndex="price" title="金额" align="center" />

                <!-- 支付方式 -->
                <a-table-column dataIndex="payment_type_text" title="支付方式" align="center" />

                <!-- 购买来源 -->
                <a-table-column title="购买来源" align="center">
                  <template slot-scope="record">
                    <div>
                      <span>{{ record.source_text }}</span>
                    </div>
                  </template>
                </a-table-column>

                <!-- 创建时间 -->
                <a-table-column dataIndex="created_at" title="创建时间" align="center" />

                <!-- 操作 -->
                <a-table-column key="action" title="操作" align="center" fixed="right" :width="120">
                  <template slot-scope="record">
                    <a-button type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.user.user_id) } })">查看律师</a-button>
                  </template>
                </a-table-column>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>

        <!-- 条数套餐 -->
        <a-tab-pane key="2" :tab="'条数套餐 ' + '(' + tableCountVipPagination.total + ')'">
          <a-table
            :data-source="tableCountVipList"
            :loading="tableCountVipLoading"
            :pagination="tableCountVipPagination"
            :rowKey="(record) => String(record.local_package_warehouse_id)"
            :scroll="{ x: 1400 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="200">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.user.nickname"
                    :avatar="record.user.avatar"
                    :mobile="record.user.mobile"
                    :user-id="String(record.user.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 购买条数 -->
            <a-table-column title="购买条数" align="center" width="220px">
              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>{{ record.num }}条</div>
                </div>
              </template>
            </a-table-column>

            <!-- 购买时间 -->
            <a-table-column title="购买时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.pay_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 金额 -->
            <a-table-column title="金额" align="center">
              <template slot-scope="record">
                <span>￥{{ record.price }}</span>
              </template>
            </a-table-column>

            <!-- 支付方式 -->
            <a-table-column title="支付方式" align="center">
              <template slot-scope="record">
                <div>
                  <span v-if="record.status === 0" style="color: #1790ff">正常</span>
                  <span v-else-if="record.status === 1" style="color: #e6a23c">已过期(7天以上)</span>
                  <span v-else-if="record.status === 2" style="color: #ff4d4f">购买上限</span>
                </div>
              </template>
            </a-table-column>

            <!-- 购买来源 -->
            <a-table-column title="购买来源" align="center">
              <template slot-scope="record">
                <div>
                  <span>{{ record.source_text }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 创建时间 -->
            <a-table-column dataIndex="created_at" title="创建时间" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" :width="120">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.user.user_id) } })">查看律师</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 开通会员 选择律师 modal -->
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

    <!-- 开通会员 modal -->
    <a-modal
      v-model="causeSourceVipModal.isShowVipFormModal"
      :width="450"
      @ok="confirmOpenCauseSourceVipModal"
    >
      <div>
        <a-tabs class="a-tabs-nav" v-model="causeSourceVipModal.activeTabModal">
          <!-- 365套餐 -->
          <a-tab-pane key="1" tab="开通365套餐">
            <div class="publish-modal">
              <!-- 已选律师 -->
              <div class="open-form-item">
                <span class="form-key">已选律师:</span>
                <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="causeSourceVipModal.lawyer.avatar" />
                <div class="">
                  <div>{{ causeSourceVipModal.lawyer.nickname }}</div>
                  <div style="font-size: 15px; color: #999;">{{ causeSourceVipModal.lawyer.mobile }}</div>
                </div>
              </div>

              <!-- 套餐类型 -->
              <div class="open-form-item">
                <span class="form-key">套餐类型:</span>
                <a-select style="width: 192px;" v-model="causeSourceVipModal.local_package_id" @change="onOpenFormVip365ChangeEvt">
                  <a-select-option v-for="sItem in vip365SelectList" :value="sItem.value" :key="sItem.value">
                    {{ sItem.label }}
                  </a-select-option>
                </a-select>
              </div>

              <!-- 开始时间 -->
              <div class="open-form-item">
                <span class="form-key">套餐开始时间:</span>
                <a-date-picker v-model="causeSourceVipModal.start_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
              </div>
              <!-- 结束时间 -->
              <div class="open-form-item">
                <span class="form-key">套餐结束时间:</span>
                <a-date-picker v-model="causeSourceVipModal.end_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
              </div>

              <!-- 金额 -->
              <div class="open-form-item">
                <span class="form-key">套餐金额:</span>
                <a-input allow-clear placeholder="套餐金额" v-model="causeSourceVipModal.price" style="width: 192px" />
              </div>
            </div>
          </a-tab-pane>

          <!-- 条数套餐 -->
          <a-tab-pane key="2" tab="开通条数套餐">
            <div class="publish-modal">
              <!-- 已选律师 -->
              <div class="open-form-item">
                <span class="form-key">已选律师:</span>
                <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="causeSourceVipModal.lawyer.avatar" />
                <div class="">
                  <div>{{ causeSourceVipModal.lawyer.nickname }}</div>
                  <div style="font-size: 15px; color: #999;">{{ causeSourceVipModal.lawyer.mobile }}</div>
                </div>
              </div>

              <!-- 套餐类型 -->
              <div class="open-form-item">
                <span class="form-key">套餐类型:</span>
                <a-select style="width: 192px;" v-model="causeSourceVipModal.local_package_id" @change="onOpenFormVipCountChangeEvt">
                  <a-select-option v-for="sItem in vipCountSelectList" :value="sItem.value" :key="sItem.value">
                    {{ sItem.label }}
                  </a-select-option>
                </a-select>
              </div>

              <!-- 套餐条数 -->
              <div class="open-form-item">
                <span class="form-key">套餐条数:</span>
                <a-input allow-clear placeholder="套餐条数" v-model="causeSourceVipModal.num" style="width: 192px" />
              </div>

              <!-- 金额 -->
              <div class="open-form-item">
                <span class="form-key">套餐金额:</span>
                <a-input allow-clear placeholder="套餐金额" v-model="causeSourceVipModal.price" style="width: 192px" />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
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

// 选择律师 modal
const OPENBEST_MODAL = {
  isShowOpenLawyerModal: false,
  waitOpenBestLawyerList: [], // 待开通优选律师列表
  page: 1,
  total: 0,
  isSpinning: false, // 是否真正加载中
  searchLawyerKeyword: '', // 搜索律师关键字
  activeLawyer: {}, // 选中的律师 id
}

// 案源会员 modal
const CAUSESOURCE_VIP_MODAL = {
  isShowVipFormModal: false, // 是否显示 modal

  activeTabModal: '1',
  lawyer: {}, // 律师 信息

  local_package_id: '', // vip套餐 id
  start_time: '', // 开始时间
  end_time: '', // 结束时间
  num: '', // 套餐条数
  price: '', // 价格
}

export default {
  name: 'CauseSourceNativeVipPage',
  components: { UserVipCell, TextWithRowButton },
  data() {
    return {
      activeTabNavKey: '1', // 套餐导航 tab key
      active365TabKey: '1', // 365套餐 tab key
      
      table365ValidList: [], // 365 进行中案源vip列表
      table365ValidLoading: false,
      table365VolidPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSource365VaildList(page)
          this.table365VolidPagination.current = page
        },
      },

      table365WaitList: [], // 365 待开始案源vip列表
      table365WaitLoading: false,
      table365WaitPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSource365WaitList(page)
          this.table365WaitPagination.current = page
        },
      },

      table365ExpireList: [], // 365 已过期案源
      table365ExpireLoading: false,
      table365ExpirePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSource365ExpireList(page)
          this.table365ExpirePagination.current = page
        },
      },
      
      tableCountVipList: [], // 条数案源vip
      tableCountVipLoading: false,
      tableCountVipPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSourceCountVipList(page)
          this.tableCountVipPagination.current = page
        },
      },

      searchKey: '', // 搜索用户过关键字
      regionFactorInfo: { province_id: '', city_id: '' }, // 地区条件
      regionSelectList: [], // 地区 select 列表

      vip365SelectList: [], // 365套餐 select 列表
      vip365DataList: [], // 365套餐数据列表

      vipCountSelectList: [], // 条数套餐 select 列表
      vipCountDataList: [], // 条数套餐数据列表

      timeFactorInfo: { startDate: '', endDate: '' }, // 时间条件

      causeSourceVipModal: Object.assign({}, CAUSESOURCE_VIP_MODAL), // 案源vip modal
      openBestModal: { ...OPENBEST_MODAL }, // 开通vip律师 modal
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getRegionList()
    this._getCaseSourceVipMenuList(1)
    this._getCaseSourceVipMenuList(2)

    this._getCauseSource365VaildList()
    this._getCauseSource365WaitList()
    this._getCauseSource365ExpireList()
    this._getCauseSourceCountVipList()
  },
  methods: {
    moment,

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
     * 获取案源vip菜单 列表
     * vipType 1 条数套餐、2 365套餐
     */
     async _getCaseSourceVipMenuList(vipType = 1) {
       try {
         const { data: vipMenuData } = await causeSourceApi.getCaseSourceVipMenuListApi({ type: vipType })
          // 记录套餐数据源
          if (vipType === 1) {
            this.vipCountDataList = vipMenuData
          } else {
            this.vip365DataList = vipMenuData
          }

         for (const mItem of vipMenuData) {
           if (vipType === 1) {
             const selectOpt = { label: `套数套餐：${ mItem.title }`, value: mItem.local_package_id }
             this.vipCountSelectList.push(selectOpt)
           } else {
             const selectOpt = { label: `365套餐`, value: mItem.local_package_id }
             this.vip365SelectList.push(selectOpt)
           }
         }
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
      if (!dateStrAry[0] || !dateStrAry[1]) this._getCauseSource365VaildList()
    },

    /**
     * 监听地区筛选选择 事件
     */
    onRegionFactorCascaderChangeEvt(value, selectedOptions) {
      this.regionFactorInfo.province_id = value[0]
      this.regionFactorInfo.city_id = value[1]
      this.refreshTableData()
    },

    /**
     * 获取 356案源 有效table 列表
     */
    async _getCauseSource365VaildList(page = 1) {
      const param = {
        page,
        size: this.table365VolidPagination.pageSize,
        type: 2,
        status: 1
      }

      // 搜索筛选
      this.searchKey.trim() && (param.name = this.searchKey.trim())
      // 时间筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)

      this.table365ValidLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceVipListApi(param)
        this.table365ValidList = causeSourceData.data
        this.table365VolidPagination.total = causeSourceData.total
        this.table365VolidPagination.current = page
        this.table365ValidLoading = false
      } catch (error) {
        this.table365ValidLoading = false
        console.log(error)
      }
    },

    /**
     * 获取 356案源 待开始table 列表
     */
     async _getCauseSource365WaitList(page = 1) {
       const param = {
        page,
        size: this.table365WaitPagination.pageSize,
        type: 2,
        status: 2
      }

       // 搜索筛选
       this.searchKey.trim() && (param.name = this.searchKey.trim())
       // 时间筛选
       this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
       this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)
       this.table365WaitLoading = true

       try {
         const { data: causeSourceNativeData } = await causeSourceApi.getCaseSourceVipListApi(param)
         this.table365WaitList = causeSourceNativeData.data
         this.table365WaitPagination.total = causeSourceNativeData.total
         this.table365WaitPagination.current = page
         this.table365WaitLoading = false
       } catch (error) {
         this.table365WaitLoading = false
         console.log(error)
       }
    },

    /**
     * 获取 356案源 已过期table 列表
     */
    async _getCauseSource365ExpireList(page = 1) {
      const param = {
        page,
        size: this.table365ExpireList.pageSize,
        type: 2,
        status: 3
      }

      // 搜索筛选
      this.searchKey.trim() && (param.name = this.searchKey.trim())
      // 时间筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)

      this.table365ExpireLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceVipListApi(param)
        this.table365ExpireList = causeSourceData.data
        this.table365ExpirePagination.total = causeSourceData.total
        this.table365ExpirePagination.current = page
        this.table365ExpireLoading = false
      } catch (error) {
        this.table365ExpireLoading = false
        console.log(error)
      }
    },

    /**
     * 获取 条数套餐 table列表
     */
    async _getCauseSourceCountVipList(page = 1) {
      const param = {
        page,
        size: this.tableCountVipPagination.pageSize,
        type: 1
      }

      // 搜索筛选
      this.searchKey.trim() && (param.name = this.searchKey.trim())
      // 时间筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)

      this.tableCountVipLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceVipListApi(param)
        this.tableCountVipList = causeSourceData.data
        this.tableCountVipPagination.total = causeSourceData.total
        this.tableCountVipPagination.current = page
        this.tableCountVipLoading = false
      } catch (error) {
        this.tableCountVipLoading = false
        console.log(error)
      }
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      // 365套餐
      if (this.activeTabNavKey === '1') {
        if (this.active365TabKey === '1') this._getCauseSource365VaildList(this.table365VolidPagination.current)
        if (this.active365TabKey === '2') this._getCauseSource365WaitList(this.table365WaitPagination.current)
        if (this.active365TabKey === '3') this._getCauseSource365ExpireList(this.table365ExpirePagination.current)
      // 条数套餐
      } else if (this.activeTabNavKey === '2') {
        this._getCauseSourceCountVipList(this.tableCountVipPagination.current)
      }
    },

    /**
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      const userId = String(record.lawyer.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },

    /**
     * 打开开通优选 modal
     */
    async openOpenBestModal() {
      if (this.openBestModal.searchLawyerKeyword.trim()) this.openBestModal.page = 1
      const param = { page: this.openBestModal.page, size: 20, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getLawyerPage(param)
        if (this.openBestModal.page === 1) this.openBestModal.waitOpenBestLawyerList = []

        this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data)
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
          const param = { page: this.openBestModal.page, size: 20, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
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
     * 监听开通优选律师列表 modal ok 事件
     */
    onOpenModalOkEvt() {
      const { openBestModal } = this
      if (!openBestModal.activeLawyer.user_id) return this.$message.warning('请选择开通律师')

      this.causeSourceVipModal.lawyer = openBestModal.activeLawyer
      this.openBestModal.isShowOpenLawyerModal = false
      this.causeSourceVipModal.isShowVipFormModal = true
    },

    /**
     * 监听开通 案源365套餐 select change 事件
     */
    onOpenFormVip365ChangeEvt(causeSourceVipId) {
      if (this.vip365DataList.find(item => item.local_package_id === causeSourceVipId)) {
        const _findMealItem = this.vip365DataList.find(item => item.local_package_id === causeSourceVipId)
        console.log('套餐:', _findMealItem)

        this.causeSourceVipModal.start_time = moment()
        this.causeSourceVipModal.end_time = moment().add(1, 'years')
        this.causeSourceVipModal.price = _findMealItem.price
      }
    },

    /**
     * 监听开通 案源条数套餐 select change 事件
     */
    onOpenFormVipCountChangeEvt(causeSourceVipId) {
      if (this.vipCountDataList.find(item => item.local_package_id === causeSourceVipId)) {
        const _findMealItem = this.vipCountDataList.find(item => item.local_package_id === causeSourceVipId)
        console.log('套餐:', _findMealItem)
        this.causeSourceVipModal.num = _findMealItem.num
        this.causeSourceVipModal.price = _findMealItem.price
      }
    },

    /**
     * 监听案源发布 modal 地区 事件
     */
    onPublischCauseSourceRegionCascaderChangeEvt(value, selectedOptions) {
      this.causeSourceVipModal.province_id = value[0]
      this.causeSourceVipModal.city_id = value[1]
    },

    /**
     * 确定开通会员 modal
     */
    async confirmOpenCauseSourceVipModal() {
      const { causeSourceVipModal } = this
      if (!causeSourceVipModal.local_package_id) return this.$message.warning('请选择套餐类型')
      // 365套餐
      if (causeSourceVipModal.activeTabModal === '1') {
        if (!causeSourceVipModal.start_time) return this.$message.warning('请选择开始时间')
        if (!causeSourceVipModal.end_time) return this.$message.warning('请选择结束时间')
      // 条数套餐
      } else if (causeSourceVipModal.activeTabModal === '2') {
        if (!String(causeSourceVipModal.num).trim()) return this.$message.warning('请输入条数')
      }

      if (!String(causeSourceVipModal.price).trim()) return this.$message.warning('请输入金额')
      // if (!causeSourceVipModal.lawyer_tag.trim()) return this.$message.warning('请填写案源标签')
      this.causeSourceVipModal.isShowVipFormModal = false

      const param = {
        local_package_id: causeSourceVipModal.local_package_id,
        user_id: causeSourceVipModal.lawyer.user_id,
        price: String(causeSourceVipModal.price).trim(),
      }
      // 365套餐
      if (causeSourceVipModal.activeTabModal === '1') {
        param.open_time = moment(causeSourceVipModal.start_time).format('YYYY-MM-DD HH:mm:ss')
        param.end_time = moment(causeSourceVipModal.end_time).format('YYYY-MM-DD HH:mm:ss')
      // 条数套餐
      } else if (causeSourceVipModal.activeTabModal === '2') {
        param.num = String(causeSourceVipModal.num).trim()
      }

      try {
        await causeSourceApi.postCaseSourceVipApi(param)
        this.$notification.success({ message: '开通成功', duration: 3 })
        this.causeSourceVipModal = JSON.parse(JSON.stringify(CAUSESOURCE_VIP_MODAL))
        // 发布成功以后重新展示数据
        this._getCauseSource365VaildList(this.table365VolidPagination.current)
        this._getCauseSourceCountVipList(this.tableCountVipPagination.current)
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

.open-modal {
  .open-body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    max-height: 250px;
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

.open-form-modal {
  .open-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .form-key {
      min-width: 100px;
      font-size: 14px;
      font-weight: 600;
    }
  }
}

// 发布线索 modal
.publish-modal {
  .open-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .form-key {
      min-width: 100px;
      font-size: 14px;
      font-weight: 600;
    }
  }
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
</style>
