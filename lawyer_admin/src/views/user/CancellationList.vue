<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="top-prefix">
        <span class="focus-text">待审核数量:{{ pagination.total }}</span>
        <div>
          <span>账号类型:</span>
          <a-select style="width: 120px; margin: 0 10px" v-model="delType" @change="delTypeChange">
            <a-select-option value="全部">全部</a-select-option>
            <a-select-option value="用户">用户</a-select-option>
            <a-select-option value="律师">律师</a-select-option>
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
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="getUserDeletePage(pagination.current, delType, search)">刷新</a-button>
      </div>

      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => `${ record.user_id }`"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <!-- 手机号 -->
        <a-table-column data-index="mobile" title="手机号" align="center" />
        <!-- 用户昵称 -->
        <a-table-column data-index="nickname" title="用户昵称" align="center" />
        <!-- 会员类型 -->
        <a-table-column data-index="vip_type" title="会员类型" align="center" />
        <!-- 注册时间 -->
        <a-table-column title="注册时间" align="center">
          <template slot-scope="record">
            <div style="text-align: center">{{ record.register_at }} {{ record.register_address }}</div>
          </template>
        </a-table-column>
        <!-- 最后活跃时间 -->
        <a-table-column title="最后活跃时间|地点" align="center">
          <template slot-scope="record">
            <div>{{ record.active_at }} {{ record.location_address }}</div>
          </template>
        </a-table-column>

        <!-- 未完成订单 -->
        <a-table-column title="未完成订单" align="center">
          <template slot-scope="record">
            <div v-if="record.have_order" style="color: #f56c6c; cursor: pointer;" @click="openUserUndoneOrderModal(record)">详情</div>
            <div v-else>无</div>
          </template>
        </a-table-column>

        <!-- 备注 -->
        <a-table-column title="备注" align="center">
          <template slot-scope="record">
            <div>{{ record.remark }}</div>
          </template>
        </a-table-column>
        <!-- 状态 -->
        <a-table-column title="状态" align="center">
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

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; width: auto;">
              <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record.user_id)">详情</a-button>
              <a-button style="margin: 5px" @click="openRemarkModal(record)" size="small">备注</a-button>
              <a-button type="primary" style="margin: 5px; background-color: #2cbf78; border-color: #2cbf78; color: #ffffff" size="small" @click="openModal(0, record)">通过</a-button>
              <a-button type="primary" style="margin: 5px; background-color: #ff9700; border-color: #ff9700; color: #ffffff" size="small" @click="openModal(1, record)">驳回</a-button>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <a-modal
      v-model="state.confirmModal"
      :title="confirmModalType === 0 ? '请确认是否通过审核' : '请输入驳回理由'"
      @ok="submitData"
      :ok-text="confirmModalType === 0 ? '通过' : '驳回'"
      cancel-text="取消"
    >
      <span v-if="confirmModalType === 0">通过审核后将会注销该用户</span>
      <div v-else>
        <a @click="state.historyLoading = true" style="margin: 10px">查看历史审核记录</a>
        <a-input v-model="contentCheck" style="margin: 10px" placeholder="请输入驳回理由"></a-input>
      </div>
    </a-modal>
    <a-modal v-model="state.historyLoading" title="历史审核记录" @ok="state.historyLoading = false">
      <div style="height: 500px; overflow: auto">
        <div v-if="HistoryData.length === 0">
          <Empty />
        </div>
        <div v-for="(i, key) in HistoryData" :key="key" class="historyArea">
          <span v-show="i.check_status === 2" style="color: #ff524c">
            {{ i.text }}
          </span>
          <span v-show="i.check_status === 1" style="color: #2cbf78">
            {{ i.text }}
          </span>
          <label>{{ i.created_at }}</label>
          <div class="historyArea-text">
            <p>
              {{ i.refuse_reason }}
            </p>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal v-model="state.RemarkModal" title="备注" @ok="getRemark" ok-text="备注" cancel-text="取消">
      <a-input v-model="RemarkText"> </a-input>
    </a-modal>

    <!-- 用户未完成订单 modal -->
    <a-modal
      v-model="userOrderModal.isShowUserOrderModal"
      title="用户未结束订单"
      :width="600"
      :afterClose="() => { userOrderActiveTabKey = '1' }"
      destroyOnClose
    >
      <div class="userOrder-modal-box">
        <div style="color: #409eff;">总共存在：{{ userOrderModal.userOrderList.length }}个未结束订单。</div>
        <template v-if="userOrderModal.userOrderList.length">
          <a-tabs v-model="userOrderActiveTabKey">
            <template v-for="(oItem, oIndex) in userOrderModal.userOrderList">
              <a-tab-pane :key="(oIndex + 1) + ''" :tab="oItem.order_title">
                <div class="userOrder-item">
                  <div class="userOrder-item-left">预计结束时间：</div>
                  <div class="userOrder-item-right">{{ oItem.due_at }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">服务结束时间：</div>
                  <div class="userOrder-item-right">{{ oItem.service_end_at }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">接单律师：</div>
                  <div class="userOrder-item-right">{{ oItem.lawyer }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">涉及分类：</div>
                  <div class="userOrder-item-right">{{ oItem.category }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">律师地域：</div>
                  <div class="userOrder-item-right">{{ oItem.lawyer_province }}-{{ oItem.lawyer_city }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">发布时间：</div>
                  <div class="userOrder-item-right">{{ oItem.created_at }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">案件详情：</div>
                  <div class="userOrder-item-right">{{ oItem.content }}</div>
                </div>
              </a-tab-pane>
            </template>

            <!-- 第一单 -->
            <!-- <template v-if="userOrderModal.userOrderList[0]">
              <a-tab-pane key="1" :tab="userOrderModal.userOrderList[0].category">
                <div class="userOrder-item">
                  <div class="userOrder-item-left">预计结束时间：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[0].estimate_time }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">接单律师：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[0].lawyer }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">涉及分类：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[0].category }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">律师地域：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[0].lawyer_province }}-{{ userOrderModal.userOrderList[0].lawyer_city }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">发布时间：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[0].created_at }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">案件详情：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[0].content }}</div>
                </div>
              </a-tab-pane>
            </template> -->
            <!-- 第二单 -->
            <!-- <template v-if="userOrderModal.userOrderList[1]">
              <a-tab-pane key="2" :tab="userOrderModal.userOrderList[1].category">
                <div class="userOrder-item">
                  <div class="userOrder-item-left">预计结束时间：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[1].estimate_time }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">接单律师：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[1].lawyer }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">涉及分类：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[1].category }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">律师地域：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[1].lawyer_province }}-{{ userOrderModal.userOrderList[1].lawyer_city }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">发布时间：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[1].created_at }}</div>
                </div>
                <div class="userOrder-item">
                  <div class="userOrder-item-left">案件详情：</div>
                  <div class="userOrder-item-right">{{ userOrderModal.userOrderList[1].content }}</div>
                </div>
              </a-tab-pane>
            </template> -->
          </a-tabs>
        </template>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import { setUserStatus, getUserDeleteCheck, getUserDeletePage, getUserDeleteHistory, putUserDeleteRemark, } from '@/api/user'
