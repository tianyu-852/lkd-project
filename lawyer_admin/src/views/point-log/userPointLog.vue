<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">律师认证埋点：{{ pagination.total }}</span>

      <!-- 时间筛选 -->
      <a-range-picker
        @change="onRangePickerChange"
        @ok="_getClientCompanyList(1)"
        style="width: 340px; margin-left: 30px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />

      <!-- 导出文件按钮 -->
      <a-popconfirm title="请确认是否导出?" ok-text="导出" cancel-text="取消" @confirm="confirmExportPointLog">
        <a-button style="margin-left: auto; background: #2cbf78; border-color: #2cbf78; color: #fff">导出记录</a-button>
      </a-popconfirm>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getClientCompanyList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_enterprise_id)"
        bordered
      >

        <!-- 点击时间 -->
        <a-table-column dataIndex="created_at" title="点击时间" align="center" width="200px" />
        
        <!-- 用户名称 -->
        <a-table-column dataIndex="nickname" title="用户名称" align="center" width="160px" />

        <!-- 用户手机号 -->
        <a-table-column dataIndex="mobile" title="用户手机号" align="center" width="160px" />

        <!-- 类型 -->
        <a-table-column dataIndex="type_text" title="类型" align="center" />

        <!-- 点击次数 -->
        <a-table-column dataIndex="num" title="点击次数" align="center" />
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import * as pointLogApi from '@/api/pointLogApi'

export default {
  name: 'UserPointLog',
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
          this._getClientCompanyList(page)
          this.pagination.current = page
        },
      },

      // 时间过滤条件
      filterInfo: {
        startDate: '', // 开始时间
        endDate: '', // 结束时间
      },

    }
  },
  created() {
    this._getClientCompanyList()
  },
  methods: {
    moment,
    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.filterInfo.startDate = dateStrAry[0]
      this.filterInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      // if (!dateStrAry[0] || !dateStrAry[1]) this._getClientCompanyList()
    },

    /**
     * 获取企业客户列表
     */
     async _getClientCompanyList(page = 1) {
       this.tabelDataLoading = true
       // 请求参数
       const param = {
         page,
         size: this.pagination.pageSize,
         type: 4,
        }

        // 时间段 条件
        // this.filterInfo.startDate && (param.start_time = this.filterInfo.startDate)
        // this.filterInfo.endDate && (param.end_time = this.filterInfo.endDate)

       try {
         const { data: clientCompanyData } = await pointLogApi.getUserPointLogApi(param)
         this.tabelDataList = clientCompanyData.data
         this.pagination.total = clientCompanyData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 确定导出埋点记录
     */
    async confirmExportPointLog() {
      const params = { type: 4 }

      this.filterInfo.startDate && (params.start_time = this.filterInfo.startDate)
      this.filterInfo.endDate && (params.end_time = this.filterInfo.endDate)
      
      try {
        return new Promise((resolve, reject) => {
          axios({
            url: process.env.VUE_APP_API_BASE_URL + '/web/export/buried/point/log',
            methods: 'get',
            params,
            responseType: 'blob',
            headers: {
              Authorization: this.$store.getters.token,
              'X-Timestamp': new Date().getTime().toString().substr(0, 10),
              'X-Nonce': Math.random().toString(36).slice(-10),
              'X-Api-Version': 'v1',
              'X-Device-Type': 'admin',
            },
          }).then(response => {
            console.log(response)
            if (response.data.type === 'application/json') {
              const reader = new FileReader()
              reader.readAsText(response.data, 'utf-8')
              reader.onload = () => {
                this.$message.error(JSON.parse(reader.result).message)
              }
            } else {
              const name = '埋点记录'
              var blob = new Blob([response.data], {
                // type: 'application/zip',
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              })
              var downloadElement = document.createElement('a')
              var href = window.URL.createObjectURL(blob)
              downloadElement.href = href
              downloadElement.download = name
              document.body.appendChild(downloadElement)
              downloadElement.click()
              document.body.removeChild(downloadElement)
              window.URL.revokeObjectURL(href)
            }
            resolve()
          })
        })
       } catch (error) {
         console.log(error)
       }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 90px;
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
    .date-range-picker {
      margin-left: auto;
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
    .selected-title {
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.other-contact-modal {
  .contact-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
    .contact-left {
      margin-right: 10px;
    }
    .contact-middle {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .otherContact-item {
        margin-right: 20px;
      }
    }
  }
}

.addOther-contact-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    &:last-child { margin-bottom: 0; }
    .input-title {
      font-size: 14px;
      font-weight: 500;
      width: 60px;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
