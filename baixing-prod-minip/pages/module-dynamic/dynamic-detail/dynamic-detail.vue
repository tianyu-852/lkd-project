<template>
  <view :style="{ paddingBottom: sysSafeAreaHeight + 45 + 30 + 10 + 'px' }">
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="问答详情" title-color="#333">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#333" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>
    <!-- #endif -->

    <!-- 内容模块 -->
    <view class="detail-module">
      <view class="detail-header">
        <view class="user-avatar">
          <u-lazy-load img-mode="aspectFill" height="80" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="dynamicDetail.avatar" />
        </view>
        <view class="user-info-wrap">
          <view class="user-info">
            <text class="user-name">{{ dynamicDetail.nickname }}</text>
            <view class="owner-tag">楼主</view>
          </view>
          <view class="date-info">
            <text class="time-name">{{ dynamicDetail.created_at }}</text>
            <text v-if="dynamicDetail.city">·</text>
            <text class="time-name">{{ dynamicDetail.city }}</text>
          </view>
        </view>
      </view>

      <view class="detail-content">
        <text v-if="dynamicDetail.lawyer_tag" class="detail-tag">#{{ dynamicDetail.lawyer_tag }}</text>
        <text>{{ dynamicDetail.content }}</text>
      </view>

      <view v-if="dynamicDetail.question_images && dynamicDetail.question_images.length" class="detail-images">
        <view class="detail-image" v-for="(iItem, iIndex) in dynamicDetail.question_images" :key="iIndex" @click.stop="$commonUtil.previewImg(dynamicDetail.question_images, iItem)">
          <u-lazy-load img-mode="aspectFill" height="208" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="iItem" />
        </view>
      </view>

      <view class="division-hor" />

      <view class="phone-zixun-wrap" @click="openFastPubPhonePopup">
        <image class="phone-zixun-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023310-1678414666532-STr9dz.png" />
        <view class="phone-zixun-info">
          <view class="zixun-info-title">免费电话咨询</view>
          <view class="zixun-info-desc">优选律师、主动回电、专业解答</view>
        </view>
        <text>立即咨询</text>
        <u-icon name="arrow-right" color="#0085FF" size="20" :custom-style="{ paddingLeft: '4rpx;' }" />
      </view>
    </view>

    <view class="division-line" />

    <!-- 广告位 -->
    <template v-if="detailAdvertSeat.length">
      <view class="advert-module">
        <view class="advert-header">
          <image class="advert-header-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023328-1679992708152-666Cj8.png" />
          <view>律师推荐</view>
        </view>
        <scroll-view class="scroll-x recommend-scroll-x" scroll-x enhanced :show-scrollbar="false" :scroll-into-view="scrollXIntoViewId" lower-threshold="10">
          <view v-for="(rItem, rIndex) in detailAdvertSeat" :key="rIndex" class="scroll-x-item">
            <view class="recommend-item-wrap" @click="navToLawyerDetail(rItem.user_info.user_id)">
              <view class="lawyer-avatar">
                <u-lazy-load img-mode="aspectFill" height="120" border-radius="20" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="rItem.user_info.avatar" />
              </view>
              <view class="lawyer-nickname">
                <span>{{ rItem.user_info.nickname }}</span>
                <view v-if="rItem.user_info.is_guarantee" class="youxuan-tag">优</view>
              </view>
              <view v-if="userId" class="lawyer-loc">距您{{ rItem.user_info.location_distance }}km</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="division-line" />
    </template>

    <!-- 评论模块 -->
    <view class="comment-module">
      <view class="comment-title">全部回答</view>

      <view class="comment-wrap">
        <view v-for="(cItem, cIndex) in commentList" :key="cIndex" class="comment-item">
          <template>
            <view class="comment-left" @click="navToUserDetail(cItem.type, cItem.user_id)">
              <view class="user-avatar">
                <u-lazy-load img-mode="aspectFill" height="80" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="cItem.avatar" />
              </view>
            </view>
            <view class="comment-right">
              <view class="user-name-wrap">
                <text class="user-name">{{ cItem.nickname }}</text>
                <!-- <view v-if="cItem.is_optimal_enjoy" class="owner-tag" style="color: #FE5F48; border-color: #FE5F48; margin-right: 8rpx;">优选</view> -->
                <view v-if="sCItem.is_questioner" class="owner-tag">楼主</view>
              </view>
              <view class="user-addr">{{ cItem.lawyer_office }}</view>
              <view v-if="cItem.mode === 0" class="comment-content">{{ cItem.question_comment }}</view>
              <voicePlay v-else :url="cItem.recording_file" :time="cItem.recording_duration" />
              <view class="comment-footer">
                <view class="time-wrap">
                  <text>{{ cItem.created_at }}</text>
                  <text v-if="cItem.city">·{{ cItem.city }}</text>
                </view>
                <view class="like-wrap">
                  <view class="icon-comment" @click="openReplyCommentInput(cItem)">回复</view>
                  <view class="icon-like" @click="postCommentLike(cItem)">
                    <image v-if="cItem.is_like" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFill" src="@/static/common/icon-like.png" />
                    <image v-else style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFill" src="@/static/common/icon-unlike.png" />
                    <text>{{ cItem.like_number }}</text>
                  </view>
                </view>
              </view>
              <!-- 子评论 -->
              <view v-if="cItem.comments.length" class="subComment-wrap">
                <view v-for="(sCItem, sCIndex) in cItem.comments" :key="sCIndex" class="subComment-item">
                  <template v-if="sCItem.mode === 0">
                    <view class="subComment-left" @click="navToUserDetail(sCItem.type, sCItem.user_id)">
                      <view class="user-avatar">
                        <u-lazy-load img-mode="aspectFill" height="50" border-radius="25" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="sCItem.avatar" />
                      </view>
                    </view>
                    <view class="subComment-right">
                      <view class="user-name-wrap">
                        <text class="user-name">{{ sCItem.nickname }}</text>
                        <!-- <view v-if="sCItem.is_optimal_enjoy" class="owner-tag" style="color: #FE5F48; border-color: #FE5F48; margin-right: 8rpx;">优选</view> -->
                        <view v-if="sCItem.is_questioner" class="owner-tag">楼主</view>
                        <!-- 回复 -->
                        <template v-if="sCItem.reply_nickname">
                          <text style="margin: 0 8rpx;">回复</text>
                          <text>{{ sCItem.reply_nickname }}</text>
                        </template>
                      </view>
                      <view class="subComment-content">{{ sCItem.question_comment }}</view>
                      <view class="subComment-footer">
                        <view class="time-wrap">
                          <text>{{ sCItem.created_at }}</text>
                          <text v-if="sCItem.city">·{{ sCItem.city }}</text>
                        </view>
                        <view class="like-wrap">
                          <view class="icon-comment" @click="openReplyCommentInput(sCItem)">回复</view>
                          <view class="icon-like" @click="postCommentLike(sCItem)">
                            <image v-if="sCItem.is_like" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFill" src="@/static/common/icon-like.png" />
                            <image v-else style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFill" src="@/static/common/icon-unlike.png" />
                            <text>{{ sCItem.like_number }}</text>
                          </view>
                        </view>
                      </view>
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>

      <!-- 空数据 -->
      <view v-if="!commentList.length" class="empty-wrap">
        <image style="width: 400rpx; height: 400rpx;" mode="aspectFill" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" />
        <view class="empty-text">暂无评论</view>
      </view>
    </view>

    <!-- 底部评论区 -->
    <view class="footer-module" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view v-if="activeReplyCommentInfo" class="footer-reply-wrap">
        回复 {{ activeReplyCommentInfo.nickname }}：{{ activeReplyCommentInfo.question_comment }}
      </view>
      <view class="footer-inuput-wrap">
        <template v-if="!activeReplyCommentInfo">
          <image v-if="isShowRecordVoice" class="icon-record" mode="aspectFill" src="../static/icon-dyn-write.png" @click="isShowRecordVoice = false" />
          <image v-else class="icon-record" mode="aspectFill" src="../static/icon-dyn-record.png" @click="isShowRecordVoice = true" />
        </template>

        <view v-if="isShowRecordVoice" class="comment-recorder-wrap"><voice-record @recorder="onVoiceRecordEvt" /></view>
        <view v-else class="comment-input-wrap" :style="{ padding: phonePlatform === 'ios' ? '0 20rpx' : '20rpx' }">
          <textarea
            v-model="commentInput"
            class="comment-input"
            cursor-spacing="30"
            auto-height
            :focus="commentTextareaFocus"
            :maxlength="-1"
            placeholder="快来发表你的观点吧"
            placeholder-style="color: #999; font-size: 30rpx;"
            @blur="onCommentInputBlurEvt"
          />
        </view>
        <!-- 发送按钮 -->
        <view v-if="commentInput.trim()" class="send-btn" :style="{ background: commentInput.trim() ? '#0085FF' : '#ddd' }" @click="sendComment">发送</view>
        <template v-else>
          <image v-if="dynamicDetail.is_like" class="icon-record" mode="aspectFill" src="../static/icon-dyn-like.png" @click="postDynamicLike" />
          <image v-else class="icon-record" mode="aspectFill" src="../static/icon-dyn-unlike.png" @click="postDynamicLike" />
          <label for="shareBtnId">
            <image class="icon-record" style="margin-left: 16rpx;" mode="aspectFill" src="../static/icon-dyn-share.png" />
          </label>
        </template>
      </view>
    </view>

    <!-- 快速发布电话咨询 popup -->
    <fast-pubPhone-popup ref="fastPubPhonePopupRef" />

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />
  </view>
