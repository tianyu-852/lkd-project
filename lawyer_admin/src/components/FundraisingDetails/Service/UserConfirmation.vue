<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card>
          <a-col :span="24">
            <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
              <div>
                <user-vip-cell
                  :nickname="form.litigant.nickname"
                  :avatar="form.litigant.avatar"
                  :mobile="form.litigant.mobile"
                  :mode="form.is_auth"
                  size="big"
                />
              </div>
              <div style="padding: 0 32px"><label>案件类型：</label> {{ form.target_money }}</div>
              <div style="padding: 0 32px"><label>目标金额：</label> {{ form.target_money }}</div>
              <div style="padding: 0 32px"><label>负责客服：</label>{{ form.admin.nickname }}</div>
              <div style="padding: 0 32px"><label>负责人：</label>{{ form.admin.nickname }}</div>
              <!-- <div><a @click="state.historyLoading = true">历史审核记录 ></a></div> -->
            </div>
            <a-divider />
            <span style="font-size: 22px; font-weight: bold; color: #222222">求助人信息</span>
            <span style="margin: 10px">{{ form.created_at ? form.created_at + ' | 发布' : '' }} </span>
            <div style="margin: 24px 0">
              <label>求助人标题:</label>
              <a-input
                type="textarea"
                style="
                  background-color: #eff1f5;
                  width: 100%;
                  height: 60px;
                  display: flex;
                  flex-direction: row;
                  flex-wrap: nowrap;
                  align-items: center;
                  justify-content: space-around;
                  margin-top: 8px;
                "
                v-model="form.title"
              >
                <!-- <p style="margin: 0; font-size: 16px">{{ form.title }}</p> -->
              </a-input>
            </div>
            <div style="margin: 24px 0">
              <label>封面图片：</label>
              <div>
                <img
                  @click="showImage"
                  :src="form.cover_image"
                  style="width: 220px; height: 110px; margin-top: 8px; object-fit: contain"
                />
              </div>
              <a-button @click="ChooseCoverImage" style="margin-top: 20px" v-if="current === 47 || current === 48">
                重新选择封面
              </a-button>
              <input
                type="file"
                id="ChooseCoverImage"
                ref="ChooseCoverImage"
                accept="image/*"
                @change="getImages($event)"
                multiple="multiple"
                style="display: none"
              />
            </div>
            <div style="margin: 24px 0">
              <label>诉求说明:</label>
              <a-input
                type="textarea"
                style="
                  background-color: #eff1f5;
                  width: 100%;
                  height: auto;
                  max-height: 500px;
                  overflow: auto;
                  padding: 20px;
                  margin-top: 8px;
                "
                v-model="form.appeal"
              >
              </a-input>
            </div>
            <div style="margin: 24px 0">
              <label>求助详情说明:</label>
              <a-input
                type="textarea"
                style="
                  background-color: #eff1f5;
                  width: 100%;
                  height: auto;
                  max-height: 500px;
                  overflow: auto;
                  padding: 20px;
                  margin-top: 8px;
                "
                v-model="form.content"
              >
              </a-input>
            </div>
          </a-col>
          <a-divider style="margin: 0" />
          <span style="font-size: 22px; font-weight: bold; color: #222222">视频与图片资料</span><br />
          <label>视频：</label>
          <div style="height: auto; display: flex; flex-direction: row; align-items: center">
            <div v-for="(i, key) in caseFormData.videos" :key="i + 'z'">
              <div style="position: relative; width: 100px; height: 100px; margin: 5px; background: rgba(0, 0, 0, 0.3)">
                <img
                  :src="i + '?x-oss-process=video/snapshot,t_1,f_png,w_500,h_590,m_fast'"
                  style="width: 100px; height: 100px; object-fit: contain"
                />
                <img class="imagesSpan" style="float: right; position: absolute; z-index: 3; right: 0px; top: 0px" />
                <img
                  v-if="current === 47 || current === 48"
                  :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                  style="
                    width: 14px;
                    height: 14px;
                    float: right;
                    position: absolute;
                    z-index: 4;
                    right: 5px;
                    top: 5px;
                    cursor: pointer;
                  "
                  @click="deleteVideo(key)"
                />
                <img
                  :src="require('@/assets/Fundraising/video3083.png')"
                  style="
                    width: 30px;
                    height: 30px;
                    float: right;
                    position: absolute;
                    z-index: 4;
                    right: 35px;
                    top: 35px;
                    cursor: pointer;
                  "
                  @click="changeVideo(i)"
                />
              </div>
            </div>
            <div
              style="
                height: 100px;
                width: 100px;
                margin: 10px;
                background-color: 999999;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: center;
                border: 1px solid rgb(203, 209, 225);
              "
              v-show="state.beginUpload"
            >
              <a-spin />
              正在上传
            </div>

            <upload-video
              v-if="current === 47 || current === 48"
              @uploadVideo="getReturnUrl"
              @beginUpload="beginUpload"
              height="100px"
              width="100px"
              style="margin: 10px 0"
              :style="state.beginUpload ? 'pointer-events: none' : ''"
            />
          </div>
          <label>图片：</label>
          <div style="height: auto">
            <!-- 上传图片 -->
            <div
              style="
                margin-bottom: 24px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: start;
              "
            >
              <div v-for="(i, key) in form.images" :key="key" style="position: relative">
                <div
                  v-show="key < 3"
                  style="display: flex; flex-direction: column; align-items: center; justify-content: start"
                >
                  <div>
                    <img
                      style="
                        background-color: #eff1f5;
                        width: 100px;
                        height: 100px;
                        margin: 8px;
                        cursor: pointer;
                        position: relative;
                        object-fit: contain;
                      "
                      :src="i"
                      @click="showImages(form.images)"
                    />
                    <img
                      v-if="current === 47 || current === 48"
                      :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                      style="
                        width: 14px;
                        height: 14px;
                        float: right;
                        position: absolute;
                        z-index: 4;
                        right: 5px;
                        top: 5px;
                        cursor: pointer;
                      "
                      @click="deleteImages(key)"
                    />
                  </div>
                </div>
                <div
                  v-show="key === 3"
                  style="
                    position: relative;
                    width: 100px;
                    height: 100px;
                    float: left;
                    margin: 8px;
                    background: rgba(0, 0, 0, 0.3);
                  "
                >
                  <img class="imagesShow" :src="i" />
                  <span class="imagesSpan" style="padding-left: 30px; cursor: pointer" @click="showImages(form.images)">
                    +{{ form.images.length - 3 }}
                  </span>
                </div>
              </div>
              <div
                v-if="current === 47 || current === 48"
                @click="openImageDrag"
                class="triggersCss"
                style="margin: 5px"
              >
                <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
                选择图片
              </div>
            </div>
          </div>
          <a-divider />
          <div
            v-if="current === 47 || current === 48"
            style="
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              align-items: center;
              flex-wrap: nowrap;
            "
          >
            选择发送:
            <a-select style="width: 120px" @change="addressChange1">
              <a-select-option value="0"> 发起人 </a-select-option>
              <a-select-option value="1"> 当事人 </a-select-option>
            </a-select>
            <button class="green-btn" style="margin-left: 40px" @click="uploadData">
              {{ current === 47 ? '发送' : '保存修改并发送' }}
            </button>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-modal
      :visible="state.historyLoading"
      title="历史审核记录"
      ok-text="确认"
      cancel-text="取消"
      @ok="state.historyLoading = false"
      @cancel="state.historyLoading = false"
    >
      <div style="height: 500px; overflow: auto">
        <div v-if="HistoryData.length === 0">
          <Empty />
        </div>

        <div v-for="(i, key) in HistoryData" :key="key * 45646">
          <span
            v-show="i.status === 20"
            style="color: #ff524c; font-size: 14px; width: 25%; margin-right: 5%; padding: 10px"
          >
            {{ i.text }}
          </span>
          <span
            v-show="i.status === 10"
            style="color: #2cbf78; font-size: 14px; width: 25%; margin-right: 5%; padding: 10px"
          >
            {{ i.text }}
          </span>
          <label for="" style="width: 70%; color: #787e8d; padding: 10px">{{ i.created_at }}</label>
          <div style="background-color: #f7f8fa; width: 100%; height: 131px; margin: 10px 0">
            <p style="color: #787e8d; font-size: 14px; padding: 20px">
              {{ i.refuse_reason }}
            </p>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="state.testLoading"
      title="预览视频"
      ok-text="确认"
      cancel-text="取消"
      @ok="state.testLoading = false"
    >
      <!-- 视频预览,视频文件拓展名AVI、mov、rmvb、rm、FLV、mp4、3GP -->
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        @pause="pausePlay($event)"
        :options="playerOptions"
      />
      <!-- <a-button @click="$refs.videoPlayer.pause()">停止</a-button> -->
    </a-modal>
    <a-modal
      v-model="state.uploadOpenLoading"
      title="上传图片"
      ok-text="确认"
      cancel-text="取消"
      width="600px"
      @ok="uploadNewDemand"
      @cancel="cancelData"
    >
      <dragImageUpload @imageReturn="getImagesUrl" areaHeight="200px" areaWidth="552px" />
      <div
        style="
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: start;
        "
      >
        <div v-for="(i, key) in newImageData" :key="key" style="position: relative">
          <div
            v-show="key < 3"
            style="
              width: 110px;
              height: 110px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: start;
            "
          >
            <div>
              <img
                :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                style="
                  width: 14px;
                  height: 14px;
                  float: right;
                  position: absolute;
                  z-index: 2;
                  right: 10px;
                  top: 10px;
                  cursor: pointer;
                "
                @click="deleteNewData(key)"
              />
              <img
                style="
                  background-color: #eff1f5;
                  width: 100px;
                  height: 100px;
                  margin: 5px;
                  cursor: pointer;
                  object-fit: contain;
                "
                :src="i"
                @click="showImages(newImageData)"
              />
            </div>
          </div>
          <div
            v-show="key === 3"
            style="
              position: relative;
              width: 100px;
              height: 100px;
              float: left;
              margin: 10px;
              background: rgba(0, 0, 0, 0.3);
            "
          >
            <img class="imagesShow" :src="i" />
            <span class="imagesSpan" @click="showImages(newImageData)" style="padding-left: 30px; cursor: pointer">
              +{{ newImageData.length - 3 }}
            </span>
          </div>
        </div>
        <div class="upLoadDiv" @click="triggers(1)">
          <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
          <span>上传图片</span>
          <input
            type="file"
            id="imagesBtn"
            ref="imagesBtn"
            accept="image/*"
            @change="getFlies($event)"
            multiple="multiple"
            style="display: none"
          />
        </div>
      </div>
    </a-modal>
    <ImageViewer ref="imageViewer" :images="images" />
  </div>
