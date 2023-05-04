<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">优选律师套餐：{{ pagination.total }}</span>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getBestLawyerMenuList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.optimization_plan_id)"
        bordered
      >

        <!-- 套餐名称 -->
        <a-table-column title="套餐名称" align="center">
          <template slot-scope="record">
            <div v-if="record.version === 1">{{ record.name }}/月卡</div>
            <div v-else-if="record.version === 2">{{ record.name }}/年卡</div>
            <div v-else>{{ record.name }}</div>
          </template>
        </a-table-column>
        
        <!-- 数量 -->
        <a-table-column title="数量" align="center">
          <template slot-scope="record">
            <div>日均{{ record.num }}次</div>
          </template>
        </a-table-column>

        <!-- 价格 -->
        <a-table-column dataIndex="price" title="价格" align="center" />

        <!-- 权重 -->
        <a-table-column dataIndex="weight" title="权重" align="center" />

        <!-- 是否能购买 -->
        <a-table-column title="是否能购买" align="center">
          <template slot-scope="record">
            <div v-if="record.is_buy" style="color: #1790ff;">开启中</div>
            <div v-else>已关闭</div>
          </template>
        </a-table-column>

        <!-- 是否显示 -->
        <a-table-column title="是否显示" align="center">
          <template slot-scope="record">
            <div v-if="record.is_show" style="color: #1790ff;">显示中</div>
            <div v-else>已关闭</div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button v-if="record.version === 3" type="link" style="margin: 5px" size="small" @click="openEditBestMenuModal(record)">编辑</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 编辑 modal -->
    <a-modal
      v-model="editModalInfo.isShowEditModal"
      :width="360"
      title="编辑"
      destroyOnClose
      @ok="onEditBestMenuOkEvt"
    >
      <div class="edit-modal">
        <div class="edit-body">
          <div class="input-item">
            <div class="input-title">名称：</div>
            <a-input class="input" v-model="editModalInfo.name" placeholder="请输入名称" allowClear />
          </div>
          <div class="input-item">
            <div class="input-title">价格：</div>
            <a-input class="input" v-model="editModalInfo.price" placeholder="请输入名称" allowClear />
          </div>
          <div class="input-item">
            <div class="input-title">日均数量：</div>
            <a-input-number style="margin-left: auto;" v-model="editModalInfo.num" disabled :min="1" :max="10" />
          </div>
          <div class="input-item">
            <div class="input-title">权重：</div>
            <a-input-number style="margin-left: auto;" v-model="editModalInfo.weight" :min="1" :max="1000" />
          </div>

          <div class="input-item">
            <div class="input-title">是否能购买</div>

            <div class="checked-opt" style="margin-left: auto; margin-right: 40px;" @click="editModalInfo.isBuy = true">
              <img v-if="editModalInfo.isBuy" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>开启</span>
            </div>
            <div class="checked-opt" @click="editModalInfo.isBuy = false">
              <img v-if="!editModalInfo.isBuy" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>关闭</span>
            </div>
          </div>

          <div class="input-item">
            <div class="input-title">是否显示</div>

            <div class="checked-opt" style="margin-left: auto; margin-right: 40px;" @click="editModalInfo.isShow = true">
              <img v-if="editModalInfo.isShow" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>开启</span>
            </div>
            <div class="checked-opt" @click="editModalInfo.isShow = false">
              <img v-if="!editModalInfo.isShow" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>关闭</span>
            </div>
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

// 边界信息
const EDIT_MODAL_INFO = {
  isShowEditModal: false,
  name: '',
  num: 1,
  price: '',
  isBuy: false,
  isShow: false,
  putBestMenuId: '', // 待更新套餐 id
}

export default {
  name: 'LawyerBestMenu',
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
          this._getBestLawyerMenuList(page)
          this.pagination.current = page
        },
      },

      editModalInfo: Object.assign({}, EDIT_MODAL_INFO), // 编辑 modal 信息
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getBestLawyerMenuList()
  },
  methods: {
    /**
     * 获取优选律师套餐 列表
     */
     async _getBestLawyerMenuList(page = 1) {
      this.tableDataLoading = true

       try {
         const { data: menuData } = await lawyerApi.getBestLawyerMealListApi()
         this.tableDataList = menuData.data
         this.pagination.total = menuData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
        this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 打开编辑套餐弹框
     */
    openEditBestMenuModal(record) {
      this.editModalInfo.name = record.name
      this.editModalInfo.num = record.num
      this.editModalInfo.price = record.price
      this.editModalInfo.weight = record.weight
      this.editModalInfo.isBuy = record.is_buy ? true : false
      this.editModalInfo.isShow = record.is_show ? true : false
      this.editModalInfo.putBestMenuId = record.optimization_plan_id
      this.editModalInfo.isShowEditModal = true
    },
    
    /**
     * 获取优选律师备注
     */
    async onEditBestMenuOkEvt() {
      const { editModalInfo } = this
      if (!editModalInfo.putBestMenuId) return
      const param = {
        optimization_plan_id: editModalInfo.putBestMenuId,
        name: editModalInfo.name,
        num: editModalInfo.num,
        price: editModalInfo.price,
        weight: editModalInfo.weight,
        is_buy: editModalInfo.isBuy ? 1 : 0,
        is_show: editModalInfo.isShow ? 1 : 0
      }
      
      this.editModalInfo.isShowEditModal = false

      try {
         const data = await lawyerApi.updateBestMenuApi(param)
         this.$notification.success({ message: '更新成功', duration: 3 })
         // 更新当页数据
         this._getBestLawyerMenuList(this.pagination.current)
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
    justify-content: flex-start;
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
  // 销售记录
  .column-meal-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  margin-left: auto;
  cursor: pointer;
}

.edit-modal {
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
      width: 200px;
      margin-left: auto;
    }
    .checked-opt {
      cursor: pointer;
    }
  }
}

.label-modal {
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .modal-body {
    height: 200px;
    overflow-y: auto;
    .ant-checkbox-group {
      width: 100%;
      .ant-row {
        .ant-col {
          margin-bottom: 20px;
        }
      }
    }
  }
  .modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      width: 80px;
      height: 30px;
    }
  }
}
</style>
