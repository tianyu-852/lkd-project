<template>
  <div>
    <a-row :gutter="[8, 16]">
      <a-col :span="24">
        <a-card :loading="state.loading">
          <a-col :span="24">
            <a-col :span="10">
              <div v-if="userData.litigant.is_auth === 1" @click="userData.litigant.is_auth = 0">
                <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span>当事人已身份认证 </span>
              </div>
              <div v-else @click="userData.litigant.is_auth = 1">
                <div>
                  <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span>当事人无法进行身份认证</span>
                </div>
              </div>
            </a-col>
            <a-col :span="6" :offset="8">
              <a @click="showModal">历史审核记录></a>
            </a-col>
          </a-col>
          <a-divider style="margin: 0px" v-if="$store.state.step.selectStep > 0" />
          <a-col :span="6" class="centerMoney" v-if="$store.state.step.selectStep > 0">
            <b> 案件金额</b>
          </a-col>
          <a-col
            v-if="$store.state.step.selectStep > 0"
            :span="18"
            style="border-left: 1px solid #00000019; height: auto; padding: 10px"
            :hoverable="false"
          >
            <a-col :span="12" class="moneyCss">诉讼费：{{ userData.property_money }}</a-col>
            <a-col :span="12" class="moneyCss">律师费：{{ userData.lawyer_money }}</a-col>
            <a-col :span="12" class="moneyCss">保全费：{{ userData.litigation_money }}</a-col>
            <a-col :span="12" class="moneyCss">鉴定费：{{ userData.appraisal_money }}</a-col>
            <a-col :span="12" class="moneyCss">总金额：{{ userData.case_money }}</a-col>
          </a-col>
          <a-divider style="margin: 0px" />
          <a-col
            v-if="userData.litigant.is_auth === 0"
            :span="6"
            class="center"
            style="flex-direction: column; overflow: auto"
          >
            <b> 情况说明</b>
          </a-col>
          <a-col
            v-if="userData.litigant.is_auth === 0 && type === 0"
            :span="18"
            style="border-left: 1px solid #00000019; min-height: 208px; padding: 10px"
            :hoverable="false"
          >
            <div style="word-wrap: break-word; word-break: normal">
              <p>{{ userData.not_auth_reason }}</p>
            </div>
          </a-col>
          <a-col
            v-if="userData.litigant.is_auth === 0 && type === 1"
            :span="18"
            style="border-left: 1px solid #00000019; min-height: 208px; padding: 10px"
            :hoverable="false"
          >
            <div style="word-wrap: break-word; word-break: normal">
              <a-input
                type="textarea"
                v-model="userData.not_auth_reason"
                style="border: none; height: 160px"
                :row="5"
              />
            </div>
          </a-col>
          <a-divider style="margin: 0px" v-if="userData.litigant.is_auth === 0" />
          <a-col :span="6" v-if="type === 0" class="center" style="flex-direction: column">
            <b>身份证</b>
          </a-col>
          <a-col
            :span="18"
            :hoverable="false"
            v-if="type === 0"
            style="border-left: 1px solid #00000019; min-height: 208px; padding: 10px"
          >
            <div
              style="
                text-align: center;
                height: 208px;
                overflow: auto;
                padding: 10px;
                display: flex;
                flex-direction: row;
                align-items: center;
              "
            >
              <ImageViewer ref="imageViewer" :images="images" />
              <img
                style="background-color: #eff1f5; width: 160px; height: 120px; margin: 5px; cursor: pointer"
                :src="userData.id_card_front_image"
                @click="showImages(1)"
              />
              <img
                style="background-color: #eff1f5; width: 160px; height: 120px; margin: 5px; cursor: pointer"
                :src="userData.id_card_back_image"
                @click="showImages(1)"
              />
            </div>
          </a-col>
          <a-divider style="margin: 0px" v-if="type === 0" />
          <a-col v-if="userData.litigant.is_auth === 0" :span="6" class="center" style="flex-direction: column">
            <b> 其他照片</b>
          </a-col>
          <a-col
            v-if="userData.litigant.is_auth === 0"
            :span="18"
            class="center"
            style="border-left: 1px solid #00000019; min-height: 208px; padding: 10px"
            :hoverable="false"
          >
            <div
              v-if="type === 1"
              style="
                width: 100%;
                height: 140px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: start;
              "
            >
              <ImageViewer ref="imageViewer" :images="images" />
              <div v-for="(i, key) in userData.not_auth_images" :key="key" style="position: relative">
                <div
                  v-show="key < 3"
                  style="
                    width: 70px;
                    height: 70px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: start;
                  "
                >
                  <div>
                    <img
                      v-show="$store.state.step.selectStep === 0"
                      :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                      style="
                        width: 10px;
                        height: 10px;
                        float: right;
                        position: absolute;
                        z-index: 2;
                        right: 5px;
                        top: 5px;
                        cursor: pointer;
                      "
                      @click="deleteF(key)"
                    />
                    <img
                      style="background-color: #eff1f5; width: 60px; height: 60px; margin: 5px; cursor: pointer"
                      :src="i"
                      @click="showImages"
                    />
                  </div>
                </div>
                <div
                  v-show="key === 3"
                  style="
                    position: relative;
                    width: 60px;
                    height: 60px;
                    float: left;
                    margin: 5px;
                    background: rgba(0, 0, 0, 0.3);
                  "
                >
                  <img class="imagesShow" :src="i" />
                  <span class="imagesSpan" @click="showImages">+{{ userData.not_auth_images.length - 3 }}</span>
                </div>
              </div>

              <div
                @click="triggers"
                v-show="userData.not_auth_images.length < 9 && $store.state.step.selectStep === 0"
                style="
                  cursor: pointer;
                  width: 60px;
                  height: 60px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  border-radius: 10px;
                  justify-content: center;
                  border: 2px dashed #0000004c;
                  margin: 0 5px;
                  font-size: 10px;
                "
              >
                <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 18px; height: 18px" />
                选择图片
              </div>
              <input
                type="file"
                id="imagesBtn"
                ref="imagesBtn"
                accept="image/*"
                @change="getImages($event)"
                multiple="multiple"
                style="display: none"
              />
            </div>
            <div v-if="type === 0">
              <div v-for="(i, key) in userData.not_auth_images" :key="i + 'images'">
                <div v-show="key < 3">
                  <img
                    style="background-color: #eff1f5; width: 100px; height: 100px; margin: 10px; cursor: pointer"
                    :src="i"
                    @click="showImages(0)"
                  />
                </div>
                <div
                  v-show="key === 3"
                  style="width: 100px; position: relative; float: left; margin: 10px; background: rgba(0, 0, 0, 0.3)"
                >
                  <img class="imagesShow" :src="i" />
                  <span class="imagesSpan" @click="showImages">+{{ userData.not_auth_images.length - 3 }}</span>
                </div>
              </div>
            </div>
          </a-col>
          <a-divider style="margin: 0px" v-if="userData.litigant.is_auth === 0" />
          <a-button
            v-show="dataStatus === 5 && $store.state.step.selectStep === 0"
            type="primary"
            style="float: right; margin: 10px"
            @click="save"
          >
            提交审核
          </a-button>
          <a-button
            v-if="dataStatus === 42 && $store.state.step.selectStep === 3"
            @click="uploadDemandsSubmit"
            type="primary"
            style="float: right; margin: 10px; background-color: #2cbf78; border-color: #2cbf78"
          >
            提交素材
          </a-button>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.confirmModal" title="请确认是否提交审核" @ok="submitData">
      <div style="height: 200px; overflow: auto"></div>
    </a-modal>
    <a-modal v-model="state.visible" title="历史审核记录" @ok="handleOk">
      <div style="height: 500px; overflow: auto">
        <div v-if="HistoryData.length === 0">
          <Empty />
        </div>
        <div v-for="(i, key) in HistoryData" :key="key" class="history_area">
          <span :style="i.status === 20 ? 'color: #ff524c' : 'color: #2cbf78'">
            {{ i.text }}
          </span>
          <label>{{ i.created_at }}</label>
          <div>
            <p>
              {{ i.refuse_reason }}
            </p>
          </div>
        </div>
      </div>
    </a-modal>
    <ImageViewer ref="imageViewer" :images="images" />
  </div>
