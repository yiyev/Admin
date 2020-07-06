import { Login } from "@/api/login";
import {
  setToken,
  setUserName,
  getUserName,
  removeToken,
  removeUserName
} from "@/utils/app";
const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  token: "",
  username: getUserName() || ""
};
const getters = {
  isCollapse: state => state.isCollapse,
  username: state => state.username
};
const mutations = {
  //菜单切换
  UPDATE_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    // html5本地存储
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },
  //更新token
  UPDATE_TOKEN(state, value) {
    state.token = value;
  },
  //更新用户名
  UPDATE_USERNAME(state, value) {
    state.token = value;
  }
};
const actions = {
  // 登录接口
  login({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      // 接口
      Login(requestData)
        .then(response => {
          let data = response.data.data;
          commit("UPDATE_TOKEN", data.toKen);
          commit("UPDATE_USERNAME", data.username);
          setToken(data.token);
          setUserName(data.username);
          // token username
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // 退出后台
  exit({ commit }) {
    return new Promise(resolve => {
      removeToken();
      removeUserName();
      commit("UPDATE_TOKEN", "");
      commit("UPDATE_USERNAME", "");
      resolve();
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
