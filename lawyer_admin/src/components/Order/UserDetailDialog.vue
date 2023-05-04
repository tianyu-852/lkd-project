<template>
  <common-dialog mode="customize" style="max-width: 800px" @close="$emit('close')">
    <template #title>
      <div class="title" v-show="!state.isLoading">
        <div class="top">
          <a-avatar :size="80" icon="user" :src="avatar" />
          <div class="top-content">
            <div class="top-content-row">
              <span class="title-nickname margin-left-16 margin-right-40">{{ nickname }}</span>
              <span class="margin-right-40">手机号码：{{ mobile }}</span>
              <span class="margin-right-40" v-if="type === 0">
                会员情况：{{ user.is_vip ? `${user.vip_name} | ${user.vip_expired_time}到期` : user.vip_name }}
              </span>
              <span class="margin-right-40" v-else>
                律师认证：{{ lawyer.lawyer_grade_chinese }}
                {{ lawyer.work_year ? ' | 执业' + lawyer.work_year + '年' : '' }}
              </span>
            </div>

            <div class="top-content-row">
              <div style="margin: 0 16px">
                <span>登录时间：{{ user.active_at ? user.active_at : lawyer.active_at ? lawyer.active_at : '' }}</span>
              </div>
              <span class="margin-left-16 margin-right-40" v-if="lawyer.lawyer_office">
                所属律所：{{ lawyer.lawyer_office }}
              </span>
            </div>
            <div class="top-content-row" style="margin: 0 16px">
              <user-muted-button :user-id="userId" v-model="user.is_muted" v-if="userType === 0" />
              <delete-lawyer-button :user-id="userId" @success="lawyer.type = 0" v-else style="margin: 5px" />
              <user-private-button :user-id="userId" style="margin: 5px" />
              <a-button v-if="type === 1" @click="gotoLawyer" style="margin: 5px" size="small">查看律师详情</a-button>
              <a-button v-else @click="gotoUser" style="margin: 5px" size="small">查看用户详情</a-button>
            </div>
          </div>
        </div>
      </div>
      <a-skeleton
        class="title"
        v-show="state.isLoading"
        :loading="state.isLoading"
        avatar
        active
        :paragraph="{ rows: 0 }"
        :title="{ width: '500px' }"
      />
    </template>
    <div class="detail" v-if="type === 0">
      <div class="detail-item" style="color: #3980ea; cursor: pointer" v-show="!state.isLoading" @click="gotoUser">
        <div class="detail-item-value">{{ user.question_number }}</div>
        <div class="detail-item-title">发帖数量</div>
      </div>
      <div
        class="detail-item"
        :class="{ blue: index === 3 }"
        v-for="(item, index) in userdetail"
        :key="item.label"
        v-show="!state.isLoading"
      >
        <div class="detail-item-value">{{ item.value }}</div>
        <div class="detail-item-title">{{ item.label }}</div>
      </div>
      <a-skeleton
        v-for="item in userdetail"
        :key="item.label + '_skeleton'"
        class="detail-item"
        v-show="state.isLoading"
        :loading="state.isLoading"
        active
        :paragraph="{ rows: 0 }"
      />
    </div>
    <div class="detail" v-if="type === 1">
      <div
        class="detail-item"
        :class="{ blue: index === 0 || index === 4 }"
        v-for="(item, index) in lawyerdetail"
        :key="item.label"
        v-show="!state.isLoading && index < 4"
      >
        <div class="detail-item-value">{{ item.value }}</div>
        <div class="detail-item-title">{{ item.label }}</div>
      </div>
      <div
        class="detail-item"
        :class="{ blue: index === 0 || index === 4 }"
        v-for="(item, index) in lawyerdetail"
        :key="item.label + '_detail'"
        style="cursor: pointer"
        v-show="!state.isLoading && index > 3"
        @click="gotoLawyer"
      >
        <div class="detail-item-value">{{ item.value }}</div>
        <div class="detail-item-title">{{ item.label }}</div>
      </div>

      <a-skeleton
        v-for="item in lawyerdetail"
        :key="item.label + '_skeleton'"
        class="detail-item"
        v-show="state.isLoading"
        :loading="state.isLoading"
        active
        :paragraph="{ rows: 0 }"
      />
    </div>
  </common-dialog>
</template>

