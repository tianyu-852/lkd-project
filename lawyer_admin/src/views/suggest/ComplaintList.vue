<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="top-prefix">
        <span class="focus-text">投诉举报数量：{{ pagination.total }}</span>
        <div>
          <span>筛选反馈：</span>
          <a-select class="top-select" v-model="statusType">
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
          style="width: 180px; margin: 0 5px"
        />
        <a-button type="primary" @click="getSearchPage"> 搜索 </a-button>
      </div>
    </a-layout-header>
    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => record.report_id"
      >
        <a-table-column key="user" title="投诉人">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.user.nickname"
              :avatar="record.user.avatar"
              :mobile="record.user.mobile"
              :user-id="String(record.user.user_id)"
              @open="openUser(String(record.user.user_id), 'user')"
            />
          </template>
        </a-table-column>
        <a-table-column key="complained_user" title="被投诉人">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.complained_user.nickname"
              :avatar="record.complained_user.avatar"
              :mobile="record.complained_user.mobile"
              :user-id="String(record.complained_user.user_id)"
              @open="openUser(String(record.complained_user.user_id), 'user')"
            />
          </template>
        </a-table-column>
        <a-table-column key="content" align="center" title="被投诉帖子">
          <template slot-scope="record">
            <text-with-row-button :text="record.content" :over-max="50" />
          </template>
        </a-table-column>
        <a-table-column key="report_reason" align="center" title="投诉原因">
          <template slot-scope="record">
            <text-with-row-button :text="record.report_reason" :over-max="50" />
          </template>
        </a-table-column>

        <a-table-column key="reply_content" align="center" title="回复内容">
          <template slot-scope="record">
            <text-with-row-button :text="record.reply_content" :over-max="50" />
          </template>
        </a-table-column>
        <a-table-column key="created_at" align="center" title="提交时间">
          <template slot-scope="record">
            <span>
              <b>{{ record.created_hours }} </b> <br />{{ record.created_date }}
            </span>
          </template>
        </a-table-column>
        <a-table-column key="action" width="200px" title="操作" align="center">
          <template slot-scope="record">
            <q-btn color="orange" size="sm" v-show="record.status === 0"> 待处理 </q-btn>
            <q-btn outline style="color: #2cbf78" label="已处理" v-show="record.status === 1" size="sm" />
            <q-btn
              style="background-color: #f5222d; color: #ffffff; margin: 5px"
              class="margin-left-16"
              size="sm"
              @click="openDeleteText(record.report_id)"
            >
              删除
            </q-btn>
            <q-btn color="primary" class="margin-left-16" size="sm" @click="openText(record)"> 回复TA </q-btn>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <image-viewer :images="images" ref="imageViewer" />
    <q-dialog v-model="state.isDeleteReply">
      <common-dialog title="确认删除" @close="state.isDeleteReply = false">
        <div class="center" style="font-size: 22px; margin-top: 100px">
          <b><p>请确认是否删除该反馈</p></b>
        </div>
        <div class="center" style="margin-top: 50px">
          <q-btn :loading="state.isReplyLoading" color="primary" style="width: 120px" @click="deleteText()">
            删 除
          </q-btn>
        </div>
      </common-dialog>
    </q-dialog>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" />
    </q-dialog>
    <q-dialog v-model="state.isOpenReply">
      <common-dialog title="回复" @close="state.isOpenReply = false">
        <textarea class="textarea" placeholder="请输入对TA的回复" v-model="reply"> </textarea>
        <div class="hr" />
        <div class="center">
          <q-btn :loading="state.isReplyLoading" color="primary" style="width: 120px" @click="suggestReply()">
            提 交
            <template #loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </div>
      </common-dialog>
    </q-dialog>
  </a-layout>
</template>
<script>
import UserCell from '@/components/User/UserCell'
import UserVipCell from '@/components/User/UserVipCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
import QuestionAddDialog from '@/components/Question/QuestionAddDialog'
import { getReportPage, putReportReply, deleteReportDel } from '@/api/suggest'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import ImageViewer from '@/components/Image/ImageViewer'
import CommonDialog from '@/components/Dialog/CommonDialog'
export default {
  name: 'SuggestList',
  components: {
    CommonDialog,
    ImageViewer,
    TextWithRowButton,
    QuestionAddDialog,
    UserCell,
    UserVipCell,
    OrderEvaluateDialog,
    UserDetailDialog,
    SingleAudioPlayer,
  },
  data() {
    return {
      data: [],
      search: '',
      statusType: -1,
      currentUserId: 0,
      state: {
        loading: false,
        isOpenReply: false,
        isReplyLoading: false,
        isDeleteReply: false,
        userDialog: false,
      },
      pendingReplyNumber: 0,
      reply: '',
      replySuggestId: 0,
      images: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: (page) => {
          this.getReportPage(page, this.search)
          this.pagination.current = page
        },
      },
      types: [
        {
          label: '全部反馈',
          value: -1,
        },
        {
          label: '待处理',
          value: 0,
        },
        {
          label: '已处理',
          value: 1,
        },
      ],
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['statusType'] = this.statusType
      condition['search'] = this.search
      return condition
    },
  },

  created() {
    const condition = JSON.parse(sessionStorage.getItem('ComplaintCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.statusType = condition.statusType
      this.search = condition.search
      window.sessionStorage.removeItem('ComplaintCondition')
      this.getReportPage(condition.current, condition.search)
    } else {
      this.getReportPage(1, '')
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
      sessionStorage.setItem('ComplaintCondition', JSON.stringify(this.conditionData))
    },
    getReportPage(page, search) {
      this.state.loading = true
      getReportPage(page, this.statusType, search)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    getSearchPage() {
      this.getReportPage(1, this.search)
    },
    openUser(record) {
      this.state.userDialog = true
      this.currentUserId = record
    },
    suggestTypeText(suggestType) {
      switch (suggestType) {
        case 0:
          return '鼓励加油'
        case 1:
          return '投诉差评'
        case 2:
          return '发表意见'
      }
    },
    openImages(images) {
      this.images = images
      this.$refs.imageViewer.show()
    },
    openText(record) {
      this.state.isOpenReply = true
      this.reply = record.reply_content
      this.replySuggestId = record.report_id
    },
    openDeleteText(suggestId) {
      this.state.isDeleteReply = true
      this.replySuggestId = suggestId
    },
    deleteText() {
      deleteReportDel(this.replySuggestId).then(() => {
        this.state.isDeleteReply = false
        this.$message.success('删除成功')
        this.getReportPage(this.pagination.current, this.search)
      })
    },
    suggestTypeClass(suggestType) {
      return {
        gary: suggestType === 2,
        green: suggestType === 0,
        yellow: suggestType === 1,
      }
    },
    suggestReply() {
      this.state.isReplyLoading = true
      putReportReply(this.replySuggestId, this.reply)
        .then(() => {
          this.getReportPage(this.pagination.current, this.search)

          this.state.isOpenReply = false
          this.$message.success('回复成功')
        })
        .finally(() => {
          this.state.isReplyLoading = false
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
.gray {
  color: #9ea5ae;
}
.green {
  color: #2cbf78;
}
.yellow {
  color: #ff9700;
}
.textarea {
  width: 100%;
  height: 150px;
  border: none;
  font-size: 16px;
  padding: 16px;
  &:focus {
    outline: none;
  }
}
</style>
