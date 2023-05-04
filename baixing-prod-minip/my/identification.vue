<template>
	<view>
		<view class="cell">
			<view class="userType marlr32">
				<!-- <text>认证类型</text> -->
				<view class="tag">个人认证</view>
				<view class="userTypeBox flex between hcenter">
					<view :class="['tags-item',tagsIndex==index?'on':'']" v-for="(item,index) in tags" :key="index" @click="onTags(item.id,index)">{{item.name}}</view>
					<view style="width: 29%;"></view>
				</view>
			</view>
			<view class="title">请上传您的免冠照</view>
			<view class="flex flexcenter">
				<u-upload name="image" :header="header" height="260" width="260" :action="action+authAvatar" :file-list="showList0" :custom-btn="true" max-count="1" :show-progress="false"	del-bg-color="rgba(0, 0, 0, 0.36)">
					<view slot="addBtn" class="addImgBtn"><image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662694245132-S0CwMj.png" mode="widthFix"></image></view>
				</u-upload>
			</view>
			<view class="tips">为了确保真实性,照片上传脸无遮挡更能提高通过率</view>
		</view>
		<view class="cell borderBot">
			<view class="title">上传{{tags[tagsIndex].title}}</view>
			<view class="tips">光线充足环境下，请将律师证正面朝上拍摄识别成功率更高哦</view>
			<view class="flex marlr32 flexcenter">
				<u-upload :header="header" name="image" height="235" width="318" :action="action+tags[tagsIndex].action" max-count="1" :file-list="showList1"
					del-bg-color="rgba(0, 0, 0, 0.36)" :custom-btn="true">
					<view slot="addBtn" class="slot-btn">
						<image src="/static/images/khba_image.svg" mode=""></image>
						<text>上传{{tags[tagsIndex].tips[0]}}</text>
					</view>
				</u-upload>
				<u-upload :header="header" name="image" height="235" width="318" :action="action+certificateCheck" max-count="1" :file-list="showList2"
					del-bg-color="rgba(0, 0, 0, 0.36)" :custom-btn="true" v-if="tags[tagsIndex].tips.length>1">
					<view slot="addBtn" class="slot-btn">
						<image src="/static/images/khba_image.svg" mode=""></image>
						<text>上传{{tags[tagsIndex].tips[1]}}</text>
					</view>
				</u-upload>
			</view>
			<text class="popBtn" @click="exampleShow=true">查看示例</text>
			<button class="confirmBtn marlr32" v-if="tags[tagsIndex].id!=1&&tags[tagsIndex].id!=3" @click="next">下一步</button>
		</view>
		<view class="cell  borderBot" v-if="tags[tagsIndex].id==1||tags[tagsIndex].id==3">
			<view class="title">服务地区</view>
			<view class="fromBox marlr32" >
				<!-- <view class="flex between hcenter cell" v-if="tags[tagsIndex].id!=5&&tags[tagsIndex].id!=1" @click="label.status=true">
					<text>选择标签</text>
					<view>
						{{label.select}}
						<u-icon name="arrow-right" color="#888D98"></u-icon>
					</view>
				</view> -->
				<view class="flex between hcenter cell" v-if="tags[tagsIndex].id==1||tags[tagsIndex].id==3" @click="toDistricts">
					<text>服务地区</text>
					<view class="flex">
						{{formData.address.city_id?formData.address.city:'请选择城市'}}
						<u-icon name="arrow-right" color="#888D98"></u-icon>
					</view>
				</view>
				<view class="flex between hcenter cell" v-if="tags[tagsIndex].id==1||tags[tagsIndex].id==3" @click="onDatePicker(0)">
					<text>发证日期</text>
					<view class="flex" >
						{{formData.issueDate||'请选择发证日期'}}
						<u-icon name="arrow-right" color="#888D98"></u-icon>
					</view>
				</view>
				<u-picker mode="time" v-model="dateShow" :params="params" @confirm="dateChange"></u-picker>
				<view class="flex between hcenter cell" v-if="tags[tagsIndex].id==1" @click="onDatePicker(1)">
					<text>有效日期</text>
					<view class="flex" >
						{{formData.effectiveDate||'请选择有效日期'}}
						<u-icon name="arrow-right" color="#888D98"></u-icon>
					</view>
				</view>
				<view class="flex between hcenter cell" v-if="tags[tagsIndex].id==5" @click="timesShow=true">
					<text>在读时间</text>
					<view class="flex" >
						{{formData.schoolTime.start&&formData.schoolTime.end?(formData.schoolTime.start+'-'+formData.schoolTime.end):'请选择时间'}}
						<u-icon name="arrow-right" color="#888D98"></u-icon>
					</view>
				</view>
				<u-picker mode="multiSelector" v-model="timesShow" :range="dateRange" @confirm="schoolDateChange" :default-selector='[50, 50]'></u-picker>
				<view class="flex between hcenter cell" v-if="tags[tagsIndex].id==4||tags[tagsIndex].id==6||tags[tagsIndex].id==7">
					<text>工作单位</text>
					<view class="flex" >
						<input type="text" v-model="formData.work" placeholder="请填写工作单位"/>
						<u-icon name="arrow-right" color="#888D98"></u-icon>
					</view>
				</view>
				<view class="flex between hcenter cell" v-if="tags[tagsIndex].id==5" @click="toSearch">
					<text>学校</text>
					<view class="flex">
						<!-- <input type="text" v-model="formData.school" placeholder="请填写学校"/> -->
						{{formData.school.school_name}}
						<u-icon name="arrow-right" color="#888D98"></u-icon>
					</view>
				</view>
			</view>
			<!-- <textarea v-model="formData.introduction" placeholder="请输入个人简介" class="introduction"/>
			<view class="flex-row">
				<u-upload ref="lawyerUpload" :index="`lawyer${lawyerIndex}`" @on-change="uploadChange" :header="header" height="144" width="144" :action="action2" name="image" max-count="9" :file-list="Lhonor_certificates[lawyerIndex]"  custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)" :show-upload-list="false">
					<view slot="addBtn" class="flex-row cell2">
						<text>上传律师荣誉照({{honor_certificates?honor_certificates.length:0}}/9)</text>
						<view class="hint">上传</view>
						<image style="width: 34upx;height: 28upx;margin: auto;" src="/static/images/sctp9_icon.svg"></image>
					</view>
				</u-upload>
			</view> -->
			<!-- <view>
				<view class="honorItem flex-column" v-for="img,index in honor_certificates">
					<image class="uploadImg" :src="img.image" mode="aspectFill"></image>
					<view class="label flex">
						<image src="/my/static/images/bj_icon@3x.png"></image>
						<u-input :clearable="false" v-model="img.title" height="37" placeholder="荣誉描述" class="input"/>
					</view>
					<image class="delImg" src="/static/images/gb_icon.svg" @click="removeHonor(index)"></image>
				</view>
				<view style="clear: both;"></view>
			</view> -->
			<button class="confirmBtn marlr32" @click="next">下一步</button>
		</view>
		<u-popup v-model="userTypeShow" mode="bottom" border-radius="24">
			<view class="userTypeBox">
				<view class="flex between hcenter">
					<view :class="['tags-item',tagsIndex==index?'on':'']" v-for="(item,index) in tags" :key="index" @click="onTags(item.id,index)">{{item.name}}</view>
					<view style="width: 29%;"></view>
				</view>
				<view class="footBtn">
					<u-icon name="close" color="#5E5E61" size="40" @click="userTypeShow=false"></u-icon>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="exampleShow" mode="center" border-radius="16">
			<view class="exampleBox">
				<view class="" v-if="tags[tagsIndex].id!=5">
					<view class="title">实例展示</view>
					<image src="/my/static/images/xxy_image.png" mode="widthFix"></image>
					<view class="tips">律师执业证个人信息页</view>
					<image src="/my/static/images/shy_image.png" mode="widthFix"></image>
					<view class="tips">律师执业证今年审核页</view>
				</view>
				<view class="" v-else>
					<view class="title">所在学校学生证展示</view>
					<image src="/my/static/images/xsz_image.png" mode="widthFix"></image>
					<view class="tips">学生证内页实例展示</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="hintShow" mode="center" border-radius="16">
			<view class="hintBox">
				<view class="title">百姓律师提醒您</view>
				<view class="desc">请填写个人简介可以获取更多案源线索噢</view>
				<view class="flex between button">
					<view @click="submit">继续</view>
					<view class="blue" @click="hintShow=false">返回填写</view>
				</view>
			</view>
		</u-popup>
		<u-popup :class="label.status?'zIndex1000':'none'" v-model="label.status" mode="top" class="popup" z-index="600" :mask-close-able="false">
			<view class="flex">
				<view class="width200">
					<view :class="['center','nav',index==label.index?'active':'']" v-for="(item,index) in label.list"
						@click="clickTab(index)" :key="index">
						{{item.lawyer_tag_group}}
						<view class="absolute xian" v-if="index==label.index"></view>
					</view>
				</view>
				<view class="tabC">
					<view class="marlr32 flex between">
						<view v-for="(item,index) in label.list[label.index].lawyer_tags" @click="clickLi(index)" :key="index"
						 :class="['tabCLi',(label.index == label.indexList[0]&&label.indexList[1] == index)||item.lawyer_tag_on?'liAction':'']">
							{{item.lawyer_tag}}
							<image src="/static/images/xz_icon.png" class="jiao"
								v-if="(label.index == label.indexList[0]&&label.indexList[1] == index)||item.lawyer_tag_on"></image>
						</view>
					</view>
					<view class="tabC-btn confirmBtn marlr32" @click="onTagsPop">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { server } from "@/request.js"
	import {
		getFabuList,
		setLawyerForm,
		getLawyerForm,
		setLawyerType
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				header: { "Authorization": uni.getStorageSync('token') },
				action: `${server}`,
				action2: `${server}api/common/image`,
				certificateCheck:'api/lawyer/auth/certificate/check',
				authAvatar:'api/lawyer/auth/avatar',
				showList0: [],
				showList1: [],
				showList2: [],
				exampleShow: false,
				dateShow: false,
				timesShow: false,
				userTypeShow: false,
				hintShow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				formData:{
					introduction: '',
					address: {
						city:'请选择城市',
						province_id:'',
						city_id:''
					},
					issueDate: '',
					effectiveDate: '',
					school: {
						id:'',
						name:''
					},
					schoolTime: {
						start:'',
						end:''
					},
					work: '',
				},
				tags:[
					// {
					// 	id:5,
					// 	name:'法学生',
					// 	title:'学生证',
					// 	tips:['所在学校学生证内页'],
					// 	action:'api/lawyer/auth/student-certificate'
					// },
					{
						id:0,
						name:'专职律师',
						title:'律师资格证',
						tips:['律师执业证详情页','考核备案内页'],
						action:'api/lawyer/auth/certificate'
					},{
						id:2,
						name:'兼职律师',
						title:'律师执业证',
						tips:['律师执业证详情页','考核备案内页'],
						action:'api/lawyer/auth/certificate'	
					},{
						id:1,
						name:'实习律师',
						title:'律师实习证',
						tips:['律师实习证详情页'],
						action:'api/lawyer/auth/internship-certificate'
					},{
						id:3,
						name:'法律工作者',
						title:'基层法律服务工作者执业资格证书',
						tips:['执业资格证书','考核备案内页'],
						action:'api/lawyer/auth/certificate'
					},{
						id:4,
						name:'公职律师',
						title:'公职律师执业证',
						tips:['公职执业证内页','考核备案内页'],
						action:'api/lawyer/auth/certificate'
					},{
						id:6,
						name:'公司律师',
						title:'公司律师执业证',
						tips:['公司执业证内页','考核备案内页'],
						action:'api/lawyer/auth/certificate'
					},{
						id:7,
						name:'法援律师',
						title:'法援律师执业证',
						tips:['法援执业证内页','考核备案内页'],
						action:'api/lawyer/auth/certificate'
					}
				],
				tagsIndex: 0,
				dateRange:[
					[2000, 2001], 
					[2000, 2001]
				],
				onDateType: 0,
				label: {
					select: "选择合适的标签哦～",
					status: false,
					list: [{
						lawyer_tags: ''
					}],
					index: 0,
					indexList: [],
					isClick: false,
					lawyer_tag_id: null
				},
				Lhonor_certificates:[],
				honor_certificates:[]
			}
		},
		methods: {
			uploadChange(res, index, lists, name){
				let list = []
				for (let i = 0; i < lists.length; i++) {
					list.push({
						title:'',
						image:lists[i].response ? lists[i].response.data.url : lists[i].url
					})
				}
				this.honor_certificates = list
			},
			removeHonor(index){
				this.$refs.lawyerUpload.remove(index)
				this.honor_certificates.splice(index,1)
			},
			// setLabelStatus() {
			// 	this.label.status = true
			// },
			getFabuList() {
				getFabuList({is_have_hot:1}).then(res => {
					this.label.list = res.data.data;
					console.log(this.label.list)
				})
			},
			getFormInfo(){
				getLawyerForm().then(res => {
					if(res.data.code==0){
						var data=res.data.data;
						this.tagsIndex=this.tags.findIndex(item => item.id == data.lawyer_grade);
						// this.label.lawyer_tag_id=data.lawyer_tags.length!=0?[data.lawyer_tags[0].lawyer_tag_id]:[];
						this.label.lawyer_tag_id=[];
						// this.formData.introduction=data.introduction;
						this.formData.work=data.company_name;
						this.formData.address.city=data.service_area_city;
						this.formData.address.province_id=data.service_area_province_id;
						this.formData.address.city_id=data.service_area_city_id;
						this.formData.issueDate=data.issue_date;
						this.formData.effectiveDate=data.valid_date;
						this.formData.school.school_id=data.school_id;
						this.formData.school.school_name=data.school_name;
						this.formData.schoolTime.start=data.school_start_time;
						this.formData.schoolTime.end=data.school_end_time;
						this.honor_certificates=data.honor_certificates;
						this.showList0=data.avatar_image?[{url:data.avatar_image}]:[];
						if(data.lawyer_grade==5){
							this.showList1=data.student_certificate_image?[{url:data.student_certificate_image}]:[];
						}else if(data.lawyer_grade==1){
							this.showList1=data.internship_certificate_image?[{url:data.internship_certificate_image}]:[];
						}else{
							this.showList1=data.certificate_image?[{url:data.certificate_image}]:[];
						}
						this.showList2=data.certificate_record_image?[{url:data.certificate_record_image}]:[];
					}else{
						uni.switchTab({
							url: "/pages/v1/my"
						})
						uni.$u.toast(res.data.message)
					}
					
				})
			},
			next(){
				// this.formData.introduction?this.submit():this.hintShow=true;
				this.submit()
			},
			submit(){
				this.hintShow=false
				setLawyerForm({
					lawyer_grade:this.tags[this.tagsIndex].id,
					lawyer_tag_ids:JSON.stringify(this.label.lawyer_tag_id),
					// introduction:this.formData.introduction,
					company_name:this.formData.work,
					service_area_province_id:this.formData.address.province_id,
					service_area_city_id:this.formData.address.city_id,
					issue_date:this.formData.issueDate,
					valid_date:this.formData.effectiveDate,
					school_id:this.formData.school.school_id,
					school_start_time:this.formData.schoolTime.start,
					school_end_time:this.formData.schoolTime.end,
					honor_certificates:JSON.stringify(this.honor_certificates)
				}).then(res => {
					if(res.data.code==0){
						this.$u.toast('提交成功');
						this.resetForm();
						uni.navigateTo({
							url: '/my/idCardUpLoad'
						})
					}else{
						this.$u.toast(res.data.message);
					}
				})
			},
			//重置数据
			resetForm(){
				this.label.lawyer_tag_id=[];
				this.formData.introduction='';
				this.formData.work='';
				this.formData.address.city='';
				this.formData.address.province_id='';
				this.formData.address.city_id='';
				this.formData.issueDate='';
				// this.formData.issueDate.year='';
				// this.formData.issueDate.month='';
				// this.formData.issueDate.day='';
				// this.formData.effectiveDate.year='';
				// this.formData.effectiveDate.month='';
				// this.formData.effectiveDate.day='';
				this.formData.effectiveDate='';
				this.formData.school.school_id='';
				this.formData.school.school_name='';
				this.formData.schoolTime.start='';
				this.formData.schoolTime.end='';
				this.showList0=[];
				this.showList1=[];
				this.showList2=[];
			},
			setLawyerType(){
				setLawyerType({lawyer_grade:this.tags[this.tagsIndex].id})
			},
			onTags(id,index){
				this.tagsIndex=index;
				this.userTypeShow=false;
			},
			toDistricts(){
				uni.navigateTo({
					url: '/pagesV1/common/districts?from=identification'
				})
			},
			toSearch(){
				uni.navigateTo({
					url: '/my/common/search'
				})
			},
			onDatePicker(n){
				this.onDateType=n;
				this.dateShow=true
			},
			dateChange(e){
				if(this.onDateType==0){
					this.formData.issueDate=e.year+'-'+e.month+'-'+e.day
				}else{
					this.formData.effectiveDate=e.year+'-'+e.month+'-'+e.day
				}
			},
			schoolDateChange(e){
				this.formData.schoolTime.start=this.dateRange[0][e[0]]
				this.formData.schoolTime.end=this.dateRange[0][e[1]]
				// this.formData.schoolTime.end=this.dateRange[0][e[0]]+'-'+this.dateRange[0][e[1]]
			},
			clickTab(e) {
				this.label.index = e
			},
			clickLi(e) {
				if(this.label.list[this.label.index].lawyer_tags[e].lawyer_tag_on==true){
					this.label.list[this.label.index].lawyer_tags[e].lawyer_tag_on=false;
					var index1=this.label.lawyer_tag_id.indexOf(this.label.list[this.label.index].lawyer_tags[e].lawyer_tag_id);
					this.label.lawyer_tag_id.splice(index1, 1);
					var index2=this.label.indexList.indexOf(this.label.list[this.label.index].lawyer_tags[e].lawyer_tag_id);
					this.label.indexList.splice(index2, 1);
					return;
				}
				if(this.label.lawyer_tag_id.length<3){
					this.label.indexList.push([this.label.index,e])
					this.label.lawyer_tag_id.push(this.label.list[this.label.index].lawyer_tags[e].lawyer_tag_id)
					this.label.list[this.label.index].lawyer_tags[e].lawyer_tag_on=true
				}else{
					this.$u.toast('最多只能选三个标签')
				}
				// this.label.lawyer_tag_id = [this.label.list[this.label.index].lawyer_tags[e].lawyer_tag_id]
				// this.label.select = this.label.list[this.label.index].lawyer_tags[e].lawyer_tag;
				// this.label.status = false;
				// this.label.indexList = [this.label.index, e];
				// this.label.isClick = true;
				// this.isStatus();
			},
			onTagsPop(){
				var text='';
				for(var i=0;i<this.label.indexList.length;i++){
					text=text+this.label.list[this.label.indexList[i][0]].lawyer_tags[this.label.indexList[i][1]].lawyer_tag+(i!==2?'、':'')
				}
				if(text) this.label.select=text
				this.label.status = false;
			},
			getSchoolYear(){
				let startYear = new Date().getFullYear()-50;
				let endYear = new Date().getFullYear()+50;
				var list=[];
				for (var i=startYear;i < endYear;i++){
					list.push(i);
				}
				this.dateRange[0]=list;
				this.dateRange[1]=list;
			}
		},
		onUnload(){
			console.log('我离开了');
			this.setLawyerType();
		},
		onLoad() {
			this.getFabuList();
			this.getFormInfo();
		},
		onReady(){
			this.getSchoolYear();
		}
	}
