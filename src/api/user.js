/**
 * 用户管理相关接口
 */

import service from "@/utils/request";

/**
 * 角色列表
 * @param {
 * 不传或传空对象
 * } data
 */
export function GetRole(data) {
  return service.request({
    method: "post",
    url: "/role/",
    data
  });
}

/**
 * 系统列表
 * @param {
 * 不传或传空对象
 * } data
 */
export function GetSystem(data) {
  return service.request({
    method: "post",
    url: "/system/",
    data
  });
}

/**
 *添加用户
 * @param {
 * username：用户名（string）*
 * truename：真实姓名（string
 * password：密码（string）*
 * phone：手机号（number）
 * region：地区（json）
 * status：禁启用状态（string）*
 * role：角色类型（string）*
 * } data
 */
export function UserAdd(data = {}) {
  return service.request({
    method: "post",
    url: "/user/add/",
    data
  });
}

/**
 * 删除用户
 * @param {
 * id: 用户ID（array）
 * } data
 */
export function Userdelete(data) {
  return service.request({
    method: "post",
    url: "/user/delete/",
    data
  });
}

/**
 * 用户禁启用
 * @param {
 * id: 用户ID（number）
 * status: 状态（string）1：禁用，2：启用
 * } data
 */
export function UserActives(data) {
  return service.request({
    method: "post",
    url: "/user/actives/",
    data
  });
}

/**
 * 编辑用户
 * @param {
 * id：用户ID（number）*
 * username：用户名（string）*
 * truename：真实姓名（string）
 * password：密码（string） 非必传项
 * phone：手机号（number）
 * region：地区（json）
 * status：禁启用状态（string）*
 * role：角色类型（string）*
 * btnPerm：按钮权限（string）*
 * } data
 */
export function UserEdit(data) {
  return service.request({
    method: "post",
    url: "/user/edit/",
    data
  });
}
