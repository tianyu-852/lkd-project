<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">官方广告位</span>

      <div style="margin-left: auto;">
        <a-button type="primary" style="background: #ffba02; border-color: #ffba02;" @click="$router.push({ name: 'AdvertOfficVisitListRoute' })">访问列表</a-button>
        <a-button type="primary" style="margin-left: 10px; background: #41b583; border-color: #41b583;" @click="$router.push({ name: 'AdvertOfficSignupListRoute' })">报名列表</a-button>
        <a-button type="primary" style="margin-left: 10px;" @click="indexDynFormModal.isShowOpenDynModal = true">新增首页列表广告</a-button>
        <a-button type="primary" style="margin-left: 10px;" @click="openScreenFormModal.isShowOpenScreenModal = true">新增开屏广告</a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="advertSeatNavCardTabKey" type="card" @change="onAdvertSeatNavCardChangeEvt">
        <a-tab-pane key="0" tab="首页列表" />
        <a-tab-pane key="1" tab="APP开屏页" />
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
            <!-- 活动名称 -->
            <a-table-column dataIndex="title" title="活动名称" :width="170" align="center" />

            <!-- 活动标签 -->
            <a-table-column v-if="advertSeatNavCardTabKey === '0'" dataIndex="remark" title="活动标签" :width="170" align="center" />

            <!-- 活动文案 -->
            <a-table-column v-if="advertSeatNavCardTabKey === '0'" dataIndex="describe" title="活动文案" :width="170" align="center" />

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

            <!-- 活动平台 -->
            <a-table-column dataIndex="lawyer_tag_cn" title="活动平台" :width="170" align="center" />

            <!-- 投放图片 -->
            <a-table-column title="投放图片" align="center">
              <template slot-scope="record">
                <div v-if="record.banner_url" class="qrcode-image" v-viewer>
                  <img class="qrcode-img" :src="record.banner_url">
                </div>
                <div v-else>无</div>
              </template>
            </a-table-column>

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
            <a-table-column key="action" title="操作" align="center" fixed="right" :width="100">
              <template slot-scope="record">
                <!-- <a-popconfirm v-if="record.status" title="是否开启广告?" @confirm="switchAdvertStatus(record, 0)">
                  <a-button type="link" style="color: #409eff;">开启</a-button>
                </a-popconfirm>
                <a-popconfirm v-else title="是否关闭该广告?" @confirm="switchAdvertStatus(record, 1)">
                  <a-button type="link" style="color: #409eff;">关闭</a-button>
                </a-popconfirm> -->
                <a-popconfirm title="是否删除该广告?" @confirm="delAdvert(record)">
                  <a-button type="link" style="color: #f56c6c;">删除</a-button>
                </a-popconfirm>
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
            <!-- 活动名称 -->
            <a-table-column dataIndex="title" title="活动名称" :width="170" align="center" />

            <!-- 活动标签 -->
            <a-table-column v-if="advertSeatNavCardTabKey === '0'" dataIndex="remark" title="活动标签" :width="170" align="center" />

            <!-- 活动文案 -->
            <a-table-column v-if="advertSeatNavCardTabKey === '0'" dataIndex="describe" title="活动文案" :width="170" align="center" />

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
            <a-table-column key="action" title="操作" align="center" fixed="right" :width="100">
              <template slot-scope="record">
                <!-- <a-popconfirm v-if="record.status" title="是否开启广告?" @confirm="switchAdvertStatus(record, 0)">
                  <a-button type="link" style="color: #409eff;">开启</a-button>
                </a-popconfirm>
                <a-popconfirm v-else title="是否关闭该广告?" @confirm="switchAdvertStatus(record, 1)">
                  <a-button type="link" style="color: #409eff;">关闭</a-button>
                </a-popconfirm> -->
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
            <a-table-column dataIndex="title" title="活动名称" :width="170" align="center" />

            <!-- 活动标签 -->
            <a-table-column v-if="advertSeatNavCardTabKey === '0'" dataIndex="remark" title="活动标签" :width="170" align="center" />

            <!-- 活动文案 -->
            <a-table-column v-if="advertSeatNavCardTabKey === '0'" dataIndex="describe" title="活动文案" :width="170" align="center" />

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
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 首页活动广告位 表单 modal -->
    <a-modal
      v-model="indexDynFormModal.isShowOpenDynModal"
      :width="480"
      title="首页活动"
      destroyOnClose
      @ok="onIndexDynModalOkEvt"
    >
      <div class="open-form-modal">
        <!-- 活动名称 -->
        <div class="open-form-item">
          <span class="form-key">活动名称:</span>
          <a-input allow-clear placeholder="活动名称" v-model="indexDynFormModal.title" style="width: 192px" />
        </div>

        <!-- 活动标签 -->
        <div class="open-form-item">
          <span class="form-key">活动标签:</span>
          <a-input allow-clear placeholder="活动标签" v-model="indexDynFormModal.remark" style="width: 192px" />
        </div>

        <!-- 活动描述 -->
        <div class="open-form-item">
          <span class="form-key">活动描述:</span>
          <a-textarea style="width: 192px;" :auto-size="{ minRows: 3 }" v-model="indexDynFormModal.describe" placeholder="活动描述" />
        </div>
        
        <!-- 开始时间 -->
        <div class="open-form-item">
          <span class="form-key">开始时间:</span>
          <a-date-picker v-model="indexDynFormModal.start_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>
        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">结束时间:</span>
          <a-date-picker v-model="indexDynFormModal.end_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>

        <!-- 图片 -->
        <div class="open-form-item">
          <span class="form-key">投放图片:</span>
          <div class="image-wrap">
            <div v-if="indexDynFormModal.image" class="image-item" v-viewer>
              <img class="image" :src="indexDynFormModal.image" />
              <a-icon class="icon-close" type="close-circle" @click.stop="indexDynFormModal.image = ''" />
            </div>

            <div v-else class="image-upload" @click="chooseAdvertImage">
              <a-icon type="plus" style="fontSize: 26px" />
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 开屏广告位 表单 modal -->
    <a-modal
      v-model="openScreenFormModal.isShowOpenScreenModal"
      :width="480"
      title="开屏活动"
      destroyOnClose
      @ok="onOpenScreenModalOkEvt"
    >
      <div class="open-form-modal">
        <!-- 活动名称 -->
        <div class="open-form-item">
          <span class="form-key">活动名称:</span>
          <a-input allow-clear placeholder="活动名称" v-model="openScreenFormModal.title" style="width: 192px" />
        </div>
        
        <!-- 开始时间 -->
        <div class="open-form-item">
          <span class="form-key">开始时间:</span>
          <a-date-picker v-model="openScreenFormModal.start_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>

        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">结束时间:</span>
          <a-date-picker v-model="openScreenFormModal.end_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>

        <!-- 投放平台 -->
        <div class="open-form-item">
          <span class="form-key">投放平台:</span>
          <a-select style="width: 140px; margin-top: 5px;" v-model="openScreenFormModal.source_type" allowClear>
            <a-select-option v-for="sItem in platformSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 图片 -->
        <div class="open-form-item">
          <span class="form-key">投放图片:</span>
          <div class="image-wrap">
            <div v-if="openScreenFormModal.image" class="image-item" v-viewer>
              <img class="image" :src="openScreenFormModal.image" />
              <a-icon class="icon-close" type="close-circle" @click.stop="openScreenFormModal.image = ''" />
            </div>

            <div v-else class="image-upload" @click="chooseAdvertImage">
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
import moment from 'moment'
import fileUtil from '@/utils/fileUtil'
import UserVipCell from '@/components/User/UserVipCell'
import * as advertApi from '@/api/advertApi'
const JSONbig = require('json-bigint')

