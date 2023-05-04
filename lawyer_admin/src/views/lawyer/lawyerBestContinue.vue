<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span style="margin-left: 6px;">续费优选会员</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="lawyer-info-module">
        <div class="lawyer-info">
          <img :src="lawyerInfo.avatar" style="width: 60px; height: 60px; border-radius: 50%; margin-right: 6px;" />
          <div>
            <div>{{ lawyerInfo.nickname }}</div>
            <div style="font-size: 14px; color: #999;">{{ lawyerInfo.mobile }}</div>
          </div>
        </div>

        <a-popconfirm title="请确认是否续费优选套餐?" @confirm="confirmBestVipContinue">
          <a-button type="primary" style="margin-left: 150px;">立即续费</a-button>
        </a-popconfirm>
      </div>

      <div class="open-form-module">
        <!-- 套餐类型 -->
        <div class="open-form-item">
          <span class="form-key">套餐类型:</span>
          <a-select style="width: 192px;" v-model="optimization_plan_id" @change="onOpenFormBestVipChangeEvt">
            <a-select-option v-for="sItem in mealSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 预计收益 -->
        <div class="open-form-item">
          <span class="form-key">预计收益:</span>
          <a-input allow-clear placeholder="预计收益" v-model="price" style="width: 192px" />
        </div>
        <!-- 订单次数 -->
        <div class="open-form-item">
          <span class="form-key">订单次数:</span>
          <a-input allow-clear placeholder="订单次数" v-model="total_num" style="width: 192px" />
        </div>
        <!-- 赠送订单次数 -->
        <div class="open-form-item">
          <span class="form-key">赠送订单次数:</span>
          <a-input allow-clear placeholder="赠送订单次数(选填)" v-model="add_num" style="width: 192px" />
        </div>
        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐结束时间:</span>
          <a-date-picker v-model="end_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>
      </div>
    </a-card>

    <a-card class="content">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 20px;">
        <span>律师开通套餐历史列表</span>
        <span style="margin-left: 30px;">总收益：￥{{ tableDataTotalIncome }}</span>
      </div>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.optimization_warehouse_id)"
        bordered
      >
        <!-- 套餐类型 -->
        <a-table-column dataIndex="optimization_plan.name" title="套餐类型" align="center" />

        <!-- 套餐时间 -->
        <a-table-column title="套餐时间" align="center">
          <template slot-scope="record">
            <div>{{ record.open_time }}</div>
            至 
            <div>{{ record.end_time }}</div>
          </template>
        </a-table-column>

        <!-- 预计收益 -->
        <a-table-column dataIndex="price" title="预计收益" align="center" />

        <!-- 实际收益 -->
        <a-table-column dataIndex="current_package_earnings" title="实际收益" align="center" />

        <!-- 次数 -->
        <a-table-column title="次数" align="center">
          <template slot-scope="record">
            <div>订单次数：{{ record.total_num }}</div>
            <div>赠送次数：{{ record.add_num }}</div>
          </template>
        </a-table-column>

        <!-- 状态 -->
        <a-table-column title="状态" align="center">
          <template slot-scope="record">
            <div>{{ record.status_text }}</div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
          <template slot-scope="text, record, index">
            <div>
              <a-popconfirm v-if="(index + 1 === tableDataList.length) && record.status === 2" title="是否确认要删除该套餐？" @confirm="deleteLawyerBestVip(record, index)" >
                <a-button type="danger" size="small">删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as lawyerApi from '@/api/lawyer'

export default {
  name: 'LawyerBestContinue',
  data() {
    return {
      lawyerInfo: {},
      
      tableDataTotalIncome: 0, // 总收益
      tableDataLoading: false,
      tableDataList: [],
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 50,
        showQuickJumper: true,
        onChange: page => {
          this._getBestLawyerVipOpenList(page)
          this.pagination.current = page
        },
      },

      mealSelectList: [], // 套餐 select 列表
      optimization_plan_id: '', // 优选会员套餐 id
      price: '', // 预计收益
      total_num: '', // 订单次数
      add_num: '0', // 赠送数量
      end_time: '', // 结束时间
    }
  },
  created() {
     this.lawyerInfo = JSON.parse(sessionStorage.getItem('lawyerInfoSession'))
     this._getBestLawyerMealList()
     this._getBestLawyerVipOpenList()
  },
  methods: {
    moment,

    /**
     * 获取优选律师开通套餐 列表
     */
     async _getBestLawyerMealList() {
       try {
         const { data: mealData } = await lawyerApi.getBestLawyerMealListApi()
         const serverMenuObj = { 1: '/月卡', 2: '/年卡', 3: '' }
         for (const mItem of mealData.data) {
           const selectOpt = { label: `${ mItem.name }${ serverMenuObj[mItem.version] }`, value: mItem.optimization_plan_id }
           this.mealSelectList.push(selectOpt)
         }
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取优选律师开通 vip 列表
     */
     async _getBestLawyerVipOpenList(page = 1) {
       const param = {
        page,
        size: this.pagination.pageSize,
        user_id: this.lawyerInfo.user_id,
       }
       
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getBestLawyerVipOpenListApi(param)
         this.tableDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tableDataTotalIncome = labelListData.total_earnings // 总收益
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取优先会员详情
     */
    async onOpenFormBestVipChangeEvt(bestVipId) {
      const param = { optimization_plan_id: bestVipId }

      try {
        const { data: bestVipData } = await lawyerApi.getBestVipDetailApi(param)
        this.total_num = `${ bestVipData.num * bestVipData.day }`
        this.price = `${ bestVipData.price }`
        if (this.tableDataList.length) {
          const lastBestVipEndTime = this.tableDataList.at(-1).end_time
          this.end_time = moment(lastBestVipEndTime).add(bestVipData.day, 'days')
        } else {
          this.end_time = moment().add(bestVipData.day, 'days')
        }
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 立即续费优选套餐
     */
    async confirmBestVipContinue() {
      if (!this.optimization_plan_id) return this.$message.warning('请选择续费优选套餐')
      
      const param = {
        optimization_plan_id: this.optimization_plan_id,
        user_id: this.lawyerInfo.user_id,
        price: this.price.trim(),
        total_num: this.total_num.trim(),
        add_num: this.add_num.trim(),
        end_time: moment(this.end_time).format('YYYY-MM-DD HH:mm:ss'),
      }

      try {
        await lawyerApi.postOpenBestVipApi(param)
        this._getBestLawyerVipOpenList()
        this.$notification.success({ message: '续费成功', duration: 3 })
        // 重置续费套餐信息
        this.optimization_plan_id = ''
        this.price = ''
        this.total_num = ''
        this.add_num = '0'
        this.end_time = ''
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除律师优选 套餐
     */
    async deleteLawyerBestVip(record) {
      console.log(record)
      const param = { optimization_warehouse_id: record.optimization_warehouse_id, }

      try {
        await lawyerApi.delLawyerBestVipApi(param)
        this._getBestLawyerVipOpenList()
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
  .back-wrap {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
}

.content {
  margin-top: 16px;
  .lawyer-info-module {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    .lawyer-info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .open-form-module {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .open-form-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 20px;
      &:last-child { margin-bottom: 0; }
      .form-key {
        min-width: 120px;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
</style>
