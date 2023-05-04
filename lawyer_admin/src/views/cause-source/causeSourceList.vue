<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">案源总数：{{ pagination.total }}</span>

    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getCauseSourceList(pagination.current)">刷新</a-button>
      </div>
      
      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.demand_id)"
        :scroll="{ x: 1600 }"
        bordered
      >
        <!-- 发布人 -->
        <!-- <a-table-column dataIndex="user.nickname" title="发布人" align="center" /> -->

        <!-- 发布人 -->
        <a-table-column title="发布人" align="center">
          <template slot-scope="record">
            <div>{{ record.user.nickname }}</div>
            <div>{{ record.release_type }}</div>
          </template>
        </a-table-column>

        <!-- 发布人手机号 -->
        <a-table-column dataIndex="user.mobile" title="发布人手机号" align="center" />

        <!-- 发布人类型 -->
        <!-- <a-table-column dataIndex="release_type" title="发布人类型" align="center" /> -->

        <!-- 发布时间 -->
        <a-table-column dataIndex="created_at" title="发布时间" align="center" />

        <!-- 案源类型 -->
        <a-table-column dataIndex="demand_type" title="案源类型" align="center" />

        <!-- 律师区域 -->
        <a-table-column dataIndex="lawyer_city" title="律师区域" align="center" />

        <!-- 案件详情 -->
        <a-table-column title="案件详情" align="center" >
          <template slot-scope="record">
            <text-with-row-button :text="record.content" :over-max="10" />
          </template>
        </a-table-column>

        <!-- 图片 -->
        <a-table-column title="图片" align="center" width="240px">
          <template slot-scope="record">
            <div class="column-image-wrap">
              <div v-for="(iItem, iIndex) in record.related_images" :key="iIndex" class="image-item" v-viewer>
                <img style="width: 100%; height: 100%;" :src="iItem">
              </div>
            </div>
          </template>
        </a-table-column>

        <!-- 附件 -->
        <a-table-column title="附件" align="center">
          <template slot-scope="record">
            <div class="column-file-wrap">
              <a v-for="(fItem, fIndex) in record.related_cloud_file" :key="fIndex" :href="fItem.file_path" target="_blank" class="file-item">{{ fItem.file_name }}</a>
            </div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="200px">
          <template slot-scope="record">
            <a-popconfirm v-if="record.clues_status === 0 || record.clues_status=== 1 || record.clues_status === 3" title="请确认是否隐藏该案源?" ok-text="确认" cancel-text="取消" @confirm="hiddenCauseSource(record)" >
              <a-button class="closeBtn" type="primary" style="margin-right: 10px" >隐藏</a-button>
            </a-popconfirm>

            <a-popconfirm v-if="record.clues_status === 2 || record.clues_status === 4 || record.clues_status === 5" title="请确认是否显示该案源?" ok-text="确认" cancel-text="取消" @confirm="showCauseSource(record)" >
              <a-button class="openBtn" type="primary" style="margin-right: 10px" >显示</a-button>
            </a-popconfirm>

            <a-popconfirm v-if="record.clues_status===1 && record.status === 12" title="请确认是否转案源?" ok-text="确认" cancel-text="取消" @confirm="changeOrigin(record)" >
              <a-button class="changeBtn" type="primary" style="margin-right: 10px" >转案源</a-button>
            </a-popconfirm>
            <!-- 转问答 -->
            <a-popconfirm v-if="!record.is_to_question" title="请确认是否转为问答?" ok-text="确认" cancel-text="取消" @confirm="causeSourceToCommunityDyn(record)" >
              <a-button type="primary" style="margin-right: 10px">转问答</a-button>
            </a-popconfirm>

            <!-- <a-button class="changeBtn" type="primary" style="margin-right: 10px" @click="openEditType(record)">编辑</a-button> -->
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 标签 modal -->
    <a-modal v-model="isShowOpenEdit" :width="500" destroyOnClose>
      <div class="label-modal">
        <div class="input-item">
          <div class="input-title">案件详情编辑：</div>
          <a-input class="input" type="textarea" v-model="typeText" />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import TextWithRowButton from '@/components/Common/TextWithRowButton'

export default {
  name: 'CauseSourceList',
  components: { TextWithRowButton },
  data() {
    return {
      // demandID: ,// 需求订单id
      tableDataList: [], // 列表
      tabelDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSourceList(page)
          this.pagination.current = page
        },
      },
      isShowOpenEdit:false, // 是否显示案件详情编辑弹框
      typeText:""
    }
  },
  created() {
    this._getCauseSourceList()
  },
  methods: {
    /***
     * 打开案件详情编辑文本弹框
     */
    async openEditType(record) {
      this.typeText = record.content
      this.isShowOpenEdit = true
    },

    /**
     * 获取案源 table 列表
     */
    async _getCauseSourceList(page = 1) {
      const param = { page, size: this.pagination.pageSize, sort: 1 }

      this.tabelDataLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.causeSourceListApi(param)
        this.tableDataList = causeSourceData.data
        this.pagination.total = causeSourceData.total
        this.pagination.current = page
        this.tabelDataLoading = false
      } catch (error) {
        this.tabelDataLoading = false
        console.log(error)
      }
    },

    /**
     * 隐藏案源
     **/
    async hiddenCauseSource(record) {
      const param = { demand_id: record.demand_id, type: 2 }
      try {
        const { data: causeSourceData } = await causeSourceApi.hiddenCauseSourceApi(param)
        this._getCauseSourceList(this.pagination.current)
      } catch (error) {
        this.tabelDataLoading = false
        console.log(error)
      }
    },

    /**
     * 显示案源
     **/
    async showCauseSource(record) {
      const param = { demand_id: record.demand_id, type: 1 }
      try {
        const { data: causeSourceData } = await causeSourceApi.showCauseSourceApi(param)
        this._getCauseSourceList(this.pagination.current)
      } catch (error) {
        this.tabelDataLoading = false
        console.log(error)
      }
    },

    /***
     * 转案源
     */
    async changeOrigin(record) {
      const param = { demand_id: record.demand_id }
      try {
        const { data: causeSourceData } = await causeSourceApi.changeOriginApi(param)
        this._getCauseSourceList(this.pagination.current)
      } catch (error) {
        this.tabelDataLoading = false
        console.log(error)
      }
    },

    /**
     * 案源转社区问答
     */
    async causeSourceToCommunityDyn(record) {
      const { demand_id } = record
      const param = { demand_id }
      try {
        const data = await causeSourceApi.causeSourceToCommunityDynApi(param)
        this._getCauseSourceList(this.pagination.current)
      } catch (error) {
        this.tabelDataLoading = false
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
  .column-image-wrap {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    .image-item {
      height: 80px;
      cursor: pointer;
    }
  }
  .column-file-wrap {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 6px;
    .file-item {
      font-size: 12px;
      color: #0085FF;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      /* ! autoprefixer: off */
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }
}
.closeBtn,
.openBtn {
  background-color: #ff6200;
  border: none;
  border-radius: 5px;
}
.openBtn {
  background-color: #27b148;
}
.changeBtn {
  background-color: #4363f4;
  border: none;
  border-radius: 5px;
}
</style>
