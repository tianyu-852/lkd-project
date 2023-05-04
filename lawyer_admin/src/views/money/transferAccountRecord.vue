<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">转账总数：{{ pagination.total }}</span>

      <!-- 搜索输入框 -->
      <div style="margin-right: 20px;">
        <a-input v-model="searchKey" placeholder="搜索姓名/手机号" @keyup.enter="_getTransferAccountRecordList()" allow-clear style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="_getTransferAccountRecordList()">搜索</a-button>
      </div>

      <span>转账状态：</span>
      <a-select v-model="statusFactor" style="width: 120px" allowClear @change="_getTransferAccountRecordList()" >
        <a-select-option v-for="(item, key) in statusSelectList" :key="key" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getTransferAccountRecordList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.customer_label_id)"
        bordered
      >

        <!-- 发起人 -->
        <a-table-column title="发起人" align="center">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.initiator.nickname"
              :avatar="record.initiator.avatar"
              :mobile="record.initiator.mobile"
              :user-id="String(record.initiator.user_id)"
            />
          </template>
        </a-table-column>

        <!-- 接收人 -->
        <a-table-column title="接收人" align="center">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.recipient.nickname"
              :avatar="record.recipient.avatar"
              :mobile="record.recipient.mobile"
              :user-id="String(record.recipient.user_id)"
            />
          </template>
        </a-table-column>

        <!-- 转账金额 -->
        <a-table-column dataIndex="money" title="转账金额" align="center" />

        <!-- 转账状态 -->
        <a-table-column dataIndex="status_text" title="转账状态" align="center" />

        <!-- 支付时间 -->
        <!-- <a-table-column dataIndex="paid_at" title="支付时间" align="center" /> -->

        <!-- 创建时间 -->
        <a-table-column dataIndex="created_at" title="创建时间" align="center" />

        <!-- 收款时间 -->
        <a-table-column title="收款时间" align="center">
          <template slot-scope="record">
            <span v-if="record.status === 1">{{ record.updated_at }}</span>
            <span v-else>无</span>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

  </a-layout>
</template>

<script>
import * as assetsApi from '@/api/assets'
import UserVipCell from '@/components/User/UserVipCell'

export default {
  name: 'TransferAccountRecordPage',
  components: { UserVipCell  },
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
          this._getTransferAccountRecordList(page)
          this.pagination.current = page
        },
      },

      searchKey: '',

      statusFactor: '',
      statusSelectList: [
        {label: '待收款', value: 0,},
        {label: '已收款', value: 1,},
        {label: '已退款', value: 2,},
      ]
    }
  },
  created() {
    this._getTransferAccountRecordList()
  },
  methods: {
    /**
     * 获取转账记录列表
     */
     async _getTransferAccountRecordList(page = 1) {
       const param = { page, size: this.pagination.pageSize }
       // 转账状态
       if (String(this.statusFactor)) param.status = String(this.statusFactor)
       // 搜索关键字
       if (this.searchKey.trim()) param.nickname_or_mobile = this.searchKey.trim()
       
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await assetsApi.getTransferAccountRecordList(param)
         this.tableDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
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
}

.label-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
