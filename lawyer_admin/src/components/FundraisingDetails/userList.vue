<template>
  <div>
    <a-row :gutter="[8, 16]">
      <a-col :span="24">
        <a-card>
          <a-col :span="6">
            <div @click="goList" style="width: 150px; cursor: pointer; color: #222222; font-size: 22px">
              <b>
                <span> ←<span>返回列表</span> </span>
              </b>
            </div>
          </a-col>
          <a-col :span="10">
            <user-vip-cell
              :nickname="detailstService.admin.nickname"
              :avatar="detailstService.admin.avatar"
              :mobile="detailstService.admin.mobile"
            />
          </a-col>
          <a-col :span="8" style="display: flex; align-items: center; justify-content: space-around">
            <a-button @click="openmodal(0)" size="small">选择当事人</a-button>

            <a-button @click="onServiceNumber" size="small" type="primary">发送认证</a-button>
          </a-col>
          <a-col :span="8" v-if="userData.litigant_user_nickname">
            <label>{{ userData.litigant_user_mobile }}({{ userData.litigant_user_nickname }})</label>
          </a-col>
          <a-col :span="8" v-else>
            <label v-if="serviceNumber === ''">请选择当事人</label>
            <label v-else>{{ serviceNumber }}({{ serviceName }})</label>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24" v-if="current !== 5 && current !== 10">
        <a-card :loading="state.loading">
          <a-col :span="18" style="cursor: pointer; color: #222222; font-size: 22px">
            <b>
              <span> 当事人 </span>
            </b>
          </a-col>
          <a-col :span="6">
            <div @click="openmodal(1)" style="color: #3980ea; cursor: pointer">
              添加站内律师 <a-icon type="plus-circle" />
            </div>
          </a-col>
          <div style="width: 100%; height: 300px; overflow: auto">
            <a-col
              :span="24"
              style="text-align: center; display: flex; flex-direction: row; align-items: center"
              v-for="(i, key) in lawyerList"
              :key="key"
            >
              <div style="width: 180px">
                <user-vip-cell
                  :nickname="i.nickname"
                  :avatar="i.avatar"
                  :user-id="i.lawyer_user_id"
                  :isCreator="i.is_creator"
                  :isLitigant="i.is_litigant"
                  :isAppointed="i.is_appointed"
                  @open="openUser"
                />
              </div>
              <div style="margin: 0 10px; width: 270px">
                <div style="width: 270px">
                  <label style="width: 70px">选择录音：</label>
                  <a-select style="width: 135px" @change="handleChange">
                    <a-select-option
                      v-for="j in i.records"
                      :key="j.created_at"
                      :value="j.record"
                      style="font-size: 7px"
                    >
                      {{ j.created_at }}
                    </a-select-option>
                  </a-select>
                  <a-button @click="openRecord">播放</a-button>
                </div>
                <div>
                  <label style="width: 70px">是否联系：</label>
                  <a-radio-group v-model="i.is_contacted" @change="chageRadio(i)" size="small">
                    <a-radio :value="1"> 已完成联系 </a-radio>
                    <a-radio :value="0"> 未联系 </a-radio>
                  </a-radio-group>
                </div>
              </div>
              <a-popconfirm ok-text="复制" cancel-text="关闭" @confirm="copyNumber">
                <div
                  class="DetailsBtn"
                  style="background: #2cbf78"
                  @click="getnumber(i.fundraising_registration_contact_id)"
                >
                  <img :src="iconList[0].url" style="width: 72px; height: 64px" />
                </div>
                <a-icon slot="icon" type="question-circle-o" style="color: #ffffff" />
                <input id="input" :value="LawyerNumber" slot="title" />
              </a-popconfirm>
              <create-conversation
                @func="getMsgFormSon"
                @uploadcurrent="uploadcurrent"
                v-if="i.is_creator === 0 && i.is_litigant === 0"
                :fundraisingRegistrationId="i.fundraising_registration_contact_id"
                :fundraisingRegistrationContactId="i.fundraising_registration_contact_id"
                :lawyerUserId="i.lawyer_user_id"
              />

              <div
                class="DetailsBtn"
                style="background: #ff9700; margin-left: 3px"
                v-if="i.is_creator === 0 && i.is_litigant === 0 && wtlsBtn === true"
              >
                <a-popconfirm
                  title="请确认是否委托该律师?"
                  ok-text="是的"
                  cancel-text="再想想"
                  @confirm="getAttorney(i)"
                  @cancel="cancelAttorney"
                >
                  <img :src="iconList[1].url" style="width: 72px; height: 64px" />
                </a-popconfirm>
              </div>

              <div
                class="DetailsBtn"
                style="background: #ff9700; margin-left: 3px"
                v-if="i.is_creator === 0 && i.is_litigant === 0 && wtlsBtn === false"
              >
                <img :src="iconList[2].url" style="width: 72px; height: 64px" />
              </div>
            </a-col>
          </div>
        </a-card>
      </a-col>
      <a-modal
        v-model="state.addlawyer"
        :title="modalTitle"
        @ok="addlawyer"
        width="720px"
        ok-text="确认"
        cancel-text="取消"
        @cancel="handleCancel"
      >
        <a-input-group compact>
          <a-input-search
            style="width: 30%; left: 70%; margin: 10px; padding: 10px"
            placeholder="请输入手机号/用户名"
            v-model="search"
            @search="onSearch"
          />
        </a-input-group>
        <a-table
          :row-selection="{ onChange: onSelectChange }"
          bordered
          :pagination="pagination"
          :loading="state.lawyerLoading"
          :data-source="LawyerData"
          :row-key="(record) => record.user_id"
        >
          <a-table-column key="index" align="center" title="序号">
            <template slot-scope="record">
              {{ record.index }}
            </template>
          </a-table-column>

          <a-table-column key="nickname" title="名字">
            <template slot-scope="record">
              <a-avatar :size="26" icon="user" :src="record.avatar" />
              <label>{{ record.nickname }}</label>
            </template>
          </a-table-column>
          <a-table-column key="mobile" align="center" title="电话号码">
            <template slot-scope="record">
              {{ record.mobile }}
            </template>
          </a-table-column>
        </a-table>
      </a-modal>
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
      <q-dialog v-model="state.userDialog">
        <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" />
      </q-dialog>
    </a-row>
  </div>
