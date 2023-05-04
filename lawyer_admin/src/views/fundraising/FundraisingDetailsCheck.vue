<template>
  <div>
    <a-row :gutter="[8, 16]" v-if="dataStatus !== 49">
      <a-col :span="12">
        <a-col :span="24">
          <a-card>
            <a-col :span="6">
              <div @click="goList" style="width: 150px; cursor: pointer; color: #222222; font-size: 22px">
                <b>
                  <span> ←<span>返回列表</span> </span>
                </b>
              </div>
            </a-col>
            <a-col :span="10">
              <!-- <user-vip-cell
                :nickname="userData.admin.nickname"
                :avatar="userData.admin.avatar"
                :mobile="userData.admin.mobile"
              /> -->
            </a-col>
            <a-col :span="6">
              <!-- <img :src="require('@/assets/Fundraising/组 6488@2x.png')" style="width: 16px; height: 16px" />
              <label style="color: #ff3333">平台介入推广</label> -->
            </a-col>
          </a-card>
        </a-col>
        <a-col :span="24">
          <a-card :loading="state.loading">
            <a-col :span="24" style="display: flex; flex-direction: row; align-items: center">
              <span class="titleStyle">发起人：</span>
              <span style="font-size: 14px"> {{ userData.creator.nickname }}</span>
              <div style="margin: 0 10px">
                <div v-if="userData.creator.is_auth === 1">
                  <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span style="color: #3980ea; font-size: 12px">已认证 </span>
                </div>
                <div v-else>
                  <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span style="color: #787e8d; font-size: 12px"> 未认证</span>
                </div>
              </div>
              <div style="margin: 0 10px">
                <div v-if="userData.creator.is_register === 1">
                  <img :src="require('@/assets/Fundraising/gx2_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span style="color: #787e8d; font-size: 12px">已注册 </span>
                </div>
                <div v-else>
                  <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span style="color: #787e8d; font-size: 12px"> 未注册</span>
                </div>
              </div>
              <!-- </a-col>
            <a-col :span="24" style="display: flex; flex-direction: row; align-items: center"> -->
              <span class="titleStyle">手机号码：</span>
              <span style="font-size: 14px">{{ userData.creator.mobile }}</span>
            </a-col>
            <a-col :span="24" style="display: flex">
              <div
                v-for="(index, key) in userData.creator.records"
                :key="key * 2"
                style="padding: 0 10px; width: 33.333%"
              >
                <img :src="require('@/assets/Fundraising/luyin.png')" style="width: 18px; height: 18px" />
                <a @click="openRecord(index.record, 0)">录音{{ key + 1 }}</a
                >|
                <a @click="openRecord(index.record, 1)">下载</a>
                <span style="margin: 10px">{{ index.call_at }}</span>
              </div>
            </a-col>
            <a-col :span="24" style="display: flex; flex-direction: row; align-items: center">
              <span class="titleStyle">当事人：</span>
              <span style="font-size: 14px"> {{ userData.litigant.nickname }}</span>
              <div style="margin: 0 10px">
                <div v-if="userData.litigant.is_auth === 1">
                  <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span style="color: #3980ea; font-size: 12px">已认证 </span>
                </div>
                <div v-else>
                  <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span style="color: #787e8d; font-size: 12px"> 未认证</span>
                </div>
              </div>
              <div style="margin: 0 10px">
                <div v-if="userData.litigant.is_register === 1">
                  <img :src="require('@/assets/Fundraising/gx2_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span style="color: #787e8d; font-size: 12px">已注册 </span>
                </div>
                <div v-else>
                  <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <span style="color: #787e8d; font-size: 12px"> 未注册</span>
                </div>
              </div>
              <!-- </a-col>
            <a-col :span="24" style="display: flex; flex-direction: row; align-items: center"> -->
              <span class="titleStyle">手机号码：</span>
              <span style="font-size: 14px"> {{ userData.litigant.mobile }}</span>
            </a-col>
            <a-col :span="24" style="display: flex">
              <div v-for="(index, key) in userData.litigant.records" :key="key" style="padding: 0 10px; width: 33.333%">
                <img :src="require('@/assets/Fundraising/luyin.png')" style="width: 18px; height: 18px" />
                <a @click="openRecord(index.record, 0)">录音{{ key + 1 }}</a
                >|
                <a @click="openRecord(index.record, 1)">下载</a>
                <span style="margin: 10px">{{ index.call_at }}</span>
              </div>
            </a-col>
            <a-col :span="24" style="padding: 16px">
              <div style="background-color: #eff1f5; padding: 10px; margin: 10px 0">
                <span style="font-weight: bold"> 当事人诉求：</span>
                <a-input
                  type="textarea"
                  style="
                    background-color: #eff1f5;
                    border: none;
                    width: 100%;
                    word-wrap: break-word;
                    word-break: normal;
                    padding: 10px;
                  "
                  :rows="3"
                  v-model="userData.appeal"
                />
              </div>
              <div style="background-color: #eff1f5; padding: 10px">
                <span style="font-weight: bold"> 案件详情：</span>
                <a-input
                  type="textarea"
                  style="
                    background-color: #eff1f5;
                    border: none;
                    width: 100%;
                    word-wrap: break-word;
                    word-break: normal;
                    padding: 10px;
                  "
                  :rows="15"
                  v-model="userData.content"
                />
              </div>
            </a-col>
            <a-col
              :span="24"
              style="padding: 8px 4px; display: flex; flex-direction: row; overflow: auto; flex-wrap: wrap"
            >
              <ImageViewer ref="imageViewer" :images="images" />
              <div v-for="(i, key) in userData.images" :key="key * 129" style="margin: 5px">
                <div style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                  <div style="width: 80px; height: 80px; position: relative">
                    <img style="background-color: #eff1f5; width: 80px; height: 80px" :src="i" />
                    <div class="actionIcon">
                      <img
                        :src="require('@/assets/common/image_preview.png')"
                        style="width: 20px; height: 20px; z-index: 4; cursor: pointer; object-fit: contain"
                        @click="showImages(userData.images)"
                      />
                      <img
                        :src="require('@/assets/common/image_download.png')"
                        style="width: 20px; height: 20px; z-index: 4; cursor: pointer; object-fit: contain"
                        @click="downloadFile(userData.images[key])"
                      />
                    </div>
                  </div>
                  <div style="width: 80px; word-break: break-all; height: auto; display: flex; justify-content: center">
                    <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :span="24" style="font-size: 18px; font-weight: bold">上传文件:</a-col>
            <a-col :span="24" style="display: flex; flex-direction: row; overflow: auto">
              <div
                v-for="(index, key) in userData.check_files"
                :key="key * 128"
                style="
                  width: 80px;
                  display: flex;
                  flex-direction: column;
                  flex-wrap: nowrap;
                  align-items: center;
                  margin: 5px;
                "
              >
                <div style="width: 80px; height: 80px; position: relative">
                  <!-- <img class="imagesShadow" :src="require('@/assets/Fundraising/fj_icon@2x.png')" /> -->
                  <img
                    class="imagesShadow"
                    v-if="
                      index.substring(index.lastIndexOf('.') + 1) === 'docx' ||
                      index.substring(index.lastIndexOf('.') + 1) === 'doc'
                    "
                    :src="require('@/assets/Fundraising/doc_icon@2x.png')"
                  />
                  <img
                    class="imagesShadow"
                    v-else-if="index.substring(index.lastIndexOf('.') + 1) === 'txt'"
                    :src="require('@/assets/Fundraising/txt_icon@2x.png')"
                  />
                  <img
                    class="imagesShadow"
                    v-else-if="index.substring(index.lastIndexOf('.') + 1) === 'xls'"
                    :src="require('@/assets/Fundraising/xls_icon@2x.png')"
                  />
                  <img v-else class="imagesShadow" :src="require('@/assets/Fundraising/fj_icon@2x.png')" />
                  <div class="actionIcon">
                    <!-- <img
                      :src="require('@/assets/common/image_preview.png')"
                      style="width: 20px; height: 20px; z-index: 4; cursor: pointer; object-fit: contain"
                      @click="showFile(userData.images)"
                    /> -->
                    <img
                      :src="require('@/assets/common/image_download.png')"
                      style="width: 20px; height: 20px; z-index: 4; cursor: pointer; object-fit: contain"
                      @click="downloadFile(index)"
                    />
                  </div>
                </div>
                <div style="width: 80px; word-break: break-all; height: auto; display: flex; justify-content: center">
                  <span>{{ index.substring(index.lastIndexOf('/') + 1) }}</span>
                </div>
              </div>
            </a-col>
          </a-card>
        </a-col>
      </a-col>
      <a-col :span="12">
        <a-col>
          <a-card :loading="state.loading">
            <a-col :span="24">
              <a-col :span="6"> 发布时间： </a-col>
              <a-col :span="12">
                <div v-if="userData.litigant.is_auth === 1">
                  <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                  <!-- <span>当事人已身份认证 </span> -->
                  <span>当事人无法进行身份认证</span>
                </div>
                <div v-else>
                  <div>
                    <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                    <span>当事人无法进行身份认证</span>
                  </div>
                </div>
              </a-col>
              <a-col :span="6" v-if="state.changeList">
                <a @click="showModal(0)">历史审核记录></a>
              </a-col>
            </a-col>
            <detailst-table
              v-if="state.changeList"
              :dataStatus="dataStatus"
              :userData="userData"
              :type="0"
              :fundraisingId="fundraisingId"
              :fundraisingRegistrationId="fundraisingRegistrationId"
            />
            <a-col :span="24" v-if="dataStatus === 44">
              <publishing-content :fundraisingProgressId="fundraisingProgressId" />
            </a-col>
            <a-col :span="24" v-show="dataStatus === 48">
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                "
              >
                <label class="titleStyle">求助人封面图：</label>
                <a>发布内容历史审核记录 ></a>
              </div>
              <img
                style="width: 220px; height: 110px; cursor: pointer"
                :src="caseInformation.cover_image"
                @click="showImage(caseInformation.cover_image)"
              />
              <a-divider />
              <div class="titleStyle">求助人标题:</div>
              <div
                style="
                  background-color: #eff1f5;
                  width: 100%;
                  height: 65px;
                  word-wrap: break-word;
                  word-break: normal;
                  padding: 20px;
                  overflow: auto;
                "
              >
                <span>{{ caseInformation.title }}</span>
              </div>
              <a-divider />
              <div class="titleStyle">求助人视频:</div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  flex-wrap: wrap;
                  align-content: center;
                  justify-content: flex-start;
                "
              >
                <div v-for="(i, key) in caseInformation.videos" :key="key * 124">
                  <img
                    :src="i + '?x-oss-process=video/snapshot,t_1,f_png,w_500,h_590,m_fast'"
                    style="width: 100px; height: 100px; margin: 5px; cursor: pointer"
                    @click="changeVideo(i)"
                  />
                  <div
                    style="
                      width: 110px;
                      word-break: break-all;
                      height: auto;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                  </div>
                </div>
              </div>
              <a-divider />
              <div class="titleStyle">求助人图片:</div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  flex-wrap: wrap;
                  align-content: center;
                  justify-content: flex-start;
                "
              >
                <div v-for="(i, key) in caseInformation.images" :key="key * 124">
                  <img
                    :src="i"
                    style="width: 100px; height: 100px; margin: 5px; cursor: pointer"
                    @click="showImages(caseInformation.images)"
                  />
                  <div
                    style="
                      width: 110px;
                      word-break: break-all;
                      height: auto;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                  </div>
                </div>
              </div>
              <a-divider />
              <div class="titleStyle">求助人故事：</div>
              <div
                style="
                  background-color: #eff1f5;
                  width: 100%;
                  height: 300px;
                  word-wrap: break-word;
                  word-break: normal;
                  padding: 20px;
                  overflow: auto;
                "
              >
                <span>{{ caseInformation.content }}</span>
              </div>
              <a-divider />
            </a-col>
            <a-col :span="24">
              <div
                v-show="dataStatus === 49"
                style="display: flex; flex-direction: row; justify-content: flex-end; margin-top: 10px"
              >
                <div>
                  <a-button
                    style="background-color: #ff524c; color: #ffffff; margin: 0 10px; border-color: #ff524c"
                    @click="rejectModel"
                  >
                    驳回
                  </a-button>
                </div>
                <div>
                  <a-popconfirm title="请确认通过审核" ok-text="是的" cancel-text="取消" @confirm="okApproved">
                    <a-button style="background-color: #2cbf78; color: #ffffff; border-color: #2cbf78">
                      通过审核
                    </a-button>
                  </a-popconfirm>
                </div>
              </div>
            </a-col>
          </a-card>
        </a-col>
      </a-col>
    </a-row>
    <!-- <a-col :span="24" v-if="dataStatus === 49">
      <examine49 />
    </a-col> -->
    <a-modal v-model="state.rejectAudit" title="审核不通过" @ok="rejectAuditOk" width="600px">
      <div v-show="dataStatus === 49" style="height: 200px; overflow: auto">
        <a-input v-model="reason" placeholder="请输入驳回原因"></a-input>
      </div>
    </a-modal>
    <a-modal v-model="state.visible" title="历史审核记录" @ok="handleOk">
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
  </div>
