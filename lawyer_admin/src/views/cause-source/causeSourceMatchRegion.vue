
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span>当前匹配地区：{{ caseSourceMatchData.city_num }}</span>
        <span style="margin-left: 30px">今日匹配数：{{ caseSourceMatchData.all_city_match_already_num }}/{{ caseSourceMatchData.all_city_total_match_num }}</span>
      </div>

      <!-- <a-button type="primary" style="margin-left: auto;" @click="$router.push({ name: 'CauseSourceNationClueDataRoute' })">全国新增线索数据</a-button> -->
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-table
        :data-source="tableList"
        :loading="tableLoading"
        :pagination="tablePagination"
        :rowKey="(record) => String(record.source_match_success_id)"
        bordered
      >

        <!-- 地区-->
        <a-table-column title="地区" align="center">
          <template slot-scope="record">
            <div v-if="record.today_already_matched_num < record.today_total_already_matched_num" style="color: #f56c6c;">{{ record.city }}</div>
            <div v-else>{{ record.city }}</div>
          </template>
        </a-table-column>

        <!-- 今日匹配数 -->
        <a-table-column title="今日匹配数" align="center">
          <template slot-scope="record">
            <div v-if="record.today_already_matched_num < record.today_total_already_matched_num" style="color: #f56c6c;">{{ record.today_already_matched_num }}/{{ record.today_total_already_matched_num }}</div>
            <div v-else>{{ record.today_already_matched_num }}/{{ record.today_total_already_matched_num }}</div>
          </template>
        </a-table-column>

        <!-- 律师数 -->
        <a-table-column title="律师数" align="center">
          <template slot-scope="record">
            <div v-if="record.today_already_matched_num < record.today_total_already_matched_num" style="color: #f56c6c;">{{ record.lawyer_num }}</div>
            <div v-else>{{ record.lawyer_num }}</div>
          </template>
        </a-table-column>

        <!-- 待分配线索数 -->
        <a-table-column title="待分配线索数(3日内)" align="center">
          <template slot-scope="record">
            <div v-if="record.today_already_matched_num < record.today_total_already_matched_num" style="color: #f56c6c;">{{ record.wait_match_num }}</div>
            <div v-else>{{ record.wait_match_num }}</div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" fixed="right" align="center" :width="200">
          <template slot-scope="record">
            <a-button v-if="record.today_already_matched_num < record.today_total_already_matched_num" type="primary" style="background: #f56c6c; border-color: #f56c6c;" @click="openSelectLawyerModal(record)">分配</a-button>
            <a-button v-else type="primary" style="" @click="openSelectLawyerModal(record)">分配</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 开通套餐 表单 modal -->
    <a-modal
      v-model="selectLawyerModal.isShowSelectLawyerModal"
      :width="700"
      title="选择律师"
      destroyOnClose
      @ok="onSelectLawyerModalOkEvt"
    >
      <div class="select-lawyer-modal">
        <div v-for="(cItem, cIndex) in selectLawyerModal.selectLawyerList" :key="cIndex" class="checked-item" @click="selectLawyerModal.activeLawyer = cItem">
          <img v-if="cItem.user_id === selectLawyerModal.activeLawyer.user_id" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
          <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />

          <div class="checked-item-right">
            <div class="lawyer-info">
              <img :src="cItem.avatar" style="width: 30px; height: 30px; margin-right: 6px;" />
              <div>
                <span style="margin-right: 4px;">{{ cItem.nickname }}</span>
                <span v-if="cItem.type === 1" style="color: #41b583">普通</span>
                <span v-else style="color: #f56c6c">独家</span>
              </div>
            </div>
            <div v-if="cItem.today_match_num < cItem.day_num" class="lawyer-match" style="color: #f56c6c;">今日已匹配数：{{ cItem.today_match_num }}/{{ cItem.day_num }}</div>
            <div v-else class="lawyer-match">今日已匹配数：{{ cItem.today_match_num }}/{{ cItem.day_num }}</div>
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import moment from 'moment'

// 选择律师 modal
const SELECT_LAWYER_MODAL = {
  isShowSelectLawyerModal: false,
  selectLawyerList: [], // 待选择律师列表
  activeLawyer: {}, // 选中的律师
}

export default {
  name: 'CaseSourceMatchRegionPage',
  data() {
    return {
      caseSourceMatchData: {}, // 律师信息
      
      tableList: [], // table 列表
      tableLoading: true, // 数据是否加载中
      tablePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCaseSourceMatchRegionList(page)
          this.tablePagination.current = page
        },
      },
      
      selectLawyerModal: { ...SELECT_LAWYER_MODAL }, // 选择律师 modal
    }
  },
  created() {

    this._getCaseSourceMatchRegionList()
  },
  methods: {
    moment,

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      this._getCaseSourceMatchRegionList()
    },

    /**
     * 获取案源匹配地区 table 列表
     */
    async _getCaseSourceMatchRegionList(page = 1) {
      this.tableLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceMatchRegionListApi()
        this.tableList = causeSourceData.data
        delete causeSourceData.data
        this.caseSourceMatchData = causeSourceData
        this.tableLoading = false
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },

    /**
     * 打开选择律师 modal
     */
    openSelectLawyerModal(record) {
      this.selectLawyerModal.selectLawyerList = record.lawyer
      this.selectLawyerModal.isShowSelectLawyerModal = true
    },

    /**
     * 进入律师案源会员手动匹配线索页面
     */
    onSelectLawyerModalOkEvt() {
      const { selectLawyerModal } = this
      if (!selectLawyerModal.activeLawyer.user_id) return this.$message.warning('请先选择律师')
      const userId = String(selectLawyerModal.activeLawyer.user_id)
      this.$router.push({ name: 'CauseSourceMatchClueRoute', query: { lawyerUserId: userId } })
    },
    
    /**
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      const userId = String(record.user.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 90px;
    padding: 10px;
    .back {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  cursor: pointer;
}

.tool-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  height: 60px;
  padding: 0;
  padding-left: 10px;
  .company-name {
    font-size: 16px;
    font-weight: 600;
  }
  .data-num {
    font-size: 14px;
    font-weight: 600;
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
  .column-menuType-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .column-menuTime-wrap {
    font-weight: 600;
    color: #666;
  }
}

.select-lawyer-modal {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  max-height: 300px;
  overflow: auto;
  .checked-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    min-height: 50px;
    border-radius: 6px;
    padding: 10px 4px;
    border: 1px solid #ccc;
    cursor: pointer;
    .checkbox-img {
      margin-right: 10px;
    }
    .checked-item-right {
      .lawyer-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
      }
      .lawyer-match {
        margin-top: 6px;
      }
    }
  }
}
</style>
