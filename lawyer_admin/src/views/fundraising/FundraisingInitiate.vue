<template>
  <div>
    <a-row :gutter="[8, 16]">
      <a-col :span="24">
        <a-card>
          <a-col :span="6">
            <div @click="goList" style="width: 150px; cursor: pointer; color: #222222; font-size: 22px">
              <b>
                <span> ←<span>返回列表</span> </span>
              </b>
            </div>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card bordered>
          <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-col :span="24">
              <div style="display: flex; flex-direction: row; align-items: center">
                <div>
                  <user-vip-cell
                    :nickname="form.litigant.nickname"
                    :avatar="form.litigant.avatar"
                    :mobile="form.litigant.mobile"
                    :mode="form.is_auth"
                    :size="size"
                  />
                </div>
                <div style="padding: 0 32px"><label>目标金额：</label> {{ form.target_money }}</div>
                <div style="padding: 0 32px"><label>负责客服：</label>{{ form.admin.nickname }}</div>
                <div style="padding: 0 32px"><label>负责人：</label>{{ form.admin.alias }}</div>
              </div>
            </a-col>
            <a-col :span="24">
              <div>
                <div class="imgShow" style="width: 240px; height: 120px">
                  <img
                    :src="form.cover_image"
                    style="background-color: #eff1f5; width: 240px; height: 120px; object-fit: contain"
                  />
                </div>
              </div>
            </a-col>
            <a-divider />
            <a-col :span="24">
              <label class="labelh6"><b>用户信息</b></label>
            </a-col>
            <a-col :span="24">
              <label>求助标题：</label>
              <div
                style="width: 100%; border: 0px; background-color: #eff1f5; height: 60px; font-size: 20px"
                class="center"
              >
                <span v-if="form.title === null">待上传</span>
                <span v-else>{{ form.title }}</span>
              </div>
            </a-col>
            <a-col :span="24">
              <label>项目详情：</label>
              <div
                style="
                  width: 100%;
                  height: 180px;
                  border: 0px;
                  background-color: #eff1f5;
                  padding: 15px;
                  overflow: overlay;
                "
              >
                <p>
                  {{ form.content }}
                </p>
              </div>
            </a-col>
            <a-col :span="24">
              <label>事故照片：</label>
              <div style="width: 100%; height: 140px; padding: 5px">
                <img
                  v-for="(i, key) in form.images"
                  :key="key + 'sgzp'"
                  :src="i"
                  style="width: 110px; height: 110px; background-color: #eff1f5; margin: 0 5px; object-fit: contain"
                />
              </div>
            </a-col>
            <a-divider />
            <a-col :span="24">
              <label class="labelh6"><b>案件信息</b></label>
            </a-col>
            <a-col :span="8">
              <label>案件类型：</label>
              <span v-if="form.case.case_type">{{ form.case.case_type }}</span>
              <span v-else>待上传</span>
            </a-col>
            <a-col :span="8">
              <label>审理阶段：</label>
              <span v-if="form.case.trial_stage === '' || form.case.trial_stage === null">待上传审理阶段</span>
              <span v-else>{{ form.case.trial_stage }}</span>
            </a-col>
            <a-col :span="8">
              <label>案件所在城市：</label>
              <span>
                {{ form.case.city === form.case.province ? form.case.city : form.case.province + form.case.city }}
              </span>
            </a-col>
            <a-col :span="8">
              <label>委托当事人：</label>
              {{
                form.case.litigant_role === 1
                  ? '被告'
                  : form.case.litigant_role === 0
                  ? '原告'
                  : form.case.litigant_role === 3
                  ? '再审被申请人'
                  : form.case.litigant_role === 2
                  ? '再审申请人'
                  : form.case.litigant_role === 5
                  ? '被申诉人'
                  : form.case.litigant_role === 4
                  ? '申诉人'
                  : form.case.litigant_role === 7
                  ? '被抗诉申请人'
                  : form.case.litigant_role === 6
                  ? '抗诉申请人'
                  : ''
              }}
            </a-col>
            <a-col :span="8">
              <label>身份证号码：</label>
              <span>
                {{ form.litigant.id_card }}
                <img :src="iconList[3].url" style="width: 16px; height: 16px" />
              </span>
            </a-col>
            <a-col :span="8" v-for="(i, key) in form.case.other_side_nicknames" :key="key">
              <label>
                {{
                  form.case.litigant_role === 0
                    ? '被告'
                    : form.case.litigant_role === 1
                    ? '原告'
                    : form.case.litigant_role === 2
                    ? '再审被申请人'
                    : form.case.litigant_role === 3
                    ? '再审申请人'
                    : form.case.litigant_role === 4
                    ? '被申诉人'
                    : form.case.litigant_role === 5
                    ? '申诉人'
                    : form.case.litigant_role === 6
                    ? '被抗诉申请人'
                    : form.case.litigant_role === 7
                    ? '抗诉申请人'
                    : ''
                }}信息：</label
              >
              <span>{{ form.case.other_side_type }} {{ i }}</span>
            </a-col>
            <a-divider />
            <!--       <a-col :span="24">
              <label class="labelh6"><b>案件所需费用</b></label>
            </a-col>
            <a-col :span="5" v-for="(i, key) in form.money" :key="key + 'ajsxfy'">
              <label>{{ i.name }}:</label>
              <span style="width: 60%">{{ i.value }}</span>
            </a-col>
            <a-divider />

   <a-col :span="24">
              <label class="labelh6"><b>律师委托说明</b></label>
            </a-col>
            <div v-for="(index, key) in form.lawyers" :key="key + 'lswtsm'">
              <a-col :span="7">
                <label>律师名字:</label>
                <span v-if="index.nickname === '' || index.nickname === null">待上传</span>
                <span v-else>
                  {{ index.nickname }} | 从业{{ index.work_year }}年
                  <img :src="iconList[3].url" style="width: 16px; height: 16px" />
                </span>
              </a-col>
              <a-col :span="10">
                <label>所在律所:</label>
                <span v-if="index.lawyer_office === '' || index.lawyer_office === null">待上传</span>
                <span v-else>{{ index.lawyer_office }}</span>
              </a-col>
              <a-col :span="7">
                <label>执业证号:</label>
                <span v-if="index.license_number === '' || index.license_number === null">待上传</span>
                <span v-else>{{ index.license_number }}</span>
              </a-col>
              <a-col :span="24">
                <label>律师简介:</label>
                <div
                  style="
                    width: 100%;
                    height: 180px;
                    border: 0px;
                    background-color: #eff1f5;
                    padding: 15px;
                    overflow: overlay;
                  "
                >
                  <p>
                    {{ index.introduction }}
                  </p>
                </div>
              </a-col>
              <a-col :span="24">
                <label>律师荣誉证书:</label>
                <div
                  style="
                    width: 100%;
                    height: auto;
                    padding: 5px;
                    display: flex;
                    flex-direction: row;
                    align-content: center;
                    justify-content: start;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    v-for="(i, key) in index.honor_certificates"
                    :key="key + 'lsryzs'"
                    style="
                      width: 250px;
                      height: 150px;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <img
                      :src="i.image"
                      style="width: 240px; height: 120px; background-color: #eff1f5; margin: 0 5px; object-fit: contain"
                    />
                    <label>{{ i.title }}</label>
                  </div>
                </div>
              </a-col>
              <a-col :span="24">
                <label>法律服务委托书:</label>
                <div
                  style="
                    width: 100%;
                    height: auto;
                    padding: 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    v-for="(i, key) in index.trust_agreement_images"
                    :key="key + 'flfwwts'"
                    style="width: 120px; height: 120px"
                  >
                    <img
                      :src="i"
                      style="
                        width: 110px;
                        height: 110px;
                        display: flex;
                        align-items: center;
                        background-color: #eff1f5;
                        margin: 0 5px;
                        object-fit: contain;
                      "
                    />
                  </div>
                </div>
              </a-col>
              <a-col :span="24">
                <label>授权委托书:</label>
                <div
                  style="
                    width: 100%;
                    height: auto;
                    padding: 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-wrap: wrap;
                  "
                >
                  <div
                    v-for="(i, key) in index.power_of_attorney_images"
                    :key="key + 'wtsqs'"
                    style="width: 120px; height: 120px; display: flex; align-items: center"
                  >
                    <img
                      :src="i"
                      style="width: 110px; height: 110px; background-color: #eff1f5; margin: 0 5px; object-fit: contain"
                    />
                  </div>
                </div>
              </a-col>
            </div>
            <a-divider />

            <a-col :span="24">
              <label class="labelh6"><b>委托事务所说明</b></label>
            </a-col>
            <a-col :span="10">
              <label>事务所名称:</label>
              <span v-if="form.lawyer_office.lawyer_office === '' || form.lawyer_office.lawyer_office === null">
                待上传
              </span>
              <span v-else>
                {{ form.lawyer_office.lawyer_office }}|
                <span v-if="form.lawyer_office.lawyer_office_url" style="color: #3980ea">
                  {{ form.lawyer_office.lawyer_office_url }}</span
                >
                <span v-else>未添加网址</span>
              </span>
            </a-col>
            <a-col :span="6">
              <label>地址:</label>
              <span v-if="form.lawyer_office.address === '' || form.lawyer_office.address === null">待上传</span>
              <span v-else>{{ form.lawyer_office.address }}</span>
            </a-col>
            <a-col :span="24">
              <label>律师事务所执业许可证</label>
              <div
                style="
                  width: 100%;
                  height: auto;
                  padding: 5px;
                  display: flex;
                  flex-direction: row;
                  align-content: center;
                  justify-content: start;
                "
              >
                <div
                  style="
                    width: 250px;
                    height: 150px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <img
                    v-if="form.lawyer_office.practice_license"
                    :src="form.lawyer_office.practice_license"
                    style="width: 240px; height: 120px; background-color: #eff1f5; margin: 0 5px; object-fit: contain"
                  />
                  <label>xxxx荣耀证书</label>
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <label>律所简介:</label>
              <div
                style="
                  width: 100%;
                  height: 180px;
                  border: 0px;
                  background-color: #eff1f5;
                  padding: 15px;
                  overflow: overlay;
                "
              >
                <p>
                  {{ form.lawyer_office.introduction }}
                </p>
              </div>
            </a-col>
            <a-col :span="24">
              <label>律所荣耀：</label>
              <div
                style="
                  width: 100%;
                  height: auto;
                  padding: 5px;
                  display: flex;
                  flex-direction: row;
                  align-content: center;
                  justify-content: start;
                  flex-wrap: wrap;
                "
              >
                <div
                  v-for="(i, key) in form.lawyer_office.honor_certificates"
                  :key="key + 'lsry'"
                  style="
                    width: 250px;
                    height: 150px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <img
                    :src="i.image"
                    style="width: 240px; height: 120px; background-color: #eff1f5; margin: 0 5px; object-fit: contain"
                  />
                  <label>{{ i.title }}</label>
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <label>进度流程：</label>
              <div>
                <div v-for="(item, keys) in form.fundraising_progress_items" :key="keys" style="margin: 10px">
                  <div>
                    <li>
                      <img :src="iconList[4].url" style="height: 20px; width: 20px" />
                      <b> {{ item.fundraising_progress }}</b>
                    </li>
                    <img
                      v-for="(i, key) in item.images"
                      :key="key + 'jdlc'"
                      :src="i.image"
                      style="width: 240px; height: 120px; background-color: #c2ccdc; margin: 5px"
                    />
                  </div>
                </div>
              </div>
            </a-col> -->
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
  <script>
