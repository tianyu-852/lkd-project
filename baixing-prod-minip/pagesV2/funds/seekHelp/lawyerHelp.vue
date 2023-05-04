<template>
	<view class="pageBg">
		<case-type ref="types" @setTypes="setTypes" mode="center"></case-type>
		<u-select v-model="selectShow" value-name="id" label-name="name" :list="selectList" @confirm="selectConfirm"></u-select>
		<view class="card info" v-if="0">
			<view class="title">
				案件信息
			</view>
			<view class="cell flex-row" @click="clickTypes">
				<text class="left">案件类型</text>
				<u-input v-model="param.fundraising_case_type" :clearable="false" height="42" type="number" disabled placeholder="请选择案件类型" class="center" @click="clickTypes"/>
				<image class="icCk" src="/pagesV2/static/images/ic_ck.svg"></image>
			</view>
			<view class="cell flex-row" @click="showSelect(1)">
				<text class="left">审理阶段</text>
				<u-input v-model="param.trial_stage" :clearable="false" height="42" type="number" disabled placeholder="请选择案件类型"class="center" @click="showSelect(1)" />
				<image class="icCk" src="/pagesV2/static/images/ic_ck.svg"></image>
			</view>
			<view class="cell flex-row" @click="setAddress">
				<text class="left">案件所在地</text>
				<u-input v-model="chooseAdr.toStr" :clearable="false" height="42" disabled placeholder="请选择案件所在地" class="center" @click="setAddress"/>
				<image class="icCk" src="/pagesV2/static/images/ic_ck.svg"></image>
			</view>
			<view class="title" style="margin-top: 28upx;">委托当事人</view>
			<view class="cell flex-row">
				<text class="left" style="width: 108upx;">姓名</text>
				<u-input v-model="param.litigant_user_nickname" :clearable="false" height="42" disabled placeholder="请填写当事人姓名" class="center" />
				<view class="dropdown flex-row" @click="showSelect(2)">
					<text>{{param.litigant_role_chinese == ''?'原告':param.litigant_role_chinese}}</text>
					<image src="/pagesV2/static/images/xz_icon.svg"></image>
				</view>
			</view>
			<view class="cell flex-row">
				<text class="left">身份证号码</text>
				<u-input  :clearable="false" height="42" type="number" disabled :placeholder="param.litigant_id_card.substr(0,5) + '*********' + param.litigant_id_card.substr(14)" class="center" />
				<view class="radio">
					<image src="/pagesV2/static/images/gx_icon_green.svg"></image>已认证
				</view>
			</view>
			<view class="cell flex-row">
				<text class="left" style="flex: 1;">{{other_litigant_role}}信息</text>
				
				<view :class="['radio',param.other_side_type !='个人'?'color888D98':'']" @click="param.other_side_type ='个人'">
					<image :src="param.other_side_type !='个人'?'/static/images/gx_icon.svg' : '/static/images/gx_icon_sel.svg'" mode="" ></image>个人
				</view>
				<view :class="['radio',param.other_side_type !='公司'?'color888D98':'']" style="margin-left: 48upx;" @click="param.other_side_type ='公司'">
					<image :src="param.other_side_type!='公司'?'/static/images/gx_icon.svg' : '/static/images/gx_icon_sel.svg'" mode="" ></image>公司
				</view>
				
				<view v-if="param.litigant_role_chinese == '原告'" class="flex-row add" @click="addAccused" style="font-size: 28upx;margin-left: 84upx;">
					<image src="/static/images/tj_icon.svg" mode=""></image>添加
				</view> 
			</view>
			<view class="cell flex-row" :key="index" v-for="name,index in other_side_nicknames">
				<text class="left">{{param.other_side_type=='个人'?'姓名':'公司名称'}}</text>
				<u-input v-model="name.val" :clearable="false" height="42" placeholder="请输入TA的姓名" class="center" />
				<text class="delText" v-if="index > 0" @click="delAccused(index)">删除</text>
			</view>
		</view>
		<view class="card charge" v-if="0">
				<view class="title" @click="showCover=true">
					案件所需费用<u-icon name="question-circle" style="margin: auto; margin-left: 12upx;" color="#C9CED9" size="32" @close="dialogShow=false" ></u-icon>
				</view>
				<view class="cell flex-row">
					<text class="left">律师代理费</text>
					<u-input v-model="param.lawyer_money" :clearable="false" height="42" type="number" disabled placeholder="请输入诉讼费金额" class="center" />
						
					<!-- <image class="delimg" src="/static/images/gb_icon.svg" @click="showCover=true"></image> -->
				</view>
				<!-- <view class="errNotice">
					筹款成功，平台将扣除律师代理费的10%作为项目服务费
					最低1000元。
				</view> -->
				<view class="cell flex-row">
					<text class="left">诉讼费</text>
					<u-input v-model="param.case_money" :clearable="false" height="42" type="number" placeholder="案件受理费、申请费等" class="center" disabled/>
				</view>

				<!-- <view class="cell flex-row checkbox"> -->
					<!-- <view class="left">
						<image :src="checkVal==0?'/static/images/gx_icon.svg' : '/static/images/gx_icon_sel.svg'" mode="" @click="clickCheckBox"></image>财产保全费
					</view>
					<u-input :disabled="checkVal==0" v-model="lawyerParam.property_money" :clearable="false" height="42"
						type="number" @input="setTotal" :placeholder="checkHint" class="center" />
				</view> -->
				<view class="cell flex-row" v-for="item,index in param.other_expenses" :key="item">
					<text class="left">{{item.name}}</text>
					<u-input v-model="item.value" :clearable="false" height="42" type="number" placeholder="" class="center" />
					<!-- <image class="delimg" src="/static/images/gb_icon.svg" @click="clickDel(index)"></image> -->
				</view>
				<view class="total flex-row ">
					<view class="flex-row add" @click="addShow = true">
						<!-- <image src="/static/images/tj_icon.svg" mode=""></image>添加收费项 -->
					</view> 
					<text style=" flex: 1;">总筹款金额{{param.target_money}}元</text>
				</view>
		</view>
		<view :id="`the${lawyerIndex}`" class="card lawyer" v-for="item,lawyerIndex in param.lawyers">
			<view class="title flex-row">代理律师说明
			<text class="delText"  v-if="lawyerIndex != 0" @click="delLawyer(lawyerIndex)">删除</text>
				<view class="flex-row add" v-if="lawyerIndex == 0" @click="addLawyer" >
					<image src="/static/images/tj_icon.svg" mode=""></image>添加律师
				</view> 
			</view>
			<view class="marlr32 martop32">
				<lawyer-info-card :info="item"></lawyer-info-card>
			</view>
			<view class="line"></view>
			<view class="textarea flex-column" :style="dropdownVal.fundraising_role != '本人'?'margin-top:28upx !important;':''">
				<!-- <textarea cols="30" placeholder-style="color:#C9CED9" rows="10" v-model="textarea" :placeholder="user.type ==1?'请简单描述下您的案件经过':'请简单描述下您的案件经过(选填)'" maxlength="300" @input="inputChange" :auto-height="true" v-if="!dialogShow && !show"></textarea> -->
				<u-input v-model="item.introduction" :clearable="false" type="textarea" :border="border" maxlength="300"  :custom-style="textareaSty" placeholder="律师个人简介(选填)"></u-input>
				
				<view class="slot-btn flex-row">
					<u-upload ref="lawyerUpload" :index="`lawyer${lawyerIndex}`" @on-change="uploadChange" :header="header" height="144" width="144" :action="action" name="image" max-count="9" :file-list="Lhonor_certificates[lawyerIndex]"  custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)" :show-upload-list="false">
						<view slot="addBtn" class="slot-btn flex-row">
							<image src="/static/images/sctp9_icon.svg"></image>
							<text>上传律师荣誉照(选填)｜({{item.honor_certificates?item.honor_certificates.length:0}}/9)</text>
						</view>
					</u-upload>
				</view>
			</view>
			<view style="margin:16upx 15upx 0 32upx;">
				<view class="honorItem" v-for="img,index in item.honor_certificates">
					<image class="uploadImg" :src="img.image" mode="aspectFill"></image>
					<view class="label flex-row">
						<image src="/pagesV2/static/images/bj_icon@3x.png"></image>
						<u-input :clearable="false" v-model="img.title" height="37" placeholder="荣誉描述" class="input"/>
					</view>
					<image class="delImg" src="/pagesV2/static/images/gb_icon.svg" @click="removeHonor(lawyerIndex,index)"></image>
				</view>
				<view style="clear: both;"></view>
			</view>
			<view class="line"></view>
			<view class="title">上传法律服务委托合同书</view>
			<view style="margin:16upx 15upx 0 32upx;">
				<u-upload :index="`trust${lawyerIndex}`" @on-change="uploadChange" :header="header" height="144" width="144" :action="action" name="image" max-count="9" :file-list="trust_agreement_images[lawyerIndex]" custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)">
					<view slot="addBtn" class="flex-column uploadAddBtn">
						<image src="/static/images/sctp9_icon.svg"></image>
						<text>上传({{item.trust_agreement_images?item.trust_agreement_images.length:0}}/9)</text>
					</view>
				</u-upload>
			</view>
			
			<view class="line"></view>
			<view class="title">上传授权委托书</view>
			<view style="margin:16upx 15upx 0 32upx;">
				<u-upload :index="`power${lawyerIndex}`" @on-change="uploadChange" :header="header" height="144" width="144" :action="action" name="image" max-count="9" :file-list="power_of_attorney_images[lawyerIndex]" custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)">
					<view slot="addBtn" class="flex-column uploadAddBtn">
						<image src="/static/images/sctp9_icon.svg"></image>
						<text>上传({{item.power_of_attorney_images?item.power_of_attorney_images.length : 0}}/9)</text>
					</view>
				</u-upload>
			</view>
		</view>
		<view class="lawoffice card">
			<view class="title">委托事务所说明</view>
			<view class="cell flex-row" >
				<text class="left">事务所名称</text>
				<u-input v-model="param.lawyer_office.lawyer_office" :clearable="false" height="42" disabled placeholder="所在事务所名称" class="center" />
				<view class="flex-row add" @click="addShow = true">
					<image src="/static/images/tj_icon.svg" mode="" v-if="param.lawoffice.url&&param.lawoffice.url.length>0"></image>{{param.lawoffice.url == null || param.lawoffice.url==''?'':'添加'}}官网
				</view>
				<!-- <image class="icCk" src="/pagesV2/static/images/ic_ck.svg"></image> -->
			</view>
			<view :class="['cell','flex-row',param.lawyer_office.address?'cellHasAdr':'']" @click="chooseLocation">
			<!-- <view class="cell flex-row" @click="chooseLocation"> -->
				<text class="left">选择地址</text>
				<view :class="[param.lawyer_office.address?'adr':'noadr','ellipsis']">{{param.lawyer_office.address?param.lawyer_office.address:'请选择地址'}}</view>
				
				<!-- <u-input v-model="param.lawyer_office.address" :clearable="false" height="42" placeholder="请选择地址" disabled class="center"  @click="chooseLocation"/> -->
				<image class="icCk" src="/pagesV2/static/images/ic_ck.svg"></image>
			</view>
			<view class="cell flex-row" style="border: none;">
				<text class="left" style="flex: 1;">上传相关许可证</text>
				<text class="hint" @click="maskShow=true">许可证参考图</text>
				<image class="icCk" src="/pagesV2/static/images/ic_ck.svg" @click="maskShow=true"></image>
			</view>
			<view style="margin: auto;width: 464upx;">
				<u-upload index="4" @on-change="uploadChange" :header="header" height="236" width="464" :action="action" name="image" max-count="1" :file-list="practice_license" custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)">
					<view slot="addBtn" class="uploadLicense">
						<image src="/pagesV2/static/images/zgz_image@3x.png"></image>
						<text>上传律师事务所执业许可证</text>
					</view>
				</u-upload>
			</view>
			<view class="textarea flex-column" :style="dropdownVal.fundraising_role != '本人'?'margin-top:28upx !important;':''">
				<!-- <textarea cols="30" placeholder-style="color:#C9CED9" rows="10" v-model="textarea" :placeholder="user.type ==1?'请简单描述下您的案件经过':'请简单描述下您的案件经过(选填)'" maxlength="300" @input="inputChange" :auto-height="true" v-if="!dialogShow && !show"></textarea> -->
				<u-input v-model="param.lawyer_office.introduction" type="textarea" placeholder="律所事务所简介(选填)" :clearable="false"/>
				<!-- 				<u-input v-model="content" :clearable="false" type="textarea" :border="border" maxlength="300" ho
					:custom-style="textareaSty" @input="inputChange" placeholder="请简单描述下您的案件经过(选填)"></u-input> -->
				
				<view class="slot-btn flex-row">
					<u-upload ref="upload5" index="5" @on-change="uploadChange" :header="header" height="144" width="144" :action="action" name="image" max-count="9" :file-list="LOhonor_certificates"custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)" :show-upload-list="false">
						<view slot="addBtn" class="slot-btn flex-row">
							<image src="/static/images/sctp9_icon.svg"></image>
							<text>上传律所荣誉照(选填)｜({{param.lawyer_office.honor_certificates.length?param.lawyer_office.honor_certificates.length:0}}/9)</text>
						</view>
					</u-upload>
				</view>
			</view>
			<view style="margin:16upx 15upx 0 32upx;">
				<view class="honorItem" v-for="item,index in param.lawyer_office.honor_certificates">
					<image class="uploadImg" :src="item.image" mode="aspectFill"></image>
					<view class="label flex-row">
						<image src="/pagesV2/static/images/bj_icon@3x.png" mode=""></image>
						<u-input :clearable="false" v-model="item.title" height="37" placeholder="荣誉描述" class="input"/>
					</view>
					<image class="delImg" src="/pagesV2/static/images/gb_icon.svg" @click="removeHonor(-1,index)" mode=""></image>
				</view>
				<view style="clear: both;"></view>
			</view>
		</view>
		<view class="subButton" @click="sendFLawyerWrite(true)">提交求助说明</view>
		<u-popup v-model="showCover" mode="center" border-radius="16">
			<view class="showCoverBox flex-row">
				<text class="context">
					平台将扣除筹款金额的<text class="color0061FF">20%</text>作为项目服务费
				</text>
				<u-icon name="close" style="margin: auto; margin-right: 0;" color="#C9CED9" size="28" @click="showCover=false"></u-icon>
			</view>
		</u-popup>
		<u-popup v-model="addShow"  mode="center" border-radius="16" class="addBox" >
			<view class="addBox">
				<text class="title">请输入您的律所官网</text>
				<u-input v-model="param.lawyer_office.url" type="textarea" :clearable="false"  placeholder="请输入律师事务所官方网址" placeholder-style="color: #C9CED9;"  class="center" />
				
				<view class="buttons flex-row" >
					<text class="previewBtn" @click="previewUrl">预览</text><text class="subBtn" @click="addShow = false">确定</text>
				</view>
			</view>
		</u-popup>
		<u-mask :show="maskShow" @click="maskShow = false">
			<view class="maskBox flex-column">
				<image class="image" src="http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/slzs_image@3x.png" mode=""></image>
				<image style="width:80upx;margin-top: 0;" src="/static/images/gb_icon.png" mode="widthFix" @click="maskShow = false"></image>
			</view>
		</u-mask>
		<view class="safe-area-inset-bottom"></view>
	</view>
