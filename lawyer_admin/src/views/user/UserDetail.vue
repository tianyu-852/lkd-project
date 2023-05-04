<template>
  <div>
    <div class="top">
      <a-card class="top-left">
        <div class="top-left-container">
          <div class="top-title">
            <div @click="goList">
              <span>
                ←
                <span>用户资料</span>
              </span>
            </div>
          </div>

          <div class="top-info" v-for="userItem in userArray" :key="userItem.title">
            <span>{{ userItem.title }}：</span>
            <router-link
              v-if="userItem.title === '用户余额'"
              :to="{ name: 'moneyDetail', path: '/money/detail', query: { id: String($route.params.userId) } }"
            >
              {{ userItem.value }}
            </router-link>
            <span v-else>{{ userItem.value }}</span>

            <a-popconfirm
              title="请确认是否退款"
              ok-text="确认"
              cancel-text="取消"
              @confirm="userRefund"
              v-show="userData.is_vip === 1 && userItem.title === '会员类型'"
            >
              <a-button type="danger" size="small" style="margin: 10px"> 退 款 </a-button>
            </a-popconfirm>
          </div>

          <div class="top-good-at flex-column-center">
            <span>个人简介：</span>
          </div>

          <div class="top-introduction">
            <span>
              {{
                userData.introduction ? userData.introduction.substr(0, 50) + (isShowDetail ? '...' : '') : '暂无简介'
              }}
            </span>
            <a-button
              type="link"
              size="small"
              v-if="userData.introduction ? isShowDetail : false"
              @click="state.introductionVisible = true"
            >
              查看详情
            </a-button>

            <a-modal v-model="state.introductionVisible" title="用户简介" @ok="state.introductionVisible = false">
              <p>{{ userData.introduction }}</p>
            </a-modal>
          </div>
        </div>
      </a-card>

      <a-card class="top-right">
        <span>用户数据：</span>

        <div class="top-right-item">
          <div class="top-right-item-label">发帖</div>
          <a-progress type="line" :strokeWidth="20" :percent="questionPercentage" strokeColor="#5C90F9">
            <template #format>
              <span class="margin-left-8">{{ userData.question_number }}</span>
            </template>
          </a-progress>
        </div>

        <div class="top-right-item">
          <div class="top-right-item-label">咨询</div>
          <a-progress type="line" :strokeWidth="20" :percent="orderPercentage" strokeColor="#FFC64A">
            <template #format>
              <span class="margin-left-8">{{ userData.order_number }}</span>
            </template>
          </a-progress>
        </div>
      </a-card>
    </div>
    <a-card style="margin-top: 16px; padding: 6px 56px 6px 16px" v-if="userData.is_auth === 1">
      <div class="enterpriseTitle">
        <img :src="require('@/assets/common/gx1_icon_sel@2x.png')" />
        已认证企业用户
      </div>
      <div class="enterprise">
        <div class="enterprise-data">
          <div class="enterprise-data-value" style="border-bottom: 1px solid #ebeef5">
            <div
              class="enterprise-data-value-option"
              v-for="(userItem, key) in enterpriseArray"
              :key="key"
              v-show="key < 3"
            >
              <span>{{ userItem.title }}：</span>
              <span>{{ userItem.value }}</span>
            </div>
          </div>
          <div class="enterprise-data-value">
            <div
              class="enterprise-data-value-option"
              v-for="(userItem, key) in enterpriseArray"
              :key="key"
              v-show="key > 2"
              :style="key === 4 ? 'width:66%' : ''"
            >
              <span>{{ userItem.title }}：</span>
              <span>{{ userItem.value }}</span>
            </div>
          </div>
        </div>
        <img class="enterprise-image" :src="userData.user_enterprise.business_license_image" @click="showImage()" />
      </div>
    </a-card>

    <a-card class="content">
      <a-tabs default-active-key="1">
        <!-- 发帖列表 -->
        <a-tab-pane key="1" tab="发帖列表">
          <user-question-table :user-id="String($route.params.userId)" />
        </a-tab-pane>
        <!-- 评论列表 -->
        <a-tab-pane key="2" tab="评论列表">
          <UserCommentTable :user-id="String($route.params.userId)" />
        </a-tab-pane>
        <!-- 订单列表 -->
        <a-tab-pane key="3" tab="订单列表">
          <user-order-table :user-id="String($route.params.userId)" />
        </a-tab-pane>
        <!-- 电话咨询列表 -->
        <a-tab-pane key="4" tab="电话咨询列表">
          <!-- 表格 -->
          <a-table
            :data-source="tableDataList"
            :loading="tableDataLoading"
            :pagination="pagination"
            :rowKey="(record) => String(record.order_no)"
            bordered
          >

            <!-- 律师 -->
            <a-table-column dataIndex="lawyer.nickname" title="律师" align="center" />

            <!-- 订单时间 -->
            <a-table-column dataIndex="created_at" title="订单时间" align="center" />

            <!-- 订单类型 -->
            <a-table-column dataIndex="category" title="订单类型" align="center" />

            <!-- 费用 -->
            <a-table-column dataIndex="money_real" title="费用" align="center" />

            <!-- 订单状态 -->
            <a-table-column dataIndex="status_chinese" title="订单状态" align="center" />

            <!-- 录音 -->
            <a-table-column align="center" title="录音" width="170px">
              <template slot-scope="record">
                <a-select style="width: 100px;" v-model="tableDataList[record.index].activeRecord">
                  <a-select-option v-for="sItem in record.calls" :value="sItem.record_path" :key="sItem.record_path">
                    {{ sItem.duration }}秒
                  </a-select-option>
                </a-select>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center">
              <template slot-scope="record">
                <a-button type="link" :loading="record.voiceTranslateLoading" style="padding: 0; margin-right: 5px;" @click="translateVoice(record)">翻译</a-button>
                <a-button type="link" style="padding: 0; margin-right: 5px;" @click="playVoice(record)">播放</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 聊天记录 -->
        <a-tab-pane key="5" tab="聊天记录">
          <!-- 表格 -->
          <a-table
            :data-source="chatTableDataList"
            :loading="chatTableDataLoading"
            :pagination="chatPagination"
            :rowKey="(record) => String(record.rong_message_id)"
            bordered
          >

            <!-- 私信对象 -->
            <a-table-column title="私信对象" align="center">
              <template slot-scope="record">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap;" >
                  <user-vip-cell
                    :nickname="record.receive_user.nickname"
                    :avatar="record.receive_user.avatar"
                    :mobile="record.receive_user.call_mobile"
                    :user-id="String(record.receive_user.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 时间 -->
            <a-table-column dataIndex="created_at" title="时间" align="center" />

            <!-- 内容 -->
            <a-table-column dataIndex="content" title="内容" align="center" />
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <ImageViewer ref="ImageViewer" :images="showImageList" />

    <!-- 语音翻译 modal -->
    <voice-translate-modal ref="voiceTranslateModalRef" />
    <!-- audio hidden -->
    <audio ref="audioRef" controls="controls" src="" id="audio" hidden />
  </div>
