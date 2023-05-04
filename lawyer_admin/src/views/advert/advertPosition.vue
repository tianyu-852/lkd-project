<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">位置总数：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddAdvertPositionModal">新增位置</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getAdvertPositionList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="record => String(record.advertisement_position_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="advertisement_position_id" title="ID" align="center" />

        <!-- 位置说明 -->
        <a-table-column dataIndex="title" title="位置说明" align="center" />

        <!-- 展现规则 -->
        <a-table-column dataIndex="show_rule" title="展现规则" align="center" />

        <!-- 展示类型 -->
        <a-table-column dataIndex="source_type" title="来源类型 " align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <!-- <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutLabelModal(record)">更新</a-button> -->
            <a-popconfirm title="请确认是否删除该广告?" ok-text="删除" cancel-text="取消" @confirm="delAdvert(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 角色 modal -->
    <a-modal
      v-model="advertPositionModalInfo.isShowAdvertPositionModal"
      :title="advertPositionModalInfo.advertPositionModalType ? '更新位置' : '新增位置'"
      :width="500"
      :afterClose="onAdvertPositionModalAfterClose"
      destroyOnClose
      @ok="onAdvertPositionModalOkEvt"
    >
      <div class="advert-modal">
        <div class="input-item">
          <div class="input-title">位置标题：</div>
          <a-input class="input" v-model="advertPositionModalInfo.title" :maxLength="-1" placeholder="请输入标题" allowClear />
        </div>

        <div class="input-item">
          <div class="input-title">广告分类：</div>
          <a-select style="width: 150px;" v-model="advertPositionModalInfo.advertisement_position_group_id">
            <a-select-option v-for="(rItem, rIndex) in advertClassSelectList" :value="rItem.value" :key="rIndex">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 展现规则 -->
        <div class="input-item">
          <div class="input-title">展现规则：</div>
          <a-select style="width: 150px;" v-model="advertPositionModalInfo.show_rule">
            <a-select-option v-for="(rItem, rIndex) in advertPositionRuleSelectList" :value="rItem.value" :key="rIndex">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as advertApi from '@/api/advertApi'

// 广告位置信息
const ADVERT_POSITION_INFO = {
  title: '', // banner
  advertisement_position_group_id: '', // 广告分类 id
  show_rule: '', // 广告展现规则
  isShowAdvertPositionModal: false, // 是否显示广告 modal
  advertPositionModalType: 0, // 广告位置 Modal 类型 0: 添加 1: 更新
}

export default {
  name: 'AdvertPosition',
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
          this._getSellPlatformUserList(page)
          this.pagination.current = page
        },
      },
      
      advertPositionModalInfo: Object.assign({}, ADVERT_POSITION_INFO), // 广告 modal 信息

      advertClassSelectList: [], // 广告分类 select
      advertPositionRuleSelectList: [{ label: '播一张', value: 0 }, { label: '随机播', value: 1 }, { label: '多张轮播', value: 2 }], // 广告位置规则 select
    }
  },
  created() {
    this._getAdvertPositionList()
    this._getAdvertClassList()
  },
  methods: {
    /**
     * 获取广告位置列表
     */
     async _getAdvertPositionList(page = 1) {
       const param = { page, size: this.pagination.pageSize }
       this.tableDataLoading = true

       try {
         const { data: advertPositionData } = await advertApi.getAdvertPositonListApi(param)
         this.tableDataList = advertPositionData.data
         this.pagination.total = advertPositionData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取广告分类列表
     */
     async _getAdvertClassList() {
       try {
         const { data: advertClassData } = await advertApi.getAdvertClassListApi()
         const tempSelectList = []
         for (const dItem of advertClassData) {
           const selectOpt = { label: dItem.title, value: dItem.advertisement_position_group_id, }
           tempSelectList.push(selectOpt)
         }
         
         this.advertClassSelectList = tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 打开「添加模式」广告 modal
     */
    openAddAdvertPositionModal() {
      this.advertPositionModalInfo.advertPositionModalType = 0 // 添加模式
      this.advertPositionModalInfo = Object.assign({}, ADVERT_POSITION_INFO)
      this.advertPositionModalInfo.isShowAdvertPositionModal = true
    },

    /**
     * 打开「更新模式」广告 modal
     */
    openPutLabelModal(record) {
      this.advertPositionModalInfo.advertPositionModalType = 1 // 更新模式
      // this.advertPositionModalInfo.name = record.name
      // this.advertPositionModalInfo.mobile = record.mobile
      // this.advertPositionModalInfo.sex = record.sex
      // this.advertPositionModalInfo.putSellPlatformUserId = record.financial_legal_sales_relation_id // 待更新用户 id
      // this.advertPositionModalInfo.isShowAdvertPositionModal = true
    },

    /**
     * 广告位置 Modal 完全关闭后的回调
     */
    onAdvertPositionModalAfterClose() {
      this.advertPositionModalInfo = Object.assign({}, ADVERT_POSITION_INFO)
    },

    /**
     * 监听广告位置 modal ok 事件
     */
    onAdvertPositionModalOkEvt(event) {
      const { advertPositionModalInfo } = this
      const advertPositionModalType = advertPositionModalInfo.advertPositionModalType
      if (!advertPositionModalInfo.title.trim()) return this.$message.warning('请输入位置名称')
      if (!advertPositionModalInfo.show_rule) return this.$message.warning('请选择展示规则')
      if (!advertPositionModalInfo.advertisement_position_group_id) return this.$message.warning('请选择广告分类')
      
      this.advertPositionModalInfo.isShowAdvertPositionModal = false
      
      // advertPositionModalType === 1 ? 更新 : 添加
      advertPositionModalType === 1 ? this._putSellPlatformUser(advertPositionModalInfo) : this._addAdvertPosition(advertPositionModalInfo)
    },

    /**
     * 添加广告位置
     */
     async _addAdvertPosition(advertPositionModalInfo) {
       const param = {
         title: advertPositionModalInfo.title.trim(),
         show_rule: advertPositionModalInfo.show_rule,
         advertisement_position_group_id: advertPositionModalInfo.advertisement_position_group_id,
       }

       try {
         const { data } = await advertApi.postAddAdvertPositionApi(param)
         this._getAdvertPositionList()
         this.$notification.success({ message: '添加成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
     },


    /**
     * 更新广告位置
     */
    async _putSellPlatformUser(advertPositionModalInfo) {
      const param = {
        financial_legal_sales_relation_id: advertPositionModalInfo.putSellPlatformUserId,
        name: advertPositionModalInfo.name.trim(),
        sex: advertPositionModalInfo.sex,
      }

      try {
        const { data } = await advertApi.putSellPlatformUserApi(param)
        this._getSellPlatformUserList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除广告
     */
    async delAdvert(advertRecord) {
      const { advertisement_id } = advertRecord
      if (!advertisement_id) return

      try {
        const { data } = await advertApi.delAdvertApi({ advertisement_id })
        // 更新当页数据
        this._getAdvertPositionList(this.pagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
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
  .qrcode-image {
    cursor: pointer;
    .qrcode-img {
      width: 120px;
      height: 120px;
    }
  }
}

.advert-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
      min-width: 74px;
    }
    .input {
      flex: 1;
    }
    .upload-box {
      position: relative;
      width: 200px;
      height: 140px;
      cursor: pointer;
      .null-wrap {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        background: #F5F5F5;
        border: dashed 1px #666;
      }
      .upload-img {
        width: 100%;
        height: 100%;
      }
      .icon-close {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        cursor: pointer;
      }
    }
  }
}
</style>
