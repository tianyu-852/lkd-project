<template>
	<view>
		<!-- <view class="flex-row head" v-if="list.length!=0">
			<text class="left">法律援助</text>
			<text class="right">达到一定条件即可申请首页推荐</text>
		</view> -->
		<view class="list">
			<view class="item" v-for="item,index in list" :key="item" @click="toDetail(item.fundraising_id)">
				<view class="address flex between hcenter">
					<view><text class="tag" v-if="item.bid_status == 3">{{userType?'已代理':'已有律师代理'}}</text>案件地区:{{item.province}}-{{item.city}}</view>
					<view class="mode">
						<text>查看详情</text>
						<u-icon name="arrow-right" color="#677592" size="20"></u-icon>
					</view>
				</view>
				<view class="info flex-row">
					<image class="img" :src="item.cover_image" mode="aspectFill"></image>
					<view class="title line3">{{item.title}}</view>
						<!-- 高度问题 -->
<!-- 						<u-line-progress style="margin-top: 12upx;display:block;" :show-percent="false" :height="6" active-color="#4885FD" :percent="item.fundraise_progress"></u-line-progress>
						<text class="money">已筹<text class="blue">{{item.fundraise_money}}</text>元  ｜  目标<text class="blue">{{item.target_money}}</text> 元</text> -->
					<view class="money center">
						<text>{{item.target_money}}</text>
						<view>律师代理费</view>
					</view>
					<view class="hint" v-if="item.refund_focus_text">
						{{item.refund_focus_text}}
					</view>
				</view>
				<view class="flex between hcenter foot">
					<view class="left1 u-flex-1">
						<view v-if="0"><text>案件进度:</text>已结案</view>
						<view class="wrap" v-else>
							<view :class="['text',all[index]?'':'textAfter']" :style="all[index]?'max-height: none;':''">
								<button :class="['btn',all[index]?'':'btnBefore']"  @click.stop="clickAll(index)">{{all[index]?'收起':'展开'}}</button>
								诉求：{{item.appeal}}
							</view>
						</view>
						<!-- <view class="flex between"="1">
							<view :class="['text',isMode?'line3':'line1']">{{item.appeal}}</view>
							<text class="open" @click.stop="isMode=true" v-if="!isMode&&text.length>22">展开</text>
							<text class="open" @click.stop="isMode=false" v-if="isMode&&text.length>22">收起</text>
						</view> -->
					</view>
					<view class="right">
						<button class="blue" :data-share="item.share" v-if="item.bid_status == 1 " open-type="share" @click.stop="">助力分享</button>
						<button class="blue" v-else-if="item.bid_status == 0 ||item.bid_status == 3 " @click.stop="clickBlue(index)">{{item.bid_status === 0? '申请代理' :'电话沟通'}}</button>
						<button class="orange" v-else-if="item.bid_status === 2 || item.bid_status === 5" @click.stop="clickOrg(index)">{{item.bid_status === 2? '已申请' :'申请按比例返还'}}</button>
						<button class="orange" v-else-if="item.bid_status === 4">已被代理</button>
						<button class="blue-on" v-else-if="info.bid_status === 6" @click.stop="">已申请</button>
						<button class="white"  v-else @click.stop="">已结束</button>
					</view>
				</view>
			</view>
			<view class="center null" v-if="list.length == 0" style="padding-top: 50upx;padding-bottom: 100upx;">
				<image src="/static/images/kym_qsy_image.png"></image>
				<view class="text">暂无数据</view>
			</view>
			<view class="" style="height: 200upx;background: #F5F7FA;">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			list: Array	
		},
		watch:{
			list(newVal,old){
				for(let i in newVal){
					if(this.all[i]){
						this.all[i] = false
					}
				}
			}
		},
		data() {
			return {
				all:[],
				isMode:false,
				text:'12312312312312312323123123123123123123123123123123123123123123123123123',
				userType:uni.getStorageSync('type')
			}
		},
		methods: {
			clickOrg(index){
				this.$emit('clickBtn',index)
			},
			clickBlue(index){
				this.$emit('clickBtn',index)
			},
			clickAll(index){
				this.$set(this.all,index,!this.all[index])
				// all[index] = true
			},
			toDetail(id){
				uni.navigateTo({
				    url: '/pagesV2/index/detail/detail?id=' + id + '&isFrom=' + 1
				});
			}
		},
		onReady(){
			
		}
	}
</script>