</template>
  <script>
import { Empty, Cascader } from 'ant-design-vue'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import downLoad from '@/directive/index'
import {
  getFundraisingData,
  getFundraisingDataHistory,
  getFundraisingDemands,
  getFundraisingStatus,
  getFundraisingDemandsText,
  getFundraisingCreator,
  putFundraisingUserSubmitCheck,
  getFundraisingQuestionTags,
} from '@/api/fundraising'
import ImageViewer from '@/components/Image/ImageViewer'
import DetailstTable from '@/components/FundraisingDetails/Check/detailstTable'
import examine49 from '@/components/FundraisingDetails/examine49'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import PublishingContent from '@/components/FundraisingDetails/Check/CreatorSubmit'
export default {
  components: {
    PublishingContent,
    UserVipCell,
    UserDetailDialog,
    DetailstTable,
    ImageViewer,
    Empty,
    SingleAudioPlayer,
    TextWithRowButton,
    examine49,
    Cascader,
  },
  directives: { downLoad },
  props: {},
  data() {
    return {
      fundraisingId: 0,
      caseType: [],
      caseTypeList: [],
      currentPlayRecord: '',
      rejectAudit: '',
      userData: {
        creator: {
          user_id: 0,
          nickname: '',
          avatar: '',
          mobile: '',
          records: [
            {
              record: '',
              call_at: '',
            },
          ],
          is_auth: 0,
          is_register: 0,
        },
        litigant: {
          user_id: 0,
          nickname: '',
          avatar: '',
          mobile: '',
          records: [
            {
              record: '',
              call_at: '',
            },
          ],
          is_auth: 0,
          is_register: 0,
        },
        content: '',
        appeal: '',
        images: [''],
        not_auth_reason: '',
        id_card_front_image: '',
        id_card_back_image: '',
        not_auth_images: [''],
        case_money: '',
        lawyer_money: '',
        litigation_money: '',
        property_money: '',
        lawyer_tag_id: null,
        is_can_send: 0,
        is_promote: 0,
      },
      demandsList: [],
      demandList: [],
      HistoryData: [],
      state: {
        loading: false,
        changeList: true,
        visible: false,
        rejectAudit: false,
        recordVisible: false,
        testLoading: false,
      },

      currentUserId: 0,
      type: 1,
      typeAuditor: 'boss',
      fundraisingRegistrationId: 0,
      images: [],
      dataStatus: 0,
      reason: '',
      fundraisingProgressId: 0,
      caseInformation: {
        cover_image: '',
        title: '',
        content: '',
        videos: [],
        images: [],
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
    this.fundraisingProgressId = Number(this.$route.params.fundraisingProgressId)
    this.typeAuditor = this.$route.params.type
    console.log(this.typeAuditor)
    this.getFundraisingStatus(this.fundraisingProgressId)
    this.getFundraisingQuestionTags()
  },
  mounted() {},
  methods: {
    getFundraisingStatus(fundraisingProgressId) {
      // 单数据展开
      getFundraisingStatus(fundraisingProgressId).then((data) => {
        this.fundraisingRegistrationId = data.data.fundraising_registration_id
        this.detailstService = data.data
        this.getFundraisingData(this.fundraisingRegistrationId)
        this.getFundraisingDemandsText()
        this.dataStatus = data.data.status
        this.fundraisingId = data.data.fundraising_id
        console.log(this.fundraisingId)
        if (this.dataStatus > 43) {
          this.getlistData(this.fundraisingId)
        }
        sessionStorage.setItem('订单详情', JSON.stringify(this.detailstService))
      })
    },
    getFundraisingQuestionTags() {
      getFundraisingQuestionTags().then((data) => {
        const list = []
        for (let i = 0; i < data.data.length; i++) {
          const listchilren = { label: '', value: '', children: [] }
          listchilren.label = data.data[i].lawyer_tag_group
          listchilren.value = i
          for (let j = 0; j < data.data[i].lawyer_tags.length; j++) {
            const listchilrens = { label: '', value: '' }
            listchilrens.label = data.data[i].lawyer_tags[j].lawyer_tag
            listchilrens.value = data.data[i].lawyer_tags[j].lawyer_tag_id
            listchilren.children.push(listchilrens)
          }
          list.push(listchilren)
        }
        this.caseTypeList = list
      })
    },
    getFundraisingData(fundraisingRegistrationId) {
      getFundraisingData(fundraisingRegistrationId).then((data) => {
        sessionStorage.setItem('userData', JSON.stringify(data.data))
        this.userData = data.data
        console.log(this.userData)
        this.state.loading = false
        getFundraisingDemands(fundraisingRegistrationId).then((data) => {
          this.demandsList = data.data
        })
      })
    },
    getlistData(id) {
      console.log(1)
      getFundraisingCreator(id).then((data) => {
        this.caseInformation = data.data
        console.log(this.caseInformation)
      })
    },
    showImages(imagseList) {
      this.images = imagseList
      console.log(imagseList)
      this.$refs.imageViewer.show()
    },
    showImage(imagseList) {
      this.images = []
      this.images.push(imagseList)
      this.$refs.imageViewer.show()
    },
    goList() {
      this.$router.push({ name: 'FundraisingCheck' })
    },
    showModal() {
      const currentUserId = this.userData.creator.user_id
      getFundraisingDataHistory(currentUserId).then((data) => {
        this.HistoryData = data.data
      })
      this.state.visible = true
    },
    handleOk(e) {
      this.addLawyerData = []
      this.state.visible = false
    },
    rejectModel() {
      this.state.rejectAudit = true
    },
    rejectAuditOk() {
      putFundraisingUserSubmitCheck(this.fundraisingId, 0, this.reason).then(() => {
        this.$message.success('已审核')
        this.$router.push({ name: 'FundraisingCheck' })
      })
    },
    downloadFile(url) {
      window.open(url)
    },
    showFile(url) {
      window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url)
    },
    openRecord(url, type) {
      if (type === 0) {
        this.state.recordVisible = true
        this.currentPlayRecord = url
      } else {
        window.open(url)
      }
    },
    okApproved() {
      putFundraisingUserSubmitCheck(this.fundraisingId, 1, '').then(() => {
        this.$message.success('已审核')
        this.$router.push({ name: 'FundraisingCheck' })
      })
    },
    getFundraisingDemandsText() {
      getFundraisingDemandsText(this.fundraisingRegistrationId).then((data) => {
        this.demandList = data.data
      })
    },
    // 根据选择框改视频内容
    changeVideo(value) {
      this.playerOptions.sources[0].src = value
      this.state.testLoading = true
    },
    pausePlay(player) {
      // 关闭弹窗-停止播放
      this.player.pause()
    },
  },
}
</script>
 <style scoped lang="less">
/deep/.ant-modal-content {
  width: 600px;
}
.changeBtn {
  width: 115px;
  cursor: pointer;
  color: #3980ea;
  border: 1px #3980ea solid;
  .icon {
    color: #3980ea;
  }
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.imagesShadow {
  background-color: #eff1f5;
  width: 80px;
  height: 80px;
  top: 50%;
  text-align: center;
}

.imagesSpan {
  cursor: pointer;
  width: 80px;
  height: 80px;
  display: block;
  padding-left: 20px;
  line-height: 80px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.9;
  position: absolute;
  bottom: 0;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.titleStyle {
  font-size: 14px;
  font-weight: bold;
  color: #222222;
}
.labelClass {
  height: 96px;
  width: 455px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border: 1px solid #cbd1e1;
  border-radius: 0 4px 4px 0;
  overflow: auto;
}
.actionIcon {
  width: 80px;
  height: 40px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.9;
  position: absolute;
  z-index: 999;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
}
</style>