import * as userApi from '@/api/user'
import UserMutedButton from '@/components/User/UserMutedButton'
import { Empty } from 'ant-design-vue'
import JSONbig from 'json-bigint'

// 用户未完成订单 modal
const USER_ORDER_MODAL = {
  isShowUserOrderModal: false,
  userOrderList: [],
}

export default {
  name: 'UserlogoutPage',
  components: { UserMutedButton, Empty },
  data() {
    return {
      delType: '全部',
      userDeleteAuthId: 0,
      confirmModalType: 0,
      contentCheck: '',
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
        RemarkModal: false,
      },
      RemarkText: '',
      chooseUserId: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getUserDeletePage(page, this.delType, this.search)
          this.pagination.current = page
        },
      },

      userOrderModal: { ...USER_ORDER_MODAL }, // 用户订单 modal
      userOrderActiveTabKey: '1', // 激活的 tab
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['delType'] = this.delType
      condition['search'] = this.search
      condition['fromType'] = 'CancellationList'
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('cancellationCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.delType = condition.delType
      this.search = condition.search
      this.pagination.current = condition.current
      window.sessionStorage.removeItem('cancellationCondition')
      this.getUserDeletePage(condition.current, this.delType, condition.search)
    } else if (this.$route.params.mobile) {
      this.search = this.$route.params.mobile
      this.getUserDeletePage(1, this.delType, this.$route.params.mobile)
    } else {
      this.getUserDeletePage(1, this.delType, '')
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
      sessionStorage.setItem('cancellationCondition', JSON.stringify(this.conditionData))
    },
    redirectDetail(userId) {
      sessionStorage.setItem('cancellationCondition', JSON.stringify(this.conditionData))
      this.$router.push({ name: 'UserDetail', params: { userId } })
    },
    getSearchPage() {
      this.pagination.current = 1
      this.getUserDeletePage(1, this.delType, this.search)
    },
    getUserDeletePage(page, delType, search) {
      this.state.loading = true
      let type = -1
      if (delType === '用户' || delType === 0) {
        type = 0
      } else if (delType === '律师' || delType === 1) {
        type = 1
      } else {
        type = -1
      }
      getUserDeletePage(page, type, search)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          const UserDeleteData = data.total
          // 保存数据到vuex 上面也是要读取vuex的数据来保证实时更新
          this.$store.commit('userLogoutUpload', { UserDeleteData })
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
    userStatusText(status) {
      switch (status) {
        case 0:
          return '启用'
        case 1:
          return '禁用'
      }
    },
    userStatusClass(status) {
      return {
        'user-status-blue': status === 0,
        'user-status-yellow': status === 1,
      }
    },
    userIconClass(status) {
      return {
        'user-status-blue-background': status === 0,
        'user-status-yellow-background': status === 1,
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
    submitData() {
      if (this.confirmModalType === 1) {
        // 驳回请求
        getUserDeleteCheck(0, this.userDeleteAuthId, this.contentCheck).then(() => {
          this.$message.success('已驳回')
          this.getUserDeletePage(this.pagination.current, this.delType, this.search)
        })
      } else {
        // 通过请求
        getUserDeleteCheck(1, this.userDeleteAuthId, '').then(() => {
          this.$message.success('已通过')
          this.getUserDeletePage(this.pagination.current, this.delType, this.search)
        })
      }
      this.contentCheck = ''
      this.state.confirmModal = false
    },
    openModal(type, record) {
      console.log(record)
      this.confirmModalType = type
      this.userDeleteAuthId = record.user_delete_auth_id
      if (type === 1) {
        getUserDeleteHistory(record.user_id).then((data) => {
          this.HistoryData = data.data
        })
      }
      this.state.confirmModal = true
    },
    delTypeChange(value) {
      this.getUserDeletePage(1, value)
    },
    openRemarkModal(record) {
      this.chooseUserId = record.user_delete_auth_id
      this.state.RemarkModal = true
      this.RemarkText = record.remark
    },
    getRemark() {
      putUserDeleteRemark(this.chooseUserId, this.RemarkText)
        .then(() => {
          this.RemarkText = ''
          this.chooseUserId = 0
          this.$message.success('备注成功')
          this.getUserDeletePage(this.pagination.current, this.delType, this.search)
        })
        .finally(() => {
          this.state.RemarkModal = false
        })
    },
    /**
     * 打开用户未完成用户订单 modal
     */
     async openUserUndoneOrderModal(record) {
       const param = { user_id: JSONbig.stringify(record.user_id), }

       try {
         const { data: undoneOrderData } = await userApi.getUserUndoneOrderApi(param)
         this.userOrderModal.userOrderList = undoneOrderData
         this.userOrderModal.isShowUserOrderModal = true
       } catch (error) {
         console.log(error)
       }
    }
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
  &-blue {
    color: #3980ea;
  }
  &-yellow {
    color: #ff9700;
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
.historyArea {
  span {
    font-size: 14px;
    width: 25%;
    margin-right: 5%;
    padding: 10px;
  }
  label {
    width: 70%;
    color: #787e8d;
    padding: 10px;
  }
  &-text {
    background-color: #f7f8fa;
    width: 100%;
    height: 131px;
    margin: 10px 0;
    p {
      color: #787e8d;
      font-size: 14px;
      padding: 20px;
    }
  }
}

.userOrder-modal-box {
  .userOrder-item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30rpx;
    .userOrder-item-left {
      font-size: 20rpx;
      font-weight: bold;
    }
    .userOrder-item-right {
      flex: 1;
    }
  }
}
</style>
