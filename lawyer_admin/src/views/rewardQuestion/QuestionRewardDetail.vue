<template>
  <div class="question-detail">
    <div class="question-detail-left">
      <a-card>
        <div class="question-detail-left-title flex ant-row-flex-space-between">
          <div class="clickable" @click="goList">← 基本信息</div>
          <a-style-button text="历史审核记录" @click="state.isOpenHistory = true" />
        </div>

        <div class="question-detail-left-user">
          <div class="margin-top-32 question-detail-left-user-left">
            <user-cell
              size="md"
              :mobile="question.mobile"
              :avatar="question.avatar"
              :nickname="question.nickname"
              :is-bot="question.is_bot"
            />

            <div class="question-detail-left-create">
              <span class="question-detail-left-create-title">发布时间：</span>
              <span class="question-detail-left-create-time">{{ question.created_at }}</span>
            </div>
          </div>

          <div class="question-detail-left-question">
            <div class="question-detail-left-question-status">
              <div>
                <span>悬赏问答状态：</span>
                <span>{{ mapQuestionRewardStatusText(question.reward_status) }}</span>
              </div>

              <div>
                <span>悬赏问答金额：</span>
                <span>{{ question.reward }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="hr"></div>

        <div class="question-detail-left-bottom">
          <div class="question-detail-left-bottom-title">
            <span>标题：</span>
            <span class="question-detail-left-bottom-title-content">{{ question.title }}</span>
          </div>

          <div class="margin-top-32 question-detail-left-bottom-content">
            <p>帖子内容：</p>
            <div class="question-detail-left-bottom-content-div">
              <div class="question-detail-left-bottom-content-value">
                {{ question.content }}
              </div>
              <div class="hr" style="background: #d2d6de"></div>
              <div class="right">
                <a-button type="link" @click="openQuestion">回复</a-button>
              </div>
            </div>
          </div>

          <div class="question-detail-left-bottom-img">
            <q-img
              src=""
              style="height: 140px; max-width: 130px"
              class="question-detail-left-bottom-img-item"
              v-if="question.question_images.length === 0"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center text-white">该问答没有图片</div>
              </template>
            </q-img>

            <q-img
              v-for="img in question.question_images"
              :key="img"
              class="question-detail-left-bottom-img-item"
              src=""
              spinner-color="blue"
              style="height: 140px; max-width: 130px"
            />
          </div>
        </div>
      </a-card>
    </div>
    <div class="question-detail-right">
      <q-table
        style="height: 695px; margin-bottom: 16px"
        :data="data"
        :columns="columns"
        :loading="state.isTableLoading"
        row-key="name"
        :pagination="pagination"
        :hide-bottom="true"
        separator="cell"
      >
        <template v-slot:body="props">
          <q-tr :props="props" :style="{ background: props.row.is_auth === 1 ? '#F5DEB3' : '' }">
            <q-td key="index" :props="props">
              {{ (pagination.current - 1) * 10 + props.rowIndex + 1 }}
            </q-td>
            <q-td key="user" :props="props">
              <user-cell
                :nickname="props.row.nickname"
                :avatar="props.row.avatar"
                :mobile="props.row.mobile"
                :is-bot="props.row.is_bot"
              />
            </q-td>
            <q-td key="content" :props="props">
              <question-comment-cell
                :is-show-check-success="question.reward_status === 3"
                :question-comment="props.row"
                @delete="getQuestionCommentPage(pagination.current)"
                @success="getQuestionCommentPage(pagination.current)"
                @checkSuccess="refresh"
                @checkFail="refresh"
              />
            </q-td>
          </q-tr>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>

      <a-card>
        <div class="question-detail-right-page">
          <q-checkbox label="只看律师" v-model="isViewLawyer" />

          <q-pagination v-model="pagination.current" :max="pagination.last" :max-pages="5" :direction-links="true" />
        </div>
      </a-card>
    </div>

    <q-dialog v-model="state.questionDialog" persistent>
      <question-add-dialog
        title="回复"
        @close="state.questionDialog = false"
        @success="addQuestionSuccess"
        :question-id="$route.params.questionId"
        mode="comment"
      />
    </q-dialog>

    <q-dialog v-model="state.isOpenHistory" persistent>
      <question-reward-auth-history
        :question-id="parseInt(this.$route.params.questionId)"
        @close="state.isOpenHistory = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import UserCell from '@/components/User/UserCell'
import { getApplyRewardQuestionAuth, getQuestionCommentPage, getQuestionDetail } from '@/api/question'
import QuestionCommentCell from '@/components/Question/QuestionCommentCell'
import QuestionAddDialog from '@/components/Question/QuestionAddDialog'
import AStyleButton from '@/components/Common/AStyleButton'
import QuestionRewardAuthHistory from '@/components/Question/QuestionRewardAuthHistory'

export default {
  name: 'QuestionRewardDetail',
  components: { QuestionRewardAuthHistory, AStyleButton, QuestionAddDialog, QuestionCommentCell, UserCell },
  watch: {
    isViewLawyer() {
      this.getQuestionCommentPage(1)
    },
  },
  data() {
    return {
      columns: [
        // {name: 'index', label: '层序', align: 'center'},
        { name: 'user', align: 'center', label: '用户/律师' },
        { name: 'content', label: '回复' },
      ],
      data: [],
      question: {
        avatar: '',
        nickname: '',
        mobile: '',
        created_at: '',
        hot_number: 0,
        admin_hot_number: 0,
        title: '',
        content: '',
        question_images: [],
        reward_status: 0,
        reward: '0.00',
      },
      questionRewardAuth: null,
      isViewLawyer: false,
      pagination: {
        current: 1,
        last: 1,
        rowsPerPage: 15,
      },
      questionHotNumbers: [],
      state: {
        isTableLoading: false,
        isUpdateHotNumberLoading: false,
        questionDialog: false,
        isOpenHistory: false,
      },
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    openQuestion() {
      this.state.questionDialog = true
    },
    goList() {
      this.$router.go(-1)
    },
    getQuestionDetail() {
      return getQuestionDetail(this.$route.params.questionId).then(({ data }) => {
        data.rank = 0
        this.question = data
      })
    },
    refresh() {
      Promise.all([this.getQuestionCommentPage(1), this.getQuestionDetail(), this.getApplyRewardQuestionAuth()]).then(
        () => {
          if (this.question.reward_status === 1) {
            this.data = this.data.map((data) => {
              data.is_show_check = 1
              return data
            })
          }

          if (!Array.isArray(this.questionRewardAuth)) {
            if (this.question.reward_status === 2) {
              this.questionRewardAuth.is_show_check = 1
              this.questionRewardAuth.is_show_refuse = 1
            }

            this.data.unshift(this.questionRewardAuth)
          }
        }
      )
    },
    getQuestionCommentPage(page) {
      this.state.isTableLoading = true
      return getQuestionCommentPage(this.$route.params.questionId, page, this.isViewLawyer ? 1 : 0)
        .then(({ data }) => {
          this.pagination.last = data.last

          data.data = data.data.map((item) => {
            item.is_show_check = 0
            item.is_show_refuse = 0
            item.is_auth = 0
            return item
          })

          this.data = data.data
        })
        .finally(() => {
          this.state.isTableLoading = false
        })
    },
    getApplyRewardQuestionAuth() {
      return getApplyRewardQuestionAuth(this.$route.params.questionId).then(({ data }) => {
        if (!Array.isArray(data)) {
          data.is_show_check = data.is_show_refuse = 0
          data.is_auth = 1
        }

        this.questionRewardAuth = data
      })
    },
    addQuestionSuccess() {
      this.getQuestionCommentPage(1)
      this.state.questionDialog = false
    },
    mapQuestionRewardStatusText(status) {
      const rule = ['未悬赏', '悬赏中', '采纳审核中', '悬赏完成']

      return rule[status]
    },
  },
}
</script>

<style lang="less" scoped>
.question-detail {
  display: flex;

  &-left {
    width: 50%;
    margin-right: 16px;

    &-bottom {
      margin-top: 32px;

      &-img {
        min-height: 140px;
        margin-top: 32px;

        &-item {
          margin-right: 16px;
          border-radius: 4px;
        }
      }

      &-content {
        margin-top: 32px;

        p {
          font-size: 18px;
          font-family: PingFang SC, serif;
          font-weight: bold;
          color: #222222;
          opacity: 1;
        }

        &-value {
          height: 200px;
        }

        &-div {
          padding: 20px 23px;
          width: 100%;
          height: 300px;
          background: #eff1f5;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          font-family: PingFang SC, serif;
          color: #787e8d;
        }
      }

      &-title {
        font-size: 18px;
        font-family: PingFang SC, serif;
        color: #222222;
        font-weight: bold;

        &:first-child {
          color: #222222;
        }

        &-content {
          color: #787e8d;
        }
      }
    }

    &-title {
      font-size: 22px;
      font-family: PingFang SC, serif;
      font-weight: 800;
      line-height: 30px;
      color: #222222;
    }

    &-question {
      width: 50%;

      &-status {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        font-size: 16px;
        font-weight: bold;
      }
    }

    &-user {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;

      &-left {
        width: 50%;
      }
    }

    &-create {
      margin-top: 35px;

      &-title {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #222222;
      }

      &-time {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #787e8d;
      }
    }
  }

  &-right {
    width: 50%;

    &-page {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>