<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <label>上传求助人封面图：</label>
          <a>发布内容历史审核记录 ></a>
        </div>
        <div v-if="currentType" class="clearfix">
          <div class="imgDiv">
            <div v-if="form.cover_image !== ''" style="position: relative; margin: 0 15px">
              <img :src="require('@/assets/Fundraising/sc_icon@2x.png')" class="imgDelete" @click="deleteF(1, 0)" />
              <div class="imgShow" style="width: 240px; height: 120px">
                <img
                  :src="form.cover_image"
                  @click="showImage(form.cover_image, 0)"
                  style="background-color: #eff1f5; width: 240px; height: 120px; object-fit: contain"
                />
              </div>
            </div>
            <div v-else @click="trigger(0)" class="imgAdd" style="width: 240px; height: 120px">
              <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
              上传封面
            </div>
            <input
              type="file"
              ref="cover_image"
              id="cover_image"
              accept="image/*"
              @change="getCoverImage($event)"
              multiple="multiple"
              style="display: none"
            />
          </div>
        </div>
        <div v-else>
          <div class="imgShow" style="width: 240px; height: 120px">
            <img
              :src="form.cover_image"
              style="background-color: #eff1f5; width: 240px; height: 120px; object-fit: contain"
            />
          </div>
        </div>

        <a-divider />
        <label>填写求助人标题:</label>
        <a-input
          style="
            background-color: #eff1f5;
            width: 100%;
            height: 100px;
            word-wrap: break-word;
            word-break: normal;
            padding: 20px;
            margin: 20px 0;
            font-size: 16px;
          "
          v-model="form.title"
        />
        <a-divider />
        <label>上传求助人视频:</label>
        <div v-if="currentType" class="clearfix">
          <div class="imgDiv">
            <div style="position: relative; margin: 10px" v-for="(i, key) in form.videos" :key="key">
              <img :src="require('@/assets/Fundraising/sc_icon@2x.png')" class="imgDelete" @click="deleteF(key, 1)" />
              <div class="imgShow" style="width: 80px; height: 80px">
                <img
                  :src="i + '?x-oss-process=video/snapshot,t_1,f_png,w_500,h_590,m_fast'"
                  style="background-color: #eff1f5; width: 80px; height: 80px; object-fit: contain"
                  @click="changeVideo(i)"
                />
              </div>
              <div style="width: 80px; word-break: break-all; height: auto">
                <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
              </div>
            </div>
            <div
              style="
                height: 80px;
                width: 80px;
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
              @uploadVideo="getReturnUrl"
              @beginUpload="beginUpload"
              height="80px"
              width="80px"
              style="margin: 10px 0"
              :style="state.beginUpload ? 'pointer-events: none' : ''"
            />
          </div>
        </div>
        <div v-else>
          <div class="imgShow" style="width: 80px; height: 80px">
            <img :src="form.Videos" style="background-color: #eff1f5; width: 80px; height: 80px; object-fit: contain" />
          </div>
        </div>
        <a-divider />
        <label>上传求助人图片:</label>
        <div v-if="currentType" class="clearfix">
          <div class="imgDiv">
            <div style="position: relative; margin: 10px" v-for="(i, key) in form.images" :key="key">
              <img :src="require('@/assets/Fundraising/sc_icon@2x.png')" class="imgDelete" @click="deleteF(key, 2)" />
              <div class="imgShow" style="width: 80px; height: 80px">
                <img
                  :src="i"
                  style="background-color: #eff1f5; width: 80px; height: 80px; object-fit: contain"
                  @click="showImage(form.images, 1)"
                />
              </div>
              <div style="width: 80px; word-break: break-all; height: auto">
                <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
              </div>
            </div>
            <div @click="openImageDrag" class="imgAdd" style="width: 80px; height: 80px; margin: 10px 0">
              <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
              上传图片
            </div>
            <input
              type="file"
              ref="Image"
              id="Image"
              accept="image/*"
              @change="getImage($event)"
              multiple="multiple"
              style="display: none"
            />
          </div>
        </div>
        <div v-else>
          <div class="imgShow" style="width: 80px; height: 80px">
            <img :src="form.Images" style="background-color: #eff1f5; width: 80px; height: 80px; object-fit: contain" />
          </div>
        </div>
        <a-divider />
        <label>填写求助人故事：</label>
        <a-input
          type="textarea"
          style="
            background-color: #eff1f5;
            width: 100%;
            height: 160px;
            word-wrap: break-word;
            word-break: normal;
            padding: 20px;
            margin: 20px 0;
          "
          v-model="form.content"
        />

        <a-divider />

        <div style="display: flex; flex-direction: row-reverse">
          <a-button
            type="primary"
            style="background-color: #2cbf78; border-color: rgb(44, 191, 120)"
            @click="formDataUpload()"
          >
            上传审核
          </a-button>
        </div>
      </a-col>
    </a-row>
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
          height: 100px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: start;
        "
      >
        <div v-for="(i, key) in newdemand.files" :key="key" style="position: relative">
          <div
            v-show="key < 3"
            style="
              width: 100px;
              height: 100px;
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
                @click="deleteF(key, 3)"
              />
              <img
                style="
                  background-color: #eff1f5;
                  width: 80px;
                  height: 80px;
                  margin: 10px;
                  cursor: pointer;
                  object-fit: contain;
                "
                :src="i"
                @click="showImage(newdemand.files, 1)"
              />
            </div>
          </div>
          <div
            v-show="key === 3"
            style="
              position: relative;
              width: 80px;
              height: 80px;
              float: left;
              margin: 5px;
              background: rgba(0, 0, 0, 0.3);
            "
          >
            <img class="imagesShow" :src="i" />
            <span class="imagesSpan" @click="showImage(newdemand.files, 1)">+{{ newdemand.files.length - 3 }}</span>
            <!-- <img v-if="i.file_extension === 'doc'" :src="require('@/assets/Fundraising/doc_icon@2x.png')" style="width: 90px; height: 90px" />
                <img v-else-if="i.file_extension === 'txt'" :src="require('@/assets/Fundraising/txt_icon@2x.png')" style="width: 90px; height: 90px" />
                <img v-else-if="i.file_extension === 'xls'" :src=" require('@/assets/Fundraising/xls_icon@2x.png')" style="width: 90px; height: 90px" />
                <img v-else :src=" require('@/assets/Fundraising/fj_icon@2x.png')" style="width: 90px; height: 90px" />
                {{ i.file_name }} -->
          </div>
        </div>
        <div class="upLoadDiv" @click="triggers">
          <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
          <span>上传资料</span>
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
    <ImageViewer ref="imageViewer" :images="showImages" />
  </div>
