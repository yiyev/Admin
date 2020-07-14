import router from "./index";
import store from "../store/index";

import { getToken, removeToken, removeUserName } from "@/utils/app";

// 白名单
const whiteRouter = ["/login"]; //indexOf方法，判断数组中是否存在指定的某个对象，如果不存在，则返回-1

// 路由守卫
router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === "/login") {
      removeToken();
      removeUserName();
      store.commit("app/UPDATE_USERNAME", "");
      store.commit("app/UPDATE_TOKEN", "");
      next();
    } else {
      // 获取用户角色
      // 动态分配路由权限
      /**
       * 1、什么时候处理动态路由
       * 2、以什么条件处理
       * roles[]
       */
      if (store.getters["app/roles"].length === 0) {
        store.dispatch("permission/getRoles").then(res => {
          let roles = res.role;
          let btnPerm = res.btnPerm;
          store.commit("app/UPDATE_ROLES", roles);
          store.commit("app/UPDATE_BUTTON", btnPerm);
          // 存储角色
          store.dispatch("permission/createRouter", roles).then(() => {
            let addRouters = store.getters["permission/addRouters"];
            let allRouters = store.getters["permission/allRouters"];
            // 路由更新
            router.options.routes = allRouters;
            // 添加动态路由
            router.addRoutes(addRouters);
            next({ ...to, replace: true });
            // es6扩展运算符，防止内容发生变化的情况
            // 不被记录历史记录
          });
        });
      } else {
        next();
      }
    }
    // 路由动态添加，分配菜单，每个角色分配不同菜单
  } else {
    if (whiteRouter.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
    }
  }
});
