
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text" style="margin-right: 10px;">案源匹配会员</span>

      <a-input allow-clear placeholder="搜索姓名/手机号" v-model="searchKey" @keyup.enter="_getCauseSourceVaildList" style="margin: 0 5px; width: 180px" />
      <a-button type="primary" @click="_getCauseSourceVaildList">搜索</a-button>

      <!-- 时间筛选 -->
      <a-range-picker
        @change="onDateRangePickerChange"
        @ok="refreshTableData"
        style="width: 344px; margin-left: 10px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />

      <a-button type="primary" style="margin-left: auto;" @click="openOpenCaseSourceVipModal">开通案源会员</a-button>
      <a-button type="primary" style="margin-left: 10px;" @click="$router.push({ name: 'CauseSourceNationClueRoute' })">全国地区线索</a-button>
    </a-layout-header>

    <a-layout-header class="tool-module">
      <div>
        <span style="font-weight: 500;">套餐筛选：</span>
        <a-select style="width: 200px;" v-model="activeVipMenuId" allowClear @change="refreshTableData">
          <a-select-option v-for="sItem in vipMenuSelectList" :value="sItem.value" :key="sItem.value">
            {{ sItem.label }}
          </a-select-option>
        </a-select>
      </div>

      <span style="margin-left: 10px;">地区筛选：</span>
      <a-cascader :options="regionSelectList" placeholder="请选择地区" @change="onRegionFactorCascaderChangeEvt" />
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData" >刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <!-- 投放中 -->
        <a-tab-pane key="1" :tab="'进行中 ' + '(' + tableVolidPagination.total + ')'">
          <a-table
            :data-source="tableValidList"
            :loading="tableValidLoading"
            :pagination="tableVolidPagination"
            :rowKey="(record) => String(record.source_match_package_warehouse_id)"
            :scroll="{ x: 1600 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column title="律师" align="center" :width="180">
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

            <!-- 套餐类型 -->
            <a-table-column title="套餐类型" align="center" :width="240">
              <template slot-scope="record">
                <div class="column-menuType-wrap" :style="{ color: '#666' }">
                  <div style="font-weight: 600;">
                    套餐：{{ record.source_match_package.name }}
                    <a-tag v-if="record.type === 1" color="#41b583">普通会员</a-tag>
                    <a-tag v-else color="#f56c6c">独家会员</a-tag>
                  </div>
                  <div style="color: #666; font-weight: 600;">匹配总数量：<span style="color: #409eff;">{{ record.already_matched_num }}</span> / {{ record.total_num }}</div>
                  <div style="color: #666; font-weight: 600;">今日匹配数：<span style="color: #409eff;">{{ record.today_num }}</span> </div>
                  <div>金额：￥{{ record.pay_money }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" :width="220">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.open_time }}</div>
                  <div>至</div>
                  <div>{{ record.end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 案源地区-->
            <a-table-column title="案源地区" align="center" :width="140">
              <template slot-scope="record">
                <div>{{ record.province }}/{{ record.city }}</div>
              </template>
            </a-table-column>

            <!-- 销售 -->
            <a-table-column title="销售" align="center" :width="140">
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div class="remark">{{ record.sales.name }}</div>
                  </div>
              
                  <div v-if="userInfo && openVipRoleList.includes(userInfo.name)" class="remark-plus" @click="openAddRemarkModal(record)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 状态 -->
            <a-table-column dataIndex="status_txt" title="状态" align="center" :width="140" />

            <!-- 开通渠道 -->
            <a-table-column title="开通渠道" align="center">
              <template slot-scope="record">
                <div v-if="record.source === 1">APP</div>
                <div v-else-if="record.source === 2">后台-{{ record.admin.nickname }}</div>
                <div v-else-if="record.source === 3">微信小程序</div>
                <div v-else>APP</div>
              </template>
            </a-table-column>

            <!-- 创建时间 -->
            <a-table-column dataIndex="created_at" title="创建时间" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" fixed="right" align="center" :width="220">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawyerDetail(record)">律师主页</a-button>
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawerCaseSourceUseRecordPage(record)">案源记录</a-button>
                <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                  <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawyerCaseSourceMatchPage(record)">手动匹配</a-button>
                  <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawyerCaseSourceVipRecordPage(record)">开通记录</a-button>
                  <!-- 移除会员 -->
                  <a-popconfirm title="是否确认要移除该律师案源会员？" @confirm="removeLawyerCaseSourceVip(record)">
                    <a-button type="link" style="padding: 0; margin-right: 10px; color: #F56C6C;">移除会员</a-button>
                  </a-popconfirm>
                </template>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 待开始 -->
        <a-tab-pane key="2" :tab="'待开始 ' + '(' + tableUnStartPagination.total + ')'">
          <a-table
            :data-source="tableUnStartList"
            :loading="tableUnStartLoading"
            :pagination="tableUnStartPagination"
            :rowKey="(record) => String(record.source_match_package_warehouse_id)"
            :scroll="{ x: 1600 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column title="律师" align="center" :width="180">
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

            <!-- 套餐类型 -->
            <a-table-column title="套餐类型" align="center" :width="240">
              <template slot-scope="record">
                <div class="column-menuType-wrap" :style="{ color: '#666' }">
                  <div style="font-weight: 600;">
                    套餐：{{ record.source_match_package.name }}
                    <a-tag v-if="record.type === 1" color="#41b583">普通会员</a-tag>
                    <a-tag v-else color="#f56c6c">独家会员</a-tag>
                  </div>
                  <div>匹配数量：<span style="color: #409eff;">{{ record.already_matched_num }}</span> / {{ record.total_num }}</div>
                  <div>金额：￥{{ record.pay_money }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" :width="220">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.open_time }}</div>
                  <div>至</div>
                  <div>{{ record.end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 案源地区-->
            <a-table-column title="案源地区" align="center" :width="140">
              <template slot-scope="record">
                <div>{{ record.province }}/{{ record.city }}</div>
              </template>
            </a-table-column>

            <!-- 销售 -->
            <a-table-column title="销售" align="center" :width="140">
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div class="remark">{{ record.sales.name }}</div>
                  </div>
              
                  <div v-if="userInfo && openVipRoleList.includes(userInfo.name)" class="remark-plus" @click="openAddRemarkModal(record)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 状态 -->
            <a-table-column dataIndex="status_txt" title="状态" align="center" :width="140" />

            <!-- 开通渠道 -->
            <a-table-column title="开通渠道" align="center">
              <template slot-scope="record">
                <div v-if="record.source === 1">APP</div>
                <div v-else-if="record.source === 2">后台-{{ record.admin.nickname }}</div>
                <div v-else-if="record.source === 3">微信小程序</div>
                <div v-else>APP</div>
              </template>
            </a-table-column>

            <!-- 创建时间 -->
            <a-table-column dataIndex="created_at" title="创建时间" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" fixed="right" align="center" :width="220">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawyerDetail(record)">律师主页</a-button>
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawerCaseSourceUseRecordPage(record)">案源记录</a-button>
                <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                  <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawyerCaseSourceVipRecordPage(record)">开通记录</a-button>
                  <a-popconfirm v-if="userInfo && openVipRoleList.includes(userInfo.name)" title="是否确认要移除该律师案源会员？" @confirm="removeLawyerCaseSourceVip(record)">
                    <a-button type="link" style="padding: 0; margin-right: 10px; color: #F56C6C;">移除会员</a-button>
                  </a-popconfirm>
                </template>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 已结束 -->
        <a-tab-pane key="3" :tab="'已结束 ' + '(' + tableExpirePagination.total + ')'">
          <a-table
            :data-source="tableExpireList"
            :loading="tableExpireLoading"
            :pagination="tableExpirePagination"
            :rowKey="(record) => String(record.source_match_package_warehouse_id)"
            :scroll="{ x: 1600 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column title="律师" align="center" :width="180">
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

            <!-- 套餐类型 -->
            <a-table-column title="套餐类型" align="center" :width="240">
              <template slot-scope="record">
                <div class="column-menuType-wrap" :style="{ color: '#666' }">
                  <div style="font-weight: 600;">
                    套餐：{{ record.source_match_package.name }}
                    <a-tag v-if="record.type === 1" color="#41b583">普通会员</a-tag>
                    <a-tag v-else color="#f56c6c">独家会员</a-tag>
                  </div>
                  <div>匹配数量：<span style="color: #409eff;">{{ record.already_matched_num }}</span> / {{ record.total_num }}</div>
                  <div>金额：￥{{ record.pay_money }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" :width="220">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.open_time }}</div>
                  <div>至</div>
                  <div>{{ record.end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 案源地区-->
            <a-table-column title="案源地区" align="center" :width="140">
              <template slot-scope="record">
                <div>{{ record.province }}/{{ record.city }}</div>
              </template>
            </a-table-column>

            <!-- 销售 -->
            <a-table-column title="销售" align="center" :width="140">
              <template slot-scope="record">
                <div>{{ record.sales.name }}</div>
              </template>
            </a-table-column>

            <!-- 状态 -->
            <a-table-column dataIndex="status_txt" title="状态" align="center" :width="140" />

            <!-- 开通渠道 -->
            <a-table-column title="开通渠道" align="center">
              <template slot-scope="record">
                <div v-if="record.source === 1">APP</div>
                <div v-else-if="record.source === 2">后台-{{ record.admin.nickname }}</div>
                <div v-else-if="record.source === 3">微信小程序</div>
                <div v-else>APP</div>
              </template>
            </a-table-column>

            <!-- 创建时间 -->
            <a-table-column dataIndex="created_at" title="创建时间" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" fixed="right" align="center" :width="220">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawyerDetail(record)">律师主页</a-button>
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawerCaseSourceUseRecordPage(record)">案源记录</a-button>
                <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                  <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawyerCaseSourceVipRecordPage(record)">开通记录</a-button>
                </template>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 选择律师 modal -->
    <a-modal
      v-model="openBestModal.isShowOpenLawyerModal"
      :width="600"
      destroyOnClose
      @ok="onOpenModalOkEvt"
    >
      <div slot="title">
        <span style="font-size: 18px; font-wight: 500; margin-right: 8px;">选择律师</span>
        <a-input allow-clear placeholder="搜索姓名/手机号" v-model="openBestModal.searchLawyerKeyword" @keyup.enter="openOpenCaseSourceVipModal" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="openOpenCaseSourceVipModal">搜索</a-button>
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

    <!-- 开通套餐 表单 modal -->
    <a-modal
      v-model="openBestFormModal.isShowOpenFormModal"
      :width="450"
      title="开通案源会员"
      destroyOnClose
      :afterClose="onOpenBestFormModalAfterClose"
      @ok="onOpenFormModalOkEvt"
    >
      <div class="open-form-modal">
        <!-- 已选律师 -->
        <div class="open-form-item">
          <span class="form-key">已选律师:</span>
          <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="openBestFormModal.lawyer.avatar" />
          <div class="">
            <div>{{ openBestFormModal.lawyer.nickname }}</div>
            <div style="font-size: 15px; color: #999;">{{ openBestFormModal.lawyer.mobile }}</div>
          </div>
        </div>

        <!-- 案源地区 -->
        <div class="open-form-item">
          <span class="form-key">案源地区:</span>
          <a-cascader style="width: 200px" :options="regionSelectList" placeholder="请选择地区" @change="onRegionFormCascaderChangeEvt" />
        </div>

        <!-- 套餐类型 -->
        <div class="open-form-item">
          <span class="form-key">套餐类型:</span>
          <a-select style="width: 200px;" v-model="openBestFormModal.source_match_package_id" @change="onOpenFormBestVipChangeEvt">
            <a-select-option v-for="sItem in vipMenuSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 开始时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐开始时间:</span>
          <a-date-picker
            style="width: 200px"
            v-model="openBestFormModal.start_time"
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          />
        </div>
        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐结束时间:</span>
          <a-date-picker
            style="width: 200px"
            v-model="openBestFormModal.end_time"
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          />
        </div>
        <!-- 匹配数量 -->
        <div class="open-form-item">
          <span class="form-key">匹配数量:</span>
          <a-input allow-clear placeholder="匹配数量" v-model="openBestFormModal.total_num" style="width: 200px" />
        </div>
        <!-- 赠送匹配数量 -->
        <div class="open-form-item">
          <span class="form-key">赠送匹配数量:</span>
          <a-input allow-clear placeholder="赠送条数(选填)" v-model="openBestFormModal.send_num" style="width: 200px" />
        </div>
        <!-- 金额 -->
        <div class="open-form-item">
          <span class="form-key">金额:</span>
          <a-input allow-clear placeholder="金额" v-model="openBestFormModal.pay_money" style="width: 200px" />
        </div>
        <!-- 销售 -->
        <div class="open-form-item">
          <span class="form-key">销售:</span>
          <a-select style="width: 200px;" v-model="openBestFormModal.sales_user_id" allowClear>
            <a-select-option v-for="sItem in lawManagerSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>

    <!-- 销售姓名 modal -->
    <a-modal
      v-model="remarkModal.isShowRemarkModal"
      :width="400"
      :afterClose="() => { remarkModal.source_match_package_warehouse_id = ''; remarkModal.sales_user_id = ''; }"
      destroyOnClose
      @ok="onUpdateSellerModalOkEvt"
    >
      <div class="remark-modal">
        <div class="modal-header">更新销售</div>
        <a-select v-model="remarkModal.sales_user_id" allowClear style="width: 100%;">
          <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
            {{ type.label }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import * as lawyerApi from '@/api/lawyer'
import * as lawManagerApi from '@/api/lawManagerApi'
import UserVipCell from '@/components/User/UserVipCell'
import moment from 'moment'
import { mapState } from 'vuex'

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

// 开通案源vip 表单 modal
const OPENBEST_FORM_MODAL = {
  isShowOpenFormModal: false,
  lawyer: {}, // 律师 信息
  province_id: '', // 地区省份 id
  city_id: '', // 地区城市 id
  source_match_package_id: '', // 优选会员套餐 id
  total_num: '', // 套餐数量
  send_num: '0', // 赠送数量
  start_time: '', // 结束时间
  end_time: '', // 结束时间
  pay_money: '', // 支付金额
  sales_user_id: '', // 销售id
}

// 销售 modal info
const REMARK_MODAL_INFO = {
  isShowRemarkModal: false, // 是否显示
  source_match_package_warehouse_id: '', // 待操作记录 id
  sales_user_id: '', // 销售用户 id
}

export default {
  name: 'CaseSourceMatchPage',
  components: { UserVipCell },
  data() {
    return {
      activeTabKey: '1',
      
      tableValidList: [], // table 列表
      tableValidLoading: true, // 数据是否加载中
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

      tableUnStartList: [], // 待开始
      tableUnStartLoading: false, // 待开始数据是否加载中
      tableUnStartPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          // this._getLawyerAdvertUnStartList(page)
          this.tableUnStartPagination.current = page
        },
      },

      tableExpireList: [], // 已结束
      tableExpireLoading: false, // 已结束投放数据是否加载中
      tableExpirePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          // this._getLawyerAdvertExpireList(page)
          this.tableExpirePagination.current = page
        },
      },

      searchKey: '', // 搜索用户过关键字
      regionFactorInfo: { province_id: '', city_id: '' }, // 地区条件

      // 时间条件
      timeFactorInfo: {
        startDate: '', // 开始时间
        endDate: '', // 结束时间
      },

      regionSelectList: [], // 律师地区 select 列表
      lawManagerSelectList: [], // 律师管家 select
      vipMenuSelectList: [], // vip套餐 select 列表
      activeVipMenuId: '', // 激活的 套餐id
      vipMenuSourceList: [], // vip套餐 源数据列表

      openBestModal: { ...OPENBEST_MODAL }, // 开通优选律师 modal
      openBestFormModal: { ...OPENBEST_FORM_MODAL }, // 开通优选律师 modal
      remarkModal: { ...REMARK_MODAL_INFO }, // 跟进记录 modal 
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getCaseSourceVipMenuList()
    this._getRegionList()
    this._getLawManagerList()

    this._getCauseSourceVaildList()
    this._getCauseSourceUnStartList()
    this._getCauseSourceExpireList()
  },
  methods: {
    moment,
    /**
     * 获取案源套餐套餐 列表
     */
     async _getCaseSourceVipMenuList() {
       try {
         const { data: vipMenuData } = await causeSourceApi.getCaseSourceMatchMenuListApi()
         // 处理销售列表
         for (const mItem of vipMenuData.data) {
           const selectOpt = { label: `${ mItem.package_name }（${ mItem.type_text }）`, value: mItem.source_match_package_id }
           this.vipMenuSelectList.push(selectOpt)
         }

         this.vipMenuSourceList = vipMenuData.data // 套餐数据源列表
       } catch (error) {
         console.log(error)
       }
    },
    /**
     * 获取地区列表
     */
    async _getRegionList() {
      try {
        const { data: regionData } = await causeSourceApi.getLawyerRegionListApi()
        const regionCommonCityList = regionData.cities

        var _regioinOptionList = []
        for (let i = 0; i < regionCommonCityList.length; i++) {
          _regioinOptionList.push({ label: regionCommonCityList[i].name, value: regionCommonCityList[i].district_id, children: [] })
          for (let j = 0; j < regionCommonCityList[i].cities.length; j++) {
            _regioinOptionList[i].children.push({ label: regionCommonCityList[i].cities[j].name, value: regionCommonCityList[i].cities[j].district_id })
          }
        }

        this.regionSelectList = _regioinOptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取律师管家列表
     */
     async _getLawManagerList(page = 1) {
       const param = { page, size: 100, source_type: 0 }

       try {
         const { data: lawManagerData } = await lawManagerApi.getLawManagerListApi(param)
         const _tempSelectList = []
         for (const lItem of lawManagerData.data) {
           const selectOpt = { label: lItem.name, value: lItem.user.user_id }
           _tempSelectList.push(selectOpt)
         }
         this.lawManagerSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      if (this.activeTabKey === '1') this._getCauseSourceVaildList(this.tableVolidPagination.current)
      if (this.activeTabKey === '2') this._getCauseSourceUnStartList(this.tableUnStartPagination.current)
      if (this.activeTabKey === '3') this._getCauseSourceExpireList(this.tableExpirePagination.current)
    },

    /**
     * 时间 RangePicker 发生变化的回调
     */
    onDateRangePickerChange(date, dateStrAry) {
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
      this._getCauseSourceVaildList()
    },

    /**
     * 获取案源匹配有效 table 列表
     */
    async _getCauseSourceVaildList(page = 1) {
      const param = { page, size: this.tableVolidPagination.pageSize, status: 0, }
      // 地区筛选
      if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_id = this.regionFactorInfo.province_id
        param.city_id = this.regionFactorInfo.city_id
      }
      // 时间段筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)
      // 套餐类型筛选 
      this.activeVipMenuId && (param.source_match_package_id = this.activeVipMenuId)
      // 律师名字搜索 
      this.searchKey.trim() && (param.name = this.searchKey.trim())

      this.tableValidLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceMatchVipListApi(param)
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
     * 获取案源匹配待开始 table 列表
     */
    async _getCauseSourceUnStartList(page = 1) {
      const param = { page, size: this.tableUnStartPagination.pageSize, status: 2, }
      // 地区筛选
      if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_id = this.regionFactorInfo.province_id
        param.city_id = this.regionFactorInfo.city_id
      }
      // 时间段筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)
      // 套餐类型筛选 
      this.activeVipMenuId && (param.source_match_package_id = this.activeVipMenuId)
      // 律师名字搜索 
      this.searchKey.trim() && (param.name = this.searchKey.trim())

      this.tableUnStartLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceMatchVipListApi(param)
        this.tableUnStartList = causeSourceData.data
        this.tableUnStartPagination.total = causeSourceData.total
        this.tableUnStartPagination.current = page
        this.tableUnStartLoading = false
      } catch (error) {
        this.tableUnStartLoading = false
        console.log(error)
      }
    },

    /**
     * 获取案源匹配已结束 table 列表
     */
    async _getCauseSourceExpireList(page = 1) {
      const param = { page, size: this.tableExpirePagination.pageSize, status: 1 }
      // 地区筛选
      if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_id = this.regionFactorInfo.province_id
        param.city_id = this.regionFactorInfo.city_id
      }
      // 时间段筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)
      // 套餐类型筛选 
      this.activeVipMenuId && (param.source_match_package_id = this.activeVipMenuId)
      // 律师名字搜索 
      this.searchKey.trim() && (param.name = this.searchKey.trim())

      this.tableExpireLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceMatchVipListApi(param)
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
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      const userId = String(record.user.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },

    /**
     * 进入律师案源会员手动匹配线索页面
     */
    navToLawyerCaseSourceMatchPage(record) {
      const userId = String(record.user.user_id)
      this.$router.push({ name: 'CauseSourceMatchClueRoute', query: { lawyerUserId: userId } })
    },

    /**
     * 进入律师案源会员开通记录
     */
    navToLawyerCaseSourceVipRecordPage(record) {
      sessionStorage.setItem('lawyerInfo', JSON.stringify(record))
      const userId = String(record.user.user_id)
      this.$router.push({ name: 'causeSourceMatchVipRecordRoute', query: { lawyerUserId: userId } })
    },

    /**
     * 进入律师案源会员使用记录
     */
    navToLawerCaseSourceUseRecordPage(record) {
      sessionStorage.setItem('lawyerInfo', JSON.stringify(record))
      const userId = String(record.user.user_id)
      this.$router.push({ name: 'causeSourceMatchUseRecordRoute', query: { lawyerUserId: userId, vipRecordId: record.source_match_package_warehouse_id } })
    },

    /**
     * 打开 开通案源会员 modal
     */
    async openOpenCaseSourceVipModal() {
      if (this.openBestModal.searchLawyerKeyword.trim()) this.openBestModal.page = 1
      const param = { page: this.openBestModal.page, size: 20, type: 1, nickname: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getWaitOpenBestLawyerListApi(param)
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
     * 监听开通优选律师列表 modal ok 事件
     */
    onOpenModalOkEvt() {
      const { openBestModal } = this
      if (!openBestModal.activeLawyer.user_id) return this.$message.warning('请选择开通律师')

      this.openBestFormModal.lawyer = openBestModal.activeLawyer
      this.openBestModal.isShowOpenLawyerModal = false
      this.openBestFormModal.isShowOpenFormModal = true
    },

    /**
     * 监听开通优选表单 Modal 完全关闭后的回调
     */
    onOpenBestFormModalAfterClose() {
      this.openBestFormModal = Object.assign({}, OPENBEST_FORM_MODAL)
    },

    /**
     * 监听开通表单套餐类型 select change 事件
     */
    onOpenFormBestVipChangeEvt(vipMenuId) {
      const _findVipMenu = this.vipMenuSourceList.find(item => item.source_match_package_id === vipMenuId)
      if (_findVipMenu) {
        this.openBestFormModal.total_num = _findVipMenu.num * _findVipMenu.day + ''
        this.openBestFormModal.pay_money = _findVipMenu.price
        this.openBestFormModal.start_time = moment()
        this.openBestFormModal.end_time = moment().add(_findVipMenu.day, 'days')
      }
    },

    /**
     * 监听地区筛选选择 事件
     */
    onRegionFormCascaderChangeEvt(value, selectedOptions) {
      this.openBestFormModal.province_id = value[0]
      this.openBestFormModal.city_id = value[1]
    },

    /**
     * 监听开通优选表单 modal ok 事件
     */
    async onOpenFormModalOkEvt() {
      const { openBestFormModal } = this
      if (!openBestFormModal.lawyer.user_id) return this.$message.warning('请选择律师')
      if (!openBestFormModal.province_id || !openBestFormModal.city_id) return this.$message.warning('请选择案源地区')
      if (!openBestFormModal.source_match_package_id) return this.$message.warning('请选择开通会员套餐')
      if (!openBestFormModal.start_time) return this.$message.warning('请选择开始时间')
      if (!openBestFormModal.end_time) return this.$message.warning('请选择结束时间')
      if (!openBestFormModal.total_num.trim()) return this.$message.warning('请输入匹配数量')
      if (!openBestFormModal.pay_money.trim()) return this.$message.warning('请输入金额')
      if (!openBestFormModal.sales_user_id) return this.$message.warning('请选择销售')
      
      const param = {
        lawyer_user_id: openBestFormModal.lawyer.user_id,
        source_match_package_id: openBestFormModal.source_match_package_id,
        province_id: openBestFormModal.province_id,
        city_id: openBestFormModal.city_id,
        total_num: openBestFormModal.total_num.trim(),
        send_num: openBestFormModal.send_num.trim(),
        open_time: moment(openBestFormModal.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(openBestFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
        pay_money: openBestFormModal.pay_money.trim(),
        sales_user_id: openBestFormModal.sales_user_id,
      }
      this.openBestFormModal.isShowOpenFormModal = false

      try {
        await causeSourceApi.postCaseSrouceMatchVipApi(param)
        this._getCauseSourceVaildList(this.tableVolidPagination.current)
        this._getCauseSourceUnStartList(this.tableUnStartPagination.current)
        this._getCauseSourceExpireList(this.tableExpirePagination.current)
        this.$notification.success({ message: '开通成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开添加跟进记录 modal
     */
    openAddRemarkModal(record) {
      this.remarkModal.source_match_package_warehouse_id = record.source_match_package_warehouse_id
      this.remarkModal.isShowRemarkModal = true
    },

    /**
     * 更新 案源匹配vip会员 销售
     */
    async onUpdateSellerModalOkEvt() {
      const { remarkModal } = this
      if (!remarkModal.sales_user_id) return this.$message.warning('请选择销售')

      const param = {
        source_match_package_warehouse_id: remarkModal.source_match_package_warehouse_id,
        sales_user_id: remarkModal.sales_user_id,
      }
      this.remarkModal.isShowRemarkModal = false

      console.log(param)
      
      try {
         const data = await causeSourceApi.updateCaseSourceVipSellerApi(param)
         this.$notification.success({ message: '更新销售成功', duration: 3 })
         this.refreshTableData()
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 移除律师 案源匹配vip
     */
    async removeLawyerCaseSourceVip(record) {
      const param = { source_match_package_warehouse_id: record.source_match_package_warehouse_id }

      try {
        await causeSourceApi.removeLawyerCaseSourceVipApi(param)
        this.refreshTableData()
        this.$notification.success({ message: '移除成功', duration: 3 })
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
    padding: 10px;
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
  .company-name {
    font-size: 16px;
    font-weight: 600;
  }
  .data-num {
    font-size: 14px;
    font-weight: 600;
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .column-menuType-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .column-menuTime-wrap {
    font-weight: 600;
    color: #666;
  }
  // 销售记录
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

.remark-modal {
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
