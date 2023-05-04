<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div>
        <span class="focus-text">客服人数：{{ pagination.total }}</span>
        <a-input
          allow-clear
          placeholder="搜索用户名/手机号"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 0 5px"
        />
        <a-button type="primary" @click="getSearchPage"> 搜索 </a-button>
      </div>
      <div>
        <a-button type="primary" style="margin: 0 10px" @click="getServiceWaitList">添加客服</a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => String(record.user_id)"
      >
        <a-table-column key="user" title="客服信息">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.nickname"
              :mobile="record.mobile"
              :avatar="record.avatar"
              :user-id="String(record.user_id)"
              size="sm"
              @open="openUser(String(record.user_id), 'user')"
            />
          </template>
        </a-table-column>
        <a-table-column key="count_user" title="现有用户数量">
          <template slot-scope="record">
            {{ record.count_user }}
          </template>
        </a-table-column>
        <a-table-column key="monthCommission" title="当月提成">
          <template slot-scope="record">
            {{ record.monthCommission }}
          </template>
        </a-table-column>
        <a-table-column key="allCommission" title="总销售提成">
          <template slot-scope="record">
            {{ record.allCommission }}
          </template>
        </a-table-column>
        <a-table-column key="status1" title="当月违规">
          <template slot-scope="record">
            {{ record.status_chinese }}
          </template>
        </a-table-column>
        <a-table-column key="status2" title="总违规数">
          <template slot-scope="record">
            {{ record.status_chinese }}
          </template>
        </a-table-column>
        <a-table-column key="allocation_status" title="当前状态">
          <template slot-scope="record">
            <a-popconfirm
              title="请确认是否修改该客服状态?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="changeStatus(record)"
            >
              <a :style="record.allocation_status === 0 ? 'color:#9EA5AE' : 'color:#3980EA'">
                {{ record.allocation_status === 0 ? '休息' : '值班' }}
              </a>
            </a-popconfirm>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作">
          <template slot-scope="record">
            <a-button type="primary" style="margin: 0 10px" @click="transferUser(record)"> 转移 </a-button>
            <a-popconfirm title="请确认是否删除该客服?" ok-text="删除" cancel-text="取消" @confirm="delUser(record)">
              <a-button type="danger"> 删除 </a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <input id="input" style="opacity: 0; position: absolute" />
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" :mode="dialogType" @close="state.userDialog = false" />
    </q-dialog>
    <a-modal v-model="state.transferUser">
      <div class="addIntendedUser">
        <div class="addIntendedUser-title">
          <span>用户转移</span>
        </div>
        <div class="addIntendedUser-main">
          <div class="addIntendedUser-main-option">
            <span> 当前客服 </span>
            <div class="addIntendedUser-main-option-inputDiv">{{ chooseData.nickname }}</div>
          </div>
          <div class="addIntendedUser-main-option">
            <span>用户数量 </span>
            <div class="addIntendedUser-main-option-inputDiv">{{ chooseData.count_user }}</div>
          </div>
          <div class="addIntendedUser-main-option">
            <span> 转移客服 </span>
            <div>
              <a-select ref="select" style="width: 300px" placeholder="请选择接收转移客服" v-model="transferId">
                <a-select-option :value="String(i.user_id)" v-for="(i, key) in data" :key="key">
                  {{ i.nickname }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
        <div class="addIntendedUser-action">
          <a-button @click="state.transferUser = false"> 取消 </a-button>
          <a-button type="primary" style="background: #3764ff; border-color: #3764ff" @click="confirmTransfer()">
            确定转移
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 添加客服 modal -->
    <a-modal v-model="state.addCustomerService" :width="700">
      <div class="addIntendedUser">
        <div class="addIntendedUser-title">
          <span>添加客服</span>
        </div>
        <div class="addIntendedUser-main">
          <!-- <a-input-search allow-clear placeholder="搜索用户名/手机号" enter-button @search="getServiceWaitList(1)" v-model="searchUser" /> -->
          <a-table
            style="width: 100%"
            :row-selection="{ type: 'radio', onChange: onSelectChange }"
            :pagination="addPagination"
            :columns="columns"
            :data-source="userData"
            :loading="state.userLoading"
            :rowKey="(record) => String(record.user_id)"
            bordered
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
          </a-table>
        </div>
        <div class="addIntendedUser-action">
          <a-button @click="state.addCustomerService = false">取消</a-button>
          <a-button type="primary" style="background: #3764ff; border-color: #3764ff" @click="determineAddUser">添加客服</a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import { getServiceSetting, putServiceStatus, putServiceMove, putServiceSettingDel, postServiceAdd, getServiceWaitListApi } from '@/api/service'
// import { getUserPage } from '@/api/user'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'

const columns = [
  {
    title: '用户',
    dataIndex: 'nickname',
    scopedSlots: { customRender: 'nickname' },
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
]

export default {
  name: 'OrderList',
  components: { UserVipCell, UserDetailDialog, SingleAudioPlayer, UserCell },
  data() {
    return {
      transferId: '',
      columns,
      search: '',
      userData: [],
      searchUser: '',
      data: [],
      currentUserId: 0,
      dialogType: '',
      state: {
        loading: false,
        userDialog: false,
        transferUser: false,
        addCustomerService: false, // 是否显示添加客服 modal
        userLoading: false, // 添加客服 modal table 加载状态
      },

      // 客服 table 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: (page) => {
          this.getServiceSetting(page, this.search)
          this.pagination.current = page
        },
      },
      
      // 添加客服 modal 分页器
      addPagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getServiceWaitList(page, 0)
          this.addPagination.current = page
        },
      },
      addUserID: '', // 待添加客户 user id
      chooseData: {},
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition.page = this.pagination.current
      return condition
    },
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('orderListCondition'))) {
      const condition = JSON.parse(sessionStorage.getItem('orderListCondition'))
      this.pagination.current = condition.page
      window.sessionStorage.removeItem('orderListCondition')
      this.getServiceSetting(condition.page, this.search)
    } else {
      this.getServiceSetting(1, '')
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
      sessionStorage.setItem('orderListCondition', JSON.stringify(this.conditionData))
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      if (type === 'user') {
        this.dialogType = 'user'
      } else {
        this.dialogType = 'lawyer'
      }
    },
    getSearchPage() {
      this.getServiceSetting(1)
    },

    /**
     * 获取客服列表
     */
    getServiceSetting(page) {
      this.state.loading = true
      getServiceSetting(page, this.search)
        .then(({ data }) => {
          console.log(data)
          this.pagination.total = data.total
          this.pagination.current = page
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    /**
     * 删除客服
     */
    delUser(record) {
      if (record.count_user > 0) {
        this.$message.error('操作失败，删除客服前，该客服的用户数应为0')
      } else {
        putServiceSettingDel(record.user_id).then((data) => {
          this.$message.success('删除成功')
          this.getServiceSetting(1)
        })
      }
    },

    /**
     * 转移客服
     */
    transferUser(data) {
      this.state.transferUser = true
      this.chooseData = data
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.addUserID = String(selectedRows[0].user_id)
      // 保存选中id
    },
    
    /**
     * 添加客服
     */
    determineAddUser() {
      postServiceAdd(this.addUserID).then((data) => {
        this.$message.success('添加客服成功')
        this.state.addCustomerService = false
        this.getServiceSetting(1)
      })
    },

    /**
     * 获取客户候选人列表
     */
     async getServiceWaitList(page = 1) {
       this.state.userLoading = true
       this.state.addCustomerService = true
       const param = { page }

       try {
         const { data: labelListData } = await getServiceWaitListApi(param)
         this.userData = labelListData.data
         this.addPagination.total = labelListData.total
        this.state.userLoading = false
       } catch (error) {
         this.state.userLoading = false
         console.log(error)
       }
    },

    /**
     * 获取客户列表
     */
    // getUserPageData(page) {
    //   this.state.userLoading = true
    //   this.state.addCustomerService = true
    //   getUserPage(page, 0, this.searchUser)
    //     .then((data) => {
    //       this.userData = data.data.data
    //       this.addPagination.total = data.data.total
    //     })
    //     .finally(() => {
    //       this.state.userLoading = false
    //     })
    // },

    changeStatus(record) {
      putServiceStatus(record.user_id, record.allocation_status === 0 ? 1 : 0).then((data) => {
        this.$message.success('切换客服状态成功')
        this.getServiceSetting(1)
      })
    },

    confirmTransfer() {
      putServiceMove(this.chooseData.user_id, this.transferId)
        .then((data) => {
          console.log(data)
          this.$message.success('转移用户成功')
          this.state.transferUser = false
        })
        .catch((data) => {
          console.log(data)
        })
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

    &-select {
      margin-right: 20px;
      width: 120px;
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

  .content {
    margin-top: 16px;
  }
}
.addIntendedUser {
  &-title {
    background: #ebeef5;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 48px;
    border-radius: 16px 8px 0 0;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 34px;
    color: #222222;
    opacity: 1;
  }
  &-main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: flex-start;
    padding: 10px 20px;
    &-option {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      width: 100%;
      margin: 5px 0;
      span {
        width: 56px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
        margin-right: 20px;
        opacity: 1;
      }
      &-inputDiv {
        background: #f5f7fa;
        border: 1px solid #e1e6ee;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #9ea5ae;
        width: 300px;
        height: 32px;
        opacity: 1;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        align-content: center;
        padding: 0 10px;
      }
    }
  }
  &-action {
    height: 88px;
    padding: 0 28px 28px 28px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    button {
      width: 178px;
      height: 36px;
    }
  }
}
/deep/.ant-modal-close,
/deep/.ant-modal-header,
/deep/.ant-modal-footer {
  display: none;
}
/deep/.ant-modal-body {
  padding: 0;
}
/deep/.ant-modal-content {
  border-radius: 16px 8px 16px 8px;
}
</style>
