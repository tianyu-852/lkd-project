<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="icon-back" style="cursor: pointer; padding-right: 10px;" @click="$router.back(-1)">←</span>
      <span class="focus-text">免费领取本地案源设置</span>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getCaseSourceNativeGetSetList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.optimization_plan_id)"
        bordered
      >
        <!-- 会员项 -->
        <a-table-column title="会员项" align="center">
          <template slot-scope="record">
            <div>{{ record.name }}/{{ record.day_unit }}</div>
          </template>
        </a-table-column>
        
        <!-- 免费领取间隔时长 -->
        <a-table-column title="免费领取间隔时长" align="center">
          <template slot-scope="record">
            <div>{{ record.source_time }}小时</div>
          </template>
        </a-table-column>

        <!-- 是否开启 -->
        <a-table-column title="是否开启" align="center">
          <template slot-scope="record">
            <div v-if="record.source_type === 1" style="color: #41b583;">已开启</div>
            <div v-else>已关闭</div>
          </template>
        </a-table-column>

        <!-- 是否显示 -->
        <a-table-column title="是否显示" align="center">
          <template slot-scope="record">
            <div v-if="record.source_is_show" style="color: #1790ff;">显示中</div>
            <div v-else>已关闭</div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="margin: 5px" size="small" @click="openEditBestMenuModal(record)">编辑</a-button>
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
            <div class="input-title">会员项：</div>
            <a-input class="input" v-model="editModalInfo.name" disabled placeholder="会员项" allowClear />
          </div>
          <div class="input-item">
            <div class="input-title">领取间隔时长：</div>
            <a-input class="input" style="width: 160px;" v-model="editModalInfo.source_time" placeholder="请输入时长（小时）" allowClear />
            <div style="margin-left: 10px;">小时</div>
          </div>

          <div class="input-item">
            <div class="input-title">是否开启</div>

            <div class="checked-opt" style="margin-left: auto; margin-right: 40px;" @click="editModalInfo.isOpen = true">
              <img v-if="editModalInfo.isOpen" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
              <span>开启</span>
            </div>
            <div class="checked-opt" @click="editModalInfo.isOpen = false">
              <img v-if="!editModalInfo.isOpen" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
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
import * as causeSourceApi from '@/api/causeSourceApi'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'
import { mapState } from 'vuex'

// 边界信息
const EDIT_MODAL_INFO = {
  isShowEditModal: false,
  name: '',
  source_time: '',
  isOpen: false,
  isShow: false,
  putBestMenuId: '', // 待更新套餐 id
}

export default {
  name: 'CauseSourceNativeSetPage',
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
          this._getCaseSourceNativeGetSetList(page)
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
    this._getCaseSourceNativeGetSetList()
  },
  methods: {
    /**
     * 获取本地案源免费领取设置列表
     */
     async _getCaseSourceNativeGetSetList(page = 1) {
      this.tableDataLoading = true

       try {
         const { data: menuData } = await causeSourceApi.getCaseSourceNativeGetSetListApi()
         this.tableDataList = menuData
        //  this.pagination.total = menuData.total
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
      this.editModalInfo.name = `${ record.name }/${ record.day_unit }`
      this.editModalInfo.source_time = record.source_time
      this.editModalInfo.isOpen = record.source_type ? true : false
      this.editModalInfo.isShow = record.source_is_show ? true : false
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
        source_time: editModalInfo.source_time,
        source_type: editModalInfo.isOpen ? 1 : 2,
        source_is_show: editModalInfo.isShow ? 1 : 0
      }
      
      this.editModalInfo.isShowEditModal = false

      try {
         const data = await causeSourceApi.updateCaseSourceNativeGetSetApi(param)
         this.$notification.success({ message: '更新成功', duration: 3 })
         // 更新当页数据
         this._getCaseSourceNativeGetSetList(this.pagination.current)
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
