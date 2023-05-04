<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="10">
        <a-card>
          <a-col
            :span="24"
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              flex-wrap: nowrap;
              align-content: center;
            "
          >
            <div @click="goList">
              <span style="cursor: pointer; color: #222222; font-size: 22px">
                ←
                <span>返回列表</span>
              </span>
            </div>
            <div>
              <a-tag :color="orderData.process_type === 0 ? 'green' : 'blue'">
                {{ orderData.process_type === 0 ? '抢单订单' : '报价订单' }}
              </a-tag>
            </div>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: row">
            <user-vip-cell
              :nickname="orderData.user.nickname"
              :avatar="orderData.user.avatar"
              :mobile="orderData.user.mobile"
              :user-id="String(orderData.user.user_id)"
              @open="openUser(String(orderData.user.user_id), 'user')"
              size="big"
            />
          </a-col>
          <a-col :span="8" style="height: 60px" class="textstlye">
            <div>
              <label> 订单类型:</label>
              <span style="color: #787e8d">{{ orderData.lawyer_tag }}</span>
            </div>
          </a-col>
          <a-col :span="9" style="height: 60px" class="textstlye">
            <div>
              <label> 需求类型:</label><span style="color: #3980ea">{{ orderData.demand_type }}</span>
            </div>
          </a-col>
          <a-col :span="7" style="height: 60px" class="textstlye">
            <div>
              <label> 期望金额:</label>
              <span style="color: #3980ea">{{ orderData.expected_money ? orderData.expected_money + '元' : '' }}</span>
            </div>
          </a-col>
          <a-col :span="24" style="height: 60px" class="textstlye">
            <div>
              <label> 发起时间:</label>
              <span style="color: #787e8d">
                {{ orderData.created_at }}
                {{ orderData.address && orderData.created_at ? ' | ' : '' }}
                {{ orderData.address }}
              </span>
            </div>
          </a-col>
          <a-divider />
          <a-col :span="24" style="height: auto; min-height: 60px">
            <div>
              <span>TA的录音:</span>
            </div>
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center">
              <div v-for="(index, key) in orderData.records" :key="key * 2" style="padding: 0 10px; width: 33.333%">
                <a-popover title="通话录音对象" trigger="hover">
                  <template slot="content">
                    <user-vip-cell
                      :nickname="index.user.nickname"
                      :avatar="index.user.avatar"
                      :mobile="index.user.mobile"
                      :user-id="String(index.user.user_id)"
                      @open="openUser(String(index.user.user_id), 'lawyer')"
                      :logo="index.user.is_guarantee === 1 ? require('@/assets/user/cx_icon@2x.png') : ''"
                      size="small"
                    />
                  </template>
                  <img :src="require('@/assets/Fundraising/luyin.png')" style="width: 18px; height: 18px" />
                  <a @click="openRecord(index.record_path, 0)">录音{{ key + 1 }}</a
                  >|
                  <a @click="openRecord(index.record_path, 1)">下载</a>
                  <span style="margin: 10px">{{ index.created_at }}</span>
                </a-popover>
              </div>
            </div>
          </a-col>
          <a-divider />
          <a-col :span="24">
            <label>案件经过：</label>
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
              <p>{{ orderData.content }}</p>
            </div>
          </a-col>
          <a-col :span="24">
            <a-button type="danger" @click="state.deleteLoading = true" style="float: right"> 删除</a-button>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-table
          :data-source="LawyersData"
          :pagination="pagination"
          :loading="state.loading"
          :rowKey="(record) => record.is_chosen"
          style="background-color: #fff"
        >
          <a-table-column key="is_chosen" title="层序">
            <template slot-scope="text, record, index" align="center">
              <span>{{ index + 1 }}</span>
            </template>
          </a-table-column>
          <a-table-column key="lawyer" title="竞标律师" align="center">
            <template slot-scope="record">
              <user-vip-cell
                :nickname="record.lawyer.nickname"
                :avatar="record.lawyer.avatar"
                :mobile="record.lawyer.mobile"
                :user-id="String(record.lawyer.user_id)"
                @open="openUser(String(record.lawyer.user_id), 'lawyer')"
                :logo="record.lawyer.is_guarantee === 1 ? require('@/assets/user/cx_icon@2x.png') : ''"
              />
            </template>
          </a-table-column>
          <a-table-column key="content" title="留言" align="center">
            <template slot-scope="record">
              <text-with-row-button :text="record.content" :over-max="38" />
            </template>
          </a-table-column>
          <a-table-column key="price" title="报价" align="center">
            <template slot-scope="record">
              <span style="color: #ff6e57">{{ record.price ? record.price + '元' : '' }}</span>
            </template>
          </a-table-column>
          <a-table-column key="active" title="操作" align="center" v-if="orderData.status === 40 ? false : true">
            <template slot-scope="record">
              <div
                style="
                  display: flex;
                  flex-wrap: wrap;
                  flex-direction: column;
                  justify-content: space-evenly;
                  align-items: center;
                  align-content: space-around;
                "
              >
                <a-popconfirm @confirm="chooseLawyer(record)" ok-text="确定" cancel-text="取消" style="margin: 5px">
                  <p slot="title">请确认是否选择该竞标律师</p>
                  <a-button type="primary">选择</a-button>
                </a-popconfirm>
                <a-popconfirm @confirm="deleteLawyer(record)" ok-text="确定" cancel-text="取消" style="margin: 5px">
                  <a-icon slot="icon" type="question-circle-o" style="color: red" />
                  <p slot="title" style="color: red">请确认是否删除该竞标律师</p>
                  <a-button type="danger">删除</a-button>
                </a-popconfirm>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
    <a-modal
      okType="danger"
      ok-text="确认删除"
      cancel-text="取消删除"
      v-model="state.deleteLoading"
      title="填写删除的理由"
      @ok="delDemand"
      @cencel="state.modalLoading = false"
      width="650px"
    >
      <a-textarea v-model="deleteContent" placeholder="请输入删除理由" :auto-size="{ minRows: 3, maxRows: 5 }" />
    </a-modal>
    <ImageViewer id="imageViewer" ref="imageViewer" :images="images" />
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" :mode="dialogType" />
    </q-dialog>
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
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import ImageViewer from '@/components/Image/ImageViewer'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import { getOrderDemand, delOrderDemand, getOrderDemandLawyerPage, delOrderDemandLawyer, postOrderDemandLawyerChoose, } from '@/api/order'

