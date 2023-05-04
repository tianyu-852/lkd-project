<template>
	<view class="">
		<view class="box font28 hidden">
			<!-- <view class="cell bold">选择需求</view> -->
			<view class="tagBox flex between borderB bottom16 martop24" v-if="!editData">
				<view v-for="(item,index) in info" :key="index" :class="['tag',typeIndex==index?'on':'']" @click="onType(index)">{{item.demand_type}}</view>
				<view class="tag" v-for="(item,index) in remainder[0]" :key="index" style="border: none;"></view>
			</view>
			<view class="tagBox flex between" v-if="!editData">
				<view v-for="(item,index) in info[typeIndex].children" :key="index" :class="['tag',childrenIndex==index?'on':'']" @click="onChildren(index)">{{item.demand_type}}</view>
				<view class="tag" v-for="(item,index) in remainder[1]" :key="index" style="border: none;"></view>
			</view>
			<view :class="['bottom32 color6E7695',editData?'martop32':'']">
				{{info[typeIndex].children[childrenIndex].introduction||''}}
			</view>
		</view>
		
		<view class="box font32 hidden" v-if="info[typeIndex].children.length">
			<view class="cell flex hcenter between">
				<view class="bold">涉及分类</view>
				<view class="color888D98 font28 flex hcenter" @click="openTag(info[typeIndex].children[childrenIndex].is_lawyer_tag)">
					<text v-if="info[typeIndex].children[childrenIndex].is_lawyer_tag">{{tags.lawyer_tag||'请选择涉及分类'}}</text>
					<text v-else>{{!tags.show?(tags.category||'请选择涉及分类'):'自定义'}}</text>
					<u-icon name="play-right-fill" class="left12" color="#6E7695" size="16"></u-icon>
				</view>
				<view class="inputBox2 widthAll flex" v-if="tags.show">
					<input type="text" class="flex1" placeholder="请输入自定义分类" v-model="tags.category">
				</view>
			</view>
			<view class="cell flex hcenter between">
				<view class="bold">律师地区</view>
				<view class="color888D98 font28 flex hcenter" @click="onAddress">
					<text>{{address.city||'请选择律师地区'}}</text>
					<u-icon name="play-right-fill" class="left12" color="#6E7695" size="16"></u-icon>
				</view>
			</view>
			<view class="cell flex hcenter between" v-if="activeId==13">
				<view class="bold">服务时长</view>
				<text class="color888D98 font28">24小时</text>
			</view>

			<view class="cell flex hcenter between" v-if="activeId==7">
				<view class="bold">关押地点</view>
				<!-- <input type="digit" placeholder="请选择关押地点" v-model="form.imprisoned_address" /> -->
				<view class="inputBox2 widthAll flex">
					<input type="text" class="flex1" placeholder="请选择关押地点" v-model="form.imprisoned_address">
				</view>
			</view>
			<view :class="['cell flex hcenter between',form.detention_slip_image?'border_no':'']" v-if="activeId==7">
				<view class="bold">拘留单</view>
				<view class="flex hcenter color0061FF font24" @click="upLoad2">
					<image src="/static/images/sczp_icon3.png" class="width28" mode="widthFix"></image>
					<text class="left8">上传拘留单</text>
				</view>
			</view>
			<view class="imgBox flex widthAll borderB" v-if="form.detention_slip_image">
				<view class="img-item relative">
					<image :src="form.detention_slip_image" class="" mode="aspectFill"></image>
					<image src="/static/images/gb_icon.png" class="close" mode="widthFix" @click="form.detention_slip_image=''"></image>
				</view>
			</view>
			<view class="cell flex hcenter between" v-if="activeId==9" @click="addRecipient">
				<view class="bold">收件人信息</view>
				<view class="flex hcenter relative">
					<text class="color888D98 font28">{{form.addressee_address?'已添加':'未添加'}}</text>
					<u-icon name="play-right-fill" class="left12" color="#6E7695" size="16"></u-icon>
				</view>
			</view>
			<view class="cell flex hcenter between" v-if="activeId==7||activeId==10||activeId==11">
				<view class="bold">市场参考价</view>
				<text class="tag font28">{{info[typeIndex].children[childrenIndex].guide_price}}元</text>
			</view>
			<!-- <view class="cell flex hcenter between" v-if="(info[typeIndex].demand_type_id!=3&&orderStatus.is_can_display_call_phone_demand_order)||info[typeIndex].demand_type_id==2">
				<view class="bold">原价</view>
				<text class="font30 bold">{{info[typeIndex].children[childrenIndex].price}}元</text>
			</view> -->
			<!-- <view class="cell flex hcenter between" v-if="(info[typeIndex].demand_type_id!=3&&orderStatus.is_can_display_call_phone_demand_order)||info[typeIndex].demand_type_id==2">
				<view class="bold" v-if="isVip==0">会员福利价</view>
				<view class="bold colorFE5C5C" v-else-if="isVip==1">月卡福利价</view>
				<view class="bold colorFE5C5C" v-else>年卡福利价</view>
				<text class="colorFE5C5C font30 bold" v-if="info[typeIndex].demand_type_id!=1">{{info[typeIndex].children[childrenIndex].vip_price}}元</text>
				<text class="colorFE5C5C font30 bold" v-else>会员免费</text>
				<view class="martop20 widthAll" v-if="isVip!=2">
					<vipHint :title="isVip?'升级会员，立享年卡福利价'+info[typeIndex].children[childrenIndex].min_vip_price+'元':'30天不限次深度电话咨询'" :num="!isVip?orderStatus.vip_month_price:''"></vipHint>
				</view>
			</view> -->
			<view class="cell flex hcenter between" v-if="activeId==7||activeId==10||activeId==11">
				<view class="bold">委托报价</view>
				<view :class="['flex hcenter radio',form.is_talk_detail?'radio_on':'']" @click="form.is_talk_detail=!form.is_talk_detail">
					<image :src="form.is_talk_detail?'/static/images/gx_icon_sel.svg':'/static/images/gx_icon.svg'" class="width28" mode="widthFix"></image>
					<text class="left8 font28">详谈</text>
				</view>
				<view class="inputBox widthAll center flex" v-if="!form.is_talk_detail">
					<text class="flex1">输入金额</text>
					<input type="text" class="flex1 border-r" placeholder="最低金额" v-model="form.lawyer_quote_min">
					<input type="text" class="flex1 border-r" placeholder="最高金额" v-model="form.lawyer_quote_max">
				</view>
			</view>
				
			<view class="cell flex hcenter between" v-if="activeId==10||activeId==11">
				<view class="bold">标的额</view>
				<view class="flex hcenter relative">
					<input type="digit" placeholder="选填" placeholder-class="font28 color888D98" v-model="form.case_money" />
				</view>
			</view>
			<view class="cell flex hcenter between" v-if="info[typeIndex].demand_type_id==3">
				<view class="bold">是否允许意向律师回拨</view>
				<view class="flex hcenter relative">
					<u-switch v-model="form.is_lawyer_call_phone"></u-switch>
				</view>
			</view>
			<view class="cell" v-if="!orderStatus.is_can_display_call_phone_demand_order&&info[typeIndex].demand_type_id==1">
				<view class="flex between hcenter hintBox" v-if="orderStatus.is_demand_order_have_lawyer">
					<view class="width400">您已有正在进行中订单，可继续咨询该委托律师</view>
					<view class="button" @click="toImDetail">继续咨询</view>
				</view>
				<view class="flex hcenter hintBox" v-else>
					<text>正在为您匹配律师，律师接单后将在第一时间联系您请耐心等待注意来电接听</text>
				</view>
			</view>
			<view class="textBox" v-if="activeId==4||activeId==5||activeId==6||activeId==7||activeId==9||activeId==10||activeId==11">
				<textarea maxlength="300" v-model="form.content" placeholder="请输入协作详情" placeholder-class="font30" placeholder-style="color:#C9CED9"/>
				<view class="hint">({{form.content.length||0}}/300字)</view>
			</view>
			<!-- <view class="imgBox bottom32 flex" v-if="activeId==4||activeId==5||activeId==6||activeId==7||activeId==9">
				<view class="img-item relative" v-for="(item,index) in form.related_images">
					<image :src="item" class="" mode="aspectFill"></image>
					<image src="/static/images/gb_icon.png" class="close" mode="widthFix" @click="removeHonor(index)"></image>
				</view>
				<view class="upLoad center" @click="upLoad" v-if="(activeId!=7&&form.related_images.length<9)||(activeId==7&&!form.related_images.length)">
					<image src="/static/images/sctp9_icon.svg" class="width64 martop40 bottom16" mode="widthFix"></image>
					<view class="color6E7695">上传照片</view>
				</view>
			</view> -->
		</view>

		<view class="box" v-if="activeId==4||activeId==5||activeId==6||activeId==7||activeId==9">
			<view class="cell flex hcenter between">
				<view class="bold font32">图片</view>
				<view class="flex hcenter color0061FF font24" @click="upLoad">
					<image src="/static/images/sczp_icon3.png" class="width28" mode="widthFix"></image>
					<text class="left8">上传图片（{{form.related_images.length}}/9）</text>
				</view>
			</view>
			<view class="imgBox bottom32 flex" v-if="form.related_images.length">
				<view class="img-item relative" v-for="(item,index) in form.related_images" :key="index">
					<image :src="item" class="" mode="aspectFill"></image>
					<image src="/static/images/gb_icon.png" class="close" mode="widthFix" @click="removeHonor(index)"></image>
				</view>
				<!-- <view class="upLoad center" @click="upLoad" v-if="(activeId!=7&&form.related_images.length<9)||(activeId==7&&!form.related_images.length)">
					<image src="/static/images/sctp9_icon.svg" class="width64 martop40 bottom16" mode="widthFix"></image>
					<view class="color6E7695">上传照片</view>
				</view> -->
			</view>
		</view>

		<view class="foot">
			<view class="flex between" v-if="!orderStatus.is_can_display_call_phone_demand_order&&activeId==13">
				<view class="left32 martop20 flex1">
					<text v-if="orderStatus.is_demand_order_have_lawyer">如需更换委托律师，请联系法律管家</text>
					<text v-else>如有紧急需求，请联系法律管家</text>
				</view>
				<view class="subBtn" @click="toCustomer">法律管家</view>
			</view>
			<view class="flex between" v-else>
				<view class="left32 martop20" v-if="info[typeIndex].demand_type_id==1&&isVip>0">
					会员免费咨询
				</view>
				<view class="left32 martop20" v-else-if="info[typeIndex].demand_type_id!=3">
					{{info[typeIndex].children[childrenIndex].demand_type}}
					<text class="font40 bold">{{isVip?info[typeIndex].children[childrenIndex].min_vip_price:info[typeIndex].children[childrenIndex].price}}</text>元
				</view>
				<view class="left32 martop20" v-else>
					会员免费发布
				</view>
				<view class="subBtn" @click="submit">立即发布</view>
			</view>
		</view>
		
		<u-select v-model="types.status" :list="info[typeIndex].children[childrenIndex].categories" label-name="category" value-name="category_id" @confirm="typesChange"></u-select>
		<addressBox ref="address" type='1' @setTypes="setAddress" @openAdr="openAdr"></addressBox>
		<typesBox ref="types" @setTypes="setTypes"></typesBox>
		
		<u-mask :show="vipPop">
			<view class="popBox flex hcenter flexcenter" @click="vipPop = 0">
				<view class="relative width550" @click.stop="">
					<view class="del" @click="vipPop = 0"></view>
					<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_fbcg_image.png" class="widthAll" mode="widthFix"></image>
					<view class="marlr32 button center flex between" @click="vipPop = 0">
						<view class="gray" @click="toCustomer()">官方客服</view>
						<view class="blue" @click="toLink('/my/payVip')">了解会员特权</view>
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
import { getDemandOrder, getDisplayDemandTypes, getDemandOrderDisplay, getLocation } from "@/api/apis.js"
import { server } from "@/request.js"
import addressBox from "@/components/address.vue"
import typesBox from "@/components/types.vue"
	
