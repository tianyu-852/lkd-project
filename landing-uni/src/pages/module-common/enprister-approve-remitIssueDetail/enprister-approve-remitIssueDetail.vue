<template>
	<view class="issue-module">
    <template v-if="issueType === 1">
      <view class="issue-title" style="margin-bottom: 28rpx;">无法搜索到分支行?</view>
      <view class="issue" style="margin-bottom: 20rpx; color: #333;">1. 搜索分支行，请采用模糊搜索</view>
      <view class="issue" style="margin-bottom: 20rpx;">搜索时，请搜索有代表性的关键词，例如“漳州”、“兴业银行”，去除“股份有限公司”、“市”、“县”字样;</view>
      <view class="issue" style="margin-bottom: 20rpx; color: #333;">2. 如仍搜索不到该分支行，请选择此地级市分行或总行/股份有限公司/股份有限公司营业部</view>
      <view class="issue" style="margin-bottom: 20rpx;">(1) 例如：“兴业银行股份有限公司漳州万达广场支行”搜不到，输入关键词“兴业银行漳州”，显示“兴业银行漳州分行营业部”，选择即可；</view>
      <view class="issue" style="margin-bottom: 20rpx;">(2)  针对于农村商业银行，在没有分行的情况下，搜索“股份有限公司”或“股份有限公司营业部”。例如，“江苏省盐城市响水县农村商业银行银达支行”，输入关键词“响水农村商业银行股份有限公司”，显示“江苏响水农村商业银行股份有限公司营业部”，选择即可；</view>
      <view class="issue" style="margin-bottom: 20rpx; color: #333;">3.客户对公开户行是“xx农村信用联合社</view>
      <view class="issue">部分地区“农村信用联合社”已改制为“农村商业银行”</view>
    </template>

    <template v-else-if="issueType === 2">
      <view class="issue-title" style="margin-bottom: 28rpx;">系统提示【打款失败】?</view>
      <view class="issue" style="margin-bottom: 20rpx; color: #333;">注意:</view>
      <view class="issue" style="margin-bottom: 20rpx;">针对个体工商户，如果用个人银行卡打款，需要在付款页面中选择【个人卡】，此时需要银行卡户名=营业执照上的负责人/法人/经营者姓名;</view>
      <view class="issue" style="margin-bottom: 20rpx;">如果用对公卡打款，需要在付款页面中选择【对公卡】，此时需要银行卡户名=公司名称</view>
      <view class="issue" style="margin-bottom: 20rpx; color: #333;">常见系统打款失败原因提示如下：</view>
      <view class="issue" style="margin-bottom: 20rpx;">-【E1013-账号、户名不符】：如选择对公银行卡打款，请先核实该银行卡户名是否为该公司名称(是否中英文括号);如选择个人银行卡打款请先核实该银行卡户名是否为营业执照上的负责人/法人/经营者姓名。</view>
      <view class="issue" style="margin-bottom: 20rpx;">-【E8001-账号不存在】：请核实卡号是否输入错误，修改正确后重新发起验证。</view>
      <view class="issue" style="margin-bottom: 20rpx;">-【E8001-账号解析失败】：请核实卡号是否输入错误，修改正确后重新发起验证。</view>
      <view class="issue" style="margin-bottom: 20rpx;">-【E8001-收款人账户状态不正常】：请咨询开户行，该银行卡账户状态是否可用。</view>
      <view class="issue">-【其他】：请联系开户行咨询该银行卡账户状态是否存在异常。</view>
    </template>

    <template v-if="issueType === 3">
      <view class="issue-title" style="margin-bottom: 28rpx;">系统提示【打款成功】，但一直未收到打款?</view>
      <view class="issue" style="margin-bottom: 20rpx;">- 系统已经把钱打给银行，但被你的开户行退回，系统还没有收到银行退票。需要你检查确认银行卡号和账户名是否出错;</view>
      <view class="issue" style="margin-bottom: 20rpx;">- 系统已经把钱打给银行，钱款到达你的开户行时，因为某些原因，你的开户行没有把钱打到你的账户也没有退回，即【挂账】。需要你致电开户行确认是否挂账，以及挂账原因;</view>
      <view class="issue">- 如果没有选择总行，请注意是否处于节假日，非总行打款节假日会延时到账。</view>
    </template>
    
    <template v-if="issueType === 4">
      <view class="issue-title" style="margin-bottom: 28rpx;">平台已打款，且无退票，但客户没收到打款？</view>
      <view class="issue" style="margin-bottom: 20rpx;">可能存在的原因是跨行转账账户被挂账了。</view>
      <view class="issue" style="margin-bottom: 20rpx;">- 挂帐就是钱已经从付款人账上扣除了，但还没有到达收款人的账上。</view>
      <view class="issue" style="margin-bottom: 20rpx;">- 有可能挂在付款行，也有可能已经从付款行划到收款行了，但还没有到达收款人账上。</view>
      <view class="issue" style="margin-bottom: 20rpx;">- 跨行挂帐就是钱已经从汇出行划走了，已经到了汇入行(不同行的)，但因为某些原因没有入账，停留在汇入行。</view>
      <view class="issue" style="margin-bottom: 20rpx; color: #333;">解决方法:</view>
      <view class="issue">看是什么原因没有入账，如果因为超时，就只能等下一个工作日入账；如果因为账号户名不符，或对方账号销户，就会打回汇出行，什么时候打回来取决于挂帐的那个银行；一般打回来时，会告诉汇出行是什么原因。</view>
    </template>

    <template v-if="issueType === 5">
      <view class="issue-title" style="margin-bottom: 28rpx;">系统与银行账户的括号不一致导致打款失败？</view>
      <view class="issue">公司名称带括号的，可能在开户时录入不规范，导致系统上的公司名称括号与银行账户或营业执照括号不一致，如系统为“今日头条(北京)有限公司"，银行账户或营业执照实际为“今日头条（北京）有限公司。该场景下平台向客户打款验证且括号为小写的，系统将建议以大写括号即中文括号打款，同时也可选择依旧以小写括号即英文括号打款。建议核实银行账户的括号是哪一种，信息可从银行开户许可证上判断。</view>
    </template>

    <view class="kefu-btn">
      仍未解决？前往<text style="color: #0085FF; margin-left: 6rpx;" @click="navToKefuPage">官方客服</text>
    </view>
	</view>
</template>

<script>
export default {
  name: 'EnpristerApproveRemitIssueDetail',
  data() {
    return {
      issueType: 1, // 问题类型
      platform: uni.getSystemInfoSync().platform,
    }
  },
  onLoad() {
    const { issueType } = this.$Route.query;
    this.issueType = issueType;

    console.log(uni.getSystemInfoSync())
  },
  methods: {
    /**
     * 进入客服聊天页面
     */
    navToKefuPage() {
      if(this.platform == 'ios') {
        prompt('onGotoServiceChat')
      } else {
        AppProxyClick.onGotoServiceChat();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
