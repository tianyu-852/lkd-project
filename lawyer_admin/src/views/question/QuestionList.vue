<template>
  <a-layout class="main">
    <a-layout-header class="top" style="padding: 0 24px">
      <div class="top-prefix">
        <span class="focus-text">帖子数量：{{ pagination.total }}</span>
        <a-select :default-value="0" class="top-select" v-model="searchType">
          <a-select-option v-for="type in types" :value="type.value" :key="type.label">
            {{ type.label }}
          </a-select-option>
        </a-select>

        <a-select :default-value="0" class="top-select" v-model="lawyerTagId">
          <a-select-option v-for="lawyerTag in lawyerTags" :value="lawyerTag.lawyer_tag_id" :key="lawyerTag.lawyer_tag">
            {{ lawyerTag.lawyer_tag }}
          </a-select-option>
        </a-select>
        <div @click="chooseSort" style="cursor: pointer; margin: 5px">
          <img
            v-show="orderType === 0"
            :src="require('@/assets/lawyer/xzfalse_icon_sel@2x.png')"
            style="width: 14px; height: 14px; margin-right: 5px"
          />
          <img
            v-show="orderType === 1"
            :src="require('@/assets/lawyer/xztrue_icon_sel@2x.png')"
            style="width: 14px; height: 14px; margin-right: 5px"
          />
          <span>最新动态</span>
        </div>
        <a-input
          allow-clear
          placeholder="搜索标题/用户名"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 5px"
        />
        <a-button type="primary" @click="getSearchPage" style="margin: 5px"> 搜索 </a-button>
      </div>

      <div>
        <a-range-picker class="top-date" @change="onDateChange" :placeholder="rangePlaceholder" />
        <a-button type="danger" @click="openQuestion"> 发帖 </a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :row-selection="rowSelection()"
        :rowClassName="rowClassName"
        :rowKey="(record) => record.question_id"
      >
        <a-table-column key="user" title="发布人">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.nickname"
              :avatar="record.avatar"
              :mobile="record.mobile"
              :vip-icon="record.vip_icon"
              :user-id="String(record.user_id)"
              :is-bot="record.is_bot"
              @open="openUser"
            />
          </template>
        </a-table-column>
        <a-table-column key="title" width="250px" title="标题">
          <template slot-scope="record">
            <text-with-row-button :text="record.title" :over-max="38" />
          </template>
        </a-table-column>
        <a-table-column key="view_number" align="center" data-index="view_number" title="浏览" />
        <a-table-column key="like_number" align="center" data-index="like_number" title="点赞" />
        <a-table-column key="comment_number" data-index="comment_number" align="center" title="评论" />
        <a-table-column key="timed_status" data-index="timed_status" align="center" title="定时发送时间" />
        <a-table-column key="hot" title="热度(用户/后台/总热度)" align="center">
          <template slot-scope="record">
            <span>
              {{ record.hot_number }} / {{ record.admin_hot_number }} /
              {{ record.hot_number + record.admin_hot_number }}
            </span>
          </template>
        </a-table-column>
        <a-table-column key="created_at" data-index="created_at" title="预计发帖日期" align="center" />
        <a-table-column key="admin_remark" title="备注" align="center">
          <template slot-scope="record">
            {{ record.admin_remark }}
          </template>
        </a-table-column>
        <a-table-column key="action" width="150px" title="操作" align="center">
          <template slot-scope="text, record, index">
            <a-button type="primary" style="margin: 5px" size="small" @click="goDetail(record)"> 详情 </a-button>
            <a-button type="primary" style="margin: 5px" size="small" @click="getRemark(record)">备注 </a-button>
            <a-popconfirm
              v-if="record.is_from_question_comment === 1"
              placement="leftBottom"
              ok-text="撤回"
              cancel-text="取消"
              @confirm="putQuestionCommentConversionBack(record.question_id)"
            >
              <template slot="title"> 是否确认要撤回该问答的转化？ </template>
              <a-button style="margin: 5px" size="small">撤回 </a-button>
            </a-popconfirm>
            <a-popconfirm
              placement="leftBottom"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteQuestion([record.question_id], index)"
            >
              <template slot="title"> 是否确认要删除该问答？ </template>
              <a-button type="danger" style="margin: 5px" size="small">删除 </a-button>
            </a-popconfirm>
          </template>
        </a-table-column>

        <template #title>
          <a-popconfirm
            placement="leftBottom"
            ok-text="确认"
            cancel-text="不行"
            @confirm="deleteQuestion(selectionRows, index)"
          >
            <template slot="title"> 是否确认要删除这些问答？ </template>
            <a-button type="danger" size="small">批量删除 </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model="state.remarkLoading"
      ok-text="确认"
      cancel-text="取消"
      title="备注信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-textarea
        placeholder="请输入备注内容"
        :rows="4"
        ref="textarea"
        v-model="adminRemark"
        :style="{ backgroundColor: adminRemarkColor }"
      ></a-textarea>
      <a-row>
        <a-col :span="24"> <label>选择备注颜色：</label></a-col>

        <a-col :span="6" style="text-align: center">
          <div
            class="chooseColor"
            id="rgba(57, 128, 234, 50%)"
            style="background-color: rgba(57, 128, 234, 50%)"
            @click="changeColor($event)"
          ></div>
        </a-col>
        <a-col :span="4" style="text-align: center">
          <div
            class="chooseColor"
            id="rgba(44, 191, 120, 50%)"
            style="
              background-color: rgba(44, 191, 120, 50%);
              margin: 0 auto;
              border-radius: 50px;
              width: 50px;
              height: 50px;
              border: none;
            "
            @click="changeColor($event)"
          ></div>
        </a-col>
        <a-col :span="4" style="text-align: center">
          <div
            class="chooseColor"
            id="#ffffff"
            style="background-color: #ffffff; border: 1px solid black"
            @click="changeColor($event)"
          ></div>
        </a-col>
        <a-col :span="4" style="text-align: center">
          <div
            class="chooseColor"
            id="rgba(255, 151, 0, 50%)"
            style="background-color: rgba(255, 151, 0, 50%)"
            @click="changeColor($event)"
          ></div>
        </a-col>
        <a-col :span="4" style="text-align: center">
          <div
            class="chooseColor"
            id="rgba(255, 82, 76, 50%)"
            style="background-color: rgba(255, 82, 76, 50%)"
            @click="changeColor($event)"
          ></div>
        </a-col>
      </a-row>
    </a-modal>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="String(currentUserId)" @close="state.userDialog = false" />
    </q-dialog>

    <q-dialog v-model="state.questionDialog" persistent>
      <question-add-dialog title="发帖" @close="state.questionDialog = false" @success="addQuestionSuccess" />
    </q-dialog>
  </a-layout>
