<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card>
          <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
            <user-vip-cell
              :nickname="form.litigant.nickname"
              :avatar="form.litigant.avatar"
              :mobile="form.litigant.mobile"
              size="big"
            />
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 600px;
              "
            >
              已筹：{{ form.fundraise_money }}

              <div><a-progress :percent="percentage" style="width: 400px" /></div>
              目标：{{ form.target_money }}
            </div>
            <a
              style="margin-right: 20px"
              v-show="!state.fundraisingDetails"
              @click="state.fundraisingDetails = !state.fundraisingDetails"
            >
              展开全部内容<img
                :src="require('@/assets/Fundraising/open_icon_sel.png')"
                style="width: 11px; height: 6px"
              />
            </a>
            <a
              style="margin-right: 20px"
              v-show="state.fundraisingDetails"
              @click="state.fundraisingDetails = !state.fundraisingDetails"
            >
              收起全部内容<img
                :src="require('@/assets/Fundraising/close_icon_sel.png')"
                style="width: 11px; height: 6px"
              />
            </a>
          </div>
          <div v-show="state.fundraisingDetails">
            <a-divider />
            <p class="labelh6">求助人信息</p>
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
                  :src="form.cover_image"
                  @click="showImage(form.cover_image)"
                  style="width: 220px; height: 110px; cursor: pointer; margin-top: 8px"
                />
              </div>
            </div>
            <div style="margin: 24px 0">
              <label>诉求说明:</label>
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
                <p style="margin: 0; font-size: 16px">{{ form.appeal }}</p>
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
            <a-divider />
            <p class="labelh6">案件信息</p>
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
                <span class="titleClass">审理阶段：</span>
                {{ form.case.trial_stage ? form.case.trial_stage : '待上传审理阶段' }}
              </div>
              <div style="margin: 9px 24px; width: 400px">
                <span class="titleClass">案件所在城市：</span>
                {{ form.case.city === form.case.province ? form.case.city : form.case.province + '-' + form.case.city }}
              </div>

              <div style="margin: 9px 24px; width: 300px">
                <span class="titleClass">委托当事人:</span>
                {{ form.case.litigant_role === 1 ? '被告' : '原告' }}
              </div>
              <div style="margin: 9px 24px; width: 300px">
                <span class="titleClass">身份证号码:</span>
                {{ form.litigant.id_card ? form.litigant.id_card : '待上传' }}
              </div>
              <div style="margin: 9px 24px; width: 300px" v-for="(i, key) in form.case.other_side_nicknames" :key="key">
                <span class="titleClass"> {{ form.case.litigant_role === 0 ? '被告' : '原告' }}信息:</span>
                {{ i }}
              </div>
            </div>
            <a-divider />
            <p class="labelh6">视频与图片资料</p>

            <p class="titleClass">视频：</p>
            <div style="height: auto; display: flex; flex-direction: row; align-items: center">
              <div v-for="(i, key) in form.videos" :key="key">
                <div
                  style="position: relative; width: 100px; height: 100px; margin: 5px; background: rgba(0, 0, 0, 0.3)"
                >
                  <img :src="i.cover" style="width: 100px; height: 100px; object-fit: contain" />
                  <img class="imagesSpan" style="float: right; position: absolute; z-index: 3; right: 0px; top: 0px" />
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
            </div>
            <p class="titleClass">图片：</p>
            <div style="height: auto">
              <img
                :src="i"
                v-for="i in form.images"
                :key="i"
                style="
                  width: 100px;
                  cursor: pointer;
                  height: 100px;
                  margin: 5px;
                  object-fit: contain;
                  background-color: #eff1f5;
                "
                @click="openModal"
              />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :pagination="pagination"
            :loading="state.lawyerLoading"
            :data-source="LawyerData"
            style="margin-top: 24px"
            :row-key="(record) => record.lawyer.user_id"
          >
            <a-table-column key="ranking" title="排名">
              <template slot-scope="record">
                <div style="display: flex; align-items: center; flex-direction: row; justify-content: center">
                  <img
                    :src="require('@/assets/Fundraising/first_pm_icon.png')"
                    v-if="record.ranking === 1"
                    style="width: 30px; height: 33px"
                  />
                  <img
                    :src="require('@/assets/Fundraising/second_pm_icon.png')"
                    v-else-if="record.ranking === 2"
                    style="width: 30px; height: 33px"
                  />
                  <img
                    :src="require('@/assets/Fundraising/third_pm_icon.png')"
                    v-else-if="record.ranking === 3"
                    style="width: 30px; height: 33px"
                  />
                  <span v-else style="font-size: 16px; font-family: PingFang SC; font-weight: bold; line-height: 22px">
                    {{ record.ranking }}
                  </span>
                </div>
              </template>
            </a-table-column>
            <a-table-column key="nickname" title="参与竞选律师">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.lawyer.nickname"
                  :avatar="record.lawyer.avatar"
                  :mobile="record.lawyer.mobile"
                  :isBot="7"
                />
              </template>
            </a-table-column>
            <a-table-column key="mobile" align="center" title="事务所">
              <template slot-scope="record">
                {{ record.lawyer.lawyer_office }}
              </template>
            </a-table-column>
            <a-table-column key="is_better" align="center" title="认证情况">
              <template slot-scope="record">
                <span style="color: #2cbf78"> 已认证</span>
                <br />
                {{ record.lawyer.lawyer_grade_chinese }}
              </template>
            </a-table-column>
            <a-table-column key="work_year" align="center" title="执业年限">
              <template slot-scope="record">
                {{ record.created_at }}
              </template>
            </a-table-column>
            <a-table-column key="action" align="center" title="操作">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; align-items: center; justify-content: center">
                  <div style="display: flex; flex-direction: row; align-items: center">
                    <div
                      style="
                        width: 80px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        border: 1px solid #3980ea;
                        height: 32px;
                        border-radius: 5px 0 0 5px;
                        justify-content: center;
                      "
                    >
                      {{ record.votes_number }}票
                    </div>
                    <a-popconfirm
                      @confirm="changeVotes(record.fundraising_lawyer_bid_id)"
                      @cancel="$message.success('已取消修改')"
                    >
                      <template slot="title">
                        <a-input placeholder="请输入要修改的票数" v-model="votes_number"></a-input>
                      </template>
                      <a-button type="primary" style="border-radius: 0 5px 5px 0"> 修改 </a-button>
                    </a-popconfirm>
                  </div>
                  <a-button type="primary" style="margin: 0 10px">详情</a-button>
                  <a-button @click="openDelModal(record)" type="danger">删除</a-button>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.deleteLoading" title="删除竞选律师" ok-text="确认" cancel-text="取消" @ok="deleteLawyer">
      此操作无法退回更改，请谨慎操作
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
    </a-modal>
    <ImageViewer ref="imageViewer" :images="imagesList" />
  </div>
