<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">律师广告位</span>

      <span style="font-size: 14px; font-weight: 500; margin-left: 20px;">地区筛选：</span>
      <a-cascader :options="regionCascaderList" placeholder="请选择地区" @change="onRegionCascaderFactorChangeEvt" />

      <div style="margin-left: auto;">
        <a-button type="primary" style="margin-right: 30px;" @click="openUpdateBestTagModal">优选价格设置</a-button>
        <a-button type="primary" @click="openBestFormModal.isShowOpenFormModal = true">新增广告位</a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="advertSeatNavCardTabKey" type="card" @change="onAdvertSeatNavCardChangeEvt">
        <a-tab-pane key="0" tab="首页列表头部" />
        <a-tab-pane key="1" tab="找律师头部" />
        <a-tab-pane key="2" tab="找律师列表" />
        <a-tab-pane key="3" tab="首页帖子列表" />
        <a-tab-pane key="4" tab="帖子详情" />
      </a-tabs>

      <a-tabs v-model="advertSeatActiveTabKey">
        <!-- 投放中 -->
        <a-tab-pane key="1" :tab="'投放中 ' + '(' + tableVolidPagination.total + ')'">
          <a-table
            :data-source="tableValidList"
            :loading="tableValidLoading"
            :pagination="tableVolidPagination"
            :rowKey="record => String(record.advertisement_id)"
            :scroll="{ x: 1700 }"
            bordered
          >
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

            <!-- 投放位置 -->
            <a-table-column dataIndex="advertisement_position_title" title="投放位置" :width="170" align="center" />

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center" :width="170">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province_cn }}</span>
                  <span v-if="record.city_cn">-{{ record.city_cn }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 投放分类 -->
            <a-table-column dataIndex="lawyer_tag_cn" title="投放分类" :width="170" align="center" />

            <!-- 投放时间 -->
            <a-table-column title="投放时间" align="center" :width="190">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.started_at }}</div>
                  <div>至</div>
                  <div>{{ record.stopped_at }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 投放图片 -->
            <a-table-column title="投放图片" align="center">
              <template slot-scope="record">
                <div v-if="record.banner_url" class="qrcode-image" v-viewer>
                  <img class="qrcode-img" :src="record.banner_url">
                </div>
                <div v-else>无</div>
              </template>
            </a-table-column>

            <!-- 金额 -->
            <a-table-column title="金额" align="center" :width="150">
              <template slot-scope="record">
                <div>￥{{ record.order_money_real }}</div>
              </template>
            </a-table-column>

            <!-- 来源 -->
            <a-table-column dataIndex="source_buy" title="来源" align="center" :width="150" />

            <!-- 投放状态 -->
            <a-table-column title="投放状态" align="center" :width="100">
              <template slot-scope="record">
                <a-button type="link" style="color: #41b583;">{{ record.step_cn }}</a-button>
              </template>
            </a-table-column>

            <!-- 开启状态 -->
            <a-table-column title="开启状态" align="center" :width="100">
              <template slot-scope="record">
                <a-button v-if="record.status" type="link" style="color: #f56c6c;">已关闭</a-button>
                <a-button v-else type="link" style="color: #41b583;">已开启</a-button>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" :width="100">
              <template slot-scope="record">
                <a-popconfirm v-if="record.status" title="是否开启广告?" @confirm="switchAdvertStatus(record, 0)">
                  <a-button type="link" style="color: #409eff;">开启</a-button>
                </a-popconfirm>
                <a-popconfirm v-else title="是否关闭该广告?" @confirm="switchAdvertStatus(record, 1)">
                  <a-button type="link" style="color: #409eff;">关闭</a-button>
                </a-popconfirm>

                <a-popconfirm title="是否删除该广告?" @confirm="delAdvert(record)">
                  <a-button type="link" style="color: #f56c6c;">删除</a-button>
                </a-popconfirm>

                <a-button type="link" style="color: #409eff;" @click="navToLawyerSeatPointPage(record)">埋点详情</a-button>
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
            :scroll="{ x: 1700 }"
            bordered
          >
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

            <!-- 投放位置 -->
            <a-table-column dataIndex="advertisement_position_title" title="投放位置" :width="170" align="center" />

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center" :width="170">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province_cn }}</span>
                  <span v-if="record.city_cn">-{{ record.city_cn }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 投放分类 -->
            <a-table-column dataIndex="lawyer_tag_cn" title="投放分类" :width="170" align="center" />

            <!-- 投放时间 -->
            <a-table-column title="投放时间" align="center" :width="190">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.started_at }}</div>
                  <div>至</div>
                  <div>{{ record.stopped_at }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 投放图片 -->
            <a-table-column title="投放图片" align="center">
              <template slot-scope="record">
                <div v-if="record.banner_url" class="qrcode-image" v-viewer>
                  <img class="qrcode-img" :src="record.banner_url">
                </div>
                <div v-else>无</div>
              </template>
            </a-table-column>

            <!-- 金额 -->
            <a-table-column title="金额" align="center" :width="150">
              <template slot-scope="record">
                <div>￥{{ record.order_money_real }}</div>
              </template>
            </a-table-column>

            <!-- 来源 -->
            <a-table-column dataIndex="source_buy" title="来源" align="center" :width="150" />

            <!-- 投放状态 -->
            <a-table-column title="投放状态" align="center" :width="100">
              <template slot-scope="record">
                <a-button type="link" style="color: #41b583;">{{ record.step_cn }}</a-button>
              </template>
            </a-table-column>

            <!-- 开启状态 -->
            <a-table-column title="开启状态" align="center" :width="100">
              <template slot-scope="record">
                <a-button v-if="record.status" type="link" style="color: #f56c6c;">已关闭</a-button>
                <a-button v-else type="link" style="color: #41b583;">已开启</a-button>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" :width="100">
              <template slot-scope="record">
                <a-popconfirm v-if="record.status" title="是否开启广告?" @confirm="switchAdvertStatus(record, 0)">
                  <a-button type="link" style="color: #409eff;">开启</a-button>
                </a-popconfirm>
                <a-popconfirm v-else title="是否关闭该广告?" @confirm="switchAdvertStatus(record, 1)">
                  <a-button type="link" style="color: #409eff;">关闭</a-button>
                </a-popconfirm>
                <a-popconfirm title="是否删除该广告?" @confirm="delAdvert(record)">
                  <a-button type="link" style="color: #f56c6c;">删除</a-button>
                </a-popconfirm>
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
            :rowKey="record => String(record.advertisement_id)"
            :scroll="{ x: 1700 }"
            bordered
          >
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

            <!-- 投放位置 -->
            <a-table-column dataIndex="advertisement_position_title" title="投放位置" :width="170" align="center" />

            <!-- 投放地区 -->
            <a-table-column title="投放地区" align="center" :width="170">
              <template slot-scope="record">
                <div>
                  <span>{{ record.province_cn }}</span>
                  <span v-if="record.city_cn">-{{ record.city_cn }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 投放分类 -->
            <a-table-column dataIndex="lawyer_tag_cn" title="投放分类" :width="170" align="center" />

            <!-- 投放时间 -->
            <a-table-column title="投放时间" align="center" :width="190">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.started_at }}</div>
                  <div>至</div>
                  <div>{{ record.stopped_at }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 投放图片 -->
            <a-table-column title="投放图片" align="center">
              <template slot-scope="record">
                <div v-if="record.banner_url" class="qrcode-image" v-viewer>
                  <img class="qrcode-img" :src="record.banner_url">
                </div>
                <div v-else>无</div>
              </template>
            </a-table-column>

            <!-- 金额 -->
            <a-table-column title="金额" align="center" :width="150">
              <template slot-scope="record">
                <div>￥{{ record.order_money_real }}</div>
              </template>
            </a-table-column>

            <!-- 来源 -->
            <a-table-column dataIndex="source_buy" title="来源" align="center" :width="150" />

            <!-- 投放状态 -->
            <a-table-column title="开启状态" align="center" :width="100">
              <template slot-scope="record">
                <a-button type="link" style="color: #41b583;">{{ record.step_cn }}</a-button>
              </template>
            </a-table-column>

            <!-- 开启状态 -->
            <a-table-column title="开启状态" align="center" :width="100">
              <template slot-scope="record">
                <a-button v-if="record.status" type="link" style="color: #f56c6c;">已关闭</a-button>
                <a-button v-else type="link" style="color: #41b583;">已开启</a-button>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" :width="100">
              <template slot-scope="record">
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
      </a-tabs>
    </a-card>

    <!-- 开通广告位 表单 modal -->
    <a-modal
      v-model="openBestFormModal.isShowOpenFormModal"
      :width="480"
      title="开通广告位"
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

        <!-- 投放位置 -->
        <div class="open-form-item">
          <span class="form-key">投放位置:</span>
          <a-select style="width: 192px;" v-model="openBestFormModal.advertisement_position_id">
            <a-select-option v-for="sItem in advertPositionSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 投放地区 -->
        <div class="open-form-item">
          <span class="form-key">投放地区:</span>
          <a-cascader :options="regionCascaderList" :allowClear="false" placeholder="请选择地区" @change="onRegionCascaderChangeEvt" />
        </div>

        <!-- 投放分类 -->
        <div v-if="![advertSeatNavCardList[0].seatId, advertSeatNavCardList[1].seatId].includes(openBestFormModal.advertisement_position_id)" class="open-form-item">
          <span class="form-key">投放分类:</span>
          <a-select style="width: 192px;" v-model="openBestFormModal.category_id" @change="_getAdvertSelectedDateList()">
            <a-select-option v-for="sItem in causeSourceCategorySelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 投放时间 -->
        <div v-if="openBestFormModal.advertisement_position_id && openBestFormModal.city_id > 0" class="open-form-item">
          <div class="form-key">投放时间：</div>
          <a-select style="width: 320px;" v-model="openBestFormModal.selectedDateList" mode="multiple">
            <a-select-option v-for="rItem in advertDateSelectList" :value="rItem.value" :key="rItem.label" :disabled="rItem.value | advertDateDisableFilter">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 支付金额 -->
        <div class="open-form-item">
          <span class="form-key">支付金额:</span>
          <a-input allow-clear placeholder="支付金额" v-model="openBestFormModal.price" style="width: 192px" />
        </div>

        <!-- 图片 -->
        <div v-if="[advertSeatNavCardList[0].seatId, advertSeatNavCardList[1].seatId].includes(openBestFormModal.advertisement_position_id)" class="open-form-item">
          <span class="form-key">投放图片:</span>
          <div class="image-wrap">
            <div v-if="openBestFormModal.image" class="image-item" v-viewer>
              <img class="image" :src="openBestFormModal.image" />
              <a-icon class="icon-close" type="close-circle" @click.stop="openBestFormModal.image = ''" />
            </div>

            <div v-else class="image-upload" @click="chooseAdvertImage">
              <a-icon type="plus" style="fontSize: 26px" />
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!--「优选标签」价格设置 modal -->
    <a-modal
      v-model="bestTagPriceModal.isShowBestTagPriceModal"
      :width="400"
      title="显示「优选标签」价格设置"
      destroyOnClose
      @ok="onUpdateBestTagPriceModalOkEvt"
    >
      <div class="open-form-modal">
        <div class="open-form-item">
          <span class="form-key">价格设置:</span>
          <a-input allow-clear placeholder="价格设置" v-model="bestTagPriceModal.price" style="width: 192px" />
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

    <!-- 开通广告位 表单 modal -->
    <a-modal
      v-model="isShowCropperModal"
      :width="600"
      title="裁剪广告位"
      destroyOnClose
      @ok="onCropperModalOkEvt"
    >
      <div class="cropper-modal">
        <vue-cropper
          ref="cropper"
          autoCrop
          original
          fixed
          :fixedNumber="openBestFormModal.advertisement_position_id === advertSeatNavCardList[0].seatId ? [70, 14] : [8, 3]"
          :img="cropperOriginalImgPath"
          centerBox
        />
      </div>
    </a-modal>

    <!-- 案源图片 input 多文件上传  -->
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
import moment from 'moment'
import fileUtil from '@/utils/fileUtil'
import UserVipCell from '@/components/User/UserVipCell'
import * as advertApi from '@/api/advertApi'
import * as lawyerApi from '@/api/lawyer'
import * as causeSourceApi from '@/api/causeSourceApi'
import * as appApi from '@/api/app'
const JSONbig = require('json-bigint')
import { VueCropper } from 'vue-cropper'

// 开通优选套餐 表单 modal
const OPENBEST_FORM_MODAL = {
  isShowOpenFormModal: false,

  advertisement_position_id: '', // 优选会员套餐 id
  lawyer: {}, // 律师 信息
  province_id: -1, // 地区省 id
  city_id: -1, // 地区市 id
  category_id: '', // 分类 id
  
  price: '', // 价格
  timeStage: '', // 时间段
  selectedDateList: [], // 已选投放日期列表
  image: '', // 线下付款截图
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

// 更新优选标签 modal
const BEST_TAG_PRICE_MODAL = {
  isShowBestTagPriceModal: false,
  price: '',
}

let that

export default {
  name: 'AdvertLawyerSeatPage',
  components: { UserVipCell, VueCropper },
  filters: {
    advertDateDisableFilter(value) {
      const _startDate = value.split('至')[0]
      let _disable = false
      const _findDate = that.advertDateDisabledList.find(item => `${ item.started_at } 00:00:00` === _startDate)
      if (_findDate) _disable = true
      return _disable
    }
  },
  data() {
    return {
      isShowCropperModal: false,
      cropperOriginalImgPath: '', // 裁剪原图地址
      
      advertSeatNavCardTabKey: '0', // 当前激活card tab 面板的 key
      advertSeatActiveTabKey: '1', // 当前激活数据 tab 面板的 key
      isShowAdvertImageFileInput: true, // 是否显示上传案源图片 input

      advertSeatNavCardList: [
        { seatName: '首页列表头部', seatId: '1' },
        { seatName: '找律师头部', seatId: '496639967716708353' },
        { seatName: '找律师列表', seatId: '459309374742024193' },
        { seatName: '首页帖子列表', seatId: '2' },
        { seatName: '帖子详情页', seatId: '404946901803421696' },
      ],

      regionFactorInfo: { province_id: 0, city_id: 0 }, // 地区条件
      regionCascaderList: [], // 地区 cascader 列表
      advertPositionSelectList: [], // 广告位位置 select
      causeSourceCategorySelectList: [], // 案源分类 option 列表
      advertDateSelectList: [], // 广告投放可选时间段
      advertDateDisabledList: [], // 广告投禁选时间段

      openBestModal: { ...OPENBEST_MODAL }, // 开通选择律师 modal
      openBestFormModal: { ...OPENBEST_FORM_MODAL }, // 广告位 modal
      bestTagPriceModal: { ...BEST_TAG_PRICE_MODAL }, // 手机品牌 modal

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
    this._calcAdvertDateSelectList()
    this._advertPositionList()
    this._getRegionList()
    this._getCauseSourceCategoryList()
    this.getAppConfigInfo()

    this._getLawyerAdvertValidList()
    this._getLawyerAdvertUnStartList()
    this._getLawyerAdvertExpireList()
  },
  methods: {
    moment,

    /**
     * 计算广告日期可选列表
     */
    _calcAdvertDateSelectList() {
      const curWeekdayStartDate = moment().weekday(0).startOf('day').format('YYYY-MM-DD HH:mm:ss') //本周一
      const curWeekdayEndDate = moment().weekday(6).endOf('day').format('YYYY-MM-DD HH:mm:ss') //本周日
      const _selectDateList = [ [curWeekdayStartDate, curWeekdayEndDate] ]

      for (let i = 1; i < 80; i++) {
        const prevSelectDate = _selectDateList.at(-1) // 取数组最后一个时间段的 结束时间
        const _stepStarDate = moment(prevSelectDate[0]).add(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
        const _stepEndDate = moment(prevSelectDate.at(-1)).add(7, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
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
     * 获取案源分类列表
     */
    async _getCauseSourceCategoryList() {
      try {
        const { data: causeSourceCategoryData } = await causeSourceApi.getCauseSourceCategoryListApi({ is_have_hot: 1 })

        const _tempSelectList = []
        for (const sItem of causeSourceCategoryData[0].lawyer_tags) {
          const selectOpt = { label: sItem.lawyer_tag, value: sItem.lawyer_tag_id }
          _tempSelectList.push(selectOpt)
        }

        this.causeSourceCategorySelectList = _tempSelectList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取广告位置列表
     */
     async _advertPositionList() {
       const param = { page: 1, size: 100 }

       try {
         const { data: advertPositionData } = await advertApi.getAdvertPositionListApi(param)
         const tempSelectList = []
         for (const dItem of advertPositionData.data) {
           const selectOpt = { label: dItem.title, value: dItem.advertisement_position_id, }
           tempSelectList.push(selectOpt)
         }

         this.advertPositionSelectList = tempSelectList
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
     * 获取 app 配置信息
     */
    async getAppConfigInfo() {
      try {
        const { data: appConfigData } = await appApi.getAppConfgApi()
        this.bestTagPriceModal.price = `${ appConfigData.adv_config.show_expenses_pirce }`
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 打开更新优选标签价格 modal
     */
    openUpdateBestTagModal() {
      this.bestTagPriceModal.isShowBestTagPriceModal = true
    },

    /**
     * 监听更新优选标签价格 modal ok 事件
     */
    async onUpdateBestTagPriceModalOkEvt() {
      const { bestTagPriceModal } = this
      this.bestTagPriceModal.isShowBestTagPriceModal = false

      const setValue = { show_expenses_pirce: bestTagPriceModal.price.trim() }
      const param = { type: 'ADV_CONFIG', value: JSON.stringify(setValue) }

      try {
        await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
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
     * 监听广告位导航card change 事件
     */
    onAdvertSeatNavCardChangeEvt(activeKey) {
      this._getLawyerAdvertValidList()
      this._getLawyerAdvertUnStartList()
      this._getLawyerAdvertExpireList()
    },

    /**
     * 投放中列表
     */
     async _getLawyerAdvertValidList(page = 1) {
      const advertSeatItem = this.advertSeatNavCardList[Number(this.advertSeatNavCardTabKey)]
      
       const param = {
        page,
        size: this.tableVolidPagination.pageSize,
        province_id: this.regionFactorInfo.province_id || 0,
        city_id: this.regionFactorInfo.city_id || 0,
        advertisement_position_id: advertSeatItem.seatId,
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
      const advertSeatItem = this.advertSeatNavCardList[Number(this.advertSeatNavCardTabKey)]
      
       const param = {
        page,
        size: this.tableVolidPagination.pageSize,
        province_id: this.regionFactorInfo.province_id || 0,
        city_id: this.regionFactorInfo.city_id || 0,
        advertisement_position_id: advertSeatItem.seatId,
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
      const advertSeatItem = this.advertSeatNavCardList[Number(this.advertSeatNavCardTabKey)]

       const param = {
        page,
        size: this.tableVolidPagination.pageSize,
        province_id: this.regionFactorInfo.province_id || 0,
        city_id: this.regionFactorInfo.city_id || 0,
        advertisement_position_id: advertSeatItem.seatId,
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

      this._getAdvertSelectedDateList()
    },

    /**
     * 获取广告时间禁选列表
     */
    async _getAdvertSelectedDateList() {
      const param = {
        city_id: this.openBestFormModal.city_id,
        advertisement_position_id: this.openBestFormModal.advertisement_position_id,
        lawyer_tag_id: [this.advertSeatNavCardList[0].seatId, this.advertSeatNavCardList[1].seatId].includes(this.openBestFormModal.advertisement_position_id) ? 0 : (this.openBestFormModal.category_id || 0),
      }
      try {
         const { data: advertSelectedData } = await advertApi.getAdvertSelectedDateApi(param)
         this.advertDateDisabledList = advertSelectedData.data || []
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 选择广告图片
     * https://juejin.cn/post/6844903697667850248
     */
    chooseAdvertImage() {
      this.isShowAdvertImageFileInput = true
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
        const imgPath = await this._fileByBase64(file)
        this.cropperOriginalImgPath = imgPath
        this.isShowCropperModal = true
        // const fileUrl = await fileUtil.uploadFile(file)
        // this.openBestFormModal.image = fileUrl
      } catch (error) {
        console.log(error)
      }
    },
    /**
     *  File 转 base64
     */
     _fileByBase64(file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()
        // 传入一个参数对象即可得到基于该参数对象的文本内容
        reader.readAsDataURL(file)
        reader.onload = function (e) {
          // target.result 该属性表示目标对象的DataURL
          resolve(e.target.result)
        }
      })
     },

    /**
     * 监听裁剪框 modal ok 事件
     */
    onCropperModalOkEvt() {
      this.$refs.cropper.getCropData(async cropperData => {
        const croperBlob = this._dataURLtoBlob(cropperData)
        const croperFile = this._blobToFile(croperBlob, '裁剪图')

        const fileUrl = await fileUtil.uploadFile(croperFile)
        this.openBestFormModal.image = fileUrl
        this.isShowCropperModal = false
      })
    },
    /**
     * base64 转 Blob
     */
    _dataURLtoBlob(dataurl) { 
      var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    /**
     * Blob 转 File
     */
    _blobToFile(theBlob, fileName){
      theBlob.lastModifiedDate = new Date()
      theBlob.name = fileName
      return theBlob
    },

    /**
     * 监听开通表单 modal ok 事件
     */
    async onOpenFormModalOkEvt() {
      const { openBestFormModal } = this
      if (!openBestFormModal.lawyer.user_id) return this.$message.warning('请选择律师')
      if (!openBestFormModal.advertisement_position_id) return this.$message.warning('请选择投放位置')
      if (!openBestFormModal.city_id) return this.$message.warning('请选择投放地区')
      // 请选择投放类型
      if (![this.advertSeatNavCardList[0].seatId, this.advertSeatNavCardList[1].seatId].includes(openBestFormModal.advertisement_position_id) && !openBestFormModal.category_id) return this.$message.warning('请选择投放类型')
      // 请选择投放图片
      if ([this.advertSeatNavCardList[0].seatId, this.advertSeatNavCardList[1].seatId].includes(openBestFormModal.advertisement_position_id) && !openBestFormModal.image) return this.$message.warning('请选择投放图片')
      // if (!openBestFormModal.category_id) return this.$message.warning('请选择投放类型')
      this.openBestFormModal.isShowOpenFormModal = false

      const _selectedDateList = openBestFormModal.selectedDateList.map(item => item.split('至'))
      const times = []
      // 重组时间段结构
      for (const tItem of _selectedDateList) {
        times.push({ started_at: tItem[0], stopped_at: tItem[1] })
      }

      const param = {
        type: 0,
        show_type: -1,
        user_type: 2,
        payment_type: 4,

        advertisement_position_id: openBestFormModal.advertisement_position_id,
        user_id: openBestFormModal.lawyer.user_id, // 律师 id
        jump_id: JSONbig.stringify(openBestFormModal.lawyer.user_id),
        jump_type: 'lawyerIndex',
        lawyer_tag_id: [this.advertSeatNavCardList[0].seatId, this.advertSeatNavCardList[1].seatId].includes(openBestFormModal.advertisement_position_id) ? 0 : openBestFormModal.category_id,
        province_id: openBestFormModal.province_id,
        city_id: openBestFormModal.city_id || 0,
        payment_money: openBestFormModal.price.trim(),
        banner: openBestFormModal.image,
        times: JSON.stringify(times)
       }

       try {
         await advertApi.postAddAdvertApi(param)
         this.openBestFormModal = Object.assign({}, OPENBEST_FORM_MODAL) // 重置
         this.refreshTableData()
         this.$notification.success({ message: '开通成功', duration: 3 })
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
        await advertApi.delLawyerAdvertPositionApi({ advertisement_id })
        this.refreshTableData()
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 查看律师广告位埋点页面
     */
    navToLawyerSeatPointPage(record) {
      sessionStorage.setItem('bestLawyerDetail', JSON.stringify(record.user))
      this.$router.push({ name: 'AdvertLawyerSeatPointRoute', query: { advertisementId: String(record.advertisement_id) } })
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
