<template>
  <div>
    <a-steps v-show="is_refuse === 0" v-model="currents" size="small" type="navigation" @change="changeCurrent">
      <a-step
        v-for="(i, key) in steplist"
        :key="i.title + key"
        :title="i.value"
        :status="i.status"
        :disabled="i.disabled"
        style="margin: 0 15px"
        v-show="key !== 2"
      >
        <!-- 修改图标和显示内容冲突 -->
        <img
          slot="icon"
          v-if="i.status === 'finish'"
          :src="imagesUrl[0].url"
          style="width: 16px; height: 16px; margin-bottom: 8px"
        />
        <img
          slot="icon"
          v-else-if="i.status === 'process'"
          :src="imagesUrl[1].url"
          style="width: 16px; height: 16px; margin-bottom: 8px"
        />
        <img
          slot="icon"
          v-else-if="i.status === 'error'"
          :src="imagesUrl[2].url"
          style="width: 16px; height: 16px; margin-bottom: 8px"
        />
        <img slot="icon" v-else :src="imagesUrl[2].url" style="width: 16px; height: 16px; margin-bottom: 8px" />
        {{ i.value }}
      </a-step>
    </a-steps>
    <a-steps v-show="is_refuse === 1" v-model="currents" size="small" type="navigation" @change="changeCurrent">
      <a-step>
        <img slot="icon" :src="imagesUrl[0].url" style="width: 16px; height: 16px; margin-bottom: 8px" />
        <!-- <img
          slot="icon"
          :src="imagesUrl[1].url"
          style="width: 16px; height: 16px; margin-bottom: 8px"
        /> -->
        <span>发起</span>
      </a-step>
      <a-step>
        <img slot="icon" :src="imagesUrl[2].url" style="width: 16px; height: 16px; margin-bottom: 8px" />
        <span>审核被驳回</span>
      </a-step>
    </a-steps>
  </div>
</template>
  <script>
export default {
  name: 'Index',
  components: {},
  props: {
    // titleList: {
    //   type: Array,
    //   default: () => {
    //     return []
    //   },
    // },
    // current: {
    //   type: Number,
    //   default: 1,
    // },
    // uploadcurrent: {
    //   type: Number,
    //   default: 1,
    // },
    // fundraise_money: {
    //   type: String,
    //   default: '0',
    // },
    // target_money: {
    //   type: String,
    //   default: '0',
    // },
  },
  data() {
    return {
      is_refuse: 0,
      imagesUrl: [
        {
          url: require('@/assets/Fundraising/finish.png'),
        },
        {
          url: require('@/assets/Fundraising/time.png'),
        },
        {
          url: require('@/assets/Fundraising/wait.png'),
        },
      ],
      steplist: [
        {
          title: '第一步',
          value: '发起',
        },
        {
          title: '第二步',
          value: '提交审核',
        },
        {
          title: '隐藏',
          value: '联系当事人',
        },
        {
          title: '第三步',
          value: '匹配律师',
        },
        {
          title: '第四步',
          value: '线下约谈',
        },
        {
          title: '第五步',
          value: '确认委托律师',
        },

        {
          title: '第六步',
          value: '上传委托协议',
        },
        {
          title: '第七步',
          value: '收集资料',
        },
        {
          title: '第八步',
          value: '发起众筹',
        },
        {
          title: '第九步',
          value: '筹款进度',
        },
        {
          title: '第十步',
          value: '上传发票',
        },
        {
          title: '第十一步',
          value: '案件进度',
        },
        {
          title: '第十二步',
          value: '订单已结束',
        },
        //    {
        //   title: '第一步',
        //   value: '客服简述提交',
        // },
        // {
        //   title: '第二步',
        //   value: '案件审核',
        // },
        // {
        //   title: '第三步',
        //   value: '运营提交素材清单',
        // },
        // {
        //   title: '第四步',
        //   value: '客服上传素材',
        // },
        // {
        //   title: '第五步',
        //   value: '运营确定素材材料',
        // },

        // {
        //   title: '第六步',
        //   value: '制作筹款发布内容',
        // },
        // {
        //   title: '第七步',
        //   value: '发布内容审核',
        // },
        // {
        //   title: '第八步',
        //   value: '用户确认发布内容',
        // },
        // {
        //   title: '第九步',
        //   value: '筹款发布审核',
        // },
        // {
        //   title: '第十步',
        //   value: '筹款中',
        // },
        // {
        //   title: '第十一步',
        //   value: '签订合同',
        // },
        // {
        //   title: '第十二步',
        //   value: '确认律师信息',
        // },
        // {
        //   title: '第十三步',
        //   value: '案件进度',
        // },
        // {
        //   title: '第十四步',
        //   value: '结案',
        // },
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
      // console.log('vuex', this.$store.state.step.selectStep, this.$store.state.step.currentStep)
      this.changeList(this.$store.state.step.currentStep)
      this.currents = this.$store.state.step.selectStep
    },
    // current(value) {
    //   this.current = value
    // console.log(999, this.current)
    // this.changeList(this.current)
    // this.currents = this.current
    // },
    // uploadcurrent(value) {
    // this.currents = value
    //   console.log(this.currents)
    //  console.log('vuex', this.$store.state.step.selectStep, this.$store.state.step.currentStep)
    // },
  },
  created() {
    this.is_refuse = JSON.parse(sessionStorage.getItem('userData')).is_refuse
    // this.currents = this.$store.state.step.selectStep
    // this.current = this.$store.state.step.currentStep
    // console.log('vuex1', this.$store.state.step.selectStep, this.$store.state.step.currentStep)
    this.changeList(this.$store.state.step.currentStep)
    this.currents = this.$store.state.step.selectStep
    // this.changeList(this.current)
  },
  mounted() {},
  methods: {
    changeList(e) {
      const type = 0
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
      // console.log(this.steplist)
    },
    changeCurrent(current) {
      this.currents = current
      //   this.$emit('changeCurrent', this.currents)
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
