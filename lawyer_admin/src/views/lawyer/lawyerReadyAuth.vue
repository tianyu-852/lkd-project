<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">预认证律师：{{ pagination.total }}</span>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getReadyAuthLawyerList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.optimization_plan_id)"
        bordered
      >

        <!-- 律师 -->
        <a-table-column title="律师" align="center">
          <template slot-scope="record">
            <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
              <user-vip-cell
                :nickname="record.user.nickname"
                :avatar="record.user.avatar"
                :mobile="(userInfo && dataRoleList.includes(userInfo.name) ? record.user.mobile : hidePhoneFunc(record.user.mobile))"
                :user-id="String(record.user.user_id)"
                size="sm"
                @open="openUser(record.user.user_id, 'lawyer')"
              />
            </div>
          </template>
        </a-table-column>

        <a-table-column title="认证情况" align="center">
          <template slot-scope="record">
            <a-tag v-if="record.user.is_lawyer" color="#41b583" style="border-radius: 4px;">已认证</a-tag>
            <a-tag v-else color="#e6a23c" style="border-radius: 4px;">未认证</a-tag>
          </template>
        </a-table-column>
        
        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="margin: 5px" size="small" @click="navToLawyerDetail(record)">律师主页</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

  </a-layout>
</template>

<script>
import * as lawyerApi from '@/api/lawyer'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'
import { mapState } from 'vuex'

export default {
  name: 'LawyerRadyAuthPage',
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
          this._getReadyAuthLawyerList(page)
          this.pagination.current = page
        },
      },
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getReadyAuthLawyerList()
  },
  methods: {
    // 隐藏手机号码中间4位数
    hidePhoneFunc(phone) {
      const reg = /^(\d{3})\d{4}(\d{4})$/
      return phone.replace(reg, '$1****$2')
    },

    /**
     * 获取预认证律师 列表
     */
     async _getReadyAuthLawyerList(page = 1) {
      this.tableDataLoading = true
      const param = { page, size: this.pagination.pageSize }

       try {
         const { data: menuData } = await lawyerApi.getReadyAuthLawyerListApi(param)
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
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      sessionStorage.setItem('lawyerCondition', JSON.stringify(this.conditionData))
      const userId = String(record.user.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId, isLawyerFlag: record.user.is_lawyer } })
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
