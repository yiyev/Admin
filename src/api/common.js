import { GetCategory } from "@/api/news";
import { reactive } from "@vue/composition-api";
import service from "@/utils/request";

export function common() {
  // 分类列表
  const category = reactive({
    item: []
  });
  /**
   *  获取分类
   */
  const getInfoCategory = () => {
    GetCategory({})
      .then(res => {
        category.item = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
  };

  return { category, getInfoCategory };
}

/**
 *获取七牛云token
 * @param {
 * accesskey: 七牛云的密钥accesskey；type：string
 * secretkey: 七牛云的密钥secretkey；type：string
 * buckety: 七牛云储存空间名称；type：string
 * } params
 */
export function QiniuToken(data) {
  return service.request({
    method: "post",
    url: "/uploadImgToken/",
    data
  });
}

/**
 * 请求表格数据
 * @param {
 * pageNumber：表格当前页码数
 * pageSize：表格每页记录数
 * 其他参数看对应接口需要的参数
 * *} params
 */
export function loadTableData(params) {
  return service.request({
    method: params.method || "post",
    url: params.url,
    data: params.data || {}
  });
}
