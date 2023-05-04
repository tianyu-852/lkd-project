<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">线索标签总数：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddLabelModal">新增标签</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getCauseSourceClueLabelList(pagination.current)">刷新</a-button>
      </div>
      
      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.customer_label_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="customer_label_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="创建时间" align="center" />

        <!-- 标签名称 -->
        <a-table-column dataIndex="name" title="标签名称" align="center" />

        <!-- 后台权限 -->
        <a-table-column key="action" title="后台权限" align="center">
          <template slot-scope="record">
            <span v-for="(aItem, aIndex) in record.admins" :key="aIndex">{{ aItem }}、</span>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 10px" @click="openPutLabelModal(record)">编辑标签</a-button>
            <a-button type="link" style="padding: 0; margin-right: 0;" @click="openHoutaiAccountModal(record)">销售权限</a-button>
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

    <!-- 后台账号设置 线索标签权限 modal -->
    <a-modal
      v-model="houtaiModal.isShowOpenAccountModal"
      title="设置销售后台账号「线索标签权限」"
      :width="600"
      :afterClose="onHoutaiModalAfterClose"
      destroyOnClose
      @ok="onHoutaiModalOkEvt"
    >
      <div class="houtai-modal">
        <div class="input-item">
          <a-input class="input" v-model="houtaiModal.houtaiSearch" :maxLength="10" placeholder="请输入后台用户名/账号" allowClear />
          <a-button type="primary" style="margin-left: 10px;" @click="searchHoutaiAccountList">搜索</a-button>
        </div>

        <div class="search-wrap">
          <div v-for="(cItem, cIndex) in houtaiModal.houtaiAccountList" :key="cIndex" class="checked-item" @click="houtaiModal.houtaiAccountList[cIndex].isChecked = !houtaiModal.houtaiAccountList[cIndex].isChecked">
            <img :src="cItem.avatar" style="width: 30px; height: 30px; margin-right: 6px;" />
            <div>
              <div>{{ cItem.nickname }}</div>
              <div style="font-size: 14px; color: #999;">{{ cItem.account }}</div>
            </div>
            <img v-if="cItem.isChecked" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
            <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as sellApi from '@/api/sellApi'
import * as permissionApi from '@/api/permissions'
import * as causeSourceApi from '@/api/causeSourceApi'

const LABEL_INFO = { name: '', type: 2 }

// 销售后台账号权限 modal
const HOUTAI_MODAL = {
  isShowOpenAccountModal: false,
  houtaiSearch: '', // 搜索关键字
  houtaiAccountList: [], // 后台账号 列表
  customer_label_id: '',
}

export default {
  name: 'CauseSourceClueLabelPage',
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
          this._getCauseSourceClueLabelList(page)
          this.pagination.current = page
        },
      },

      labelType: 2, // 线索标签
      
      labelModalType: 0, // 标签 Modal 类型 0: 添加 1: 更新
      isShowLabelModal: false, // 是否打开标签 Modal
      labelModalInfo: Object.assign({}, LABEL_INFO), // 标签 modal 信息
      putLabelId: 0, // 待更新标签 id

      houtaiModal: Object.assign({}, HOUTAI_MODAL), // 销售后台账号 modal 信息
    }
  },
  created() {
    this._getCauseSourceClueLabelList()
  },
  methods: {
    /**
     * 获取案源线索列表
     */
     async _getCauseSourceClueLabelList(page = 1) {
       const param = { page, size: this.pagination.pageSize, type: this.labelType }

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
      this.putLabelId = record.customer_label_id // 待更新标签 id
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
        const { data } = await sellApi.postAddLabelApi(labelModalInfo)
        this._getCauseSourceClueLabelList()
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
        const { data } = await sellApi.putLabelApi(putLabelId, labelModalInfo)
        this._getCauseSourceClueLabelList(this.pagination.current)
        this.putLabelId = 0
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开设置后台账号 标签权限 modal
     */
    openHoutaiAccountModal(record) {
      this.houtaiModal.customer_label_id = record.customer_label_id // 待更新标签 id
      this.houtaiModal.isShowOpenAccountModal = true
    },

    /**
     * 监听 设置后台账号 标签权限 modal 完全关闭后的回调
     */
    onHoutaiModalAfterClose() {
      this.houtaiModal = Object.assign({}, HOUTAI_MODAL)
    },

    /**
     * 搜索后台账号列表
     */
    async searchHoutaiAccountList() {
      const { houtaiModal } = this
      if (!houtaiModal.houtaiSearch.trim()) return this.$message.warning('请输入后台账号/用户名')
      
      try {
        const { data: houtaiData } = await permissionApi.getAdminPage(1, houtaiModal.houtaiSearch.trim())
        this.houtaiModal.houtaiAccountList = houtaiData.data.map(item => {
          item.isChecked = false
          return item
         })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 设置后台账号 标签编辑权限
     */
    async onHoutaiModalOkEvt() {
      const { houtaiModal } = this
      const param = {
        customer_label_id: houtaiModal.customer_label_id,
        admin_ids: JSON.stringify(houtaiModal.houtaiAccountList.filter(item => item.isChecked).map(itm => itm.admin_id))
      }

      this.houtaiModal.isShowOpenAccountModal = false
      // console.log(param)
      // return

      try {
        const { data: houtaiData } = await causeSourceApi.setHoutaiAccountCauseSourceClueLabelRightsApi(param)

        this._getCauseSourceClueLabelList(this.pagination.current)
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
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
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

.houtai-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .input {
      flex: 1;
    }
  }
  .search-wrap {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    max-height: 300px;
    margin-top: 20px;
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
