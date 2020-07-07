import axios from "axios";
import { Message } from "element-ui";
import { getToken, getUserName } from "@/utils/app";

// 创建axios,赋给变量service
// 手把手撸码前端API，地址http://www.web-jshtml.cn/productapi/productapi
const BASEURL = process.env.NOVD_ENV === "production" ? "" : "/devApi";
const service = axios.create({
  baseURL: BASEURL, //  http://192.168.1.103:8000/devApi/ == http://www.web-jshtml.cn/productapi/productapi
  timeout: 10000 //超时
  // 网络请求接口，假设 5000
});

// 添加请求拦截器
/**
 * 请求接口前，做一些数据处理（请求拦截器）
 */
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 后台需要前端这边传相关参数（在请求头添加参数）
    // token
    // userId
    // console.log(config.headers);
    // 业务需求

    config.headers["Tokey"] = getToken();
    config.headers["userName"] = getUserName();

    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
/**
 * 请求接口后，返回数据进行拦截（响应拦截器）
 */
service.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    let data = response.data;

    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;

/**
 * 使用export default时，但不能同时存在多个default。
 * 文件 import 不需要花括号
 */
