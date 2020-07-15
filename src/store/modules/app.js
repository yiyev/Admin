import { Login, Logout } from "@/api/login";
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
  username: getUserName() || "",
  roles: [],
  btnPerm: []
};
const getters = {
  isCollapse: state => state.isCollapse,
  username: state => state.username,
  roles: state => state.roles,
  btnPerm: state => state.btnPerm
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
    state.username = value;
  },
  // 更新角色
  UPDATE_ROLES(state, value) {
    state.roles = value;
  },
  // 更新按钮权限
  UPDATE_BUTTON(state, value) {
    state.btnPerm = value;
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
  logout({ commit }) {
    return new Promise(resolve => {
      Logout().then(res => {
        const data = res.data;
        removeToken();
        removeUserName();
        commit("UPDATE_TOKEN", "");
        commit("UPDATE_USERNAME", "");
        commit("UPDATE_ROLES", []);
        resolve(data);
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
