<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">认证律师人数:{{ pagination.total }}</span>
      <a-input
        allow-clear
        placeholder="搜索用户名/手机号"
        v-model="search"
        @keyup.enter="getSearchPage"
        style="width: 180px; margin: 0 5px"
      />
      <a-button type="primary" @click="getSearchPage"> 搜索 </a-button>
      <a-month-picker :default-value="monthData" @change="monthDataChange" placeholder="选择月份" :locale="locale" />
      <a-button
        type="primary"
        style="background-color: #2cbf78; border: #2cbf78; color: ffffff"
        @click="state.addModal = true"
      >
        添加新的客服
      </a-button>
    </a-layout-header>
    <a-card class="content">
      <a-table
        :pagination="pagination"
        :rowKey="(record) => record.promotion_channel_id"
        :data-source="data"
        bordered
        :loading="state.loading"
      >
        <a-table-column key="customer_service_name" data-index="customer_service_name" title="负责客服" />
        <a-table-column key="customer_service_wechat" data-index="customer_service_wechat" title="负责微信号" />
        <a-table-column key="download_url" title="专属二维码|链接">
          <template slot-scope="text, record">
            <div class="text-btn" @click="openQrCode(record.download_url)">二维码</div>
            <span class="text-btn" style="text-align: center" @click="openUrl(record.download_url)"> 链接地址 </span>
            <span> | </span>
            <span class="text-btn" @click="copyClip(record.download_url)"> 复制 </span>
          </template>
        </a-table-column>
        <a-table-column key="click_number" title="点击数">
          <template slot-scope="text, record">
            {{ record.click_number }}
          </template>
        </a-table-column>
        <a-table-column key="register_number" title="注册数">
          <template slot-scope="text, record">
            <div style="cursor: pointer" @click="gotoRegisterList(record)">{{ record.register_number }}</div>
          </template>
        </a-table-column>
        <a-table-column key="download_number" title="下载">
          <template slot-scope="text, record">
            {{ record.download_number }}
          </template>
        </a-table-column>
        <a-table-column key="login_number" title="登入">
          <template slot-scope="text, record">
            {{ record.login_number }}
          </template>
        </a-table-column>
        <a-table-column key="auth_number" title="认证">
          <template slot-scope="text, record">
            {{ record.auth_number }}
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作">
          <template slot-scope="text, record">
            <a-popconfirm placement="leftBottom" ok-text="确认" cancel-text="不行" @confirm="deleteLawyer(record)">
              <template slot="title"> 请确认是否删除？ </template>
              <a-button type="danger" size="small">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <a-modal
      v-model="state.addModal"
      ok-text="确认"
      cancel-text="关闭"
      title="添加新的客服"
      @ok="setStatisticalChannel"
      width="610px"
    >
      <div class="modal">
        <div class="modal-name"><span> 客服名称:</span><a-input v-model="addData.name"></a-input></div>
        <div class="modal-name"><span> 微信号码:</span><a-input v-model="addData.number"></a-input></div>
        <div class="modal-link"><span> 渠道标识:</span><a-input v-model="addData.link"></a-input></div>
      </div>
    </a-modal>
    <a-modal v-model="state.isOpenQrCode" width="448px">
      <VueQr
        :text="currentText"
        :size="400"
        logoSrc="http://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png"
      />
    </a-modal>
  </a-layout>
</template>

<script>
import {
  postPromotionChannelPage,
  getPromotionChannelNumber,
  deleteStatisticalChannel,
  postPromotionChannelCustomerService,
} from '@/api/statistical'
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import { copyToClip } from '@/utils/util'
import VueQr from 'vue-qr'
export default {
  name: 'LawyerAuth',
  components: { VueQr },
  data() {
    return {
      locale,
      data: [],
      search: '',
      monthData: null,
      addData: {
        name: '',
        number: '',
        link: '',
      },
      currentText: '',
      state: {
        loading: false,
        addModal: false,
        isOpenQrCode: false,
      },
      iconList: [
        {
          url: require('@/assets/user/zs_icon@2x.png'),
        },
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        onChange: (page) => {
          this.postPromotionChannelPage(page, this.search)
          this.pagination.current = page
        },
      },
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      condition['monthData'] = this.monthData
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('ElectricPinListCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      this.monthData = condition.monthData
      sessionStorage.clear()
      this.postPromotionChannelPage(condition.current)
    } else {
      this.postPromotionChannelPage(1)
    }
    this.getPromotionChannelNumber()
  },

  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('ElectricPinListCondition', JSON.stringify(this.conditionData))
    },

    deleteLawyer(value) {
      deleteStatisticalChannel(value.promotion_channel_id).then(() => {
        this.$message.success('删除成功')
        this.postPromotionChannelPage(this.pagination.current)
      })
    },
    getSearchPage() {
      this.postPromotionChannelPage(1)
    },
    getPromotionChannelNumber() {
      getPromotionChannelNumber().then((data) => {
        this.pagination.total = data.data.number
      })
    },
    postPromotionChannelPage(page) {
      this.state.loading = true
      let monthData = ''
      if (this.monthData) {
        monthData = this.monthData
      }
      postPromotionChannelPage(page, monthData, this.search)
        .then(({ data }) => {
          this.pagination.current = page
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    setStatisticalChannel() {
      const promotionChannelNo = this.addData.link
      const customerServiceName = this.addData.name
      const customerServiceWechat = this.addData.number
      postPromotionChannelCustomerService(promotionChannelNo, customerServiceName, customerServiceWechat)
        .then(() => {
          this.$message.success('添加成功')
          this.postPromotionChannelPage(this.pagination.current)
        })
        .catch(() => {
          this.$message.error('添加失败')
        })
        .finally(() => {
          this.state.addModal = false
        })
    },
    openQrCode(text) {
      this.currentText = text
      this.state.isOpenQrCode = true
    },
    openUrl(url) {
      window.open(url, '_blank')
    },
    copyClip(text) {
      copyToClip(text)
      this.$message.success('链接已经复制到剪切板了')
    },
    moment,
    monthDataChange(value, dateString) {
      this.monthData = dateString
      this.postPromotionChannelPage(1)
    },
    gotoRegisterList(record) {
      const promotionChannelId = record.promotion_channel_id
      this.$router.push({ name: 'ElectricPinRegisterList', params: { promotionChannelId } })
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
.modal {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  span {
    width: 60px;
  }
  &-name {
    width: 50%;
    display: flex;
    align-items: center;
    flex-direction: row;
    margin: 5px 0;
    input {
      width: 220px;
    }
  }
  &-link {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    margin: 5px 0;
    input {
      width: 500px;
    }
  }
  img {
    width: 110px;
    height: 110px;
  }
}
</style>