</template>
  <script>
import { Empty } from 'ant-design-vue'
import { uploadImage } from '@/api/common'
import { getFundraisingDataHistory, putFundraisingRegistrationSubmit, getFundraisingStatus } from '@/api/fundraising'
import ImageViewer from '@/components/Image/ImageViewer'
export default {
  name: 'DetailstRight',
  components: {
    ImageViewer,
    Empty,
  },
  props: {
    detailstService: {
      type: Object,
      default: () => {
        return {}
      },
    },
    type: {
      type: Number,
      default: 1,
    },
    fundraisingProgressId: {
      type: Number,
      default: 0,
    },
    condition: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  data() {
    return {
      userData: {},
      images: [],
      is_not_auth: 0,
      HistoryData: [],
      state: {
        loading: false,
        changeList: true,
        notifyUser: false,
        postMessage: false,
        visible: false,
        recordVisible: false,
        confirmModal: false,
      },
      mobileNumber: '',
      currentPlayRecord: '',
    }
  },
  computed: {},
  watch: {
    immediate: true,
    detailstService(value) {
      this.detailstService = value
      return this.detailstService
    },
    fundraisingProgressId(value) {
      return value
    },
  },
  created() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    this.dataStatus = JSON.parse(sessionStorage.getItem('订单详情')).status
    this.state.loading = false
    if (this.userData.litigant.is_auth === 0) {
      this.is_not_auth = 1
    } else {
      this.is_not_auth = 0
    }
  },
  mounted() {},
  methods: {
    showImages(value) {
      if (value === 1) {
        const images = [this.userData.id_card_front_image, this.userData.id_card_back_image]
        this.images = images
        this.$refs.imageViewer.show()
      } else {
        const images = this.userData.not_auth_images
        this.images = images
        this.$refs.imageViewer.show()
      }
    },
    save() {
      this.$emit('save')
      this.state.confirmModal = true
    },

    submitData() {
      const notAuthReason = this.userData.not_auth_reason
      const notAuthImages = this.userData.not_auth_images
      this.userData = JSON.parse(sessionStorage.getItem('userData'))
      const Id = this.detailstService.fundraising_registration_id
      const isNotAuth = this.is_not_auth
      const fundraisingProgressId = this.fundraisingProgressId
      const creatorNickname = this.userData.creator.nickname
      const creatorMobile = this.userData.creator.mobile
      const litigantNickname = this.userData.litigant.nickname
      const litigantMobile = this.userData.litigant.mobile
      const content = this.userData.content
      const images = JSON.stringify(this.userData.images)
      const checkFiles = JSON.stringify(this.userData.check_files)
      const appeal = this.userData.appeal
      putFundraisingRegistrationSubmit(
        Id,
        isNotAuth,
        notAuthReason,
        JSON.stringify(notAuthImages),
        creatorNickname,
        creatorMobile,
        litigantNickname,
        litigantMobile,
        content,
        images,
        checkFiles,
        appeal
      ).then(() => {
        this.$message.success('已提交审核')
        const fundraisingData = this.$store.state.pendingAudit.fundraisingData + 1
        this.$store.commit('fundraisingDataUpload', { fundraisingData })
        getFundraisingStatus(fundraisingProgressId).then((data) => {
          sessionStorage.setItem('订单详情', JSON.stringify(data.data))
          this.$router.push({
            name: 'FundraisingService',
          })
        })
      })
    },
    getImages(event) {
      var images1 = event.target.files[0]
      uploadImage(images1).then((data) => {
        let images = {}
        images = data.data.url
        this.userData.not_auth_images.push(images)
        event.target.value = ''
        this.$message.success('上传成功')
      })
    },
    deleteF(e) {
      this.userData.not_auth_images.splice(e, 1)
    },
    triggers() {
      this.$refs.imagesBtn.dispatchEvent(new MouseEvent('click'))
    },
    showModal() {
      const currentUserId = this.userData.creator.user_id
      getFundraisingDataHistory(currentUserId).then((data) => {
        this.HistoryData = data.data
      })
      this.state.visible = true
    },
    handleOk() {
      this.addLawyerData = []
      this.state.visible = false
    },
    uploadDemandsSubmit() {
      this.$emit('uploadDemandsSubmit')
    },
  },
}
</script>
 <style scoped lang="less">
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: row;
  min-height: 208px;
  color: #222222;
  font-size: 16px;
}
.centerMoney {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: row;
  min-height: 120px;
  color: #222222;
  font-size: 16px;
}
.imagesShow {
  object-fit: contain;
  background-color: #eff1f5;
  width: 60px;
  height: 60px;
  cursor: pointer;
  top: 50%;
  text-align: center;
}

.imagesSpan {
  cursor: pointer;
  width: 60px;
  height: 60px;
  display: block;
  padding-left: 0px;
  line-height: 60px;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0.9;
  position: absolute;
  bottom: 0;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.moneyCss {
  height: 50px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
}
.history_area {
  span {
    color: #2cbf78;
    font-size: 14px;
    width: 25%;
    margin-right: 5%;
    padding: 10px;
  }
  label {
    width: 70%;
    color: #787e8d;
    padding: 10px;
  }
  div {
    background-color: #f7f8fa;
    width: 100%;
    height: 131px;
    margin: 10px 0;
    p {
      color: #787e8d;
      font-size: 14px;
      padding: 20px;
    }
  }
}
</style>
