<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="icon-back" style="cursor: pointer; padding-right: 10px;" @click="$router.back(-1)">←</span>
      <span class="focus-text">优先推送律师：{{ pagination.total }}</span>
      <a-button type="primary" style="margin-left: auto;" @click="openAddPushModal">添加</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getBestLawyerPustList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_id)"
        :scroll="{ x: 2600 }"
        bordered
      >
        <!-- 姓名 -->
        <a-table-column key="nickname" title="姓名" align="center" :width="220">
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
        <a-table-column align="center" width="170px">
          <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span>开通套餐</span>
            <!-- <a-select style="width: 160px; margin-top: 5px;" v-model="activeMealId" allowClear @change="_getBestLawyerPustList()">
              <a-select-option v-for="sItem in mealSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select> -->
          </div>

          <template slot-scope="record">
            {{ record.optimization_plan || '' }}
          </template>
        </a-table-column>

        <!-- 订单次数 -->
        <a-table-column title="订单次数" align="center">
          <template slot-scope="record">
            <div>{{ record.optimization_order_num }}/{{ record.total_num }}</div>
          </template>
        </a-table-column>

        <!-- 订单收益 -->
        <a-table-column title="订单收益" align="center">
          <template slot-scope="record">
            <div>￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
          </template>
        </a-table-column>

        <!-- 套餐开通时间 -->
        <a-table-column dataIndex="optimal_enjoy_open_time" title="套餐开通时间" align="center" />

        <!-- 套餐结束时间 -->
        <a-table-column dataIndex="optimal_enjoy_end_time" title="套餐结束时间" align="center" />

        <!-- 负责销售 -->
        <a-table-column key="remark" title="负责销售" align="center" width="200px">
          <template slot-scope="record">
            <div class="column-remark-wrap">
              <a-popover title="负责销售">
                <template slot="content">
                  <div style="width: 360px;">{{ record.customer_remark }}</div>
                </template>
                <div class="remark-info">
                  <div class="remark">{{ record.customer_remark }}</div>
                </div>
              </a-popover>
            </div>
          </template>
        </a-table-column>

        <!-- 今日次数是否上限 -->
        <a-table-column title="今日次数是否上限" align="center">
          <template slot-scope="record">
            <div>{{ record.today_num_to_achieve ? '是' : '否' }}</div>
          </template>
        </a-table-column>

        <!-- 今日收益是否上限 -->
        <a-table-column title="今日收益是否上限" align="center">
          <template slot-scope="record">
            <div>{{ record.today_earnings_to_achieve ? '是' : '否' }}</div>
          </template>
        </a-table-column>

        <!-- 所属律师所 -->
        <a-table-column key="lawyer_office" title="所属律师所" align="center" :width="260">
          <template slot-scope="record">
            <div>
              <span>{{ record.lawyer_office }}</span>
              <div>
                <span style="margin-right: 10px;">经度:{{ record.lawyer_office_lng }}</span>
                <span>纬度:{{ record.lawyer_office_lat }}</span>
              </div>
              <div>
                <span>地址:{{ record.lawyer_office_address }}</span>
              </div>
            </div>
          </template>
        </a-table-column>

        <!-- 执业年限 -->
        <a-table-column key="register_at" align="center">
          <div slot="title">
            执业年限
            <br />
            注册时间
          </div>
          <template slot-scope="record">
            <div style="text-align: center">
              {{ record.start_work_time }}
              <br />
              {{ record.register_at }}
              <br />
              {{ record.work_year ? '执业' + record.work_year + '年' : '' }}
            </div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="240px">
          <template slot-scope="text, record, index">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
              <!-- 删除 -->
              <a-popconfirm placement="leftBottom" ok-text="确认" @confirm="removeBestLawyerPush(record.user_id, index)" >
                <template slot="title">是否移除优先推送？</template>
                <a-button type="danger" size="small" style="margin-right: 5px">移除</a-button>
              </a-popconfirm>
              <!-- 查看 -->
              <a-button type="primary" style="margin-right: 5px" size="small" @click="redirectDetail(record)">查看</a-button>

              <!-- 权益详情 -->
              <a-button type="primary" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 添加优先推送 modal -->
    <a-modal
      v-model="isShowCheckedModal"
      :width="600"
      destroyOnClose
      @ok="onCheckModalOkEvt"
    >
      <div slot="title">
        <span style="font-size: 18px; font-wight: 500; margin-right: 8px;">选择律师</span>
        <a-input allow-clear placeholder="搜索姓名/手机号" v-model="searchLawyerKeyword" @keyup.enter="openOpenBestModal" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="openAddPushModal">搜索</a-button>
      </div>
      <div class="checked-modal">
        <!-- <div class="checked-header">添加优先推送律师</div> -->
        <!-- <div class="checked-header">添加</div> -->
        <div class="checked-body">
          <div v-for="(cItem, cIndex) in waitCheckedList" :key="cIndex" class="checked-item" @click="waitCheckedList[cIndex].isChecked = !waitCheckedList[cIndex].isChecked">
            <img :src="cItem.avatar" style="width: 30px; height: 30px; margin-right: 6px;" />
            <span>{{ cItem.nickname }}</span>
            <img v-if="cItem.isChecked" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
            <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>
