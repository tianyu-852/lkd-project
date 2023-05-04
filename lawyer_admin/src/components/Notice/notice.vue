<template>
  <div>
    <a-popover placement="bottom">
      <template slot="content">
        <Empty v-show="AllPendingAudit === 0" description="暂无待处理事项" />
        <!-- 众筹案件审核 -->
        <a-button v-show="$store.state.pendingAudit.fundraisingData > 0" class="noticeOption" @click="$router.push({ name: 'FundraisingCheck' })" >
          众筹案件审核
          <a-tag color="#f5222d">{{ $store.state.pendingAudit.fundraisingData }} </a-tag>
        </a-button>

        <!-- 用户注销审核 -->
        <a-button v-show="$store.state.pendingAudit.userLogout > 0" class="noticeOption" @click="$router.push({ name: 'CancellationList' })" >
          用户注销审核
          <a-tag color="#f5222d">{{ $store.state.pendingAudit.userLogout }} </a-tag>
        </a-button>

        <!-- 待处理评价 -->
        <a-button v-show="$store.state.pendingAudit.OrderEvaluateComplaint > 0" class="noticeOption" @click="$router.push({ name: 'OrderLawyerList' })" >
          待处理评价
          <a-tag color="#f5222d">{{ $store.state.pendingAudit.OrderEvaluateComplaint }} </a-tag>
        </a-button>
        
        <!-- 待审核提现申请 -->
        <a-button v-show="$store.state.pendingAudit.AssetsStatistics > 0" class="noticeOption" @click="$router.push({ name: 'moneyPage' })" >
          待审核提现申请
          <a-tag color="#f5222d">{{ $store.state.pendingAudit.AssetsStatistics }} </a-tag>
        </a-button>

        <!-- 企业标签线索 -->
        <a-button v-show="clueQiyeRightsIds.includes(userInfo.id) && clueQiyeLabelNum > 0" class="noticeOption" @click="$router.push({ name: 'CauseSourceClue' }); clueQiyeLabelNum = 0;" >
          企业标签线索
          <a-tag color="#f5222d">{{ clueQiyeLabelNum }} </a-tag>
        </a-button>

        <!-- 待审核推广大使 -->
        <a-button v-show="promoteCheckNum" class="noticeOption" @click="$router.push({ name: 'LawyerPromoteRoute' })" >
          待审核推广大使
          <a-tag color="#f5222d">{{ promoteCheckNum }} </a-tag>
        </a-button>

        <!-- 今日开通优选 -->
        <a-button v-show="dailyOpenBestLawyerNum" class="noticeOption" @click="$router.push({ name: 'LawyerBest', query: { curDate: 1 } })" >
          今日开通优选
          <a-tag color="#f5222d">{{ dailyOpenBestLawyerNum }} </a-tag>
        </a-button>

        <!-- 律师修改地址 -->
        <a-button v-show="lawyerUpdateAddrNum" class="noticeOption" @click="$router.push({ name: 'LawyerAuth', query: { upaddr: 1 } })" >
          律师修改地址
          <a-tag color="#f5222d">{{ lawyerUpdateAddrNum }} </a-tag>
        </a-button>
      </template>

      <template slot="title">
        <span>待处理审核</span>
      </template>
      
      <!-- 加盟商不显示 铃铛 -->
      <a-badge v-if="!userInfo.alliance" :count="AllPendingAudit">
        <img :src="require('@/assets/common/image_notice.png')" class="noticeImage" />
      </a-badge>
    </a-popover>
  </div>
</template>

