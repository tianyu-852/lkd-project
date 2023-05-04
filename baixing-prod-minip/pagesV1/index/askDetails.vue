<template>
	<view class="overfHidden" @click="clearInput">
		<view class="marlr32 martop20">
			<view class="flex between hcenter">
				<view class="flex hcenter flex1">
					<view class="relative">
						<image :src="info.avatar" mode="aspectFill" class="photo" @click="toLawyerPage(info.user_id,info.type)"></image>
						<image class="followImg"
							:src="!info.is_follow?'/static/images/gz_icon.png':'/static/images/ygz_icon.png'"
							mode="widthFix" @click.stop="setFollow(info.is_follow,info.user_id)"></image>
					</view>
					<view class="left20 flex1">
						<view class="flex hcenter">
							<view class="name flex1 line1">{{info.nickname}}</view>
							<image src="/static/images/lz_icon.png" mode="widthFix" class="width25"></image>
						</view>
						<view class="martop4 color888D98">
							{{info.created_at}}{{info.city?"·":""}}{{info.city||''}}
						</view>
					</view>
					
				</view>
				<view class="delAsk" v-if="info.user_id == userId" @click="delAsk">
					<!-- 删除 -->
					<u-icon name="close" color="#888D98" size="22"></u-icon>
				</view>
				<view class="">
					<button class="shareBtn" open-type="share"> 
						<u-icon name="share-fill" color="#0061FF"></u-icon>
						<text>分享</text>
					</button>
				</view>
			</view>
			<view class="content">{{info.content}}</view>
			<view class="flex">
				<image :src="item" mode="aspectFill" v-for="(item,index) in info.question_images" :key="index"
					class="question_images" @click="previewImage(info.question_images,index)"></image>
			</view>
			<!-- <view class="created_at flex between hcenter">
				<view class="flex-row adr hcenter">
					<text>{{info.created_at}}{{info.city?"·":""}}</text>
					<image src="/pagesV1/static/images/ic_adr_org.png" v-if="info.city" mode=""></image>
					<text>{{info.city?info.city:''}}</text>
				</view>
				<view class="flex hcenter" v-if="type == 0" @click="setSC(info.is_collect)" style="font-size: 32rpx;">
					<image :src="info.is_collect?'/static/images/sc_icon_sel.png':'/static/images/sc_icon.png'" mode="widthFix" class="width36" ></image>
					<text class="left4" :style="info.is_collect?'color:#FF9F56;':'color:#222;'">{{info.is_collect?'已收藏':'收藏'}}</text>
				</view> -->
				<!-- #ifndef H5 -->
				<!-- <button class="shareBtn" open-type="share">
					<u-icon name="share-fill" color="#0061FF"></u-icon>
					<text>分享</text>
				</button> -->
				<!-- #endif -->
			<!-- </view> -->
		</view>
		<view class="height12"></view>
		<u-sticky h5-nav-height="0">
		<view class="allReply flex between hcenter ">
			<view class="marlr32">全部回答</view>
			<!-- <view v-if="info.type == 0 && type === 1" class="call" @click="callUser">
				<u-icon name="phone-fill" color="#222222" size="30"></u-icon>
				<text>电话解答</text>
			</view> -->
			<!-- <image @click="toImDetail" class="marlr32" src="/pagesV1/static/images/ddjd_icon.svg"style="width: 200rpx;" mode="widthFix"></image> -->
		</view>
		</u-sticky>
		<view class="center null" v-if="!comment.length">
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_pl.png?time=2022012414" mode="widthFix"></image>
			<view class="text">还没有用户参与评论，快来抢第一个沙发</view>
		</view>

		<view class="marlr32 " v-for="(item,index) in comment" :key="index">
			<!-- {{JSON.stringify(item)}} -->
			<view class="commentList1">
				
			
			<view class="flex hcenter " v-if="item.type==0">
				<image :src="item.avatar" mode="aspectFill" class="width78" @click.top="toLawyerPage(item.user_id,item.type)"></image>
				
				<view class="left16 name1" @click.stop="clickReply(item.nickname,item.question_comment_id,item.comment_number,item)">
					{{item.nickname}}
				</view>
				<image v-if="item.user_id == info.user_id" src="/static/images/lz_icon.png" mode="widthFix" class="width25 left8"></image>
				<image src="/static/images/del.png" v-if="userId == item.user_id" class="del" @click.stop="delComment(index,-1,item.question_comment_id)"></image>
			</view>
			<view class="flex hcenter" v-if="item.type==1">
				<view class="flex relative u-flex-1" >
					<image :src="item.avatar" mode="aspectFill" class="width78" @click.top="toLawyerPage(item.user_id,item.type)"></image>
					<image v-if="item.is_guarantee" class="lawyer_vip" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_lawyer_vip.png" mode="widthFix"></image>
					<view class="left16 width10 u-flex-1" @click.stop="clickReply(item.nickname,item.question_comment_id,item.comment_number,item)">
						<view class="flex hcenter">
							<view class="name1">{{item.nickname}}</view>
							<!-- <view class="workYear">执业{{item.work_year}}年</view> -->
							<view class="lawyerTag" v-if="item.type ==1">{{item.lawyer_grade_chinese}}</view>
						</view>
						<view class="workName ellipsis martop8" v-if="item.lawyer_office">{{item.lawyer_office}}</view>
					</view>
				</view>
				<image v-if="userId == item.user_id" src="/static/images/del.png" class="del" @click.stop="delComment(index,-1,item.question_comment_id)"></image>
				<view v-else-if="type == 0" class="flex hcenter blueBtn call-lawyer" @click.stop="toLawyerPage(item.user_id,item.type)">
					<image src="/static/images/dh_icon2.png" class="width32" mode="widthFix"></image>
					<text>咨询</text>
				</view>
			</view>
			<view class="rightbox">
				<view class="content1" @click.stop="clickReply(item.nickname,item.question_comment_id,item.comment_number,item)">
					<text v-if="item.mode == 0">{{item.question_comment}}</text>
					<voicePlay ref="voicePlay" v-else :url="item.recording_file" :time="item.recording_duration" @translate="translate(index)"></voicePlay>
				</view>
				<image :src="imgList" mode="widthFix" v-for="(imgList,imgIndex) in item.question_comment_images"
					:key="imgIndex" class="imgList1" @click="previewImage(item.question_comment_images,imgIndex)">
				</image>
				<view class="flex hcenter content3 between"
					@click.stop="clickReply(item.nickname,item.question_comment_id,item.comment_number,item)">
					<view class="time1 line1">{{item.created_at}}{{item.city?"·":""}}{{item.city}}</view>
					<view class="flex">
						<view class="Reply flex hcenter flexcenter">回复</view>
						<view class="flex hcenter">
							<image
								:src="item.is_like?'/static/images/dz_icon_sel.png':'/static/images/dz_icon.png'"
								mode="widthFix" class="width38"
								@click.stop="setDz(item.is_like,item.question_comment_id,0,item)"></image>
							<view class="left10" :style="{color:item.is_like?'#0061FF':'#888D98'}">{{item.like_number}}</view>
						</view>
					</view>
				</view>
				<view v-if="item.translateText" style="border-radius: 2rpx 16rpx 16rpx 16rpx;overflow: hidden; background: #F3F5F8;margin-top: 28rpx;">
					<uni-collapse @change="change">
					    <uni-collapse-item title="翻译结果" open  thumb="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/fy_h_icon.png" uni-img-size-base="28rpx">
					        <view style="padding: 24rpx;padding-top: 16rpx;">{{item.translateText}}</view>
					    </uni-collapse-item>
					</uni-collapse>
				</view>
				
				<view v-for="(item1,index1) in item.comments" v-if="index1<item.itemLength" :key="index1"
					class="commentList2">
					<view class="flex hcenter relative">
						<image :src="item1.avatar" mode="aspectFill" class="width64" @click.top="toLawyerPage(item1.user_id,item1.type)"></image>
						<!-- <image v-if="item1.is_guarantee" class="lawyer_vip" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_lawyer_vip.png" mode="widthFix"></image> -->
						<view class="name2"
							@click.stop="clickReply(item1.nickname,item1.question_comment_id,item1.comment_number,item1)">
							{{item1.nickname}}
						</view>
						<!-- <view class="workYear" v-if="item1.type ==1">执业{{item1.work_year}}年</view> -->
						<view class="lawyerTag" v-if="item1.type ==1">{{item1.lawyer_grade_chinese}}</view>
						<view class="flex hcenter" v-if="item1.reply_nickname"
							@click.stop="clickReply(item1.nickname,item1.question_comment_id,item1.comment_number,item1)">
							<image src="/static/images/dj_icon.png" mode="widthFix" class="jtIcon"></image>
							<view class="name2">{{item1.reply_nickname}}</view>
						</view>
						<image v-if="userId == item1.user_id" src="/static/images/del.png" class="del" @click.stop="delComment(index,index1,item1.question_comment_id)"></image>
					</view>
					<view class="left80" style="margin-top: 8upx;">
						<view class="content2" @click.stop="clickReply(item1.nickname,item1.question_comment_id,item1.comment_number,item1)">
							<text v-if="item1.mode == 0">{{item1.question_comment}}</text>
							<voicePlay v-else @translate="translate(index,index1)" :url="item1.recording_file" :time="item1.recording_duration" ></voicePlay>
						</view>
						<view class="flex hcenter content3 between">
							<view class="time2 line1">{{item1.created_at}}{{item1.city?"·":""}}{{item1.city}}</view>
							<view class="flex">
								<view class="Reply flex hcenter flexcenter"
									@click.stop="clickReply(item1.nickname,item1.question_comment_id,item1.comment_number,item1)">
									回复</view>
								<view class="flex hcenter">
									<image
										:src="item1.is_like?'/static/images/dz_icon_sel.png':'/static/images/dz_icon.png'"
										mode="widthFix" class="width38"
										@click.stop="setDz(item1.is_like,item1.question_comment_id,0,item1)"></image>
									<view class="left10" :style="{color:item1.is_like?'#0061FF':'#888D98'}">{{item1.like_number}}</view>
								</view>
							</view>
						</view>
						<view v-if="item1.translateText" style="border-radius: 2rpx 16rpx 16rpx 16rpx;overflow: hidden; background: #F3F5F8;margin-top: 28rpx;">
							<uni-collapse @change="change">
							    <uni-collapse-item title="翻译结果" open  thumb="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/fy_h_icon.png" uni-img-size-base="28rpx">
							        <view style="padding: 24rpx;padding-top: 16rpx;">{{item1.translateText}}</view>
							    </uni-collapse-item>
							</uni-collapse>
						</view>
					</view>
				</view>
				
				<view class="surplus" v-if="item.comments.length>3&&!item.isOpen" @click="tocommentDetails(item)">
					查看剩余{{item.comments.length - 3}}条评论</view>
			</view>
			</view>