</template>

<script>
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
import {
  deleteQuestion,
  getQuestionPage,
  getQuestionTags,
  putQuestionRemark,
  putQuestionCommentConversionBack,
} from '@/api/question'
import UserVipCell from '@/components/User/UserVipCell'
import QuestionAddDialog from '@/components/Question/QuestionAddDialog'
import TextWithRowButton from '@/components/Common/TextWithRowButton'

export default {
  name: 'QuestionList',
  components: {
    TextWithRowButton,
    QuestionAddDialog,
    UserVipCell,
    OrderEvaluateDialog,
    UserDetailDialog,
    SingleAudioPlayer,
    UserCell,
  },
  data() {
    return {
      orderType: 0,
      data: [],
      search: '',
      startDate: '',
      endDate: '',
      searchType: 0,
      currentUserId: 0,
      lawyerTagId: 0,
      lawyerTags: [],
      adminRemarkColor: '',
      adminRemark: '',
      questionId: '',
      state: {
        loading: false,
        userDialog: false,
        questionDialog: false,
        remarkLoading: false,
      },
      selectionRows: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getQuestionPage(page, this.search)
          this.pagination.current = page
        },
      },
      types: [
        {
          label: '全部帖子',
          value: 0,
        },
        {
          label: '标题',
          value: 1,
        },
        {
          label: '用户名',
          value: 2,
        },
        {
          label: '无律师评论',
          value: 3,
        },
      ],
      rangePlaceholder: ['开始日期', '结束日期'],
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['searchType'] = this.searchType
      condition['search'] = this.search
      condition['lawyerTagId'] = this.lawyerTagId
      condition['startDate'] = this.startDate
      condition['endDate'] = this.endDate
      condition['orderType'] = this.orderType
      return condition
    },
  },

  created() {
    const condition = JSON.parse(sessionStorage.getItem('questionCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.searchType = condition.searchType
      this.search = condition.search
      this.lawyerTagId = condition.lawyerTagId
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.pagination.current = condition.current
      this.orderType = condition.orderType
      window.sessionStorage.removeItem('questionCondition')
      this.getQuestionPage(condition.current, condition.search)
    } else {
      this.getQuestionPage(1, '')
    }
    this.getQuestionTags()
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('questionCondition', JSON.stringify(this.conditionData))
    },
    chooseSort() {
      if (this.orderType === 1) {
        this.orderType = 0
      } else {
        this.orderType = 1
      }
      this.getQuestionPage(1, '')
    },
    goDetail(record) {
      sessionStorage.setItem('questionCondition', JSON.stringify(this.conditionData))
      sessionStorage.setItem('user_id', JSON.stringify(record.user_id))
      const questionId = String(record.question_id)
      this.$router.push({
        name: 'QuestionDetail',
        params: { questionId },
      })
    },
    rowClassName(record, index) {
      if (record.admin_remark_color === 'rgba(57, 128, 234, 50%)') {
        return 'table-back1'
      } else if (record.admin_remark_color === 'rgba(44, 191, 120, 50%)') {
        return 'table-back2'
      } else if (record.admin_remark_color === 'rgba(255, 151, 0, 50%)') {
        return 'table-back3'
      } else if (record.admin_remark_color === 'rgba(255, 82, 76, 50%)') {
        return 'table-back4'
      }
    },
    changeColor(color) {
      this.adminRemarkColor = color.currentTarget.id
    },
    getRemark(record) {
      this.adminRemarkColor = record.admin_remark_color
      this.adminRemark = record.admin_remark
      this.state.remarkLoading = true
      this.questionId = record.question_id
    },
    handleOk() {
      putQuestionRemark(this.questionId, this.adminRemark, this.adminRemarkColor)
        .then((data) => {
          this.$message.success('备注成功')
          this.getQuestionPage(this.pagination.current, this.search)
        })
        .catch(() => {
          this.$message.error('备注失败')
        })
        .finally(() => {
          this.questionId = ''
          this.adminRemark = ''
          this.adminRemarkColor = ''
          this.state.remarkLoading = false
        })
    },
    handleCancel(e) {
      this.state.remarkLoading = false
    },
    openQuestion() {
      this.state.questionDialog = true
    },
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
    },
    getQuestionTags() {
      getQuestionTags().then(({ data }) => {
        this.lawyerTags = data
      })
    },
    getQuestionPage(page, search) {
      this.state.loading = true
      getQuestionPage(page, this.searchType, search, this.lawyerTagId, this.startDate, this.endDate, this.orderType)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.data = data.data
          this.pagination.current = page
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    onDateChange(date, dateString) {
      ;[this.startDate, this.endDate] = dateString
    },
    deleteQuestion(questionIds) {
      this.state.loading = true

      deleteQuestion(questionIds)
        .then(() => {
          this.$message.success('已成功删除')
          this.getQuestionPage(this.pagination.current, this.search)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    putQuestionCommentConversionBack(id) {
      putQuestionCommentConversionBack(id).then(() => {
        this.$message.success('已成功撤回')
        this.getQuestionPage(this.pagination.current, this.search)
      })
    },
    getSearchPage() {
      this.pagination.current = 1
      this.getQuestionPage(1, this.search)
    },
    rowSelection() {
      const that = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          that.selectionRows = selectedRows.map((row) => row.question_id)
        },
      }
    },
    addQuestionSuccess() {
      this.getQuestionPage(1, '')
      this.state.questionDialog = false
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    height: auto;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    &-prefix {
      display: flex;
      align-items: center;
      height: auto;
      flex-wrap: wrap;
    }
    &-select {
      margin: 5px;
      margin-right: 20px;
      width: 100px;
    }
    &-date {
      width: 200px;
      margin-right: 16px;
    }
    input {
      width: 150px;
      margin-right: 10px;
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
.user {
  position: relative;
  &-vip-icon {
    position: absolute;
    top: -16px;
    left: -16px;
  }
  &-cell-div {
    margin-left: 26px;
  }
}
/deep/.table-back1 {
  background-color: #3980ea80;
}
/deep/.table-back2 {
  background-color: #2cbf7880;
}
/deep/.table-back3 {
  background-color: #ff970080;
}
/deep/.table-back4 {
  background-color: #ff524c80;
}
.chooseColor {
  margin: 0 auto;
  border-radius: 50px;
  width: 50px;
  height: 50px;
  border: none;
  opacity: 0.5;
}
</style>
