import { reactive } from "@vue/composition-api";

export function paginationHook() {
  // 数据
  const pageData = reactive({
    currentPage: 1, //当前页码
    pageSize: 10, //每页记录数
    pageSizes: [10, 20, 40, 60], //每页记录数集合
    total: 0 //总记录数
  });
  // 统计数据总数
  const totalCount = val => (pageData.total = val);
  // 每页记录数变化
  const pageSizeChange = val => (pageData.pageSize = val);
  // 页码变化
  const pageChange = val => (pageData.currentPage = val);
  return {
    pageData,
    pageSizeChange,
    pageChange,
    totalCount
  };
}

/**
 * 分页封装
 */
