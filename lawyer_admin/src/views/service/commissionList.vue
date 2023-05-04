<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div>
        <span class="focus-text">总提成：￥{{ total_commission_money }}</span>
        <span class="focus-text">总用户数：{{ pagination.total }}</span>
        <a-input
          allow-clear
          placeholder="搜索用户名/手机号"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 0 5px"
        />
        <a-button type="primary" @click="getSearchPage">搜索</a-button>
      </div>
      <div>
        <a-range-picker
          @change="onDateChange"
          :placeholder="rangePlaceholder"
          style="width: 340px; margin: 0 5px"
          :default-value="[startDate, endDate]"
          format="YYYY-MM-DD HH:mm:ss"
          :show-time="{
            hideDisabledOptions: true,
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
          }"
        />
        <a-popconfirm title="请确认是否导出?" ok-text="导出" cancel-text="取消" @confirm="exportFile">
          <a-button style="margin: 0 5px; background: #2cbf78; border-color: #2cbf78; color: #ffffff">
            导出分配结果
          </a-button>
        </a-popconfirm>

        <a-button type="primary" style="margin: 0 5px" @click="getServiceSetting(1)">绑定未注册用户</a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <a-table
        :data-source="commissionData"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => String(record.user_customer_service_customer_id)"
      >
        <!-- 用户信息 -->
        <a-table-column key="user" title="用户信息" align="center">
          <template slot-scope="record">
            <div class="user-info-wrap">
              <user-vip-cell
                :nickname="record.nickname"
                :avatar="record.avatar"
                :mobile="record.mobile"
                :user-id="String(record.user_id)"
                size="sm"
                @open="openUser(String(record.user_id), 'user')"
              />
              <!-- call按钮 -->
              <!-- <div class="call-wrap" @click="callPhone(record)">
                <img class="call-img" :src="require('@/assets/service/call-phone.png')" />
              </div> -->
            </div>
          </template>
        </a-table-column>
        <!-- 注册时间/地点 -->
        <a-table-column key="created_at" align="center">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>注册时间/地点</span>
            <span>
              最近活跃时间
              <a-select style="width: 70px" v-model="loginSortType" @change="getSearchPage">
                <a-select-option v-for="type in sortList" :value="type.value" :key="type.label">
                  {{ type.label }}
                </a-select-option>
              </a-select>
            </span>
          </div>
          <template slot-scope="record">
            注册时间： {{ record.created_at }}{{ record.created_at && record.register_district ? ' | ' : '' }}
            {{ record.register_district }}
            <br />
            活跃时间： {{ record.active_at }}
            <!-- {{ record.active_at && record.register_district ? ' | ' : '' }}
            {{ record.register_district }} -->
          </template>
        </a-table-column>
        <!-- 会员类型 -->
        <a-table-column key="commission_vip_id" align="center">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>会员类型</span>
            <a-select style="width: 120px" v-model="membershipType" @change="getSearchPage">
              <a-select-option v-for="type in membershipTypes" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            <span>
              {{
                record.commission_vip_id === 7
                  ? '优享版年卡'
                  : record.commission_vip_id === 8
                    ? '月卡'
                    : record.commission_vip_id === 9
                      ? '年卡'
                      : record.commission_vip_id === 10
                        ? '尊享版年卡'
                        : '未开通'
              }}
            </span>
            <br />
            <span v-show="record.is_vip">{{ record.vip_new_time }}-{{ record.vip_expired_time }}</span>
          </template>
        </a-table-column>
        <!-- 提成金额(元) -->
        <a-table-column key="commission_money" title="提成金额(元)" align="center">
          <template slot-scope="record">
            {{ record.commission_money }}
          </template>
        </a-table-column>
        <!-- 意向程度 -->
        <a-table-column key="intention_status" align="center">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>意向程度</span>
            <a-select style="width: 80px" v-model="degreeType" @change="getSearchPage">
              <a-select-option v-for="type in degreeTypes" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            <a-select style="width: 80px" v-model="record.intention_status" @change="putServiceIntention(record)">
              <a-select-option v-for="type in degreeOptionTypes" :value="type.value" :key="type.label">
                <span> {{ type.label }}</span>
              </a-select-option>
            </a-select>
          </template>
        </a-table-column>
        <!-- 状态标签 -->
        <a-table-column key="progress_status" align="center">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>状态标签</span>
            <a-select style="width: 100px" v-model="statusType" @change="getSearchPage">
              <a-select-option v-for="type in statusTypes" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            <a-select style="width: 100px" v-model="record.progress_status" @change="putProgress(record)">
              <a-select-option
                v-for="type in statusTypes"
                :value="type.value"
                :key="type.label"
                :disabled="type.value === -1"
              >
                <span v-if="type.value !== -1"> {{ type.label }}</span>
              </a-select-option>
            </a-select>
          </template>
        </a-table-column>
        <!-- 文字备注 -->
        <a-table-column key="remark" title="文字备注" align="center">
          <template slot-scope="record">
            <TextWithRowButton :text="record.remark" :overMax="10" />
            <a
              v-if="record.remark"
              @click=";(state.addRemarks = true), (chooseData = record), (addContent = record.remark)"
            >
              修改备注
            </a>
            <a v-else @click=";(state.addRemarks = true), (chooseData = record)">添加备注</a>
          </template>
        </a-table-column>
        <!-- 当前负责客服 -->
        <a-table-column key="service">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>当前负责客服</span>
            <a-select v-show="this.isCustomer" style="width: 70px" v-model="serviceType" @change="getSearchPage">
              <a-select-option v-for="type in AllServiceList" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            {{ record.service }}
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" :mode="dialogType" @close="state.userDialog = false" />
    </q-dialog>

    <a-modal v-model="state.addRemarks">
      <div class="addIntendedUser">
        <div class="addIntendedUser-title">
          <span>{{ chooseData ? '修改备注' : '添加备注' }}</span>
        </div>
        <div class="addIntendedUser-main">
          <a-textarea v-model="addContent" placeholder="请输入添加的备注信息" :auto-size="{ minRows: 4 }" />
        </div>
        <div class="addIntendedUser-action">
          <a-button @click=";(state.addRemarks = false), (addContent = '')"> 取消 </a-button>
          <a-button type="primary" style="background: #3764ff; border-color: #3764ff" @click="determineAdd()">
            确定
          </a-button>
        </div>
      </div>
    </a-modal>

    <a-modal v-model="state.unregisteredLoading">
      <div class="addIntendedUser">
        <div class="addIntendedUser-title">
          <span> 绑定未注册用户 </span>
        </div>
        <div class="addIntendedUser-main">
          <div>
            <span style="width: 100px"> 用户姓名：</span>
            <a-input style="width: 300px" v-model="newUser.nickname"></a-input>
          </div>
          <div>
            <span style="width: 100px"> 用户号码：</span>
            <a-input style="width: 300px" v-model="newUser.mobile"></a-input>
          </div>
          <div>
            <span style="width: 100px"> 负责客服：</span>
            <a-select ref="select" style="width: 300px" placeholder="请选择接收转移客服" v-model="newUser.service">
              <a-select-option :value="String(i.user_id)" v-for="(i, key) in serviceList" :key="key">
                {{ i.nickname }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="addIntendedUser-action">
          <a-button @click=";(state.unregisteredLoading = false), (addContent = '')"> 取消 </a-button>
          <a-button type="primary" style="background: #3764ff; border-color: #3764ff" @click="determineBind()">
            确定
          </a-button>
        </div>
      </div>
    </a-modal>
    
    <!-- 阿里云呼 -->
    <!-- <div class="workbench-module">
      <div class="workbench-wrap">
        <div id="workbench"></div>
      </div>

      <div class="open-workbench-btn" @click="handleWBDisplay">云呼</div>
    </div> -->
  </a-layout>
</template>

<script>
import {
  getServicePage,
  putServiceRemark,
  putServiceIntention,
  putServiceProgress,
  getServiceSetting,
} from '@/api/service'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import axios from 'axios'
import moment, { Moment } from 'moment'

import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'CommissionList',
  components: { UserVipCell, UserDetailDialog, SingleAudioPlayer, UserCell, TextWithRowButton },
  data() {
    return {
      newUser: {
        nickname: '',
        mobile: '',
        service: '',
      },
      loginSortType: 1,
      serviceType: -1,
      AllServiceList: [
        {
          label: '全部',
          value: -1,
        },
      ],
      isCustomer: true,
      serviceList: [],
      total_commission_money: '',
      chooseData: {},
      addContent: '',
      membershipType: -1,
      degreeType: -1,
      statusType: -1,
      commissionData: [], // 用户数据列表
      search: '',
      startDate: '',
      endDate: '',
      currentUserId: 0,
      dialogType: '',
      type: -1,
      state: {
        loading: false,
        userDialog: false,
        addRemarks: false,
        unregisteredLoading: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: (page) => {
          this.getServicePage(page, this.search)
          this.pagination.current = page
        },
      },
      rangePlaceholder: ['开始日期', '结束日期'],

      workbenchBorderShowStatus: false, // 云呼叫工作平台弹框是否显示
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition.search = this.search
      condition.startDate = this.startDate
      condition.endDate = this.endDate
      condition.membershipType = this.membershipType
      condition.degreeType = this.degreeType
      condition.page = this.pagination.current
      condition.statusType = this.statusType
      return condition
    },
    statusTypes() {
      return [
        {
          label: '全部',
          value: -1,
        },
        {
          label: '未联系',
          value: 0,
        },
        {
          label: '未接通',
          value: 1,
        },
        {
          label: '已联系',
          value: 2,
        },
        {
          label: '已加微信',
          value: 3,
        },
      ]
    },
    degreeOptionTypes() {
      return [
        {
          label: '未联系',
          value: 0,
        },
        {
          label: '无意向',
          value: 1,
        },
        {
          label: '低意向',
          value: 2,
        },
        {
          label: '中意向',
          value: 3,
        },
        {
          label: '高意向',
          value: 4,
        },
      ]
    },
    degreeTypes() {
      return [
        {
          label: '全部',
          value: -1,
        },
        {
          label: '无意向',
          value: 1,
        },
        {
          label: '低意向',
          value: 2,
        },
        {
          label: '中意向',
          value: 3,
        },
        {
          label: '高意向',
          value: 4,
        },
      ]
    },
    membershipTypes() {
      return [
        {
          label: '全部',
          value: -1,
        },
        {
          label: '优享版年卡',
          value: 7,
        },
        {
          label: '月卡',
          value: 8,
        },
        {
          label: '年卡',
          value: 9,
        },
        {
          label: '尊享版年卡',
          value: 10,
        },
      ]
    },
    sortList() {
      return [
        {
          label: '默认',
          value: 1,
        },
        {
          label: '倒序',
          value: 2,
        },
        {
          label: '正序',
          value: 3,
        },
      ]
    },
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('orderListCondition'))) {
      const condition = JSON.parse(sessionStorage.getItem('orderListCondition'))
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.membershipType = condition.membershipType
      this.degreeType = condition.degreeType
      this.pagination.current = condition.page
      this.statusType = condition.statusType
      window.sessionStorage.removeItem('orderListCondition')
      this.getServicePage(condition.page, this.search)
    } else {
      this.getServicePage(1, '')
    }
    this.getAllServiceList()
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
    // this.initWorkBench()
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    moment,
    beforeunloadFn(e) {
      sessionStorage.setItem('orderListCondition', JSON.stringify(this.conditionData))
    },
    /**
     * 打开用户/律师详情弹框
     */
    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      if (type === 'user') {
        this.dialogType = 'user'
      } else {
        this.dialogType = 'lawyer'
      }
    },
    getSearchPage() {
      this.getServicePage(1)
    },
    /**
     * 获取用户列表
     */
    getServicePage(page) {
      this.state.loading = true
      getServicePage(
        this.statusType,
        page,
        this.membershipType,
        this.degreeType,
        this.search,
        this.loginSortType,
        this.serviceType,
        this.startDate,
        this.endDate
      )
        .then((data) => {
          this.pagination.total = data.data.total
          this.commissionData = data.data.data
          this.total_commission_money = data.data.total_commission_money
          this.isCustomer = data.data.is_customer === 0 ? true : false
          
          this.AllServiceList = [{ label: '全部', value: '-1' }]
          for (var i = 0, length = data.data.all_customer.length; i < length; i++) {
            const a = {
              label: data.data.all_customer[i].nickname,
              value: String(data.data.all_customer[i].customer_user_id),
            }
            this.AllServiceList.push(a)
          }
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    getAllServiceList() {
      // 获取所有客服列表
    },
    onDateChange(date, dateString) {
      this.startDate = dateString[0]
      this.endDate = dateString[1]
    },
    determineAdd() {
      this.state.addRemarks = false
      putServiceRemark(this.addContent, String(this.chooseData.user_customer_service_customer_id)).then((data) => {
        this.addContent = ''
        this.$message.success('成功添加备注')
        this.getServicePage(1, '')
      })
    },
    /**
     * 导出文件
     */
    exportFile() {
      if (this.startDate && this.endDate) {
        axios({
          url: process.env.VUE_APP_API_BASE_URL + '/web/user/customer/service/excel',
          methods: 'get',
          params: {
            start_time: this.startDate,
            end_time: this.endDate,
          },
          responseType: 'blob',
          headers: {
            Authorization: this.$store.getters.token,
            'X-Timestamp': new Date().getTime().toString().substr(0, 10),
            'X-Nonce': Math.random().toString(36).slice(-10),
            'X-Api-Version': 'v1',
            'X-Device-Type': 'admin',
          },
        }).then(response => {
          console.log(response)

          if (response.data.type === 'application/json') {
            const reader = new FileReader()
            reader.readAsText(response.data, 'utf-8')
            reader.onload = () => {
              this.$message.error(JSON.parse(reader.result).message)
            }
          } else {
            const name = this.startDate + '-' + this.endDate
            var blob = new Blob([response.data], {
              type: 'application/zip',
            })
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob)
            downloadElement.href = href
            downloadElement.download = name
            document.body.appendChild(downloadElement)
            downloadElement.click()
            document.body.removeChild(downloadElement)
            window.URL.revokeObjectURL(href)
          }
        })
      } else {
        this.$message.error('请选择一个时间区间')
      }
    },
    putServiceIntention(record) {
      putServiceIntention(record.intention_status, record.user_customer_service_customer_id).then((data) => {
        this.$message.success('成功修改意向程度')
        this.getServicePage(1, '')
      })
    },
    putProgress(record) {
      putServiceProgress(record.progress_status, record.user_customer_service_customer_id).then((data) => {
        this.$message.success('成功修改状态标签')
        this.getServicePage(1, '')
      })
    },
    getServiceSetting() {
      this.state.unregisteredLoading = true
      getServiceSetting(1).then((data) => {
        console.log(data)
        this.serviceList = data.data.data
      })
    },
    determineBind() {
      console.log(this.newUser)
      this.state.unregisteredLoading = false
      this.getServicePage(1, '')
    },
    /**
     * 云呼相关初始化
     */
    initWorkBench() {
      const _this = this
      // 处理请求源
      const ajaxOrigin = process.env.NODE_ENV === 'production' ? 'https://api.lawkd.com' : 'https://devapi.lawkd.com'
      window.workbench = new window.WorkbenchSdk({
        dom: 'workbench', // 挂载的元素
        width: '200px', // 面板的宽
        height: '460px', // 面板的高
        instanceId: 'lvkuaida',
        regionId: 'cn-shanghai', // 云呼服务器部署的集群
        ajaxOrigin: ajaxOrigin, // 请求源
        ajaxPath: '/api/web/ali/cloud/call', // 请求路径
        ajaxMethod: 'post', // 请求方式
        ajaxHeaders: {
          'X-Device-Type': 'admin',
          'X-Api-Version': 'v1',
          'X-Nonce': Math.random().toString(36).slice(-10),
          'X-Timestamp': new Date().getTime().toString().substr(0, 10),
          'Authorization': storage.get(ACCESS_TOKEN),
        },
        afterCallRule: 15,  // 挂机后的话后处理时间
        header: false, // 是否展示头部
        defaultVisible: false, // 默认是否展示面板
        useOpenApiSdk: false,
        exportErrorOfApi: true, // Toast提示接口的错误信息
        moreActionList: ['mobilePhoneAnswer', 'break', 'offline'],
        // sideNavList: ['呼入', '呼出', '通话记录', '转接', '监听', '我的工作', '设备检测', '设置'],
        sideNavList: ['呼入', '呼出', '通话记录', '设备检测', '设置'],
        // SDK对象实例化完成时触发
        onInit() {
          console.log('onInit')
          window.workbench.register() // 想实现自动上线在此注册
          window.workbench.changeVisible(true) // 可以实现初始化后显示面板
          _this.workbenchBorderShowStatus = true
        },
        // 签入、上线时触发
        onLogIn() {
          console.log('上线成功')
        },
        // 当有一些错误信息的时候触发，可以获取error信息
        onErrorNotify(error) {
          console.log(error)
        },
        // 来电时触发，可以在该函数内获取到一个对象
        onCallComing(connid) {
          console.log('来电:', connid)
        },
        // 去电、拨号振铃时触发，可以在该函数内获取到一个对象
        onCallDialing(connid) {
          console.log('去电:', connid)
        },
        // 任何状态改变都会触发该函数
        onStatusChange(code) {
          console.log('任何状态改变:', code)
        },
        // 通话建立连接时触发
        onCallEstablish(callDetail) {
          console.log('通话建立连接:', callDetail)
        },
        // 通话结束时触发
        onCallRelease(callDetail) {
          console.log('通话结束时触发:', callDetail)
        },
        // 挂机时触发
        onHangUp(type) {
          console.log('通话结束时触发:', type)
        }
      })
    },
    /**
     * 打开云呼面板
     */
    handleWBDisplay() {
      if (this.workbenchBorderShowStatus) {
        window.workbench.changeVisible(false)
        this.workbenchBorderShowStatus = false
      } else {
        window.workbench.changeVisible(true)
        this.workbenchBorderShowStatus = true
      }
    },
    /**
     * 调取阿里云呼拨打电话
     */
    callPhone(record) {
      const mobile = record.mobile
      window.workbench.call(mobile, '', (callDetail) => {
        console.log(callDetail)
      })

      window.workbench.changeVisible(true)
      this.workbenchBorderShowStatus = true
    }
  },
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    height: auto;
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
      margin-right: 20px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }

  .content {
    margin-top: 16px;
    .user-info-wrap {
      display: flex;
      align-items: center;
      .call-wrap {
        width: 25px;
        height: 25px;
        margin-left: 15px;
        cursor: pointer;
        .call-img {
          width: 100%;
          height: 100%;
        }
      }
    }
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
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: flex-start;
    padding: 20px;
  }
  &-action {
    height: 88px;
    padding: 28px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    button {
      width: 178px;
      height: 36px;
    }
  }
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

.workbench-module {
  position: fixed;
  right: 50px;
  bottom: 50px;
  .workbench-wrap {
    background: #fff;
    margin-bottom: 20px;
    // #workbench {
    // }
  }
  .open-workbench-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: auto;
    color: #fff;
    background: #1790ff;
    cursor: pointer;
  }
}

</style>