</script>

<style lang="scss">
	.borderBot{
		border-top: 12upx solid #F5F7FA;
	}
	.cell{
		text-align: center;
		padding: 20upx 0;
		background-color: #fff;
		input{
			text-align: right;
		}
	}
	.honorItem{
		width: calc(50% - 14upx);
		margin-right: 14upx;
		float: left;
		position: relative;
		margin-top: 16upx;
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
			// float: left;
			image{
				width: 22upx;
				height: 22upx;
				margin: auto;
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
	.cell2{
		width: calc(100vw - 64upx);
		height: 88upx;
		line-height: 88upx;
		border-top: 1upx solid #ECEFF4;
		border-bottom: 1upx solid #ECEFF4;
		font-size: 34upx;
		margin-bottom: 24upx;
		.hint{
			font-size: 26upx;
			flex: 1;
			color: #888D98;
			text-align: right;
			margin-right: 8upx;
		}
	}
	.title{
		color: #222;
		font-size: 32upx;
		font-weight: bold;
		margin: 12upx 0 20upx;
	}
	.tips{
		color: #888D98;
		font-size: 24upx;
	}
	.userType{
		font-size: 30upx;
		.tag{
			max-width: 140upx;
			color: #0061FF;
			font-size: 26upx;
			padding: 5upx 10upx;
			border: 2upx solid #0061FF;
			border-radius: 12upx;
			text{
				margin-right: 4upx;
			}
		}
	}
	.addImgBtn{
		image{
			width: 260upx;
			height: 260upx;
			margin-bottom: 20upx;
		}
	}
	.slot-btn {
		margin-bottom: 32upx;
		image {
			height: 235upx;
			width: 340upx;
		}
		text {
			display: block;
			text-align: center;
			font-size: 26upx;
			color: #888D98;
			margin-top: -15upx;
		}
	}
	.popBtn{
		color: #888D98;
		font-size: 24upx;
		padding: 3upx 23upx;
		border-radius: 100upx;
		background-color: #F3F5F8;
	}
	.fromBox{
		margin-bottom: 20upx;
		border-top: 1upx solid #ECEFF4;
		.cell{
			color: #888D98;
			padding: 0;
			font-size: 30upx;
			line-height: 94upx;
			border-bottom: 1upx solid #ECEFF4;
			text{
				color: #222;
				font-size: 34upx;
			}
		}
	}
	.introduction{
		width: calc(100% - 64upx);
		padding: 16upx 32upx;
		text-align: left;
		border-radius: 8upx;
		margin-bottom: 20upx;
		background: #F3F5F8;
	}
	.confirmBtn{
		height: 100upx;
		line-height: 100upx;
		margin-top: 48upx;
	}
	.exampleBox{
		padding: 0 50upx;
		text-align: center;
		overflow: hidden;
		.tips{
			margin: 20upx auto 48upx;
		}
		.title{
			margin: 24upx auto 40upx;
		}
		image{
			width: 490upx;
		}
	}
	.hintBox{
		padding:32upx;
		text-align: center;
		font-size: 30upx;
		font-weight: 500;
		line-height: 42upx;
		.title{
			font-size: 34upx;
			font-weight: bold;
			line-height: 68upx;
			margin-bottom: 32upx;
		}
		.button{
			font-size: 32upx;
			font-weight: bold;
			margin: 64upx auto 8upx;
			view{
				width: 280upx;
				height: 88upx;
				line-height: 88upx;
				background: #F3F5F8;
				border-radius: 8upx;
			}
			.blue{
				color: #fff;
				background-color: #0061FF;
				margin-left: 16upx;
			}
		}
	}
	.userTypeBox{
		padding: 28upx 0 8upx;
		// background-color: #F7F7FA;
		text-align: center;
		border-bottom: 1upx solid #ECEFF4;
		.tags-item{
			width: 29%;
			height: 68upx;
			line-height: 68upx;
			color: #888D98;
			font-size: 30upx;
			border-radius: 8upx;
			margin-bottom: 16upx;
			border: 2upx solid #EEF0F3;
			background-color: #EEF0F3;
		}
		.on{
			color: #0061FF;
			border: 3upx solid #0061FF;
			background-color: #fff;
		}
		.footBtn{
			margin-top: 56upx;
		}
	}
	.popup {
		margin-top: 170rpx;
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		.tabCLi {
			width: 233rpx;
			text-align: center;
			background: #EEF0F3;
			border-radius: 8px;
			line-height: 68rpx;
			margin: 10rpx 0;
			font-size: 30rpx;
			font-weight: 500;
			color: #888D98;
			border: 2upx solid #EEF0F3;
			overflow: hidden;
		}
		.tabC {
			width: 540rpx;
			padding-bottom: 144upx;
			.tabC-btn{
				width: calc(100% - 264upx);
				position: absolute;
				bottom: 32upx;
			}
		}
		.nav {
			margin: 72rpx 0;
			font-size: 32rpx;
			font-weight: 500;
			line-height: 47rpx;
			color: #888D98;
		}
		.active {
			font-weight: bold !important;
			color: #222222 !important;
			position: relative;
		}
		.jiao {
			width: 26rpx;
			height: 26rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
		.liAction {
			border: 1rpx solid #0061FF;
			background-color: #FFFFFF !important;
			color: #0061FF !important;
			position: relative;
		}
		.xian {
			width: 6rpx;
			height: 40rpx;
			background: #0061FF;
			right: -6rpx;
			top: 5rpx;
		}
		.width200 {
			width: 200rpx;
			background: #F3F5F8;
		}
	}
	.zIndex1000 {
		z-index: 1000;
	}

</style>
