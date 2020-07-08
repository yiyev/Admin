import { GetCategory } from "@/api/news";
const state = {
  qiniuUrl: "http://www-web-jshtml-cn-idva7mx.web-jshtml.cn/"
};
const getters = {
  qiniuUrl: state => state.qiniuUrl
};
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
  state,
  getters,
  actions
};
