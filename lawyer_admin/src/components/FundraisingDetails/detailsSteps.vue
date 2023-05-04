<template>
  <div>
    <a-steps v-model="currents" size="small" type="navigation" @change="changeCurrent">
      <a-step
        v-for="(i, key) in steplist"
        :key="i.title + key"
        :title="i.value"
        :status="i.status"
        :disabled="i.disabled"
        style="margin: 0 15px"
      >
        <img
          slot="icon"
          v-if="i.status === 'finish'"
          :src="require('@/assets/Fundraising/finish.png')"
          style="width: 16px; height: 16px; margin-bottom: 8px"
        />
        <img
          slot="icon"
          v-else-if="i.status === 'process'"
          :src="require('@/assets/Fundraising/time.png')"
          style="width: 16px; height: 16px; margin-bottom: 8px"
        />
        <img
          slot="icon"
          v-else-if="i.status === 'error'"
          :src="require('@/assets/Fundraising/error.png')"
          style="width: 16px; height: 16px; margin-bottom: 8px"
        />
        <img
          slot="icon"
          v-else
          :src="require('@/assets/Fundraising/wait.png')"
          style="width: 16px; height: 16px; margin-bottom: 8px"
        />
        {{ i.value }}
      </a-step>
    </a-steps>
  </div>
</template>
  <script>
export default {
  name: 'Index',
  components: {},
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      steplist: [
        {
          title: '第一步',
          value: '客服简述提交',
        },
        {
          title: '第二步',
          value: '案件审核',
        },
        {
          title: '第六步',
          value: '制作筹款发布内容',
        },
        {
          title: '第八步',
          value: '用户确认发布内容',
        },
        {
          title: '第十步',
          value: '筹款中',
        },
        {
          title: '第十一步',
          value: '签订合同',
        },
        {
          title: '第十二步',
          value: '确认律师信息',
        },
        {
          title: '第十三步',
          value: '案件进度',
        },
        {
          title: '第十四步',
          value: '结案',
        },
      ],
      currents: null,
    }
  },
  computed: {
    selectStep() {
      return this.$store.state.step.selectStep
    },
  },
  watch: {
    immediate: true,
    selectStep() {
      this.changeList(this.$store.state.step.currentStep)
      this.currents = this.$store.state.step.selectStep
    },
    type(value) {
      this.type = value
      this.changeList(this.$store.state.step.currentStep)
    },
  },
  created() {},
  mounted() {
    this.changeList(this.$store.state.step.currentStep)
    this.currents = this.$store.state.step.selectStep
  },
  methods: {
    changeList(e) {
      const type = this.type
      if (type === 1) {
        for (let i = 0; i < this.steplist.length; i++) {
          if (i === 0) {
            this.steplist[i].status = 'finish'
            this.steplist[i].disabled = false
          } else if (i === 1) {
            this.steplist[i].status = 'error'
            this.steplist[i].value = '审核被驳回'
            this.steplist[i].disabled = true
          } else {
            this.steplist[i].status = 'wait'
            this.steplist[i].disabled = true
          }
        }
      } else {
        for (let i = 0; i < this.steplist.length; i++) {
          if (i < e) {
            this.steplist[i].status = 'finish'
            this.steplist[i].disabled = false
          } else if (i === e && type === 0) {
            this.steplist[i].status = 'process'
            this.steplist[i].disabled = false
          } else if (i === e && type === 1) {
            this.steplist[i].status = 'error'
            this.steplist[i].value = '审核被驳回'
            this.steplist[i].disabled = false
          } else {
            this.steplist[i].status = 'wait'
            this.steplist[i].disabled = true
          }
        }
      }
    },
    changeCurrent(current) {
      this.currents = current
      this.$store.commit('chooseSteps', current)
    },
  },
}
</script>
 <style scoped lang="less">
/deep/.ant-steps-small .ant-steps-item-title {
  font-size: 1px;
}
</style>
