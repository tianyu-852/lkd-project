<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="6">
              <h5>
                <b> 注册律师人数: {{ pagination.total }}</b>
              </h5>
            </a-col>
            <a-col :span="4">
              类型:
              <a-select default-value="全部" style="width: 120px" @change="onChange1">
                <a-select-option value="-1"> 全部 </a-select-option>
                <a-select-option value="0"> 未认证 </a-select-option>
                <a-select-option value="1"> 已认证 </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="5">
              <a-input-search placeholder="手机号/订单号" style="width: 200px" @search="onSearch" allow-clear />
            </a-col>
            <a-col :span="6">
              <a-range-picker @change="onData" :Format="dateFormat" :default-value="[startDate, endDate]" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :data-source="assetsData"
            bordered
            :pagination="pagination"
            :rowKey="(record) => record.user_id"
            :loading="loading"
          >
            <a-table-column key="index" title="律师信息">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.nickname"
                  :avatar="record.avatar"
                  :mobile="record.mobile"
                  :user-id="String(record.user_id)"
                  :is_deleted="record.is_deleted"
                  size="sm"
                  @open="openUser(String(record.user_id))"
                />
              </template>
            </a-table-column>
            <a-table-column key="created_at" data-index="register_at" title="注册时间" />
            <!-- <a-table-column key="promotion_channel_name" data-index="promotion_channel_name" title="下载情况" /> -->
            <a-table-column key="login_at" title="登入情况">
              <template slot-scope="record"> {{ record.login_at !== '' ? record.login_at : '未登录' }} </template>
            </a-table-column>

            <a-table-column key="is_auth" title="认证情况">
              <template slot-scope="record">
                <span :style="record.is_auth === 1 ? 'color:#2CBF78' : 'color:#FF524C'">
                  {{ record.is_auth === 1 ? '已认证' : '未认证' }}
                </span>
              </template>
            </a-table-column>
            <a-table-column key="action" title="操作">
              <template slot-scope="text, record, index">
                <a-popconfirm
                  placement="leftBottom"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteStatisticalChannel(record.promotion_channel_id, index)"
                >
                  <template slot="title"> 是否确认要发送短信？ </template>
                  <a-button disabled type="primary" style="margin-right: 16px" size="small" @click="openUpdate(record)">
                    发送短信
                  </a-button>
                </a-popconfirm>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" mode="lawyer" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import { getPromotionChannelGuideUserPage } from '@/api/statistical'
import UserVipCell from '@/components/User/UserVipCell'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  components: { UserDetailDialog, UserVipCell },
  props: {},
  data() {
    return {
      state: {
        userDialog: false,
      },
      dateFormat: 'YYYY-MM-DD',
      mask: false,
      loading: true,
      assetsData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共${total}条`,
        showQuickJumper: true,
        onChange: (page) => {
          this.getPromotionChannelGuideUserPage(page)
          this.pagination.current = page
        },
      },
      status: -1,
      startDate: '',
      endDate: '',
      search: '',
      currentUserId: '',
      promotionChannelId: '',
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['status'] = this.status
      condition['search'] = this.search
      condition['startDate'] = this.startDate
      condition['endDate'] = this.endDate
      condition['promotionChannelId'] = this.promotionChannelId
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('ElectricPinRegisterListCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.status = condition.status
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.promotionChannelId = condition.promotionChannelId
      window.sessionStorage.removeItem('ElectricPinRegisterListCondition')
      this.getPromotionChannelGuideUserPage(condition.current)
    } else {
      this.getPromotionChannelGuideUserPage(1, '')
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
      sessionStorage.setItem('ElectricPinRegisterListCondition', JSON.stringify(this.conditionData))
    },

    onChange(pageNumber) {
      this.loading = true
      this.getPromotionChannelGuideUserPage(pageNumber)
    },
    moment,
    onData(value, dateString) {
      this.loading = true
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.getPromotionChannelGuideUserPage(1)
    },
    onChange1(e) {
      this.loading = true
      this.status = Number(e)
      this.getPromotionChannelGuideUserPage(1)
    },
    onSearch(value) {
      this.loading = true
      this.search = value
      this.getPromotionChannelGuideUserPage(1)
    },
    getPromotionChannelGuideUserPage(page) {
      getPromotionChannelGuideUserPage(
        page,
        this.status,
        this.search,
        this.$route.params.promotionChannelId,
        this.startDate,
        this.endDate
      )
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          for (let i = 0; i < data.data.length; i++) {
            data.data[i]['visible'] = false
          }
          this.assetsData = data.data
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    openUser(id) {
      this.state.userDialog = true
      this.currentUserId = id
    },
  },
}
</script>
<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
p {
  font-size: 14px;
  margin: 0;
}
</style>
