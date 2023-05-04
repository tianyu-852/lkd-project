<template>
  <common-dialog :title="title" style="max-width: 700px" @close="$emit('close')">
    <q-card class="question-add-contain">
      <div class="question-add-contain-header">
        <select-search :options="searchTypes" @search="search" />
      </div>
      <q-table
        :data="rows"
        :columns="columns"
        style="height: 322px"
        row-key="name"
        hide-pagination
        :hide-bottom="true"
        :loading="state.isLoading"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="checkbox" :props="props">
              <q-checkbox v-model="props.row.is_check" @input="(value) => onInputChange(props.row, value)" />
            </q-td>
            <q-td key="user_id" :props="props">
              {{ props.row.user_id }}
            </q-td>
            <q-td key="nickname" :props="props">
              <a-avatar :src="props.row.avatar" />
              <span class="margin-left-8">{{ props.row.nickname }}</span>
            </q-td>
            <q-td key="mobile" :props="props">
              {{ props.row.mobile }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
      <div class="send-container">
        <div class="add-question">
          <div class="add-question-title" v-if="isQuestion">
            <input placeholder="标题(非必选)" v-model="questionTitle" />
          </div>
          <div class="hr hr-color" v-if="isQuestion" />
          <lawyer-tag-select v-model="lawyerTagId" v-if="isQuestion" />
          <div class="hr hr-color" />
          <textarea class="add-question-textarea" placeholder="帖子/评论 内容" v-model="questionContent" />
          <div class="hr hr-color" />
          <div class="add-question-bottom">
            <div class="add-question-bottom-prefix">
              <q-checkbox v-model="state.isTimed" label="定时" />
              <div v-show="state.isTimed" class="add-question-year margin-right-16 clickable">
                {{ date === '' ? '点击选择年' : date }}
                <template>
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="date" mask="YYYY-MM-DD" :options="overTodayDate">
                      <!-- <q-date v-model="date" mask="YYYY-MM-DD"> -->
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </template>
              </div>
              <div v-show="state.isTimed" class="add-question-hour margin-right-16 center">
                <input v-model.number="hour" />
                时
              </div>
              <div v-show="state.isTimed" class="add-question-minute center"><input v-model.number="minute" />分</div>
            </div>
            <q-btn color="primary" size="md" @click="add" :loading="state.isBtnLoading">
              立即发送
              <template #loading>
                <q-spinner-hourglass class="on-left" />
              </template>
            </q-btn>
          </div>
        </div>
        <div class="center margin-top-16">
          <q-pagination
            v-model="pagination.current"
            :max="pagination.last"
            :max-pages="6"
            :direction-links="true"
            :boundary-links="true"
            @input="onPageChange"
          />
          <a-button @click="onPageChange(robotPage)" style="border: none">跳转至</a-button>
          <a-input v-model.number="robotPage" style="width: 50px" @pressEnter="onPageChange(robotPage)" />
        </div>
      </div>
    </q-card>
  </common-dialog>
</template>
<script>
import CommonDialog from '@/components/Dialog/CommonDialog'
import SelectSearch from '@/components/Common/SelectSearch'
import { getQuestionBotPage } from '@/api/user'
import { addQuestion, addQuestionComment, addQuestionCommentReply } from '@/api/question'
import LawyerTagSelect from '@/views/lawyer/LawyerTagSelect'
export default {
  name: 'QuestionAddDialog',
  components: { LawyerTagSelect, SelectSearch, CommonDialog },
  props: {
    title: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'question', // question发帖 comment评论 reply回复
    },
    questionId: {
      type: String,
      default: '0',
    },
    questionCommentId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      columns: [
        { name: 'checkbox', label: '选择', align: 'center' },
        { name: 'user_id', label: '序列号', align: 'center', field: 'user_id' },
        { name: 'nickname', align: 'center', label: '用户名', field: 'nickname' },
        { name: 'mobile', label: '手机号', field: 'mobile', align: 'center' },
      ],
      robotPage: null,
      selected: null,
      searchType: 0,
      searchValue: '',
      searchTypes: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '序列号',
          value: 1,
        },
        {
          label: '用户名',
          value: 2,
        },
        {
          label: '手机号',
          value: 3,
        },
      ],
      rows: [],
      state: {
        isTimed: false,
        isLoading: false,
        isBtnLoading: false,
      },
      date: '',
      hour: '',
      minute: '',
      questionTitle: '',
      questionContent: '',
      lawyerTagId: 0,
      pagination: {
        current: 1,
        last: 1,
      },
    }
  },
  computed: {
    isQuestion() {
      return this.mode === 'question'
    },
    isComment() {
      return this.mode === 'comment'
    },
    isReply() {
      return this.mode === 'reply'
    },
  },
  created() {
    this.getQuestionBotPage()
  },
  methods: {
    getQuestionBotPage() {
      this.state.isLoading = true
      getQuestionBotPage(this.pagination.current, this.searchType, this.searchValue)
        .then(({ data }) => {
          this.rows = data.data.map((row) => {
            row.is_check = false
            return row
          })
          this.pagination.last = data.last
        })
        .finally(() => {
          this.state.isLoading = false
        })
    },
    search(searchType, search) {
      this.searchType = searchType
      this.searchValue = search
      this.getQuestionBotPage()
    },
    onInputChange(row, value) {
      row.is_check = value
      if (value === true) {
        this.selected = row
        this.rows.forEach((selfRow) => {
          if (selfRow.user_id === row.user_id) {
            return
          }

          selfRow.is_check = false
        })
      } else {
        this.selected = null
      }
    },
    onPageChange(page) {
      this.pagination.current = page
      this.getQuestionBotPage()
    },
    addQuestionCommentReply() {
      if (this.selected === null) {
        this.errorMessage(`请勾选发送该内容的用户`)
        return
      }
      if (this.questionContent.length === 0) {
        this.errorMessage('请填写问答的内容')
        return
      }
      this.state.isBtnLoading = true
      addQuestionCommentReply(
        this.selected.user_id,
        this.questionCommentId,
        this.questionContent,
        this.createTimedTimestamp()
      )
        .then(() => {
          this.successMessage('发送成功')
          this.$emit('success')
        })
        .catch((error) => {
          this.errorMessage('请填写正确的定时时间,不要设置过去的时间')
        })
        .finally(() => {
          this.state.isBtnLoading = false
        })
    },
    add() {
      if (this.isQuestion) {
        this.addQuestion()
      }

      if (this.isComment) {
        this.addQuestionComment()
      }

      if (this.isReply) {
        this.addQuestionCommentReply()
      }
    },
    addQuestionComment() {
      if (this.selected === null) {
        this.errorMessage(`请勾选发送该内容的用户`)
        return
      }
      if (this.questionContent.length === 0) {
        this.errorMessage('请填写问答的内容')
        return
      }

      this.state.isBtnLoading = true
      addQuestionComment(this.selected.user_id, this.questionId, this.questionContent, this.createTimedTimestamp())
        .then(() => {
          this.successMessage('发送成功')
          this.$emit('success')
        })
        .finally(() => {
          this.state.isBtnLoading = false
        })
    },
    addQuestion() {
      if (this.selected === null) {
        this.errorMessage(`请勾选发送该内容的用户`)
        return
      }
      if (this.questionContent.length === 0) {
        this.errorMessage('请填写问答的内容')
        return
      }

      if (this.lawyerTagId === 0) {
        this.errorMessage('请选择问答的标签')
        return
      }

      this.state.isBtnLoading = true
      // try {

      addQuestion(
        this.selected.user_id,
        this.questionTitle,
        this.questionContent,
        this.lawyerTagId,
        this.createTimedTimestamp()
      )
        .then(() => {
          this.successMessage('发送成功')
          this.$emit('success')
        })
        .finally(() => {
          this.state.isBtnLoading = false
        })
      // }
      // catch (e) {
      //   this.errorMessage(e.message)
      //   this.state.isBtnLoading = false
      // }
    },
    validTimedParams() {
      if (this.hour.length === 0 || this.minute.length === 0 || this.date.length === 0) {
        throw new Error('请填写正确的定时时间')
      }
    },
    createTimedTimestamp() {
      if (this.state.isTimed === false) {
        return 0
      }

      this.validTimedParams()
      const dateData = this.date.replace(/-/g, '/') + ' ' + this.hour + ':' + this.minute + ':00'
      return Math.round(new Date(dateData) / 1000)
    },
    errorMessage(message) {
      this.$q.notify({
        type: 'negative',
        message: message,
        position: 'top',
      })
    },
    successMessage(message) {
      this.$q.notify({
        type: 'positive',
        message: message,
        position: 'top',
      })
    },
    overTodayDate(date) {
      const dateObject = new Date()
      const today = new Date(
        `${dateObject.getFullYear()}/${dateObject.getMonth() + 1}/${dateObject.getDate()} 00:00:00`
      )
      return new Date(date).getTime() >= today.getTime()
    },
  },
}
</script>

