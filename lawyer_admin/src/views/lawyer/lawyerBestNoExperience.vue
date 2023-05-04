<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span>优选「非体验期」律师：{{ pagination.total }}</span>
      </div>

      <span style="margin-right: 4px;">当前套餐状态：</span>
      <a-select style="width: 140px;" v-model="curStatusValFactor" @change="_getBestExperienceList()">
        <a-select-option v-for="sItem in curStatusSelectList" :value="sItem.value" :key="sItem.value">
          {{ sItem.label }}
        </a-select-option>
      </a-select>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getBestExperienceList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_id)"
        bordered
      >
        <!-- 律师 -->
        <a-table-column key="nickname" title="律师" align="center" :width="260">
          <template slot-scope="record">
            <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
              <user-vip-cell
                :nickname="record.nickname"
                :avatar="record.avatar"
                :mobile="record.mobile"
                :user-id="String(record.user_id)"
                size="sm"
                @open="openUser(record.user_id, 'lawyer')"
              />
              <span>{{ record.lawyer_grade }}</span>
              <br />
              <span>最后登录：{{ record.login_at }}</span>
              <span>登录地点：{{ record.location }}</span>
            </div>
          </template>
        </a-table-column>

        <!-- 开通套餐 -->
        <a-table-column title="开通套餐" align="center" :width="220">
          <template slot-scope="record">
            <div class="column-menu-wrap" :style="{ color: '#666' }">
              <div>套餐类型: {{ record.optimization_plan || '' }}</div>
              <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
              <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
            </div>
          </template>
        </a-table-column>

        <a-table-column title="套餐时间" align="center">
          <template slot-scope="record">
            <div class="column-menuTime-wrap" :style="{ color: '#666', 'font-weight': 600 }">
              <div>{{ record.optimal_enjoy_open_time }}</div>
              <div>至</div>
              <div>{{ record.optimal_enjoy_end_time }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
              <!-- 查看 -->
              <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerDetail(record)">查看</a-button>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import UserVipCell from '@/components/User/UserVipCell'
import * as lawyerApi from '@/api/lawyer'

export default {
  name: 'LawyerBestExperiencePage',
  components: { UserVipCell },
  data() {
    return {
      tableDataList: [], // 标签列表
      tableDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getBestExperienceList(page)
          this.pagination.current = page
        },
      },

      curStatusSelectList: [{ label: '已过期', value: 1 }, { label: '未过期', value: 0 },], // 当前套餐状态 select 列表
      curStatusValFactor: 1, // 当前套餐状态
    }
  },
  created() {
    this._getBestExperienceList()
  },
  methods: {
    /**
     * 获取优选 非体验期 列表
     */
     async _getBestExperienceList(page = 1) {
       this.tableDataLoading = true

       // 请求参数
       const param = {
        page,
        size: this.pagination.pageSize,
        type: 0,
        is_expired: this.curStatusValFactor
       }

       try {
         const { data: labelListData } = await lawyerApi.getBestExperienceListApi(param)
         this.tableDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      const userId = String(record.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 90px;
    font-size: 16px;
    font-weight: 600;
    .back {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
      .icon-back {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
  .column-menu-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 600;
  }
}
</style>
