<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div>
        <span class="focus-text">聊天记录数量：{{ pagination.total }}</span>
        <a-input
          allow-clear
          placeholder="搜索用户名/手机号"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 0 5px"
        />
        <a-input
          allow-clear
          placeholder="搜索内容"
          v-model="searchContent"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 0 5px"
        />
        <a-button type="primary" @click="getSearchPage"> 搜索 </a-button>
      </div>
      <div>
        <a-range-picker
          @change="onDateChange"
          :placeholder="rangePlaceholder"
          style="width: 340px"
          :default-value="[startDate, endDate]"
          format="YYYY-MM-DD HH:mm:ss"
          :show-time="{
            hideDisabledOptions: true,
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
          }"
        />
      </div>
    </a-layout-header>

    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => String(record.rong_message_id)"
      >
        <a-table-column key="from_user" title="发送人">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.from_user.nickname"
              :avatar="record.from_user.avatar"
              :mobile="record.from_user.call_mobile"
              :user-id="String(record.from_user.user_id)"
              size="sm"
              @open="openUser(String(record.from_user.user_id))"
            />
          </template>
        </a-table-column>
        <a-table-column key="receive_user" title="接收人">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.receive_user.nickname"
              :avatar="record.receive_user.avatar"
              :mobile="record.receive_user.call_mobile"
              :user-id="String(record.receive_user.user_id)"
              size="sm"
              @open="openUser(String(record.receive_user.user_id))"
            />
          </template>
        </a-table-column>
        <a-table-column key="created_at" title="发送时间">
          <template slot-scope="record">
            <span>{{ record.created_at }}</span>
          </template>
        </a-table-column>
        <a-table-column key="content" title="发送内容">
          <template slot-scope="record">
            {{ record.content }}
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <a-button
              style="margin-right: 16px; margin-top: 5px"
              size="small"
              type="primary"
              @click=";(state.chatRecordLoading = true), getNewChatRecord(1, record)"
            >
              查看详情
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <a-modal v-model="state.chatRecordLoading" :width="700">
      <div class="addIntendedUser">
        <div class="addIntendedUser-title">
          <a-date-picker @change="NewChatOnChange" v-model="NewChatDate" style="width: 140px" />
          <span>聊天记录</span>
          <div style="width: 140px"></div>
        </div>
        <div class="addIntendedUser-main">
          <div
            v-for="(i, key) in NewChatRecordList"
            :key="key"
            style="width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center"
          >
            <div :class="i.from_user.nickname === NewChatRecordList[0].from_user.nickname ? 'leftUser' : 'rightUser'">
              <div v-show="i.from_user.nickname === NewChatRecordList[0].from_user.nickname" class="avatarDiv">
                <img :src="i.from_user.avatar" />
              </div>

              <div
                style="display: flex; flex-direction: column; align-items: flex-start; flex-wrap: nowrap; margin: 0 8px"
                :style="
                  i.from_user.nickname !== NewChatRecordList[0].from_user.nickname ? 'align-items: flex-end;' : ''
                "
              >
                <span>
                  {{ i.from_user.nickname }}
                </span>
                <div
                  :class="
                    i.from_user.nickname === NewChatRecordList[0].from_user.nickname ? 'leftChatUser' : 'rightChatUser'
                  "
                >
                  {{ i.content }}
                </div>
              </div>

              <div v-show="i.from_user.nickname !== NewChatRecordList[0].from_user.nickname" class="avatarDiv">
                <img :src="i.from_user.avatar" />
              </div>
            </div>
            <div class="chatTitle" v-show="calculationTime(key)">
              {{ i.created_at }}
            </div>
          </div>

          <div class="chatTitle" @click="loadMoreChat()" v-show="state.loadMoreChat && state.moreLoading">查看更多</div>
          <div v-show="!state.loadMoreChat && state.moreLoading">正在加载 <a-icon type="sync" spin /></div>
        </div>
        <div class="addIntendedUser-action">
          <a-button
            @click="state.chatRecordLoading = false"
            type="primary"
            style="background: #3764ff; border-color: #3764ff"
          >
            关闭
          </a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>
<script>
import { getRongPage, getRongChat } from '@/api/user'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
import moment, { Moment } from 'moment'

