<template>
  <div class="recordContainer">
    <a-row :gutter="[12, 12]">
      <a-col :span="24">
        <a-card>
          <a-col :span="4">
            <h6><b> 操作日志</b></h6>
          </a-col>
          <a-col :span="3">
            <a-select placeholder="选择用户" style="width: 100%" @change="onchange">
              <a-select-option v-for="i in userlist" :key="(i + 9).toString(36) + i">
                {{ (i + 9).toString(36) + i }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="3">
            <a-select placeholder="选择菜单" style="width: 100%" @change="onchange">
              <a-select-option v-for="i in lists" :key="i">
                {{ i }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="5">
            <a-input-search placeholder="手机号/订单号" style="width: 100%" @search="onSearch" />
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :columns="columns"
            :data-source="testdata"
            :loading="loading"
            :pagination="pagination"
            bordered
            :rowKey="(record) => record.withdraw_id"
          >
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
  <script>
export default {
  name: 'recordIndex',
  components: {},
  props: {},
  data() {
    return {
      userlist: [],
      lists: [],
      testdata: [],
      columns: [
        {
          title: '用户',
          key: 'nickname',
          dataIndex: 'nickname',
          scopedSlots: { customRender: 'nickname' },
        },
        {
          title: '菜单',
          key: 'ali_pay_name',
          dataIndex: 'ali_pay_name',
          scopedSlots: { customRender: 'ali_pay_name' },
        },
        {
          title: '行为',
          key: 'withdraw_money',
          dataIndex: 'withdraw_money',
          scopedSlots: { customRender: 'withdraw_money' },
        },
      ],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        showTotal: (total) => `共${total}条`,
        onChange: this.onChange.bind(this),
        total: 0,
        showQuickJumper: true,
      },
      loading: true,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loading = true
    this.getdatapage()
  },
  mounted() {},
  methods: {
    onSearch(value) {
      console.log('搜索：' + value)
    },
    onchange(value) {
      console.log('选择：' + value)
    },
    onChange(pageNumber) {
      this.loading = true
      console.log('跳转：' + pageNumber)
    },
    getdatapage() {
      this.loading = false
    },
  },
}
</script>
 <style scoped>
</style>