<!-- 			<view style="padding: 20rpx 0;border-bottom: 1rpx solid #ECEFF4;" v-if="index == 0">
				<banners  :banners="banners" height="240rpx"></banners>
			</view> -->
			
		</view>
		<view class="fixed fixedBox flex  hcenter" v-if="!reply.inputStatus">
			<view class="flex-row hcenter " style="width:100%;">
				<image style="margin:0 20rpx 0 32rpx;" :src="speak?'/pagesV1/static/images/jp_icon.svg':'/pagesV1/static/images/yy_icon.svg'" mode="widthFix" class="uploadImg" @click.stop="showSpeak"></image>
				<view class="recorder" v-if="speak"><touchRecorder @recorder="recorderFile"></touchRecorder></view>
				<view v-else class="flex inputbox hcenter" @click.stop="setInputStatus">
					<image src="/static/images/sr_icon.png" mode="widthFix" class="width24"></image>
					<view class="left16">畅所欲言...</view>
				</view>
				<view class="flex between">
					<view class="flex hcenter" @click="setSC(info.is_collect)" style="margin-right: 48rpx;">
						<image :src="info.is_collect?'/static/images/sc_icon_sel.png':'/static/images/sc_icon.png'" mode="widthFix" class="width48" ></image>
					</view>
					<view class="relative flex hcenter" style="margin-right: 66rpx;">
						<view :class="['absolute likeNum bold',info.is_like?'color0061FF':'color222']">
							{{info.like_number}}
						</view>
						<image :src="info.is_like?'/static/images/dziconacitve.png':'/static/images/dzicon.png'"
							mode="widthFix" class="width48" @click.top="setDz(info.is_like,id,3,info)"></image>
					</view>
				</view>
			</view>
			<view class="safe-area-inset-bottom"></view>
		</view>
		<u-popup id='popup' mode="bottom" v-model="reply.inputStatus" border-radius="32" duration="0" @close="hidePoPup" @open="showPopup">
			<view class="commentBox">
				<!-- #ifdef MP-KUAISHOU -->
				<textarea :disable-default-padding="false" :placeholder="reply.placeholder" confirm-type="send" v-model="reply.value" @confirm="send" :focus="textarea.focus" :show-confirm-bar="false" :adjust-position="false" @focus="showTextarea" @blur="hideTextarea" :hold-keyboard="false"></textarea>
				<!-- #endif -->
				<!-- #ifndef MP-KUAISHOU -->
				<textarea :disable-default-padding="false" :fixed="true" :placeholder="reply.placeholder" confirm-type="send" v-model="reply.value" @confirm="send" :focus="textarea.focus" :show-confirm-bar="false" :adjust-position="false" @focus="showTextarea" @blur="hideTextarea" :hold-keyboard="false"></textarea>
				<!-- #endif -->
				<view class="flex hcenter between">
					<view class="flex hcenter">
						<image :src="reply.imgUrl?reply.imgUrl:'/static/images/image.png'" mode="widthFix" class="uploadImg" @click="UploadImg"></image>
						<text>图片</text>
						<image :src="speak?'/pagesV1/static/images/jp_icon.svg':'/pagesV1/static/images/yy_icon.svg'" mode="widthFix" class="uploadImg left48" @click="showSpeak"></image>
						<text @click="showSpeak">语音</text>
					</view>
					<view class="btn" @click="send">发布</view>
				</view>
			</view>
			<view class="" v-if="textarea.oldFocus" :style="{'height':`${textarea.height}px`}"></view>
		</u-popup>
		<!-- <u-mask :show="reply.inputStatus" @click="reply.inputStatus= false">
			<view class="commentBox">
				<textarea :disable-default-padding="false" :fixed="true" :placeholder="reply.placeholder" confirm-type="send" v-model="reply.value" @confirm="send" :focus="textarea.focus" :show-confirm-bar="false" :adjust-position="false" @focus="showTextarea" @blur="hideTextarea" :hold-keyboard="false"></textarea>
				<view class="flex hcenter between">
					<view class="flex hcenter">
						<image :src="reply.imgUrl?reply.imgUrl:'/static/images/image.png'" mode="widthFix" class="uploadImg" @click="UploadImg"></image>
						<text>图片</text>
						<image :src="speak?'/pagesV1/static/images/jp_icon.svg':'/pagesV1/static/images/yy_icon.svg'" mode="widthFix" class="uploadImg left48" @click="showSpeak"></image>
						<text @click="showSpeak">语音</text>
					</view>
					<view class="btn" @click="send">发布</view>
				</view>
			</view>
		</u-mask> -->
		<view style="height: 300rpx;"></view>
		<customDialog ref="dialog" :title="'确认删除评论？'" @change="dialogChange"></customDialog>
	</view>
