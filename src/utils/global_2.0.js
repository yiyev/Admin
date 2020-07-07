import { MessageBox } from "element-ui";
export default {
  install(Vue, options) {
    Vue.prototype.comfirm = params => {
      MessageBox.confirm(params.content, params.tip || "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          params.fn && params.fn();
        })
        .catch(() => {});
    };
  }
};
