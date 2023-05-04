<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="icon-back" style="cursor: pointer; padding-right: 10px;" @click="$router.back(-1)">←</span>
      <span class="focus-text">体验卡({{ pagination.total }})</span>

      <a-button type="primary" style="margin-left: auto;" @click="openAddExpModal">新增体验卡</a-button>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getCaseSourceNativeGetSetList(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.local_num_package_id)"
        bordered
      >
        <!-- 律师群体 -->
        <a-table-column title="律师群体" align="center">
          <template slot-scope="record">
            <div>{{ '全部律师' }}</div>
          </template>
        </a-table-column>
        
        <!-- 开始时间 -->
        <a-table-column title="开始/结束时间" align="center">
          <template slot-scope="record">
            <div class="column-menuTime-wrap" :style="{ color: '#666' }">
              <div>{{ record.open_time }} 至 {{ record.end_time }}</div>
              <!-- <div>至</div> -->
              <!-- <div>{{ record.end_time }}</div> -->
            </div>
          </template>
        </a-table-column>

        <!-- 领取天数 -->
        <a-table-column title="领取天数" align="center">
          <template slot-scope="record">
            <div>{{ record.day }}天</div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-popconfirm title="是否删除该项?" @confirm="delExpItem(record)">
              <a-button type="link" style="margin: 5px" size="small">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 新增体验卡 modal -->
    <a-modal
      v-model="editModalInfo.isShowEditModal"
      :width="360"
      title="新增体验卡"
      destroyOnClose
      @ok="onEditBestMenuOkEvt"
    >
      <div class="edit-modal">
        <div class="edit-body">
          <div class="input-item">
            <div class="input-title">开始时间：</div>
            <a-date-picker v-model="editModalInfo.start_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
          </div>
          <div class="input-item">
            <div class="input-title">领取天数：</div>
            <a-input class="input" style="width: 160px;" v-model="editModalInfo.day" placeholder="请输入天数" allowClear />
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'
import { mapState } from 'vuex'
import moment from 'moment'

const EDIT_MODAL_INFO = {
  isShowEditModal: false,
  start_time: '', // 开始时间
  day: '', // 领取天数
}

export default {
  name: 'CauseSourceNativeSetPage',
  components: { UserVipCell, UserMutedButton },
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
          this._getCaseSourceNativeGetSetList(page)
          this.pagination.current = page
        },
      },

      editModalInfo: Object.assign({}, EDIT_MODAL_INFO), // 编辑 modal 信息
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getCaseSourceNativeGetSetList()
  },
  methods: {
    moment,

    /**
     * 获取本地案源免费领取设置列表
     */
     async _getCaseSourceNativeGetSetList(page = 1) {
      this.tableDataLoading = true

       try {
         const { data: menuData } = await causeSourceApi.getCaseSourceNativeGetSetListApi()
         this.tableDataList = menuData.data
         this.pagination.total = menuData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
        this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 打开套餐弹框
     */
    openAddExpModal() {
      this.editModalInfo.isShowEditModal = true
    },
    
    /**
     * 获取优选律师备注
     */
    async onEditBestMenuOkEvt() {
      const { editModalInfo } = this
      const param = {
        start_time: moment(editModalInfo.start_time).format('YYYY-MM-DD HH:mm:ss'),
        day: editModalInfo.day,
      }
      this.editModalInfo.isShowEditModal = false

      try {
         await causeSourceApi.postCaseSourceNativeGetSetApi(param)
         this.$notification.success({ message: '更新成功', duration: 3 })
         this._getCaseSourceNativeGetSetList()
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 删除
     */
    async delExpItem(record) {
      const { local_num_package_id } = record
      if (!local_num_package_id) return

      try {
        await causeSourceApi.delCaseSourceNativeGetSetApi({ local_num_package_id })
        this.$notification.success({ message: '删除成功', duration: 3 })
        this._getCaseSourceNativeGetSetList()
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
  // 列 标签
  .column-label-wrap {
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
  // 销售记录
  .column-meal-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  margin-left: auto;
  cursor: pointer;
}

.edit-modal {
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
      width: 200px;
    }
    .checked-opt {
      cursor: pointer;
    }
  }
}

.label-modal {
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .modal-body {
    height: 200px;
    overflow-y: auto;
    .ant-checkbox-group {
      width: 100%;
      .ant-row {
        .ant-col {
          margin-bottom: 20px;
        }
      }
    }
  }
  .modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      width: 80px;
      height: 30px;
    }
  }
}
</style>
