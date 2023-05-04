<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card bordered>
          <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-col :span="24" style="display: flex; align-items: center; flex-direction: row">
              <h6 style="margin: 0">
                <b>{{ lawyersList[0].nickname }}律师信息</b>
              </h6>
              <a-dropdown style="margin: 0 20px">
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"> 切换律师 <a-icon type="swap" /> </a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="(i, key) in lawyersList" :key="key">
                    <a @click="changeLawyer(i.fundraising_lawyer_id)">{{ i.nickname }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <a-button type="primary" @click="remindUser(1, fundraisingId)">提醒上传</a-button>
            </a-col>
            <a-divider />

            <div style="padding: 0 12px">
              <label class="labelh6"><b>律师委托说明</b></label>
            </div>
            <div>
              <div
                style="
                  margin: 24px 0;
                  padding: 0 12px;
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  flex-wrap: nowrap;
                  justify-content: flex-start;
                "
              >
                <div style="margin: 9px 24px 9px 0; width: 300px">
                  <label>律师名字:</label>
                  <span>
                    {{ form.lawyer.nickname }}

                    <!-- <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" /> -->
                  </span>
                </div>
                <div style="margin: 9px 24px; width: 300px">
                  <label>所在律所:</label>
                  {{ form.lawyer.lawyer_office ? form.lawyer.lawyer_office : '待上传' }}
                </div>
                <div style="margin: 9px 24px; width: 300px">
                  <label>执业证号:</label>
                  {{ form.lawyer.license_number ? form.lawyer.license_number : '待上传' }}
                </div>
              </div>
              <div style="padding: 0 12px">
                <label>律师简介:</label>
                <div
                  style="
                    width: 100%;
                    height: 180px;
                    max-height: 500px;
                    border: 0px;
                    background-color: #eff1f5;
                    padding: 15px;
                    overflow: overlay;
                    margin-top: 8px;
                  "
                >
                  <p>
                    {{ form.lawyer.introduction }}
                  </p>
                </div>
              </div>
              <div style="margin: 24px 0; padding: 0 12px">
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
                    margin-top: 8px;
                  "
                >
                  <div
                    v-for="(i, key) in form.lawyer.honor_certificates"
                    :key="key + i"
                    class="center_column"
                    style="width: 250px; height: 150px"
                    @click="openModal(form.lawyer.honor_certificates, 0)"
                  >
                    <img
                      :src="i.image"
                      style="width: 240px; height: 120px; background-color: #eff1f5; margin: 0 5px; object-fit: contain"
                    />
                    <label>{{ i.title }}</label>
                  </div>
                </div>
              </div>
              <div style="margin: 24px 0; padding: 0 12px">
                <label>法律服务委托书:</label>
                <div
                  class="center_row"
                  style="width: 100%; height: auto; padding: 5px; flex-wrap: wrap; margin-top: 8px"
                >
                  <div
                    v-for="(i, key) in form.lawyer.trust_agreement_images"
                    :key="key + i"
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
                      @click="openModal(form.lawyer.trust_agreement_images, 0)"
                    />
                  </div>
                </div>
              </div>
              <div style="margin: 24px 0; padding: 0 12px">
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
                    margin-top: 8px;
                  "
                >
                  <div
                    v-for="(i, key) in form.lawyer.power_of_attorney_images"
                    :key="key * 3"
                    style="width: 120px; height: 120px; display: flex; align-items: center"
                    @click="openModal(form.lawyer.power_of_attorney_images, 0)"
                  >
                    <img
                      :src="i"
                      style="width: 110px; height: 110px; background-color: #eff1f5; margin: 0 5px; object-fit: contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            <a-divider />
            <div style="margin: 24px 0; padding: 0 12px">
              <label class="labelh6"><b>委托事务所说明</b></label>
            </div>
            <div
              style="
                margin: 24px 0;
                padding: 0 12px;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: center;
              "
            >
              <div style="width: 500px">
                <label>事务所名称:</label>
                <span v-if="form.lawyer_office.lawyer_office === '' || form.lawyer_office.lawyer_office === null">
                  待上传
                </span>
                <span v-else>
                  {{ form.lawyer_office.lawyer_office }}
                  <!-- |
                  <span style="color: #3980ea">
                    {{ form.lawyer_office.address ? form.lawyer_office.address : '未添加网址' }}
                  </span> -->
                </span>
              </div>
              <div style="width: 400px; margin-left: 64px">
                <label>地址:</label>
                {{ form.lawyer_office.address ? form.lawyer_office.address : '待上传' }}
              </div>
            </div>
            <div style="margin: 24px 0; padding: 0 12px">
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
                    @click="openModal(form.lawyer_office.practice_license, 1)"
                  />
                  <!-- <label>xxxx荣耀证书</label> -->
                </div>
              </div>
            </div>
            <div style="margin: 24px 0; padding: 0 12px">
              <label>律所简介:</label>
              <div
                style="
                  width: 100%;
                  height: 180px;
                  border: 0px;
                  background-color: #eff1f5;
                  padding: 15px;
                  overflow: overlay;
                  margin-top: 8px;
                "
              >
                <p>
                  {{ form.lawyer_office.introduction }}
                </p>
              </div>
            </div>
            <div style="margin: 24px 0; padding: 0 12px">
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
                  margin-top: 8px;
                "
              >
                <div
                  v-for="(i, key) in form.lawyer_office.honor_certificates"
                  :key="key * 3"
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
                    @click="openModal1(form.lawyer_office.honor_certificates)"
                  />
                  <label>{{ i.title }}</label>
                </div>
              </div>
            </div>
            <a-divider />
            <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end">
              <!-- <a-button style="background-color: #337ab7; border-color: #337ab7; color: #fff; margin: 0 10px">
                联系修改
              </a-button> -->
              <a-button type="primary" @click="postFundraisingLawyersData"> 确认发布</a-button>
            </div>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
    <ImageViewer ref="imageViewer" :images="showImages" />
  </div>
</template>
<script>
import UserVipCell from '@/components/User/UserVipCell'
import { FormModel } from 'ant-design-vue'
import ImageViewer from '@/components/Image/ImageViewer'
import DetailsSteps from '@/components/FundraisingDetails/detailsSteps'
import {
  postFundraisingLawyersData,
  getFundraisingLawyersData,
  getFundraisingLawyersList,
  getFundraisingStatus,
  postFundraisingLawyersRemind,
} from '@/api/fundraising'
import moment from 'moment'
export default {
  name: 'Index',
  components: {
    FormModel,
    DetailsSteps,
    UserVipCell,
    ImageViewer,
  },
  props: {
    currentType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showImages: [],
      form: {
        lawyer: {
          nickname: '',
          lawyer_grade_chinese: '',
          is_auth: 1,
          lawyer_office: '',
          license_number: '',
          introduction: '',
          honor_certificates: [
            {
              title: '',
              image: '',
            },
          ],
          trust_agreement_images: [''],
          power_of_attorney_images: [''],
        },
        lawyer_office: {
          lawyer_office: '',
          address: '',
          practice_license: '',
          introduction: '',
          honor_certificates: [
            {
              title: '',
              image: '',
            },
          ],
        },
      },
      lawyersList: [
        {
          fundraising_lawyer_id: 1,
          nickname: '',
        },
        {
          fundraising_lawyer_id: 2,
          nickname: '',
        },
      ],
      size: 'big',
      type: 0,
      fundraisingId: 0,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.type = this.$route.params.type
    this.fundraisingProgressId = Number(this.$route.params.fundraisingProgressId)
    this.getFundraisingStatus(this.fundraisingProgressId)
  },
  mounted() {},
  methods: {
    getFundraisingStatus(fundraisingProgressId) {
      getFundraisingStatus(fundraisingProgressId).then((data) => {
        this.fundraisingRegistrationId = data.data.fundraising_registration_id
        this.current = data.data.status / 5 - 1
        this.fundraisingId = data.data.fundraising_id
        console.log(data.data)
        this.getFundraisingLawyersList()
      })
    },
    getFundraisingLawyersList() {
      getFundraisingLawyersList(this.fundraisingId).then((data) => {
        this.lawyersList = data.data
        console.log(this.form)
        console.log(this.lawyersList)
        this.changeLawyer(data.data[0].fundraising_lawyer_id)
      })
    },
    postFundraisingLawyersData() {
      postFundraisingLawyersData(this.fundraisingId).then(() => {
        this.$message.success('发布成功')
        this.$router.push({ name: 'FundraisingService' })
      })
    },
    changeLawyer(data) {
      getFundraisingLawyersData(data).then((data) => {
        this.form = data.data
        console.log(this.form)
      })
    },
    moment,
    remindUser(type, fundraisingId) {
      postFundraisingLawyersRemind(type, fundraisingId).then(() => {
        this.$message.success('已成功提醒')
      })
    },
    openModal(value, type) {
      if (type === 1) {
        this.showImages = []
        this.showImages.push(value)
      } else {
        this.showImages = value
      }
      this.$refs['imageViewer'].show()
    },
    openModal1(value) {
      console.log(value)
      const images = []
      for (let i = 0; i < value.length; i++) {
        images.push(value[i].image)
      }
      this.showImages = images
      this.$refs.imageViewer.show()
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
.center_row {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-self: center;
}
.center_column {
  display: flex;
  flex-direction: column;
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
