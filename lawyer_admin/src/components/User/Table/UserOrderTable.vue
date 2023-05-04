<template>
  <div>
    <q-table
      class="content-order-table"
      :data="data"
      :columns="columns"
      :loading="state.isTableLoading"
      row-key="name"
      :pagination="pagination"
      :bordered="false"
      :hide-bottom="true"
      :card-container-style="{ border: 'none' }"
      separator="cell"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="lawyer" :props="props" class="center content-order-user">
            <!-- <user-cell
              :mobile="props.row.mobile"
              :nickname="props.row.nickname"
              :avatar="props.row.avatar"
              @open="openUser"
            /> -->
            <user-vip-cell
              :nickname="props.row.nickname"
              :avatar="props.row.avatar"
              :mobile="props.row.mobile"
              :vip-icon="props.row.vip_icon"
              :user-id="String(props.row.user_id)"
              :is-bot="props.row.is_bot"
              @open="openUser"
            />
          </q-td>
          <q-td key="order_no" :props="props">
            {{ props.row.order_no }}
          </q-td>
          <q-td key="created_at" :props="props">
            {{ props.row.created_at }}
          </q-td>
          <q-td key="status_text" :props="props">
            {{ props.row.status_text }}
          </q-td>

          <q-td key="records" :props="props">
            <a v-for="(record, key) in props.row.records" :key="'record_' + key" @click="play(record.record_path)">
              {{ record.chinese_duration }}
            </a>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <a-drawer
      title="录音播放"
      placement="right"
      :closable="false"
      :visible="state.recordVisible"
      @close="state.recordVisible = false"
      width="300"
    >
      <single-audio-player :src="currentPlayRecord" />
    </a-drawer>

    <q-pagination
      class="content-order-page"
      v-model="pagination.current"
      :max="pagination.last"
      :max-pages="15"
      :boundary-numbers="true"
      @input="(page) => getPage(page)"
    />
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { getUserOrderPage } from '@/api/user'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'

export default {
  name: 'UserOrderTable',
  components: { SingleAudioPlayer, UserCell, UserVipCell, UserDetailDialog },
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentPlayRecord: '',
      pagination: {
        current: 1,
        last: 1,
        rowsPerPage: 8,
      },
      data: [],
      columns: [
        { name: 'lawyer', label: 'TA的律师', align: 'center' },
        { name: 'order_no', label: '订单编号', align: 'center' },
        { name: 'created_at', label: '下单时间', align: 'center' },
        { name: 'status_text', label: '状态', align: 'center' },
        { name: 'records', label: '语音', align: 'center' },
      ],
      state: {
        isTableLoading: false,
        recordVisible: false,
        userDialog: false,
      },
      currentUserId: 0,
    }
  },
  created() {
    this.getPage(1)
  },
  methods: {
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
    },
    play(url) {
      this.currentPlayRecord = url
      this.state.recordVisible = true
    },
    getPage(page) {
      this.state.isTableLoading = true
      getUserOrderPage(this.userId, page)
        .then(({ data }) => {
          this.pagination.last = data.last
          this.data = data.data
        })
        .finally(() => {
          this.state.isTableLoading = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
.content-order {
  &-table {
    height: 100%;
    min-height: 200px;
    margin-bottom: 16px;
  }

  &-user {
    padding: 12px;
    height: 74px;
  }

  &-page {
    float: right;
    margin-right: 12px;
  }
}
</style>