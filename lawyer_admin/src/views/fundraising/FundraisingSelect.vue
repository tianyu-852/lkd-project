
<template>
  <div>
    <a-row :gutter="[8, 16]">
      <a-col :span="24">
        <a-card>
          <a-col :span="8" style="display: flex; flex-direction: row; align-items: center">
            <img
              :src="iconList[0].url"
              style="width: 25px; height: 20px; margin-right: 50px; cursor: pointer"
              @click="gotolast"
            />
            <b><span style="font-size: 22px">选择负责人和律师</span> </b>
          </a-col>
          <a-col :span="8">
            <!-- 选择服务客服：
            <a-select style="width: 120px" @change="ChangeServices">
              <a-select-option v-for="(i, key) in ServicesList" :key="key + i.admin_id" :value="i.admin_id">
                {{ i.nickname }}
              </a-select-option>
            </a-select> -->
          </a-col>
          <a-col :span="8">
            <a-input-group compact>
              <a-input-search
                style="width: 100%"
                placeholder="请输入手机号/用户名"
                v-model="search"
                @search="onSearch"
              />
            </a-input-group>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <b><p>添加律师列表</p></b>
          <div style="height: 495px; overflow: auto">
            <a-table
              :pagination="false"
              :loading="state.lawyerLoading"
              :data-source="addLawyerData"
              :row-key="(record) => record.user_id"
            >
              <!-- <a-table-column key="index" title="序号">
              <template slot-scope="record">
                <label>{{ record.index }}</label>
              </template>
            </a-table-column> -->
              <a-table-column key="nickname" title="名字">
                <template slot-scope="record">
                  <div style="display: flex">
                    <a-avatar :size="26" icon="user" :src="record.avatar" />
                    <label>{{ record.nickname }}</label>
                    <div
                      class="userLabel"
                      v-if="record.mobile === chooseMobile"
                      style="background-color: #ffeacc; color: #ff9700; font-size: 12px; width: 54px; height: 20px"
                    >
                      指定律师
                    </div>
                  </div>
                </template>
              </a-table-column>
              <a-table-column key="mobile" align="center" title="电话号码">
                <template slot-scope="record">
                  {{ record.mobile }}
                </template>
              </a-table-column>
              <a-table-column key="action" align="center" title="操作">
                <template slot-scope="record">
                  <a-button @click="delLawyer(record)" :disabled="!record.loading" type="danger">删除</a-button>
                </template>
              </a-table-column>
            </a-table>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-table
            :pagination="pagination"
            :loading="state.lawyerLoading"
            :data-source="LawyerData"
            style="margin-top: 24px"
            :row-key="(record) => record.user_id"
          >
            <a-table-column key="index" title="序号">
              <template slot-scope="record">
                <label>{{ record.index }}</label>
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
            <a-table-column key="action" align="center" title="操作">
              <template slot-scope="record">
                <a-button @click="addLawyer(record)" type="primary" :disabled="record.loading">添加</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-button @click="changeLawyer" style="width: 200px; float: right">审核通过</a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
  <script>
import { getFundraisingLawyerPage, getFundraisingServices, getFundraisingCheck } from '@/api/fundraising'
export default {
  name: 'Index',
  components: {},
  props: {},
  data() {
    return {
      iconList: [
        {
          url: require('@/assets/Fundraising/hf_icon@2x.png'),
        },
      ],
      fundraisingRegistrationId: '',
      ServicesList: [],
      customerServiceAdminId: '',
      state: {
        loading: false,
        changeList: true,
        visible: false,
        visible1: false,
        userDialog: false,
        rejectAudit: false,
        lawyerLoading: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 6, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getFundraisingLawyerPage(page, this.search)
          this.pagination.current = page
        },
      },
      addLawyerData: [],
      LawyerData: [],
      search: '',
      chooseMobile: '',
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fundraisingRegistrationId = this.$route.params.fundraisingRegistrationId
    this.chooseMobile = this.$route.params.chooseMobile
    // console.log(this.chooseMobile)
    this.getFundraisingLawyerPage(1, '')
    this.getFundraisingChooseLawyer(1, this.chooseMobile)
    this.getFundraisingServices()
  },
  mounted() {},
  methods: {
    getFundraisingLawyerPage(page, search) {
      const that = this
      const prePage = this.pagination.pageSize
      getFundraisingLawyerPage(page, search, this.fundraisingRegistrationId, prePage)
        .then((data) => {
          for (let i = 0; i < data.data.data.length; i++) {
            data.data.data[i]['index'] = i + 1
            data.data.data[i]['loading'] = false
          }
          this.LawyerData = data.data.data
          this.pagination.total = data.data.total
          for (let i = 0; i < this.LawyerData.length; i++) {
            for (let j = 0; j < this.addLawyerData.length; j++) {
              if (this.LawyerData[i].user_id === this.addLawyerData[j].user_id) {
                this.LawyerData[i].loading = true
              }
            }
          }
          // console.log(this.LawyerData)
        })
        .finally(() => {
          this.state.lawyerLoading = false
        })
    },
    getFundraisingChooseLawyer(page, search) {
      const prePage = this.pagination.pageSize
      if (this.chooseMobile) {
        getFundraisingLawyerPage(page, search, this.fundraisingRegistrationId, prePage).then((data) => {
          const chooseLawyer = data.data.data[0]
          chooseLawyer['loading'] = true
          this.addLawyerData.push(chooseLawyer)
        })
      }
    },
    addLawyer(data) {
      for (let i = 0; i < this.LawyerData.length; i++) {
        if (this.LawyerData[i].user_id === data.user_id) {
          this.LawyerData[i].loading = true
          this.addLawyerData.push(data)
        }
      }
    },
    delLawyer(data) {
      for (let i = 0; i < this.addLawyerData.length; i++) {
        if (this.addLawyerData[i].user_id === data.user_id) {
          this.addLawyerData.splice(i, 1)
        }
      }
      for (let i = 0; i < this.LawyerData.length; i++) {
        if (this.LawyerData[i].user_id === data.user_id) {
          this.LawyerData[i].loading = false
        }
      }
    },
    changeLawyer() {
      const lawyers = []

      for (let i = 0; i < this.addLawyerData.length; i++) {
        lawyers.push(this.addLawyerData[i].user_id)
      }
      const fundraisingRegistrationId = this.fundraisingRegistrationId
      const customerServiceAdminId = this.customerServiceAdminId
      if (lawyers.length === 0) {
        this.$message.error('未选择律师')
      } else {
        const lawyerUserIds = JSON.stringify(lawyers)
        getFundraisingCheck(10, fundraisingRegistrationId, customerServiceAdminId, lawyerUserIds)
          .then(() => {
            this.$message.success('已通过审核')
            const condition = this.$route.params.condition
            this.$router.push({ name: 'FundraisingCheck', params: { condition } })
          })
          .catch(() => {
            this.getFundraisingLawyerPage(1, '')
            this.$message.error('服务器错误')
          })
          .finally(() => {
            this.addLawyerData = []
          })
      }
    },
    onSearch() {
      this.state.lawyerLoading = true
      this.getFundraisingLawyerPage(1, this.search)
    },
    getFundraisingServices() {
      getFundraisingServices().then((data) => {
        this.ServicesList = data.data
        // console.log(this.ServicesList)
      })
    },
    ChangeServices(value) {
      this.customerServiceAdminId = value
    },
    gotolast() {
      this.$router.push({
        name: 'FundraisingDetailsCheck',
        params: { fundraisingRegistrationId: this.fundraisingRegistrationId },
      })
    },
  },
}
</script>
 <style scoped lang="less">
.userLabel {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
}
</style>
