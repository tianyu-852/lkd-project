
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">异常订单总数：{{ pagination.total }}</span>

      <!-- 时间筛选 -->
      <!-- <a-range-picker
        @change="onRangePickerChange"
        @ok="getSearchData"
        style="width: 340px; margin-left: 30px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      /> -->
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getExceptionOrderList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.order_no)"
        bordered
      >

        <!-- 律师 -->
        <a-table-column dataIndex="lawyer.nickname" title="律师" align="center" />

        <!-- 用户 -->
        <a-table-column dataIndex="user.nickname" title="用户" align="center" />

        <!-- 用户手机 -->
        <a-table-column dataIndex="user.mobile" title="用户手机" align="center" />

        <!-- 订单时间 -->
        <a-table-column dataIndex="created_at" title="订单时间" align="center" />

        <!-- 录音 -->
        <a-table-column align="center" title="录音" width="170px">
          <template slot-scope="record">
            <a-select style="width: 100px;" v-model="tableDataList[record.index].activeRecord">
              <a-select-option v-for="sItem in record.calls" :value="sItem.record_path" :key="sItem.record_path">
                {{ sItem.duration }}秒
              </a-select-option>
            </a-select>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" :loading="record.voiceTranslateLoading" style="padding: 0; margin-right: 5px;" @click="translateVoice(record)">翻译</a-button>
            <a-button type="link" style="padding: 0; margin-right: 5px;" @click="playVoice(record)">播放</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 语音翻译 modal -->
    <voice-translate-modal ref="voiceTranslateModalRef" />
    <!-- audio hidden -->
    <audio ref="audioRef" controls="controls" src="" id="audio" hidden />
  </a-layout>
</template>

<script>
import * as orderApi from '@/api/order'
import { mapState } from 'vuex'
import moment from 'moment'
import voiceTranslateModal from '@/components/voice-translate-modal/voice-translate-modal'

export default {
  name: 'OrderException',
  components: { voiceTranslateModal },
  data() {
    return {
      audioSrc: 'https://lvkuaidacallrecord.oss-cn-hangzhou.aliyuncs.com/2022-10-09/2020221009073669094/13521349094_18915731165_1665273601.mp3',

      tableDataList: [], // table 列表
      tableDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getExceptionOrderList(page)
          this.pagination.current = page
        },
      },

      searchEnterpriseName: '', // 搜索企业名称
      lawServeVipId: '', // 法律套餐类型 id
      lawServeVipSelectList: [], // 套餐类型 select 列表
      
      // 过滤条件
      filterInfo: {
        startDate: '', // 开始时间
        endDate: '', // 结束时间
      },
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getExceptionOrderList()
  },
  methods: {
    moment,
    
    /**
     * 获取企业套餐列表
     */
     async _getExceptionOrderList(page = 1) {
       const param = { page }
       this.tableDataLoading = true

       try {
         const { data: exceptionOrderData } = await orderApi.getExceptionOrderApi(param)
         const exceptionOrderItems = exceptionOrderData.data.map((item, index) => {
          item.index = index
          item.activeRecord = ''
          item.voiceTranslateLoading = false
          return item
         })
         this.tableDataList = exceptionOrderItems
         this.pagination.total = exceptionOrderData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * RangePicker 发生变化的回调
     */
    // onRangePickerChange(date, dateStrAry) {
    //   this.filterInfo.startDate = dateStrAry[0]
    //   this.filterInfo.endDate = dateStrAry[1]
    //   // 清空日期选择重新请求一次
    //   if (!dateStrAry[0] || !dateStrAry[1]) this._getExceptionOrderList()
    // },

    /**
     * 翻译语音
     */
    async translateVoice(record) {
      const voiceUrl = record.activeRecord
      if (!voiceUrl) return this.$message.warning('请先选择录音文件')
      this.tableDataList[record.index].voiceTranslateLoading = true
      await this.$refs.voiceTranslateModalRef.translateVoiceFile(voiceUrl)
      this.tableDataList[record.index].voiceTranslateLoading = false
    },

    /**
     * 播放语音
     */
    playVoice(record) {
      const voiceUrl = record.activeRecord
      if (!voiceUrl) return this.$message.warning('请先选择录音文件')

      this.$refs.audioRef.src = voiceUrl
      this.$refs.audioRef.load()
      this.$refs.audioRef.play()
    }
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

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
}
</style>