import UserVipCell from '@/components/User/UserVipCell'
import ImagesUoload from '@/components/upload/ImagesUpload'
import DetailsSteps from '@/components/FundraisingDetails/detailsSteps'
import { getFundraisingDetailData, getFundraisingStatus } from '@/api/fundraising'
import moment from 'moment'
export default {
  name: 'Index',
  components: {
    ImagesUoload,
    DetailsSteps,
    UserVipCell,
  },
  props: {
    currentType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: {
        litigant: {
          nickname: '当事人昵称',
          avatar:
            'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/bot/07ac7cd13fd0eb1654ccdbd222b81437.jpg',
          mobile: '18958904365',
          is_auth: 0,
          id_card: '33030319970101031x',
        },
        admin: {
          nickname: '王尼玛',
          alias: '别名啊',
        },
        target_money: '5000',
        fundraise_money: '5000',
        cover_image: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png',
        title: '测试',
        content: '测试内容',
        images: ['https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png'],
        videos: ['https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png'],
        case: {
          litigant_role: 0,
          is_show_defendant: 1,
          other_side_type: '个人',
          other_side_nicknames: ['第一被告人'],
          trial_stage: '一审',
          province: '河南省',
          city: '洛阳市',
          province_id: 1,
          city_id: 2,
        },
      },
      item: {
        fundraising_progress_item_id: null,
        fundraising_progress: '',
        images: [],
      },
      data: null,
      size: 'big',
      current: -1,
      fundraise_money: '0.00',
      target_money: '0.00',
      itemchange: false,
      previewVisible: false,
      dateFormat: 'YYYY-MM-DD',
      type: 0,
      fundraisingId: 0,
      iconList: [
        {
          url: require('@/assets/Fundraising/tj_icon@2x.png'),
        },
        {
          url: require('@/assets/Fundraising/sc_icon@2x.png'),
        },
        {
          url: require('@/assets/Fundraising/gx_icon_sel@2x.png'),
        },
        {
          url: require('@/assets/Fundraising/gx1_icon_sel@2x.png'),
        },
        {
          url: require('@/assets/Fundraising/finish.png'),
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.type = this.$route.params.type
    this.fundraisingId = this.$route.params.fundraisingId
    this.getFundraisingDetailData(this.fundraisingId)
  },
  mounted() {},
  methods: {
    getFundraisingDetailData(fundraisingId) {
      // console.log(fundraisingId)
      getFundraisingDetailData(fundraisingId).then((data) => {
        this.form = data.data
        console.log(this.form)
        this.form.fundraising_id = fundraisingId
        this.form.is_display = 1
        this.form.issue_date = moment(data.data.issue_date)
        // console.log(data.data)
        // console.log('表单数据', this.form)
      })
    },
    goList() {
      const condition = this.$route.params.condition
      this.$router.push({
        name: 'FundraisingList',
        params: { condition },
      })
    },
    handleCancel() {
      this.previewVisible = false
    },
  },
}
</script>
 <style scoped>
.imgDiv {
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}
.imgDelete {
  width: 18px;
  height: 18px;
  float: right;
  position: absolute;
  z-index: 2;
  right: 10px;
  top: 0px;
  cursor: pointer;
}
.imgShow {
  object-fit: cover;
  width: 110px;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}
.imgAdd {
  cursor: pointer;
  width: 110px;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  justify-content: center;
  border: 2px dashed #0000004c;
  margin: 0 15px;
}
.inputAdd {
  margin: 0 9px;
  width: 128px;
  text-align: center;
  padding: 6px;
  border: 0px solid #2cbf78;
  color: #787e8d;
  background-color: #2cbf78;
}
.center {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-self: center;
}
label {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 25px;
  color: #222222;
  opacity: 1;
}
.labelh6 {
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 800;
  line-height: 30px;
  color: #222222;
  opacity: 1;
}
</style>