// 开屏页 表单 modal
const OPEN_SCREEN_MODAL = {
  isShowOpenScreenModal: false,

  start_time: '', // 开始时间
  end_time: '', // 结束时间
  image: '', // 投放图片
  title: '', // 名称
  source_type: '', // 投放平台
}

// 首页动态广告 表单 modal
const INDEX_DYN_MODAL = {
  isShowOpenDynModal: false,

  start_time: '', // 开始时间
  end_time: '', // 结束时间
  image: '', // 投放图片
  title: '', // 活动名称 
  remark: '', // 活动标签
  describe: '', // 活动描述
  source_type: '', // 投放平台
}

const indexDynSeatId = '504239200519700480' // 首页帖子位置 id
const openScreenSeatId = '503864872896659457' // 开屏页位置 id
const officAdvertURL = process.env.NODE_ENV === 'production' ? 'https://h5.lawkd.com/cause-source-union' : 'https://devh5.lawkd.com/cause-source-union'

export default {
  name: 'AdvertOfficSeatPage',
  components: { UserVipCell },
  data() {
    return {
      advertSeatNavCardTabKey: '0', // 当前激活card tab 面板的 key
      advertSeatActiveTabKey: '1', // 当前激活数据 tab 面板的 key
      isShowAdvertImageFileInput: true, // 是否显示上传案源图片 input

      advertSeatNavCardList: [
        { seatName: '首页列表', seatId: '504239200519700480' },
        { seatName: 'APP开屏页', seatId: '503864872896659457' },
      ],

      platformSelectList: [{ label: '百姓律师', value: 0 }, { label: '律师端', value: 3 }, { label: '全部平台', value: -1 }], // 投放平台 select 列表

      regionFactorInfo: { province_id: 0, city_id: 0 }, // 地区条件
      regionCascaderList: [], // 地区 cascader 列表
      advertPositionSelectList: [], // 广告位位置 select
      causeSourceCategorySelectList: [], // 案源分类 option 列表
      advertDateSelectList: [], // 广告投放可选时间段
      advertDateDisabledList: [], // 广告投禁选时间段

      openScreenFormModal: { ...OPEN_SCREEN_MODAL }, // 开屏广告 modal
      indexDynFormModal: { ...INDEX_DYN_MODAL }, // 首页帖子广告 modal

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
  created() {
    this._getLawyerAdvertValidList()
    this._getLawyerAdvertUnStartList()
    this._getLawyerAdvertExpireList()
  },
  methods: {
    moment,

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
        const fileUrl = await fileUtil.uploadFile(file)
        this.indexDynFormModal.image = fileUrl
        this.openScreenFormModal.image = fileUrl
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听开屏页 modal ok 事件
     */
    async onOpenScreenModalOkEvt() {
      const { openScreenFormModal } = this
      if (!openScreenFormModal.title.trim()) return this.$message.warning('请输入活动名称')
      if (!openScreenFormModal.start_time) return this.$message.warning('请选择开始时间')
      if (!openScreenFormModal.end_time) return this.$message.warning('请选择开始时间')
      if (!openScreenFormModal.image) return this.$message.warning('请上传投放图片')

      const param = {
        title: openScreenFormModal.title.trim(),
        advertisement_position_id: openScreenSeatId,
        banner: openScreenFormModal.image,
        jump_id: `${ officAdvertURL }`,
        start_time: moment(openScreenFormModal.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(openScreenFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
      }

       try {
         await advertApi.postAddOfficAdvertApi(param)
         this.openScreenFormModal = Object.assign({}, OPEN_SCREEN_MODAL) // 重置
         this.indexDynFormModal = Object.assign({}, INDEX_DYN_MODAL) // 重置
         this.refreshTableData()
         this.$notification.success({ message: '开通成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听首页帖子 modal ok 事件
     */
    async onIndexDynModalOkEvt() {
      const { indexDynFormModal } = this
      if (!indexDynFormModal.title.trim()) return this.$message.warning('请输入活动名称')
      if (!indexDynFormModal.start_time) return this.$message.warning('请选择开始时间')
      if (!indexDynFormModal.end_time) return this.$message.warning('请选择开始时间')
      if (!indexDynFormModal.image) return this.$message.warning('请上传投放图片')

      const param = {
        title: indexDynFormModal.title.trim(),
        remark: indexDynFormModal.remark.trim(),
        describe: indexDynFormModal.describe.trim(),
        advertisement_position_id: indexDynSeatId,
        banner: indexDynFormModal.image,
        jump_id: `${ officAdvertURL }`,
        start_time: moment(indexDynFormModal.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(indexDynFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
      }

       try {
         await advertApi.postAddOfficAdvertApi(param)
         this.openScreenFormModal = Object.assign({}, OPEN_SCREEN_MODAL) // 重置
         this.indexDynFormModal = Object.assign({}, INDEX_DYN_MODAL) // 重置
         this.refreshTableData()
         this.$notification.success({ message: '开通成功', duration: 3 })
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
      width: 40%;
      .image-item {
        position: relative;
        cursor: pointer;
        height: 200px;
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
        height: 200px;
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
