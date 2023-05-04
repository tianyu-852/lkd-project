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
              <div style="padding: 0 32px"><label>目标金额：</label> {{ form.target_money }}</div>
              <div style="padding: 0 32px"><label>负责客服：</label>{{ form.admin.nickname }}</div>
              <div style="padding: 0 32px"><label>负责人：</label>{{ form.admin.nickname }}</div>
              <div><a @click="state.historyLoading = true">历史审核记录 ></a></div>
            </div>
            <a-divider />
            <h5>求助人信息</h5>
            <div style="margin: 24px 0">
              <label>求助人标题:</label>
              <div
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
              >
                <p style="margin: 0; font-size: 16px">{{ form.title }}</p>
              </div>
            </div>
            <div style="margin: 24px 0">
              <label>封面图片：</label>
              <div>
                <img
                  @click="showImage(form.cover_image)"
                  :src="form.cover_image"
                  style="width: 220px; height: 110px; margin-top: 8px; cursor: pointer"
                />
              </div>
            </div>
            <div style="margin: 24px 0">
              <label>求助详情说明:</label>
              <div
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
              >
                <p style="margin: 0; font-size: 16px">{{ form.content }}</p>
              </div>
            </div>
          </a-col>
          <a-divider style="margin: 0" />
          <h5>案件信息</h5>
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
            "
          >
            <div style="margin: 9px 24px; width: 300px">
              <label>审理阶段：</label>
              {{ form.case.trial_stage ? form.case.trial_stage : '待上传审理阶段' }}
              <!-- <a-select style="width: 120px" @change="changeTrialStage" size="small">
                <a-select-option v-for="(i, key) in trialData" :key="key" :value="i.name">
                  {{ i.name }}
                </a-select-option>
              </a-select> -->
            </div>
            <div style="margin: 9px 24px; width: 400px">
              <label>案件所在城市：</label>
              {{ form.case.province === form.case.city ? form.case.city : form.case.province + form.case.city }}
              <!-- <Cascader
                v-model="cityCascade"
                :options="options"
                :show-search="{ filter }"
                placeholder="搜索城市"
                @change="onChange"
                size="small"
              /> -->
            </div>
            <div style="margin: 9px 24px; width: 300px">
              <label>委托当事人:</label>
              {{ form.case.litigant_role === 0 ? '被告' : '原告' }}
            </div>
            <div style="margin: 9px 24px; width: 400px">
              <label>身份证号码:</label>
              {{ form.litigant.id_card }}
            </div>

            <div style="margin: 9px 24px" v-for="(i, key) in form.case.other_side_nicknames" :key="key">
              <label>
                {{
                  form.litigant_role === 0 || form.litigant_role === 2 || form.litigant_role === 4 ? '被告' : '原告'
                }}信息:
              </label>
              {{ form.case.other_side_type }} <label for=""></label>{{ i }}
            </div>
            <div style="margin: 9px 24px">
              <span v-if="form.is_show_defendant === 1" @click="form.is_show_defendant = 0">
                <img :src="require('@/assets/Fundraising/gx2_icon_sel@2x.png')" style="width: 18px; height: 18px" />
                展示被告信息
              </span>
              <span v-if="form.is_show_defendant === 0" @click="form.is_show_defendant = 1">
                <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 18px; height: 18px" />
                展示被告信息
              </span>
            </div>
          </div>
          <a-divider />
          <h5>视频与图片资料</h5>
          <label>视频：</label>
          <div style="height: auto; margin-bottom: 24px">
            <!-- 上传视频文件 -->
            <img
              :src="i.cover"
              v-for="(i, key) in form.videos"
              :key="key * 99"
              style="width: 110px; height: 110px; margin: 8px; cursor: pointer"
              @click="changeVideo(i)"
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
                        width: 110px;
                        height: 110px;
                        margin: 8px;
                        cursor: pointer;
                        position: relative;
                        object-fit: contain;
                        cursor: pointer;
                      "
                      :src="i"
                      @click="showImages"
                    />
                  </div>
                </div>
                <div
                  v-show="key === 3"
                  style="
                    position: relative;
                    width: 110px;
                    height: 110px;
                    float: left;
                    margin: 8px;
                    background: rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                  "
                >
                  <img class="imagesShow" :src="i" />
                  <span class="imagesSpan" @click="showImages">+{{ form.images.length - 3 }}</span>
                </div>
              </div>
            </div>
          </div>
          <a-divider />
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              align-items: center;
              flex-wrap: nowrap;
            "
          >
            <a-button
              style="color: #fff; background: #2cbf78; border-color: #2cbf78; margin-left: 40px"
              @click="uploadData"
              >审核</a-button
            >
          </div>
        </a-card>
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
      :visible="state.historyLoading"
      title="历史审核记录"
      ok-text="确认"
      cancel-text="取消"
      @ok="state.historyLoading = false"
      @cancel="state.historyLoading = false"
    >
      <Empty />
    </a-modal>
    <ImageViewer ref="imageViewer" :images="images" />
  </div>