export default {
  name: 'ChatRecordList',
  components: { UserVipCell, OrderEvaluateDialog, UserDetailDialog, SingleAudioPlayer, UserCell },
  data() {
    return {
      loadPage: 1,
      chooseRecord: {},
      NewChatRecordList: [],
      data: [],
      search: '',
      searchContent: '',
      startDate: '',
      endDate: '',
      currentPlayRecord: '',
      currentUserId: 0,
      currentLawyerId: 0,
      currentOrder: {},
      dialogType: '',
      type: -1,
      state: {
        loading: false,
        userDialog: false,
        lawyerDialog: false,
        evaluateDialog: false,
        chatRecordLoading: false,
        loadMoreChat: true,
        moreLoading: true,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: (page) => {
          this.getRongPage(page)
          this.pagination.current = page
        },
      },
      rangePlaceholder: ['开始日期', '结束日期'],
      NewChatDate: '',
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition.search = this.search
      condition.startDate = this.startDate
      condition.endDate = this.endDate
      condition.type = this.type
      condition.page = this.pagination.current
      return condition
    },
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('orderListCondition'))) {
      const condition = JSON.parse(sessionStorage.getItem('orderListCondition'))
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.type = condition.type
      this.pagination.current = condition.page
      window.sessionStorage.removeItem('orderListCondition')
      this.getRongPage(condition.page)
    } else {
      this.getRongPage(1)
    }
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('orderListCondition', JSON.stringify(this.conditionData))
    },
    openEvaluate(order) {
      this.state.evaluateDialog = true
      this.currentOrder = order
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      if (type === 'user') {
        this.dialogType = 'user'
      } else {
        this.dialogType = 'lawyer'
      }
    },
    openLawyer(lawyerUserId) {
      this.state.lawyerDialog = true
      this.currentLawyerId = lawyerUserId
    },
    getSearchPage() {
      this.getRongPage(1)
    },
    getRongPage(page) {
      this.state.loading = true
      getRongPage(page, 0, '', '', this.searchContent, this.search, this.startDate, this.endDate)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    NewChatOnChange(data, value) {
      this.NewChatDate = value
      this.NewChatRecordList = []
      this.loadPage = 1
      this.loadMoreChat()
    },
    getNewChatRecord(page, record) {
      this.NewChatRecordList = []
      this.loadPage = 2
      this.chooseRecord = record
      this.NewChatDate = record.created_at.slice(0, 10)
      getRongChat(page, String(record.from_user.user_id), String(record.receive_user.user_id), this.NewChatDate).then(
        ({ data }) => {
          this.NewChatRecordList = data.data
          if (data.total <= 15) {
            this.state.moreLoading = false
          } else {
            this.state.moreLoading = true
          }
        }
      )
    },
    loadMoreChat() {
      this.state.loadMoreChat = false
      getRongChat(
        this.loadPage,
        String(this.chooseRecord.from_user.user_id),
        String(this.chooseRecord.receive_user.user_id),
        this.NewChatDate
      ).then(({ data }) => {
        if (data.total <= 15 * this.loadPage) {
          this.state.moreLoading = false
        } else {
          this.state.moreLoading = true
        }
        if (data.data.length === 0) {
          this.$message.success('没有更多的记录了')
          this.state.moreLoading = false
        } else {
          for (var i = 0, length = data.data.length; i < length; i++) {
            this.NewChatRecordList.push(data.data[i])
          }
          this.loadPage = this.loadPage + 1
        }
        this.state.loadMoreChat = true
      })
    },
    moment,
    onDateChange(date, dateString) {
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.getRongPage(1)
    },
    calculationTime(key) {
      const newTime = new Date(this.NewChatRecordList[key].created_at)
      let oldTime = 0
      if (key < this.NewChatRecordList.length - 1) {
        oldTime = new Date(this.NewChatRecordList[key + 1].created_at)
        const a = newTime.getTime() - oldTime.getTime()
        return a > 1800000 ? true : false
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    height: 90px;
    align-items: center;
    justify-content: space-between;

    &-select {
      margin-right: 20px;
      width: 120px;
    }

    input {
      width: 170px;
      margin-right: 20px;
    }

    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }

  .content {
    margin-top: 16px;
  }
}
.addIntendedUser {
  &-title {
    background: #ebeef5;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 48px;
    border-radius: 16px 8px 0 0;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 34px;
    color: #222222;
    opacity: 1;
  }
  &-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    max-height: 750px;
    overflow: auto;
    &-option {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      width: 100%;
      margin: 5px 0;
      span {
        width: 56px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
        margin-right: 20px;
        opacity: 1;
      }
      &-inputDiv {
        background: #f5f7fa;
        border: 1px solid #e1e6ee;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #9ea5ae;
        width: 300px;
        height: 32px;
        opacity: 1;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        align-content: center;
        padding: 0 10px;
      }
    }
  }
  &-action {
    height: 60px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    button {
      width: 178px;
      height: 36px;
    }
  }
}
.avatarDiv {
  img {
    width: 36px;
    height: 36px;
    border-radius: 18px;
  }
}
.chatTitle {
  background: #000724;
  opacity: 0.16;
  border-radius: 4px;
  cursor: pointer;
  color: #ffffff;
  padding: 5px 10px;
}
.leftUser {
  margin: 5px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.leftChatUser {
  max-width: 450px;
  width: auto;
  margin: 5px 0 0 5px;
  border-radius: 2px 12px 12px 12px;
  background: #dbe0eb;
  padding: 5px 10px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 20px;
  color: #222222;
  opacity: 1;
}
.rightUser {
  margin: 10px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.rightChatUser {
  max-width: 450px;
  width: auto;
  margin: 5px 5px 0 0;
  background: #3980ea;
  border-radius: 12px 2px 12px 12px;
  padding: 5px 10px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
  opacity: 1;
}
/deep/.ant-modal-close,
/deep/.ant-modal-header,
/deep/.ant-modal-footer {
  display: none;
}
/deep/.ant-modal-body {
  padding: 0;
}
/deep/.ant-modal-content {
  border-radius: 16px 8px 16px 8px;
}
</style>
