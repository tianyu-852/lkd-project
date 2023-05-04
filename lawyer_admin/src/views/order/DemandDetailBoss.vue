<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <a-col :span="18">
            <div @click="goList">
              <span style="cursor: pointer; color: #222222; font-size: 22px">
                ←
                <span>返回列表</span>
              </span>
            </div>
          </a-col>
          <a-col :span="6">
            <div @click="state.historyLoading = true">
              <a style="float: right">
                历史审核记录 <img style="width: 6px; height: 11px" :src="require('@/assets/common/sm_arrow.png')" />
              </a>
            </div>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: row">
            <user-vip-cell
              :nickname="orderData.user.nickname"
              :avatar="orderData.user.avatar"
              :mobile="orderData.user.mobile"
              :user-id="String(orderData.user.user_id)"
              @open="openUser"
              size="big"
            />
          </a-col>
          <a-col :span="8" style="height: 60px" class="textstlye">
            <div>
              <label> 案件类型:</label>
              <!-- <span v-if="orderData.lawyer_tag" class="content_span" style="color: #787e8d">
                {{ orderData.lawyer_tag }}
              </span> -->
              <Cascader
                v-model="chooseType"
                :options="typeList"
                placeholder="案件类型"
                @change="chooseCaseType"
                style="width: 200px"
              />
            </div>
          </a-col>
          <a-col :span="8" style="height: 60px" class="textstlye">
            <div>
              <label> 需求类型:</label><span class="content_span">{{ orderData.demand_type }}</span>
            </div>
          </a-col>
          <a-col :span="8" style="height: 60px" class="textstlye">
            <div>
              <label> 期望金额:</label
              ><span class="content_span" style="color: #3980ea">{{ orderData.expected_money }}元</span>
            </div>
          </a-col>
          <a-col :span="24" style="height: 60px" class="textstlye">
            <div>
              <label> 发起时间:</label>
              <span class="content_span" style="color: #787e8d">
                {{ orderData.created_at }}|{{ orderData.address }}
              </span>
            </div>
          </a-col>
          <a-col :span="24">
            <label>案件经过：</label>
          </a-col>
          <a-col :span="24">
            <div
              style="
                background-color: #eff1f5;
                width: 100%;
                min-height: 200px;
                height: auto;
                word-wrap: break-word;
                word-break: normal;
                padding: 20px;
                color: #787e8d;
              "
            >
              <span>{{ orderData.content }}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <a-button
              @click="state.modalAgree = true"
              style="float: right; background-color: #2cbf78; color: #ffffff; border-color: #2cbf78; margin: 5px"
            >
              通过审核
            </a-button>
            <a-button
              @click="state.modalLoading = true"
              style="float: right; background-color: #ff9700; color: #ffffff; border-color: #ff9700; margin: 5px"
            >
              驳回
            </a-button>
          </a-col>
        </a-card>
      </a-col>
    </a-row>
    <a-modal
      v-model="state.historyLoading"
      title="历史审核记录"
      @ok="state.historyLoading = false"
      @cencel="state.historyLoading = false"
      width="650px"
      ok-text="确认"
      cancel-text="取消"
    >
      <div style="height: 500px; overflow: auto">
        <div v-if="historyData.length === 0">
          <Empty />
        </div>
        <div v-for="(i, key) in historyData" :key="key">
          <span
            v-show="i.check_status === 2"
            style="color: #ff524c; font-size: 14px; width: 25%; margin-right: 5%; padding: 10px"
          >
            {{ i.text }}
          </span>
          <span
            v-show="i.check_status === 1"
            style="color: #2cbf78; font-size: 14px; width: 25%; margin-right: 5%; padding: 10px"
          >
            {{ i.text }}
          </span>
          <span
            v-show="i.check_status === 0"
            style="color: #787e8d; font-size: 14px; width: 25%; margin-right: 5%; padding: 10px"
          >
            {{ i.text }}
          </span>
          <label style="width: 70%; font-size: 14px; font-weight: 500; color: #787e8d; padding: 10px">
            {{ i.created_at }}
          </label>
          <div style="background-color: #f7f8fa; width: 100%; min-height: 120px; height: auto; margin: 10px 0">
            <p style="color: #787e8d; font-size: 14px; padding: 10px; margin: 0">
              {{ i.refuse_reason }}
            </p>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="state.modalAgree"
      title="请确认是否通过审核"
      @ok="agreeApply"
      @cencel="state.modalAgree = false"
      width="650px"
      ok-text="通过"
      cancel-text="取消"
    >
      <p>这里是文案</p>
    </a-modal>
    <a-modal
      ok-text="驳回"
      cancel-text="取消"
      v-model="state.modalLoading"
      title="填写驳回原因"
      @ok="uploadApply"
      @cencel="state.modalLoading = false"
      width="650px"
    >
      <a-textarea v-model="content" placeholder="请输入驳回原因" :auto-size="{ minRows: 3, maxRows: 5 }" />
    </a-modal>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="String(currentUserId)" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>
  <script>
