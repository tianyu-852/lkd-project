
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text" style="margin-right: 10px;">本地案源</span>

      <a-input allow-clear placeholder="搜索姓名/手机号" v-model="searchKey" @keyup.enter="_getCauseSourceVaildList" style="margin: 0 5px; width: 180px" />
      <a-button type="primary" style="margin-right: 10px;" @click="_getCauseSourceVaildList">搜索</a-button>

      <span>地区筛选：</span>
      <a-cascader :options="regionSelectList" placeholder="请选择地区" @change="onRegionFactorCascaderChangeEvt" />

      <!-- 时间筛选 -->
      <!-- <a-range-picker
        @change="onRangePickerChange"
        @ok="_getCauseSourceVaildList(1)"
        style="width: 344px; margin-left: 20px;"
        format="YYYY-MM-DD HH:mm:ss"
        :default-value="[timeFactorInfo.startDate, timeFactorInfo.endDate]"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      /> -->

      <a-button type="primary" style="margin-left: auto" @click="openPublishCauseSourceDrawer">发布新案源</a-button>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getCauseSourceVaildList(tableVolidPagination.current)" >刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <!-- 投放中 -->
        <a-tab-pane key="1" :tab="'进行中 ' + '(' + tableVolidPagination.total + ')'">
          <a-table
            :data-source="tableValidList"
            :loading="tableValidLoading"
            :pagination="tableVolidPagination"
            :rowKey="(record) => String(record.order_no)"
            bordered
          >
            <!-- 用户 -->
            <a-table-column key="nickname" title="用户" align="center" :width="260">
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

            <!-- 发布时间 -->
            <a-table-column dataIndex="created_at" title="发布时间" align="center" />

            <!-- 地区-->
            <a-table-column title="地区" align="center">
              <template slot-scope="record">
                <div>{{ record.lawyer_province }}/{{ record.lawyer_city }}</div>
              </template>
            </a-table-column>

            <!-- 案源类型 -->
            <a-table-column dataIndex="category" title="案源类型" align="center" />

            <!-- 购买人数 -->
            <a-table-column dataIndex="buy_num" title="购买人数" align="center" />

            <!-- 购买律师 -->
            <!-- <a-table-column title="购买律师" align="center">
              <template slot-scope="record">
                <div>{{ 1 }}/{{ 3 }}</div>
              </template>
            </a-table-column> -->

            <!-- 操作 -->
            <a-table-column key="action" title="操作" fixed="right" align="center" :width="220">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawyerDetail(record)">查看用户</a-button>
                <a-popconfirm title="请确认是否删除?" ok-text="确认" cancel-text="取消" @confirm="delCauseSourceFeature(record)">
                  <a-button type="link" style="padding: 0; color: #ff4d4f;">关闭</a-button>
                </a-popconfirm>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 历史投放 -->
        <a-tab-pane key="2" :tab="'已关闭 ' + '(' + tableExpirePagination.total + ')'">
          <a-table
            :data-source="tableValidList"
            :loading="tableValidLoading"
            :pagination="tableVolidPagination"
            :rowKey="(record) => String(record.order_no)"
            :scroll="{ x: 2000 }"
            bordered
          >
            <!-- 当事人 -->
            <a-table-column title="当事人" align="center" :width="240">
              <template slot-scope="record">
                <div>{{ record.parties }}</div>
                <div>{{ record.phone }}</div>
                <div>发布时间：{{ record.created_at }}</div>
              </template>
            </a-table-column>

            <!-- 律师地域-->
            <a-table-column title="律师地域" align="center" :width="140">
              <template slot-scope="record">
                <div>{{ record.lawyer_province }}/{{ record.lawyer_city }}</div>
              </template>
            </a-table-column>

            <!-- 案源类型 -->
            <a-table-column dataIndex="category" title="案源类型" align="center" :width="140" />

            <!-- 购买人数 -->
            <a-table-column dataIndex="buy_num" title="购买人数" align="center" :width="140" />

            <!-- 标的额 -->
            <a-table-column title="标的额" align="center" :width="140">
              <template slot-scope="record">
                <div>￥{{ record.case_money }}</div>
              </template>
            </a-table-column>

            <!-- 案件详情 -->
            <a-table-column title="案件详情" align="center">
              <template slot-scope="record">
                <text-with-row-button :text="record.content" :over-max="28" />
              </template>
            </a-table-column>

            <!-- 图片 -->
            <a-table-column title="图片" align="center" width="340px">
              <template slot-scope="record">
                <div class="column-image">
                  <div v-for="(iItem, iIndex) in record.images" :key="iIndex" class="image-item" v-viewer>
                    <img style="width: 100%; height: 100%;" :src="iItem">
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 文件 -->
            <a-table-column title="文件" align="center">
              <template slot-scope="record">
                <div class="column-file">
                  <a v-for="(fItem, fIndex) in record.cloud_file_ids" :key="fIndex" :href="fItem.file_path" target="_blank" class="file-item">{{ fItem.file_name }}</a>
                </div>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" fixed="right" align="center" :width="110">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openUpdateCauseSourceDrawer(record)">修改</a-button>
                <a-popconfirm title="请确认是否删除?" ok-text="确认" cancel-text="取消" @confirm="delCauseSourceFeature(record)">
                  <a-button type="link" style="padding: 0; color: #ff4d4f;">删除</a-button>
                </a-popconfirm>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>

    </a-card>

    <!-- 发布订单 -->
    <a-drawer
      :title="causeSourceDrawer.order_no ? '更新案源合作' : '发布案源合作'"
      :width="620"
      :visible="causeSourceDrawer.isShowCauseSourceDrawer"
      destroyOnClose
      @close="onCauseSourceDrawerCloseEvt"
    >
      <div class="causeSource-drawer">
        <div class="causeSource-wrap">
          <!-- 当事人姓名 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">当事人姓名：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input v-model="causeSourceDrawer.name" class="input" :maxLength="20" placeholder="当事人姓名" allowClear />
            </div>
          </div>

          <!-- 当事人电话 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">当事人电话：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input v-model="causeSourceDrawer.mobile" class="input" :maxLength="11" placeholder="当事人电话" allowClear />
            </div>
          </div>

          <!-- 律师地域 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">律师地域：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-cascader :defaultValue="[ causeSourceDrawer.lawyer_province_id, causeSourceDrawer.lawyer_city_id ]" :options="regionSelectList" placeholder="请选择当事人地区" @change="onUserRegionCascaderChangeEvt" />
            </div>
          </div>

          <!-- 线索收费金额 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">线索收费金额：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input v-model="causeSourceDrawer.lawyer_buy_money" class="input" :maxLength="20" placeholder="线索收费金额" allowClear />
            </div>
          </div>

          <!-- 购买次数上限 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">购买次数上限：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input-number style="width: 180px;" v-model="causeSourceDrawer.lawyer_buy_max" :min="1" :max="1000" />
            </div>
          </div>

          <!-- 购买次数上限 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">未购买用户能否与你电话沟通：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-switch v-model="causeSourceDrawer.is_communication" />
            </div>
          </div>

          <!-- 当事人预算金额 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">当事人预算金额：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="budget-item">
                <img v-if="!causeSourceDrawer.isDiscuss" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" @click="causeSourceDrawer.isDiscuss = false" />
                <a-input v-model="causeSourceDrawer.budget" style="width: 140px;" :maxLength="20" placeholder="自定义金额" allowClear />
              </div>
              <div class="budget-item" style="margin-left: 30px;" @click="causeSourceDrawer.isDiscuss = true">
                <img v-if="causeSourceDrawer.isDiscuss" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                <span>详谈</span>
              </div>
            </div>
          </div>

          <!-- 案源类型 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">案源类型：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-cascader :options="causeSourceCategoryCascaderList" placeholder="请选择案源类型" @change="onCauseSourceCategoryCascaderChangeEvt" />
            </div>
          </div>
          
          <!-- 标的额 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">标的额：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input v-model="causeSourceDrawer.case_money" class="input" :maxLength="20" placeholder="标的额" allowClear />
            </div>
          </div>

          <!-- 案件描述 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left" style="align-self: flex-start;" >
              <div class="info-title">案件描述：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-textarea v-model="causeSourceDrawer.content" placeholder="请输入案件描述" :autoSize="{ minRows: 5, maxRows: 8 }" />
            </div>
          </div>

          <!-- 图片 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left" style="align-self: flex-start;" >
              <div class="info-title">上传相关图片(选填)：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="image-wrap">
                <div v-for="(iItem, iIndex) in causeSourceDrawer.images" :key="iIndex" class="image-item" v-viewer >
                  <img class="image" :src="iItem" />
                  <a-icon class="icon-close" type="close-circle" @click.stop="causeSourceDrawer.images.splice(iIndex, 1)" />
                </div>

                <div v-if="causeSourceDrawer.images.length < causeSourceDrawerImageLimit" class="image-upload" @click="chooseCauseSourceImage">
                  <a-icon type="plus" style="fontSize: 26px" />
                </div>
              </div>
            </div>
          </div>

          <!-- 文件 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left" style="align-self: flex-start;">
              <div class="info-title">上传相关文件(选填)：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="file-wrap">
                <a-button type="primary" @click="openFileModal">选择文件</a-button>
                <div class="user-file-items">
                  <div v-for="(fItem, fIndex) in causeSourceDrawer.file_ids" :key="fIndex" class="user-file-item">
                    {{ fItem | userFileFilter(userFileModalInfo.userFileList) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a-popconfirm :title="causeSourceDrawer.order_no ? '请确认更新案源合作?' : '请确认发布案源合作?'" ok-text="确定" cancel-text="取消" @confirm="confirmPublishCauseSourceFeature" >
          <a-button v-if="causeSourceDrawer.order_no" class="pub-btn" type="primary">更新案源</a-button>
          <a-button v-else class="pub-btn" type="primary">发布案源</a-button>
        </a-popconfirm>
      </div>
    </a-drawer>

    <!-- 发单详情 -->
    <a-drawer
      :width="620"
      :visible="causeSourceDetailDrawer.isShowCauseSourceDetailDrawer"
      destroyOnClose
      @close="onCauseSourceDrawerCloseEvt"
    >
      <div v-if="causeSourceDetailDrawer.causeSourceDetail" class="causeSourceDetail-drawer">
        <a-tabs v-model="causeSourceDetailDrawer.activeTabKey">
          <a-tab-pane key="1" tab="发单详情">
            <div class="detail-item">
              <div class="detail-item-left">发单人：</div>
              <div class="detail-item-right">发单姓名</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">当事人：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.parties }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">当事电话：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.phone }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">律师地域：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.lawyer_province }}/{{ causeSourceDetailDrawer.causeSourceDetail.lawyer_city }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">案件类型：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.category }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">线索收费金额：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.lawyer_buy_money }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">购买次数上限：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.lawyer_buy_max }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">当事人预算金额：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.budget }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">标的额：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.case_money }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">案件描述：</div>
              <div class="detail-item-right">{{ causeSourceDetailDrawer.causeSourceDetail.content }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">相关图片：</div>
              <div class="detail-item-right">
                <div class="image-wrap">
                  <div v-for="(iItem, iIndex) in causeSourceDetailDrawer.causeSourceDetail.images" :key="iIndex" class="image-item" v-viewer>
                    <img style="width: 100%; height: 100%;" :src="iItem">
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-item-left">相关文件：</div>
              <div class="detail-item-right">
                <div class="file-wrap">
                  <a v-for="(fItem, fIndex) in causeSourceDetailDrawer.causeSourceDetail.cloud_file" :key="fIndex" :href="fItem.file_path" target="_blank" class="file-item">{{ fItem.file_name }}</a>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="购买律师">
            购买律师
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-drawer>

    <!-- 用户文件 modal -->
    <a-modal
      v-model="userFileModalInfo.isShowUserFileModal"
      title="文件列表"
      :width="500"
      :zIndex="1001"
      :bodyStyle="{ padding: '10px' }"
      @ok="onUserFileModalOkEvt"
    >
      <div class="file-modal">
        <div class="upload-wrap">
          <a-button type="link" @click="chooseUserFile">上传文件</a-button>
        </div>
        <a-checkbox-group style="width: 100%;" :defaultValue="userFileModalInfo.userCheckedFileIds" @change="onUserFileCheckboxChange">
          <a-row class="checkbox-row" v-for="(fItem, fIndex) in userFileModalInfo.userFileList" :key="fIndex">
            <a-col :span="24">
              <a-checkbox class="checkbox" :value="fItem.admin_file_id">
                <div class="file-info">
                  <div class="file-name">{{ fItem.title }}</div>
                  <div class="file-time">{{ fItem.file_size }}kB, {{ fItem.created_at }}</div>
                </div>
                <a-popconfirm
                  v-if="userFileModalInfo.userCheckedFileIds.indexOf(fItem.admin_file_id) >= 0 ? false : true"
                  title="请确认是否删除该文件?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delUserFile(fItem, fIndex)"
                >
                  <a-button type="link" size="small">删除</a-button>
                </a-popconfirm>
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
    </a-modal>

    <!-- 案源图片 input 多文件上传  -->
    <input
      v-if="isShowCSImageFileInput"
      id="input"
      ref="fileInputCSImageRef"
      type="file"
      style="display: none;"
      accept="image/*"
      multiple
      @change="onCSImageInputFileChange"
    >

    <!-- 案源文件 input 单文件上传 -->
    <input
      v-if="isShowUserFileInput"
      id="input"
      ref="fileInputUserRef"
      type="file"
      style="display: none;"
      @change="onUserInputFileChange"
    >
  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import fileUtil from '@/utils/fileUtil'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import UserVipCell from '@/components/User/UserVipCell'
import moment from 'moment'
import { getData } from '@/utils/dataTime'

// 附件信息
const USER_FILE_INFO = {
  userFileList: [], // 用户文件列表
  userCheckedFileIds: [], // 用户选中的文件 ids
  isShowUserFileModal: false, // 是否显示附件 modal
}

// 案件信息
const CAUSESOURCE_INFO = {
  isShowCauseSourceDrawer: false,
  order_no: '', // 订单号
  
  name: '', // 联系人姓名
  mobile: '', // 联系人电话
  lawyer_province_id: '', // 律师地域省份 id
  lawyer_city_id: '', // 律师地域城市 id
  lawyer_buy_money: '', // 线索收费金额
  lawyer_buy_max: '1', // 购买次数上限
  is_communication: false, // 购买次数上限

  case_money: '', // 标的额
  category_id: '', // 案源类型id
  content: '', // 案源描述
  budget: '', // 当事人预算
  isDiscuss: false, // 是否面议

  images: [], // 图片地址数组
  file_ids: [], // 文件 ids
}

export default {
  name: 'CauseSourceUnion',
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

      tableExpireList: [], // 历史投放
      tableExpireLoading: false, // 历史投放数据是否加载中
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

      userFileModalInfo: Object.assign({}, USER_FILE_INFO), // 用户 附件 modal 信息
      causeSourceDrawer: JSON.parse(JSON.stringify(CAUSESOURCE_INFO)), // 案源信息 drawer

      // 案源详情 drawer
      causeSourceDetailDrawer: {
        isShowCauseSourceDetailDrawer: false,
        causeSourceDetail: null,
        activeTabKey: '1',
      },

      causeSourceCategoryCascaderList: [], // 案源分类 option 列表
      regionSelectList: [], // 律师地区 select 列表

      causeSourceDrawerImageLimit: 9, // 案源图片限制 9 张

      isShowCSImageFileInput: true, // 是否显示上传案源图片 input
      isShowUserFileInput: true, // 是否显示上传用户文件 input
    }
  },
  created() {
    this._getCauseSourceVaildList()

    this._getCauseSourceCategoryList()
    this._getRegionList()
  },
  methods: {
    moment,
    getData,

    /**
     * 获取案源分类列表
     */
    async _getCauseSourceCategoryList() {
      try {
        const { data: causeSourceCategoryData } = await causeSourceApi.getCauseSourceCategoryListApi()

        const _categoryoptionList = []
        for (let i = 0; i < causeSourceCategoryData.length; i++) {
          if (causeSourceCategoryData[i].lawyer_tag_group) {
            _categoryoptionList.push({ label: causeSourceCategoryData[i].lawyer_tag_group, value: causeSourceCategoryData[i].lawyer_tag_group, children: [] })
            for (let j = 0; j < causeSourceCategoryData[i].lawyer_tags.length; j++) {
              _categoryoptionList[i].children.push({ label: causeSourceCategoryData[i].lawyer_tags[j].lawyer_tag, value: causeSourceCategoryData[i].lawyer_tags[j].lawyer_tag_id })
            }
          }
        }

        this.causeSourceCategoryCascaderList = _categoryoptionList
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
      this._getCauseSourceVaildList()
    },

    /**
     * 获取案源有效 table 列表
     */
    async _getCauseSourceVaildList(page = 1) {
      const param = {
        page,
        size: this.tableVolidPagination.pageSize,
      }
      // this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      // this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)

      this.tableValidLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCauseSourceUnionListApi(param)
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
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      const userId = String(record.lawyer.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },

    /**
     * 打开发布案源 drawer
     */
    openPublishCauseSourceDrawer() {
      this.causeSourceDrawer = JSON.parse(JSON.stringify(CAUSESOURCE_INFO))
      this.causeSourceDrawer.isShowCauseSourceDrawer = true
    },

    /**
     * 关闭发布案源/案源详情 drawer
     */
    onCauseSourceDrawerCloseEvt() {
      this.causeSourceDrawer.isShowCauseSourceDrawer = false
      this.causeSourceDetailDrawer.isShowCauseSourceDetailDrawer = false
    },

    /**
     * 打开案源详情 drawer
     */
    async openCauseSourceDetailDrawer(record) {
      try {
        const { data: causeSourceData } = await causeSourceApi.getCauseSourceDetailApi({ order_no: record.order_no })
        this.causeSourceDetailDrawer.causeSourceDetail = causeSourceData
        this.causeSourceDetailDrawer.isShowCauseSourceDetailDrawer = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开更新案源 drawer
     */
    openUpdateCauseSourceDrawer(record) {
      this.causeSourceDrawer.order_no = record.order_no
      this.causeSourceDrawer.name = record.name
      this.causeSourceDrawer.mobile = record.mobile
      this.causeSourceDrawer.lawyer_province_id = record.province_id
      this.causeSourceDrawer.lawyer_city_id = record.city_id
      this.causeSourceDrawer.content = record.content
      this.causeSourceDrawer.images = record.images
      this.causeSourceDrawer.file_ids = record.file.map(item => item.admin_file_id)
      this.userFileModalInfo.userCheckedFileIds = this.causeSourceDrawer.file_ids
      // 获取后台文件库
      causeSourceApi.getCauseSourceFeatureFileListApi({ page: 1, size: 500, type: 2 })
        .then(res => {
          this.userFileModalInfo.userFileList = res.data.data
        })
      this.causeSourceDrawer.isShowCauseSourceDrawer = true
    },

    /**
     * 监听案源类型选择 事件
     */
    onCauseSourceCategoryCascaderChangeEvt(value, selectedOptions) {
      this.causeSourceDrawer.category_id = value[1]
    },

    /**
     * 监听当事人地区选择 事件
     */
    onUserRegionCascaderChangeEvt(value, selectedOptions) {
      this.causeSourceDrawer.lawyer_province_id = value[0]
      this.causeSourceDrawer.lawyer_city_id = value[1]
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
      const { causeSourceDrawer, causeSourceDrawerImageLimit } = this
      const causeSourceImageList = causeSourceDrawer.images
      const fileList = event.target.files
      this.isShowCSImageFileInput = false

      const newImageFileList = Array.from(fileList).slice(0, causeSourceDrawerImageLimit - causeSourceImageList.length)
      const newImageUrlList = []

      try {
        for (const imageFile of newImageFileList) {
          const imageUrl = await fileUtil.uploadFile(imageFile)
          newImageUrlList.push(imageUrl)
        }

        this.causeSourceDrawer.images.push(...newImageUrlList)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开 文件列表 modal
     */
    async openFileModal() {
      const param = { page: 1, size: 500, type: 2 }

      try {
        const { data: userFileData } = await causeSourceApi.getCauseSourceFeatureFileListApi(param)
        this.userFileModalInfo.userFileList = userFileData.data
        this.userFileModalInfo.isShowUserFileModal = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择文件
     * https://juejin.cn/post/6844903697667850248
     */
    chooseUserFile() {
      this.isShowUserFileInput = true
      this.$nextTick(() => {
        // this.$refs.fileInputCSImageRef.click() 
        this.$refs.fileInputUserRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onUserInputFileChange(event) {
      const file = event.target.files[0]
      this.isShowUserFileInput = false

      try {
        const fileUrl = await fileUtil.uploadFile(file)

        const param = {
          title: file.name,
          url: fileUrl,
          file_size: file.size + '',
          type: 2
        }
        const { data } = await causeSourceApi.postCauseSourceFeatureFileApi(param)
        // 获取用户文件
        const { data: userFileData } = await causeSourceApi.getCauseSourceFeatureFileListApi({ page: 1, size: 500, type: 2 })
        this.userFileModalInfo.userFileList = userFileData.data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择文件 checkbox 变化时回调事件
     */
    onUserFileCheckboxChange(checkedValues) {
      this.userFileModalInfo.userCheckedFileIds = checkedValues
    },

    /**
     * 删除用户文件
     */
    async delUserFile(fileItem, fileIndex) {
      const { admin_file_id } = fileItem
      const param = { admin_file_id: admin_file_id }

      try {
        await causeSourceApi.delCauseSourceFeatureFileApi(param)
        this.userFileModalInfo.userFileList.splice(fileIndex, 1)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听用户文件 modal ok 事件
     */
    onUserFileModalOkEvt() {
      const { userFileModalInfo } = this
      this.causeSourceDrawer.file_ids = userFileModalInfo.userCheckedFileIds
      this.userFileModalInfo.isShowUserFileModal = false
    },

    /**
     * 删除案源精选
     */
    async delCauseSourceFeature(record) {
      const param = { order_no: record.order_no }
      try {
        const { data: causeSourceData } = await causeSourceApi.delCauseSourceFeatureApi(param)
        this._getCauseSourceVaildList(this.tableVolidPagination.current)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 发布/更新 精选案源
     */
    async confirmPublishCauseSourceFeature() {
      const { causeSourceDrawer } = this
      if (!causeSourceDrawer.name.trim()) return this.$message.warning('请输入当事人姓名')
      if (!causeSourceDrawer.mobile.trim()) return this.$message.warning('请输入当事人手机号')
      if (!causeSourceDrawer.lawyer_city_id) return this.$message.warning('请选择当事人位置')
      if (!causeSourceDrawer.category_id) return this.$message.warning('请选择案件分类')
      if (!causeSourceDrawer.content.trim()) return this.$message.warning('请填写案件描述')
      this.causeSourceDrawer.isShowCauseSourceDrawer = false

      const param = {
        name: causeSourceDrawer.name.trim(), // 当事人姓名
        mobile: causeSourceDrawer.mobile.trim(), // 当事人姓名
        province_id: causeSourceDrawer.lawyer_province_id, // 省份 id
        city_id: causeSourceDrawer.lawyer_city_id, // 城市 id
        category_id: causeSourceDrawer.category_id, // 分类 id
        content: causeSourceDrawer.content.trim(), // 描述
        images: JSON.stringify(this.causeSourceDrawer.images),
        file_ids: JSON.stringify(this.causeSourceDrawer.file_ids),
      }

      console.log(param)
      return

      // 更新案源 添加 order_no
      causeSourceDrawer.order_no && (param.order_no = causeSourceDrawer.order_no)

      try {
        // 更新 案源精选
        if (causeSourceDrawer.order_no) {
          await causeSourceApi.updateCauseSourceFeatureApi(param)
          this.$notification.success({ message: '更新成功', duration: 3 })
        // 发布 案源精选
        } else {
          await causeSourceApi.postCauseSourceFeatureApi(param)
          this.$notification.success({ message: '发布成功', duration: 3 })
        }
        // 重置案源 drawer
        this.causeSourceDrawer = JSON.parse(JSON.stringify(CAUSESOURCE_INFO))
        // 发布成功以后重新展示数据
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

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
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

.causeSource-drawer {
  position: relative;
  padding-bottom: 40px;
  .causeSource-wrap {
    .causeSource-info-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #333;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .causeSource-info-left {
        min-width: 120px;
        .info-title {
          font-size: 14px;
          font-weight: 600;
          // text-align: right;
        }
      }
      .causeSource-info-middle {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .input {
          width: 180px;
        }
        .budget-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .option-wrap {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .option-item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 26px;
            padding: 0 16px;
            margin-right: 20px;
            font-size: 12px;
            color: #333;
            background: #eee;
            border-radius: 2px;
            cursor: pointer;
            &:last-child {
              margin-right: 0;
            }
            &.option-item-active {
              color: #fff;
              background: #1790ff;
            }
          }
        }
        .image-wrap {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 10px;
          width: 100%;
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
        .file-wrap {
          .user-file-items {
            margin-top: 6px;
            .user-file-item {
              font-size: 14px;
              color: #1790ff;
            }
          }
        }
      }
    }
  }
  .pub-btn {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}

.causeSourceDetail-drawer {
  .detail-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #333;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .detail-item-left {
      min-width: 120px;
      font-size: 14px;
      font-weight: 600;
    }
    .detail-item-right {
      flex: 1;
      .image-wrap {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        .image-item {
          height: 100px;
          cursor: pointer;
        }
      }
    }
  }
}

.file-modal {
  height: 310px;
  overflow-y: auto;
  .upload-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .upload-file-info {
      font-size: 14px;
      color: #999;
    }
  }
  .checkbox-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .checkbox {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      /deep/ span {
        &:last-child {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .file-info {
            flex: 1;
            .file-name {
              font-size: 14px;
              font-weight: 500;
              color: #14284a;
              max-width: 330px;
              white-space: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              /* ! autoprefixer: off */
              -webkit-box-orient: vertical;
            }
            .file-time {
              font-size: 12px;
              font-weight: 500;
              color: #6e7695;
            }
          }
        }
      }
    }
  }
}
</style>
