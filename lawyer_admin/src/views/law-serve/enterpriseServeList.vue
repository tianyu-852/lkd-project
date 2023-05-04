
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">企业套餐总数：{{ pagination.total }}</span>

      <!-- 搜索输入框 -->
      <div class="mobile-input-wrap">
        <a-input allow-clear placeholder="搜索企业名称" v-model="searchEnterpriseName" @keyup.enter="getSearchData" style="margin: 0 5px; width: 160px" />
        <a-button type="primary" @click="getSearchData">搜索</a-button>
      </div>

      <!-- 时间筛选 -->
      <a-range-picker
        @change="onRangePickerChange"
        @ok="getSearchData"
        style="width: 340px; margin-left: 30px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />

      <!-- 录入企业套餐 -->
      <a-button v-if="(userInfo.enterprise_auth && userInfo.enterprise_auth.add) || !userInfo.enterprise_auth" type="primary" style="margin-left: auto;" @click="$router.push({ name: 'enterpriseServeEdit' })">录入企业套餐</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getEnterpriseLawServeList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_id)"
        bordered
      >

        <!-- 企业名称 -->
        <a-table-column title="企业名称" align="center">
          <template slot-scope="record">
            <div class="column-user">
              主：{{ record.enterprise_name }}
            </div>
            <template v-if="record.associated_enterprises && record.associated_enterprises.length">
              <div v-for="(fItem, fIndex) of record.associated_enterprises" :key="fIndex" class="column-user">
                次{{ fIndex + 1 }}：{{ fItem }}
              </div>
            </template>
          </template>
        </a-table-column>
        
        <!-- 套餐类型 -->
        <a-table-column align="center" width="170px">
          <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span>套餐类型</span>
            <a-select style="width: 160px; margin-top: 5px;" v-model="lawServeVipId" allowClear @change="_getEnterpriseLawServeList()">
              <a-select-option v-for="sItem in lawServeVipSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>

          <template slot-scope="record">
            {{ record.enterprise_vip.title }} {{ record.enterprise_vip.price }}/年
          </template>
        </a-table-column>

        <!-- 套餐开通时间 -->
        <a-table-column dataIndex="start_time" title="套餐开通时间" align="center" />

        <!-- 套餐结束时间 -->
        <a-table-column dataIndex="end_time" title="套餐结束时间" align="center" />

        <!-- 主使用人 -->
        <!-- <a-table-column dataIndex="optimal_enjoy_open_time" title="套餐开通时间" align="center" /> -->

        <!-- 主使用人 -->
        <a-table-column title="主使用人" align="center">
          <template slot-scope="record">
            <div class="column-user-wrap">
              主：{{ record.name }} {{ record.mobile }}
            </div>
          </template>
        </a-table-column>

        <!-- 附属使用人 -->
        <a-table-column title="附属使用人" align="center">
          <template slot-scope="record">
            <template v-if="record.enterprise_affiliated && record.enterprise_affiliated.length">
              <div v-for="(fItem, fIndex) of record.enterprise_affiliated" :key="fIndex" class="column-user">
                次{{ fIndex + 1 }}：{{ fItem.name }} {{ fItem.mobile }}
              </div>
            </template>
            <div v-else>无</div>
          </template>
        </a-table-column>

        <!-- 法务管家 -->
        <a-table-column dataIndex="legal_affairs.name" title="法务管家" align="center" />

        <!-- 销售 -->
        <a-table-column dataIndex="sales_name" title="销售" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button v-if="!userInfo.enterprise_auth || (userInfo.enterprise_auth && userInfo.enterprise_auth.edit)" type="link" style="padding: 0; margin-right: 5px;" @click="$router.push({ name: 'enterpriseServeEdit', query: { enterpriseLawServeId: record.enterprise_entry_id } })">编辑</a-button>
            <a-button type="link" style="padding: 0;" @click="openEnterpriseDetailDrawer(record)">查看详情</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 详情 drawer -->
    <a-drawer
      title="企业套餐详情"
      destroyOnClose
      :width="500"
      :visible="enterpriseDetailDrawer.isShowDetailDrawer"
      @close="onEnterpriseDetailDrawerCloseEvt"
    >
      <div class="deatil-drawer">
        <!-- 企业名称 -->
        <div class="info-item">
          <div class="info-left">企业名称：</div>
          <div class="info-middle">{{ enterpriseDetailDrawer.enterpriseLawServeInfo.enterprise_name }}</div>
        </div>

        <!-- 关联企业 -->
        <div v-for="(rItem, rIndex) of enterpriseDetailDrawer.enterpriseLawServeInfo.associated_enterprises" :key="rIndex" class="info-item">
          <div class="info-left">关联企业{{ rIndex + 1 }}：</div>
          <div class="info-middle" style="font-size: 14px;">{{ rItem }}</div>
        </div>

        <!-- 行业 -->
        <div class="info-item">
          <div class="info-left">行业：</div>
          <div class="info-middle">{{ enterpriseDetailDrawer.enterpriseLawServeInfo.industry }}</div>
        </div>
        <!-- 套餐类型 -->
        <div class="info-item">
          <div class="info-left">套餐类型：</div>
          <div v-if="enterpriseDetailDrawer.enterpriseLawServeInfo.enterprise_vip" class="info-middle" style="color: #1790ff;">{{ enterpriseDetailDrawer.enterpriseLawServeInfo.enterprise_vip.title }} {{ enterpriseDetailDrawer.enterpriseLawServeInfo.enterprise_vip.price }}/年</div>
        </div>
        <!-- 起止时间 -->
        <div class="info-item">
          <div class="info-left">起止时间：</div>
          <div class="info-middle" style="color: #1790ff;">{{ enterpriseDetailDrawer.enterpriseLawServeInfo.start_time }} 至 {{ enterpriseDetailDrawer.enterpriseLawServeInfo.end_time }}</div>
        </div>
        <!-- 使用人名称 -->
        <div class="info-item">
          <div class="info-left">使用人名称：</div>
          <div class="info-middle">{{ enterpriseDetailDrawer.enterpriseLawServeInfo.name }}</div>
        </div>
        <!-- 使用人手机号 -->
        <div class="info-item">
          <div class="info-left">使用人手机号：</div>
          <div class="info-middle">{{ enterpriseDetailDrawer.enterpriseLawServeInfo.mobile }}</div>
        </div>

        <!-- 关联企业 -->
        <div v-for="(rItem, rIndex) of enterpriseDetailDrawer.enterpriseLawServeInfo.enterprise_affiliated" :key="rIndex" class="info-item">
          <div class="info-left">附属人{{ rIndex + 1 }}：</div>
          <div class="info-middle otherContact-midddle">
            <div class="otherContact-item">姓名：{{ rItem.name }}</div>
            <div class="otherContact-item">手机号：{{ rItem.mobile }}</div>
            <div class="otherContact-item">职位：{{ rItem.position }}</div>
          </div>
        </div>
        
        <!-- 法务管家 -->
        <div class="info-item">
          <div class="info-left">法务管家：</div>
          <div v-if="enterpriseDetailDrawer.enterpriseLawServeInfo.legal_affairs" class="info-middle">{{ enterpriseDetailDrawer.enterpriseLawServeInfo.legal_affairs.name }}</div>
        </div>
        <!-- 销售 -->
        <div class="info-item">
          <div class="info-left">销售：</div>
          <div class="info-middle">{{ enterpriseDetailDrawer.enterpriseLawServeInfo.sales_name }}</div>
        </div>

        <a-button v-if="(userInfo.enterprise_auth && userInfo.enterprise_auth.edit) || !userInfo.enterprise_auth" type="primary" style="width: 120px; margin-left: 150px; margin-top: 50px;" @click="$router.push({ name: 'enterpriseServeEdit', query: { enterpriseLawServeId: enterpriseDetailDrawer.enterpriseLawServeInfo.enterprise_entry_id } })">编辑</a-button>
      </div>
    </a-drawer>
  </a-layout>
