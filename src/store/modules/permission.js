import { getUserRole } from "@/api/login";
import { defaultRouterMap, asnycRouterMap } from "@/router";

/**
 * 判断路由中是否存在角色
 * @param {
 * 用户角色
 * *} roles
 * @param {
 * 路由
 * *} router
 */
function hasPermission(roles, router) {
  if (router.meta && router.meta.role) {
    return roles.some(item => router.meta.role.indexOf(item) >= 0);
  }
}

const state = {
  allRouters: defaultRouterMap,
  addRouters: []
};
const getters = {
  allRouters: state => state.allRouters, //所有的路由
  addRouters: state => state.addRouters //匹配的路由
};
const mutations = {
  // 更新路由
  UPDATE_ROUTER(state, router) {
    state.addRouters = router;
    state.allRouters = defaultRouterMap.concat(router);
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
          let data = response.data.data;
          resolve(data);
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
        addRouters = asnycRouterMap;
      } else {
        // 普通管理员
        addRouters = asnycRouterMap.filter(item => {
          // 一级路由
          if (hasPermission(role, item)) {
            // 二级路由
            if (item.children && item.children.length > 0) {
              item.children = item.children.filter(child => {
                if (hasPermission(role, child)) {
                  return child;
                }
              });
              return item;
            }
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