export default {
  name: 'OrderDetailIndex',
  components: {
    ImageViewer,
    UserVipCell,
    UserDetailDialog,
    SingleAudioPlayer,
    TextWithRowButton,
  },
  props: {},
  data() {
    return {
      state: {
        deleteLoading: false,
        userDialog: false,
        delLawyer: false,
        chooseLawyer: false,
        recordVisible: false,
      },
      dialogType: 'user',
      deleteContent: '', // 删除理由
      currentPlayRecord: '', // 录音链接
      pageType: 0,
      orderData: {
        user: {
          user_id: 0,
          avatar: '',
          mobile: '',
          nickname: '',
        },
        lawyer_tag: '',
        demand_type: '',
        expected_money: 0,
        created_at: '',
        address: '',
        content: '',
        status: 0,
        records: [],
      },
      LawyersData: [],
      currentUserId: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          // this.getOrderDemandLawyerPage(page, this.orderData.demand_id)
          this.getOrderDemandLawyerPage(page, this.$route.params.demandId)
          this.pagination.current = page
        },
      },
      orderPage: '',
      images: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.orderPage = JSON.parse(sessionStorage.getItem('orderPage'))
    this.pageType = this.orderPage[0]
    const id = this.$route.params.demandId
    this.getOrderDemand(id)
    this.getOrderDemandLawyerPage(1, id)
  },
  methods: {
    getOrderDemand(id) {
      getOrderDemand(id).then((data) => {
        this.orderData = data.data
      })
    },
    getOrderDemandLawyerPage(page, id) {
      getOrderDemandLawyerPage(page, id).then((data) => {
        this.LawyersData = data.data.data
        // this.tableDataList = labelListData.data
         this.pagination.total = data.data.total // 总数
         this.pagination.current = page // 当前页数
      })
    },
    goList() {
      const condition = this.$route.params.condition
      this.$router.push({ name: 'DemandOrderList', params: { condition } })
    },
    chooseLawyer(record) {
      postOrderDemandLawyerChoose(record.demand_lawyer_id).then(() => {
        this.$message.success('选择律师成功')
      })
    },
    deleteLawyer(record) {
      delOrderDemandLawyer(record.demand_lawyer_id).then(() => {
        this.$message.success('删除成功')
        this.getOrderDemandLawyerPage(this.pagination.current, this.$route.params.demandId)
      })
    },
    delDemand() {
      delOrderDemand(this.$route.params.demandId, this.deleteContent).then(() => {
        const condition = this.$route.params.condition
        this.$router.push({ name: 'DemandOrderList', params: { condition } })
      })
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.dialogType = type
      this.currentUserId = userId
    },
    openRecord(url, type) {
      if (type === 0) {
        this.state.recordVisible = true
        this.currentPlayRecord = url
      } else {
        window.open(url)
      }
    },
  },
}
</script>
 <style scoped lang="less">
label {
  color: #222222;
}
.textstlye {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
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