</template>

<script>
import * as lawServeApi from '@/api/lawServeApi'
import * as sellPlatformApi from '@/api/sellPlatformApi'
import { mapState } from 'vuex'
import moment from 'moment'

// 企业套餐详情
const ENTERPRISE_DETAIL_DRAWER = {
  isShowDetailDrawer: false, // 是否显示
  enterpriseLawServeInfo: {}, // 企业套餐信息
}

export default {
  name: 'EnterpriseServeList',
  data() {
    return {
      tableDataList: [], // table 列表
      tableDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getEnterpriseLawServeList(page)
          this.pagination.current = page
        },
      },

      searchEnterpriseName: '', // 搜索企业名称
      lawServeVipId: '', // 法律套餐类型 id
      lawServeVipSelectList: [], // 套餐类型 select 列表
      
      // 过滤条件
      filterInfo: {
        startDate: '', // 开始时间
        endDate: '', // 结束时间
      },

      enterpriseDetailDrawer: Object.assign({}, ENTERPRISE_DETAIL_DRAWER), // 企业详情 drawer
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getEnterpriseLawServeList()
    this._getLawServeVipList()
  },
  methods: {
    moment,

    /**
     * 获取企业套餐列表
     */
     async _getEnterpriseLawServeList(page = 1) {
       const param = { page, size: this.pagination.pageSize }
       // 企业套餐 id 条件
       this.lawServeVipId && (param.enterprise_vip_id = this.lawServeVipId)
       // 时间段 条件
       this.filterInfo.startDate && (param.start_time = this.filterInfo.startDate)
       this.filterInfo.endDate && (param.end_time = this.filterInfo.endDate)
       // 企业名称  
       this.searchEnterpriseName && (param.name = this.searchEnterpriseName)
       
       this.tableDataLoading = true

       try {
         const { data: enterpriseLawServeData } = await lawServeApi.getEnterpriseLawServeListApi(param)
         this.tableDataList = enterpriseLawServeData.data
         this.pagination.total = enterpriseLawServeData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取企业服务套餐列表
     */
     async _getLawServeVipList() {
       try {
         const { data: lawServeListData } = await lawServeApi.getLawServeVipListApi()

         const _tempSelectList = []
         for (const lItem of lawServeListData) {
           const selectOpt = { label: `${ lItem.title } ${ lItem.price }/年`, value: lItem.enterprise_vip_id, }
           _tempSelectList.push(selectOpt)
         }
         this.lawServeVipSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.filterInfo.startDate = dateStrAry[0]
      this.filterInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this._getEnterpriseLawServeList()
    },

    /**
     * 搜索
     */
    getSearchData() {
      this._getEnterpriseLawServeList()
    },

    /**
     * 查看律详情
     */
    redirectDetail(record) {
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },

    /**
     * 打开企业详情 drawer
     */
    openEnterpriseDetailDrawer(recode) {
      this.enterpriseDetailDrawer.isShowDetailDrawer = true
      this.enterpriseDetailDrawer.enterpriseLawServeInfo = recode
      console.log(recode)
    },

    /**
     * 监听关闭企业套餐详情 drawer 事件
     */
    onEnterpriseDetailDrawerCloseEvt() {
      console.log('关闭')
      this.enterpriseDetailDrawer = Object.assign({}, ENTERPRISE_DETAIL_DRAWER)
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
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
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
}

.deatil-drawer {
  .info-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    .info-left {
      font-size: 14px;
      font-weight: 600;
      width: 98px;
    }
    .info-middle {
      display: flex;
      justify-content: flex-start;
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      &.otherContact-midddle {
        font-size: 12px;
        .otherContact-item {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
