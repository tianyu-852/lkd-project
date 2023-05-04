<template>
  <div class="Member">
    <a-row :gutter="[16, 16]">
      <a-col :span="12">
        <a-card style="height: auto">
          <div
            style="
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20px;
            "
          >
            <div class="top">
              <img :src="require('@/assets/common/hf_icon@2x.png')" @click="backList" />
              <span @click="backList">返回列表</span>
            </div>
          </div>
          <UserVipCell
            size="big"
            :nickname="user.nickname"
            :avatar="user.avatar"
            :mobile="user.mobile"
            :mode="10"
            :TagArray="TagArray"
          />
          <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; margin-top: 24px">
            <div class="dataList">
              <span>注册信息:</span>
              <span>{{ '2020-11-12 12:21｜浙江温州' }}</span>
            </div>
            <div class="dataList">
              <span>最近登录:</span>
              <span>{{ '2020-11-12 12:21｜浙江温州' }}</span>
            </div>
            <a-divider />
            <div class="dataList">
              <span>开通时间:</span>
              <span>{{ '2020-11-12 12:21' }}</span>
            </div>
            <div class="dataList">
              <span>到期时间:</span>
              <span>{{ '2020-11-12 12:21' }}</span>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <div class="Member-right">
          <div class="Member-right-title">
            <span> 用户资料 </span>
            <span @click="state.addProfit = true">
              <img :src="require('@/assets/common/icon_add_blue.png')" style="width: 14px; height: 14px" />
              添加权益
            </span>
          </div>
          <a-divider style="margin: 0" />
          <div class="Member-right-content">
            <div class="Member-right-content-tag" v-for="(i, key) in 3" :key="key">
              <span>四个大字</span>
              <div>123</div>
              <a-button type="danger" @click="delProfit">删除</a-button>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="24">
        <a-card>
          <div class="Member-table">
            <div class="Member-table-tagList">
              <div
                class="Member-table-tagList-unChooseTable"
                :class="tabs === 0 ? 'chooseTable' : ''"
                @click="tabs = 0"
              >
                发帖列表
              </div>
              <div
                class="Member-table-tagList-unChooseTable"
                :class="tabs === 1 ? 'chooseTable' : ''"
                @click="tabs = 1"
              >
                评论列表
              </div>
              <div
                class="Member-table-tagList-unChooseTable"
                :class="tabs === 2 ? 'chooseTable' : ''"
                @click="tabs = 2"
              >
                订单列表
              </div>
            </div>
            <!-- <a-range-picker style="width: 300px" /> -->
          </div>
          <div>
            <UserQuestionTable v-show="tabs === 0" :user-id="String($route.params.userId)" />
            <UserOrderTable v-show="tabs === 1" :user-id="String($route.params.userId)" />
            <UserCommentTable v-show="tabs === 2" :user-id="String($route.params.userId)" />
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.addProfit" title="添加权益">
      <div
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: nowrap;
          justify-content: space-between;
          margin-bottom: 10px;
        "
      >
        <span>服务项目</span>
        <a-input style="width: 400px" v-model="newProfit.title" placeholder="请输入服务项目名称" />
      </div>
      <a-textarea v-model="newProfit.value" placeholder="请输入服务说明内容" :auto-size="{ minRows: 4 }"></a-textarea>
      <div
        style="display: flex; flex-direction: row; justify-content: space-around; align-items: center; margin: 20px 0"
      >
        <a-button @click="state.addProfit = false">取消</a-button>
        <a-button
          @click="addNewProfit()"
          type="primary"
          style="background-color: #3764ff; color: #ffffff; border-color: #3764ff"
        >
          确认
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
  <script>
import UserVipCell from '@/components/User/UserVipCell'
import UserOrderTable from '@/components/User/Table/UserOrderTable'
import UserQuestionTable from '@/components/User/Table/UserQuestionTable'
import UserCommentTable from '@/components/User/Table/UserCommentTable.vue'

export default {
  name: 'salesmanDetailIndex',
  components: { UserVipCell, UserQuestionTable, UserOrderTable, UserCommentTable },
  props: {},
  data() {
    return {
      user: {
        address: '',
        description: '',
        mobile: '12312312',
        nickname: '12312',
        order_number: 0,
        question_number: 0,
        ban: 0,
      },
      tabs: 0,
      state: {
        addProfit: false,
      },
      newProfit: {
        title: '',
        value: '',
      },
      TagArray: [
        {
          value: '未开通',
          color: '#FF9700',
          backgroundColor: '#FFEACC',
        },
        {
          value: '普惠月',
          color: '#2CBF78',
          backgroundColor: '#D6FFEB',
        },
        {
          value: '年卡',
          color: '#2CBF78',
          backgroundColor: '#D6FFEB',
        },
      ],
    }
  },
  computed: {
    userList() {
      return [
        {
          title: '注册信息:',
          value: '2020-11-12 12:21｜浙江温州',
        },
        {
          title: '最近登录:',
          value: '2020-11-12 12:21｜浙江温州',
        },
        {
          title: '开通时间:',
          value: '2020-11-12 12:21',
        },
        {
          title: '到期时间:',
          value: '2020-11-12 12:21',
        },
      ]
    },
  },
  watch: {},
  created() {
    this.getdata(this.$route.params.userId)
  },
  mounted() {},
  methods: {
    getdata(id) {
      console.log(id)
    },
    backList() {
      const condition = this.$route.params.condition
      const name = this.$route.params.name
      // this.$router.push({ name: 'salesmanList', params: { condition } })
      this.$router.back()
    },
    addNewProfit() {
      console.log(this.newProfit)
      this.state.addProfit = false
    },
    delProfit() {
      console.log('删除删除')
    },
  },
}
</script>
 <style scoped lang="less">
.Member {
  .top {
    cursor: pointer;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 800;
    color: #222222;
    opacity: 1;
    display: flex;
    align-items: center;
    margin-right: 20px;
    img {
      width: 25px;
      height: 20px;
      margin-right: 12px;
    }
  }
  .dataList {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    align-content: center;
    flex-wrap: nowrap;
    width: 50%;
    span:first-child {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #222222;
      opacity: 1;
    }
    span:last-child {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #787e8d;
      opacity: 1;
    }
  }
  .chooseTable {
    width: 80px;
    height: 30px;
    background: #ffffff;
    box-shadow: 0px 2px 8px rgba(0, 36, 178, 0.2);
    opacity: 1;
    border-radius: 12px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 53px;
    color: #3980ea;
  }

  &-right {
    height: auto;
    background-color: #ffffff;
    &-title {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      padding: 28px 40px;
      span:first-child {
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 800;
        color: #222222;
        opacity: 1;
      }
      span:last-child {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #3980ea;
        opacity: 1;
        cursor: pointer;
      }
    }
    &-content {
      padding: 12px 40px;
      min-height: 197px;
      &-tag {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        margin: 16px 0;
        justify-content: space-between;
        margin: 16px 0;
        align-content: center;
        span {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 0px;
          color: #222222;
          opacity: 1;
        }
        div {
          width: 75%;
          height: 34px;
          background: #f5f7fa;
          border: 1px solid #e1e6ee;
          opacity: 1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: nowrap;
          align-content: center;
          padding: 0 12px;
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 0px;
          color: #9ea5ae;
        }
      }
    }
  }
  &-table {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    &-tagList {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      width: 280px;
      height: 50px;
      background: #f5f5f9;
      opacity: 1;
      border-radius: 8px;
      margin-bottom: 20px;
      &-unChooseTable {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        height: 30px;
        width: 80px;
      }
    }
  }
}
/deep/.ant-modal-footer {
  display: none;
}
</style>
