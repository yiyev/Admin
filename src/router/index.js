import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
// 解决vue-router在3.0版本以上重复点击菜单报错的问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
/**
 * 1、系统分配
 * 2、角色分配（当前）
 */

// 引入布局组件
import Layout from "@/views/Layout";

/**
 * 默认路由
 */
export const defaultRouterMap = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/Login")
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "控制台",
      icon: "console"
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "首页"
        },
        component: () => import("../views/Console")
      }
    ]
  }
];

const router = new VueRouter({
  routes: defaultRouterMap
});

export default router;

/**
 * 动态路由
 * 角色 technician, manager, sale
 */
export const asnycRouterMap = [
  /**
   * 信息管理
   */
  {
    path: "/info",
    name: "Info",
    meta: {
      role: ["sale", "manager"],
      system: "infoSystem", //自定义key
      name: "信息管理",
      icon: "info"
    },
    component: Layout,
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta: {
          role: ["manager"],
          name: "信息列表"
        },
        component: () => import("../views/Info")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          role: ["sale"],
          name: "信息分类"
        },
        component: () => import("../views/Info/category.vue")
      },
      {
        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta: {
          role: ["sale"],
          name: "信息详情"
        },
        component: () => import("../views/Info/detailed.vue")
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      role: ["sale"],
      system: "userSystem",
      name: "用户管理",
      icon: "user"
    },
    component: Layout,
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          role: ["sale"],
          name: "用户列表"
        },
        component: () => import("../views/User")
      }
    ]
  }
];
