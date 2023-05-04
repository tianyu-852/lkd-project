<template>
  <div>
    <div :class="questionCommentClass()">
      <div class="question-comment-content">
        <img
          v-if="questionComment.is_auth === 1 && isShowCheckSuccess"
          class="question-comment-content-success"
          :src="CheckSuccessImage"
        />
        <a-popconfirm :title="timedText" ok-text="OK">
          <span class="clickable question-comment-button-del">{{ timedStatus }}</span>
        </a-popconfirm>
        <span class="questioner" v-if="mode === 'reply' && level === 2"> {{ questionComment.nickname }}： </span>
        <span v-if="mode === 'reply' && level === 3">
          <span class="questioner">
            {{ questionComment.nickname }}
          </span>
          回复
          <span class="questioner"> {{ questionComment.reply_nickname }}： </span>
        </span>

        {{ questionComment.question_comment }}
      </div>
      <div class="question-comment-button">
        <span>{{ questionComment.created_at }}</span>
        <a-button
          v-show="questionComment.is_to_question === 0"
          type="link"
          @click="
            state.save = false
            state.newPost = true
            modifiedContent = questionComment.question_comment
          "
        >
          转为问答
        </a-button>
        <a-button v-show="questionComment.is_to_question === 1" type="link" disabled> 已转为问答 </a-button>
        <a-button
          type="link"
          @click="() => (state.isShowCheckConfirmDialog = true)"
          v-if="questionComment.is_show_check === 1"
        >
          采纳
        </a-button>
        <a-button
          type="link"
          class="question-comment-button-del"
          @click="() => (state.isShowRefuseConfirmDialog = true)"
          v-if="questionComment.is_show_refuse === 1"
        >
          拒绝采纳
        </a-button>

        <a-button type="link" @click="openQuestionerComment()">楼主</a-button>
        <a-button type="link" @click="openQuestionComment(questionComment.question_comment_id)"> 评论 </a-button>
        <a-popconfirm
          title="是否要删除该评论？"
          ok-text="确 认"
          cancel-text="不 行"
          @confirm="deleteQuestionComment(questionComment.question_comment_id)"
        >
          <a-button type="link" class="question-comment-button-del" :loading="state.isDeleteLoading"> 删除 </a-button>
        </a-popconfirm>
      </div>
    </div>

    <q-dialog v-model="state.questionDialog" persistent>
      <question-add-dialog
        title="回复"
        @close="state.questionDialog = false"
        @success="addQuestionCommentSuccess"
        :question-comment-id="currentReplyQuestionCommentId"
        mode="reply"
      />
    </q-dialog>

    <q-dialog v-model="state.questionerReplyDialog" persistent>
      <common-dialog title="楼主回复" @close="state.questionerReplyDialog = false">
        <textarea v-model="questionerReply" class="textarea"> </textarea>
        <div class="hr"></div>
        <div class="center">
          <q-btn
            style="width: 150px"
            color="primary"
            :loading="this.state.isQuestionerReplyLoading"
            @click="addQuestionerComment"
          >
            回 复
            <template #loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </div>
      </common-dialog>
    </q-dialog>

    <div v-for="children in questionComment.children" :key="'question_' + children.question_comment_id">
      <question-comment-cell
        :level="level + 1"
        :question-comment="children"
        mode="reply"
        @success="addQuestionCommentSuccess"
        @delete="$emit('delete')"
      />
    </div>

    <q-dialog v-model="state.isShowCheckConfirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="orange" text-color="white" />
          <span class="q-ml-sm">是否确认要采纳这个答案么？</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn flat :loading="state.isLoadingCheck" label="采纳" @click="checkSuccessRewardQuestion" color="primary">
            <template #loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="state.isShowRefuseConfirmDialog" persistent>
      <common-dialog @close="state.isShowRefuseConfirmDialog = false" title="拒绝采纳理由">
        <div style="box-sizing: border-box; padding: 20px; width: 400px; height: 300px">
          <common-textarea v-model="failReason" style="height: 200px" />
          <q-btn
            color="primary"
            style="width: 360px; margin-top: 20px"
            :loading="state.isLoadingFail"
            @click="checkFailRewardQuestion"
          >
            确定
            <template #loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </div>
      </common-dialog>
    </q-dialog>
    <q-dialog v-model="state.newPost">
      <common-dialog title="转为新的问答帖子" @close="state.newPost = false">
        <p style="margin: 16px">问题描述：</p>
        <textarea v-model="modifiedContent" class="textarea"> </textarea>
        <div style="margin: 0 16px">
          <q-checkbox v-model="state.save" label="保留原评论" />
        </div>
        <div class="hr"></div>
        <div class="center">
          <q-btn style="margin: 0px 30px 20px 30px" @click="state.newPost = false"> 取消转化 </q-btn>
          <q-btn
            style="margin: 0px 30px 20px 30px"
            color="primary"
            :loading="this.state.isQuestionerReplyLoading"
            @click="postQuestionCommentConversion(questionComment)"
          >
            确认转化
            <template #loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </div>
      </common-dialog>
    </q-dialog>
  </div>