</template>

<script>
	import {
		server
	} from "@/request.js"
	import {
		getFundraiseQuoteLawyer,
		putFundraiseQuote,
		getFTrialStage,
		getFLawyerWrite,
		sendFLawyerWrite
	} from "@/api/apis.js"
	import lawyerInfoCard from "@/pagesV2/components/lawyerInfoCard.vue"
	import caseType from "@/components/caseType.vue"
	export default {
		components:{
			lawyerInfoCard,
			caseType
		},
		data() {
			return {
				other_litigant_role:'被告',
				other_side_nicknames:[{val:''}],
				maskShow:false,
				header: {
					"Authorization": uni.getStorageSync('token')
				},
				action: `${server}api/common/image`,
				Lhonor_certificates:[],
				LOhonor_certificates:[],
				trust_agreement_images:[],
				power_of_attorney_images:[],
				practice_license:[],
				param:{litigant_id_card:'330322199208555545'},
				trialList:[],
				selectList:[],
				selectIndex:0,
				textarea:'律师个人信息律师个人信息律师个人信息律师个人信息律师个人信息律师个人信息律师个人',
				id:1,
				showCover:false,
				addShow: false,
				showList: [{url:''},{url:''},{url:''}],
				checkVal: 0,
				checkHint: '请先勾选才能输入财产保全费',
				total: 0,
				lawyerParam:{
					litigant_user_nickname:'',
					lawyer_money:'',
					case_money:'',
					property_money:'',
					other_expenses:[],
					case_all_money:''
				},
				chooseAdr:{},
				selectShow:false,
				list:[{
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}]
			}
		},
		methods: {
			delLawyer(index){
				let {param} = this
				param.lawyers.splice(index)
			},
			addLawyer(){
				uni.navigateTo({
					url: "/pagesV2/findLawyer/findLawyer",
					events: {
						setLawyer: data => {
							let {param}  = this
							data.lawyer_id = data.user_id
							data.power_of_attorney_images = []
							data.lawyer_grade_chinese = '专职律师'
							data.trust_agreement_images = []
							data.honor_certificates = []
							param.lawyers.push(data)
							this.scrollSelector = `#the${param.lawyers.length-1}`
							console.log(JSON.stringify(data))
						}
					}
				})
			},
			delAccused(index){
				let {other_side_nicknames} = this
				other_side_nicknames.splice(index)
			},
			addAccused(){
				let {other_side_nicknames,param} = this
				other_side_nicknames.push({val:''})
			},
			previewUrl(){
				uni.setClipboardData({
				    data: this.param.lawyer_office.url,
				    success: function () {
				        this.$u.toast('复制链接到粘贴板成功，请打开本地浏览器查看');
				    }
				});
			},
			sendFLawyerWrite(isSub){
				let buf = Object.assign({},this.param)
				let {other_side_nicknames} = this
				buf.fundraising_id = this.id
				let list = []
				for (let i in other_side_nicknames) {
					list.push(other_side_nicknames[i].val)
				}
				buf.other_side_nicknames = JSON.stringify(list)
				buf.lawyers = JSON.stringify(buf.lawyers)
				buf.lawyer_office_honor_certificates = JSON.stringify(buf.lawyer_office.honor_certificates)
				// buf.power_of_attorney_images = JSON.stringify(buf.lawyer.power_of_attorney_images)
				// buf.trust_agreement_images = JSON.stringify(buf.lawyer.trust_agreement_images)
				// buf.lawyer_introduction = buf.lawyer.introduction
				buf.lawyer_office_introduction = buf.lawyer_office.introduction
				buf.city_id=this.chooseAdr.city_id
				buf.province_id=this.chooseAdr.province_id
				buf.lawyer_office_url = buf.lawyer_office.url
				buf.practice_license = buf.lawyer_office.practice_license
				console.log(buf)
				sendFLawyerWrite(buf).then(res=>{
					if(res.data.code == 0){
						if(isSub){
							this.$u.toast('提交成功')
							uni.navigateBack()
						}
					}else{
						this.$u.toast('错误：'+res.data.message)
					}
				})
			},
			removeHonor(name,index){
				if(name >=0 ){
					// eval("this.$refs.lawyerUpload" + name+'.remove('+index+')' )
					this.$refs.lawyerUpload[name].remove(index)
					this.param.lawyers[name].honor_certificates.splice(index,1)
				}else if(name == -1){
					this.$refs.upload5.remove(index)
					this.param.lawyer_office.honor_certificates.splice(index,1)
				}
			},
			uploadChange(res, index, lists, name){
				console.log(name)
				let list = []
				for (let i = 0; i < lists.length; i++) {
					if(name == '5' || name.indexOf('lawyer') != -1)
						list.push({
							title:'',
						image:lists[i].response ? lists[i].response.data.url : lists[i].url
					})
					else
						list.push(lists[i].response ? lists[i].response.data.url : lists[i].url)
						
				}
				switch (name){
					case '1':
						this.param.lawyer.honor_certificates = list
						break;
					case '2':
						this.param.lawyer.trust_agreement_images = list
						break;
					case '3':
						this.param.lawyer.power_of_attorney_images = list
						break;
					case '4':
						this.param.lawyer_office.practice_license = list[0]
						break;
					case '5':
						this.param.lawyer_office.honor_certificates = list
						break;
					default:
						if(name.indexOf('lawyer') != -1){
							let i = parseInt(name.substr(6)) 
							this.param.lawyers[i].honor_certificates = list
						}else if(name.indexOf('trust') != -1 ){
							let i = parseInt(name.substr(5)) 
							this.param.lawyers[i].trust_agreement_images = list
						}else if(name.indexOf('power') != -1){
							let i = parseInt(name.substr(5)) 
							this.param.lawyers[i].power_of_attorney_images = list
						}
						 
						break;
				}
			},
			showSelect(index){
				this.selectIndex = index
				this.selectShow = true
				if(index == 1){
					this.selectList = this.trialList
				}else if(index == 2){
					if(!this.param.trial_stage_id)
						this.param.trial_stage_id = 0
					this.selectList = this.trialList[this.param.trial_stage_id].litigant_role
				}
			},
			selectConfirm(list){
				if(this.selectIndex == 1){
					this.param.trial_stage = list[0].label
					this.param.trial_stage_id = list[0].value
					this.param.litigant_role_chinese = this.trialList[this.param.trial_stage_id].litigant_role[0].name
					this.param.litigant_role = this.trialList[this.param.trial_stage_id].litigant_role[0].id
				}else if(this.selectIndex == 2){
					this.param.litigant_role = list[0].value
					this.param.litigant_role_chinese = list[0].label
					for (let i in this.selectList) {
						if(this.selectList[i].id != list[0].value){
							this.other_litigant_role = this.selectList[i].name
						}
					}
				}
			},
			setTypes(data){
				//case_type fundraising_case_type_id
				console.log(data)
				this.param.fundraising_case_type = data.case_type
				this.param.fundraising_case_type_id = data.fundraising_case_type_id
			},
			clickTypes() {
				this.$refs.types.show = !this.$refs.types.show
			},
			setAddress() {
				uni.navigateTo({
					url: "/pagesV1/common/districts?callback=true",
					events: {
						setAddress: data => {
							console.log(data)
							this.chooseAdr = data
							this.chooseAdr.toStr = data.province + '-' +data.city
						}
					}
			
				})
			},
			chooseLocation(){
				uni.chooseLocation({
				    success: res=> {
						this.param.lawyer_office.address = res.address
						this.param.lawyer_office_lng = res.longitude
						this.param.lawyer_office_lat = res.latitude
						this.param.lawyer_office_address = res.address
						
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
				    }
				})
			},
			putQuote(){
				let param = Object.assign({},this.lawyerParam) 
				param.fundraising_quote_price_id = this.id
				param.other_expenses=JSON.stringify(param.other_expenses)
				putFundraiseQuote(param).then(res=>{
					if(res.data.code != 0){
						this.$u.toast(res.data.message)
					}else{
						this.$u.toast('提交成功')
						uni.navigateBack()
					}
				})
			},
			setTotal() {
				// console.log('----')
				let param = this.lawyerParam
				let total = 0
				total = parseInt(param.lawyer_money == '' ? 0 : param.lawyer_money) +
					parseInt(param.case_money == '' ? 0 : param.case_money) +
					parseInt(this.checkVal == 0 ? 0 : param.case_money == '' ? 0 : param.property_money)
				for (let item in param.other_expenses) {
					total = total + parseInt(param.other_expenses[item].value == '' ? 0 : param.other_expenses[item].value)
				}
				this.total = total
			},
			clickCheckBox() {
				this.checkVal = this.checkVal == 0 ? 1 : 0
				this.checkHint = this.checkVal == 0 ? '请先勾选才能输入财产保全费' : '请输入财产保全费'
				this.setTotal()
			},
			clickDel(index) {
				this.lawyerParam.other_expenses.splice(index, 1)
				this.setTotal()
			},
			clickAdd() {
				if (this.field == '') {
					this.$u.toast("请输入收费项目")
					return
				}
				if (this.val == '') {
					this.$u.toast("请输入收费金额")
					return
				}
				let obj = {
					name: this.field,
					value: this.val
				}
				this.$set(this.lawyerParam.other_expenses, this.lawyerParam.other_expenses.length, obj)
				this.setTotal()
				this.addShow = false
			}
		},
		onLoad(e) {
			this.id = e.id
			getFTrialStage().then(res => {
				if(res.data.code == 0){
					for(let i in res.data.data){
						res.data.data[i].id = i
					}
					this.trialList = res.data.data
				}
			})
			getFLawyerWrite({
				fundraising_id:e.id
			}).then(res =>{
				if(res.data.code == 0){
					const data = res.data.data
					this.param = data
					console.log(JSON.stringify(data))
					
					let buf = []
					for (let j in data.lawyers) {
						for (let i in data.lawyers[j].honor_certificates) {
							data.lawyers[j].honor_certificates[i].url = data.lawyers[j].honor_certificates[i].image
							buf.push(data.lawyers[j].honor_certificates[i])
						}
						this.Lhonor_certificates.push(buf)
						buf = []
					}
					buf = []
					for (let j in data.lawyers) {
						for (let i in data.lawyers[j].trust_agreement_images) {
							buf.push({
								url: data.lawyers[j].trust_agreement_images[i]
							})
						}
						this.trust_agreement_images.push(buf)
						buf = []
					}
					buf = []
					for (let j in data.lawyers) {
						for (let i in data.lawyers[j].power_of_attorney_images) {
							buf.push({
								url: data.lawyers[j].power_of_attorney_images[i]
							})
						}
						this.power_of_attorney_images.push(buf)
						buf = []
					}
					buf = []
					if(data.lawyer_office.practice_license){
						buf.push({
							url: data.lawyer_office.practice_license
						})
					}
					this.practice_license = buf
					buf = []
					for (let i in data.lawyer_office.honor_certificates) {
						buf.push({
							url: data.lawyer_office.honor_certificates[i]
						})
					}
					this.LOhonor_certificates = buf
					
					buf = []
					for(let i in data.other_side_nicknames){
						buf.push({val:data.other_side_nicknames[i]})
					}
					this.other_side_nicknames = buf
					this.chooseAdr.province_id = data.province_id
					this.chooseAdr.city_id = data.city_id
					if(data.province != '')
						this.chooseAdr.toStr = data.province + '-' + data.city
				}
					
			})
			// getFundraiseQuoteLawyer({fundraising_quote_price_id:e.id}).then(res=>{
			// 	this.lawyerParam=res.data.data
			// 	let list = []
			// 	for (let i = 0; i < res.data.data.images.length; i++) 				{
			// 		list.push({
			// 			url: res.data.data.images[i]
			// 		})
			// 	}
			// 	this.showList=list
			// 	// this.setTotal()
			// })
		},
		onShow() {
			if(this.scrollSelector){
				this.$nextTick(function(){
					uni.pageScrollTo({
						selector:this.scrollSelector,
						duration: 300,
						complete:res=>{
							this.scrollSelector = null
						}
					});
				})
			}
		},
		onHide() {
			this.sendFLawyerWrite()
		},
		onUnload() {
			this.sendFLawyerWrite()
		}
	}