</template>
  <script>
import UserVipCell from '@/components/User/UserVipCell'
import { FormModel } from 'ant-design-vue'
import ImagesUoload from '@/components/upload/ImagesUpload'
import ImageViewer from '@/components/Image/ImageViewer'
import DetailsSteps from '@/components/FundraisingDetails/detailsSteps'
import {
  getFundraisingDetailData,
  getFundraisingStatus,
  postFundraisingCoverImage,
  getFundraisingBidPage,
  putFundraisingBidVotes,
  deleteFundraisingBid,
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
        target_money: '0',
        fundraise_money: '0',
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
        deleteLoading: false,
        fundraisingDetails: false,
        testLoading: false,
      },
      deleteKey: '',
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
      votes_number: '',
      test: '',
      imagesList: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 6, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getFundraisingBidPage(page)
          this.pagination.current = page
        },
      },
      LawyerData: [
        {
          fundraising_lawyer_bid_id: 2,
          created_at: '2021-06-17',
          votes_number: 1,
          lawyer: {
            user_id: 1,
            nickname: '全员可见',
            mobile: '13868683226',
            is_better: 0,
            lawyer_office: '北京大成（内蒙古）律师事务所',
            is_auth: 1,
            lawyer_grade_chinese: '专职律师',
            work_year: 12,
          },
        },
      ],
      playerOptions: {
        // 播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        // 如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: 'auto',
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [
          {
            // 类型
            type: 'video/mp4',
            // url地址
            src: '',
          },
        ],
        // 你的封面地址
        poster: '',
        // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          // 全屏按钮
          fullscreenToggle: true,
        },
      },
    }
  },
  computed: {
    percentage() {
      return Math.floor((this.form.fundraise_money / this.form.target_money) * 100)
    },
  },
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
        this.getFundraisingDetailData(this.fundraisingId)
        this.getFundraisingBidPage(1)
      })
    },
    getFundraisingDetailData(fundraisingId) {
      getFundraisingDetailData(fundraisingId).then((data) => {
        this.form = data.data
        console.log(this.form)
        this.form.fundraising_id = fundraisingId
      })
    },
    getFundraisingBidPage(page) {
      getFundraisingBidPage(page, this.fundraisingId).then((data) => {
        this.LawyerData = data.data.data
        for (let i = 0; i < this.LawyerData.length; i++) {
          this.LawyerData[i].ranking = i + 1
        }
      })
    },
    moment,
    onChange(dates, dateStrings) {
      this.form.issue_date = dateStrings
    },
    deleteLawyer() {
      deleteFundraisingBid(this.deleteKey.fundraising_lawyer_bid_id).then(() => {
        this.$message.success('已成功删除该竞选律师')
        this.state.deleteLoading = false
        this.getFundraisingBidPage(1)
      })
    },
    openDelModal(record) {
      this.deleteKey = record
      this.state.deleteLoading = true
    },
    openModal() {
      this.imagesList = this.form.images
      this.$refs['imageViewer'].show()
    },
    showImage(value) {
      this.imagesList = []
      this.imagesList.push(value)
      this.$refs.imageViewer.show()
    },
    changeVotes(id) {
      putFundraisingBidVotes(id, this.votes_number).then(() => {
        this.votes_number = ''
        this.$message.success('已成功修改票数')
        this.getFundraisingBidPage(1)
      })
    },

    // 根据选择框改视频内容
    changeVideo(value) {
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
 <style scoped>
.center {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-self: center;
}
.titleClass {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 25px;
  color: #222222;
  opacity: 1;
  margin: 8px 0;
}
.labelh6 {
  margin: 20px 0;
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 800;
  line-height: 30px;
  color: #222222;
  opacity: 1;
}
.imagesSpan {
  width: 100px;
  height: 100px;
  display: block;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0.9;
  position: absolute;
  z-index: 999;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
label {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 25px;
  color: #222222;
  opacity: 1;
}
</style>