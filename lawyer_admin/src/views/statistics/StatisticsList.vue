<template>
  <a-layout class="main">
    <a-layout-header class="top"> </a-layout-header>

    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => record.promotion_channel_id"
      >
        <a-table-column key="index" title="序号">
          <template slot-scope="_, __, index">
            {{ (pagination.current - 1) * 15 + index + 1 }}
          </template>
        </a-table-column>
        <a-table-column key="promotion_channel_no" data-index="promotion_channel_no" title="渠道编号" />
        <a-table-column key="promotion_channel_name" data-index="promotion_channel_name" title="渠道名称" />

        <a-table-column v-for="(column, index) in columns" :key="column">
          <template #title>
            <span style="font-size: 12px">{{ column }}</span>
          </template>

          <template slot-scope="record">
            <div>{{ record.statistical[index].value }}</div>
          </template>
        </a-table-column>

        <a-table-column key="action" title="操作">
          <template slot-scope="text, record">
            <a-button type="primary" style="margin-right: 16px" size="small" @click="openInfo(record)">查看 </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <q-dialog v-model="state.isOpenQrCode">
      <q-card>
        <qr-code :text="currentText" />
      </q-card>
    </q-dialog>

    <q-dialog v-model="state.isOpenInfo">
      <set-statistical-channel title="渠道信息" mode="consume" @close="state.isOpenInfo = false" v-model="channel" />
    </q-dialog>
  </a-layout>
</template>

<script>
import { getStatisticalPage } from '@/api/statistical'
import SetStatisticalChannel from '@/components/Statistical/SetStatisticalChannel'

export default {
  name: 'StatisticsList',
  components: { SetStatisticalChannel },
  data() {
    return {
      data: [],
      search: '',
      state: {
        loading: false,
        isOpenInfo: false,
      },
      currentText: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getStatisticsPage(page, this.search)
          this.pagination.current = page
        },
      },
      columns: [
        '打开落地页',
        '下载',
        '第一次打开APP',
        '打开APP',
        '注册',
        '登录',
        '消费(元)',
        '提现(元)',
        '电话咨询',
        '开通会员',
        '已评价',
        '广告费用(元)',
      ],
      channel: {
        promotion_channel_no: '',
        promotion_channel_name: '',
        download_url: '',
        promotion_channel_id: 0,
      },
    }
  },
  created: function () {
    this.getStatisticsPage(1)
  },
  methods: {
    openInfo(record) {
      this.state.isOpenInfo = true
      this.channel = record
    },
    getStatisticsPage(page) {
      this.state.loading = true
      getStatisticalPage(page)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
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
    justify-content: flex-end;
  }

  .content {
    margin-top: 16px;
  }

  .blue-background {
    background: #f6fcff;
  }
}
</style>
