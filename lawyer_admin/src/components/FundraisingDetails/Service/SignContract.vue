<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-card>
          <div
            style="
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              align-items: center;
              justify-content: space-between;
              margin: 10px;
            "
          >
            <b><h6>律师信息</h6></b>
            <user-vip-cell
              :nickname="form.lawyer.nickname"
              :avatar="form.lawyer.avatar"
              :mobile="form.lawyer.mobile"
              :user-id="form.lawyer.user_id"
            />
            <span>所属律师事务所：{{ form.lawyer.lawyer_office }}</span>
            <span>票数：{{ form.lawyer.votes_number }}</span>
            <span>
              选择录音：
              <a-select style="width: 120px" @change="changeRecord">
                <a-select-option :value="i.record_path" v-for="(i, key) in form.lawyer.records" :key="key">
                  {{ i.created_at }}
                </a-select-option>
              </a-select>
              <a @click="state.recordVisible = true">播放</a>
            </span>
            <a-popconfirm ok-text="复制" cancel-text="关闭" @confirm="copyNumber">
              <div>
                <a-button style="background: #2cbf78; color: #fff; margin: 0 10px" @click="callLawyer">
                  拨打电话
                </a-button>
              </div>
              <a-icon slot="icon" type="question-circle-o" style="color: #ffffff" />
              <input id="input" :value="mobileNumber" slot="title" />
            </a-popconfirm>
          </div>
          <a-divider style="margin: 0px" />
          <div
            style="
              margin: 10px;
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
            "
          >
            <div style="margin: 10px">收件人姓名：<a-input style="width: 200px" v-model="form.recv_nickname" /></div>
            <div style="margin: 10px">收件人号码：<a-input style="width: 200px" v-model="form.recv_mobile" /></div>
            <div style="margin: 10px">收件人地址：<a-input style="width: 200px" v-model="form.recv_address" /></div>
            <div style="margin: 10px">快递单号：<a-input style="width: 200px" v-model="form.ship_no" /></div>
          </div>
          <a-divider style="margin: 0px" />
          <b><h6>法律服务委托合同书</h6></b>
          <div
            style="
              width: 100%;
              height: auto;
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              justify-content: start;
            "
          >
            <div v-for="(i, key) in form.trust_agreement_images" :key="key" style="position: relative; margin: 0 15px">
              <img
                :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                style="
                  width: 18px;
                  height: 18px;
                  float: right;
                  position: absolute;
                  z-index: 2;
                  right: 10px;
                  top: 0px;
                  cursor: pointer;
                "
                @click="deleteF(key, 0)"
              />
              <div
                style="
                  width: 110px;
                  height: auto;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: start;
                "
              >
                <img
                  v-if="i.substring(i.lastIndexOf('/') + 1) === 'doc' || i.substring(i.lastIndexOf('/') + 1) === 'docx'"
                  :src="require('@/assets/Fundraising/doc_icon@2x.png')"
                  style="width: 90px; height: 90px"
                />
                <img
                  v-else-if="i.substring(i.lastIndexOf('/') + 1) === 'txt'"
                  :src="require('@/assets/Fundraising/txt_icon@2x.png')"
                  style="width: 90px; height: 90px"
                />
                <img
                  v-else-if="i.substring(i.lastIndexOf('/') + 1) === 'xls'"
                  :src="require('@/assets/Fundraising/xls_icon@2x.png')"
                  style="width: 90px; height: 90px"
                />
                <img v-else :src="require('@/assets/Fundraising/fj_icon@2x.png')" style="width: 90px; height: 90px" />
                <div style="width: 80px; word-break: break-all; height: auto">
                  <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                </div>
                <!-- <p style="width: 110px" class="brName">{{ i.file_name }}.{{ i.file_extension }}</p> -->
              </div>
            </div>
            <div
              @click="trigger(0)"
              v-show="fileList.length < 9"
              style="
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
              "
            >
              <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
              选择文件
            </div>
            <input
              type="file"
              ref="fileBtn"
              id="uploadFile"
              @change="getFile($event)"
              multiple="multiple"
              style="display: none"
            />
          </div>
          <a-divider style="margin: 0px 0px 30px 0" />
          <b><h6>授权委托书</h6></b>
          <div
            style="
              width: 100%;
              height: auto;
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              justify-content: start;
            "
          >
            <div
              v-for="(i, key) in form.power_of_attorney_images"
              :key="key"
              style="position: relative; margin: 0 15px"
            >
              <img
                :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                style="
                  width: 18px;
                  height: 18px;
                  float: right;
                  position: absolute;
                  z-index: 2;
                  right: 10px;
                  top: 0px;
                  cursor: pointer;
                "
                @click="deleteF(key, 1)"
              />
              <div
                style="
                  width: 110px;
                  height: auto;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: start;
                "
              >
                <img
                  v-if="i.file_extension === 'doc'"
                  :src="require('@/assets/Fundraising/doc_icon@2x.png')"
                  style="width: 90px; height: 90px"
                />
                <img
                  v-else-if="i.file_extension === 'txt'"
                  :src="require('@/assets/Fundraising/txt_icon@2x.png')"
                  style="width: 90px; height: 90px"
                />
                <img
                  v-else-if="i.file_extension === 'xls'"
                  :src="require('@/assets/Fundraising/xls_icon@2x.png')"
                  style="width: 90px; height: 90px"
                />
                <img v-else :src="require('@/assets/Fundraising/fj_icon@2x.png')" style="width: 90px; height: 90px" />
                <div style="width: 80px; word-break: break-all; height: auto">
                  <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                </div>
                <!-- <p style="width: 110px" class="brName">{{ i.file_name }}.{{ i.file_extension }}</p> -->
              </div>
            </div>
            <div
              @click="trigger"
              v-show="fileList.length < 9"
              style="
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
              "
            >
              <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
              选择文件
            </div>
            <input
              type="file"
              ref="fileBtn1"
              id="uploadFile"
              @change="getFile1($event)"
              multiple="multiple"
              style="display: none"
            />
          </div>
          <a-divider style="margin: 0px 0px 30px 0" />
          <div style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: flex-end">
            <a-button
              @click="postFundraisingLawyerContact"
              type="primary"
              style="margin: 0 5px; width: 100px; height: 40px"
            >
              保存
            </a-button>
            <a-button
              @click="postFundraisingLawyerContactMessage"
              style="
                width: 160px;
                height: 40px;
                margin: 0 5px;
                background: #2cbf78;
                color: #ffffff;
                border-color: #2cbf78;
              "
            >
              发送完善案件信息
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-drawer
      title="录音播放"
      placement="right"
      :closable="false"
      :visible="state.recordVisible"
      @close="state.recordVisible = false"
      width="400"
    >
      <single-audio-player :src="currentPlayRecord" />
    </a-drawer>
  </div>
