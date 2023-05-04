<template>
  <common-dialog mode="title" :title="`${nickname}的评价`" class="evaluate-main">
    <div class="evaluate">{{ evaluate }}</div>

    <div class="hr"></div>

    <div class="evaluate-bottom">
      <div>
        <span>服务评价：</span>
        <span class="evaluate-bottom-score">{{ toEvaluateScoreChinese() }}</span>
      </div>
      <div class="evaluate-bottom-reasons">
        <div
          class="evaluate-bottom-reasons-item margin-left-16"
          v-for="reason in evaluateReasons"
          :key="reason"
        >
          {{ reason }}
        </div>
      </div>
    </div>
  </common-dialog>
</template>

<script>
import CommonDialog from "@/components/Dialog/CommonDialog"

export default {
  name: "OrderEvaluateDialog",
  components: {CommonDialog},
  props: {
    nickname: {
      type: String,
      default: '',
    },
    evaluate: {
      type: String,
      default: ''
    },
    evaluateScore: {
      type: Number,
      default: 0,
    },
    evaluateReasons: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    toEvaluateScoreChinese() {
      switch (this.evaluateScore) {
        case 1:
          return '满意'
        case 2:
          return '一般'
        case 3:
          return '不满意'
        default :
          return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.evaluate-main {
  max-width: 1000px;
}

.evaluate {
  padding: 24px 40px;
  font-size: 16px;
  font-weight: 500;
  color: #787E8D;
  font-family: PingFang SC;
  min-height: 140px;

  &-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 28px;
    padding: 0px 40px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;

    &-score {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 34px;
      color: #222222;
      margin-right: 100px;
    }

    &-reasons {
      display: flex;
      align-items: center;

      &-item {
        padding: 3px 3px;
        width: 88px;
        height: 27px;
        background: #EBEEF5;
        border-radius: 4px;
        font-family: PingFang SC;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        color: #787E8D;
      }
    }
  }
}
</style>