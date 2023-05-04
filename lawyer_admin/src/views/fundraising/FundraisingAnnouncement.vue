<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <a-col :span="6">
            <h5 style="margin: 0">
              <b> 现有平台公告数:{{ pagination.total }}</b>
            </h5>
          </a-col>
          <a-col :span="6" :offset="12">
            <a-range-picker
              @change="onData"
              :Format="dateFormat"
              @onOk="
                {
                  onOk
                }
              "
            />
          </a-col>
          <a-col :span="3">
            <a-button @click="openModal(0)" style="background-color: #2cbf78; color: #fff; border: none">
              添加新的公告
            </a-button>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :rowKey="(record) => record.announcement_id"
            :data-source="tableData"
            bordered
            :pagination="pagination"
            :loading="state.loading"
          >
            <a-table-column key="title" title="轮播标题">
              <template slot-scope="record">
                {{ record.title }}
              </template>
            </a-table-column>
            <a-table-column key="content" title="公告内容">
              <template slot-scope="record">
                <text-with-row-button :text="record.content" :over-max="40" :created_at="record.created_at" />
              </template>
            </a-table-column>
            <a-table-column key="created_at" align="center" data-index="created_at" title="公告内容" />

            <a-table-column key="action" title="操作">
              <template slot-scope="text, record">
                <a-button
                  type="primary"
                  :loading="state.btnloading"
                  @click="openModal(1, record)"
                  style="margin: 5px 0; left: calc(50% - 32px)"
                >
                  详情
                </a-button>
                <br />
                <a-button
                  type="danger"
                  :loading="state.btnloading1"
                  @click="deleteData(record.announcement_id)"
                  style="margin: 5px 0; left: calc(50% - 32px)"
                >
                  删除
                </a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.modalLoading" :title="modalTitle" @ok="handleOk">
      <label><b>轮播标题</b></label>
      <a-input
        v-model="postData.title"
        style="width: 100%; border: 0px; background-color: #eff1f5; padding: 10px; margin: 10px 0"
        type="textarea"
        :rows="1"
      />
      <label><b>公告内容</b></label>
      <a-input
        v-model="postData.content"
        style="width: 100%; border: 0px; background-color: #eff1f5; padding: 10px; margin: 10px 0"
        type="textarea"
        :rows="6"
      />
    </a-modal>
  </div>
</template>
  <script>
import {
  getFundraisingAnnouncementData,
  postFundraisingAnnouncement,
  deleteFundraisingAnnouncement,
  getFundraisingAnnouncement,
} from '@/api/fundraising'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import moment from 'moment'
export default {
  name: 'AnnouncementIndex',
  components: {
    TextWithRowButton,
  },
  props: {},
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      state: { loading: true, userDialog: false, btnloading: false, modalLoading: false },
      timeDate: {
        startDate: '',
        endDate: '',
      },
      currentUserId: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getFundraisingAnnouncementData(page, this.search)
          this.pagination.current = page
        },
      },
      tableData: [],
      modalTitle: '',
      postData: {
        announcement_id: '',
        title: '',
        content: '',
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getFundraisingAnnouncementData(1)
  },
  mounted() {},
  methods: {
    getFundraisingAnnouncementData(page) {
      const startDate = this.timeDate.startDate
      const endDate = this.timeDate.endDate
      getFundraisingAnnouncementData(page, startDate, endDate).then((data) => {
        //   console.log(data.data)
        this.tableData = data.data.data
        this.pagination.total = data.data.total
        this.pagination.pageSize = data.data.per_page
        this.state.loading = false
      })
    },
    deleteData(id) {
      // console.log(id)
      this.state.loading = true
      deleteFundraisingAnnouncement(id).then((data) => {
        //    console.log(data)
        this.getFundraisingAnnouncementData(1)
      })
    },
    openModal(e, record) {
      if (e === 0) {
        // 上传
        this.modalTitle = '添加新的公告'
        this.postData.announcement_id = ''
        this.postData.title = ''
        this.postData.content = ''
        this.state.modalLoading = true
      } else {
        this.modalTitle = '修改公告'
        // 修改
        this.postData.announcement_id = record.announcement_id
        this.postData.title = record.title
        this.postData.content = record.content
        this.state.modalLoading = true
      }
    },
    handleOk() {
      this.state.loading = true
      postFundraisingAnnouncement(this.postData.title, this.postData.content, this.postData.announcement_id)
        .then(() => {
          if (this.postData.announcement_id === '') {
            this.$message.success('新建成功')
          } else {
            this.$message.success('修改成功')
          }
          this.getFundraisingAnnouncementData(1)
        })
        .catch(() => {
          this.$message.error('操作失败')
        })
        .finally(() => {
          this.state.modalLoading = false
          this.state.loading = false
        })
    },
    getDetails(id) {
      getFundraisingAnnouncement(id).then((data) => {
        //  console.log(data)
      })
    },
    moment,
    onData(value, dateString) {
      this.state.loading = true
      this.timeDate.startDate = dateString[0]
      this.timeDate.endDate = dateString[1]
      this.getFundraisingAnnouncementData(1)
    },
    onOk(value) {
      //   console.log('onOk: ', value)
    },
  },
}
</script>
 <style scoped>
</style>