</template>
  <script>
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import {
  postFundraisingLawyerContactMessage,
  postFundraisingLawyerContact,
  getFundraisingLawyerContact,
  getFundraisingStatus,
  postFundraisingLawyerMobile,
} from '@/api/fundraising'
import { uploadImage } from '@/api/common'
export default {
  name: 'currentSix',
  components: {
    UserVipCell,
    UserDetailDialog,
  },
  props: {
    fundraisingProgressId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      mobileNumber: '',
      currentPlayRecord: '',
      state: {
        recordVisible: false,
      },
      fundraisingId: 0,
      fileList: [],
      adminList: [],
      form: {
        lawyer: {
          user_id: 2,
          nickname: '帅哥',
          avatar:
            'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/bot/07ac7cd13fd0eb1654ccdbd222b81437.jpg',
          mobile: '18958904395',
          lawyer_office: '河南xxxxx律师事务所',
          votes_number: 32,
        },
        recv_mobile: '18958904395',
        recv_nickname: '测试',
        recv_address: 'test',
        ship_no: '1234',
        trust_agreement_images: ['https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png'],
        power_of_attorney_images: ['https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png'],
      },
    }
  },
  computed: {},
  watch: {
    fundraisingProgressId(value) {
      this.fundraisingProgressId = value
    },
  },
  created() {
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
        this.getFundraisingLawyerContact(this.fundraisingId)
      })
    },
    getFundraisingLawyerContact(fundraisingId) {
      getFundraisingLawyerContact(fundraisingId).then((data) => {
        this.form = data.data
        console.log(data.data)
      })
    },
    trigger(type) {
      if (type === 0) {
        this.$refs.fileBtn.dispatchEvent(new MouseEvent('click'))
      } else {
        this.$refs.fileBtn1.dispatchEvent(new MouseEvent('click'))
      }
    },
    deleteF(key, type) {
      if (type === 0) {
        this.form.trust_agreement_images.splice(key, 1)
      } else {
        this.form.power_of_attorney_images.splice(key, 1)
      }
    },
    getFile(event) {
      var images1 = event.target.files[0]
      uploadImage(images1).then((data) => {
        let images = {}
        images = data.data.url
        this.form.trust_agreement_images.push(images)
        event.target.value = ''
        this.$message.success('上传成功')
      })
    },
    getFile1(event) {
      var images1 = event.target.files[0]
      uploadImage(images1).then((data) => {
        let images = {}
        images = data.data.url
        this.form.power_of_attorney_images.push(images)
        event.target.value = ''
        this.$message.success('上传成功')
      })
    },
    postFundraisingLawyerContactMessage() {
      postFundraisingLawyerContactMessage(this.fundraisingId).then(() => {
        this.$message.success('发送成功')
        this.$router.push({ name: 'FundraisingService' })
      })
    },
    postFundraisingLawyerContact() {
      postFundraisingLawyerContact(
        this.fundraisingId,
        this.form.recv_mobile,
        this.form.recv_nickname,
        this.form.recv_address,
        this.form.ship_no,
        JSON.stringify(this.form.trust_agreement_images),
        JSON.stringify(this.form.power_of_attorney_images)
      ).then(() => {
        this.$message.success('保存成功')
      })
    },
    changeRecord(value) {
      this.currentPlayRecord = value
    },
    callLawyer() {
      postFundraisingLawyerMobile(this.fundraisingId).then((data) => {
        this.mobileNumber = data.data.mobile
      })
    },
    copyNumber() {
      var input = document.getElementById('input')
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('已复制！')
      } else {
        this.$message.error('复制失败！')
      }
    },
  },
}
</script>
 <style scoped>
.brName {
  width: 100%;
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  margin: 0;
}
</style>
