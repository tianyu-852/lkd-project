<template>
	<view class="flex-column" :style="{ paddingBottom: sysSafeAreaHeight + 50 + 5 + 'px' }">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar :is-back="false" :border-bottom="false" :background="{background:'#F9F9FB'}" title="推荐律师" title-size="36" title-color="#14284A" title-bold>
			<view class="left32 widthAll">
				<view class="blueBtn2" @click="getLawyerList" v-if="token">换一批</view>
			</view>
		</u-navbar>
		<!-- #endif -->
		
		<!-- #ifndef MP-KUAISHOU -->
		<view class="lawyerList" v-if="token">
			<scroll-view scroll-x style="height: 211rpx;width: 100vw;" class="flex-row">
				<view class="flex-row" style="flex-wrap: nowrap;">
					<view style="width: 32rpx;height: 211rpx;flex-shrink: 0;"></view>
					<view class="lawyerItem center flex-column" v-for="(item, index) in lawyerList" :key="index" @click="toLawyerPage(item.user_id)">
						<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
						<text class="name line1">{{item.nickname}}</text>
						<image v-if="item.is_guarantee" class="guarantee" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_lawyer_vip.png"></image>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- #endif -->

		<view class="" v-if="token">
			<customerBox ref="customer"></customerBox>
		</view>

		<view class="tab flex hcenter backfff" v-if="token">
			<view v-for="(item,index) in tab.list" :key="index" :class="['tab-item',tab.index==index?'on':'']" @click="onTab(index)">{{item}}</view>
		</view>

		<view class="null center" v-if="!token" @click="toLogin()">
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" class="width400" mode="widthFix"></image>
			<view class="color6E7695 bottom32">登录后即可查看该内容</view>
			<view class="btn">立即登录</view>
		</view>
		
		<view class="flex u-flex-1" style="height: 0;" v-if="token">
			<scroll-view class="listBox" scroll-y style="height: 100%;padding-top: 0;" refresher-enabled :refresher-triggered="scrollPullStatus" @refresherrefresh="startScroll">
				<!-- #ifndef MP-KUAISHOU -->
				<view class="" v-show="!tab.index">
					<view v-for="(item,index) in im.list" :key="item.actionId" class="item" @longpress="delItem(index)" v-if="item.user&&customer.user_id != item.targetId">
						<u-swipe-action :show="item.show" :disabled="disabled" :index="index" :options="im.options" @click.stop="delList" class="itemBox" btn-width="148">
							<view class="flex-row" @click="toImDetails(item.user?item.user.user_id:item.targetId,item.user?item.user.nickname:item.targetId)">
								<image :src="item.user.avatar?item.user.avatar:'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_noavatar.png'" mode="aspectFill" class="photo"></image>
								<view class="left20 u-flex-1 item-text">
									<view class="flex hcenter between bottom8 martop4">
										<view class="name flex hcenter flex1">
											<text>{{item.user.nickname?item.user.nickname:item.targetId}}</text>
											<view class="tag left12" v-if="item.user.is_official">官方</view>
										</view>
										<view class="date">{{item.lastDate}}</view>
									</view>
									<view class="flex hcenter u-flex-nowrap">
										<view class="content line1">
											{{item.latestMessage.messageType=='RC:ImgMsg'?"[图片]" :item.latestMessage.messageType=='RC:HQVCMsg'?'[语音]':item.latestMessage.content.content}}
										</view>
										<view class="flex flexcenter" v-if="item.unreadMessageCount">
											<view class="unreadMessageCount flex flexcenter hcenter">
												{{item.unreadMessageCount<=99?item.unreadMessageCount:'99+'}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</u-swipe-action>
					</view>
					<view class="center null" v-if="!im.list.length">
						<image src="/static/images/kym_qsy_image.png"></image>
						<view class="text">暂无数据</view>
					</view>
				</view>
				<view class=""  v-show="tab.index">
					<view v-for="(item,index) in follow.list" :key="index">
						<view class="martop20" v-if="item.type">
							<lawyer-list-item :item="item" :index="index" isAtt="true" @edit="change"></lawyer-list-item> 
						</view>
						<view class="larwerItem marlr32 backfff" v-else>
							<view class="flex between top hcenter">
								<view class="flex hcenter">
									<image :src="item.avatar" mode="aspectFill" class="photo"
										@click="toUserPage(item.user_id,item.type)"></image>
									<view class="left20">
										<view class="flex hcenter">
											<view class="name">{{item.nickname}}</view>
										</view>
									</view>
								</view>
								<view :class="['attention','flex','flexcenter','hcenter',item.is_follow?'':'noattention']"
									@click="setFollow(item,index)">{{item.is_follow?'已关注':'关注'}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- #endif -->
				
				<!-- #ifdef MP-KUAISHOU -->
				<view id="mySwiper0" style="height:auto">
					<view v-for="(item,index) in CList" :key="index" class="item1">
						<view class="header flex hcenter">
							<image :src="item.from_avatar" class="photo"/>
							<view>
									<view class="comment">{{item.from_nickname}}回复了您的评论</view>
									<text class="time">{{item.created_at}}</text>
							</view>
						</view>
						<view class="content">{{item.content}}</view>
						<view class="sl flex between hcenter" @click="toQuestion(item.question_id)">
							<view class="text line1">原贴：{{item.question_content_simple}}</view>
							<image src="/static/images/right.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<view class="center null" v-if="!CList.length">
					<image src="/static/images/kym_qsy_image.png"></image>
					<view class="text">暂无数据</view>
				</view>
				<!-- #endif -->
				
			</scroll-view>
		</view>
		
		<popNotice ></popNotice>

		<tab-bar :selected="3" />
	</view>
</template>

<script>
	import { getUsers, getMyData, getGroupsList, getMyReply, getLocation, getFollowList, getAttention, getUserReplyhighLawyers } from "@/api/apis.js";
	import customerBox from "@/components/customerBox.vue"
	import popNotice from "@/components/popNotice.vue"
	import lawyerListItem from "@/components/lawyerListItem.vue"
	import { mapGetters } from 'vuex';
	
	// #ifndef MP-KUAISHOU
	import { imF, imKey, RongIMLib, } from "@/im/im.js";
	let im = imKey();
	// #endif
	
	export default {
		components: { customerBox, lawyerListItem, popNotice },
		data() {
			return {
				token:null,
				lawyerList:[],
				// #ifndef MP-TOUTIAO || MP-KUAISHOU
				disabled:false,
				// #endif
				// #ifdef MP-TOUTIAO || MP-KUAISHOU
				disabled:true,
				// #endif
				// unanswered:[],
				CList:[],
				tab:{
					list: ['消息列表','我的关注'],
					index: 0
				},
				follow:{
					list:[],
					index:0,
					page:1
				},
				page:1,
				customer:null,
				type:uni.getStorageSync('type'),
				scrollPullStatus:false,
				_scrollPullStatus:false,
				im: {
					status: false,
					list: [],
					options: [{
						text: '删除',
						style: {
							backgroundColor: ' #FF4040'
						}
					}],
					imlist: []
				}
			}
		},
		computed: {
			...mapGetters([ 'sysSafeAreaHeight' ]),

			getNewInfo() {
				return this.$store.state.score.info
			}
		},
		watch: {
			getNewInfo() {
				this.getList()
			}
		},
		methods: {
			// #ifdef MP-KUAISHOU
			getMyReply() { //获取粉丝列表
			    getMyReply({
			        page: this.page
			    }).then(res => {
						if(res.data.code) return
						let data = this.page==1?res.data.data.data:this.CList.concat(res.data.data.data);
						// this.$set(this.CList, 0, data);
						this.CList=data
						this.page ++
			    })
			},
			// #endif
			getFollowList() { //获取关注列表
				getFollowList({
					page: this.follow.page
				}).then(res => {
					let data = this.follow.page==1?res.data.data.data:this.follow.list.concat(res.data.data.data);
					this.$set(this.follow, 'list', data);
					this.follow.page += 1;
				})
			},
			toLogin(url){
				uni.navigateTo({
					url:'/pagesV1/common/login'
				})
			},
			startScroll(){
				if (this._scrollPullStatus) return;
				this._scrollPullStatus = true;
				if (!this.scrollPullStatus)
					this.scrollPullStatus = true
				if(!this.tab.index)
					this.getList()
				else{
					this.follow.page=1
					this.getFollowList()
				}
				// this.getIndexCon(this.tab.tabList[this.tab.index].lawyer_tag_id, this.tab.page[this.tab.index], true)
				setTimeout(() => {
					this.scrollPullStatus = false; //触发onRestore，并关闭刷新图标
					this._scrollPullStatus = false;
				}, 500)
			},
			toLawyerPage(id) { //跳转律师主页
				uni.navigateTo({
					url: `/pagesV1/index/lawyerPage?id=${id}`
				})
			},
			getAddress() { //默认城市获取
				uni.getLocation({
					success: res => {
						getLocation({
							lng: res.longitude,
							lat: res.latitude
						}).then(res => {
							this.provinceId = res.data.data.provinceId;
							this.cityId = res.data.data.cityId;
							this.city = res.data.data.city
						})
					}
				})
			},
			toUserPage(id, type) {
				console.log(id, type)
				if (type) {
					uni.navigateTo({
						url: `/pagesV1/index/lawyerPage?id=${id}`
					})
					return
				}
			
				uni.navigateTo({
					url: `/my/client/heLookPage?id=${id}`
				})
			},
			change(index,is_follow){
				console.log(index,is_follow)
				this.follow.list[index].is_follow=is_follow
			},
			setFollow(item, index) {
				getAttention({
					type: item.is_follow,
					follow_user_id: item.user_id
				}).then(res => {
					if (!res.data.code) {
						item.is_follow = res.data.data.is_follow;
						uni.$u.toast(res.data.data.is_follow ? '关注成功' : '已取消关注')
					}

				})
			},
			toCommunity(data, index) {
				uni.navigateTo({ url: `/my/community?index=${data.index}` })
			},
			toImDetails(id, name) {
				uni.navigateTo({
					url: `/pagesV1/info/infoDetails?id=${id}&name=${name}`
				})
			},
			toQuestion(id) {
				uni.navigateTo({ url: `/pagesV1/index/askDetails?id=${id}` })
			},
			onTab(index){
				this.tab.index=index
			},
			delItem(index){
				uni.showModal({
					title: '提示',
					content: '是否删除该消息',
					confirmText:'删除',
					success: res => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.delList(index)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			delList(index) {
				const conversation = im.Conversation.get({
					targetId: getApp().globalData.list[index].targetId,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});
				conversation.destory().then(() => {
					getApp().globalData.list.splice(index, 1);
					this.im.list.splice(index,1)
					uni.showToast({
						icon: "none",
						title: "删除成功"
					})
				});
			},
			getLawyerList(){
				getUserReplyhighLawyers().then(res=>{
					this.lawyerList = res.data.data
				})
			},
			getList(re){
				im.Conversation.getList({
					count: 30,
					startTime: 0,
					order: 0
				}).then(conversationList => {
					let imlist = []
					setTimeout(() => {
						conversationList.forEach((item, index) => {
							let lastDate = parseInt((new Date().getTime() - item.latestMessage.sentTime) / 1000);
							item.actionId = `${index}额`;
							item.show = false;
							imlist.push(item.targetId)
							if (lastDate < 60) {
								item.lastDate = `${lastDate}秒前`
							} else if (lastDate >= 60 && lastDate < 3600) {
								item.lastDate = `${parseInt(lastDate/60)}分钟前`
							} else if (lastDate >= 3600 && lastDate < 3600 * 24) {
								item.lastDate = `${parseInt(lastDate/3600)}小时前`
							} else if (lastDate >= (3600 * 24)) {
								item.lastDate = `${parseInt(lastDate/(3600*24))}天前`
							}
						})
						
						getUsers({
							user_ids: JSON.stringify(imlist)
						}).then(res => {
							const users = res.data.data
							let list = []
							
							for(let j in conversationList){
								list.push({...conversationList[j]})
								for(let i in users){
									if(users[i].user_id == conversationList[j].targetId){
										list[j].user = users[i]
										this.$set(this.im.list, j, list[j]);
										continue
									}
								}
							}
						})
					}, 1000)
				},error=>{
					console.log('程序刚打开，打开消息太快啦',error)  
					if(!re){
						setTimeout(()=>{
							console.log('尝试重新连接')
							imF(this)
							this.getList(1);
						},1000)
					}
				});
			}
		},
		onLoad() {
			this.getAddress();
		},
		onShow() {
			// #ifndef MP-WEIXIN
			uni.hideTabBar()
			// #endif

			this.token=uni.getStorageSync('token')
			this.customer=uni.getStorageSync('customer')
			// #ifndef MP-KUAISHOU
			if(this.token) this.getList()
			if(this.token&&this.$refs.customer) this.$refs.customer.getUnreadCount()
			// #endif
			if(this.token&&!this.lawyerList.length) this.getLawyerList()
			if(this.token&&!this.follow.list.length) this.getFollowList()
			
			
			// #ifdef MP-KUAISHOU
			this.getMyReply()
			// #endif
		},
	}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