</template>
  <script>
import UserVipCell from '@/components/User/UserVipCell'
import { FormModel, Cascader, Empty } from 'ant-design-vue'
import ImagesUoload from '@/components/upload/ImagesUpload'
import ImageViewer from '@/components/Image/ImageViewer'
import DetailsSteps from '@/components/FundraisingDetails/detailsSteps'
import { getLawyerDistricts } from '@/api/lawyer'
import {
  getFundraisingDetailData,
  getFundraisingStatus,
  getFundraisingTrialStage,
  putFundraisingUserSubmitCheck,
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
    Cascader,
    Empty,
  },
  props: {
    currentType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      radioType: '公司',
      userType: 0,
      images: [],
      value: 1,
      options: [],
      cityCascade: [],
      form: {
        litigant: {
          nickname: '445',
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
      state: {
        historyLoading: false,
        testLoading: false,
      },
      data: null,
      current: -1,
      dateFormat: 'YYYY-MM-DD',
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
      TrialStage: '',
      provinceDistrictId: 0,
      cityDistrictId: 0,
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
      trialData: [],
      userTypeList: [],
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
    this.getDistricts()
  },
  mounted() {},
  methods: {
    onChange(value, selectedOptions) {
      this.orderData.province_id = value[0]
      this.orderData.city_id = value[1]
      console.log(this.orderData)
    },
    filter(inputValue, path) {
      return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    getDistricts() {
      // 城市级联
      getLawyerDistricts().then((data) => {
        var list = []
        for (let i = 0; i < data.data.length; i++) {
          list.push({ label: data.data[i].name, value: data.data[i].district_id, children: [] })
          for (let j = 0; j < data.data[i].cities.length; j++) {
            list[i].children.push({ label: data.data[i].cities[j].name, value: data.data[i].cities[j].district_id })
          }
        }
        this.options = list
      })
    },
    getFundraisingStatus(fundraisingProgressId) {
      getFundraisingStatus(fundraisingProgressId).then((data) => {
        // 会话缓存的步骤会变，客服可能会变，每次下一步的按钮触发后都要重新缓存订单信息,直接改vuex数据，看起来实时更新，
        this.fundraisingRegistrationId = data.data.fundraising_registration_id
        this.current = data.data.status / 5 - 1
        this.fundraisingId = data.data.fundraising_id
        this.form = data.data
        console.log(this.form)
        this.getFundraisingDetailData(this.fundraisingId)
        this.getFundraisingTrialStage(this.fundraisingId)
      })
    },
    getFundraisingDetailData(fundraisingId) {
      // console.log(fundraisingId)
      getFundraisingDetailData(fundraisingId).then((data) => {
        this.form = data.data
        this.form.fundraising_id = fundraisingId
        console.log(this.form.fundraise_money)
        // console.log(data.data)
        console.log('表单数据', this.form)
      })
    },
    getFundraisingTrialStage(fundraisingId) {
      getFundraisingTrialStage(fundraisingId).then((data) => {
        this.trialData = data.data
        console.log('审理阶段', this.trialData)
      })
    },
    uploadData() {
      putFundraisingUserSubmitCheck(this.fundraisingId, 1, '').then(() => {
        this.$router.push({
          name: 'FundraisingCheck',
        })
      })
    },
    goList() {
      const condition = this.$route.params.condition
      const fundraisingProgressId = this.fundraisingProgressId
      if (this.type === 1) {
        this.$router.push({ name: 'FundraisingList', params: { condition } })
      } else if (this.type === 0) {
        this.$router.push({ name: 'FundraisingRecommendList', params: { condition } })
      } else {
        this.$router.push({
          name: 'FundraisingDetailsService',
          params: { fundraisingProgressId },
        })
      }
    },
    moment,
    changeTrialStage(e) {
      // 默认传值为选项的value
      this.orderData.trial_stage = e
      for (let i = 0; i < this.trialData.length; i++) {
        if (this.trialData[i].name === e) {
          this.userTypeList = this.trialData[i].litigant_role
        }
      }
      console.log(this.orderData.trial_stage, this.userTypeList)
    },
    showImages() {
      this.images = this.form.images
      this.$refs.imageViewer.show()
    },
    showImage(value) {
      this.images = []
      this.images.push(value)
      this.$refs.imageViewer.show()
    },
    // 根据选择框改视频内容
    changeVideo(value) {
      console.log(value)
      this.playerOptions.sources[0].src = value.video
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
 <style lang="less" scoped>
/deep/ .ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 50px;
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
.imagesShow {
  object-fit: contain;
  background-color: #eff1f5;
  width: 110px;
  height: 110px;
  cursor: pointer;
  top: 50%;
  text-align: center;
}

.imagesSpan {
  cursor: pointer;
  width: 110px;
  height: 110px;
  display: block;
  padding-left: 35px;
  line-height: 110px;
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
</style>
