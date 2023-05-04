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
          <q-td key="question" :props="props" style="width: 350px">
            <div class="content-question">
              <text-with-row-button :text="props.row.title" :over-max="40" />
            </div>
          </q-td>
          <q-td key="created_at" :props="props">
            {{ props.row.created_at }}
          </q-td>
          <q-td key="view_number" :props="props">
            {{ props.row.view_number }}
          </q-td>
          <q-td key="comment_number" :props="props">
            {{ props.row.comment_number }}
          </q-td>
          <q-td key="like_number" :props="props">
            {{ props.row.like_number }}
          </q-td>
          <q-td key="hot_number" :props="props">
            {{ props.row.hot_number }}
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
import { getUserQuestionPage } from '@/api/user'
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
        { name: 'question', label: '帖子详情', align: 'center' },
        { name: 'created_at', label: '发帖时间', align: 'center' },
        { name: 'view_number', label: '浏览量', align: 'center' },
        { name: 'comment_number', label: '评论', align: 'center' },
        { name: 'like_number', label: '点赞', align: 'center' },
        { name: 'hot_number', label: '权重', align: 'center' },
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
      getUserQuestionPage(this.userId, page)
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