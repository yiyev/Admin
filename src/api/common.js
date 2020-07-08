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
 * 获取七牛云token
 */
export function QiniuToken(data) {
  return service.request({
    method: "post",
    url: "/uploadImgToken/",
    data
  });
}
