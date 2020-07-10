let pagination = {
  data() {
    return {
      currentPage: 1, //当前页码
      pageSize: 10, //每页记录数
      pageSizes: [10, 20, 40, 60], //每页记录数集合
      total: 0 //总记录数
    };
  },
  methods: {
    // 统计数据总数
    totalCount(val) {
      this.total = val;
    },
    // 每页记录数变化
    pageSizeChange(val) {
      this.tableConfig.requestData.data.pageSize = val;
      this.getTableData();
    },
    // 页码变化
    pageChange(val) {
      this.tableConfig.requestData.data.pageNumber = val;
      this.getTableData();
    }
  }
};
export default pagination;

/**
 * 分页封装
 * 目录： src > mixins > Table > pagination.js
 * 引用方式： import pagination from "@/mixins/Table/pagination";
 * 与同级目录下 tableLoadData.js以及一起使用
 * 一个页面只能引入一次，引入多个会冲突
 */
