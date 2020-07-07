import { GetCategory } from "@/api/news";
const actions = {
  // 获取分类
  getInfoCategory() {
    return new Promise((resolve, reject) => {
      GetCategory({})
        .then(response => {
          resolve(response.data.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  actions
};
