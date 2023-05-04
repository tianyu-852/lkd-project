<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">可疑收费律师数量：{{ pagination.total }}</span>
      <a-input
        allow-clear
        placeholder="搜索用户名/手机号"
        v-model="search"
        @keyup.enter="getSearchPage"
        style="width: 180px; margin: 0 5px"
      />
      <a-button type="primary" @click="getSearchPage"> 搜索 </a-button>
    </a-layout-header>

    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => record.user_id"
      >
        <a-table-column key="mobile" data-index="mobile" title="手机号" />
        <a-table-column key="nickname" data-index="nickname" title="姓名" />
        <a-table-column key="lawyer_grade" data-index="lawyer_grade" title="认证程度" />
        <a-table-column key="evaluation1" title="已接听次数">
          <template slot-scope="record">
            <div style="text-align: center">
              {{ record.unconnected_number }}
            </div>
          </template>
        </a-table-column>
        <a-table-column key="evaluation" title="未接听次数">
          <template slot-scope="record">
            <div style="text-align: center">
              {{ record.unconnected_number }}
            </div>
          </template>
        </a-table-column>
        <a-table-column key="lawyer_office" data-index="lawyer_office" title="所属律师所" />
        <a-table-column key="start_work_time" data-index="start_work_time" title="执业年限" />
        <a-table-column key="register_at" data-index="register_at" title="注册时间" />
        <a-table-column key="login_info" title="最后登录时间|地点">
          <template slot-scope="record">
            <div>{{ record.login_at }} {{ record.location.length > 0 ? '|' + record.location : '' }}</div>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作">
          <template slot-scope="text, record, index">
            <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record.user_id)">
              查看
            </a-button>

            <a-popconfirm
              style="margin: 5px"
              placement="leftBottom"
              ok-text="确认"
              cancel-text="不行"
              @confirm="deleteLawyer(record.user_id, index)"
            >
              <template slot="title"> 是否确认要删除该律师？ </template>
              <a-button type="danger" size="small">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import { deleteLawyer, getLawyerBetter, getLawyerDoubtfulCharges } from '@/api/lawyer'

export default {
  name: 'Lawyer',
  data() {
    return {
      data: [],
      search: '',
      state: {
        loading: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: (page) => {
          this.getLawyerPage(page)
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
    const condition = JSON.parse(sessionStorage.getItem('lawyerDoubtfulCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      // window.sessionStorage.removeItem('lawyerDoubtfulCondition')
      sessionStorage.clear()
      this.getLawyerPage(condition.current, condition.search)
    } else {
      this.getLawyerPage(1, '')
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
      sessionStorage.setItem('lawyerDoubtfulCondition', JSON.stringify(this.conditionData))
    },
    redirectDetail(userId) {
      sessionStorage.setItem('lawyerDoubtfulCondition', JSON.stringify(this.conditionData))
      this.$router.push({ name: 'LawyerDetail', params: { userId: userId } })
    },
    deleteLawyer(userId, index) {
      this.state.loading = true

      deleteLawyer(userId)
        .then(() => {
          this.pagination.total -= 1
          this.data.splice(index, 1)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    getSearchPage() {
      this.getLawyerPage(1)
    },
    getLawyerPage(page) {
      this.state.loading = true
      getLawyerDoubtfulCharges(page)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          for (let i = 0; i < data.data.length; i++) {
            data.data[i]['iconLoading'] = false
          }
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    setPreferred(record) {
      record.iconLoading = true
      if (record.is_better === 1) {
        record.is_better = 0
      } else {
        record.is_better = 1
      }
      getLawyerBetter(record.user_id, record.is_better)
        .then((data) => {
          this.$message.success('设置成功')
        })
        .finally(() => {
          record.iconLoading = false
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
