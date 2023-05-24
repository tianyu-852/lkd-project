<template>
	<view class="main">
    <!-- <view class="content">因在线法律服务的特殊性，提升用户信任度，在线接单需为平台认证的优选律师</view>
    <view class="content" style="margin-bottom: 50rpx;">适用温州律快答网络科技有限公司旗下平台，包含但不限于百姓律师、律师推见、企业律云</view>
    <view class="content">规则说明</view>
    <view class="content">1.为及时了解及监督服务质量、解决服务纠纷平台有权对通话进行录音及查询</view>
    <view class="content">2.参与本服务的，将视为您已确认并同意交易价格、形式及服务规范等内容，并遵守平台相关规则。平台有权对前述内容进行调整，具体以届时发布的通知为准。在符合法律法规规定的前提下，平台对本规则享有最终解释权</view>
    <view class="content">3.用户与平台认证律师建立联系，后续产生任何法律服务交易(不限于平台内或线下支付)经司法局、律协认定违规并已注明赔付金额，平台将从律师缴纳保证金中扣除，直接进行赔付，赔付上限不超过该服务律师于本平台缴纳的保证金金额</view>

    <view class="content" style="margin-bottom: 10rpx;">4.服务价格</view>
    <view class="content" style="margin-bottom: 0;">电话咨询<text style="color: #FE5F48;">20</text>元/单</view>
    <view class="content" style="margin-bottom: 0;">合同审查<text style="color: #FE5F48;">100</text>元/单</view>
    <view class="content" style="margin-bottom: 0;">合同起草<text style="color: #FE5F48;">200</text>元/单</view>
    <view class="content" style="margin-bottom: 0;">文书审查<text style="color: #FE5F48;">100</text>元/单</view>
    <view class="content" style="margin-bottom: 0;">文书起草<text style="color: #FE5F48;">200</text>元/单</view>
    <view class="content" style="margin-bottom: 0;">(平台会按市场行情进行不定期调整价格和规格，以最终展示价格为准)</view>
    <view class="content">由用户下单时完成支付,款项将先由平台托管</view>

    <view class="content" style="margin-bottom: 10rpx;">5.服务价格</view>
    <view class="content" style="margin-bottom: 0;">(1) 接到订单后，律师须在3分钟内电话联系用户，否则订单将自动取消，重新发布</view>
    <view class="content">(2) 如合同审查、合同起草、文书起草等后期需修改的服务，将在交付7天后自动结束该订单</view>
    <view class="content">6.如您还有其他任何疑问，可以联系律师管家或者拔打热线<text style="color: #0085FF;">400-968-8895</text>，我们会有专业客服为您服务</view>

    <image class="law-manager-avatar" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022824-1661333705312-keT0jx.png" @click="navToKefuPage" />

    <view v-if="!userInfo.optimal_enjoy_end_time" class="auth-btn" @click="navToLawyerAuthPage">认证优选律师</view> -->
	</view>
</template>

<script>
import * as apis from "@/apis/apis.js"

export default {
  name: 'GrabOrderExplain',
  data() {
    return {
      sourceApp: 3, // source-app
      platform: uni.getSystemInfoSync().platform,
      userInfo: {}, // 用户信息
    }
  },
  onLoad(query) {
    if(this.platform == 'ios') {
      // 设置用户客户端 soure-app
      this.sourceApp = JSON.parse(prompt('onGetSourceAppId', ''));
      // 缓存用户 token
      uni.setStorage({ key: "token", data: prompt('onGetToken') });
    } else {
      // 设置用户客户端 soure-app
      this.sourceApp = JSON.parse(AppProxyClick.onGetSourceAppId());
      // 缓存用户 token
      uni.setStorage({ key: "token", data: AppProxyClick.onGetToken() });
    }
    
    this._getUserInfo();
  },
  methods: {
    /**
     * 获取用户信息
     */
    async _getUserInfo() {
      const res = await apis.getUser({}, { 'X-Source-App': this.sourceApp });
      this.userInfo = JSON.parse(JSON.stringify(res.data.data));
    },
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
    /**
     * 进入律师认证页面
     */
    navToLawyerAuthPage() {
      if (this.platform == 'ios') {
        prompt('onGotoBuyLawyerVip')
      } else {
        AppProxyClick.onGotoBuyLawyerVip();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
