<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24" style="display: flex; flex-direction: row; align-items: center; align-content: center">
        <a-card style="border-radius: 4px; width: 280px; height: auto; margin-right: 20px; border: none">
          <img style="width: 20px; height: 20px" :src="require('@/assets/common/ring-blue.png')" /><span>
            会员数量: {{ '31个' }}
          </span>
        </a-card>
        <a-card style="border-radius: 4px; width: 280px; height: auto; margin-right: 20px; border: none">
          <img style="width: 20px; height: 20px" :src="require('@/assets/common/ring-green.png')" /><span>
            已过期: {{ '31个' }}
          </span>
        </a-card>
        <a-card style="border-radius: 4px; width: 280px; height: auto; margin-right: 20px; border: none">
          <img style="width: 20px; height: 20px" :src="require('@/assets/common/ring-orange.png')" /><span>
            总营收: {{ '31' }}元
          </span>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
            <div>
              <a-select :default-value="-1" v-model="type" style="margin: 5px">
                <a-select-option v-for="type in typeList" :value="type.value" :key="type.label">
                  {{ type.label }}
                </a-select-option>
              </a-select>
              <a-input placeholder="搜索手机号/用户名" v-model="search" style="width: 200px; margin: 5px" />
              <a-button type="primary" style="margin: 5px"> 搜索</a-button>
            </div>
            <div>
              <a-button style="background-color: #2cbf78; border-color: #2cbf78; color: #ffffff; margin: 0 10px">
                全部会员
              </a-button>
              <a-button style="background-color: #2cbf78; border-color: #2cbf78; color: #ffffff; margin: 0 10px">
                已过期会员
              </a-button>
              <a-button style="background-color: #2cbf78; border-color: #2cbf78; color: #ffffff; margin: 0 10px">
                购买失败会员
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :data-source="tableData"
            bordered
            :pagination="pagination"
            :loading="state.loading"
            :rowKey="(record) => String(record.id)"
          >
            <!-- <a-table-column key="id" data-index="id" title="序号" align="center" /> -->
            <a-table-column key="user" title="用户" align="center">
              <template slot-scope="text, record">
                <UserVipCell
                  :nickname="record.user.nickname"
                  :avatar="record.user.avatar"
                  :mobile="record.user.mobile"
                  @open="openUser(String(record.user.user_id))"
                />
              </template>
            </a-table-column>
            <a-table-column key="Commission" data-index="type" title="会员类型" align="center" />
            <a-table-column key="superior" data-index="type" title="开通/到期日期" align="center" />
            <a-table-column key="Grade" data-index="type" title="注册/最近登入时间" align="center" />
            <a-table-column key="service" data-index="type" title="注册/最近登入地区" align="center" />
            <a-table-column key="status" title="状态" align="center">
              <template slot-scope="record">
                <a-popconfirm placement="top" ok-text="是的" cancel-text="不是" @confirm="setUserStatus(record)">
                  <template slot="title">
                    <p>是否要{{ userStatusTextReverse(record.status) }}该用户</p>
                  </template>
                  <div class="user-status clickable" :class="userStatusClass(record.status)" v-show="!record.isLoading">
                    <div class="user-status-icon" :class="userIconClass(record.status)"></div>
                    <span>{{ userStatusText(record.status) }}</span>
                  </div>
                </a-popconfirm>

                <div class="user-status text-primary" v-show="record.isLoading">
                  <q-spinner-facebook />
                </div>
              </template>
            </a-table-column>
            <a-table-column key="action" title="操作" align="center">
              <template slot-scope="text, record">
                <a-button type="primary" @click="gotoDetail(record.id)"> 详情 </a-button>
                <a-button
                  type="danger"
                  style="margin: 5px; width: 74px"
                  :class="record.ban === 0 ? 'banBtnon' : 'banBtnoff'"
                  @click=";(state.banLoading = true), (chooseData = record)"
                >
                  {{ record.ban === 0 ? '禁言' : '解禁' }}
                </a-button>
                <a-button type="danger">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.banLoading" title="温馨提示">
      <div
        style="
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 34px;
          color: #787e8d;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
        "
      >
        {{ chooseData.ban !== 0 ? '请确认是否解禁该用户' : '请确认是否封禁该用户' }}
      </div>
      <div style="display: flex; align-items: center; flex-direction: row; justify-content: space-around">
        <a-button size="small" style="width: 120px; height: 36px" @click="state.banLoading = false">取消</a-button>
        <a-button
          type="danger"
          style="
            margin: 5px;
            width: 120px;
            height: 36px;
            background-color: #ff9700;
            color: #ffffff;
            border-color: #ff9700;
          "
          size="small"
          @click=";(state.banLoading = false), chooseData.ban === 0 ? (chooseData.ban = 1) : (chooseData.ban = 0)"
        >
          {{ chooseData.ban === 0 ? '封禁' : '解禁' }}
        </a-button>
      </div>
    </a-modal>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>
  <script>