</template>

<script>
import {
  addQuestionerComment,
  checkFailRewardQuestion,
  checkSuccessRewardQuestion,
  deleteQuestionComment,
  postQuestionCommentConversion,
} from '@/api/question'
import QuestionAddDialog from '@/components/Question/QuestionAddDialog'
import CommonDialog from '@/components/Dialog/CommonDialog'
import CheckSuccessImage from '@/assets/question/reward_question.png'
import CommonTextarea from '@/components/Common/CommonTextarea'

export default {
  name: 'QuestionCommentCell',
  components: { CommonTextarea, CommonDialog, QuestionAddDialog },
  props: {
    questionComment: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: 'normal', // normal模式 、 reply模式
    },
    level: {
      type: Number,
      default: 1,
    },
    isShowCheckSuccess: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    timedStatus() {
      if (this.questionComment.is_sent === 0) {
        return `(定时发送)`
      }

      return ''
    },
    timedText() {
      return `定时发送的时间是 ： ${this.questionComment.timed_at}`
    },
  },
  data() {
    return {
      state: {
        isDeleteLoading: false,
        questionDialog: false,
        questionerReplyDialog: false,
        isQuestionerReplyLoading: false,
        isShowCheckConfirmDialog: false,
        isShowRefuseConfirmDialog: false,
        isLoadingCheck: false,
        isLoadingFail: false,
        newPost: false,
        save: false,
      },
      CheckSuccessImage,
      currentReplyQuestionCommentId: 0,
      questionerReply: '',
      failReason: '',
      modifiedContent: '',
    }
  },
  methods: {
    openQuestionerReply() {
      this.state.questionerReplyDialog = true
    },
    openQuestionComment(questionCommentId) {
      this.state.questionDialog = true
      this.currentReplyQuestionCommentId = questionCommentId
    },
    questionCommentClass() {
      return {
        'question-comment-reply': this.mode === 'reply',
        'question-comment': this.mode === 'normal',
      }
    },
    deleteQuestionComment(questionCommentId) {
      this.state.isDeleteLoading = true
      deleteQuestionComment(questionCommentId)
        .then(() => {
          this.$emit('delete')
        })
        .finally(() => {
          this.state.isDeleteLoading = false
        })
    },
    addQuestionCommentSuccess() {
      this.$emit('success')
      this.state.questionDialog = false
    },
    openQuestionerComment() {
      this.state.questionerReplyDialog = true
    },
    postQuestionCommentConversion(questionComment) {
      let save = 0
      if (this.state.save) {
        save = 1
      } else {
        save = 0
      }
      console.log(questionComment)
      postQuestionCommentConversion(questionComment.question_comment_id, this.modifiedContent, save).then(() => {
        this.$message.success('转化问答成功')
        this.state.newPost = false
        questionComment.is_to_question = 1
        this.$emit('conversion')
      })
    },
    addQuestionerComment() {
      this.state.isQuestionerReplyLoading = true
      addQuestionerComment(this.questionComment.question_comment_id, this.questionerReply)
        .then(() => {
          this.$message.success('回复成功')
          this.$emit('success')
          this.state.questionerReplyDialog = false
        })
        .finally(() => {
          this.state.isQuestionerReplyLoading = false
        })
    },
    checkSuccessRewardQuestion() {
      this.state.isLoadingCheck = true
      checkSuccessRewardQuestion(this.questionComment.question_comment_id)
        .then(() => {
          this.$message.success('审核成功')
          this.$emit('checkSuccess')
        })
        .finally(() => {
          this.state.isLoadingCheck = false
          this.state.isShowCheckConfirmDialog = false
        })
    },
    checkFailRewardQuestion() {
      this.state.isLoadingFail = true
      checkFailRewardQuestion(this.questionComment.question_comment_id, this.failReason)
        .then(() => {
          this.$message.success('审核成功')
          this.$emit('checkFail')
          this.failReason = ''
        })
        .finally(() => {
          this.state.isLoadingFail = false
          this.state.isShowRefuseConfirmDialog = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
.question-comment-reply {
  width: 100%;
  font-size: 14px;
  font-family: PingFang SC, serif;
  font-weight: bold;
  line-height: 20px;
  color: #787e8d;
  opacity: 1;
  background: #eff1f5;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 8px;
  padding: 8px 8px;
}

.question-comment {
  width: 100%;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 20px;
  color: #222222;
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: start;

  &-content {
    word-break: break-all;
    white-space: normal;
    width: 100%;
    display: flex;
    position: relative;

    &-success {
      width: 70px;
      height: 60px;
      position: absolute;
      left: 50px;
      opacity: 0.4;
    }
  }

  &-button {
    align-self: flex-end;

    button {
      border: none;
    }

    &-del {
      color: #ff524c;
    }
  }
}

.questioner {
  color: #337ab7;
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