</template>

<script>
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import {
  getFundraisingLawyerNumber,
  postFundraisingLawyer,
  putFundraisingContacted,
  getFundraisingLawyerPage,
  getFundraisingLawyers,
  putFundraisingLawyerConfirm,
  postFundraisingDetailInit,
  postFundraisingMessage,
  putFundraisingRegistration,
  putFundraisingLitigant,
} from '@/api/fundraising'
import { getUserDialog } from '@/api/user'

export default {
  name: 'UserList',
  components: { UserVipCell, UserDetailDialog, SingleAudioPlayer },
  props: {
    newData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    condition: {
      type: Object,
      default: () => {
        return {}
      },
    },
    fundraisingProgressId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      lawyerList: [],
      search: '',
      addtype: null,
      userMobile: null,
      currentUserId: 0,
      LawyerData: [],
      lawyerUserIds: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          if (this.addtype === 0) {
            this.getUserDialog(page, this.search)
          } else {
            this.getFundraisingLawyerPage(page, this.search)
          }
          this.pagination.current = page
        },
      },
      radioValue: true,
      LawyerNumber: '',
      state: {
        LawyerNumber: false,
        loading: false,
        recordVisible: false,
        addlawyer: false,
        lawyerLoading: false,
        userDialog: false,
      },
      modalTitle: '',
      iconList: [
        {
          url: require('@/assets/Fundraising/dh_icon@2x.png'),
        },
        {
          url: require('@/assets/Fundraising/wtls_icon@2x.png'),
        },
        {
          url: require('@/assets/Fundraising/wtls1_icon@2x.png'),
        },
      ],
      radioValue0: 1,
      radioValue1: 1,
      newOrderData: [],
      currentPlayRecord: '',
      serviceNumber: '',
      serviceName: '',
      wtlsBtn: true,
      current: 0,
      detailstService: {},
    }
  },
  computed: {},
  watch: {
    immediate: true,
    newData(value) {
      this.newData = value
      // console.log('newData')
    },
  },
  created() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    // console.log('userList', this.detailstService)
    if (this.userData.litigant_user_id) {
      this.serviceNumber = this.userData.litigant_user_mobile
      this.serviceName = this.userData.litigant_user_nickname
    }
    this.detailstService = JSON.parse(sessionStorage.getItem('订单详情'))
    this.current = this.detailstService.status
    this.fundraisingRegistrationId = this.detailstService.fundraising_registration_id
    this.getFundraisingLawyers(this.fundraisingRegistrationId)
  },
  mounted() {},
  methods: {
    getFundraisingLawyers(fundraisingRegistrationId) {
      getFundraisingLawyers(fundraisingRegistrationId).then((data) => {
        this.lawyerList = data.data
        // console.log('律师列表', data.data)
        for (let i = 0; i < this.lawyerList.length; i++) {
          if (this.lawyerList[i].is_appointed === 1) {
            this.wtlsBtn = false
          }
        }
      })
    },
    getMsgFormSon(data) {
      this.$emit('fund', data)
    },
    uploadcurrent(data) {
      this.$emit('uploadcurrent', data)
    },
    goList() {
      const condition = this.condition
      this.$router.push({ name: 'FundraisingService', params: { condition } })
    },

    getnumber(id) {
      this.state.LawyerNumber = true
      // 获取律师列表后才有对应id：fundraisingRegistrationContactId
      // console.log(id)
      getFundraisingLawyerNumber(id).then((data) => {
        // console.log(data)
        this.LawyerNumber = data.data.mobile
      })
    },
    openRecord() {
      this.state.recordVisible = true
    },
    handleChange(value) {
      this.currentPlayRecord = value
    },
    chageRadio(i) {
      // 改变单选按钮触发事件
      // console.log(i.is_creator, i.is_litigant)
      putFundraisingContacted(i.fundraising_registration_contact_id, i.is_contacted)
        .then(() => {
          this.$message.success('修改成功')
          if (i.is_creator !== 0 || i.is_litigant !== 0) {
            //  this.$emit('uploadcurrent', 3)
            this.$store.commit('edit', { currentStep: 4, selectStep: 4 })
          }
        })
        .catch(() => {
          this.$message.error('修改失败')
          if (i.is_contacted === 0) {
            i.is_contacted = 1
          } else {
            i.is_contacted = 0
          }
        })
        .finally(() => {})
    },
    openmodal(addtype) {
      this.addtype = addtype
      if (addtype === 0) {
        this.state.addlawyer = true
        this.modalTitle = '选择用户'
        this.state.lawyerLoading = true
        this.getUserDialog(this.pagination.current, this.search)
      } else {
        this.modalTitle = '添加站内律师'
        this.state.addlawyer = true
        this.state.lawyerLoading = true
        this.getFundraisingLawyerPage(this.pagination, this.search)
      }
    },
    addlawyer() {
      if (this.addtype === 0) {
        this.serviceNumber = this.userMobile
        this.serviceName = this.userName
        this.state.addlawyer = false
        const userId = this.userId
        putFundraisingLitigant(this.fundraisingRegistrationId, userId).then(() => {
          this.$message.success('成功选择当事人')
        })
      } else {
        const lawyerUserIds = JSON.stringify(this.lawyerUserIds)
        postFundraisingLawyer(this.fundraisingRegistrationId, lawyerUserIds).then((data) => {
          this.state.addlawyer = false
          getFundraisingLawyers(this.fundraisingRegistrationId).then((data) => {
            this.lawyerList = data.data
          })
        })
      }
      this.search = ''
    },
    getAttorney(e) {
      // console.log(e)
      putFundraisingLawyerConfirm(this.fundraisingProgressId, e.lawyer_user_id).then(() => {
        this.$message.success('委托成功')
        postFundraisingDetailInit(this.fundraisingProgressId).then((data) => {
          // console.log(data)
          // this.$emit('uploadcurrent', 8)
          this.$store.commit('edit', { currentStep: 8, selectStep: 8 })
        })
      })
    },
    cancelAttorney() {
      this.$message.success('取消委托')
    },
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
    },
    getUserDialog(page, search) {
      getUserDialog(page, search)
        .then((data) => {
          this.LawyerData = data.data.data
          this.pagination.total = data.data.total
          this.pagination.pageSize = 6
          for (let i = 0; i < this.LawyerData.length; i++) {
            this.LawyerData[i].index = i + 1
          }
          // console.log('选择用户数据', this.LawyerData)
        })
        .finally(() => {
          this.state.lawyerLoading = false
        })
    },
    getFundraisingLawyerPage(page, search) {
      const prePage = this.pagination.pageSize
      // console.log(this.fundraisingRegistrationId)
      getFundraisingLawyerPage(page, search, this.fundraisingRegistrationId, prePage)
        .then((data) => {
          for (let i = 0; i < data.data.data.length; i++) {
            data.data.data[i]['index'] = i + 1
          }
          this.LawyerData = data.data.data
          this.pagination.total = data.data.total

          // console.log(this.LawyerData)
        })
        .finally(() => {
          this.state.lawyerLoading = false
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      if (this.addtype === 0) {
        if (selectedRows.length === 0) {
          // console.log('删除了选中的用户')
        } else {
          // console.log(selectedRows[0])
          this.userMobile = selectedRows[0].mobile
          this.userName = selectedRows[0].nickname
          this.userId = selectedRows[0].user_id
        }
      } else {
        this.lawyerUserIds = []
        for (let i = 0; i < selectedRows.length; i++) {
          this.lawyerUserIds[i] = selectedRows[i].user_id
        }
        // console.log(this.lawyerUserIds)
      }
    },
    onSearch(value) {
      if (this.addtype === 0) {
        this.getUserDialog(1, value)
      } else {
        this.getFundraisingLawyerPage(1, value)
      }
    },
    handleCancel() {
      this.search = ''
    },
    copyNumber() {
      var input = document.getElementById('input')
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('已复制！')
      } else {
        this.$message.error('复制失败！')
      }
    },
    onServiceNumber() {
      const Id = this.fundraisingRegistrationId
      const nickname = this.newData.nickname
      const mobile = this.newData.mobile
      const content = this.newData.content
      const images = this.newData.images
      if (
        this.userData.litigant_user_nickname === null ||
        this.userData.litigant_user_mobile === '' ||
        this.userData.content === null ||
        this.userData.images === []
      ) {
        const that = this
        that.$confirm({
          title: '请确认是否保存当事人信息?',
          okText: '保存',
          cancelText: '取消',
          onOk() {
            if (images.length === 0) {
              that.$message.error('请上传案件经过图片')
            } else {
              putFundraisingRegistration(Id, nickname, mobile, content, JSON.stringify(images)).then((data) => {
                // console.log(data)
                that.userData.litigant_user_nickname = nickname
                that.userData.litigant_user_mobile = mobile
                that.userData.content = content
                that.userData.images = images
                that.$message.success('保存成功')
                // location.reload()
              })
            }
          },
          onCancel() {},
          class: 'test',
        })
      } else {
        const serviceNumber = String(this.serviceNumber)
        postFundraisingMessage(this.fundraisingRegistrationId, serviceNumber)
          .then(() => {
            this.$message.success('提醒成功')
            //  this.serviceNumber = ''
          })
          .catch(() => {
            this.$message.warning('请确认发送认证的号码')
          })
      }
    },
  },
}
</script>
 <style scoped lang="less">
/deep/.ant-modal-content {
  width: 800px;
}

.DetailsBtn {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 72px;
  height: 64px;
  color: white;
  opacity: 1;
  border-radius: 4px;
  margin-right: 3px;
}
</style>