<style scoped lang="scss">
	.wrap{
		width: 0;
		display: flex;
		flex: 1;
		.text{
			font-size: 28upx;
			overflow: hidden;
			  line-height: 40upx;
			  color: #888D98;
			  max-height: 40upx;
			  word-wrap: break-word;
			  word-break: normal;
			  position: relative;
			  white-space: pre-line;
			.btn{
				height: 40upx;
				line-height: 40upx;
				width: 56upx;
				position: relative;
				float: right;
				clear: both;
				margin-left: 45upx;
				font-size: 26upx;
				padding: 0;
				background: #fff;
				border-radius: 4upx;
				color:  #0061FF;
				cursor: pointer;
				border:0;
				overflow: visible;
			}
			.btnBefore::before{ 
				content: '...';
			  position: absolute;
			  left: -10upx;
			  color: #888D98;
			  transform: translateX(-100%);
				
			}
		}
		.text::before{
		  content: '';
		  float: right;
		  width: 0upx;
		  height: 100%;/*先随便设置一个高度*/
		  background: red ;
		  margin-bottom: -40upx;
		}
		.textAfter::after {
		    content: '';
		    width: 100%;
		    height: 100%;
		    position: absolute;
		    background: #fff;
		}
	}
	.list{
			background: #F5F7FA;
			padding-top: 16upx;
		.item{
			padding: 14upx 24upx 20upx;
			margin: 0 32upx 16upx 32upx;
			background: #FFFFFF;
			box-shadow: 0px 4upx 10upx rgba(0, 17, 71, 0.1);
			border-radius: 16upx;
			overflow: hidden;
			font-size: 28upx;
			.address{

			}
			.tag{
				background: linear-gradient(90deg, #FFB870 0%, #FF7C5A 100%);
				border-radius: 4upx;
				line-height: 28upx;
				color: #fff;
				font-size: 22upx;
				padding:0 14upx;
				margin-right: 12upx;
			}
			.mode{
				color: #677592;
				font-size: 26upx;
			}
			.info{
				padding: 20upx 0;
				border-bottom: 1upx solid #ECEFF4;
				border-top: 1upx solid #ECEFF4;
				margin: 16upx 0 20upx;
				position: relative;
			}
			.foot{
				.left1{
					width: calc(100% - 200upx);
					position: relative;
					display: flex;
					text{
						color: #888D98;
					}
					.open{
						width: 60upx;
						color: #0061FF;
						position: absolute;
						right: 0;
					}
				}
				.right{
					margin-left: 20upx;
					button{
						height: 48upx;
						line-height: 48upx;
						font-size: 24upx;
						padding: 0 22upx;
						border-radius: 100px;
						min-width: 140upx;
					}
					.blue{
						color: #fff;
						background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%)!important;
					}
					.blue-on{
						color: #0061FF;
						padding: 0 34upx;
						border: 2upx solid #0061FF;
					}
					.orange{
						color: #fff;
						background: linear-gradient(90deg, #FFB870 0%, #FF7C5A 100%)!important;
					}
					.gray{
						background: linear-gradient(90deg, #97A5C7 0%, #8396B9 100%);
						color: #FFFFFF;
					}
					.white{
						background: #fff;
						color: #C9CED9;
					}
				}
			}
			.money{
				font-size: 24upx;
				position: absolute;
				right: 0;
				text{
					font-size: 44upx;
					font-weight: bold;
					line-height: 84upx;
					color: #FF6E57;
				}
			}
			.hint{
				height: 48upx;
				line-height: 48upx;
				padding: 0 20upx;
				text-align: center;
				background: #FEEEE7;
				border-radius: 8upx;
				font-size: 26upx;
				font-weight: 500;
				color: #FF7639;
				margin-top: 16upx;
			}
			.img{
				width: 124upx;
				height: 124upx;
				background: #9AAAFF;
				border-radius: 8upx;
				margin-right: 16upx;
			}
			.title{
				width: 336upx;
				height: 124upx;
				line-height: 42upx;
				font-weight: bold;
			}
		}
	}
	.head{
		margin-top: 40upx;
		padding: 0 32upx;
		.left{
			font-size: 36upx;
			 
			font-weight: 800;
			line-height: 54upx;
			color: #222222;
			opacity: 1;
		}
		.right{
			flex: 1;
			font-size: 22upx;
			 
			font-weight: 500;
			line-height: 54upx;
			color: #888D98;
			opacity: 1;
			text-align: end;
		}
	}
	
</style>
