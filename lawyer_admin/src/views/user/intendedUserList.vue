<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">意向用户数量:{{ pagination.total }}</span>
      <!-- <a-input
        allow-clear
        placeholder="搜索用户名/手机号"
        v-model="search"
        @keyup.enter="getSearchPage"
        style="width: 180px; margin: 0 5px"
      />
      <a-button type="primary" @click="getSearchPage"> 搜索 </a-button> -->
      <div class="addList">
        <div class="addList-option" @click=";(state.addModal = true), (modelTitle = 0)">
          <img :src="require('@/assets/common/icon_add_green.png')" />
          <span style="color: #2cbf78">添加意向用户</span>
        </div>
        <div v-show="true" class="addList-option" @click=";(state.addModal = true), (modelTitle = 1)">
          <img :src="require('@/assets/common/icon_add_blue.png')" />
          <span style="color: #3980ea">添加意向客服</span>
        </div>
        <div class="addList-option" @click=";(state.addModal = true), (modelTitle = 2)">
          <img :src="require('@/assets/common/icon_add_red.png')" />
          <span style="color: #ff524c">添加法律顾问</span>
        </div>
      </div>
    </a-layout-header>
    <a-card class="content">
      <a-table
        :pagination="pagination"
        :rowKey="(record) => record.wechat_number"
        :data-source="data"
        bordered
        :loading="state.loading"
      >
        <a-table-column key="mobile" title="手机号">
          <template slot-scope="text, record">
            <span> {{ record.mobile }} </span>
            <span> | </span>
            <span class="text-btn" @click="copyClip(record.mobile)"> 复制 </span>
          </template>
        </a-table-column>
        <a-table-column key="company_nickname" title="公司名称">
          <template slot-scope="text, record">
            <span> {{ record.company_nickname }} </span>
            <span> | </span>
            <span class="text-btn" @click="copyClip(record.company_nickname)"> 复制 </span>
          </template>
        </a-table-column>

        <a-table-column key="customer_nickname" title="使用人姓名">
          <template slot-scope="text, record">
            <span> {{ record.customer_nickname }} </span>
            <span> | </span>
            <span class="text-btn" @click="copyClip(record.customer_nickname)"> 复制 </span>
          </template>
        </a-table-column>
        <a-table-column key="wechat_number" title="微信号码">
          <template slot-scope="text, record">
            <span> {{ record.wechat_number }} </span>
            <span> | </span>
            <span class="text-btn" @click="copyClip(record.wechat_number)"> 复制 </span>
          </template>
        </a-table-column>
        <a-table-column key="intentional_customer_service_admin" title="负责的意向客服">
          <template slot-scope="text, record">
            {{ record.intentional_customer_service_admin.nickname }}
          </template>
        </a-table-column>
        <a-table-column key="lawyer_customer_service_admin" title="负责的法律顾问">
          <template slot-scope="text, record">
            {{ record.lawyer_customer_service_admin.nickname }}
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <a-modal v-model="state.addModal" @ok="submitData">
      <div class="addIntendedUser">
        <div class="addIntendedUser-title">
          <span>{{ modelTitle === 0 ? '添加意向用户' : modelTitle === 1 ? '添加意向用户' : '添加法律顾问' }} </span>
        </div>
        <div class="addIntendedUser-main" v-show="modelTitle === 0">
          <a-input placeholder="请输入使用人名称" v-model="intendedUser.name" />
          <a-input placeholder="请输入公司名称" v-model="intendedUser.company" />
          <a-input placeholder="请输入联系人号码" v-model="intendedUser.mobile" />
          <a-input placeholder="请输入微信号码" v-model="intendedUser.WeChat" />
        </div>
        <div class="addIntendedUser-main" v-show="modelTitle !== 0">
          <a-input
            :placeholder="modelTitle === 2 ? '请输入法律顾问名称' : '请输入客服名称'"
            v-model="intendedAdviser.name"
          />
          <a-input placeholder="请输入登录账号" v-model="intendedAdviser.account" />
          <a-input placeholder="请输入登录密码" v-model="intendedAdviser.password" />
        </div>
        <div class="addIntendedUser-action">
          <a-button @click="cancelAdd()"> 取消 </a-button>
          <a-button @click="submitData()" type="primary" style="background: #3764ff; border-color: #3764ff">
            确定添加
          </a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import { getIntendedUserPage, postIntendedUser } from '@/api/user'
import { copyToClip } from '@/utils/util'
import moment from 'moment'
export default {
  name: 'LawyerAuth',
  components: {},
  data() {
    return {
      modelTitle: '添加意向客服',
      intendedUser: {
        name: '',
        company: '',
        mobile: '',
        WeChat: '',
      },
      intendedAdviser: {
        name: '',
        account: '',
        password: '',
      },
      data: [],
      search: '',
      state: {
        loading: false,
        addModal: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        onChange: (page) => {
          this.getIntendedUserPage(page, this.search)
          this.pagination.current = page
        },
      },
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('IntendedUserCondition'))
    if (condition) {
      this.pagination.current = condition.current
      sessionStorage.clear()
      this.getIntendedUserPage(condition.current)
    } else {
      this.getIntendedUserPage(1)
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
      sessionStorage.setItem('IntendedUserCondition', JSON.stringify(this.conditionData))
    },
    getIntendedUserPage(page) {
      this.state.loading = true

      getIntendedUserPage(page)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          this.data = data.data
          console.log(this.data)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    moment,
    submitData() {
      if (this.modelTitle === 0) {
        postIntendedUser(
          this.intendedUser.name,
          this.intendedUser.company,
          this.intendedUser.mobile,
          this.intendedUser.WeChat
        )
          .then(() => {
            this.state.addModal = false
            this.$message.success('添加成功')
            this.getIntendedUserPage(1)
          })
          .catch(() => {
            this.$message.error('添加失败')
          })
          .finally(() => {
            // this.state.addModal = false
          })
      } else {
        console.log('暂无该功能')
      }
    },
    cancelAdd() {
      this.state.addModal = false
      this.intendedUser.name = ''
      this.intendedUser.company = ''
      this.intendedUser.mobile = ''
      this.intendedUser.WeChat = ''
      this.intendedAdviser.name = ''
      this.intendedAdviser.account = ''
      this.intendedAdviser.password = ''
    },
    copyClip(text) {
      copyToClip(text)
      this.$message.success('已复制到剪切板')
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
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    padding: 20px;
    input {
      margin: 10px 0;
      background: #f5f7fa;
      border: 1px solid #e1e6ee;
      opacity: 1;
      border-radius: 8px;
    }
  }
  &-action {
    height: 88px;
    padding: 28px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    button {
      width: 178px;
      height: 36px;
    }
  }
}
.addList {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  &-option {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
    margin: 0 20px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
    span {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      opacity: 1;
    }
  }
}
</style>
