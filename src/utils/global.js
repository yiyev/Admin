import { MessageBox } from "element-ui";
export function global() {
  const confirm = params => {
    MessageBox.confirm(params.content, params.tip || "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true
    })
      .then(() => {
        params.fn && params.fn(params.data || "");
      })
      .catch(() => {
        params.catchFn && params.catchFn();
      });
  };
  return {
    confirm
  };
}
