import cookie from "cookie_js";

const adminToken = "token";
const userName = "username";

// 获取token
export function getToken() {
  return cookie.get(adminToken);
}
// 设置token
export function setToken(token) {
  return cookie.set(adminToken, token);
}
// 移除token
export function removeToken() {
  return cookie.remove(adminToken);
}
// 设置用户名
export function setUserName(value) {
  return cookie.set(userName, value);
}
// 获取用户名
export function getUserName() {
  return cookie.get(userName);
}
// 移除用户名
export function removeUserName() {
  return cookie.remove(userName);
}