export default {
	components: { addressBox, typesBox },
	data() {
		return {
			address:{},
			vipPop:0,
			form:{
				is_talk_detail:0,
				lawyer_quote_min:'',
				lawyer_quote_max:'',
				addressee_nickname:'',
				addressee_mobiles:[],
				addressee_address:'',
				is_lawyer_call_phone:0,
				imprisoned_address:'',
				case_money:'',
				content:'',
				detention_slip_image:'',
				related_images:[]
			},
			customer: {},
			activeId: 0,
			type: 0,
			remainder: [0,0],
			orderStatus: {
				is_can_display_call_phone_demand_order:0
			},
			tags:{
				show:0,
				category:'',
				category_id:''
			},
			types:{
				status:false,
				list:[],
				index:[0,0],
				old:[0,0]
			},
			info:null,
			isVip:null,
			typeIndex:0,
			childrenIndex:0,
			editData:null
		}
	},
	onLoad(e) {
		if(e.edit) this.editData=JSON.parse(e.edit)
		if(e.typeIndex) this.typeIndex=parseInt(e.typeIndex)
		if(e.childrenIndex) this.childrenIndex=parseInt(e.childrenIndex)
	},
	onShow() {
		this.isVip=uni.getStorageSync('is_vip')
		this.customer=uni.getStorageSync('customer')
		if(!this.info)
			this.getConfig()
		if(!this.orderStatus.is_can_display_call_phone_demand_order)
			this.getOrderStatus()
		
	},
	methods: {
		setInfo(e){
			console.log(e)
			this.address={
				city:e.lawyer_city,
				city_id:e.lawyer_city_id,
				province:e.lawyer_province,
				province_id:e.lawyer_province_id
			}
			
			this.form={
				is_talk_detail:e.is_talk_detail,
				lawyer_quote_min:e.lawyer_quote_min,
				lawyer_quote_max:e.lawyer_quote_max,
				addressee_nickname:e.addressee_nickname,
				addressee_mobiles:e.addressee_mobiles,
				addressee_address:e.addressee_address,
				is_lawyer_call_phone:e.is_lawyer_call_phone,
				imprisoned_address:e.imprisoned_address,
				case_money:e.case_money,
				content:e.content,
				detention_slip_image:e.detention_slip_image,
				related_images:e.related_images
			}
			for(var i=0;i<this.info.length;i++){
				for(var j=0;j<this.info[i].children.length;j++){
					if(this.info[i].children[j].demand_type_id==e.demand_type_id){
						this.activeId=this.info[i].children[j].demand_type_id
						this.typeIndex=i
						this.childrenIndex=j
						if(this.info[i].children[j].is_lawyer_tag){
							this.tags={
								show:e.is_self_help,
								lawyer_tag:e.category,
								lawyer_tag_id:e.category_id
							}
						}else{
							this.tags={
								show:e.is_self_help,
								category:e.category,
								category_id:e.category_id
							}
						}
						uni.setNavigationBarTitle({
							title:this.info[i].demand_type+'-'+this.info[i].children[j].demand_type
						})
						return
					}
				}
			}
			
		},
		openTag(e){
			console.log(e)
			if(e){
				this.$refs.types.props.status=1
			}else{
				this.types.status=true
			}
		},
		toLink(e){
			uni.navigateTo({
				url: e
			})
		},
		toCustomer(){
			uni.navigateTo({
				url: `/pagesV1/info/infoDetails?id=${this.customer.user_id}&name=${this.customer.nickname}`
			})
		},
		getOrderStatus(){
			getDemandOrderDisplay().then(res=>{
				if(res.data.code==0){
					this.orderStatus=res.data.data
				}else{
					uni.$u.toast('获取配置错误')
				}
			})
		},
		toImDetail(){
			if(!this.orderStatus.lawyer_user_id){
				uni.$u.toast('获取律师数据失败')
				return
			}
			uni.navigateTo({
				url: `/pagesV1/info/infoDetails?id=${this.orderStatus.lawyer_user_id}&name=${this.orderStatus.lawyer_nickname}`
			})
		},
		getConfig(){
			getDisplayDemandTypes().then(res=>{
				if(res.data.code==0){
					this.info=res.data.data
					this.activeId=this.info[this.typeIndex].children[this.childrenIndex].demand_type_id
					this.count()
					if(this.editData)
						this.setInfo(this.editData)
				}else{
					uni.$u.toast('获取配置错误')
				}
			})
		},
		count(){
			if(this.info.length>3){
				this.remainder[0]=this.info.length%3
			}else{
				this.remainder[0]=3-this.info.length
			}
			if(this.info[this.typeIndex].children.length>3){
				this.remainder[1]=this.info[this.typeIndex].children.length%3
			}else{
				this.remainder[1]=3-this.info[this.typeIndex].children.length
			}
		},
		onType(index){
			this.typeIndex=index
			this.childrenIndex=0
			this.activeId=this.info[this.typeIndex].children[this.childrenIndex].demand_type_id
			this.formInit()
			this.count()
			// this.types.status=false
		},
		onChildren(index){
			this.childrenIndex=index
			this.activeId=this.info[this.typeIndex].children[this.childrenIndex].demand_type_id
			this.formInit()
		},
		formInit(){
			this.tags={}
			this.address={}
			this.form={
				is_talk_detail:0,
				lawyer_quote_min:'',
				lawyer_quote_max:'',
				addressee_nickname:'',
				addressee_mobiles:[],
				addressee_address:'',
				is_lawyer_call_phone:0,
				imprisoned_address:'',
				case_money:'',
				content:'',
				detention_slip_image:'',
				related_images:[]
			}
		},
		addRecipient(){
			uni.navigateTo({
				url:'/pagesV1/need/addRecipient',
				events:{
					success:res=>{
						//返回成功 修改参数
						console.log(res)
						this.form.addressee_nickname=res.addressee_nickname
						this.form.addressee_mobiles=res.addressee_mobiles
						this.form.addressee_address=res.addressee_address
					}
				}
			})
		},
		// getBillDetail(id){
		// 	getBillDetail({balance_detail_id:id}).then(res=>{
		// 		console.log(res.data.data)
		// 		if(res.data.code==0){
		// 			this.info=res.data.data
		// 		}
		// 	})
		// },
		// getType(){
		// 	getFCaseType().then(res=>{
		// 		if(res.data.code==0){
		// 			this.types.list=res.data.data
		// 		}
		// 	})
		// },
		submit(){
			var is_lawyer_tag=this.info[this.typeIndex].children[this.childrenIndex].is_lawyer_tag
			if(this.info[this.typeIndex].demand_type_id==3&&!this.isVip){
				this.vipPop=1
				return
			}
			if((is_lawyer_tag&&!this.tags.lawyer_tag_id)||(!is_lawyer_tag&&!this.tags.category_id)){
				uni.$u.toast('请选择涉及分类')
				return
			}
			if(!this.address.province_id){
				uni.$u.toast('请选择律师地域')
				return
			}
			if(!this.address.city_id){
				uni.$u.toast('请重新选择律师地域')
				return
			}
			if(!this.form.is_talk_detail&&(!this.form.lawyer_quote_min||!this.form.lawyer_quote_max)&&this.info[this.typeIndex].demand_type_id==3){
				uni.$u.toast('请输入最低或最高金额')
				return
			}
			// if(!this.form.dividends){
			// 	uni.$u.toast('请填写案源费')
			// 	return
			// }
			// if(this.form.dividends>100){
			// 	uni.$u.toast('案源费必须小于等于100%')
			// 	return
			// }
			console.log(this.form.addressee_mobiles)
			getDemandOrder({
				demand_type_id:this.activeId,
				category_id: is_lawyer_tag?this.tags.lawyer_tag_id:this.tags.category_id,
				category: is_lawyer_tag?this.tags.lawyer_tag:this.tags.category,
				lawyer_province_id:this.address.province_id,
				lawyer_city_id:this.address.city_id,
				is_talk_detail:this.form.is_talk_detail?1:0,
				lawyer_quote_min:this.form.lawyer_quote_min,
				lawyer_quote_max:this.form.lawyer_quote_max,
				addressee_nickname:this.form.addressee_nickname,
				addressee_mobiles:JSON.stringify(this.form.addressee_mobiles),
				addressee_address:this.form.addressee_address,
				is_lawyer_call_phone:this.form.is_lawyer_call_phone?1:0,
				imprisoned_address:this.form.imprisoned_address,
				case_money:this.form.case_money,
				content:this.form.content,
				related_images:JSON.stringify(this.form.related_images),
				detention_slip_image:this.form.detention_slip_image
			}).then(order_no=>{
				if(order_no.data.code==0){
					if(order_no.data.data.money_real==0){
						uni.navigateBack()
						uni.$u.toast('发布成功')
						return
					}
					
					uni.navigateTo({
						url:`/pagesV2/pay/pay?id=${order_no.data.data.order_no}`,
						events:{
							over:res=>{
								setTimeout(()=>{
									uni.navigateBack()
									uni.$u.toast('发布成功')
								},500)
								
								}
						}
					})
				}else{
					uni.$u.toast(order_no.data.message)
				}
			})
		},
		// setInfo(res){
		// 	if(res.data.code==0){
		// 		uni.navigateBack()
		// 		uni.$u.toast('报名成功')
		// 	}else{
		// 		uni.$u.toast(res.data.message)
		// 	}
		// },
		// sendRequire(){
		// 	this.form.is_need_stamp=this.requires.check
		// 	this.form.special_requirement=this.requires.value
		// 	this.requires.status=false
		// },
		// dateChange(e){
		// 	console.log(e)
		// 	this.form.due_hours=e.year+'-'+e.month+'-'+e.day+' '+e.hour+':00'
		// 	this.date.text=e.year+'年'+e.month+'月'+e.day+'日'+e.hour+'时'
		// },
		
		// typeChange(e){
		// 	console.log(e.detail.value)
		// 	this.types.old=e.detail.value
		// },
		// toType(type){
		// 	uni.navigateTo({
		// 		url:`/pages/need/releaseType?type=${type}&active=${JSON.stringify(type==2?this.active.list:this.active.text)}`,
		// 		events:{
		// 			over:res=>{
		// 				console.log(res)
		// 				console.log(type)
		// 				if(type==0){
		// 					this.form.archive_type=res
		// 					this.active.text=res
		// 				}else if(type==1){
		// 					this.form.lawyer_corporate_type=res
		// 					this.active.text=res
		// 				}else if(type==2){
		// 					this.form.exist_information=res
		// 					this.active.list=res
		// 					console.log('active',this.form.exist_information)
		// 				}
		// 			}
		// 		}
		// 	})
		// },
		upLoad(){
			if(this.form.related_images.length>=9) {
				uni.$u.toast('最多不能超过9张')
				return
			}
			uni.chooseImage({
				count: 9,
				success: blob => {
					if(this.form.related_images.length+blob.tempFilePaths.length>9) {
						uni.$u.toast('最多不能超过9张')
						return
					}
					blob.tempFilePaths.forEach((item, index) => {
						this.uploadFile(blob.tempFilePaths[index],1)
					})
					
				}
			})
		},
		uploadFile(url,num){
			uni.uploadFile({
				url: `${server}api/common/image`,
				filePath: url,
				header: {
					"Authorization": uni.getStorageSync('token'),
				},
				name: "image",
				success: res => {
					let data = JSON.parse(res.data)
					if (data.code == 1009) {
						uni.clearStorage()
						uni.navigateTo({
							url: "/pagesV1/common/login"
						})
					}
					if(data.code==0){
						this.form.related_images.push(data.data.url)
					}else{
						if(num<=3){
							num++
							this.uploadFile(url,num)
						}
					}
				}
			})
		},
		upLoad2(){
			uni.chooseImage({
				count: 1,
				success: blob => {
					this.uploadFile2(blob.tempFilePaths[0],1) 
				}
			})
		},
		uploadFile2(url,num){
			uni.uploadFile({
				url: `${server}api/common/image`,
				filePath: url,
				header: {
					"Authorization": uni.getStorageSync('token'),
				},
				name: "image",
				success: res => {
					console.log('detention_slip_image',JSON.parse(res.data))
					let data = JSON.parse(res.data)
					if (data.code == 1009) {
						uni.clearStorage()
						uni.navigateTo({
							url: "/pagesV1/common/login"
						})
					}
					if(data.code==0){
						this.form.detention_slip_image=data.data.url
						
						console.log(this.form.detention_slip_image)
					}else{
						if(num<=3){
							num++
							this.uploadFile2(url,num)
						}
					}
				}
			})
		},
		removeHonor(index){
			// this.$refs.lawyerUpload.remove(index)
			this.form.related_images.splice(index,1)
		},
		typesChange(data){
			console.log(data)
			if(data[0].label!='自定义'){
				this.tags.show=0
				this.tags.category=data[0].label
				this.tags.category_id=data[0].value
			}else{
				this.tags.show=1
				this.tags.category_id=data[0].value
			}
		},
		setTypes(data){
			console.log(data)
			this.tags=data
		},
		setAddress(e){
			console.log(e)
			this.address=e
		},
		onAddress(){
			this.$refs.address.show=true
		},
		getAddress(){
			uni.getLocation({
					type: 'wgs84',
					success: res=> {
					this.position=res
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
					getLocation({lng:res.longitude,lat:res.latitude}).then(res=>{
						if(res.data.code==0){
							this.there=res.data.data
							getApp().globalData.there=res.data.data
							this.$refs.address.info.city=res.data.data
						}
					})
					}
			});
			
		},
		getAuthorize() { //获取授权
			uni.authorize({
				scope: "scope.userLocation",
				success: res => {
					this.isAdr = true;
					console.log('授权成功')
					this.getAddress()
				},
				fail: res => {
					this.isAdr = false;
				}
			})
		},
		openAdr(){
			console.log(this.isAdr)
			if(this.isAdr){
				this.getAddress()
				return
			}
			uni.openSetting({
				success: res=> {
					if(res.authSetting){
						this.isAdr = true;
						console.log('授权成功')
						this.getAddress()
					}
				},
				complete: res => {
					console.log(res);
				}
			})
		},
	}
}
</script>