</script>

<style scoped lang="scss">
	.maskBox{
		width: 100vw;
		margin: auto;
		margin-top: 400upx;
		image{
			width: 680upx;
			height: 645upx;
			margin: auto;
		}
	}
	.subButton{
		margin: 48upx 40upx 46upx 40upx;
		height: 90upx;
		line-height: 90upx;
		background: #0061FF;
		box-shadow: 0px 4upx 16upx rgba(0, 47, 233, 0.5);
		border-radius: 100px;
		font-size: 32upx;
		 
		font-weight: 500;
		color: #FFFFFF;
		text-align: center;
	}
	.uploadLicense{
		width: 464upx;
		image{
			width: 100%;
			height: 236upx;
			display: block;
		}
		line-height: 37upx;
		font-size: 26upx;
		 
		font-weight: 500;
		color: #888D98;
		text-align: center;
	}
	.lawoffice{
		padding: 40upx 0 20upx 0;
		.noadr{
			flex: 1;
			height: 42upx;
			font-size: 30upx;
			 
			font-weight: 400;
			line-height: 42upx;
			color: #C9CED9;
		}
		.hint{
			flex: 1;
			text-align: right;
			color:#888D98 ;
			margin-right: 12upx;
		}
		.cellHasAdr{
			padding: 15upx 0;
			line-height:69upx;
		}
		.adr{
			flex: 1;
			// height: 69upx;
			font-size: 24upx;
			 
			font-weight: 500;
			line-height: 35upx;
			color: #222222;
			display: block;
			margin: auto;
			padding-right: 14upx;
		}
	}
	.honorItem{
		width: calc((100% - 28upx)/2);
		margin-bottom: 16upx;
		margin-right: 14upx;
		float: left;
		position: relative;
		.delImg{
			width: 30upx;
			height: 30upx;
			position: absolute;
			right: 8upx;
			top: 8upx;
			z-index: 2;
		}
		.uploadImg{
			width: 100%;
			height:200upx;
			background: #9AAAFF;
			border-radius: 8upx;
		}
		.label{
			height: 37upx;
			margin-top: 16upx;
			-webkit-line-clamp: 1;
			image{
				width: 22upx;
				height: 22upx;
				margin: auto;
				margin-right: 8upx;
			}
			.input{
				flex: 1;
			}
		}
		text{
			height: 37upx;
			font-size: 26upx;
			 
			font-weight: 500;
			color: #888D98;
		}
	}
	.slot-btn {
		image {
			width: 34upx;
			height: 28upx;
			margin: auto;
		}
	
		text {
			display: block;
			line-height: 33upx;
			font-size: 24upx;
			 
			color: #888D98;
			opacity: 1;
			margin-left: 8upx;
		}
	}
	.lawyer{
		padding-top: 40upx;
		padding-bottom: 48upx;
		.line{
			height: 1upx;
			background: #ECEFF4;
			margin: 28upx 32upx;
		}
		.add{
			font-size: 28upx;margin: auto;margin-right: 32upx;
		}
		.delText{
			font-size: 28upx;
			 
			font-weight: 500;
			color: #FF4040;
			margin:auto;
			margin-right: 32upx;
		}
		
	}
	.textarea {
			margin: 0upx 32upx;
			display: block;
			padding: 24upx 28upx;
			background: #F3F5F8;
			border-radius: 8rpx;
			font-size: 28upx;
			 
			line-height: 42upx;
			color: #222222;
			word-wrap : break-word;
			textarea{
				flex: 1;
				line-height: 42upx;
				word-wrap : break-word;
			}
		}
	.info{
		.dropdown{
			height: 48upx !important;
			line-height: 44upx;
			background: #FFFFFF;
			height: 40upx;
			text{
				border: 2upx solid #0061FF;
				border-right: 0;
				font-size: 28upx;
				 
				font-weight: 500;
				color: #0061FF;
				padding: 0 14upx 0 18upx;
				border-radius: 8upx 0 0 8upx;
			}	
			image{
				width: 30upx;
				height: 48upx;
			}
		}
		.radio{
			image{
				width: 26upx;
				height: 26upx;
				padding-top: 8upx;
				margin-right: 8upx;
			}
			margin-left: 13upx;
		}
		.title{
			height: 42upx;
			line-height: 42upx;
			font-size: 30upx;
			 
			font-weight: bold;
			color: #222222;
			margin-left: 32upx;
		}
		padding: 40upx 0 20upx 0;
		.cell:last-child{
			border: 0;
		}
		.delText{
			font-size: 28upx;
			 
			font-weight: 500;
			color: #FF4040;
		}
		
	}
	.uploadAddBtn{
		width: 144upx;
		height: 144upx;
		background: #E7EDF5;
		border-radius: 8upx;
		margin: 0 14upx 14upx 0;
		image{
			width: 50upx;
			height: 41upx;
			margin: auto;
			margin-top: 32upx;
			margin-bottom: 0;
		}
		text{
			margin-top: 20upx;
			height: 28upx;
			font-size: 20upx;
			 
			font-weight: bold;
			color: #888D98;
			display: block;
			text-align: center;
		}
	}
	.showCoverBox{
		width: 686upx;
		padding: 26upx 32upx;
		.context{
			width: 524upx;
			height: 96upx;
			font-size: 30upx;
			 
			font-weight: bold;
			line-height: 48upx;
			color: #222222;
			display: block;
		}
	}
	.addBox {
		width: 686upx;
		padding: 32upx;
		/deep/textarea{
			height: 160upx;
			background: #F3F5F8;
			border-radius: 8upx;
			font-size: 28upx !important;
			 
			font-weight: 500;
			line-height: 42upx;
			padding: 24upx 32upx;
		}
		/deep/textarea::-moz-placeholder{
			color: rgba(201, 206, 217, 1) !important;
		}
		.title {
			line-height: 50upx;
			font-size: 36upx;
			 
			font-weight: 800;
			color: #222222;
			display: block;
			text-align: center;
			margin-bottom: 20upx;
		}
		.buttons{
			margin-top: 48upx;
			line-height: 88upx;
			text-align: center;
			font-size: 32upx;
			 
			font-weight: bold;
			.previewBtn{
				flex: 1;
				border-radius: 8upx;
				background: #F3F5F8;
				color: #222222;
			}
			.subBtn {
				flex: 1;
				margin-left: 16upx;
				background: #0061FF;
				border-radius: 8upx;
				color: #FFFFFF;
			}
		}
		
	}

	/deep/ .u-preview-wrap {
		border: 0px !important;
		margin: 0upx 15upx 15upx 0 !important;
	}

	.submitBtn {
		margin: 48upx 32upx 0 32upx;
		height: 90upx;
		line-height: 90upx;
		background: #0061FF;
		box-shadow: 0px 4upx 16upx rgba(0, 47, 233, 0.5);
		opacity: 1;
		border-radius: 100upx;
		font-size: 32upx;
		 
		font-weight: 400;
		color: #FFFFFF;
		text-align: center;
		opacity: 1;
	}

	.checkbox {
		image {
			width: 26upx;
			height: 26upx;
			margin: auto;
			margin-right: 9upx;
		}

		.serve {
			line-height: 37upx;
			font-size: 26upx;
			 
			font-weight: 400;
			color: #0061FF;
			text-decoration: underline;
			opacity: 1;
		}

		.hint {
			flex: 1;
			line-height: 37upx;
			font-size: 26upx;
			 
			font-weight: 400;
			color: #888D98;
			opacity: 1;
			margin-left: 12upx;
		}

		margin:28upx 32upx 0 32upx;
	}

	.charge {
		padding-top: 40upx;
		margin-top: 30upx;
		.total {
			line-height: 40upx;
			font-size: 28upx;
			 
			font-weight: bold;
			color: #FF6E57;
			opacity: 1;
			margin: 0 32upx;
			text-align: end;
			padding: 40upx 0;
		}

		.errNotice {
			background: #FEE7E7;
			font-size: 24upx;
			 
			font-weight: 500;
			line-height: 36upx;
			color: #FF3951;
			opacity: 1;
			margin-top: -2upx;
			z-index: 2;
			padding: 14upx 50upx 14upx 32upx;
			border-radius: 0px 0px 8upx 8upx;
		}

		.cell {
			.left {
				width: 208upx;
			}
			.center{
				margin-right: 20upx;
			}
		}
		

		

		
	}
	.add {
		color: #0061FF;
		font-weight: 400;
		// flex:1;
		font-size: 24upx;
		line-height: 50upx;
		image {
			width: 26upx;
			height: 26upx;
			display: block;
			margin: auto;
			margin-right: 5upx;
		}
	}
	.pageBg {
		background: #F5F7FA;
		padding-top: 22upx;
		min-height: 100vh;
	}

	.card {
		.title {
			margin-left: 32upx;
			line-height: 42upx;
			font-size: 30upx;
			font-weight: bold;
			color: #222222;
			text-align: left;
			margin-bottom: 7upx;
		}
		margin: 0upx 32upx 20upx 32upx;
		background: #FFFFFF;
		box-shadow: 0px 4upx 20upx rgba(0, 17, 71, 0.1);
		opacity: 1;
		border-radius: 8upx;
		.cardtitle{
			height: 42upx;
			font-size: 30upx;
			 
			font-weight: bold;
			line-height: 47upx;
			color: #222222;
			opacity: 1;
			margin-left: 32upx;
			margin-bottom: 30upx;
		}
	}

	.cell {
		margin: 0 32upx;
		padding: 21upx 0;
		font-size: 30upx;
		 
		color: #222222;
		border-bottom: 1px solid #ECEFF4;
		line-height: 42upx;

		.left {
			width: 208upx;
		}
		.icCk{
			width: 14upx;
			height: 22upx;
			margin: auto;
		}
		.delimg {
			width: 30upx;
			height: 30upx;
			margin: auto;
			padding: 0upx 0 0upx 20upx;
		}

		.center {
			display: block;
			line-height: 42upx;
			flex: 1;
		}

		.right {
			padding: 0 14upx;
			min-width: 148upx;
			// display: block;
			text-align: center;
			line-height: 42upx;
			height: 42upx;
			background: #0061FF;
			opacity: 1;
			font-size: 24upx;
			color: #FFFFFF;
			border-radius: 4upx;
		}
	}
</style>