import { setUserStatus } from '@/api/user'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
export default {
  name: 'salesmanIndex',
  components: { UserVipCell, UserDetailDialog },
  props: {},
  data() {
    return {
      currentUserId: '',
      state: {
        loading: false,
        banLoading: false,
        userDialog: false,
      },
      chooseData: {},
      typeList: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '普惠',
          value: 1,
        },
        {
          label: '优选',
          value: 2,
        },
        {
          label: '至尊',
          value: 3,
        },
      ],
      rangePlaceholder: ['开始日期', '结束日期'],
      type: '全部',
      search: '',
      tableData: [
        {
          id: 1,
          uesr_id: 1,
          type: 'hfashfghj分享',
          ban: 0,
          user: {
            nickname: '机器人999',
            mobile: '132xxxx4399',
            avatar: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/anonymous_user.png',
            user_id: '126',
          },
        },
        {
          id: 2,
          uesr_id: 2,
          type: 'hfashfghj分享',
          ban: 1,
          user: {
            nickname: '机器人999',
            mobile: '132xxxx4399',
            avatar: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/anonymous_user.png',
            user_id: '126',
          },
        },
        {
          id: 3,
          uesr_id: 3,
          type: 'hfashfghj分享',
          ban: 0,
          user: {
            nickname: '机器人999',
            mobile: '132xxxx4399',
            avatar: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/anonymous_user.png',
            user_id: '126',
          },
        },
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getData(page, 0, this.search)
          this.pagination.current = page
        },
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getData() {
      console.log(1)
    },
    gotoDetail(id) {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['id'] = this.id
      condition['search'] = this.search
      const name = 'MemberList'
      this.$router.push({ name: 'MemberDetail', params: { userId: id, condition, name } })
    },
    gotoTable(id, type) {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['id'] = this.id
      condition['search'] = this.search
      if (type === 0) {
        this.$router.push({ name: 'saleTeam', params: { userId: id, condition } })
      } else {
        this.$router.push({ name: 'salesRecord', params: { userId: id, condition } })
      }
    },
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
    },
    userStatusTextReverse(status) {
      return this.userStatusText(status === 1 ? 0 : 1)
    },
    userStatusText(status) {
      switch (status) {
        case 0:
          return '启用'
        case 1:
          return '禁用'
      }
    },
    userStatusClass(status) {
      return {
        'user-status-blue': status === 0,
        'user-status-yellow': status === 1,
      }
    },
    userIconClass(status) {
      return {
        'user-status-blue-background': status === 0,
        'user-status-yellow-background': status === 1,
      }
    },
    setUserStatus(record) {
      const status = record.status === 1 ? 0 : 1
      const text = `${this.userStatusText(status)}成功`

      record.isLoading = true

      setUserStatus(record.user_id, status)
        .then(() => {
          this.$message.success(text)
          record.status = status
        })
        .finally(() => {
          record.isLoading = false
        })
    },
  },
}
</script>
 <style scoped lang="less">
/deep/.ant-modal-footer {
  display: none;
}
.banBtnoff {
  background: #fff4ea;
  color: #ff9700;
  border-color: #fff4ea;
}
.banBtnon {
  background-color: #ff9700;
  color: #ffffff;
  border-color: #ff9700;
}

.user-status {
  display: flex;
  align-items: center;
  justify-content: center;

  &-icon {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3980ea;
    margin-right: 8px;
  }

  &-blue-background {
    background: #3980ea;
  }

  &-yellow-background {
    background: #ff9700;
  }

  &-blue {
    color: #3980ea;
  }

  &-yellow {
    color: #ff9700;
  }
}
</style>