<script>
import * as lawyerApi from '@/api/lawyer'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'
import { mapState } from 'vuex'

export default {
  name: 'LawyerBestPush',
  components: { UserVipCell, UserMutedButton },
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
          this._getBestLawyerPustList(page)
          this.pagination.current = page
        },
      },

      mealSelectList: [{ label: '全部', value: '' }], // 开通套餐 select 列表
      activeMealId: '', // 选中的套餐 id

      putLawyerUserId: 0, // 待更新律师 id
      isShowCheckedModal: false, // 是否显示添加 modal
      waitCheckedList: [], // 待选择  列表

      searchLawyerKeyword: '', // 搜索关键字
    }
  },
  created() {
    this._getBestLawyerPustList()
  },
  methods: {
    /**
     * 获取优选推送律师列表
     */
     async _getBestLawyerPustList(page = 1) {
       const param = { page, size: this.pagination.pageSize, optimization_plan_id: this.activeMealId, type: 1 }
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getBestLawyerListApi(param)
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
     * 查看律详情
     */
    redirectDetail(record) {
      sessionStorage.setItem('lawyerCondition', JSON.stringify(this.conditionData))
      const userId = String(record.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
    /**
     * 进入优选律师详情
     */
    navToBestLawyerDetail(record) {
      sessionStorage.setItem('bestLawyerDetail', JSON.stringify(record))
      const userId = String(record.user_id)
      this.$router.push({ name: 'LawyerBestDetail', query: { lawyerUserId: userId } })
    },
    /**
     * 打开添加推送 modal
     */
    async openAddPushModal() {
      const param = { type: 1 }
      if (this.searchLawyerKeyword.trim()) param.search = this.searchLawyerKeyword.trim()
      
      try {
         const { data: waitCheckedData } = await lawyerApi.getBestLawyerWaitPushListApi(param)
         this.waitCheckedList = waitCheckedData.data.map(item => {
          item.isChecked = false
          return item
         })
         this.isShowCheckedModal = true
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 添加律师优选推送
     */
    async onCheckModalOkEvt() {
      const { waitCheckedList } = this
      const postLawyerUserIds = waitCheckedList.filter(item => item.isChecked).map(itm => itm.user_id)
      if (!postLawyerUserIds.length) return this.$message.warning('请选择律师')
      this.isShowCheckedModal = false

      console.log(postLawyerUserIds)
      // return
      const param = { user_id: JSON.stringify(postLawyerUserIds), type: 1 }

      try {
         const data = await lawyerApi.updateBestLawyerPushApi(param)
         this.$notification.success({ message: '添加成功', duration: 3 })
         // 更新当页数据
         this._getBestLawyerPustList(1)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 移除优选律师 优先推送列表
     */
    async removeBestLawyerPush(userId, index) {
      console.log(typeof userId)

      const user_id = typeof userId === 'number' ? JSON.stringify(userId) : userId
      try {
         const { data } = await lawyerApi.updateBestLawyerPushApi({ user_id: user_id, type: 2 })
         this.$notification.success({ message: '移除成功', duration: 3 })
         this._getBestLawyerPustList(this.pagination.current)
       } catch (error) {
         console.log(error)
       }
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  // 销售记录
  .column-remark-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .remark-info {
      width: 140px;
      margin-right: 5px;
      text-align: left;
      .remark {
        color: #333;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .remark-plus {
      cursor: pointer;
      .anticon-plus-circle {
        cursor: pointer;
      }
    }
  }
  // 列 标签
  .column-label-wrap {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    cursor: pointer;
    .ant-tag {
      margin-right: 0;
      max-width: 100px;
      cursor: pointer;
      
      -webkit-line-clamp: 1;
      white-space: normal;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

.checked-modal {
  .checked-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .checked-body {
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
      height: 50px;
      border-radius: 6px;
      padding: 0 4px;
      border: 1px solid #ccc;
      cursor: pointer;
      .checkbox-img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        margin-left: auto;
      }
    }
  }
}

</style>