</template>

<script>
	import touchRecorder from "@/pagesV1/components/touchRecorder.vue"
	import customDialog from "../components/customDialog.vue"
	import { server } from "@/request.js"
	import { getQuestion, getAttention, getComment, getOneId, getReply, getPublish, getLike, getUnlike, getFavorites, getUnFavorites, delComment, sendPhone, delQuestion, getRecordingToText, getHomeBanner } from "@/api/apis.js"

	export default {
		components: { customDialog, touchRecorder },
		data() {
			return {
				banners:[],
				countDownStart:false,
				timestamp:0,
				isRecorder:false,
				speak:false,
				voiceFile:null,
				type:uni.getStorageSync('type'),
				textarea: {
					height: null,
					focus: false,
					oldFocus:false
				},
				id: 788, //788
				info: {},
				ids: [],
				commentPage: 1,
				comment: [],
				url:'',
				reply: {
					inputStatus: false,
					placeholder: '...',
					value: null,
					replyId: 4, //回复ID
					isReply: false, //是否为回复
					imgUrl: null,
				},
				userId:uni.getStorageSync('user_id'),
			}
		},
		methods: {
			// playVoice(path){
			// 	innerAudioContext.src = path;
			// 	innerAudioContext.play();
			// 	this.countDownStart = true
			// },
			getBanner(){
				getHomeBanner().then(res=>{
					if(res.data.code == 0){
						if(this.type)
							this.banners = res.data.data.question_add_lawyer_banners
						else
							this.banners = res.data.data.question_add_banners
					}
				})
			},
			recorderFile(e){
				console.log(e)
				this.voiceFile = e
				this.send()
			},
			toImDetail(e){
				uni.navigateTo({
					url:`/pagesV1/info/infoDetails?id=${this.info.user_id}&name=${this.info.nickname}`})
			},
			translate(index,index1){
				let item={}
				if(index1 == undefined){
					item = this.comment[index]
				}else{
					item = this.comment[index].comments[index1]
				}
				console.log(item)
				getRecordingToText({
					question_comment_id:item.question_comment_id
				}).then(res=>{
					if(res.data.code){
						uni.$u.toast(res.data.message)
					}else{
						item.translateText = res.data.data.text?res.data.data.text:'无'
						if(index1 == undefined){
							this.$set(this.comment,index,item)
						}else{
							this.$set(this.comment[index].comments,index1,item)
						}
					}
				})
			},
			dialogChange(res){
				this.$refs.dialog.show = res.show
				if(res.success){
					delQuestion({question_id:this.id}).then(res =>{
						if(res.data.code){
							uni.$u.toast(res.data.message)
							return
						}else{
							uni.$u.toast('删除成功')
							const eventChannel = this.getOpenerEventChannel()
							eventChannel.emit('delAsk','');
							uni.navigateBack()
						}
							
					})
				}
			},
			delAsk(){
				this.$refs.dialog.show = true
			},
			callUser(){
				sendPhone({
					user_id: this.info.user_id
				}).then(res => {
					if (!res.data.code) {
						uni.makePhoneCall({
							phoneNumber: res.data.data.mobile,
							complete: res => {
								this.status = false;
								this.time = 30;
								this.time30();
								this.$refs.timeOuter.show = false;
							}
						});
						return
					}
					uni.showToast({
						icon: "none",
						title: res.data.message
					})
				})
			},
			delComment(index,index1, id) { //删除评论
				uni.showModal({
					title: '您确定要删除么',
					success: res => {
						if (res.confirm) {
							delComment({
								question_comment_id: id
							}).then(res => {
								if (!res.data.code) {
									uni.showToast({
										icon: 'none',
										title: '删除成功'
									})
								}
								if(index1 == -1)
									this.comment.splice(index, 1)
								else
									this.comment[index].comments.splice(index1,1)
								// this.content[3].splice(index, 1)
							})
						}
					}
				})
			},
			toMatch(){
				uni.navigateTo({
					url:"match"
				})
			},
			showSpeak(){
				this.speak = !this.speak
				if(this.speak == false){
					this.setInputStatus()
					// this.setFocus()
				}else
					this.reply.inputStatus = false
					
			},
			showPopup() {
				console.log('showPopup')
				setTimeout(res=>{
					this.setFocus()
				},300)
				// this.$nextTick(function(){
				// 	this.setFocus()
				// })
				// this.setFocus()
			},
			hidePoPup() { //popup消失时
				console.log('hidePoPup')
				this.$set(this.textarea, "focus", false);
			},
			UploadImg() {
				uni.chooseImage({
					count: 1,
					success: blob => {
						blob.tempFilePaths.forEach((item, index) => {
							uni.uploadFile({
								url: `${server}api/common/image`,
								filePath: blob.tempFilePaths[index],
								header: {
									"Authorization": uni.getStorageSync('token'),
								},
								name: "image",
								success: res => {
									let data = JSON.parse(res.data)
									this.$set(this.reply, "imgUrl", data.data.url)
								}
							})
						})
					},
					complete: () => {
						this.setFocus()

					}
				})
			},
			previewImage(urls,index){
				uni.previewImage({
					current:index||0,
					urls: urls, 
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			hideTextarea(e) {
				console.log("失去焦点了",e.detail.cursor)
				this.textarea.oldFocus = false
				uni.hideKeyboard()
				// this.$set(this.textarea, "focus", e.detail.cursor);
			},
			setFocus(){
				console.log('setFocus')
				// this.textarea.focus = this.textarea.oldFocus
				this.$set(this.textarea, "focus", true);
				// this.$nextTick(function(){
				// 	this.textarea.focus = true
				// })
			},
			showTextarea(e) {
				this.$set(this.textarea, "height", e.detail.height)
				this.reply.inputStatus = true
				this.textarea.focus = true
				this.textarea.oldFocus = true
				console.log('获取到焦点了')
			},
			tocommentDetails(item) {
				item.isOpen = true;
				item.itemLength = item.comments.length
				/* uni.navigateTo({
					url: `./commentDetails?id=${id}`
				}) */

			},
			toLawyerPage(id, type) {
				if (type) {
					uni.navigateTo({
						url: `lawyerPage?id=${id}`
					})
					return
				}
				uni.navigateTo({
					url: `/my/client/heLookPage?id=${id}`
				})

			},
			toPhoneAdvisory(info) {
				uni.navigateTo({
					url: `phoneAdvisory?info=${JSON.stringify(info)}`
				})
			},
			setSC(isSc) { //修改收藏
				if (isSc) {
					getUnFavorites({
						question_id: this.id
					}).then(res => {
						if (!res.data.code) {
							uni.showToast({
								icon: "none",
								title: "取消收藏成功"
							})
							this.info.is_collect = 0
						}
					})
					return
				}
				getFavorites({
					question_id: this.id
				}).then(res => {
					if (!res.data.code) {
						uni.showToast({
							icon: "none",
							title: "收藏成功"
						})
						this.info.is_collect = 1
					}
				})
			},
			setDz(isLike, id, type, data) { //修改评论点赞
				console.log(data)
				if (isLike) {
					getUnlike({
						type: type,
						source_id: id
					}).then(res => {
						if (!res.data.code) {
							uni.showToast({
								icon: "none",
								title: "取消点赞成功"
							})
							this.$set(data, "is_like", res.data.data.is_like)
							this.$set(data, "like_number", res.data.data.like_number)
						}
					})
					return
				}
				getLike({
					type: type,
					source_id: id
				}).then(res => {
					if (!res.data.code) {
						uni.showToast({
							icon: "none",
							title: "点赞成功"
						})
						this.$set(data, "is_like", res.data.data.is_like)
						this.$set(data, "like_number", res.data.data.like_number)
					}
				})
			},
			clearInput() {
				this.reply.inputStatus = false;
			},
			send() { //发送评论内容
				console.log(this.speak,this.voiceFile)
				if(this.speak && !this.voiceFile.url){
					uni.uploadFile({
						url: `${server}api/common/upload/recording`,
						filePath: this.voiceFile.tempFilePath,
						header: {
							"Authorization": uni.getStorageSync('token')
						},
						name: "file",
						formData:{question_id:this.id},
						success: res => {
							console.log(JSON.parse(res.data),222222);
							const data = JSON.parse(res.data)
							if(data.code == 1009){
								//#ifdef MP-WEIXIN
								uni.navigateTo({
									url: "/pagesV1/common/login"
								})
								//#endif
								//#ifdef MP-TOUTIAO
								uni.navigateTo({
									url: "/pagesV2/h5/login"
								})
								//#endif
							}else if(data.code==1002){
								uni.$u.toast('录音格式错误')
							}else{
								this.voiceFile.url = data.data.url
								this.send()
							}
						}
					})
					return
				}
				if (this.reply.isReply) {
					let data = {}
					if(this.speak)
					data = {
						question_comment_id: this.reply.replyId,
						recording_file: this.voiceFile.url,
						recording_duration:this.voiceFile.duration,
						is_format_in_question_detail: 1
					}
					else
					data = {
						question_comment_id: this.reply.replyId,
						question_comment: this.reply.value||'',
						is_format_in_question_detail: 1,
					}
					if (this.reply.imgUrl) {
						data.question_comment_images = JSON.stringify([this.reply.imgUrl])
					}
					if(!this.reply.value){
						uni.$u.toast('请输入评论内容')
						return
					}
					// 回复二级评论
					getReply(data).then(res => {
						if(res.data.code){
							uni.$u.toast(res.data.message)
							return
						}else
							uni.$u.toast('发布成功')
						
						this.voiceFile = null
						this.reply.value = null
						this.getOneId();
						this.$set(this.textarea, "focus", false);
						this.$set(this.reply, "inputStatus", false);
					})
					return
				}
				let data = {}
				if(this.speak)
					data = {
					question_id: this.id,
					recording_file: this.voiceFile.url,
					recording_duration:this.voiceFile.duration
				}
				else
					data = {
					question_id: this.id,
					question_comment: this.reply.value||'',
				}
				if (this.reply.imgUrl) {
					data.question_comment_images = JSON.stringify([this.reply.imgUrl])
				}
				// console.log(JSON.stringify(data))
				// 发表一级评论
				getPublish(data).then(res => {
					if(res.data.code){
						uni.$u.toast(res.data.message)
						return
					}else
						uni.$u.toast('发布成功')
					this.voiceFile = null
					this.reply.value = null
					this.getOneId();
					this.$set(this.textarea, "focus", false);
					this.$set(this.reply, "inputStatus", false);
				})

			},
			clickReply(name, id, num, item) { //点击回复按钮时
				console.log(name, id, num, item)
				this.reply.value = this.reply.isReply?this.reply.value:null;
				this.reply.imgUrl = null;
				this.reply.inputStatus = true;
				this.reply.placeholder = `回复   ${name}`;
				this.reply.isReply = true
				this.reply.replyId = id;
				// this.setFocus()
			},
			setInputStatus() { //点击弹出input框
				this.reply.value = this.reply.isReply?null:this.reply.value;
				this.reply.imgUrl = null;
				this.reply.inputStatus = true
				this.reply.isReply = false;
				this.reply.placeholder = `我想说...`;
				// this.setFocus()
			},
			getOneId() { //获取一级ID
				getOneId({
					question_id: this.id,
					question_comment_type: 0,
					order_type: 3
				}).then(res => {
					uni.stopPullDownRefresh()
					this.ids=res.data.data
					this.getCommentList(0)
				})
			},
			getCommentList(next){
				var nextComment=[]
				if(next&&this.commentPage>1)
					nextComment=this.ids.slice((this.commentPage-1)*15,this.commentPage*15-1)
				if(next&&!nextComment.length) return
				getComment({
					question_id: this.id,
					question_comment_ids: next&&this.commentPage>1?JSON.stringify(nextComment):JSON.stringify(this.ids.slice(0,14)),
					is_sub_more: 1,
					is_more_from_all: 1
				}).then(res => {
					if (!res.data.code) {
						res.data.data.forEach((item, index) => {
							item.isOpen = false;
							item.itemLength = 3
                            // item.itemLength = item.comments.length
						})
						this.commentPage++
						this.$set(this, "comment", next?this.comment.concat(res.data.data):res.data.data)
						console.log('评论', res.data.data)
					}
				})
			},
			setFollow(e, id) { //是否关注
				getAttention({
					type: e ? 1 : 0,
					follow_user_id: id
				}).then(res => {
					this.info.is_follow = res.data.data.is_follow
					uni.$u.toast(e?'取关成功':'关注成功')
				})
			},
			getQuestionDetails() { //获取评论详情
				getQuestion({
					question_id: this.id
				}).then(res => {
					if(!res.data.code){
						this.$set(this, 'info', res.data.data)
						console.log('详情', res.data.data)
						uni.stopPullDownRefresh()
					}else{
						uni.navigateBack()
						uni.$u.toast(res.data.message)
					}
				})
			},
		},
		onShareAppMessage(res) {
			return{
				title:this.info.share.title,
				imageUrl:this.info.share.wechat_mini_program.cover_image
			}
		},
		onReachBottom(){
		　　this.getCommentList(1)
		},
		onLoad(e) {
			let self = this;
			
			this.url=this.$photoPath;
			// this.id = e.id;
			this.id=!e.id?decodeURIComponent(e.scene):e.id
			this.getQuestionDetails();
			this.getOneId();
			this.getBanner()
		},
		onPullDownRefresh() {
			this.getQuestionDetails();
			this.getOneId();
		}
	}
</script>
<style>
	/* #popup .u-drawer-content-visible{
		transform: none !important;
	} */
</style>
<style lang="scss">
	/deep/.u-mask-zoom{
		transform: none !important;
	}
	.lawyer_vip{
		position: absolute;
		left: 46rpx;
		top: 46rpx;
		width: 42rpx;
	}
	.recorderIng{
		height: 162rpx;
		background: #6BABFF;
		position: fixed;
		border-radius: 30rpx;
		z-index: 222222;
		bottom:252rpx;
		left: 204rpx;
		right: 204rpx;
		image{
			// margin:auto ;
			width:200rpx;
			margin-top: -20rpx;
			// height: 80rpx;
		}
		.triangle{
			width: 44rpx;
			position: absolute;
			bottom:-20rpx ;
		}
	}
	.u-countdown-item{
		.u-countdown-time{
			line-height: 30upx !important;
			width:auto !important;
			background: #F3F5F8 !important;
			border-radius: 8upx;
			font-size: 30rpx !important;
			 
			font-weight: 400; 
			color: #979EB3 !important;
			text-align: center;	
		}
		margin: 0 0upx;
	}
	.u-countdown-colon{
		line-height: 12upx !important;
		width: 15upx !important;
		color: #979EB3 !important;
	}
	.voice{
		margin-bottom: 34rpx;
		.file{
			width: 240rpx;
			height: 60rpx;
			background: #F3F5F8;
			border-radius: 2rpx 16rpx 16rpx 16rpx;
			line-height: 60rpx;
			font-size: 30rpx;
			color: #979EB3;
			image{
				width: 65rpx;
				height: 36rpx;
				padding: 12rpx 20rpx;
			}
		}
		image{
			width: 32px;
			height: 30rpx;
			padding: 15rpx 30rpx;
		}
	}
	.recorder{
		flex: 1;
		line-height: 64rpx;
		background: #EBEEF3;
		border-radius: 8rpx;
		text-align: center;
		font-size: 34rpx;
		font-weight: bold;
		color: #888D98;
		margin-right: 20rpx;
	}
	/deep/.u-drawer-top{
		background: none !important;
	}
	.call-lawyer{
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 19upx;
		border-radius: 36rpx;
	}
	.left10{
		margin-left:4upx ;
	}
	.del {
		width: 26upx;
		height: 26upx;
		margin: auto;
		margin-right: 0;
	}
	.phoneIconBox {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100px;
		background: linear-gradient(136deg, #506DFF 0%, #3F2AFF 100%);
		box-shadow: 0px 4rpx 8rpx rgba(0, 57, 243, 0.3);
		text-align: center;
		margin-right: 68rpx;
		image {
			width: 60rpx;
		}
	}

	textarea {
		width: 100%;
	}

	.question_images {
		width: 200rpx;
		height: 200rpx;
		border-radius: 4upx;
		margin: 0 8upx;
		margin-bottom: 16upx;
	}

	.zixun {
		width: 100rpx;
		font-size: 18rpx;
		font-weight: bold;
		text-align: left;
		color: #4235FF;
		left: 60rpx;
		top: 11rpx;
	}

	.likeNum {
		top: 0;
		left: 48rpx;
		font-size: 18upx;
	}

	.inputbox {
		flex: 1;
		height: 64rpx;
		background: #EBEEF3;
		border-radius: 8rpx;
		padding-left: 36rpx;
		font-size: 28rpx;
		color: #888D98;
		float: left;
		margin-right: 20rpx;
	}

	.fixedBox {
		width: 100%;
		background-color: #fff;
		bottom: 0rpx;
		padding: 16rpx 0 91upx 0;
		border-top: 1rpx solid #F1F4FB;
		z-index: 999;
	}
	.commentBox{
		padding: 32upx;
		textarea{
			// #ifdef MP-KUAISHOU
			width: 100%;
			display: inline-block;
			z-index: 999999999999999999;
			// #endif
			// #ifndef MP-KUAISHOU
			width: calc(100% - 32upx);
			// #endif
			height: 150upx;
			margin-bottom: 20upx;
			padding: 8upx 16upx;
			border-radius: 16upx;
			background-color: #EEF0F3;
			
			
		}
		.btn{
			color: #fff;
			background: #0061FF;
			border-radius: 30px;
			line-height: 50upx;
			padding: 0 30upx;
		}
	}


	.commentList1 {
		.surplus {
			margin-top: 30rpx;
			font-size: 28rpx;
			color: #0061FF;
		}
		.commentList2 {
			.jtIcon {
				width: 16rpx;
				margin-left: 16rpx;
			}
			// border-top: 1rpx solid #ccc;
			padding-top: 20rpx;
			margin-top: 20rpx;
		}
		.workName {
			font-size: 24rpx;
			color: #888D98;
		}
		.workYear {
			border: 2rpx solid #5B86FF;
			margin-left: 12rpx;
			padding: 1rpx 8rpx 1rpx 8rpx;
			border-radius: 4upx;
			font-size: 20rpx;
			font-weight: bold;
			color: #5B86FF;
		}
		.name1 {
			font-size: 28rpx;
			font-weight: bold;
			color: #222222;
		}
		padding: 32rpx 0;
		border-bottom: 1rpx solid #ECEFF4;
	}

	.content2 {
		color: #222222;
		font-size: 28rpx;
	}
	.content3{
		color: #888D98;
		margin-top: 20upx;
	}
	.name2 {
		font-size: 28rpx;
		font-weight: bold;
		color: #222222;
		margin-left: 16rpx;
	}

	.width64 {
		width: 64rpx;
		height: 64rpx;
		border-radius: 12rpx;
	}

	.width44 {
		width: 44rpx;
	}

	.Reply {
		padding: 4upx 24upx;
		margin-right: 64rpx;
		font-size: 26rpx;
		color: #0061FF;
		background: #E6F0FF;
		border-radius: 100upx;
	}

	.time1 {
		width: 271rpx;
		font-size: 24rpx;
		color: #888D98;
	}

	.time2 {
		width: 199rpx;
		font-size: 24rpx;
		color: #888D98;
	}

	.content1 {
		font-size: 32rpx;
		font-weight: 500;
		color: #222222;

	}

	.imgList1 {
		width: 150rpx;
	}

	.rightbox {
		margin-left: 94rpx;
		margin-top: 8upx;
	}



	.width78 {
		width: 78rpx;
		height: 78rpx;
		border-radius: 12rpx;
	}

	.allReply {
		font-size: 32rpx;
		font-weight: bold;
		color: #222222;
		background: #fff;
		padding: 24rpx 0;
		border: 1rpx solid #ECEFF4;
	}

	.height12 {
		height: 12rpx;
		background: #F5F7FA;
		margin-top: 20rpx;
	}

	.created_at {
		font-size: 24rpx;
		color: #888D98;
		line-height: 36upx;
		margin-top: 24upx;
		.adr{
			line-height: 48upx;
			height: 48upx;
			font-size: 28upx;
			color: #FF7639;
			background: #FEEEE7;
			border-radius:8upx;
			padding: 0 20upx;
			image{
				width: 24upx;
				height:24upx;
				// padding:12upx 0 12upx 20upx;
				// background: #FEEEE7;
				// border-radius:8upx 0 0 8upx;
			}
			// text{
			// 	background: #FEEEE7;
			// 	border-radius:0 8upx 8upx 0;
			// 	padding: 0 20upx 0 4upx;
			// }
		}
	}
	.call{
		width: 180upx;
		height: 62upx;
		line-height: 62upx;
		padding: 0;
		font-size: 24rpx;
		margin-right: 32upx;
		color: #222!important;
		text-align: center;
		border: 2upx solid #d5d5d5;
		border-radius: 100upx;
	}
	.delAsk{
		width: 88upx;
		height: 48upx;
		// border: 2upx solid #FF8181;
		border-radius: 100px;
		font-size: 24upx;
		line-height: 48upx;
		// color: #FF8181;
		text-align: right;
		margin:auto;
		margin-right: 0;
	}
	.shareBtn{
		width: 140upx;
		height: 62upx;
		line-height: 62upx;
		padding: 0;
		color: #0061FF!important;
		text-align: center;
		border: 2upx solid #0061FF;
		background: transparent;
		// background-image: url(../static/images/fx_icon@3x.png);
		// background-size:128upx 48upx;
		margin:auto;
		margin-right: 0;
	}
	.content {
		margin: 16rpx 0 14upx 0;
		font-size: 36rpx;
		color: #222222;
		line-height: 60rpx;
	}

	.name {
		margin-right: 12rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #222222;
	}

	.followImg {
		position: absolute;
		width: 44upx;
		right: -12upx;
		bottom: -12upx;
		display: block;
	}

	.item2 {
		margin: 12rpx 0;
		padding: 24rpx 0;
	}

	.photo {
		width: 110rpx;
		height: 110rpx;
		border-radius: 12rpx;
		display: block;
	}

	.uploadImg {
		width: 50rpx;
	}
</style>
