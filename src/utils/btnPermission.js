import store from "../store";

export function btnPermission(permission) {
  const btn = store.getters["app/btnPerm"];
  const roles = store.getters["app/roles"];
  // 如果是超级管理员 返回true
  if (roles.includes("admin")) {
    return true;
  }
  return btn.indexOf(permission) !== -1;
}

/**
 * 判断是否有按钮权限
 * 参数：
 * permission 当前按钮权限
 * 获取store的按钮权限值，匹配当前按钮权限，若存在返回true，即有按钮权限
 */
