<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">屏蔽律师：{{ pagination.total }}</span>
      <a-button type="primary" style="margin-left: auto;" @click="openAddPreventModal">添加</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getBestLawyerPreventedList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_id)"
        bordered
      >
        <!-- 屏蔽律师 -->
        <a-table-column key="nickname" title="屏蔽律师" align="center">
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
            </div>
          </template>
        </a-table-column>

        <!-- 状态 -->
        <a-table-column title="状态" align="center">
          <template slot-scope="record">
            <div>{{ record.aaa || '屏蔽中' }}</div>
          </template>
        </a-table-column>


        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
          <template slot-scope="record">
            <a-popconfirm title="是否确认移除该律师？" @confirm="removeBestLawyerPrevent(record.user_id)" >
              <a-button type="danger" size="small">移除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 添加屏蔽 modal -->
    <a-modal
      v-model="isShowCheckedModal"
      :width="600"
      destroyOnClose
      @ok="onCheckModalOkEvt"
    >
      <div slot="title">
        <span style="font-size: 18px; font-wight: 500; margin-right: 8px;">选择律师</span>
        <a-input allow-clear placeholder="搜索姓名/手机号" v-model="searchLawyerKeyword" @keyup.enter="openAddPreventModal" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="openAddPreventModal">搜索</a-button>
      </div>
      <div class="checked-modal">
        <div class="checked-body">
          <div v-for="(cItem, cIndex) in waitCheckedList" :key="cIndex" class="checked-item" @click="waitCheckedList[cIndex].isChecked = !waitCheckedList[cIndex].isChecked">
            <img :src="cItem.avatar" style="width: 30px; height: 30px; margin-right: 6px;" />
            <div>
              <div>{{ cItem.nickname }}</div>
              <div style="font-size: 14px; color: #999;">{{ cItem.mobile }}</div>
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
import * as lawyerApi from '@/api/lawyer'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'
import { mapState } from 'vuex'

export default {
  name: 'LawyerPreventPage',
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
          this._getBestLawyerPreventedList(page)
          this.pagination.current = page
        },
      },

      mealSelectList: [{ label: '全部', value: '' }], // 开通套餐 select 列表
      activeMealId: '', // 选中的套餐 id

      putLawyerUserId: 0, // 待更新律师 id
      isShowCheckedModal: false, // 是否显示添加 modal
      waitCheckedList: [], // 待选择  列表
      searchLawyerKeyword: '',
    }
  },
  created() {
    this._getBestLawyerPreventedList()
  },
  methods: {
    /**
     * 获取优选 屏蔽律师列表
     */
     async _getBestLawyerPreventedList(page = 1) {
       const param = { page, size: this.pagination.pageSize }
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getBestLawyerPreventedListApi(param)
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
     * 打开添加推送 modal
     */
    async openAddPreventModal() {
      const param = { type: 2, page: 1, size: 500, search: this.searchLawyerKeyword.trim() }
      try {
         const { data: waitCheckedData } = await lawyerApi.getBestLawyerWaitPreventListApi(param)

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
     * 监听添加 屏蔽律师 modal ok事件
     */
    async onCheckModalOkEvt() {
      const { waitCheckedList } = this
      const postLawyerUserIds = waitCheckedList.filter(item => item.isChecked).map(itm => itm.user_id)
      if (!postLawyerUserIds.length) return this.$message.warning('请选择律师')
      this.isShowCheckedModal = false

      const param = { lawyer_user_ids: JSON.stringify(postLawyerUserIds) }
      try {
         const data = await lawyerApi.addBestLawyerPreventApi(param)
         this.$notification.success({ message: '添加成功', duration: 3 })
         this._getBestLawyerPreventedList(1)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 移除优选律师 屏蔽列表
     */
    async removeBestLawyerPrevent(userId) {
      console.log(typeof userId)

      const user_id = typeof userId === 'number' ? JSON.stringify(userId) : userId
      try {
         const { data } = await lawyerApi.removeBestLawyerPreventApi({ lawyer_user_id: user_id })
         this.$notification.success({ message: '移除成功', duration: 3 })
         this._getBestLawyerPreventedList(this.pagination.current)
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
