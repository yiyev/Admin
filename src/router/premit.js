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
      next();
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
