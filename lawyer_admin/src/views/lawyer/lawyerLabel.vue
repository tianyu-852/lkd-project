<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">律师标签：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddLabelModal">新增标签</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_label_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="user_label_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="创建时间" align="center" />

        <!-- 标签名称 -->
        <a-table-column dataIndex="name" title="标签名称" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="primary" style="margin-right: 10px" @click="openPutLabelModal(record)">编辑</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 标签 modal -->
    <a-modal
      v-model="isShowLabelModal"
      :title="labelModalType ? '编辑标签' : '新增标签'"
      :width="500"
      :afterClose="onLabelModalAfterClose"
      destroyOnClose
      @ok="onLabelModalOkEvt"
    >
      <div class="label-modal">
        <div class="input-item">
          <div class="input-title">标签名称：</div>
          <a-input class="input" v-model="labelModalInfo.name" :maxLength="10" placeholder="请输入，最多10个字" allowClear />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as lawyerApi from '@/api/lawyer'

// 标签信息
const LABEL_INFO = { name: '' }

export default {
  name: 'LawyerLabel',
  data() {
    return {
      tabelDataList: [], // 标签列表
      tabelDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerLabelList(page)
          this.pagination.current = page
        },
      },
      
      labelModalType: 0, // 标签 Modal 类型 0: 添加 1: 更新
      isShowLabelModal: false, // 是否打开标签 Modal
      labelModalInfo: Object.assign({}, LABEL_INFO), // 标签 modal 信息
      putLabelId: 0, // 待更新标签 id
    }
  },
  created() {
    this._getLawyerLabelList()
  },
  methods: {
    /**
     * 获取标签列表
     */
     async _getLawyerLabelList(page = 1) {
       const param = { page, size: this.pagination.pageSize }

       try {
         const { data: labelListData } = await lawyerApi.getLawyerLabelListApi(param)
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
     * 打开「添加模式」标签 modal
     */
    openAddLabelModal() {
      this.labelModalType = 0 // 添加模式
      this.labelModalInfo = Object.assign({}, LABEL_INFO)
      this.isShowLabelModal = true
    },

    /**
     * 打开「更新模式」标签 modal
     */
    async openPutLabelModal(record) {
      this.labelModalType = 1 // 更新模式
      this.labelModalInfo.name = record.name
      this.putLabelId = record.user_label_id // 待更新标签 id
      this.isShowLabelModal = true
    },

    /**
     * 标签 Modal 完全关闭后的回调
     */
    onLabelModalAfterClose() {
      // 重置标签信息
      this.labelModalInfo = Object.assign({}, LABEL_INFO)
    },

    /**
     * 监听标签 modal ok 事件
     */
    onLabelModalOkEvt() {
      const { labelModalInfo, labelModalType } = this
      if (!labelModalInfo.name.trim()) return this.$message.warning('请输入标签名称')

      this.isShowLabelModal = false
      console.log(labelModalType)
      // labelModalType === 1 ? 更新 : 添加
      labelModalType === 1 ? this._putLabel(labelModalInfo) : this._addLabel(labelModalInfo)
    },

    /**
     * 添加标签
     */
     async _addLabel(labelModalInfo) {
      try {
        const { data } = await lawyerApi.postAddLabelApi(labelModalInfo)
        this._getLawyerLabelList()
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 更新标签
     */
    async _putLabel(labelModalInfo) {
      const { putLabelId } = this
      if (!putLabelId) return
      
      try {
        const { data } = await lawyerApi.putLabelApi(putLabelId, labelModalInfo)
        this._getLawyerLabelList(this.pagination.current)
        this.putLabelId = 0
        this.$notification.success({ message: '更新成功', duration: 3 })
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
}

.label-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