</template>
  <script>
import dragImageUpload from '@/components/Common/dragImageUpload.vue'
import uploadVideo from '@/components/Common/uploadVideo.vue'
import UserVipCell from '@/components/User/UserVipCell'
import { FormModel } from 'ant-design-vue'
import ImagesUoload from '@/components/upload/ImagesUpload'
import ImageViewer from '@/components/Image/ImageViewer'
import DetailsSteps from '@/components/FundraisingDetails/detailsSteps'
import { uploadImage, UploadFiles } from '@/api/common'
import {
  getFundraisingStatus,
  postFundraisingCoverImage,
  getFundraisingCreator,
  putFundraisingCreatorSubmit,
} from '@/api/fundraising'
import moment from 'moment'
export default {
  name: 'Index',
  components: {
    FormModel,
    ImagesUoload,
    DetailsSteps,
    UserVipCell,
    ImageViewer,
    uploadVideo,
    dragImageUpload,
  },
  props: {
    currentType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      newdemand: {
        files: [],
      },
      showImages: [],
      form: {
        cover_image: '',
        title: '',
        content: '',
        videos: [],
        images: [],
      },
      state: {
        testLoading: false,
        beginUpload: false,
        uploadOpenLoading: false,
      },
      data: null,
      current: -1,
      fundraisingId: 0,
      items: {
        fundraising_progress_item_id: '',
        fundraising_progress: '',
        images: [],
      },
      test: '',
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
            type: 'video/mp4',
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
        this.current = data.data.status / 5 - 1
        this.fundraisingId = data.data.fundraising_id
        this.getFundraisingCreator(this.fundraisingId)
        console.log(this.fundraisingId)
      })
    },
    getFundraisingCreator(id) {
      getFundraisingCreator(id).then((data) => {
        this.form = data.data
        console.log(this.form)
      })
    },
    formDataUpload() {
      const title = this.form.title
      const content = this.form.content
      const coverImage = this.form.cover_image
      const images = JSON.stringify(this.form.images)
      const videos = JSON.stringify(this.form.videos)
      putFundraisingCreatorSubmit(this.fundraisingId, title, content, coverImage, images, videos).then((data) => {
        this.$router.push({
          name: 'FundraisingOperate',
        })
      })
    },
    getCoverImage(event) {
      const file = event.target.files[0]
      var form = new FormData()
      form.append('fundraising_id', this.fundraisingId)
      form.append('image', file)
      postFundraisingCoverImage(form).then((data) => {
        this.$message.success('上传封面成功')
        this.form.cover_image = data.data.url
        event.target.value = ''
      })
    },
    getReturnUrl(data) {
      this.$message.success('上传视频成功')
      this.form.videos.push(data)
    },
    beginUpload(data) {
      this.state.beginUpload = data
    },
    getFlies(event) {
      if (event.target) {
        var images1 = []
        for (let i = 0; i < event.target.files.length; i++) {
          images1.push(event.target.files[i])
        }
        console.log(images1)
        UploadFiles(images1).then((data) => {
          console.log(data.data)
          for (let index = 0; index < data.data.length; index++) {
            this.newdemand.files.push(data.data[index].url)
          }
          event.target.value = ''
          this.$message.success('上传成功')
        })
      }
    },
    getImage(event) {
      if (event.target) {
        var images1 = []
        for (let i = 0; i < event.target.files.length; i++) {
          images1.push(event.target.files[i])
        }
        UploadFiles(images1).then((data) => {
          for (let index = 0; index < data.data.length; index++) {
            this.form.images.push(data.data[index].url)
          }
          console.log(this.form.images)
          event.target.value = ''
          this.$message.success('上传图片成功')
        })
      }
    },
    trigger(e) {
      switch (e) {
        case 0:
          this.$refs.cover_image.dispatchEvent(new MouseEvent('click'))
          break
        case 1:
          this.$refs.VideoFile.dispatchEvent(new MouseEvent('click'))
          break
        case 2:
          this.$refs.Image.dispatchEvent(new MouseEvent('click'))
          break
        default:
          break
      }
    },
    triggers() {
      this.$refs.imagesBtn.dispatchEvent(new MouseEvent('click'))
    },
    deleteF(key, type) {
      switch (type) {
        case 0:
          this.form.cover_image = ''
          break
        case 1:
          this.form.videos.splice(key, 1)
          console.log(this.form)
          break
        case 2:
          this.form.images.splice(key, 1)
          break
        case 3:
          this.newdemand.files.splice(key, 1)
          break
        default:
          break
      }
    },
    uploadNewDemand() {
      // vue 数组实时更新，转化json再转回来可以避免
      this.form.images = JSON.parse(JSON.stringify(this.newdemand.files))
      this.state.uploadOpenLoading = false
    },
    cancelData() {
      this.newdemand.files = []
      this.state.uploadOpenLoading = false
    },
    getImagesUrl(data) {
      for (let i = 0; i < data.length; i++) {
        this.newdemand.files.push(data[i].url)
      }
      console.log(data)
    },
    openImageDrag() {
      this.state.uploadOpenLoading = true
      this.newdemand.files = JSON.parse(JSON.stringify(this.form.images))
    },
    moment,
    onChange(dates, dateStrings) {
      this.form.issue_date = dateStrings
    },
    showImage(imagseList, type) {
      if (type === 0) {
        this.showImages = []
        this.showImages.push(imagseList)
      } else {
        this.showImages = imagseList
      }
      this.$refs.imageViewer.show()
    },
    changeVideo(value) {
      console.log(value)
      this.playerOptions.sources[0].src = value
      this.state.testLoading = true
    },
    pausePlay(player) {
      // 关闭弹窗-停止播放
      this.player.pause()
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
 <style scoped>
.imgDiv {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: space-around;
  align-items: flex-start;
}
.imgDelete {
  width: 18px;
  height: 18px;
  float: right;
  position: absolute;
  z-index: 2;
  right: 0px;
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
.imagesSpan {
  cursor: pointer;
  width: 80px;
  height: 80px;
  display: block;
  padding-left: 20px;
  line-height: 80px;
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
.imagesShow {
  object-fit: contain;
  background-color: #eff1f5;
  width: 80px;
  height: 80px;
  cursor: pointer;
  top: 50%;
  text-align: center;
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
  cursor: pointer;
}
</style>
