<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">企业认证搜索埋点记录总数：{{ pagination.total }}</span>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getEnterpriseSearchLogList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.customer_label_id)"
        bordered
      >
        <!-- 用户id -->
        <a-table-column dataIndex="user.user_id" title="用户Id" align="center" />

        <!-- 用户昵称 -->
        <a-table-column dataIndex="user.nickname" title="用户昵称" align="center" />

        <!-- 用户手机 -->
        <a-table-column dataIndex="user.mobile" title="用户手机" align="center" />

        <!-- 操作 -->
        <!-- <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="primary" style="margin-right: 10px" @click="openPutLabelModal(record)">编辑</a-button>
          </template>
        </a-table-column> -->
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import * as userApi from '@/api/user'

export default {
  name: 'EnterpriseSearchLog',
  data() {
    return {
      tableDataList: [], // 标签列表
      tableDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getEnterpriseSearchLogList(page)
          this.pagination.current = page
        },
      },
    }
  },
  created() {
    this._getEnterpriseSearchLogList()
  },
  methods: {
    /**
     * 获取企业搜索埋点列表
     */
     async _getEnterpriseSearchLogList(page = 1) {
       const param = { page, size: this.pagination.pageSize }

       try {
         const { data: labelListData } = await userApi.getEnterpriseSearchLogApi(param)
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
</style>
