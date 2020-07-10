// 引用表格请求路径集合
import { requestUrl } from "@/api/requestUrl";
// 引用表格接口
import { loadTableData } from "@/api/common";
let tableLoadData = {
  mounted() {
    // 请求表格数据接口
    this.getTableData();
  },
  methods: {
    // 请求表格数据接口
    getTableData() {
      let requestJson = this.tableConfig.requestData;
      let requestData = {
        url: requestUrl[requestJson.url],
        data: requestJson.data
      };
      loadTableData(requestData)
        .then(res => {
          let resData = res.data.data;
          if (resData && resData.data.length > 0) {
            // 赋值
            this.tableData = resData.data;
            // 数据统计
            this.total = resData.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
export default tableLoadData;

/**
 * 表格数据接口方法封装
 * 目录： src > mixins > Table > tableLoadData.js
 * 引用方式： import tableLoadData from "@/mixins/Table/tableLoadData";
 * 与同级目录下 pagination.js组合使用
 * 一个页面只能引入一次，引入多个会冲突
 */
