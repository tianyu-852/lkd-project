<template>
	<u-popup v-model="value" mode="center" border-radius="32">
		<view class="orderDetailBox">
			<view class="title flex-row" v-if="type==0">有用户邀请您为指定律师
				<!-- <u-icon class="close" name="close" color="#C9CED9" @click="value=false"></u-icon> -->
			</view>
			<view class="top flex between">
				<view class="user flex hcenter">
					<image :src="orderInfo.user.avatar" mode=""></image>
					<view>
						<view class="flex hcenter">
							<text>{{orderInfo.user.nickname}}</text>
							<text class="tag" v-if="!orderInfo.type&&orderInfo.user.work_year">执业{{orderInfo.user.work_year}}年</text>
						</view>
						<view class="h6" v-if="!orderInfo.type">{{orderInfo.user.lawyer_office}}</view>
					</view>
				</view>
				<view class="call" @click="getPhoneNum()">
					<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662694049872-3niYsJ.png"></image>
					<view>拨打电话</view>
				</view>
			</view>
			<view class="content" v-if="type==1">
				<view class="title flex between">
					<view class="flex hcenter">
						<view>{{orderInfo.lawyer_product_category_name}}</view>
						<view v-if="orderInfo.status==13" class="tag green">待接单</view>
						<view v-if="orderInfo.status==20" class="tag red">未完成</view>
						<view v-if="orderInfo.status==23" class="tag red">未交付</view>
						<view v-if="orderInfo.status==24" class="tag orange">已交付</view>
						<view v-if="orderInfo.status==25" class="tag orange">进行中</view>
						<view v-if="orderInfo.status==30" class="tag purple">待评价</view>
						<view v-if="orderInfo.status==40" class="tag blue">已完成</view>
					</view>
					<text>￥{{orderInfo.price}}</text>
				</view>
				<view class="decs">
					<text>服务类型</text> {{orderInfo.lawyer_product_name}}<text> 丨 服务时间 </text>{{orderInfo.service_time}}
				</view>
				<view class="line"></view>
				<view class="textarea">
					<rich-text :nodes="orderInfo.introduction"></rich-text>
				</view>
				<view class="button flex hcenter" v-if="orderInfo.status==13">
					<button :class="[!orderInfo.type?'max':'min']" @click="cancelOrder(orderInfo.order_no)">取消订单</button>
					<button class="min blue" v-if="orderInfo.type" @click="confirmOrder(orderInfo.order_no)">确认接单</button>
				</view>
				<view class="close">
					<u-icon name="close" color="#C9CED9" @click="value=false"></u-icon>
				</view>
			</view>
			<view class="content" v-if="type==0">
				<view class="flex-row between cell">
					<text>为谁筹款</text>
					<text>为其他人/自己</text>
				</view>
				<view class="flex-row between cell">
					<text>姓名</text>
					<text>陈芸雪</text>
				</view>
				<view class="flex-row between cell">
					<text>发起时间</text>
					<text>2020年12月21日</text>
				</view>
				<view class="button flex-row hcenter">
					<button class="btn" @click="value=false">取消</button>
					<button :class="['btn' ,'blue', 'big']" @click="confirmOrder(orderInfo.order_no)">确认委托</button>
				</view>
			</view>
			<view class="content2 flex-column" v-if="type==2">
				<view class="title flex-row between" >
					<text>诉求详情</text>
					<view class="flex-row hcenter">
						<view class="color0061FF">了解案情</view>
						<image class="ck" src="/static/images/ck_icon_blue.svg"></image>
					</view>
				</view>
				<view class="wrap marlr32">
					<view class="text" :style="all?'max-height: none;':''">
						<button class="btn" v-if="!all" @click="all = true">显示全部</button>
						{{orderInfo.appeal}}
					</view>
				</view>
				<view class="textarea">
					<image src="/static/images/sr_icon.svg" v-if="!info.content" mode=""></image>
					<u-input v-model="info.content" :clearable="false"  type="textarea" height="236" placeholder="发表观点，获得更多认可"  maxlength="300" :custom-style="{fontSize: '28rpx',padding:'0'}"/>
				</view>
				<view class="marlr32 submit" @click="bidLawyer">发布观点</view>
				<image @click="clickClose" class="close" src="/static/images/gb_icon_nobg.svg" mode=""></image>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import {
		// getLawyerServiceOrder,
		
	} from "@/api/apis.js"
	export default {
		props: {
			value:Boolean,
			orderInfo:Object,
			type:{
				type:Number,
				default:0
			}
		},
		data(){
			return{
				all:false,
				info:{
					content:''
				}
			}
		},
		model: {
			prop:'value',
		    event: 'input'
		},
		watch:{
			value(newVal, oldVal){
				this.$emit('input',newVal)
			},
		},
		methods:{
			bidLawyer(){
				this.$emit('submit',{
					fundraising_id:this.orderInfo.fundraising_id,
					content:this.info.content?this.info.content:'',
					index:this.orderInfo.index
				})
			},
			clickClose(){
				this.$emit('input',false)
			}
		}
	}
</script>