<style lang="scss">
	page{
		background-color: #F5F7FA;
		padding-bottom: 110rpx;
	}
	.picker-view {
		// width: 750rpx;
		height: 360rpx;
		// margin-top: 20rpx;
		margin-bottom: 56rpx;
	}
	.item {
		height: 44px;
		line-height: 44px;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.user{
		padding: 20rpx 0 16rpx;
		.photo{
			width: 80rpx;
			height: 80rpx;
			border-radius: 12rpx;
		}
	}
	.num{
		color: #FF4040;
		font-size: 30rpx;
		text{
			font-size: 40rpx;
		}
	}
	.box{
		padding: 0 28rpx;
		margin: 0 16rpx 20rpx;
		background-color: #fff;
		color: #222;
		border-radius: 16rpx;
		&:first-child{
			margin-top: 20rpx;
		}
		.cell{
			padding: 28rpx 0;
			border-bottom: 1rpx solid #ECEFF4;
			&:last-child{
				border-bottom: none;
			}
			.radio{
				color: #888D98;	
				line-height: 48rpx;
				padding: 0 9rpx;
				border-radius: 12rpx;
				border: 1rpx solid #D4DBE8;
			}
			.radio_on{
				color: #0061FF;
				background: #EAEFFF;
				border: 1rpx solid #B4C5FF;
			}
			.input_type{
				color: #FF6E57;
				background: #F1F4F9;
				border-radius: 8rpx;
				padding: 0 60rpx 0 12rpx;
			}
			input{
				width: 260rpx;
				height: 64rpx;
				text-align: right;
				padding: 0 12rpx;
			}
			.unit{
				color: #FF6E57;
				line-height: 64rpx;
				position: absolute;
				right: 12rpx;
			}
			.tag{
				color: #FF6160;
				font-weight: 800;
				padding: 0 12rpx;
				line-height: 48rpx;
				background: #FFEFEF;
				border: 1rpx solid #FFD2D2;
				border-radius: 8rpx;
			}
		}
		.border_no{
			border-bottom: none;
			padding-bottom: 0;
		}
		.inputBox{
			margin: 20rpx 0 0;
			padding: 16rpx 0;
			height: 72rpx;
			font-size: 28rpx;
			background: #F5F7FA;
			border-radius: 8rpx;
			input{
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
			}
			.border-r{
				border-left: 1rpx solid #B2C2DB;
			}
		}
		.inputBox2{
			margin: 20rpx 0 0 0;
			height: 72rpx;
			font-size: 28rpx;
			line-height: 72rpx;
			background: #F5F7FA;
			border-radius: 8rpx;
			input{
				text-align: left;
			}
		}
	}
	.borderB{
		border-bottom: 1rpx solid #ECEFF4;
	}
	.tagBox{
		// padding-bottom: 20rpx;
		.tag{
			width: 210rpx;
			height: 68rpx;
			line-height: 68rpx;
			color: #888D98;
			border: 2rpx solid #C9CED9;
			border-radius: 8rpx;
			text-align: center;
			margin: 0 0 16rpx 0;
		}
		.on{
			color: #fff;
			border: none;
			background: linear-gradient(306deg, #4576FB 0%, #6995FE 100%);
			box-shadow: 0rpx 4rpx 16rpx rgba(0, 44, 220, 0.3);
		}
	}
	
	.textBox{
		height: 200rpx;
		font-size: 32rpx;
		margin: 28rpx 0;
		background: #F5F7FA;
		border-radius: 8rpx;
		padding: 20rpx 24rpx 60rpx;
		position: relative;
		textarea{
			width: 100%;
			height: 100%;
			background: #F5F7FA;
		}
		.hint{
			color: #6E7695;
			position: absolute;
			right: 24rpx;
			bottom: 24rpx;
		}
	}
	.hintBox{
		color: #FC384C;
		font-size: 26rpx;
		height: 100rpx;
		background: #FFEFF0;
		border: 1rpx solid #FEC0C0;
		border-radius: 8rpx;
		padding: 0 20rpx;
		.button{
			color: #FFFFFF;
			line-height: 54rpx;
			background: linear-gradient(134deg, #FF4D65 0%, #FC3845 100%);
			border-radius: 27rpx;
			padding: 0 22rpx;
		}
	}
	.imgBox{
		padding-top: 32rpx;
		// border-top: 1rpx solid #ECEFF4;
		.img-item{
			width: 200rpx;
			height: 200rpx;
			background: #9AAAFF;
			margin: 0 16rpx 16rpx 0;
			border-radius: 8rpx;
			image{
				width:100%;
				height: 100%;
				border-radius: 8rpx;
			}
			.close{
				width: 32rpx;
				height: 32rpx;
				position: absolute;
				right: 0;
				top: 0;
			}
		}
		.upLoad{
			width: 200rpx;
			height: 200rpx;
			border: 2rpx dotted #B7BFD1;
			border-radius: 8rpx;
		}
	}
	// .foot{
	// 	padding-bottom: 68rpx;
	// }
	.foot{
		width: 100%;
		height: 110rpx;
		color: #fff;
		position: fixed;
		bottom: 0;
		background: #424864;
		z-index: 999;
		.subBtn{
			width: 285upx;
			height: 120upx;
			margin-top: -10rpx;
			line-height: 110upx;
			font-size: 32upx;
			font-weight: bold;
			text-align: center;
			background: url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_zf_bg.png');
			background-size: 100% 100%;
			
		}
	}
	.popBox{
		height: 100vh;
		.button{
			line-height: 90rpx;
			transform: translateY(-130rpx);
			
		}
		.del{
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			right: 0;
			top: 0;
		}
		.blue{
			width: 280rpx;
			color: #fff;
			background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%);
			box-shadow: 0rpx 4rpx 16rpx rgba(0, 44, 220, 0.3);
			border-radius: 20rpx 20rpx 32rpx 20rpx;
		}
		.gray{
			width: 180rpx;
			color: #14284A;
			background: #F3F5F8;
			border-radius: 20rpx 20rpx 20rpx 32rpx;
		}
	}
	// .btn{
	// 	height: 100rpx;
	// 	line-height: 100rpx;
	// 	border-radius: 32rpx;
	// 	color: #fff;
	// 	background: #0061FF;
	// 	box-shadow: 0rpx 12rpx 32rpx rgba(9, 58, 255, 0.4);
	// 	margin: 32rpx 75rpx 0;
	// }
	.typeBox{
		padding: 56rpx 48rpx;
		.btn{
			margin: 0;
		}
	}
	
	.addBox{
		padding: 36rpx 36rpx 64rpx;
		.colse{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			top: 36rpx;
			right: 36rpx;
		}
		.hint{
			padding: 0 0 25rpx 0;
			border-bottom: 1rpx solid #ECEFF4;
		}
		.radio{
			position: absolute;
			right: 0;
		}
		.text{
			height: 240rpx;
			background: #F5F7FA;
			border-radius: 8rpx;
			padding: 28rpx 32rpx;
			margin-bottom: 64rpx;
			textarea{
				width: 100%;
				height: 100%;
			}
		}
		.confirmBtn{
			border-radius: 8rpx;
			background: #3764FF;
			box-shadow: none;
		}
	}
</style>
