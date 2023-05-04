<template>
  <div v-show="state.loading">
    <a-row :gutter="[16, 16]">
      <a-col :span="15">
        <a-card>
          <a-col :span="20">
            <div @click="goList">
              <span style="cursor: pointer; color: #222222; font-size: 22px">
                ←
                <span>律师资料</span>
              </span>
            </div>
          </a-col>
          <a-col :span="4" v-if="pageType === 2 || orderData.status_chinese === '未付款'"> </a-col>
          <a-col :span="4" v-else>
            <a-button
              v-if="orderData.refund_status === 0 && pageType === 0"
              type="danger"
              @click="state.modalLoading = true"
            >
              申请退款
            </a-button>
            <a-button v-if="orderData.refund_status === 10 && pageType === 0" disabled> 等待审核 </a-button>
            <a-button
              v-if="orderData.refund_status === 40 && pageType === 0"
              @click="$message.success('已经申请过退款了')"
            >
              退款成功
            </a-button>
            <a-button
              v-if="pageType === 1 && orderData.refund_status === 10"
              style="background-color: #2cbf78; color: #ffffff"
              @click="state.modalAgree = true"
            >
              同意退款
            </a-button>
            <a-button v-if="pageType === 1 && orderData.refund_status === 40" @click="$message.success('已退款')">
              已同意退款
            </a-button>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: row">
            <div style="width: 33%">
              <user-vip-cell
                :nickname="orderData.user.nickname"
                :avatar="orderData.user.avatar"
                :mobile="orderData.user.mobile"
                :user-id="String(orderData.user.user_id)"
                :mode="4"
                @open="openUser(String(orderData.user.user_id), 'user')"
                size="big"
              />
            </div>
            <div style="width: 33%">
              <user-vip-cell
                :nickname="orderData.lawyer.nickname"
                :avatar="orderData.lawyer.avatar"
                :mobile="orderData.lawyer.mobile"
                :user-id="String(orderData.lawyer.user_id)"
                @open="openUser(String(orderData.lawyer.user_id), 'lawyer')"
                :mode="5"
                size="big"
              />
            </div>
          </a-col>
          <a-col :span="8" style="height: 60px" class="textStyle" v-for="(i, key) in orderDataList" :key="key">
            <div>
              <label> {{ i.title }}:</label>
              <span :style="key !== 3 ? 'color: #787e8d' : 'color: #3980ea'">{{ i.value }}</span>
              <span v-show="key === 3" style="color: #3980ea">元</span>
            </div>
          </a-col>
          <a-col :span="24">
            <label>TA的评价：</label>
            <span v-show="orderData.evaluate_score === 0">未评价</span>
            <img
              v-show="orderData.evaluate_score === 1"
              :src="require('@/assets/Order/my_icon_sel@2x.png')"
              style="width: 22px; height: 22px"
            />
            <span style="color: #ffa577" v-show="orderData.evaluate_score === 1"> 满意 </span>

            <img
              v-show="orderData.evaluate_score === 2"
              :src="require('@/assets/Order/yb_icon_sel@2x.png')"
              style="width: 22px; height: 22px"
            />
            <span style="color: #ff7864" v-show="orderData.evaluate_score === 2"> 一般 </span>
            <img
              v-show="orderData.evaluate_score === 3"
              :src="require('@/assets/Order/bmy_icon_sel@2x.png')"
              style="width: 22px; height: 22px"
            />
            <span style="color: #9db4dd" v-show="orderData.evaluate_score === 3"> 不满意 </span>
          </a-col>
          <a-col :span="24">
            <div
              style="
                background-color: #eff1f5;
                width: 100%;
                height: 160px;
                word-wrap: break-word;
                word-break: normal;
                padding: 20px;
              "
            >
              <p>{{ orderData.evaluate }}</p>
            </div>
          </a-col>
          <a-col :span="24" v-if="pageType === 1">
            <label> 退款说明：</label>
          </a-col>
          <a-col :span="24" v-if="pageType === 1">
            <div>
              <p
                style="
                  background-color: #eff1f5;
                  width: 100%;
                  height: 160px;
                  word-wrap: break-word;
                  word-break: normal;
                  padding: 20px;
                "
              >
                {{ orderData.refund.content }}
              </p>
            </div>
            <div
              style="
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-content: center;

                align-items: center;
              "
            >
              <div v-for="(index, key) in orderData.refund.images" :key="index">
                <div>
                  <img
                    :src="index"
                    style="width: 100px; height: 100px; margin: 5px"
                    @click="showImages(orderData.refund.images)"
                    v-if="key < 5"
                  />
                </div>

                <div
                  v-show="key === 5"
                  style="
                      position: relative;
                      width: 100px; height: 100px; margin: 5px
                      float: left;                  
                      background: rgba(0, 0, 0, 0.3);
                    "
                >
                  <img class="imagesShow" :src="index" />
                  <span class="imagesSpan" @click="showImages(orderData.refund.images)">
                    +{{ orderData.refund.images.length - 5 }}
                  </span>
                </div>
              </div>
            </div>
          </a-col>
        </a-card>
        <a-card v-if="orderData.cloud_file" style="margin-top: 16px; border: 0px">
          <a-col
            :span="8"
            v-for="(i, key) in orderData.cloud_file"
            :key="key"
            style="
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-around;
              align-items: center;
            "
          >
            {{ i.file_name }} <a-button @click="downloadFile(i.file_path)">下载</a-button>
          </a-col>
        </a-card>
      </a-col>
      
      <!-- 录音时间 -->
      <a-col :span="9">
        <a-table
          :data-source="recordsData"
          :pagination="pagination"
          :rowKey="(record) => record.record_path"
          style="background-color: #fff"
        >
          <a-table-column key="mobile" title="录音时间" align="center">
            <template slot-scope="record">
              <div class="center text-btn">
                {{ record.time }}
              </div>
            </template>
          </a-table-column>
          <a-table-column key="nickname" title="操作" align="center">
            <template slot-scope="record">
              <a-button type="link" :loading="voiceTranslateLoading" @click="translateVoice(record.record_path)">翻译录音</a-button>
              <a-button type="link" @click="openRecord(record.record_path)">播放录音</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>

    <!-- 语音翻译 modal -->
    <voice-translate-modal ref="voiceTranslateModalRef" />
    
    <a-modal
      v-model="state.modalAgree"
      title="请确认是否同意退款"
      @ok="agreeApply"
      @cancel="state.modalAgree = false"
      width="650px"
      ok-text="确认"
      cancel-text="取消"
    >
      <p>同意退款之后,不能撤回，请谨慎操作</p>
    </a-modal>

    <a-modal
      ok-text="确认"
      cancel-text="取消"
      v-model="state.modalLoading"
      title="申请退款"
      @ok="uploadApply"
      @cencel="state.modalLoading = false"
      width="650px"
    >
      <a-textarea v-model="upload.content" placeholder="请输入退款内容" :auto-size="{ minRows: 3, maxRows: 5 }" />
      <div
        style="width: 100%; height: 120px; display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center"
      >
        <div v-for="(index, key) in upload.images" :key="index" style="position: relative; margin: 0 5px">
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
            @click="deleteF(key)"
          />
          <div>
            <img
              :src="index"
              style="width: 100px; height: 100px; margin: 5px"
              @click="showImages(upload.images)"
              v-if="key < 4"
            />
          </div>
          <div
            v-show="key === 4"
            style="
                      position: relative;
                      width: 100px; height: 100px; margin: 5px
                      float: left;
                      background: rgba(0, 0, 0, 0.3);
                    "
          >
            <img class="imagesShow" :src="index" />
            <span class="imagesSpan" @click="showImages(upload.images)">+{{ upload.images.length - 4 }}</span>
          </div>
        </div>
        <div @click="triggers" class="triggersCss" v-if="upload.images.length < 9">
          <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
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
    </a-modal>
    <ImageViewer id="imageViewer" ref="imageViewer" :images="images" />
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" :mode="dialogType" @close="state.userDialog = false" />
    </q-dialog>

    <!-- 录音播放 drawer -->
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
import { uploadImage } from '@/api/common'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import voiceTranslateModal from '@/components/voice-translate-modal/voice-translate-modal'
import ImageViewer from '@/components/Image/ImageViewer'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import { getOrderDetail, getOrderRecordPage, postOrderRefund, postOrderRefundApply } from '@/api/order'