<style scoped lang="scss">
	.content2{
		.close{
			width: 26upx;
			height: 26upx;
			padding-top: 40upx;
			padding-bottom: 44upx;
			margin: auto;
		}
		.textarea{
			margin: 28upx 32upx 52upx 32upx;
			padding: 24upx 32upx;
			background: #F3F5F8;
			border-radius: 8upx;
			/deep/ .u-input__textarea::placeholder{
				color: #888D98 !important;
			}
			image{
				width: 24upx;
				height: 24upx;
				float: left;
				margin-top: 8upx;
				margin-right: 12upx;
			}
			
		}
		.submit{
			line-height: 88upx;
			background: #0061FF;
			border-radius: 12upx;
			text-align: center;
			font-size: 34upx;
			font-weight: bold;
			color: #FFFFFF;
		}
		.title{
			display: flex;
			.color0061FF{
				font-size: 28upx;
			}
			text{
				line-height: 50upx;
				font-size: 36upx;
				font-weight: bold;
				color: #222222;
			}
			image{
				width: 30upx;
				height: 30upx;
				margin-left: 12upx;
			}
			.ck{
				width: 14upx;
				height: 22upx;
			}
		}
	}
	.wrap{
		display: flex;
		.text{
			font-size: 26upx;
			overflow: hidden;
		    // text-overflow: ellipsis;
		    // text-align: justify;
			  /* display: flex; */
			/*   display: -webkit-box;
			  -webkit-line-clamp: 3;
			  -webkit-box-orient: vertical; */
			  line-height: 1.5;
			color: #888D98;
			  max-height: 3em;
			  position: relative;
			.btn{
				height: 40upx;
				line-height: 40upx;
				width: 104upx;
				position: relative;
				float: right;
				clear: right;
				margin-left: 45upx;
				font-size: 26upx;
				padding: 0;
				background: #fff;
				border-radius: 4upx;
				color:  #677592;
				cursor: pointer;
				border:0;
				overflow: visible;
			}
			.btn::before{
			  content: '...';
			  position: absolute;
			  left: -10upx;
			  color: #888D98;
			  transform: translateX(-100%)
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
		.text::after {
		    content: '';
		    width: 100%;
		    height: 100%;
		    position: absolute;
		    background: #fff;
		}
	}
	.content .button {
	    margin: 0;
		margin-top: 40upx;
	}
	.cell{
		font-size: 30upx;
		line-height: 98upx;
		color: #222222;
		border-bottom: 1upx solid #ECEFF4;
	}
	.title{
		display: block;
		line-height: 48upx;
		font-size: 34upx;
		font-weight: bold;
		color: #222222;
		position: relative;
		text-align: center;
		padding: 32upx;
		.close{
			position: absolute;
			right: 0;
		}
	}
	.btn{
		flex: 1;
		font-size: 32upx;
		font-weight: bold;
		line-height: 88upx;
		color: #222222;
		background: #F3F5F8;
		border-radius: 8upx;
	}
	.blue{
		color: #fff;
		background-color: #0061FF;
		margin-left: 16upx;
	}
	.big{
		flex: none;
		width: 366upx;
	}
	.content{
		padding-top: 0;
		// padding: 0;
		
	}
	.orderDetailBox{
		width:calc(100vw - 64upx)
	}
	.orderDetailBox{
		// max-width: 686upx;
		min-width: 600upx;
		.top{
			padding: 32upx 32upx 20upx;
			border-bottom: 12upx solid #F5F7FA;
			.user{
				font-size: 32upx;
				font-weight: bold;
				line-height: 48upx;
				.h6{
					font-size: 24upx;
					font-weight: 500;
					line-height: 36upx;
				}
				image{
					width: 130upx;
					height: 130upx;
					margin-right: 20upx;
					border-radius: 50%;
				}
			}
			.call{
				color: #0061FF;
				font-size: 24upx;
				font-weight: bold;
				line-height: 36upx;
				text-align: center;
				image{
					width: 80upx;
					height: 80upx;
					margin-bottom: 8upx;
				}
			}
			.tag{
				border: 2upx solid #5B86FF;
				margin-left: 12upx;
				padding: 1upx 8upx 1upx 8upx;
				border-radius: 4upx;
				font-size: 20upx;
				line-height: 30upx;
				font-weight: bold;
				color: #5B86FF;
			}
		}
		.content{
			padding: 28upx 32upx 40upx;
			.title{
				font-size: 36upx;
				font-weight: bold;
				line-height: 50upx;
				text{
					color: #FF4040;
					font-size: 40upx;
				}
			}
			.tag{
				height: 36upx;
				margin-left: 12upx;
				padding: 0 14upx;
				border-radius: 8upx;
				font-size: 24upx;
				line-height: 36upx;
			}
			.red{
				color: #FF3951;
				background-color: #FEE7E7;
			}
			.blue{
				color: #0061FF;
				background-color: #E7F3FE;
			}
			.purple{
				color: #516EBC;
				background-color: #DFE9FF;
			}
			.green{
				color: #18C295;
				background-color: #BBF1E2;
			}
			.orange{
				color: #FF7639;
				background-color: #FEEEE7;
			}
			.line{
				margin: 28upx 0;
			}
			.decs{
				margin-top: 20upx;
				text{
					color: #888D98;
					margin-right: 8upx;
				}
				.line1{
					width: calc(100% - 120upx);
				}
				.icon{
					width: 100upx;
					color: #677592;
					font-size: 24upx;
				}
			}
			.button{
				margin: 40upx 0;
				button{
					height: 88upx;
					background: #F3F5F8;
					border-radius: 12upx;
				}
				.blue{
					color: #fff;
					background-color: #0061FF;
				}
				.max{
					width: 100%;
				}
				.min{
					width: calc(50% - 8upx);
				}
			}
			.close{
				margin-top: 20upx;
				text-align: center;
			}
		}
	}
</style>
