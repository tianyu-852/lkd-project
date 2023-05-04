<template>
  <div>
    <q-table
      class="content-question-table"
      :data="data"
      :columns="columns"
      :loading="state.isTableLoading"
      row-key="name"
      :pagination="pagination"
      :bordered="false"
      :hide-bottom="true"
      :card-container-style="{ border: 'none' }"
      separator="cell"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="question_content" :props="props" style="width: 350px">
            <div class="content-question">
              <text-with-row-button :text="props.row.question_content" :over-max="40" />
            </div>
          </q-td>
          <q-td key="question_comment" :props="props" style="width: 350px">
            <div class="content-question">
              <text-with-row-button :text="props.row.question_comment" :over-max="40" />
            </div>
          </q-td>
          <q-td key="created_at" :props="props">
            {{ props.row.created_at }}
          </q-td>

          <q-td key="action" :props="props">
            <a @click="goDetail(props.row.question_id)">跳转到帖子</a>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <q-pagination
      class="content-question-page"
      v-model="pagination.current"
      :max="pagination.last"
      :max-pages="15"
      :boundary-numbers="true"
      @input="(page) => getPage(page)"
    />
  </div>
</template>

<script>
import { getUserQuestionComment } from '@/api/user'
import TextWithRowButton from '@/components/Common/TextWithRowButton'

export default {
  name: 'UserQuestionTable',
  components: { TextWithRowButton },
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      pagination: {
        current: 1,
        last: 1,
        rowsPerPage: 8,
      },
      data: [],
      columns: [
        { name: 'question_content', label: '原帖', align: 'center' },
        // { name: 'images', label: '原帖图片', align: 'center' },
        { name: 'question_comment', label: '评论内容', align: 'center' },
        { name: 'created_at', label: '发帖时间', align: 'center' },
        { name: 'action', label: '跳转', align: 'center' },
      ],
      state: {
        isTableLoading: false,
      },
    }
  },
  created() {
    this.getPage(1)
  },
  methods: {
    goDetail(questionId) {
      this.$router.push({
        name: 'QuestionDetail',
        params: { questionId },
      })
    },
    getPage(page) {
      this.state.isTableLoading = true
      getUserQuestionComment(page, this.userId)
        .then(({ data }) => {
          this.pagination.last = data.last
          this.data = data.data
        })
        .finally(() => {
          this.state.isTableLoading = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
.content-question {
  padding: 20px 8px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;

  &-table {
    height: 100%;
    min-height: 200px;
    margin-bottom: 16px;
  }

  &-page {
    float: right;
    margin-right: 12px;
  }
}
</style>