</template>

<script>
import voiceRecord from "../components/voice-record/voice-record.vue"
import { mapState, mapGetters } from 'vuex';
import { server } from "@/request.js"
import fileUtil from '@/common/utils/fileUtil';


export default {
  name: 'dynamicDetailPage',
  components: { voiceRecord },
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      phonePlatform: 'android', // 手机平台 ios、android

      dynamicId: '1040', // 动态 id
      dynamicDetail: {}, // 动态详情

      commentListIds: [], // 评论列表 ids
      commentPageSize: 8, // 评论一页数量
      commentTotalPage: 1, // 评论总页数
      commentCurPage: 1, // 评论当前页数
      commentList: [], // 动态评论列表
      commentTotal: 0, // 服务订单总数
      isNextCommentLoading: false, // 是否正在加载下一页评论

      isShowRecordVoice: false, // 是否显示录制声音
      recordVoiceFileInfo: null, // 录制声音的信息
      commentInput: '', // 动态评论内容
      commentTextareaFocus: false, // 评论输入框是否获取焦点
      activeReplyCommentInfo: null, // 选择激活回复评论的信息 

      detailAdvertSeat: [], // 头部广告位
    }
  },
  computed: {
    ...mapState(['appConfigInfo']),
    ...mapState('userModule', ['userInfo']),

    ...mapGetters([ 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    routeParam.dynamicId && (this.dynamicId = routeParam.dynamicId);

    this.getDynamicDetail()
    this._getCommentIds();
  },
  mounted() {
    // 系统信息
    const { platform } = uni.getSystemInfoSync();
    this.phonePlatform = platform;
  },
  onShareAppMessage() {
		let shareTitle = '公益法律咨询';
		const currentRoute = this.$commonUtil.getCurrentRoute();

		return {
			title: shareTitle,
			path: `${ currentRoute }?dynamicId=${ this.dynamicId }`,
			imageUrl: 'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/main-share.png'
		}
	},
  onReachBottom() {
    let { commentCurPage, commentTotalPage } = this;
    if (commentCurPage >= commentTotalPage) return;
    this._getCommentList(++this.commentCurPage);
  },
  methods: {
    /**
     * 动态详情
     */
    async getDynamicDetail() {
      if (!this.dynamicId) return;
      uni.showLoading({ title: '', mask: true });
      const param = { question_id: this.dynamicId };
      
      try {
        const { data: dynamicDetailData } = await this.$api.getDynamicDetailApi(param);
        this.dynamicDetail = dynamicDetailData;

        this._getDynamicDetailAdvertData(this.dynamicDetail.lawyer_tag_id)
      } catch(error) {
        console.log(error);
      }
    },
    /**
     * 获取动态详情 广告列表
     */
    async _getDynamicDetailAdvertData(lawyerTagId) {
      const param = { user_id: this.userId, lawyer_tag_id: lawyerTagId === 0 ? 19 : lawyerTagId };
      try {
        const { data: lawyerAdvertSeatData } = await this.$api.getLawyerAdvertSeatData(param);
        const advertSeatId = 404946901803421696; // 动态详情位置 id
        const lawyerAdvertSeat = lawyerAdvertSeatData.find(item => item.advertisement_position_id == advertSeatId);
        if (lawyerAdvertSeat && lawyerAdvertSeat.advertisement.length) {
          this.detailAdvertSeat = lawyerAdvertSeat.advertisement;
        }
      } catch (error) {
        console.log(error);
      }
    },
     /**
     * 获取一级评论 ids
     */
    async _getCommentIds() {
      if (!this.dynamicId) return;
      const { dynamicId } = this;

      try {
        const { data: commentListIdsData } = await this.$api.getDynamicCommentIdsApi({ question_id: dynamicId, question_comment_type: 0, order_type: 3 });
        this.commentListIds = commentListIdsData;

        this.commentTotalPage = Math.ceil(this.commentListIds.length / this.commentPageSize);
        this._getCommentList();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取评论列表
     */
    async _getCommentList(page = 1) {
      if (!this.dynamicId) return;
      if (this.isNextCommentLoading) return;
      this.isNextCommentLoading = true;
      const { dynamicId, commentListIds } = this;

      const commentStartIdx = (page - 1) * this.commentPageSize;
      const commentEndIdx = page * this.commentPageSize;

      const commentIds = commentListIds.slice(commentStartIdx, commentEndIdx);
      try {
        const { data: commentData } = await this.$api.getDynamicCommentListApi({ question_id: dynamicId, question_comment_ids: JSON.stringify(commentIds), is_sub_more: 1, is_more_from_all: 1 });
        console.log('页面：', page)
        
        if (page === 1) this.commentList = [];
        this.commentList.push(...commentData);
        this.isNextCommentLoading = false;
      } catch (error) {
        this.isNextCommentLoading = false;
        console.log(error);
      }
    },
    /**
     * 动态点赞/取消点赞
     */
    async postDynamicLike() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      if (!this.dynamicId) return;
      
      const dynamicId = this.dynamicId;
      const dynamicIsLiked = this.dynamicDetail.is_like;
      const param = { type: 3, source_id: dynamicId };
      uni.showLoading({ title: '', mask: true });
      
      try {
        // 取消点赞
        if (dynamicIsLiked) {
          await this.$api.postDynamicUnLikeApi(param);
          this.$u.toast('取消成功');
          this.dynamicDetail.is_like = 0;
        // 点赞
        } else {
          await this.$api.postDynamicLikeApi(param);
          this.$u.toast('点赞成功');
          this.dynamicDetail.is_like = 1;
        }
      } catch(error) {
        console.log(error);
      }
    },
    /**
     * 评论点赞/取消点赞
     */
    async postCommentLike(commentItem) {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      if (!this.dynamicId) return;
      
      const commentId = commentItem.question_comment_id;
      const commentIsLiked = commentItem.is_like;
      const param = { type: 0, source_id: commentId };
      uni.showLoading({ title: '', mask: true });
      
      try {
        // 取消点赞
        if (commentIsLiked) {
          await this.$api.postDynamicUnLikeApi(param);
          this.$u.toast('取消成功');
          this._getCommentList();
        // 点赞
        } else {
          await this.$api.postDynamicLikeApi(param);
          this.$u.toast('点赞成功');
          this._getCommentList();
        }
      } catch(error) {
        console.log(error);
      }
    },
    /**
     * 打开回复评论 input 
     */
    openReplyCommentInput(commentItem) {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      this.activeReplyCommentInfo = commentItem;
      this.commentTextareaFocus = true;
    },
    /**
     * 监听评论 input blur 事件
     */
    onCommentInputBlurEvt() {
      // this.activeReplyCommentInfo = null;
      this.commentTextareaFocus = false;
    },
    /**
     * 监听声音录制结束事件 | 发送语音评论
     */
    async onVoiceRecordEvt(fileValue) {
      const fileUrl = await fileUtil.uploadFile(fileValue.tempFilePath);

      fileValue.voiceFileUrl = fileUrl;
      this.recordVoiceFileInfo = fileValue
      this._postDynComment()
    },
    /**
     * 监听评论 input confirm 事件
     */
    sendComment() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      if (!this.dynamicId) return;
      if (!this.commentInput.trim()) return this.$u('请输入评论内容');

      if (this.activeReplyCommentInfo) {
        // 回复评论
        this._postReplyComment(this.activeReplyCommentInfo);
      } else {
        // 动态评论
        this._postDynComment();
      }
    },
    /**
     * 发送动态 一级评论
     */
    async _postDynComment() {
      const param = { question_id: this.dynamicId };
      // 录音评论
      if (this.recordVoiceFileInfo) {
        param.recording_file = this.recordVoiceFileInfo.voiceFileUrl;
        param.recording_duration = this.recordVoiceFileInfo.duration;
      // 文字评论
      } else {
        param.question_comment = this.commentInput.trim();
      }

      uni.showLoading({ title: '', mask: true });
      
      try {
        await this.$api.postDynamicCommentApi(param);
        this.commentInput = '';
        this.recordVoiceFileInfo = null;
        this.isShowRecordVoice = false;
        this.$u.toast('评论成功');
        this._getCommentIds();
      } catch(error) {
        console.log(error);
      }
    },
    /**
     * 发送回复评论
     */
    async _postReplyComment(comentInfo) {
      const param = { question_comment_id: comentInfo.question_comment_id, question_comment: this.commentInput.trim(), is_format_in_question_detail: 1, };
      uni.showLoading({ title: '', mask: true });
      
      try {
        await this.$api.postDynamicSubCommentApi(param);
        this.commentInput = '';
        this.activeReplyCommentInfo = null;
        this.$u.toast('回复成功');
        this._getCommentIds();
      } catch(error) {
        console.log(error);
      }
    },
    /**
     * 进入 用户/律师 详情页面
     */
    navToUserDetail(type, userId) {
      uni.navigateTo({ url: type == 0 ? `/my/client/heLookPage?id=${ userId }` : `/pagesV1/index/lawyerPage?id=${ userId }` });
    },
    /**
     * 打开快速发布电话咨询弹框
     */
    openFastPubPhonePopup() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      this.$refs.fastPubPhonePopupRef._openFastPubPhonePopup();
    },

    /**
     * 前往用户主页
     */
    navToLawyerDetail(userId) {
			uni.navigateTo({ url: `/pagesV1/index/lawyerPage?id=${ userId }` });
		},
  }
}
</script>

<style>
  page {
    background: #fff;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
