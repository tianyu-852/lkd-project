
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span>优选律师权益设置记录：{{ pagination.total }}</span>
      </div>

      <a-button type="primary" style="margin-left: auto;" @click="setModal.isShowSetModal = true">新增时间段</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getLawyerBestRightsSetList(pagination.current)">刷新</a-button>
      </div>
      
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.lawyer_equity_set_id)"
        bordered
      >
        <!-- 时间段 -->
        <a-table-column title="时间段" align="center">
          <template slot-scope="record">
            <div class="column-menuTime-wrap" :style="{ color: '#666' }">
              <div>{{ record.start_time }}</div>
              <div>至</div>
              <div>{{ record.end_time }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 状态 -->
        <a-table-column title="状态" align="center">
          <template slot-scope="record">
            <div>
              <span v-if="record.type === 1" style="color: #41b583;">进行中</span>
              <span v-else-if="record.type === 2" style="color: #666;">未开始</span>
              <span v-else-if="record.type === 3" style="color: #f56c6c;">已结束</span>
            </div>
          </template>
        </a-table-column>

        <!-- 开启状态 -->
        <a-table-column title="开启状态" align="center">
          <template slot-scope="record">
            <a-button v-if="record.status === 1" type="link" style="color: #41b583;">开启中</a-button>
            <a-button v-else type="link" style="color: #f56c6c;">已关闭</a-button>
          </template>
        </a-table-column>

        <!-- 来源 -->
        <a-table-column title="来源" align="center">
          <template slot-scope="record">
            <div>
              <div>后台-{{ record.admin.nickname }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
          <template slot-scope="record">
            <a-popconfirm v-if="record.status === 2" title="是否开启广告?" @confirm="switchAdvertStatus(record, 1)">
              <a-button type="link" style="color: #409eff;">开启</a-button>
            </a-popconfirm>
            <a-popconfirm v-else title="是否关闭该广告?" @confirm="switchAdvertStatus(record, 2)">
              <a-button type="link" style="color: #409eff;">关闭</a-button>
            </a-popconfirm>

            <a-popconfirm title="请确认是否删除?" ok-text="删除" cancel-text="取消" @confirm="switchAdvertStatus(record, 3)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 支付确认 modal -->
    <a-modal
      v-model="setModal.isShowSetModal"
      :width="500"
      destroyOnClose
      title="新增时间段"
      @ok="onSetModalOkEvt"
    >
      <div class="infoConfirm-modal-box">
        <!-- 投放地区 -->
        <div class="infoConfirm-item">
          <div class="infoConfirm-left">时间段：</div>
          <div class="infoConfirm-right">
            <a-range-picker
              @change="onRangePickerChange"
              style="width: 340px;"
              format="YYYY-MM-DD HH:mm:ss"
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }"
            />
          </div>
        </div>
        <div class="infoConfirm-item">
          <div class="infoConfirm-left">是否开启：</div>
          <div class="infoConfirm-right">
            <a-switch v-model="setModal.status" />
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import * as lawyerApi from '@/api/lawyer'

// 设置时间段 modal
const SET_MODAL = {
  isShowSetModal: false,
  startDate: '',
  endDate: '',
  status: true
}

export default {
  name: 'LawyerBestRightsSetPage',
  data() {
    return {
      tabelDataLoading: true, // 数据是否加载中
      tabelDataList: [],
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerBestRightsSetList(page)
          this.pagination.current = page
        },
      },

      setModal: { ...SET_MODAL }, // 设置时间段 modal
    }
  },
  computed: {
    ...mapState(['openVipRoleList']),

    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getLawyerBestRightsSetList()
  },
  methods: {
    moment,

    /**
     * 获取优选权限时间段设置列表
     */
     async _getLawyerBestRightsSetList(page = 1) {
       this.tabelDataLoading = true
       const param = { page, size: this.pagination.pageSize, }

       try {
         const { data: labelListData } = await lawyerApi.getLawyerBestRightsSetListApi(param)
         this.tabelDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.setModal.startDate = dateStrAry[0]
      this.setModal.endDate = dateStrAry[1]
    },

    /**
     * 监听set modal ok事件
     */
    async onSetModalOkEvt() {
      const { setModal } = this
      const param = { start_time: setModal.startDate, end_time: setModal.endDate, status: setModal.status ? 1 : 2 }
      this.setModal.isShowSetModal = false

      try {
        await lawyerApi.postLawyerBestRightsSetApi(param)
        this._getLawyerBestRightsSetList()
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        this.tabelDataLoading = false
        console.log(error)
      }
    },

    /**
     * 开启/关闭广告
     */
    async switchAdvertStatus(record, status) {
      const { lawyer_equity_set_id } = record
      if (!lawyer_equity_set_id) return
      const param = { lawyer_equity_set_id: lawyer_equity_set_id, type: status }

      try {
        await lawyerApi.updateLawyerBestRightsSetApi(param)
        this._getLawyerBestRightsSetList(this.pagination.current)
        this.$notification.success({ message: '切换成功', duration: 3 })
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
    justify-content: flex-start;
    height: 90px;
    font-size: 16px;
    font-weight: 600;
    .back {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
      .icon-back {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
  }
  .column-order {
    cursor: pointer;
  }
}

.infoConfirm-modal-box {
  .infoConfirm-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .infoConfirm-left {
      font-size: 14px;
      font-weight: bold;
      min-width: 80px;
    }
    .infoConfirm-right {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