<style lang="less" scoped>
.question-add-contain {
  height: 750px;
  width: 600px;

  &-header {
    display: flex;
    padding: 20px 24px;
  }

  &-table {
    margin-bottom: 16px;
  }
}

.send-container {
  padding: 16px;
}

.add-question {
  background: #eff1f5;
  border-radius: 4px;
  padding: 12px 16px;

  &-title {
    width: 100%;

    input {
      width: 100%;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #787e8d;
      opacity: 1;
      border: none;
      background: #eff1f5;

      &:focus {
        outline: none;
      }
    }
  }

  &-textarea {
    width: 100%;
    height: 100px;
    background: #eff1f5;
    border: none;

    &:focus {
      outline: none;
    }
  }

  &-year {
    width: 105px;
    height: 28px;
    background: #d5dbe5;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-hour {
    width: 48px;
    height: 28px;
    background: #d5dbe5;
    opacity: 1;
    border-radius: 4px;
    font-size: 12px;
    font-family: PingFang SC;

    input {
      width: 24px;
      border: none;
      background: #d5dbe5;

      &:focus {
        outline: none;
      }
    }
  }

  &-minute {
    width: 48px;
    height: 28px;
    background: #d5dbe5;
    opacity: 1;
    border-radius: 4px;
    font-size: 12px;
    font-family: PingFang SC;

    input {
      width: 24px;
      border: none;
      background: #d5dbe5;

      &:focus {
        outline: none;
      }
    }
  }

  &-bottom {
    display: flex;
    justify-content: space-between;

    &-prefix {
      display: flex;
      align-items: center;
    }
  }
}

.hr-color {
  background: #d2d6de;
  margin: 6px 0;
}
</style>