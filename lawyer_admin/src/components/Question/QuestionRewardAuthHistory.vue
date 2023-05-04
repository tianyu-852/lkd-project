<template>
  <q-card class="history">
    <div class="history-top center">
      <div class="history-top-item"></div>
      <span class="history-top-item">历史审核记录</span>
      <div class="history-top-item">
        <img class="history-top-img clickable" :src="require('@/assets/icons/gb_icon.png')" @click="$emit('close')" />
      </div>
    </div>

    <div class="history-content">
      <a-skeleton :loading="state.isLoading" active :paragraph="{ rows: 8 }" />

      <div class="history-content-item" v-for="(item, index) in history" :key="index">
        <div>
          <span class="history-content-item-title" :class="{ red: !isSuccess(item), green: isSuccess(item) }">{{
            renderTitle(item)
          }}</span>
          <span class="gray">{{ item.created_at }}</span>
        </div>

        <div class="history-content-item-content" v-if="!isSuccess(item)">
          <p>{{ item.fail_reason }}</p>
        </div>

        <div class="hr"></div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { getCheckRewardQuestionHistory } from '@/api/question'

export default {
  name: 'QuestionRewardAuthHistory',
  props: {
    questionId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      history: [],
      state: {
        isLoading: false,
      },
    }
  },
  watch: {
    questionId: {
      immediate: true,
      handler: function (questionId) {
        if (questionId === 0) {
          return
        }

        this.state.isLoading = true
        getCheckRewardQuestionHistory(questionId)
          .then(({ data }) => {
            this.history = data
          })
          .finally(() => {
            this.state.isLoading = false
          })
      },
    },
  },

  methods: {
    renderTitle(historyItem) {
      if (this.isSuccess(historyItem)) {
        return '通过审核'
      } else {
        return '审核被驳回'
      }
    },
    isSuccess(historyItem) {
      return historyItem.check_status === 2
    },
  },
}
</script>

<style lang="less" scoped>
.history {
  width: 600px;
  height: 400px;

  &-top {
    height: 50px;
    background: #ebeef5;
    font-size: 16px;
    font-weight: bold;

    &-item {
      flex: 1;
    }

    span {
      text-align: center;
    }

    &-img {
      float: right;
      margin-right: 24px;
    }
  }

  &-content {
    padding: 0 12px;

    &-item {
      width: 100%;
      margin: 12px 0;

      &-content {
        margin-top: 12px;
        height: 100%;
        background: #f7f8fa;
        padding: 16px;

        &-title {
          font-size: 14px;
          font-weight: bold;
          color: #222222;
        }
      }

      &-title {
        margin-right: 12px;
      }
    }
  }
}
</style>