import { Empty, Cascader } from 'ant-design-vue'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import { getOrderDemand, postOrderDemandCheck, postOrderDemandCheckHistory } from '@/api/order'
import { getFundraisingQuestionTags } from '@/api/fundraising'
export default {
  name: 'OrderDetailIndex',
  components: {
    UserVipCell,
    UserDetailDialog,
    SingleAudioPlayer,
    TextWithRowButton,
    Empty,
    Cascader,
  },
  props: {},
  data() {
    return {
      state: {
        modalLoading: false,
        userDialog: false,
        modalAgree: false,
        recordVisible: false,
        historyLoading: false,
      },
      // fieldNames:{
      //   label: 'label',
      //    value: 'value',
      //     children: 'children'
      // },
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
      },
      historyData: [
        {
          text: '',
          created_at: '',
          check_times: 0,
          refuse_reason: '',
          check_status: 0,
        },
      ],
      currentUserId: 0,
      content: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        onChange: (page) => {
          this.getLawyerPage(page, this.search)
          this.pagination.current = page
        },
      },
      text: '',
      orderpage: '',
      images: [],
      typeList: [],
      chooseType: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.demandId = this.$route.params.demandId
    this.getOrderDemand(this.demandId)
  },
  mounted() {},
  methods: {
    getOrderDemand(id) {
      getOrderDemand(id).then((data) => {
        this.orderData = data.data
        this.gethistory()
        this.getFundraisingQuestionTags()
      })
    },
    gethistory() {
      postOrderDemandCheckHistory(String(this.orderData.user.user_id)).then((data) => {
        this.historyData = data.data
      })
    },
    uploadApply() {
      postOrderDemandCheck(this.demandId, 1, this.content).then(() => {
        const condition = this.$route.params.condition
        this.$router.push({ name: 'DemandOrderListBoss', params: { condition } })
      })
    },
    agreeApply() {
      const lawyerTagId = this.chooseType[1]
      postOrderDemandCheck(this.demandId, 0, '', lawyerTagId).then(() => {
        const condition = this.$route.params.condition
        this.$router.push({ name: 'DemandOrderListBoss', params: { condition } })
      })
    },
    openRecord(recordUrl) {
      this.currentPlayRecord = recordUrl
      this.state.recordVisible = true
    },
    goList() {
      const condition = this.$route.params.condition
      this.$router.push({ name: 'DemandOrderListBoss', params: { condition } })
    },
    openUser(record) {
      this.state.userDialog = true
      this.currentUserId = record
    },
    chooseCaseType(value) {
      this.chooseType = value
      console.log(this.chooseType)
    },
    getFundraisingQuestionTags() {
      getFundraisingQuestionTags().then((data) => {
        const typelist = JSON.stringify(data.data)
        this.typeList = JSON.parse(
          typelist
            .replace(/lawyer_tag_id/g, 'value')
            .replace(/lawyer_tag_group/g, 'label')
            .replace(/lawyer_tags/g, 'children')
            .replace(/lawyer_tag/g, 'label')
        )
        for (let i = 0; i < this.typeList.length; i++) {
          this.typeList[i].value = i + 1
        }
        let a = []
        for (let i = 0; i < this.typeList.length; i++) {
          for (let j = 0; j < this.typeList[i].children.length; j++) {
            if (this.orderData.lawyer_tag === this.typeList[i].children[j].label) {
              a = [this.typeList[i].value, this.typeList[i].children[j].value]
            }
          }
        }
        this.chooseType = a
      })
    },
  },
}
</script>
 <style scoped lang="less">
label {
  color: #222222;
  font-size: 18px;
  font-weight: bold;
}
.content_span {
  font-size: 18px;
  font-weight: bold;
}
.textstlye {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  // justify-content: space-around;
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
