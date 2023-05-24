<template>
	<view class="issue-module">
    <view v-for="(iItem, iIndex) in issueList" :key="iIndex" class="issue-item" @click="navToIssueDetail(iItem.type)">
      <text class="title">{{ iItem.title }}</text>
      <u-icon name="arrow-right" color="#999" />
    </view>
	</view>
</template>

<script>
export default {
  name: 'EnpristerApproveRemitIssue',
  data() {
    return {
      issueList: [
        { title: '无法搜素到分支行', type: 1 },
        { title: '系统提示「打款失败」？', type: 2 },
        { title: '系统提示「打款成功」，但一直未收到打款？', type: 3 },
        { title: '平台已打款，且无退票，但客户没收到打款？', type: 4 },
        { title: '系统与银行账户的括号不一致导致打款失败？', type: 5 },
      ]
    }
  },
  onLoad() {
  },
  methods: {
    /**
     * 导航去问题详情
     */
    navToIssueDetail(issueType) {
      this.$Router.push({ name: 'enpristerApproveRemitIssueDetail', params: { issueType } });
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
