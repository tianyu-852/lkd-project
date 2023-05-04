<template>
	<view class="flex-column" :style="{ paddingBottom: sysSafeAreaHeight + 50 + 5 + 'px' }">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar :is-back="false" :border-bottom="false" :background="{background:'#F9F9FB'}" title="推荐律师" title-size="36" title-color="#14284A" title-bold>
			<view class="left32 widthAll">
				<view class="blueBtn2" @click="getLawyerList" v-if="token">换一批</view>
			</view>
		</u-navbar>
		<!-- #endif -->
		
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

<style lang="scss">
	// #ifdef MP-KUAISHOU
	.item1 {
	    padding: 20rpx 32rpx;
	    border-bottom: 1rpx solid #F5F7FA;
	    background-color: #fff;
		.sl {
		    background: #F3F5F8;
		    border-radius: 8rpx;
		    padding: 16rpx 24rpx;
			image {
			    width: 14rpx;
			}
			.text {
			    width: 515rpx;
			    font-size: 28rpx;
			    color: #888D98;
			}
		}
		.content {
		    margin: 12rpx 0 20rpx;
		    font-size: 28rpx;
		    line-height: 48rpx;
		    color: #222222;
		}
		.header {
			.time {
			    margin-top: 4rpx;
			    font-size: 26rpx;
			    color: #888D98;
			}
			.photo {
			    width: 88rpx;
			    height: 88rpx;
			    border-radius: 100px;
			    margin-right: 20rpx;
			}
			.comment {
			    font-size: 28rpx;
			    font-weight: bold;
			    color: #222222;
			}
			.to {
			    font-size: 30rpx;
			    font-weight: bold;
			    color: #222222;
				.text {
				    margin: 0 8rpx;
				    font-weight: 500;
				    color: #5B6A91;
				}
			}
		}
	}

	// #endif
	.larwerItem {
		box-shadow: 0px 4rpx 20rpx rgba(194, 220, 238, 0.26);
		border-radius: 8rpx;
		margin-top: 20rpx;
		padding: 24rpx;
		.top {
			.noattention {
				background: #0061FF !important;
				color: #FFFFFF !important;
			}
			.attention {
				width: 140rpx;
				height: 60rpx;
				background: #E8EEF6;
				border-radius: 100rpx;
				color: #AEB7C8;
				font-size: 28rpx;
			}
			.name {
				font-size: 30rpx;
				font-weight: bold;
			}
			.photo {
				width: 130rpx;
				height: 130rpx;
				border-radius: 100%;
			}
		}
	}
	.blueBtn2{
		min-width: 140rpx;
		height: 48rpx;
		line-height: 48rpx;
		background: linear-gradient(119deg, #6995FE 0%, #4576FB 100%);
		border-radius: 100rpx;
		padding: 0 22rpx;
		display: inline-block;
	}
	.lawyerList{
		border-bottom:12rpx solid #F5F7FA;
		border-radius: 0 0 0 80rpx;
		background: #F9F9FB;
		margin-bottom: 12rpx;
		overflow: hidden;
		.lawyerItem{
			width: 110rpx;
			margin-right: 56rpx;
			padding-top: 24rpx;
			position: relative;
			.avatar{
				width: 110rpx;
				height: 110rpx;
				background: rgba(0, 0, 0, 0);
				border-radius: 24rpx;
			}
			.name{
				width: 110rpx;
				line-height: 48rpx;
				font-size: 26rpx;
				color: #222222;
				margin-top: 16rpx;
			}
			.guarantee{
				position: absolute;
				width: 42rpx;
				height: 42rpx;
				right: -8rpx;
				top: 100rpx;
			}
		}
	}
	.navTitle{
		line-height: 56rpx;
		font-size: 40rpx;
		font-weight: 800;
		color: #222222;
		padding:104rpx 0 16rpx 0rpx;
		margin: 0 32rpx;
	}
	/deep/.u-tabs{
		margin-left: -30upx;
	}
	.tab{
		height: 40px;
		background: #F5F5F9;
		border-radius: 12rpx;
		margin: 20rpx 32rpx 4rpx;
		padding: 4px;
		text-align: center;
		.tab-item{
			height: 64rpx;
			border-radius: 12rpx;
			font-size: 28rpx;
			font-weight: 500;
			line-height: 64rpx;
			color: #14284A;
			flex: 1;
		}
		.on{
			font-weight: bold;
			color: #3764FF;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 8rpx rgba(0, 36, 178, 0.2);
		}
	}
	.toList{
		line-height: 48upx;
		border: 2upx solid #0061FF;
		box-shadow: 0px 4upx 16upx rgba(0, 44, 220, 0.3);
		border-radius: 100px;
		padding: 0 16upx;
		font-size: 28upx;
		color: #0061FF;
	}
	.tabBox{
		width: 100%;
		height: 96upx;
		padding: 0 32rpx;
		overflow: hidden;
		border-bottom: 1upx solid #ECEFF4;
	}
	.ItemBox {
		.typeName {
			font-size: 24rpx;
			color: #888D98;
			margin-right: 40rpx;
		}
	
		.typeItem {
			font-size: 22rpx;
			color: #99A0AC;
			border: 1rpx solid #C9CED9;
			border-radius: 8rpx;
			width: 101rpx;
			height: 40rpx;
			margin: 0 6rpx;
		}
	
		.itemTypes {
			border-top: 1rpx solid #ECEFF4;
			padding-top: 20rpx;
		}
	
		.centerBox {
			width: 325rpx;
		}
	
		.call {
			width: 140rpx;height: 55upx;
		}
	
		.address {
			font-size: 24rpx;
			color: #222222;
		}
	
		.Year {
			border: 1rpx solid #5b86ff;
			padding: 1rpx 8rpx 1rpx 8rpx;
			font-size: 20rpx;
			font-weight: bold;
			color: #5B86FF;
			margin-left: 12rpx;
		}
	
		.Name {
			font-size: 32rpx;
			font-weight: bold;
			color: #222222;
		}
	
		.photo {
			width: 130rpx;
			height: 130rpx;
			border-radius: 12rpx;
			display: block;
			image {
				width: 100%;
			}
		}
	
		padding: 24rpx;
		box-shadow: 0px 4px 20px rgba(194, 220, 238, 0.26);
		border-radius: 8rpx;
		margin-top: 20rpx;
	}
	.listBox {
		padding-top: 32rpx;
		.item {
			padding-left:32upx;
			width: 100vw;
			display: inline-block;
			flex-wrap: nowrap;
			&:last-child .item-text{
				border-bottom: none;
			}
			.call-status{
				width: 148rpx;
				color: #fff;
				font-size: 26rpx;
				line-height: 37rpx;
				background: #A1AFCE;
			}
			.unreadMessageCount {
				font-size: 22upx;
				line-height: 32upx;
				color: #FFFFFF;
				background: #FF4040;
				box-shadow: 0rpx 3rpx 6rpx rgba(206, 0, 0, 0.26);
				border-radius: 100rpx;
				min-width: 32upx;
				height: 32upx;
				padding: 0 8upx;
				font-weight: 500;
			}
		
			.date {
				font-size: 24rpx;
				color: #C9CED9;
			}
		
			.content {
				font-size: 26rpx;
				color: #888D98;
				margin-top: 8upx;
				flex: 1;
				width: 0;
			}
		
			.name {
				font-size: 30rpx;
				font-weight: bold;
				color: #222222;
			}
		
			.photo {
				width: 94rpx;
				height: 94rpx;
				border-radius: 12rpx;
				margin: auto;
			}
			.tag{
				color: #B7BFD1;
				line-height: 32rpx;
				border: 1rpx solid #B7BFD1;
				border-radius: 8rpx;
				padding: 0 7rpx;
				font-size: 20rpx;
			}
			.item-text{
				padding: 28rpx 32rpx 28rpx 0;
				border-bottom: 1rpx solid #ECEFF4;
				
			}
		}
		
	}
	.null{
		margin: auto 0;
		margin-top: 0;
		.btn{
			width: 400rpx;
			height: 68rpx;
			background: linear-gradient(53deg, #2C7EF3 0%, #49A5F6 95%, #49A5F6 100%);
			border-radius: 100rpx;
			font-size: 32rpx;
			line-height: 68rpx;
			color: #FFFFFF;
			margin: auto;
			text-align: center;
		}
	}
	

	.navItemBox {
		margin-top: 27rpx;
		padding-bottom: 32rpx;
		border-bottom: 12rpx solid #F5F7FA;

		.navItem {
			image {
				width: 120rpx;
				height: 120upx;
			}
		}
	}
</style>
