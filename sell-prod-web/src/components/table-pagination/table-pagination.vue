<template>
  <div class="table-pagination">
    <el-pagination
      background
      :total="tablePagination.total"
      :current-page="tablePagination.page"
      :page-size="tablePagination.pageSize"
      :layout="tablePaginationLayout"
      :page-sizes="tablePaginationPageSizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
    tablePagination: { type: Object, default: () => ({ total: 0, page: 1, pageSize: 15 }) } // 分页器
  },
  data() {
    return {
      tablePaginationPageSizes: [15, 100, 200, 300], // 每页显示条数选择器
      tablePaginationLayout: 'total, sizes, prev, pager, next, jumper', // 翻页属性
    };
  },
  methods: {
    /**
     * 改变分页器当前页码触发
     */
    handleCurrentChange(page) {
      this.$emit('changePageEvt', page);
    },
    /**
     * 改变分页器每页显示条目数触发
     */
    handleSizeChange(pageSize) {
      this.$emit('changeSizeEvt', pageSize);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