</template>
  <script>
import uploadVideo from '@/components/Common/uploadVideo.vue'
import dragImageUpload from '@/components/Common/dragImageUpload.vue'
import UserVipCell from '@/components/User/UserVipCell'
import { FormModel, Cascader, Empty } from 'ant-design-vue'
import ImagesUoload from '@/components/upload/ImagesUpload'
import ImageViewer from '@/components/Image/ImageViewer'
import DetailsSteps from '@/components/FundraisingDetails/detailsSteps'
import { uploadImage, UploadFiles } from '@/api/common'
import {
  getFundraisingCreator,
  getFundraisingStatus,
  putFundraisingCaseSubmit,
  getFundraisingDetailData,
} from '@/api/fundraising'
import moment from 'moment'
import AStyleButton from '../../Common/AStyleButton.vue'
export default {
  name: 'Index',
  components: {
    FormModel,
    ImagesUoload,
    DetailsSteps,
    UserVipCell,
    ImageViewer,
    Cascader,
    Empty,
    AStyleButton,
    dragImageUpload,
    uploadVideo,
  },
  props: {
    currentType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      images: [],
      HistoryData: [],
      form: {
        admin: {
          nickname: '',
        },
        is_display: 0,
        litigant: {
          nickname: '',
          avatar: '',
          mobile: null,
        },

        is_auth: null,
        target_money: 0,
        admin_nickname: '',
        admin_real_name: '',
        cover_image: '',
        title: '',
        content: '',
        images: [],
        lawyer_office: {
          lawyer_office: '',
          lawyer_office_url: '',
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
        lawyers: [
          {
            nickname: '',
            work_year: 0,
            lawyer_office: '',
            license_number: '',
            introduction: '',
            honor_certificates: [
              {
                title: '',
                image: '',
              },
            ],
            power_of_attorney_images: [],
            trust_agreement_images: [],
          },
        ],
        money: [
          {
            name: '',
            value: 0,
          },
        ],
        case: {
          address: '',
          case_type: '',
          litigant_id_card: '',
          litigant_role: '',
          other_side_nickname: '',
          other_side_type: '',
          trial_stage: '',
        },
        fundraising_progress_items: [
          {
            fundraising_progress_item_id: 0,
            fundraising_progress: '',
            images: [
              {
                title: '',
                image: '',
              },
            ],
          },
        ],
      },
      state: {
        historyLoading: false,
        testLoading: false,
        uploadOpenLoading: false,
        beginUpload: false,
      },
      newImageData: [],
      data: null,
      current: -1,
      fundraisingId: 0,
      items: {
        fundraising_progress_item_id: '',
        fundraising_progress: '',
        images: [
          // {
          //   title: '',
          //   image: '',
          // },
        ],
      },
      test: '',
      caseFormData: {
        cover_image: '',
        title: '',
        content: '',
        videos: [],
        images: [],
      },
      orderData: {
        trial_stage: '',
        province_id: '',
        city_id: '',
        litigant_role: '',
        id_card: '',
        other_side_type: '',
        other_side_nicknames: '',
        is_show_defendant: 0,
        send_type: '',
      },
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        autoplay: false,
        muted: false,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [
          {
            // 类型
            type: 'video/mp4',
            // url地址
            src: '',
          },
        ],
        poster: '',
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,
        },
      },
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
        this.current = data.data.status
        this.fundraisingId = data.data.fundraising_id
        this.getFundraisingCreator(this.fundraisingId)
        this.getFundraisingDetailData(this.fundraisingId)
        //      getFundraisingDataHistory(this.userData.creator.user_id).then((data) => {
        //   this.HistoryData = data.data
        // })
      })
    },
    getFundraisingCreator(fundraisingId) {
      getFundraisingCreator(fundraisingId).then((data) => {
        this.caseFormData = data.data
        console.log('表单数据', this.caseFormData)
      })
    },
    getFundraisingDetailData(fundraisingId) {
      getFundraisingDetailData(fundraisingId).then((data) => {
        this.form = data.data
        this.form.fundraising_id = fundraisingId
        console.log(this.form)
      })
    },
    uploadData() {
      // 保存并发送
      console.log(this.form)
      const title = this.form.title
      const appeal = this.form.appeal
      const content = this.form.content
      const coverImage = this.form.cover_image
      const images = JSON.stringify(this.form.images)
      const videos = JSON.stringify(this.caseFormData.videos)
      const sendType = this.orderData.send_type
      putFundraisingCaseSubmit(this.fundraisingId, sendType, title, appeal, content, coverImage, images, videos).then(
        () => {
          this.$message.success('发送成功')
          this.$router.push({
            name: 'FundraisingService',
          })
        }
      )
    },
    moment,
    addressChange1(e) {
      this.orderData.send_type = e
    },
    getImages(event) {
      var images1 = event.target.files[0]
      uploadImage(images1).then((data) => {
        this.form.cover_image = data.data.url
        event.target.value = ''
        this.$message.success('上传成功')
      })
    },
    triggers() {
      this.$refs.imagesBtn.dispatchEvent(new MouseEvent('click'))
    },
    ChooseCoverImage() {
      this.$refs.ChooseCoverImage.dispatchEvent(new MouseEvent('click'))
    },
    showImages() {
      this.images = this.form.images
      this.$refs.imageViewer.show()
    },
    showImage() {
      this.images = []
      this.images.push(this.form.cover_image)
      this.$refs.imageViewer.show()
    },
    getReturnUrl(data) {
      this.$message.success('上传视频成功')
      this.caseFormData.videos.push(data)
    },
    beginUpload(data) {
      this.state.beginUpload = data
    },
    deleteVideo(key) {
      this.caseFormData.videos.splice(key, 1)
    },
    deleteImages(key) {
      this.form.images.splice(key, 1)
    },
    deleteNewData(key) {
      this.newImageData.splice(key, 1)
    },
    openImageDrag() {
      this.state.uploadOpenLoading = true
      this.newImageData = JSON.parse(JSON.stringify(this.form.images))
    },
    uploadNewDemand() {
      // vue 数组实时更新，转化json再转回来可以避免
      this.form.images = JSON.parse(JSON.stringify(this.newImageData))
      this.state.uploadOpenLoading = false
    },
    cancelData() {
      this.newImageData = []
      this.state.uploadOpenLoading = false
    },
    getImagesUrl(data) {
      for (let i = 0; i < data.length; i++) {
        this.newImageData.push(data[i].url)
      }
      console.log(data)
    },
    getFlies(event) {
      if (event.target) {
        var images1 = []
        for (let i = 0; i < event.target.files.length; i++) {
          images1.push(event.target.files[i])
        }
        UploadFiles(images1).then((data) => {
          console.log(data.data)
          for (let index = 0; index < data.data.length; index++) {
            this.newImageData.push(data.data[index].url)
          }
          event.target.value = ''
          this.$message.success('上传成功')
        })
      }
    },
    changeVideo(value) {
      this.playerOptions.sources[0].src = value
      this.state.testLoading = true
    },
    pausePlay(player) {
      // 关闭弹窗-停止播放
      player.pause()
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      // 设置视频src
      if (this.$refs.videoPlayer === undefined) {
        this.playerOptions.sources[0] = {
          type: 'video/mp4',
          src: row.video,
        }
      } else {
        // 防止页面重复打开会播放同一个视频||暂时替代方案
        const palyer = this.$refs.videoPlayer.player
        palyer.src(row.video)
      }
    },
  },
}
</script>
 <style lang="less" scoped>
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
.imagesShow {
  object-fit: contain;
  background-color: #eff1f5;
  width: 100px;
  height: 100px;
  cursor: pointer;
  top: 50%;
  text-align: center;
}
.imagesSpan {
  width: 100px;
  height: 100px;
  display: block;
  line-height: 100px;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0.9;
  position: absolute;
  bottom: 0;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.triggersCss {
  cursor: pointer;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  justify-content: center;
  border: 2px dashed #0000004c;
}
.upLoadDiv {
  width: 96px;
  height: 96px;
  border: 2px dashed rgb(203, 209, 225);
  border-radius: 8px;
  margin-top: 10px;
  color: #787e8d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