<script>
import CommonDialog from '@/components/Dialog/CommonDialog'
import { getLawyerStatistics, getUserStatistics } from '@/api/user'
import UserMutedButton from '@/components/User/UserMutedButton'
import DeleteLawyerButton from '@/components/User/DeleteLawyerButton'
import UserPrivateButton from '@/components/User/UserPrivateButton'
export default {
  name: 'UserDetailDialog',
  components: { DeleteLawyerButton, UserMutedButton, CommonDialog, UserPrivateButton },
  props: {
    userId: {
      type: String,
      default: '',
    },
    transferData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    userdetail() {
      return [
        // {
        //   label: '发帖数量',
        //   value: this.user.question_number,
        // },
        {
          label: '已咨询电话',
          value: this.user.call_phone_bind_number,
        },
        {
          label: '已接通电话',
          value: this.user.call_phone_success_number,
        },
        {
          label: '未接通电话',
          value: this.user.call_phone_bind_number - this.user.call_phone_success_number,
        },
        {
          label: '全部评价',
          value: this.user.order_number,
        },
        {
          label: '已评价',
          value: this.user.evaluated_number,
        },
        {
          label: '未评价',
          value: this.user.order_number - this.user.evaluated_number,
        },
        {
          label: '服务过TA的律师',
          value: this.user.lawyer_number,
        },
      ]
    },
    lawyerdetail() {
      return [
        {
          label: '发帖数量',
          value: this.lawyer.question_number,
        },
        {
          label: '回答',
          value: this.lawyer.answer_number,
        },
        {
          label: '收到电话',
          value: this.lawyer.receive_phone_bind_number,
        },
        {
          label: '接通电话',
          value: this.lawyer.receive_phone_success_number,
        },
        {
          label: '服务过的用户',
          value: this.lawyer.order_success_number,
        },
        {
          label: '评价满意',
          value: this.lawyer.praise_number,
        },
        {
          label: '评价一般',
          value: this.lawyer.secondary_number,
        },
        {
          label: '评价不满意',
          value: this.lawyer.bad_number,
        },
      ]
    },
    userType() {
      if (this.user.type) {
        return this.user.type
      }
      return this.lawyer.type
    },
  },
  data() {
    return {
      state: {
        isLoading: true,
      },
      avatar: '',
      nickname: '',
      mobile: '',
      type: -1,
      user: {
        avatar: '',
        nickname: '',
        mobile: '',
        is_vip: 0,
        vip_name: '',
        vip_expired_time: '',
        question_number: 0,
        call_phone_bind_number: 0,
        call_phone_success_number: 0,
        order_number: 0,
        evaluated_number: 0,
        lawyer_number: 0,
        is_muted: 0,
        type: 0,
        active_at: 0,
      },
      lawyer: {
        lawyer_office: '',
        avatar: '',
        nickname: '',
        mobile: '',
        lawyer_grade_chinese: '',
        question_number: 0,
        answer_number: 0,
        receive_phone_bind_number: 0,
        receive_phone_success_number: 0,
        order_success_number: 0,
        praise_number: 0,
        secondary_number: 0,
        bad_number: 0,
        type: 0,
        active_at: 0,
        is_muted: 0,
        work_year: null,
      },
    }
  },
  created() {
    this.updateData()
  },
  methods: {
    // updateUser() {
    //   this.state.isLoading = true
    //   getUserStatistics(this.userId)
    //     .then(({ data }) => {})
    //     .finally(() => {
    //       this.state.isLoading = false
    //     })
    // },
    updateData() {
      this.state.isLoading = true
      getLawyerStatistics(this.userId)
        .then(({ data }) => {
          if (data.type === 1) {
            this.lawyer = data
          } else if (data.type === 0) {
            this.user = data
          }
          this.avatar = data.avatar
          this.nickname = data.nickname
          this.mobile = data.mobile
          this.type = data.type
          console.log(data)
        })
        .finally(() => {
          this.state.isLoading = false
        })
    },
    getdata() {
      getUserStatistics(this.userId).then(({ data }) => {})
    },
    gotoUser() {
      const userId = this.userId
      this.$router.push({ name: 'UserDetail', params: { userId } })
      // console.log('UserPage')
      // const mobile = this.user.mobile
      // this.$router.push({
      //   name: 'UserPage',
      //   params: { mobile },
      // })
    },
    gotoLawyer() {
      sessionStorage.setItem('lawyerCondition', JSON.stringify(this.transferData))
      const userId = this.userId
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  width: 760px;
  padding: 16px 32px;

  &-nickname {
    color: #222222;
    font-size: 16px;
  }
}

.margin-right-40 {
  margin-right: 30px;
}

.detail {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(2, 150px);

  &-item {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &-value {
      text-align: center;
      font-size: 36px;
      font-weight: 800;
      font-family: PingFang SC;
      margin-bottom: 4px;
    }

    &-title {
      font-weight: 500;
      font-size: 16px;
      font-family: PingFang SC;
    }
  }
}

.top {
  display: flex;

  &-content {
    display: flex;
    flex-direction: column;

    &-row {
      display: flex;
      margin-bottom: 4px;
    }
  }
}

.blue {
  color: #3980ea;
}
</style>