<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <q-btn color="positive" @click="openAdd">添加</q-btn>
    </a-layout-header>

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
        <a-table-column key="url" title="落地页">
          <template slot-scope="record">
            <span class="text-btn" style="text-align: center" @click="openUrl(record.download_url)"> 链接地址 </span>

            <span> | </span>
            <span class="text-btn" @click="copyClip(record.download_url)"> 复制 </span>
          </template>
        </a-table-column>

        <a-table-column key="qrcode" title="二维码">
          <template slot-scope="record">
            <div class="text-btn" @click="openQrCode(record.download_url)">生成二维码</div>
          </template>
        </a-table-column>
        <a-table-column key="created_at" data-index="created_at" title="创建时间" />
        <a-table-column key="action" title="操作">
          <template slot-scope="text, record, index">
            <a-button type="primary" style="margin-right: 16px" size="small" @click="openUpdate(record)">
              查看
            </a-button>

            <a-popconfirm
              placement="leftBottom"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteStatisticalChannel(record.promotion_channel_id, index)"
            >
              <template slot="title"> 是否确认要删除该渠道？ </template>
              <a-button type="danger" size="small">删除 </a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <q-dialog v-model="state.isOpenQrCode">
      <q-card>
        <qr-code :text="currentText" />
      </q-card>
    </q-dialog>

    <q-dialog v-model="state.isOpenAdd">
      <set-statistical-channel title="添加渠道" @close="state.isOpenAdd = false" v-model="channel" />
    </q-dialog>

    <q-dialog v-model="state.isOpenUpdate">
      <set-statistical-channel
        title="渠道详情"
        @close="state.isOpenUpdate = false"
        @add="getStatisticsPage(1)"
        v-model="channel"
      />
    </q-dialog>
  </a-layout>
</template>

<script>
import { deleteStatisticalChannel, getStatisticalChannelPage } from '@/api/statistical'
import { copyToClip } from '@/utils/util'
import QrCode from '@/components/QrCode'
import SetStatisticalChannel from '@/components/Statistical/SetStatisticalChannel'

export default {
  name: 'StatisticsChannel',
  components: { SetStatisticalChannel, QrCode },
  data() {
    return {
      data: [],
      search: '',
      state: {
        loading: false,
        isOpenQrCode: false,
        isOpenAdd: false,
        isOpenUpdate: false,
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
    openAdd() {
      this.state.isOpenAdd = true
      if (this.channel.promotion_channel_id !== 0) {
        this.channel = {
          promotion_channel_no: '',
          promotion_channel_name: '',
          download_url: '',
          promotion_channel_id: 0,
        }
      }
    },
    openUpdate(item) {
      this.state.isOpenUpdate = true
      this.channel = {
        promotion_channel_no: item.promotion_channel_no,
        promotion_channel_name: item.promotion_channel_name,
        download_url: item.download_url,
        promotion_channel_id: item.promotion_channel_id,
      }
    },
    openUrl(url) {
      window.open(url, '_blank')
    },
    openQrCode(text) {
      this.currentText = text
      this.state.isOpenQrCode = true
    },
    copyClip(text) {
      copyToClip(text)
      this.$message.success('链接已经复制到剪切板了')
    },
    deleteStatisticalChannel(id, index) {
      this.state.loading = true

      deleteStatisticalChannel(id)
        .then(() => {
          this.pagination.total -= 1
          this.data.splice(index, 1)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    getStatisticsPage(page) {
      this.state.loading = true
      getStatisticalChannelPage(page)
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

  &-text-btn {
    color: #787e8d;
    &:hover {
      color: #3980ea;
    }
  }
}
</style>
