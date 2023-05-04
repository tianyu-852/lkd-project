<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">开户总数：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddAccountModal">新开账户</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.customer_label_id)"
        bordered
      >
        <!-- id -->
        <!-- <a-table-column dataIndex="customer_label_id" title="ID" align="center" /> -->

        <!-- 用户id -->
        <a-table-column dataIndex="customer_label_id" title="用户ID" align="center" />

        <!-- 用户昵称 -->
        <a-table-column dataIndex="customer_label_id" title="用户昵称" align="center" />

        <!-- 套餐 -->
        <a-table-column dataIndex="customer_label_id" title="套餐" align="center" />

        <!-- 有效期 -->
        <a-table-column key="created_at" dataIndex="created_at" title="有效期" align="center" />

        <!-- 备注 -->
        <a-table-column dataIndex="name" title="备注" align="center" />

        <!-- 开户时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="开户时间" align="center" />

        <!-- 开户销售 -->
        <a-table-column dataIndex="customer_label_id" title="开户销售" align="center" />

        <!-- 状态 -->
        <a-table-column dataIndex="customer_label_id" title="状态" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="margin-right: 10px" @click="openPutLabelModal(record)">编辑</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 账户 modal -->
    <a-modal
      v-model="isShowAccountModal"
      :title="'新增账户'"
      :width="500"
      :afterClose="onAccountModalAfterClose"
      destroyOnClose
      @ok="onAccountModalOkEvt"
    >
      <div class="account-modal">
        <!-- 用户手机号 -->
        <div class="input-item">
          <div class="input-title">用户手机号：</div>
          <a-input class="input" v-model="accountModalInfo.mobile" :maxLength="10" placeholder="请输入" allowClear />
        </div>
        <!-- 套餐 -->
        <div class="input-item">
          <div class="input-title">套餐：</div>
          <a-select style="width: 140px" placeholder="请选择套餐" @change="onAccountModalTaoCanSelectChangeEvt">
            <a-select-option v-for="sItem in taoCanSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 有效期 -->
        <div class="input-item">
          <div class="input-title">有效期：</div>
          <a-range-picker
            class="date-range-picker"
            :placeholder="['开始日期', '结束日期']"
            :default-value="[filterInfo.startDate, filterInfo.endDate]"
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }"
            @change="onAccountModalTaocanDateChangeEvt"
            @ok="onAccountModalTaocanDateOkEvt"
          />
        </div>

        <!-- 有效期 -->
        <div class="input-item">
          <div class="input-title">备注：</div>
          <a-input class="input" v-model="accountModalInfo.mobile" :maxLength="10" placeholder="请输入" allowClear />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as sellApi from '@/api/sellApi'

// 账户信息
const ACCOUNT_INFO = { mobile: '', taocan: 0, taocanStartTime: '', taocanEndTime: '', remark: '' }

export default {
  name: 'SellOpenAccount',
  data() {
    return {
      tabelDataList: [], // table列表
      tabelDataLoading: true, // table 数据是否加载中
      // table 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getSellLabelList(page)
          this.pagination.current = page
        },
      },

      isShowAccountModal: true, // 是否打开标签 Modal
      accountModalInfo: Object.assign({}, ACCOUNT_INFO), // 标签 modal 信息

      // 套餐 select 列表
      taoCanSelectList: [
        { label: '基础版', value: 1, },
        { label: '优享版', value: 2, },
        { label: '尊享版', value: 3, },
        { label: '钻石版', value: 4, },
        { label: '铂金版', value: 5, },
      ],

      // 过滤条件
      filterInfo: {
        // startDate: '', // 开始时间
        // endDate: '', // 结束时间
        startDate: moment().add(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), // 开始时间
        endDate: moment().add(1, 'years').endOf('day').format('YYYY-MM-DD HH:mm:ss'), // 结束时间
      },
    }
  },
  created() {
    this._getSellLabelList()
  },
  methods: {
    moment,
    /**
     * 获取标签列表
     */
     async _getSellLabelList(page = 1) {
       const param = { page, size: this.pagination.pageSize }

       try {
         const { data: labelListData } = await sellApi.getSellLabelListApi(param)
         this.tabelDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 监听套餐 select change事件 
     */
    onAccountModalTaoCanSelectChangeEvt(value) {
      // this.transferModalInfo.toSellId = value
      this.accountModalInfo.taocan = value
      // console.log(value)
    },

    /**
     * 套餐 RangePicker 发生变化的回调
     */
    onAccountModalTaocanDateChangeEvt(date, dateStrAry) {
      console.log(date)
      console.log(dateStrAry)
      // this.filterInfo.startDate = dateStrAry[0]
      // this.filterInfo.endDate = dateStrAry[1]
    },

    onAccountModalTaocanDateOkEvt() {
      console.log('确定')
    },

    /**
     * 打开「添加模式」标签 modal
     */
    openAddAccountModal() {
      // this.labelModalType = 0 // 添加模式
      this.accountModalInfo = Object.assign({}, ACCOUNT_INFO)
      this.isShowAccountModal = true
    },

    /**
     * 标签 Modal 完全关闭后的回调
     */
    onAccountModalAfterClose() {
      // 重置账户 modai 信息
      this.accountModalInfo = Object.assign({}, ACCOUNT_INFO)
    },

    /**
     * 监听标签 modal ok 事件
     */
    onAccountModalOkEvt() {
      // const { labelModalInfo, labelModalType } = this
      // if (!labelModalInfo.name.trim()) return this.$message.warning('请输入标签名称')

      // this.isShowLabelModal = false
      console.log(this.accountModalInfo)
      // labelModalType === 1 ? 更新 : 添加
      // labelModalType === 1 ? this._putLabel(labelModalInfo) : this._addLabel(labelModalInfo)
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
}

.account-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 14px;
    &:last-child { margin-bottom: 0 }
    .input-title {
      font-size: 14px;
      font-weight: 500;
      min-width: 85px;
    }
    // .input {
    //   flex: 1;
    // }
  }
}
</style>
