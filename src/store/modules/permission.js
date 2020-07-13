import { getUserRole } from "@/api/login";
import { defaultRouteMap, asnycRoutrMap } from "@/router";

const state = {
  roles: [],
  allRouters: defaultRouteMap,
  addRouters: []
};
const getters = {
  roles: state => state.roles,
  allRouters: state => state.allRouters, //所有的路由
  addRouters: state => state.addRouters //匹配的路由
};
const mutations = {
  // 更新角色
  UPDATE_ROLES(state, value) {
    state.roles = value;
  },
  // 更新路由
  UPDATE_ROUTER(state, router) {
    state.addRouters = router;
    state.allRouters = defaultRouteMap.concat(router);
  }
};
const actions = {
  /**
   * 获取用户角色
   * @param {*} param0
   * @param {*} requestData
   */
  getRoles({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      getUserRole()
        .then(response => {
          let role = response.data.data.role;
          commit("UPDATE_ROLES", role);
          resolve(role);
        })
        .catch();
    });
  },
  /**
   * 创建动态路由
   * @param {*} param0
   * @param {*} data
   */
  createRouter({ commit }, data) {
    return new Promise((resolve, reject) => {
      let role = data;
      let addRouters = [];
      // 超级管理员
      if (role.includes("admin")) {
        addRouters = asnycRoutrMap;
      } else {
        // 普通管理员
        addRouters = asnycRoutrMap.filter(item => {
          if (role.includes(item.meta.system)) {
            return item;
          }
        });
      }
      // 更新路由
      commit("UPDATE_ROUTER", addRouters);
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
