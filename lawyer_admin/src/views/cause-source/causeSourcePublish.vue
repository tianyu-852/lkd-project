
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">线索总数：{{ pagination.total }}</span>

      <a-button
        type="primary"
        style="margin: 0 10px"
        @click="openPublishCauseSourceDrawer"
      >发单</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button
          icon="sync"
          size="small"
          style="margin-left: auto;"
          @click="_getCauseSourceList(pagination.current)"
        >刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.demand_id)"
        bordered
      >
        <!-- id -->
        <!-- <a-table-column dataIndex="financial_legal_sales_relation_id" title="ID" align="center" /> -->

        <!-- 用户名称 -->
        <a-table-column dataIndex="other_contact.name" title="用户名称" align="center" />

        <!-- 用户手机号 -->
        <a-table-column dataIndex="other_contact.mobile" title="用户手机号" align="center" />

        <!-- 发布人类型 -->
        <a-table-column dataIndex="release_type" title="发布人类型" align="center" />

        <!-- 发布时间 -->
        <a-table-column title="发布时间" align="center" >
          <template slot-scope="record">
            {{ getData(record.created_at) }}
          </template>
        </a-table-column>

        <!-- 案源类型 -->
        <a-table-column dataIndex="demand_type" title="案源类型" align="center" />

        <!-- 律师区域 -->
        <a-table-column dataIndex="lawyer_city" title="律师区域" align="center" />
        <!-- category -->

        <!-- 案件详情 -->
        <a-table-column title="案件详情" align="center" >
          <template slot-scope="record">
            <text-with-row-button
              :text="record.content"
              :over-max="10"
            />
          </template>
        </a-table-column>

        <!-- 附件 -->
        <a-table-column dataIndex="" title="附件" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" >
          <template slot-scope="record">
            <a-popconfirm
              v-if="record.status === 40"
              title="请确认是否重新发布?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="AgainPublish(record)"
            >
              <a-button
                class="againBtn"
                type="link"
                style="padding: 0; margin-right: 10px;"
              >重新发布</a-button>
            </a-popconfirm>

          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 发布订单 -->
    <a-drawer
      title="发布订单"
      :width="620"
      :visible="causeSourceDrawerInfo.isShowCauseSourceDrawer"
      destroyOnClose
      @close="onCauseSourceDrawerCloseEvt"
    >
      <div class="causeSource-drawer">
        <div class="causeSource-wrap">
          <!-- 订单类型 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">订单类型：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="option-wrap">
                <div
                  v-for="(tItem, tIndex) in causeSourceTypeSelectList"
                  :key="tItem.demand_type_id"
                  class="option-item"
                  :class="{ 'option-item-active': causeSourceDrawerInfo.demand_type_info.demand_type_index === tIndex }"
                  @click="changeCauseSourceType(tItem, tIndex)"
                >{{ tItem.demand_type }}</div>
              </div>
            </div>
          </div>

          <!-- 订单标签 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">订单标签：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="option-wrap">
                <div
                  v-for="(tItem, tIndex) in causeSourceTagSelectList"
                  :key="tItem.demand_tags_id"
                  class="option-item"
                  :class="{ 'option-item-active': causeSourceDrawerInfo.demand_tags_info.demand_tags_index === tIndex }"
                  @click="changeCauseSourceTag(tItem, tIndex)"
                >{{ tItem.name }}</div>
              </div>
            </div>
          </div>

          <!-- 涉及分类 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">涉及分类：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-cascader
                :options="causeSourceCategoryOptionList"
                placeholder="请选择涉及分类"
                @change="onCauseSourceCategoryCascaderChangeEvt"
              />
            </div>
          </div>

          <!-- 律师地区 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">律师地区：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-cascader
                :options="lawyerRegionOptionList"
                placeholder="请选择律师地区"
                @change="onLawyerRegionCascaderChangeEvt"
              />
            </div>
          </div>

          <!-- 用户 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">用户：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="user-wrap">
                <!-- 搜索的用户 -->
                <div class="user-input-wrap">
                  <a-input-search
                    placeholder="请输入用户手机号"
                    style="width: 200px;"
                    v-model="searchUser.userMobile"
                    :maxLength="11"
                    enter-button
                    allowClear
                    @search="onSearchUserEvt"
                  />
                  <div
                    v-if="searchUser.userList.length"
                    class="user-search-list"
                  >
                    <div
                      v-for="(uItem, uIndex) in searchUser.userList"
                      :key="uIndex"
                      class="user-search-item"
                      @click="selectSearchUser(uItem)"
                    >
                      <span
                        class="user-type">{{ uItem.source_type_chinese }}</span>
                      <span class="user-nickname">{{ uItem.nickname }}</span>
                    </div>
                  </div>
                </div>
                <!-- 选中的用户 -->
                <div
                  v-if="causeSourceDrawerInfo.user_info.user_id"
                  class="user-info-wrap"
                >
                  <span
                    class="user-type">{{ causeSourceDrawerInfo.user_info.source_type_chinese }}</span>
                  <span
                    class="user-nickname">{{ causeSourceDrawerInfo.user_info.nickname }}</span>
                  <a-icon
                    class="icon-close"
                    type="close-circle"
                    @click.stop="removeSearchUser"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 案件描述 -->
          <div class="causeSource-info-item">
            <div
              class="causeSource-info-left"
              style="align-self: flex-start;"
            >
              <div class="info-title">案件描述：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-textarea
                v-model="causeSourceDrawerInfo.content"
                placeholder="请输入案件描述（选填）"
                :autoSize="{ minRows: 5, maxRows: 8 }"
              />
            </div>
          </div>

          <!-- 图片 -->
          <div class="causeSource-info-item">
            <div
              class="causeSource-info-left"
              style="align-self: flex-start;"
            >
              <div class="info-title">图片(选填)：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="image-wrap">
                <div
                  v-for="(iItem, iIndex) in causeSourceDrawerInfo.related_images"
                  :key="iIndex"
                  class="image-item"
                  v-viewer
                >
                  <img
                    class="image"
                    :src="iItem"
                  />
                  <a-icon
                    class="icon-close"
                    type="close-circle"
                    @click.stop="causeSourceDrawerInfo.related_images.splice(iIndex, 1)"
                  />
                </div>

                <div
                  v-if="causeSourceDrawerInfo.related_images.length < causeSourceDrawerImageLimit"
                  class="image-upload"
                  @click="chooseCauseSourceImage"
                >
                  <a-icon
                    type="plus"
                    style="fontSize: 26px"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 附件 -->
          <div class="causeSource-info-item">
            <div
              class="causeSource-info-left"
              style="align-self: flex-start;"
            >
              <div class="info-title">附件(选填)：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="file-wrap">
                <a-button
                  type="primary"
                  @click="openUserFileModal"
                >选择附件</a-button>
                <div class="user-file-items">
                  <div
                    v-for="(fItem, fIndex) in causeSourceDrawerInfo.related_cloud_file_ids"
                    :key="fIndex"
                    class="user-file-item"
                  >
                    {{ fItem | userFileFilter(userFileModalInfo.userFileList) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 联系人姓名 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">联系人姓名：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input
                class="input"
                style="width: 160px;"
                v-model="causeSourceDrawerInfo.other_contact_info.name"
                :maxLength="20"
                placeholder="联系人姓名"
                allowClear
              />
            </div>
          </div>

          <!-- 联系人电话 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">联系人电话：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input
                class="input"
                style="width: 160px;"
                v-model="causeSourceDrawerInfo.other_contact_info.mobile"
                :maxLength="11"
                placeholder="联系人电话"
                allowClear
              />
            </div>
          </div>

          <template
            v-if="causeSourceDrawerInfo.demand_type_info.demand_type_name === '刑事会见'"
          >
            <!-- <template v-if="true"> -->
            <!-- 关押地点 -->
            <div class="causeSource-info-item">
              <div class="causeSource-info-left">
                <div class="info-title">关押地点：</div>
              </div>
              <div class="causeSource-info-middle">
                <a-input
                  class="input"
                  v-model="causeSourceDrawerInfo.imprisoned_address"
                  placeholder="请输入关押地点（选填）"
                  allowClear
                />
              </div>
            </div>

            <!-- 拘留单 -->
            <div class="causeSource-info-item">
              <div
                class="causeSource-info-left"
                style="align-self: flex-start;"
              >
                <div class="info-title">拘留单(选填)：</div>
              </div>
              <div class="causeSource-info-middle">
                <div class="image-wrap">
                  <div
                    v-if="causeSourceDrawerInfo.detention_slip_image"
                    class="image-item"
                    v-viewer
                  >
                    <img
                      class="image"
                      :src="causeSourceDrawerInfo.detention_slip_image"
                    />
                    <a-icon
                      class="icon-close"
                      type="close-circle"
                      @click.stop="causeSourceDrawerInfo.detention_slip_image = ''"
                    />
                  </div>
                  <div
                    v-else
                    class="image-upload"
                    @click="chooseCauseSourceDSImage"
                  >
                    <a-icon
                      type="plus"
                      style="fontSize: 26px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 标的额 -->
          <div
            v-if="causeSourceDrawerInfo.demand_type_info.demand_type_name === '委托打官司'"
            class="causeSource-info-item"
          >
            <div class="causeSource-info-left">
              <div class="info-title">标的额：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input
                class="input"
                style="width: 200px;"
                v-model="causeSourceDrawerInfo.case_money"
                :maxLength="11"
                placeholder="请输入标的额（选填）"
                allowClear
              />
            </div>
          </div>
        </div>
        <a-popconfirm
          title="请确认发布线索?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="publishCauseSource"
        >
          <a-button
            class="pub-btn"
            type="primary"
          >发布线索</a-button>
        </a-popconfirm>
      </div>
    </a-drawer>

    <!-- 用户文件 modal -->
    <a-modal
      v-model="userFileModalInfo.isShowUserFileModal"
      title="文件列表"
      :width="400"
      :zIndex="1001"
      :bodyStyle="{ padding: '10px' }"
      @ok="onUserFileModalOkEvt"
    >
      <div class="file-modal">
        <div class="upload-wrap">
          <a-button
            type="link"
            @click="chooseUserFile"
          >上传文件</a-button>
        </div>
        <a-checkbox-group
          style="width: 100%;"
          :defaultValue="userFileModalInfo.userCheckedFileIds"
          @change="onUserFileCheckboxChange"
        >
          <a-row
            class="checkbox-row"
            v-for="(fItem, fIndex) in userFileModalInfo.userFileList"
            :key="fIndex"
          >
            <a-col :span="24">
              <a-checkbox
                class="checkbox"
                :value="fItem.cloud_file_id"
              >
                <div class="file-info">
                  <div class="file-name">{{ fItem.basename }}</div>
                  <div class="file-time">{{ fItem.file_size }},
                    {{ fItem.created_at }}</div>
                </div>
                <a-button
                  type="link"
                  size="small"
                >下载</a-button>
                <a-popconfirm
                  v-if="userFileModalInfo.userCheckedFileIds.indexOf(fItem.cloud_file_id) >= 0 ? false : true"
                  title="请确认是否删除该文件?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delUserFile(fItem, fIndex)"
                >
                  <a-button
                    type="link"
                    size="small"
                  >删除</a-button>
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

    <!-- 案源拘留单图片 input 单文件上传 -->
    <input
      v-if="isShowDSImageFileInput"
      id="input"
      ref="fileInputDSImageRef"
      type="file"
      style="display: none;"
      accept="image/*"
      @change="onDSImageInputFileChange"
    >

    <!-- 用户文件 input 单文件上传 -->
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
import { getData } from '@/utils/dataTime'

// 附件信息
const USER_FILE_INFO = {
  userFileList: [], // 用户文件列表
  userCheckedFileIds: [], // 用户选中的文件 ids
  isShowUserFileModal: false, // 是否显示附件 modal
}

// 案件信息
const CAUSESOURCE_INFO = {
  isShowCauseSourceDrawer: false, // 是否显示
  content: '', // 案件描述
  case_money: '', // 标的额
  related_images: [], // 图片
  related_cloud_file_ids: [], // 用户附件 云盘 id
  detention_slip_image: '', // 拘留单图片
  imprisoned_address: '', // 关押地点
  demand_type_info: {
    demand_type_name: '', // 案源订单类型名称
    demand_type_id: '', // 案源订单类型 id
    demand_type_index: -1, // 案源订单类型 下标k
  },
  demand_tags_info: {
    demand_tags_id: '', // 案源订单标签 id
    demand_tags_index: -1, // 案源订单标签 下标
  },
  category_info: {
    category_id: '', // 分类 id
    category: '', // 分类名称
  },
  lawyer_region_info: {
    lawyer_province_id: '', // 律师省份 id
    lawyer_city_id: '', // 律师城市 id
  },
  other_contact_info: {
    name: '', // 联系人姓名
    mobile: '', // 联系人电话
  },
  user_info: {
    user_id: '', // 用户id
  },
}

export default {
  name: 'CauseSourcePublish',
  components: {
    TextWithRowButton
  },
  filters: {
    userFileFilter(fileId, userFileList) {
      const fileInfo = userFileList.find(item => item.cloud_file_id === fileId)
      if (fileInfo) return fileInfo.basename
    }
  },
  data() {
    return {
      tableDataList: [], // table 列表
      tableDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSourceList(page)
          this.pagination.current = page
        },
      },

      userFileModalInfo: Object.assign({}, USER_FILE_INFO), // 用户 附件 modal 信息

      // causeSourceDrawerInfo: Object.assign({}, CAUSESOURCE_INFO), // 案源信息 drawer
      causeSourceDrawerInfo: JSON.parse(JSON.stringify(CAUSESOURCE_INFO)), // 案源信息 drawer
      causeSourceTypeSelectList: [], // 案源类型 select 列表
      causeSourceTagSelectList: [], // 案源标签 select 列表
      causeSourceCategoryOptionList: [], // 案源分类 option 列表
      lawyerRegionOptionList: [], // 律师地区 option 列表

      isShowCSImageFileInput: true, // 是否显示上传案源图片 input
      isShowDSImageFileInput: true, // 是否显示上传案源拘留单图片 input
      isShowUserFileInput: true, // 是否显示上传用户文件 input
      causeSourceDrawerImageLimit: 6, // 案源图片限制 9 张
      searchUser: { userMobile: '', userList: [], }, // 搜索用户
    }
  },
  created() {
    this._getCauseSourceList()

    this._getCauseSourceTypeList()
    this._getCauseSourceTagList()
    this._getCauseSourceCategoryList()
    this._getLawyerRegionList()
  },
  methods: {
    getData,
    /**
     * 重新发布
     */
    async AgainPublish(record) {
      const param = { demand_id: record.demand_id }
      try {
        const { data: causeSourceData } = await causeSourceApi.againPublishApi(param)
        console.log(causeSourceData)
        this._getCauseSourceList(this.pagination.current)
      } catch (error) {
        this.tableDataLoading = false
        console.log(error)
      }
    },

    /**
     * 获取线索 table 列表
     * @TODO 待完善
     */
    async _getCauseSourceList(page = 1) {
      const param = {
        page,
        size: this.pagination.pageSize,
        sort: 1,
        clues_status: 1,
      }
      this.tabelDataLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.causeSourceListApi(param)
        this.tableDataList = causeSourceData.data
        this.pagination.total = causeSourceData.total
        this.pagination.current = page
        this.tableDataLoading = false
      } catch (error) {
        this.tableDataLoading = false
        console.log(error)
      }
    },

    /**
     * 获取案源类型列表
     */
    async _getCauseSourceTypeList() {
      try {
        const { data: causeSourceTypeData } = await causeSourceApi.getCauseSourceTypeListApi()
        this.causeSourceTypeSelectList = causeSourceTypeData.data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取案源标签列表
     */
    async _getCauseSourceTagList() {
      try {
        const { data: causeSourceTagData } = await causeSourceApi.getCauseSourceTagListApi()
        this.causeSourceTagSelectList = causeSourceTagData
      } catch (error) {
        console.log(error)
      }
    },

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
        this.causeSourceCategoryOptionList = _categoryoptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取律师地区列表
     */
    async _getLawyerRegionList() {
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

        this.lawyerRegionOptionList = _regioinOptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开发布案源 drawer
     */
    openPublishCauseSourceDrawer() {
      this.causeSourceDrawerInfo.isShowCauseSourceDrawer = true
    },

    /**
     * 关闭发布案源 drawer
     */
    onCauseSourceDrawerCloseEvt() {
      this.causeSourceDrawerInfo.isShowCauseSourceDrawer = false
    },

    /**
     * 改变案源类型
     */
    changeCauseSourceType(cSType, cSTypeIndex) {
      this.causeSourceDrawerInfo.demand_type_info.demand_type_id = cSType.demand_type_id
      this.causeSourceDrawerInfo.demand_type_info.demand_type_name = cSType.demand_type
      this.causeSourceDrawerInfo.demand_type_info.demand_type_index = cSTypeIndex
    },

    /**
     * 改变案源标签
     */
    changeCauseSourceTag(cSTag, cSTagIndex) {
      this.causeSourceDrawerInfo.demand_tags_info.demand_tags_id = cSTag.demand_tags_id
      this.causeSourceDrawerInfo.demand_tags_info.demand_tags_index = cSTagIndex
    },

    /**
     * 监听案源涉及分类选择 事件
     */
    onCauseSourceCategoryCascaderChangeEvt(value, selectedOptions) {
      this.causeSourceDrawerInfo.category_info.category = value[0]
      this.causeSourceDrawerInfo.category_info.category_id = value[1]
    },

    /**
     * 监听律师地区选择 事件
     */
    onLawyerRegionCascaderChangeEvt(value, selectedOptions) {
      this.causeSourceDrawerInfo.lawyer_region_info.lawyer_province_id = value[0]
      this.causeSourceDrawerInfo.lawyer_region_info.lawyer_city_id = value[1]
    },

    /**
     * 监听 input search 事件
     */
    async onSearchUserEvt(value, event) {
      if (!value.trim()) { return this.searchUser.userList = [] }
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value.trim()))) return this.$message.warning('请输入正确的手机号')

      const param = { search: value.trim() }
      try {
        const { data: userData } = await causeSourceApi.searchUserApi(param)
        this.searchUser.userList = userData
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择用户
     */
    selectSearchUser(userItem) {
      this.causeSourceDrawerInfo.user_info.user_id = userItem.user_id
      this.causeSourceDrawerInfo.user_info.nickname = userItem.nickname
      this.causeSourceDrawerInfo.user_info.source_type_chinese = userItem.source_type_chinese
      this.causeSourceDrawerInfo.other_contact_info.mobile = userItem.mobile
      this.searchUser.userList = []
    },

    /**
     * 移除用户
     */
    removeSearchUser() {
      this.causeSourceDrawerInfo.user_info = {}
      this.searchUser.userMobile = ''
      this.searchUser.userList = []

      this.causeSourceDrawerInfo.related_cloud_file_ids = []
      this.userFileModalInfo = Object.assign({}, USER_FILE_INFO)
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
      const { causeSourceDrawerInfo, causeSourceDrawerImageLimit } = this
      const causeSourceImageList = causeSourceDrawerInfo.related_images
      const fileList = event.target.files
      this.isShowCSImageFileInput = false

      const newImageFileList = Array.from(fileList).slice(0, causeSourceDrawerImageLimit - causeSourceImageList.length)
      const newImageUrlList = []

      try {
        for (const imageFile of newImageFileList) {
          const imageUrl = await fileUtil.uploadFile(imageFile)
          newImageUrlList.push(imageUrl)
        }

        this.causeSourceDrawerInfo.related_images.push(...newImageUrlList)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择案源拘留单图片
     * https://juejin.cn/post/6844903697667850248
     */
    chooseCauseSourceDSImage() {
      this.isShowDSImageFileInput = true
      this.$nextTick(() => {
        // this.$refs.fileInputCSImageRef.click() 
        this.$refs.fileInputDSImageRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onDSImageInputFileChange(event) {
      const file = event.target.files[0]
      this.isShowDSImageFileInput = false

      try {
        const imageUrl = await fileUtil.uploadFile(file)
        this.causeSourceDrawerInfo.detention_slip_image = imageUrl
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开 用户文件列表 modal
     */
    async openUserFileModal() {
      const { causeSourceDrawerInfo } = this
      if (!causeSourceDrawerInfo.user_info.user_id) return this.$message.warning('请先选择用户')

      const param = {
        user_id: String(causeSourceDrawerInfo.user_info.user_id),
        page: 1,
        size: 500
      }

      try {
        if (!this.userFileModalInfo.userFileList.length) {
          const { data: userFileData } = await causeSourceApi.getUserFileApi(param)
          this.userFileModalInfo.userFileList = userFileData.items
        }
        this.userFileModalInfo.isShowUserFileModal = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择用户文件
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
      const { causeSourceDrawerInfo } = this
      const file = event.target.files[0]
      this.isShowUserFileInput = false

      try {
        const fileUrl = await fileUtil.uploadFile(file)

        const param = {
          user_id: causeSourceDrawerInfo.user_info.user_id,
          basename: file.name,
          url: fileUrl,
          file_size: file.size
        }
        const { data } = await causeSourceApi.postAddUserFileApi(param)
        // 获取用户文件
        const { data: userFileData } = await causeSourceApi.getUserFileApi({ user_id: String(causeSourceDrawerInfo.user_info.user_id), page: 1, size: 500 })
        this.userFileModalInfo.userFileList = userFileData.items
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 用户文件 checkbox 变化时回调事件
     */
    onUserFileCheckboxChange(checkedValues) {
      this.userFileModalInfo.userCheckedFileIds = checkedValues
    },

    /**
     * 删除用户文件
     */
    async delUserFile(fileItem, fileIndex) {
      const { causeSourceDrawerInfo } = this
      if (!causeSourceDrawerInfo.user_info.user_id) return this.$message.warning('请先选择用户')
      const { cloud_file_id } = fileItem

      const param = {
        user_id: causeSourceDrawerInfo.user_info.user_id,
        cloud_file_id: cloud_file_id,
      }

      try {
        const { data: delData } = await causeSourceApi.delUserFileApi(param)
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
      this.causeSourceDrawerInfo.related_cloud_file_ids = userFileModalInfo.userCheckedFileIds
      this.userFileModalInfo.isShowUserFileModal = false
    },

    /**
     * 发布线索
     */
    async publishCauseSource() {
      const { causeSourceDrawerInfo } = this
      if (!causeSourceDrawerInfo.demand_type_info.demand_type_id) return this.$message.warning('请选择订单类型')
      if (!causeSourceDrawerInfo.demand_tags_info.demand_tags_id) return this.$message.warning('请选择订单标签')
      if (!causeSourceDrawerInfo.category_info.category_id) return this.$message.warning('请选择涉及分类')
      if (!causeSourceDrawerInfo.lawyer_region_info.lawyer_city_id && !causeSourceDrawerInfo.lawyer_region_info.lawyer_province_id) return this.$message.warning('请选择律师地区')
      if (!causeSourceDrawerInfo.user_info.user_id) return this.$message.warning('请选择用户')
      if (!causeSourceDrawerInfo.other_contact_info.name.trim()) return this.$message.warning('请输入联系人姓名')
      if (!causeSourceDrawerInfo.other_contact_info.mobile.trim()) return this.$message.warning('请输入联系人电话')

      console.log(causeSourceDrawerInfo)
      this.causeSourceDrawerInfo.isShowCauseSourceDrawer = false

      const param = {
        demand_type_id: causeSourceDrawerInfo.demand_type_info.demand_type_id, // 需求类型 id
        demand_tags_id: causeSourceDrawerInfo.demand_tags_info.demand_tags_id, // 需求标签 id
        category_id: causeSourceDrawerInfo.category_info.category_id, // 涉及分类 id
        category: causeSourceDrawerInfo.category_info.category, // 涉及分类
        lawyer_province_id: causeSourceDrawerInfo.lawyer_region_info.lawyer_province_id, // 律师省份 id
        lawyer_city_id: causeSourceDrawerInfo.lawyer_region_info.lawyer_city_id, // 律师城市 id
        user_id: causeSourceDrawerInfo.user_info.user_id, // 用户 id
        content: causeSourceDrawerInfo.content.trim(), // 案件描述
        related_images: JSON.stringify(causeSourceDrawerInfo.related_images), // 图片数组
        related_cloud_file_ids: JSON.stringify(causeSourceDrawerInfo.related_cloud_file_ids), // 用户文件
        other_contact: JSON.stringify({
          name: causeSourceDrawerInfo.other_contact_info.name.trim(),
          mobile: causeSourceDrawerInfo.other_contact_info.mobile.trim()
        }), // 用户文件
        imprisoned_address: causeSourceDrawerInfo.imprisoned_address.trim(), // 关押地点
        detention_slip_image: causeSourceDrawerInfo.detention_slip_image, // 拘留单图片
        case_money: causeSourceDrawerInfo.case_money, // 标的额
        is_talk_detail: 1, // 是否详谈
      }

      console.log(param)

      try {
        const { data: causeSourceData } = await causeSourceApi.postCauseSourceApi(param)
        // 重置案源 drawer
        // this.causeSourceDrawerInfo = Object.assign({}, CAUSESOURCE_INFO)
        this.causeSourceDrawerInfo = JSON.parse(JSON.stringify(CAUSESOURCE_INFO))
        this.searchUser = { userMobile: '', userList: [], }
        this.$notification.success({ message: '发布成功', duration: 3 })

        // 发布成功以后重新展示数据
        this._getCauseSourceList(this.pagination.current)
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
    align-items: center;
    justify-content: space-between;
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

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
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
        min-width: 94px;
        .info-title {
          font-size: 14px;
          font-weight: 500;
        }
      }
      .causeSource-info-middle {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
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
        .user-wrap {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .user-input-wrap {
            position: relative;
            .user-search-list {
              position: absolute;
              top: 100%;
              left: 0;
              width: 200%;
              padding: 10px;
              background: #fff;
              box-shadow: 1px 2px 20px #bdbdbd;
              z-index: 10;
              .user-search-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 10px;
                cursor: pointer;
                &:last-child {
                  margin-bottom: 0;
                }
                .user-type {
                  color: #1790ff;
                  margin-right: 10px;
                }
              }
            }
          }
          .user-info-wrap {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-left: 6px;
            .user-type {
              color: #1790ff;
              margin-right: 6px;
            }
            .user-nickname {
              flex: 1;
            }
            .icon-close {
              padding-left: 6px;
              cursor: pointer;
            }
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

.file-modal {
  height: 306px;
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
.againBtn {
  background-color: #27b148;
  color: #fff;
}
</style>