</template>

<script>
import UserVipCell from '@/components/User/UserVipCell'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import ImageViewer from '@/components/Image/ImageViewer'
import { getUserDetail, getUserVipRefund } from '@/api/user'
import * as userApi from '@/api/user'
import UserOrderTable from '@/components/User/Table/UserOrderTable'
import UserQuestionTable from '@/components/User/Table/UserQuestionTable'
import UserCommentTable from '@/components/User/Table/UserCommentTable.vue'
import voiceTranslateModal from '@/components/voice-translate-modal/voice-translate-modal'

export default {
  name: 'UserDetail',
  components: { UserQuestionTable, UserOrderTable, ImageViewer, SingleAudioPlayer, UserCell, UserVipCell, UserCommentTable, voiceTranslateModal },
  computed: {
    isShowDetail() {
      return this.userData.introduction.length > 50
    },
    enterpriseArray() {
      return [
        {
          title: '使用人员',
          value: this.userData.user_enterprise.nickname,
        },
        {
          title: '手机号码',
          value: this.userData.user_enterprise.mobile,
        },
        {
          title: '执业机构',
          value: this.userData.user_enterprise.credit_code,
        },
        {
          title: '公司名称',
          value: this.userData.user_enterprise.principal_real_name,
        },
        {
          title: '企业地址',
          value: this.userData.user_enterprise.address,
        },
      ]
    },
    userArray() {
      return [
        {
          title: '用户昵称',
          value: this.userData.nickname,
        },
        {
          title: '手机号码',
          value: this.userData.mobile,
        },
        {
          title: '所在城市',
          value: this.userData.address,
        },
        {
          title: '会员类型',
          value: this.userData.vip_name,
        },
        {
          title: '用户余额',
          value: this.userData.balance + '元',
        },
        {
          title: 'APP版本',
          value: this.userData.current_app_version,
        },
        {
          title: '设备类型',
          value: this.userData.location_device_type,
        },
      ]
    },
    sortArray() {
      return [
        {
          title: '默认排序',
          value: '',
        },
        {
          title: '按最近下单排序',
          value: 0,
        },
        {
          title: '按最近完成排序',
          value: 1,
        },
      ]
    },
    questionPercentage() {
      return (this.userData.question_number / (this.userData.question_number + this.userData.order_number)) * 100
    },
    orderPercentage() {
      return (this.userData.order_number / (this.userData.question_number + this.userData.order_number)) * 100
    },
    tabStatusText() {
      if (this.tabStatus === 0) {
        return '切换订单列表'
      }

      return '切换社区列表'
    },
  },
  data() {
    return {
      state: {
        introductionVisible: false,
        recordVisible: false,
        detailLoading: false,
        loading: false,
      },
      showImageList: [],
      tabStatus: 0,
      userData: {
        nickname: '12312',
        avatar: 'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/108040_c842fb6392d7eac676b1514086d1e9d1.jpg',
        mobile: '18958904395',
        introduction:
          '彭春光公司律师\n30余年非诉讼法律事务及民事诉讼法律事务经验，每年三百余件非诉讼法律事务案例，五十余件诉讼法律事务案例，相信您的选择！\n本律师奉行：\n受人之托忠人之事，道德道义专业精神！',
        location_address: '浙江省温州市',
        enterprise_vip: {
          title: '',
        },
        question_number: 3,
        order_number: 14,
        is_auth: 0,
        user_enterprise: {
          principal_real_name: null,
          mobile: '18958904395',
          credit_code: null,
          nickname: '12312',
          address: null,
        },
      },

      tableDataList: [], // 电话咨询table 列表
      tableDataLoading: true, // 数据是否加载中
      // 电话咨询分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getPhoneConsultOrderList(page)
          this.pagination.current = page
        },
      },

      chatTableDataList: [], // 聊天 table 列表
      chatTableDataLoading: true, // 数据是否加载中
      // 聊天分页器
      chatPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getUserChatRecordList(page)
          this.chatPagination.current = page
        },
      },
    }
  },
  created() {
    this.getUserDetail()
    this._getPhoneConsultOrderList()
    this._getUserChatRecordList()
  },
  methods: {
    goList() {
      console.log(1)
      let condition = {}
      condition = JSON.parse(sessionStorage.getItem('userListCondition'))
      if (condition) {
        this.$router.push({ name: condition.fromType })
        console.log(condition)
      } else {
        this.$router.back(-1)
      }
    },
    getUserDetail() {
      this.state.detailLoading = true
      getUserDetail(String(this.$route.params.userId))
        .then(({ data }) => {
          this.userData = data
          console.log(data)
        })
        .finally(() => {
          this.state.detailLoading = false
        })
    },
    userRefund() {
      getUserVipRefund(this.$route.params.userId).then(() => {
        this.$message.success('已退款')
        this.getUserDetail()
      })
    },
    showImage() {
      this.showImageList.push(this.userData.user_enterprise.business_license_image)
      this.$refs.ImageViewer.show()
    },

    /**
     * 获取用户电话咨询列表
     */
     async _getPhoneConsultOrderList(page = 1) {
       const param = { user_id: this.$route.params.userId,  page }
       this.tableDataLoading = true

       try {
         const { data: phoneConsultOrderData } = await userApi.getUserPhoneConsultListApi(param)
         const exceptionOrderItems = phoneConsultOrderData.data.map((item, index) => {
          item.index = index
          item.activeRecord = ''
          item.voiceTranslateLoading = false
          return item
         })

         this.tableDataList = exceptionOrderItems
         this.pagination.total = phoneConsultOrderData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取用户聊天记录列表
     */
     async _getUserChatRecordList(page = 1) {
       const param = { page, from_user_id: this.$route.params.userId, recv_user_id: 0 }
       this.chatTableDataLoading = true

       try {
         const { data: chatRecordData } = await userApi.getUserChatRecordListApi(param)
         this.chatTableDataList = chatRecordData.data
         this.chatPagination.total = chatRecordData.total
         this.chatPagination.current = page
         this.chatTableDataLoading = false
       } catch (error) {
         this.chatTableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 翻译语音
     */
    async translateVoice(record) {
      const voiceUrl = record.activeRecord
      if (!voiceUrl) return this.$message.warning('请先选择录音文件')
      this.tableDataList[record.index].voiceTranslateLoading = true
      await this.$refs.voiceTranslateModalRef.translateVoiceFile(voiceUrl)
      this.tableDataList[record.index].voiceTranslateLoading = false
    },

    /**
     * 播放语音
     */
    playVoice(record) {
      const voiceUrl = record.activeRecord
      if (!voiceUrl) return this.$message.warning('请先选择录音文件')

      this.$refs.audioRef.src = voiceUrl
      this.$refs.audioRef.load()
      this.$refs.audioRef.play()
    }
  },
}
</script>

<style lang="less" scoped>
.top {
  width: 100%;
  height: auto;
  display: flex;

  .top-left {
    width: 60%;
    margin-right: 19px;
    height: 100%;

    .top-left-container {
      display: grid;
      grid-template-columns: repeat(3, 33.33%);
      grid-template-rows: repeat(5, 52px);

      .top-title {
        display: flex;
        justify-content: space-between;
        grid-column-start: 1;
        grid-column-end: 4;

        div:first-child {
          cursor: pointer;

          span {
            font-size: 18px;
            font-weight: 800;
            line-height: 30px;
            color: #222222;
          }
        }
      }

      .top-info {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ebeef5;

        .span-style();
      }

      .top-good-at {
        grid-column-start: 1;
        grid-column-end: 4;
        .span-style();
      }

      .top-introduction {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 6;
        grid-row-end: 8;
        background: #eff1f5;
        border-radius: 4px;
        overflow: hidden;
        padding: 16px 20px;
      }
    }
  }

  .top-right {
    width: 40%;
    padding: 5px 10px;

    &-item {
      margin-top: 50px;
      display: flex;
      align-items: center;

      &-label {
        width: 55px;
        font-size: 16px;
        font-weight: 800;
        color: #222222;
      }
    }

    span {
      font-size: 18px;
      font-weight: 800;
      line-height: 30px;
      color: #222222;
      opacity: 1;
    }
  }

  .span-style {
    span {
      &:first-child {
        font-size: 16px;
        font-weight: 800;
        line-height: 25px;
        color: #222222;
        opacity: 1;
      }

      &:last-child {
        font-size: 16px;
        font-weight: bold;
        line-height: 25px;
        color: #787e8d;
        opacity: 1;
      }
    }
  }
}

.content {
  margin-bottom: 16px;
  margin-top: 16px;

  &-tab {
    margin-bottom: 16px;
    width: 150px;
    height: 30px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 800;
    line-height: 30px;
    color: #222222;
    opacity: 1;
  }
}

.page {
  float: right;
}
.enterpriseTitle {
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 800;
  color: #222222;
  opacity: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: nowrap;
  img {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
}
.enterprise {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  &-data {
    width: calc(100% - 297px);
    &-value {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      align-content: center;

      &-option {
        width: 33%;
        margin: 20px 0;
        span {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 800;
          line-height: 0px;
          color: #222222;
          opacity: 1;
        }
        span:last-child {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 0px;
          color: #787e8d;
          opacity: 1;
        }
      }
    }
  }
  &-image {
    width: 277px;
    height: 166px;
    background: #c2ccdc;
    opacity: 1;
    border-radius: 8px;
    margin-left: 20px;
    cursor: pointer;
  }
}
</style>
