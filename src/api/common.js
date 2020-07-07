import { GetCategory } from "@/api/news";
import { reactive } from "@vue/composition-api";
export function common() {
  // 分类列表
  const category = reactive({
    item: []
  });
  // 获取分类
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
