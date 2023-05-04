<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div>
        <span class="focus-text">悬赏问答数量：{{ pagination.total }}</span>
        <a-input
          placeholder="搜索用户名/手机号"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 0 5px"
          allow-clear
        />
        <a-button type="primary" @click="getSearchPage"> 搜索</a-button>
        <a-button
          :type="rewardstatus == 0 ? 'primary' : 'danger'"
          style="margin-left: 100px"
          @click="changerewardstatus"
          :loading="state.buttonLoading"
        >
          {{ rewardstatus == 0 ? '开启悬赏问答' : '关闭悬赏问答' }}
        </a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => record.question_id"
      >
        <a-table-column key="user" title="用户" width="230px">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.nickname"
              :avatar="record.avatar"
              :mobile="record.mobile"
              :vip-icon="record.vip_icon"
              :user-id="String(record.user_id)"
              @open="openUser"
            />
          </template>
        </a-table-column>
        <a-table-column key="content" title="帖子详情" width="360px">
          <template slot-scope="record">
            <text-with-row-button :text="record.content" :over-max="50" />
          </template>
        </a-table-column>
        <a-table-column key="created_at" data-index="created_at" title="发布时间" align="center" />

        <a-table-column key="reward" title="悬赏金额" align="center">
          <template slot-scope="record">
            <div>{{ parseInt(record.reward) }}元</div>
          </template>
        </a-table-column>
        <a-table-column key="status" title="状态" align="center">
          <template slot-scope="record">
            <div v-if="record.reward_status === 1">未采纳</div>

            <div v-if="record.reward_status === 3">
              <div>已采纳</div>
            </div>

            <div v-if="record.reward_status === 2">
              <div class="red">未采纳审核</div>
            </div>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <q-btn
              size="sm"
              style="background: #c8d4e8; color: #95a3bb"
              class="margin-right-8"
              disable
              v-if="record.reward_status === 1"
            >
              未审核
            </q-btn>

            <q-btn size="sm" style="color: #2cbf78" class="margin-right-8" outline v-if="record.reward_status === 3">
              已审核
            </q-btn>

            <q-btn
              size="sm"
              style="background: #ff9700; color: white"
              class="margin-right-8"
              v-if="record.reward_status === 2"
            >
              未审核
            </q-btn>

            <q-btn size="sm" color="primary" @click="goRewardQuestionDetail(record.question_id)"> 查看帖子</q-btn>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" />
    </q-dialog>
  </a-layout>
</template>
<script>
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { getRewardQuestion, getGetRewardStatus, putPutRewardStatus } from '@/api/question'
import TextWithRowButton from '@/components/Common/TextWithRowButton'

export default {
  name: 'QuestionRewardList',
  components: { TextWithRowButton, UserVipCell, OrderEvaluateDialog, UserDetailDialog, SingleAudioPlayer, UserCell },
  data() {
    return {
      data: [],
      search: '',
      currentUserId: 0,
      type: 0,
      rewardstatus: 0,
      state: {
        loading: false,
        userDialog: false,
        buttonLoading: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        onChange: (page) => {
          this.getRewardQuestionPage(page, this.search)
          this.pagination.current = page
        },
      },
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('condition'))
    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      window.sessionStorage.removeItem('condition')
      this.getRewardQuestionPage(condition.current, condition.search)
    } else {
      this.getRewardQuestionPage(1, '')
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
      sessionStorage.setItem('condition', JSON.stringify(this.conditionData))
    },
    changerewardstatus() {
      const updateValue = this.rewardstatus === 1 ? 0 : 1
      this.state.buttonLoading = true
      putPutRewardStatus(updateValue)
        .then(() => {
          this.rewardstatus = updateValue
          this.$message.success('修改悬赏问答状态成功')
        })
        .finally(() => {
          this.state.buttonLoading = false
        })
    },
    goRewardQuestionDetail(questionId) {
      sessionStorage.setItem('condition', JSON.stringify(this.conditionData))
      this.$router.push({
        name: 'QuestionRewardDetail',
        params: { questionId: questionId },
      })
    },
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
    },
    getSearchPage() {
      this.getRewardQuestionPage(1, this.search)
    },

    getRewardQuestionPage(page, search) {
      this.state.loading = true
      getGetRewardStatus().then((data) => {
        this.rewardstatus = data.data.status
      })
      getRewardQuestion(page, search)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
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
</style>
