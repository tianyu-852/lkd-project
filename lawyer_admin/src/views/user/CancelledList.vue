<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="top-prefix">
        <span class="focus-text">已注销账号：{{ pagination.total }}</span>
        <div>
          <span>用户类型：</span>
          <a-select :default-value="0" class="top-select" v-model="delType">
            <a-select-option v-for="type in types" :value="type.value" :key="type.label">
              {{ type.label }}
            </a-select-option>
          </a-select>
        </div>
        <a-input
          allow-clear
          placeholder="搜索手机号/用户名"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="margin: 0 10px; width: 180px"
        />
        <a-button type="primary" @click="getSearchPage" style="margin: 0 10px"> 搜索</a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="getUserPage(pagination.current, delType, search)">刷新</a-button>
      </div>

      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => record.user_id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <a-table-column key="mobile" data-index="mobile" title="手机号" align="center" />
        <a-table-column key="nickname" data-index="nickname" title="用户昵称" align="center" />
        <a-table-column key="vip_type" data-index="vip_type" title="会员类型" align="center" />
        <a-table-column key="register_at" title="注册时间" align="center">
          <template slot-scope="record">
            <div style="text-align: center">{{ record.register_at }} {{ record.register_address }}</div>
          </template>
        </a-table-column>

        <a-table-column key="active_at" title="最后活跃时间|地点" align="center">
          <template slot-scope="record">
            <div>{{ record.active_at }} {{ record.location_address }}</div>
          </template>
        </a-table-column>

        <a-table-column key="status" title="状态" align="center">
          <template slot-scope="record">
            <a-popconfirm placement="top" ok-text="是的" cancel-text="不是" @confirm="setUserStatus(record)">
              <template slot="title">
                <p>是否要{{ userStatusTextReverse(record.status) }}该用户</p>
              </template>
              <div class="user-status clickable" :class="userStatusClass(record.status)" v-show="!record.isLoading">
                <div class="user-status-icon" :class="userIconClass(record.status)"></div>
                <span>{{ userStatusText(record.status) }}</span>
              </div>
            </a-popconfirm>

            <div class="user-status text-primary" v-show="record.isLoading">
              <q-spinner-facebook />
            </div>
          </template>
        </a-table-column>

        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; width: auto; ">
              <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record.user_id)">详情</a-button>
              <a-button
                type="primary"
                style="margin: 5px; background-color: #2cbf78; border-color: #2cbf78; color: #ffffff"
                size="small"
                @click="openModal(record.user_id)"
              >
                恢复
              </a-button>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <a-modal
      v-model="state.confirmModal"
      title="请确认是否恢复该账号"
      @ok="getUserWithdrawDelete"
      ok-text="恢复"
      cancel-text="取消"
    >
      <span>确认后，该账号将会被恢复</span>
    </a-modal>
  </a-layout>
</template>
<script>
import { setUserStatus, getUserWithdrawDelete, getUserPage } from '@/api/user'
import UserMutedButton from '@/components/User/UserMutedButton'
import { Empty } from 'ant-design-vue'
export default {
  name: 'UserList',
  components: { UserMutedButton, Empty },
  data() {
    return {
      types: [
        { label: '全部类型', value: 0, },
        { label: '已开通', value: 1, },
        { label: '未开通', value: 2, },
        { label: '已过期', value: 3, },
      ],
      remakeText: '',
      delType: 0,
      userDeleteAuthId: 0,
      confirmModalType: 0,
      selectedRowKeys: [],
      HistoryData: [],
      data: [],
      search: '',
      bannedTime: '',
      bannedDescription: '',
      state: {
        loading: false,
        historyLoading: false,
        confirmModal: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: (page) => {
          this.getUserPage(page, this.delType, this.search)
          this.pagination.current = page
        },
      },
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['delType'] = this.delType
      condition['search'] = this.search
      condition['fromType'] = 'CancelledList'
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('cancelledCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.delType = condition.delType
      this.search = condition.search
      this.pagination.current = condition.current
      window.sessionStorage.removeItem('cancelledCondition')
      this.getUserPage(condition.current, this.delType, condition.search)
    } else if (this.$route.params.mobile) {
      this.search = this.$route.params.mobile
      this.getUserPage(1, this.delType, this.$route.params.mobile)
    } else {
      this.getUserPage(1, this.delType, '')
    }
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('cancelledCondition', JSON.stringify(this.conditionData))
    },
    redirectDetail(userId) {
      sessionStorage.setItem('cancelledCondition', JSON.stringify(this.conditionData))
      this.$router.push({ name: 'UserDetail', params: { userId } })
    },
    getSearchPage() {
      this.pagination.current = 1

      this.getUserPage(1, this.delType, this.search)
    },
    getUserPage(page, vipType, search) {
      const param = {
        page,
        vip_type: vipType,
        search,
        is_view_deleted: 1,
      }

      this.state.loading = true
      getUserPage(param)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          data.data.map((item) => {
            item.isLoading = false
          })
          for (let i = 0; i < data.data.length; i++) {
            data.data[i]['visible'] = false
            data.data[i]['iconLoading'] = false
          }
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    userStatusTextReverse(status) {
      return this.userStatusText(status === 1 ? 0 : 1)
    },
    /**
     * 用户账号状态
     */
    userStatusText(status) {
      switch (status) {
        case 0:
          return '启用'
        case 1:
          return '禁用'
        case 2:
          return '已注销'
      }
    },
    userStatusClass(status) {
      return {
        'user-status-blue': status === 0,
        'user-status-yellow': status === 1,
        'user-status-red': status === 2,
      }
    },
    userIconClass(status) {
      return {
        'user-status-blue-background': status === 0,
        'user-status-yellow-background': status === 1,
        'user-status-red-background': status === 2,
      }
    },
    setUserStatus(record) {
      const status = record.status === 1 ? 0 : 1
      const text = `${this.userStatusText(status)}成功`
      record.isLoading = true
      setUserStatus(record.user_id, status)
        .then(() => {
          this.$message.success(text)
          record.status = status
        })
        .finally(() => {
          record.isLoading = false
        })
    },
    onSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    getUserWithdrawDelete() {
      getUserWithdrawDelete(this.chooseUserId)
        .then(() => {
          this.getUserPage(1, this.delType, this.search)
        })
        .finally(() => {
          this.state.confirmModal = false
        })
    },
    openModal(id) {
      console.log(id)
      this.chooseUserId = id
      this.state.confirmModal = true
    },
  },
}
</script>
<style lang="less" scoped>
.main {
  .top {
    display: flex;
    height: 90px;
    align-items: center;
    justify-content: space-between;
    &-prefix {
      display: flex;
      align-items: center;
    }
    &-select {
      margin-right: 20px;
      width: 100px;
    }
    &-date {
      width: 220px;
      margin-right: 16px;
    }
    input {
      width: 170px;
      margin-right: 20px;
    }
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}
.user-status {
  display: flex;
  align-items: center;
  justify-content: center;
  &-icon {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3980ea;
    margin-right: 8px;
  }
  &-blue-background {
    background: #3980ea;
  }
  &-yellow-background {
    background: #ff9700;
  }
  &-red-background {
    background: #ff524c;
  }
  &-blue {
    color: #3980ea;
  }
  &-yellow {
    color: #ff9700;
  }
  &-red {
    color: #ff524c;
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
