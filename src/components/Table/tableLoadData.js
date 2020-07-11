import { reactive } from "@vue/composition-api";
// 引用表格请求路径集合
import { requestUrl } from "@/api/requestUrl";
// 引用表格接口
import { loadTableData } from "@/api/common";

export function loadData() {
  // 表格数据
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
        // 后台返回数据时，并不是返回一个数组，有时返回一个null，统一返回的是数组，无论是否空 array
        // 赋值
        tableData.item = resData.data;
        // 数据统计
        tableData.total = resData.data.length === 0 ? 0 : resData.total;
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
 * 表格数据接口方法封装
 * 目录： src > components > Table > tableLoadData.js
 * 引用方式： import tableLoadData from "@/components/Table/tableLoadData";
 * 与同级目录下 pagination.js组合使用
 * 一个页面只能引入一次，引入多个会冲突
 */