<script>
import { getUserDeletePage } from '@/api/user'
import { getFundraisingPage } from '@/api/fundraising'
import { getOrderEvaluateComplaintPage } from '@/api/order'
import { getAssetsStatistics } from '@/api/assets'
import * as causeSourceApi from '@/api/causeSourceApi'
import * as lawyerApi from '@/api/lawyer'
import { Empty } from 'ant-design-vue'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'NoticeIndex',
  components: { Empty },
  props: {},
  data() {
    return {
      clueQiyeLabelNum: 0, // 线索企业标签 num
      clueQiyeRightsIds: [ 65 ], // 线索企业标签 账号权限 ids
      // clueQiyeRightsIds: [ 65, 21 ], // 线索企业标签 账号权限 ids

      promoteCheckNum: 0, // 推广大使待审核 num
      dailyOpenBestLawyerNum: 5, // 每日开通优选律师 num
      lawyerUpdateAddrNum: 5, // 律师修改地址 num
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
    AllPendingAudit() {
      let value = 0
      value =
        this.$store.state.pendingAudit.userLogout +
        this.$store.state.pendingAudit.fundraisingData +
        this.$store.state.pendingAudit.OrderEvaluateComplaint +
        this.$store.state.pendingAudit.AssetsStatistics
      return value
    },
  },
  watch: {},
  created() {
    this.getUserDeletePage()
    this.getFundraisingPage()
    this.getOrderEvaluateComplaintPage()
    this.getAssetsStatistics()
    this._getCauseSourceClueQiyeData()
    this._getPromoteCheckData()
    this._getLawyerUpdateAddrNum()
    // this._getDaileOpenBestData()
  },
  mounted() {},
  methods: {
    /**
     * 用户注销审核 num
     */
    getUserDeletePage() {
      getUserDeletePage(1, -1, '').then((data) => {
        const UserDeleteData = data.data.total
        // 保存数据到vuex 上面也是要读取vuex的数据来保证实时更新
        this.$store.commit('userLogoutUpload', { UserDeleteData })
      })
    },

    /**
     * 众筹案件审核 num
     */
    getFundraisingPage() {
      getFundraisingPage(1, 0, '').then((data) => {
        const fundraisingData = data.data.total
        this.$store.commit('fundraisingDataUpload', { fundraisingData })
      })
    },
    
    /**
     * 待处理评价 num
     */
    getOrderEvaluateComplaintPage() {
      getOrderEvaluateComplaintPage(1, 1, -1, '').then((data) => {
        const OrderEvaluateComplaint = data.data.total
        this.$store.commit('OrderEvaluateComplaint', { OrderEvaluateComplaint })
      })
    },
    
    /**
     * 待审核提现申请 num
     */
    getAssetsStatistics() {
      getAssetsStatistics({ page: 1, type: 0 }).then(({ data }) => {
        const AssetsStatistics = data.total
        this.$store.commit('AssetsStatistics', { AssetsStatistics })
      })
    },

    /**
     * 获取案源线索 企业标签数据
     */
    async _getCauseSourceClueQiyeData() {
      try {
        // 获取线索 企业标签数
        const { data: qiYeData } = await causeSourceApi.getCauseSourceClueQiyeDataApi({ type: 'get' })
        this.clueQiyeLabelNum = qiYeData.num
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取推广大使 待审核数据
     */
    async _getPromoteCheckData() {
      const param = { page: 1, size: 15, status: 1 }
      try {
        const { data: promoteCheckData } = await lawyerApi.getLawyerPromoteCheckListApi(param)
        this.promoteCheckNum = promoteCheckData.total
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 获取每日开通优选
     */
     async _getDaileOpenBestData(page = 1) {
       const param = {
        page,
        size: 500,
        optimization_plan_start_time: moment().format('YYYY-MM-DD')
       }

       try {
         const { data: bestTotalData } = await lawyerApi.getBestLawyerListApi(param)
         this.dailyOpenBestLawyerNum = bestTotalData.total
       } catch (error) {
         console.log(error)
       }
    },
    /**
     * 修改律师更新地址数
     */
     async _getLawyerUpdateAddrNum(page = 1) {
       const param = {
        page,
        size: 500,
        is_read: 0
      }

       try {
         const { data: addrLawyerData } = await lawyerApi.getLawyerUpdateAddrLogApi(param)
         this.lawyerUpdateAddrNum = addrLawyerData.total
       } catch (error) {
         console.log(error)
       }
    },
  },
}
</script>
 <style scoped lang="less">
.noticeImage {
  height: 22px;
  width: 22px;
  cursor: pointer;
  object-fit: contain;
}
.noticeOption {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  border: none;
  width: 200px;
}
</style>
