<template>
  <div>
    <a-row :gutter="[8, 16]">
      <a-col :span="24">
        <a-card :loading="state.loading">
          <a-col :span="24">
            <div>
              <div @click="goList" style="width: 150px; cursor: pointer; color: #222222; font-size: 22px">
                <b>
                  <span> ←<span>返回列表</span> </span>
                </b>
              </div>
            </div>
          </a-col>
          <a-col :span="24" style="overflow: auto">
            <details-steps v-show="current !== -1" :type="isRefuse" />
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24" v-if="this.current < 3">
        <SubmitProduction
          :detailstService="detailstService"
          :fundraisingProgressId="fundraisingProgressId"
          :condition="$route.params.condition"
          v-if="fourData"
        />
      </a-col>
      <a-col :span="24" v-if="this.current === 3">
        <UserConfirmation :fundraisingProgressId="fundraisingProgressId" />
      </a-col>
      <a-col :span="24" v-if="this.current === 4">
        <BiddingLawyer :fundraisingProgressId="fundraisingProgressId" :currentType="false" />
      </a-col>
      <a-col :span="24" v-if="this.current === 5">
        <SignContract :fundraisingProgressId="fundraisingProgressId" :currentType="false" />
      </a-col>
      <a-col :span="24" v-if="this.current === 6">
        <IdentifyLawyers :fundraisingProgressId="fundraisingProgressId" :currentType="false" />
      </a-col>
      <a-col :span="24" v-if="this.current === 7">
        <EventProgress :fundraisingProgressId="fundraisingProgressId" :currentType="false" />
      </a-col>
      <a-col :span="24" v-if="this.current === 8"> 该案件已结案 </a-col>
    </a-row>
  </div>
</template>
  <script>
import { getFundraisingData, getFundraisingStatus } from '@/api/fundraising'
import SubmitProduction from '@/components/FundraisingDetails/Service/SubmitProduction.vue'
import UserConfirmation from '@/components/FundraisingDetails/Service/UserConfirmation'
import BiddingLawyer from '@/components/FundraisingDetails/Service/BiddingLawyer'
import IdentifyLawyers from '@/components/FundraisingDetails/Service/IdentifyLawyers'
import SignContract from '@/components/FundraisingDetails/Service/SignContract.vue'
import EventProgress from '@/components/FundraisingDetails/Service/EventProgress.vue'
import DetailsSteps from '@/components/FundraisingDetails/detailsSteps'
export default {
  components: {
    SubmitProduction,
    UserConfirmation,
    SignContract,
    DetailsSteps,
    BiddingLawyer,
    IdentifyLawyers,
    EventProgress,
  },
  props: {},
  data() {
    return {
      isRefuse: 0,
      fourData: true,
      current: -1,
      state: {
        loading: false,
      },
      detailstService: {},
      fundraisingRegistrationId: 0,
    }
  },
  computed: {
    selectStep() {
      return this.$store.state.step.selectStep
    },
  },
  watch: {
    immediate: true,
    selectStep() {
      this.current = this.$store.state.step.selectStep
    },
  },
  created() {
    this.fundraisingProgressId = Number(this.$route.params.fundraisingProgressId)
    this.getFundraisingStatus(this.fundraisingProgressId)
  },
  mounted() {},
  methods: {
    getFundraisingStatus(fundraisingProgressId) {
      // 单数据展开
      getFundraisingStatus(fundraisingProgressId).then((data) => {
        this.fundraisingRegistrationId = data.data.fundraising_registration_id
        // this.current = data.data.status
        switch (data.data.status) {
          case 5:
            this.current = 0
            break
          case 10:
            this.current = 1
            break
          case 44:
            this.current = 2
            break
          case 47:
            this.current = 3
            break
          case 48:
            this.current = 3
            break
          case 50:
            this.current = 4
            break
          case 52:
            this.current = 5
            break
          case 53:
            this.current = 6
            break
          case 54:
            this.current = 7
            break
          case 60:
            this.current = 7
            break
          case 65:
            this.current = 8
            break
          case 66:
            this.current = 8
            break
          default:
            this.current = 0
            break
        }
        this.$store.commit('edit', { currentStep: this.current, selectStep: this.current })
        this.fundraise_money = String(data.data.fundraise_money)
        this.target_money = String(data.data.target_money)
        this.detailstService = data.data
        sessionStorage.setItem('订单详情', JSON.stringify(this.detailstService))
        getFundraisingData(this.fundraisingRegistrationId).then((data) => {
          sessionStorage.setItem('userData', JSON.stringify(data.data))
          this.isRefuse = data.data.is_refuse
          this.state.loading = false
          this.fourData = false
          setTimeout(() => {
            this.fourData = true
          }, 0)
        })
      })
    },
    goList() {
      const condition = this.$route.params.condition
      this.$router.push({ name: 'FundraisingService', params: { condition } })
    },
  },
}
</script>
 <style scoped lang="less">
</style>
