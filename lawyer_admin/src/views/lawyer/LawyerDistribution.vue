<template>
  <div>
    <a-row :gutter="[8, 16]">
      <a-col :span="24">
        <a-card>
          <a-input-search placeholder="省份/城市" style="width: 200px" v-model="search" @search="onSearch" clearable />
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :columns="columns"
            :rowKey="(record) => record.district_id"
            :data-source="localeData"
            bordered
            :loading="loading"
            :pagination="false"
          >
            <template slot="name" slot-scope="text, record">
              <router-link
                :to="{
                  name: 'Lawyer',
                  path: '/lawyer/page',
                  query: { parent_district_id: record.parent_district_id, district_id: record.district_id },
                }"
                style="cursor: pointer"
              >
                <span> {{ record.name }}</span>
              </router-link>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
  <script>
import { getLawyerDistribution } from '@/api/lawyer'
const columns = [
  {
    title: '地区',
    key: 'name',
    dataIndex: 'name',
    slots: { title: 'name' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '律师数量',
    key: 'number',
    dataIndex: 'number',
    scopedSlots: { customRender: 'number' },
  },
]
export default {
  components: {},
  props: {},
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      columns,
      mask: false,
      loading: true,
      localeData: [],
      search: '',
    }
  },

  computed: {},
  watch: {},
  created() {
    this.getLawyerData('')
  },
  mounted() {},
  methods: {
    onSearch(value) {
      const search = String(value)
      this.getLawyerData(search)
    },
    getLawyerData(search) {
      getLawyerDistribution(search)
        .then((data) => {
          for (let i = 0; i < data.data.length; i++) {
            const city = data.data[i].children
            for (let j = 0; j < city.length; j++) {
              delete city[j].children
            }
          }
          this.localeData = data.data
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
 <style scoped>
</style>