export default {
  name: 'OrderDetailIndex',
  components: {
    ImageViewer,
    UserVipCell,
    UserDetailDialog,
    SingleAudioPlayer,
    voiceTranslateModal
  },
  data() {
    return {
      dialogType: 'user',
      state: {
        loading: false,
        modalLoading: false,
        userDialog: false,
        modalAgree: false,
        recordVisible: false,
      },
      currentPlayRecord: '',
      pageType: 0,
      orderData: {
        cloud_file: [
          {
            file_name: 'composer3',
            file_path:
              'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-02-07/8b9e52163769673403c0f7564980a207.docx?time=2022020716',
          },
        ],
        user: {
          user_id: 0,
          avatar: '',
          nickname: '',
          mobile: '',
        },
        lawyer: {
          user_id: 0,
          avatar: '',
          nickname: '',
          mobile: '',
        },
        order_type_chinese: '',
        order_no: '',
        created_at: '',
        price: '',
        service_times: 0,
        status_chinese: '',
        appointment_date: '',
        appointment_address: '',
        service_start_at: '',
        evaluate_score: 0,
        evaluate: '',
        refund_status: 0,
        refund: {
          content: null,
          images: null,
        },
      },
      recordsData: [],
      currentUserId: 0,
      upload: {
        content: '',
        images: [],
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getLawyerPage(page, this.search)
          this.pagination.current = page
        },
      },
      text: '',
      orderPage: '',
      images: [],

      voiceTranslateLoading: false,
    }
  },
  computed: {
    orderDataList() {
      return [
        {
          title: '订单类型',
          value: this.orderData.order_type_chinese,
        },
        {
          title: '订单号',
          value: this.orderData.order_no,
        },
        {
          title: '订单时间',
          value: this.orderData.created_at,
        },
        {
          title: '服务费用',
          value: this.orderData.price,
        },
        {
          title: '服务次数',
          value: this.orderData.service_times,
        },
        {
          title: '服务状态',
          value: this.orderData.status_chinese,
        },
        {
          title: '约见时间',
          value: this.orderData.appointment_date,
        },
        {
          title: '约见地址',
          value: this.orderData.appointment_address,
        },
        {
          title: '服务时间',
          value: this.orderData.service_start_at,
        },
      ]
    },
  },
  watch: {},
  created() {
    this.orderPage = JSON.parse(sessionStorage.getItem('orderPage'))
    this.pageType = this.orderPage[0]
    const id = this.$route.params.orderId
    this.getOrderDetail(id)
    this.getRecordsPage(1, id)
  },
  mounted() {},
  methods: {
    /**
     * 获取订单详情
     */
    getOrderDetail(id) {
      getOrderDetail(id).then((data) => {
        this.orderData = data.data
        this.state.loading = true
      })
    },
    /**
     * 获取电话录音
     */
    getRecordsPage(page, id) {
      getOrderRecordPage(page, id).then((data) => {
        this.recordsData = data.data.data
      })
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.dialogType = type
      this.currentUserId = userId
    },
    showImages(images) {
      this.images = images
      this.$refs.imageViewer.show()
    },
    uploadApply() {
      const images = JSON.stringify(this.upload.images)
      postOrderRefundApply(this.upload.content, this.$route.params.orderId, images).then(() => {
        this.state.modalLoading = false
        this.$message.success('已提交申请')
        this.$router.push({ name: 'OrderPage' })
      })
    },
    agreeApply() {
      postOrderRefund(this.orderpage[1]).then(() => {
        this.state.modalAgree = false
        this.$message.success('已同意退款')
        this.$router.push({ name: 'OrderPage' })
      })
    },
    openRecord(recordUrl) {
      this.currentPlayRecord = recordUrl
      this.state.recordVisible = true
    },
    goList() {
      const condition = this.$route.params.condition
      if (this.pageType === 0) {
        this.$router.push({ name: 'OrderPage', params: { condition } })
      } else if (this.pageType === 1) {
        this.$router.push({ name: 'OrderPageBoss', params: { condition } })
      } else if (this.pageType === 2) {
        this.$router.push({ name: 'OrderPageFree', params: { condition } })
      } else if (this.pageType === 3) {
        this.$router.push({ name: 'OrderListApply', params: { condition } })
      }
    },
    getImages(event) {
      var images1 = event.target.files[0]
      uploadImage(images1).then((data) => {
        let images = {}
        images = data.data.url
        this.upload.images.push(images)
        console.log(this.upload.images)
        event.target.value = ''
        this.$message.success('上传成功')
      })
    },
    triggers() {
      this.$refs.imagesBtn.dispatchEvent(new MouseEvent('click'))
    },
    deleteF(e) {
      this.upload.images.splice(e, 1)
    },
    downloadFile(url) {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', this.name)
      document.body.appendChild(link)
      link.click()
    },

    /**
     * 翻译语音
     */
    async translateVoice(voiceUrl) {
      this.voiceTranslateLoading = true
      await this.$refs.voiceTranslateModalRef.translateVoiceFile(voiceUrl)
      this.voiceTranslateLoading = false
    }
  },
}
</script>

<style scoped lang="less">
label {
  font-size: 18px;
  color: #222222;
}
.textStyle {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
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
  cursor: pointer;
  width: 100px;
  height: 100px;
  display: block;
  padding-left: 30px;
  line-height: 100px;
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
  margin: 0 5px;
}
</style>
