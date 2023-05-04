<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">律师广告</span>

      <span style="font-size: 14px; font-weight: 500; margin-left: 20px;">地区筛选：</span>
      <a-cascader :options="regionCascaderList" placeholder="请选择地区" @change="onRegionCascaderFactorChangeEvt" />

      <div style="margin-left: auto;">
        <a-button type="primary" style="margin-right: 30px;" @click="openAddLawyerAdvertPriceModal(true)">价格设置</a-button>
        <!-- <a-button type="primary" @click="openAddLawyerAdvertModal">新增投放</a-button> -->
        <a-button type="primary" @click="$router.push({ name: 'AdvertLawyerAddRoute' })">新增投放</a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <!-- 投放中 -->
        <a-tab-pane key="1" :tab="'投放中 ' + '(' + tableVolidPagination.total + ')'">
          <a-table
            :data-source="tableValidList"
            :loading="tableValidLoading"
            :pagination="tableVolidPagination"
            :rowKey="record => String(record.advertisement_id)"
            :scroll="{ x: 1500 }"
            bordered
          >
            <!-- id -->
            <a-table-column dataIndex="advertisement_id" title="ID" align="center" :width="100" />

            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="170">
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

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center" :width="170">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province_cn }}</span>
                  <span v-if="record.city_cn">-{{ record.city_cn }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 投放时间 -->
            <a-table-column title="投放时间" align="center" :width="170">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.started_at }}</div>
                  <div>至</div>
                  <div>{{ record.stopped_at }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="投放排序" align="center" :width="170">
              <template slot-scope="record">
                <span v-if="record.weight === 1" style="color: #41b583;">第一位</span>
                <span v-else-if="record.weight === 2" style="color: #409eff;">第二位</span>
                <span v-else-if="record.weight === 3" style="color: #e6a23c;">第三位</span>
              </template>
            </a-table-column>

            <!-- 金额 -->
            <a-table-column dataIndex="payment_money" title="金额" align="center" />

            <!-- 来源 -->
            <a-table-column dataIndex="source_buy" title="来源" align="center" />

            <!-- 投放状态 -->
            <a-table-column title="投放状态" align="center">
              <template slot-scope="record">
                <a-button type="link" style="color: #41b583;">{{ record.step_cn }}</a-button>
              </template>
            </a-table-column>

            <!-- 开启状态 -->
            <a-table-column title="开启状态" align="center">
              <template slot-scope="record">
                <a-button v-if="record.status" type="link" style="color: #f56c6c;">已关闭</a-button>
                <a-button v-else type="link" style="color: #41b583;">已开启</a-button>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" :width="160">
              <template slot-scope="record">
                <!-- <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutLabelModal(record)">更新</a-button> -->
                <a-popconfirm v-if="record.status" title="是否开启广告?" @confirm="switchAdvertStatus(record, 0)">
                  <a-button type="link" style="color: #409eff;">开启</a-button>
                </a-popconfirm>
                <a-popconfirm v-else title="是否关闭该广告?" @confirm="switchAdvertStatus(record, 1)">
                  <a-button type="link" style="color: #409eff;">关闭</a-button>
                </a-popconfirm>
                <!-- <a-popconfirm title="请确认是否删除该广告?" ok-text="删除" cancel-text="取消" @confirm="delAdvert(record)">
                  <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
                </a-popconfirm> -->
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
            :rowKey="record => String(record.advertisement_id)"
            :scroll="{ x: 1500 }"
            bordered
          >
            <!-- id -->
            <a-table-column dataIndex="advertisement_id" title="ID" align="center" />

            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="180">
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

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province_cn }}</span>
                  <span v-if="record.city_cn">-{{ record.city_cn }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 投放时间 -->
            <a-table-column title="投放时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.started_at }}</div>
                  <div>至</div>
                  <div>{{ record.stopped_at }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 投放排序 -->
            <a-table-column title="投放排序" align="center" :width="170">
              <template slot-scope="record">
                <span v-if="record.weight === 1" style="color: #41b583;">第一位</span>
                <span v-else-if="record.weight === 2" style="color: #409eff;">第二位</span>
                <span v-else-if="record.weight === 3" style="color: #e6a23c;">第三位</span>
              </template>
            </a-table-column>

            <!-- 金额 -->
            <a-table-column dataIndex="payment_money" title="金额" align="center" />

            <!-- 来源 -->
            <a-table-column dataIndex="source_buy" title="来源" align="center" />

            <!-- 投放状态 -->
            <a-table-column title="投放状态" align="center">
              <template slot-scope="record">
                <a-button type="link" style="color: #e6a23c;">{{ record.step_cn }}</a-button>
              </template>
            </a-table-column>

            <!-- 开启状态 -->
            <a-table-column title="开启状态" align="center">
              <template slot-scope="record">
                <a-button v-if="record.status" type="link" style="color: #f56c6c;">已关闭</a-button>
                <a-button v-else type="link" style="color: #41b583;">已开启</a-button>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="160px">
              <template slot-scope="record">
                <!-- <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutLabelModal(record)">更新</a-button> -->
                <a-popconfirm v-if="record.status" title="是否开启广告?" @confirm="switchAdvertStatus(record, 0)">
                  <a-button type="link" style="color: #409eff;">开启</a-button>
                </a-popconfirm>
                <a-popconfirm v-else title="是否关闭该广告?" @confirm="switchAdvertStatus(record, 1)">
                  <a-button type="link" style="color: #409eff;">关闭</a-button>
                </a-popconfirm>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 历史投放 -->
        <a-tab-pane key="2" :tab="'历史投放 ' + '(' + tableExpirePagination.total + ')'">
          <a-table
            :data-source="tableExpireList"
            :loading="tableExpireLoading"
            :pagination="tableExpirePagination"
            :rowKey="record => String(record.advertisement_id)"
            :scroll="{ x: 1500 }"
            bordered
          >
            <!-- id -->
            <a-table-column dataIndex="advertisement_id" title="ID" align="center" />

            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="180">
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

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province_cn }}</span>
                  <span v-if="record.city_cn">-{{ record.city_cn }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 投放时间 -->
            <a-table-column title="投放时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.started_at }}</div>
                  <div>至</div>
                  <div>{{ record.stopped_at }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 投放排序 -->
            <a-table-column title="投放排序" align="center" :width="170">
              <template slot-scope="record">
                <span v-if="record.weight === 1" style="color: #41b583;">第一位</span>
                <span v-else-if="record.weight === 2" style="color: #409eff;">第二位</span>
                <span v-else-if="record.weight === 3" style="color: #e6a23c;">第三位</span>
              </template>
            </a-table-column>

            <!-- 金额 -->
            <a-table-column dataIndex="payment_money" title="金额" align="center" />

            <!-- 来源 -->
            <a-table-column dataIndex="source_buy" title="来源" align="center" />

            <!-- 投放状态 -->
            <a-table-column title="投放状态" align="center">
              <template slot-scope="record">
                <a-button type="link" style="color: #f56c6c;">{{ record.step_cn }}</a-button>
              </template>
            </a-table-column>

            <!-- 开启状态 -->
            <a-table-column title="开启状态" align="center">
              <template slot-scope="record">
                <a-button type="link" style="color: #666;">{{ record.status_cn }}</a-button>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="160px">
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>

    </a-card>

    <!-- 律师广告 modal -->
    <a-modal
      v-model="advertModalInfo.isShowAdvertModal"
      :title="advertModalInfo.advertModalType ? '更新广告' : '新增广告'"
      :width="500"
      :afterClose="onAdvertModalAfterClose"
      destroyOnClose
      @ok="onAdvertModalOkEvt"
    >
      <div class="advert-modal">
        <!-- 广告位置 -->
        <div class="input-item">
          <div class="input-title">选择律师：</div>
          <div v-if="advertModalInfo.lawyer.user_id" style="display: flex;">
            <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="advertModalInfo.lawyer.avatar" />
            <div>
              <div>{{ advertModalInfo.lawyer.nickname }}</div>
              <div style="font-size: 15px; color: #999;">{{ advertModalInfo.lawyer.mobile }}</div>
            </div>
          </div>
          <a-button v-else type="primary" @click="openOpenBestModal">选择</a-button>
        </div>

        <!-- 投放地区 -->
        <div v-if="advertModalInfo.lawyer.user_id" class="input-item">
          <div class="input-title">投放地区：</div>
          <a-cascader :defaultValue="[ advertModalInfo.province_id, advertModalInfo.city_id ]" :options="regionCascaderList" :allowClear="false" placeholder="请选择地区" @change="onRegionCascaderChangeEvt" />
        </div>

        <!-- 投放时间 -->
        <div v-if="advertModalInfo.city_id > 0" class="input-item">
          <div class="input-title">投放时间：</div>
          <a-select style="width: 100%;" @change="onAdvertDateChangeEvt">
            <a-select-option v-for="rItem in advertDateSelectList" :value="rItem.value" :key="rItem.label">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
          <!-- <div>
            <a-range-picker
              @change="onRangePickerChange"
              :default-value="[advertModalInfo.startDate, advertModalInfo.endDate]"
              style="width: 340px;"
              format="YYYY-MM-DD HH:mm:ss"
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }"
            />
          </div> -->
        </div>

        <!-- 排序位置 -->
        <div v-if="advertModalInfo.endDate" class="input-item">
          <div class="input-title">排序位置：</div>
          <div v-if="advertModalInfo.weightSelected.length >= 3" style="color: #f56c6c; ">此地区，在该投放时间段已无广告位</div>
          <div v-else class="advert-sort-wrap">
            <div v-if="!advertModalInfo.weightSelected.includes(1)" class="advert-sort-item" @click="changeAdvertSortNum(1)">
              <img v-if="advertModalInfo.weight === 1" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>1</span>
            </div>
            <div v-if="!advertModalInfo.weightSelected.includes(2)" class="advert-sort-item" @click="changeAdvertSortNum(2)">
              <img v-if="advertModalInfo.weight === 2" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>2</span>
            </div>
            <div v-if="!advertModalInfo.weightSelected.includes(3)" class="advert-sort-item" @click="changeAdvertSortNum(3)">
              <img v-if="advertModalInfo.weight === 3" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>3</span>
            </div>
          </div>
        </div>

        <div v-if="advertModalInfo.weight" class="input-item">
          <div class="input-title">金额：</div>
          <div style="display: flex; align-items: center;">
            <a-input v-model="advertModalInfo.payment_money" :disabled="advertModalInfo.advertModalType === 1 || (advertModalInfo.advertModalType === 0 && advertModalInfo.isFreeSwitch)" style="width: 130px; margin-right: 10px;" placeholder="请输入金额" />
            <template v-if="advertModalInfo.advertModalType === 0">
              <a-switch v-model="advertModalInfo.isFreeSwitch" @change="onAdvertModalSwitchChange" />
              <span style="margin-left: 6px;">系统赠送</span>
            </template>
            <span v-else style="margin-left: 6px;">金额不可修改</span>
          </div>
        </div>
      </div>
    </a-modal>

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

    <!-- 价格设置 modal -->
    <a-modal
      v-model="isShowOpenPriceModal"
      :width="800"
      destroyOnClose
      title="价格设置"
      @ok="onPriceModalOkEvt"
    >
      <div class="price-modal">
        <div class="price-item">
          <span class="price-key">直辖市：</span>
          <div v-for="(cItem, cIndex) in lawyerAdvertPriceInfo.zhixiaCityList" :key="cIndex" class="price-item">
            <span>第{{ cIndex + 1 }}位</span>
            <a-input class="input" style="margin: 0 6px; width: 100px;" v-model="lawyerAdvertPriceInfo.zhixiaCityList[cIndex].money" placeholder="请输入价格" allowClear />
            <span style="margin-left: 6px; margin-right: 14px;">元,</span>
          </div>
        </div>

        <div class="price-item">
          <span class="price-key">省会城市：</span>
          <div v-for="(cItem, cIndex) in lawyerAdvertPriceInfo.shengHuiCityList" :key="cIndex" class="price-item">
            <span>第{{ cIndex + 1 }}位</span>
            <a-input class="input" style="margin: 0 6px; width: 100px;" v-model="lawyerAdvertPriceInfo.shengHuiCityList[cIndex].money" placeholder="请输入价格" allowClear />
            <span style="margin-left: 6px; margin-right: 14px;">元,</span>
          </div>
        </div>

        <div class="price-item">
          <span class="price-key">其他城市：</span>
          <div v-for="(cItem, cIndex) in lawyerAdvertPriceInfo.qiTaCityList" :key="cIndex" class="price-item">
            <span>第{{ cIndex + 1 }}位</span>
            <a-input class="input" style="margin: 0 6px; width: 100px;" v-model="lawyerAdvertPriceInfo.qiTaCityList[cIndex].money" placeholder="请输入价格" allowClear />
            <span style="margin-left: 6px; margin-right: 14px;">元,</span>
          </div>
        </div>

        <div class="price-item">
          <span class="price-key">优选律师享：</span>
          <div>
            <a-input class="input" style="margin: 0 6px; width: 140px;" v-model="lawyerAdvertPriceInfo.discountPrice" placeholder="请输入折扣" allowClear />
            <span style="margin-left: 6px; margin-right: 14px;">折优惠</span>
          </div>
        </div>

        <div class="price-item">
          <span class="price-key" style="width: auto;">购买</span>
          <a-input class="input" style="margin: 0 6px; width: 120px;" v-model="lawyerAdvertPriceInfo.optimization_adv_num" placeholder="请输入期数" allowClear />
          <span>，享</span>
          <a-input class="input" style="margin: 0 6px; width: 120px;" v-model="lawyerAdvertPriceInfo.optimization_adv_dicount2" placeholder="请输入折扣" allowClear />
          <span>折优惠</span>
        </div>
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

// 广告信息
const ADVERT_INFO = {
  isShowAdvertModal: false, // 是否显示广告 modal
  advertModalType: 0, // 广告 Modal 类型 0: 添加 1: 更新

  lawyer: {}, // 律师 信息
  province_id: -1, // 地区省
  city_id: -1, // 地区市
  startDate: '', // 开始时间
  endDate: '', // 结束时间
  // startDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), // 开始时间
  // endDate: moment().add(5, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'), // 结束时间
  weight: 0, // 排序 num 可选：1,2,3
  weightSelected: [], // 该城市已选 排序 列表
  payment_money: '0', // 金额
  isFreeSwitch: false, // 是否免费

  putAdvertId: '', // 更新广告 id
}

export default {
  name: 'AdvertLawyerPage',
  components: { UserVipCell },
  data() {
    return {
      activeTabKey: '1',
      advertisementPositionId: '459309374742024193', // 位置id (律师角标)
      regionFactorInfo: { province_id: 0, city_id: 0 }, // 地区条件

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

      tableExpireList: [], // 历史投放
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
      
      openBestModal: { ...OPENBEST_MODAL }, // 开通优选律师 modal
      advertModalInfo: Object.assign({}, ADVERT_INFO), // 广告 modal 信息
      regionCascaderList: [], // 地区 cascader 列表

      advertDateSelectList: [], // 广告投放时间段

      // 律师广告价格 信息
      lawyerAdvertPriceInfo: {},
      isShowOpenPriceModal: false, // 是否显示价格设置 modal
    }
  },
  created() {
    this._caclDate()

    this._getRegionList()
    this._getLawyerAdvertValidList()
    this._getLawyerAdvertUnStartList()
    this._getLawyerAdvertExpireList()
  },
  methods: {
    moment,

    _caclDate() {
      const stepNum = 4
      const _startDate = '2022-12-10 00:00:00'
      const _selectDateList = [
        [moment(_startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(_startDate).add(stepNum, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      ]

      for (let i = 1; i < 20; i++) {
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
     * 监听广告投放时间段 select change 事件
     */
    onAdvertDateChangeEvt(value) {
      const _startDate = value.split('至')[0]
      const _endDate = value.split('至')[1]
      this.advertModalInfo.startDate = _startDate
      this.advertModalInfo.endDate = _endDate

      this._getLawyerAdvertChoosableInfo(1)
    },

    /**
     * 监听地区筛选选择 事件
     */
    onRegionCascaderChangeEvt(value, selectedOptions) {
      this.advertModalInfo.province_id = value[0]
      this.advertModalInfo.city_id = value[1]

      this._getLawyerAdvertChoosableInfo(1)
    },

    /**
     * 选择广告排序（位置）
     */
    changeAdvertSortNum(sortNum) {
      this.advertModalInfo.weight = sortNum
      this._getLawyerAdvertChoosableInfo(2)
    },

    /**
     * 获取待选数据
     */
     async _getLawyerAdvertChoosableInfo(type) {
       const param = {
        type,
        start_time: this.advertModalInfo.startDate,
        end_time: this.advertModalInfo.endDate,
        province_id: this.advertModalInfo.province_id,
        city_id: this.advertModalInfo.city_id,
       }
       // 获取金额
       if (type === 2) {
        param.user_id = this.advertModalInfo.lawyer.user_id
        param.num = this.advertModalInfo.weight
       }

       try {
         const { data: choosableData } = await advertApi.getLawyerAdvertChoosableInfoApi(param)
         // 设置已选位置 
         if (type === 1) {
          this.advertModalInfo.weightSelected = choosableData.num_and_money
          this.advertModalInfo.weight = 0 // 重置排序
         }
         // 设置金额  
         if (type === 2) this.advertModalInfo.payment_money = choosableData.num_and_money
       } catch (error) {
         console.log(error)
       }
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
        advertisement_position_id: this.advertisementPositionId,
        step: 1,
       }
       this.tableValidLoading = true

       try {
         const { data: advertPositionData } = await advertApi.getAdvertListApi(param)
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
        size: this.tableUnStartPagination.pageSize,
        province_id: this.regionFactorInfo.province_id || 0,
        city_id: this.regionFactorInfo.city_id || 0,
        advertisement_position_id: this.advertisementPositionId,
        step: 0,
       }
       this.tableUnStartLoading = true

       try {
         const { data: advertPositionData } = await advertApi.getAdvertListApi(param)
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
        size: this.tableExpirePagination.pageSize,
        province_id: this.regionFactorInfo.province_id || 0,
        city_id: this.regionFactorInfo.city_id || 0,
        advertisement_position_id: this.advertisementPositionId,
        step: 2,
       }
       this.tableExpireLoading = true

       try {
         const { data: advertPositionData } = await advertApi.getAdvertListApi(param)
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
     * 刷新 table 数据
     */
    refreshTableData() {
      if (this.activeTabKey === '1') this._getLawyerAdvertValidList(this.tableVolidPagination.current)
      if (this.activeTabKey === '0') this._getLawyerAdvertUnStartList(this.tableUnStartPagination.current)
      if (this.activeTabKey === '2') this._getLawyerAdvertExpireList(this.tableExpirePagination.current)
    },

    /**
     * 监听地区筛选 change 事件
     */
    onRegionCascaderFactorChangeEvt(value, selectedOptions) {
      this.regionFactorInfo.province_id = value[0]
      this.regionFactorInfo.city_id = value[1]
      if (this.activeTabKey === '1') this._getLawyerAdvertValidList()
      if (this.activeTabKey === '0') this._getLawyerAdvertUnStartList()
      if (this.activeTabKey === '2') this._getLawyerAdvertExpireList()
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

      this.advertModalInfo.lawyer = openBestModal.activeLawyer
      this.openBestModal.isShowOpenLawyerModal = false
    },

    /**
     * 打开「添加模式」广告 modal
     */
    openAddLawyerAdvertModal() {
      this.advertModalInfo.advertModalType = 0 // 添加模式
      this.advertModalInfo = Object.assign({}, ADVERT_INFO)
      this.advertModalInfo.isShowAdvertModal = true
    },

    /**
     * 打开「更新模式」广告 modal
     */
    async openPutLabelModal(record) {
      this.advertModalInfo.advertModalType = 1 // 更新模式
      this.advertModalInfo.putAdvertId = record.advertisement_id
      this.advertModalInfo.lawyer = record.user
      this.advertModalInfo.startDate = record.started_at
      this.advertModalInfo.endDate = record.stopped_at
      this.advertModalInfo.province_id = Number(record.province_id)
      this.advertModalInfo.city_id = Number(record.city_id)
      this.advertModalInfo.weight = record.weight
      this.advertModalInfo.payment_money = record.payment_money
      this.advertModalInfo.isFreeSwitch = this.advertModalInfo.payment_money === '0.00'
      this.advertModalInfo.isShowAdvertModal = true
    },

    /**
     * RangePicker 发生变化的回调
     */
    // onRangePickerChange(date, dateStrAry) {
    //   this.advertModalInfo.startDate = dateStrAry[0]
    //   this.advertModalInfo.endDate = dateStrAry[1]
    // },

    /**
     * 监听广告 modal swtich change事件
     */
    onAdvertModalSwitchChange(checked) {
      if (checked) this.advertModalInfo.payment_money = '0'
    },

    /**
     * 广告 Modal 完全关闭后的回调
     */
    onAdvertModalAfterClose() {
      this.advertModalInfo = Object.assign({}, ADVERT_INFO)
    },

    /**
     * 监听广告 modal ok 事件
     */
    onAdvertModalOkEvt(event) {
      const { advertModalInfo } = this
      const advertModalType = advertModalInfo.advertModalType
      if (!advertModalInfo.lawyer.user_id) return this.$message.warning('请选择律师')
      if (!advertModalInfo.province_id || advertModalInfo.city_id < -1) return this.$message.warning('请选择地区')
      if (!advertModalInfo.startDate || !advertModalInfo.endDate) return this.$message.warning('请选择时间段')
      // if (!advertModalInfo.startDate || !advertModalInfo.endDate) return this.$message.warning('请选择时间段')
      if (!advertModalInfo.weight) return this.$message.warning('请选择排序位置')
      // 添加检查
      if (!advertModalType && !advertModalInfo.payment_money.trim()) return this.$message.warning('请输入金额或者打开系统赠送')
      
      this.advertModalInfo.isShowAdvertModal = false
      
      // advertModalType === 1 ? 更新 : 添加
      advertModalType === 1 ? this._putAdvert(advertModalInfo) : this._addAdvert(advertModalInfo)
    },

    /**
     * 添加律师广告投放
     */
     async _addAdvert(advertModalInfo) {
       const param = {
         advertisement_position_id: '459309374742024193',
         type: 0,
         show_type: -1,
         user_type: 2,
         banner: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/icon/Lawyer_icon_ADV%403x.png',
         started_at: advertModalInfo.startDate,
         stopped_at: advertModalInfo.endDate,
         province_id: advertModalInfo.province_id,
         city_id: advertModalInfo.city_id || 0,
         weight: advertModalInfo.weight,
         payment_money: advertModalInfo.isFreeSwitch ? '0' : advertModalInfo.payment_money,
         user_id: advertModalInfo.lawyer.user_id
       }

       console.log(param)

       try {
         await advertApi.postAddAdvertApi(param)
         if (this.activeTabKey === '1') this._getLawyerAdvertValidList()
         if (this.activeTabKey === '0') this._getLawyerAdvertUnStartList()
         if (this.activeTabKey === '2') this._getLawyerAdvertExpireList()
         this.$notification.success({ message: '添加成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
     },

    /**
     * 更新广告
     */
    async _putAdvert(advertModalInfo) {
      const param = {
         advertisement_position_id: '459309374742024193',
         type: 0,
         show_type: -1,
         user_type: 2,
         banner: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/icon/Lawyer_icon_ADV%403x.png',
         started_at: advertModalInfo.startDate,
         stopped_at: advertModalInfo.endDate,
         province_id: advertModalInfo.province_id,
         city_id: advertModalInfo.city_id || 0,
         weight: advertModalInfo.weight,
         user_id: advertModalInfo.lawyer.user_id,
        //  payment_money: advertModalInfo.payment_money,
         advertisement_id: advertModalInfo.putAdvertId, // 广告 id
       }

      try {
        await advertApi.postAddAdvertApi(param)
        this.refreshTableData()
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 开启/关闭广告
     */
    async switchAdvertStatus(advertRecord, advertStatus) {
      const { advertisement_id } = advertRecord
      if (!advertisement_id) return

      try {
        await advertApi.switchAdvertStatusApi({ advertisement_id, status: advertStatus })
        // 更新当页数据
        this.refreshTableData()
        this.$notification.success({ message: '切换成功', duration: 3 })
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
        const { data } = await advertApi.delAdvertApi({ advertisement_id })
        // 更新当页数据
        this.refreshTableData()
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开「添加模式」广告 modal
     */
    async openAddLawyerAdvertPriceModal(isOpenModal = true) {
      try {
         const { data: priceData } = await advertApi.getLawyerAdvertPriceInfoApi()
         const { data: bestPriceData } = await advertApi.getLawyerAdvertBestInfoApi()
         const zhixiaCityList = priceData.filter(item => item.city_type === 2)
         const shengHuiCityList = priceData.filter(item => item.city_type === 1)
         const qiTaCityList = priceData.filter(item => item.city_type === 0)
         this.lawyerAdvertPriceInfo = {
          zhixiaCityList,
          shengHuiCityList,
          qiTaCityList,
          discountPrice: Number(bestPriceData.optimization_dicount) * 10,
          
          optimization_adv_num: bestPriceData.optimization_adv_num,
          optimization_adv_dicount2: Number(bestPriceData.optimization_adv_dicount2) * 10
         }
         if (isOpenModal) this.isShowOpenPriceModal = true
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听价格 modal ok事件
     */
    async onPriceModalOkEvt() {
      const { lawyerAdvertPriceInfo } = this
      this.isShowOpenPriceModal = false
      let param = {
      }
      lawyerAdvertPriceInfo.zhixiaCityList.forEach(item => {
        param[item.advertisement_pack_id] = item.money
      })
      
      lawyerAdvertPriceInfo.shengHuiCityList.forEach(item => {
        param[item.advertisement_pack_id] = item.money
      })

      lawyerAdvertPriceInfo.qiTaCityList.forEach(item => {
        param[item.advertisement_pack_id] = item.money
      })
      param = JSON.stringify(param)

      const discountParam = {
        optimization_dicount: Number(lawyerAdvertPriceInfo.discountPrice) / 10,
        optimization_adv_num: lawyerAdvertPriceInfo.optimization_adv_num,
        optimization_adv_dicount2: Number(lawyerAdvertPriceInfo.optimization_adv_dicount2) / 10,
      }
      
      try {
         await advertApi.postLawyerAdverPriceApi({ data: param })
         await advertApi.postLawyerAdvertBestInfoApi(discountParam)
         this.openAddLawyerAdvertPriceModal(false)
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
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .qrcode-image {
    cursor: pointer;
    .qrcode-img {
      width: 120px;
      height: 120px;
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

.price-modal {
  .price-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 30px;
    .price-key {
      font-size: 16px;
      font-weight: bold;
      width: 100px;
    }
  }
}
</style>
