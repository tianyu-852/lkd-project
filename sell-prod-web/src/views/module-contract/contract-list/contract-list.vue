<template>
  <div>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>合同数据列表</span>
      <el-button size="mini" class="btn-add" style="float: right;">添加</el-button>
      <el-button size="mini" class="btn-add" style="float: right; margin-right: 20px;">全选</el-button>
    </el-card>

    <div class="table-container">
      <el-table v-loading="tableDataLoading" element-loading-text="加载中" :data="tableDataList" border>
        <el-table-column type="selection" width="60" align="center" />

        <el-table-column prop="date" label="日期" align="center" width="180" />

        <el-table-column prop="name" label="姓名" align="center" width="180" />

        <el-table-column prop="address" align="center" label="地址" />

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- table 分页器 -->
      <table-pagination :tablePagination="tablePagination" @changePageEvt="onChangeTablePageEvt" @changeSizeEvt="onChangeTableSizeEvt" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContractList',
  data() {
    return {
      tableDataList: [
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
        { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
      ], // table 列表
      tableDataLoading: true, // table 数据是否加载中
      // table 分页器
      tablePagination: {
        total: 999, // 总数
        page: 1, // 当前位于哪页
        pageSize: 15, // 每页显示多少条
      },
    };
  },
  created() {
    this._getTableList();
  },
  methods: {
    /**
     * 获取 table 数据
     */
    async _getTableList() {
      this.tableDataLoading = true;
      const param = { page: this.tablePagination.page, size: this.tablePagination.pageSize };
      console.log(param);

      try {
        // const { data: userData } = await this.$api.fetchUserInfo(param);
        setTimeout(() => { this.tableDataLoading = false; }, 2000);
      } catch (error) {
        this.tableDataLoading = false;
        console.log(error);
      }
    },
    /**
     * 监听 table 分页器改变当前页码触发事件
     */
    onChangeTablePageEvt(page) {
      this.tablePagination.page = page;
      this._getTableList();
    },
    /**
     * 监听 table 分页器改变条目数触发事件
     */
    onChangeTableSizeEvt(pageSize) {
      this.tablePagination.pageSize = pageSize;
      this._getTableList();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
