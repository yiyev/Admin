const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false
};
const getters = {
  isCollapse: state => state.isCollapse
};
const mutations = {
  //菜单切换
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    // html5本地存储
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  }
};
const actions = {
  // 登录接口
  login(content, requestData) {
    return new Promise((resolve, reject) => {
      // 接口
      Login(requestData)
        .then(response => {
          resolve(response);
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
  mutations,
  actions
};
