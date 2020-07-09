import { reactive } from "@vue/composition-api";
// 引用表格请求路径
import { requestUrl } from "@/api/requestUrl";
// 引用表格接口
import { loadTableData } from "@/api/common";

export function loadData() {
  // 数据
  const tableData = reactive({
    item: [], //表格数据
    total: 0 //表格总记录数
  });
  // 表格数据接口
  const tableLoadData = params => {
    let requestData = {
      url: requestUrl[params.url],
      data: params.data
    };
    loadTableData(requestData)
      .then(res => {
        let resData = res.data.data;
        if (resData && resData.data.length > 0) {
          tableData.item = resData.data;
          tableData.total = resData.total;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  return {
    tableData,
    tableLoadData
  };
}
/**
 * 表格数据接口封装
 */
