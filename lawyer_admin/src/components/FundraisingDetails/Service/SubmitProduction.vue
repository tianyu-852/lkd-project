<template>
  <div>
    <a-col :span="12">
      <a-col :span="24">
        <details-left
          ref="detailsLeft"
          :fundraisingRegistrationId="fundraisingRegistrationId"
          :fundraisingProgressId="fundraisingProgressId"
          :detailstService="detailstService"
          :newData="newData"
          :condition="condition"
          @fund="getMsgFormSon"
        />
      </a-col>
    </a-col>
    <a-col :span="12">
      <a-col>
        <details-right
          ref="detailsRight"
          @uploadDemandsSubmit="uploadDemandsSubmit"
          v-if="state.changeList"
          @save="savedata"
          :userData="userData"
          :detailstService="detailstService"
          :fundraisingProgressId="fundraisingProgressId"
        />
      </a-col>
    </a-col>
  </div>
</template>
  <script>
import DetailsLeft from '@/components/FundraisingDetails/Service/SubmitProduction/detailsLeft'
import DetailsRight from '@/components/FundraisingDetails/Service/SubmitProduction/detailsRight'
import { putFundraisingRegistration } from '@/api/fundraising'
export default {
  name: 'fourIndex',
  components: {
    DetailsLeft,
    DetailsRight,
  },
  props: {
    detailstService: {
      type: Object,
      default: () => {
        return []
      },
    },
    fundraisingProgressId: {
      type: Number,
      default: 0,
    },
    condition: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      userData: {},
      state: {
        changeList: true,
      },
      fundraisingRegistrationId: 0,
      newData: {
        nickname: '',
        mobile: '',
        content: '',
        images: [],
      },
    }
  },
  computed: {},
  watch: {
    immediate: true,
    detailstService(value) {
      this.detailstService = value
      return this.detailstService
    },
  },
  created() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    this.fundraisingRegistrationId = this.detailstService.fundraising_registration_id
    this.newData.nickname = this.userData.litigant_user_nickname
    this.newData.mobile = this.userData.litigant_user_mobile
    this.newData.content = this.userData.content
    this.newData.images = this.userData.images
  },
  mounted() {},
  methods: {
    getMsgFormSon(data) {
      this.state.changeList = data
    },
    putData() {
      const Id = this.fundraisingRegistrationId
      const nickname = this.newData.nickname
      const mobile = this.newData.mobile
      const content = this.newData.content
      const images = this.newData.images
      putFundraisingRegistration(Id, nickname, mobile, content, JSON.stringify(images)).then((data) => {
        this.$message.success('保存成功')
      })
    },
    uploadDemandsSubmit() {
      this.$refs.detailsLeft.uploadDemandsSubmit()
    },
    savedata() {
      this.$refs.detailsLeft.putData(1)
    },
  },
}
</script>
 <style scoped lang="less">
</style>
