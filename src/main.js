import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// vue3.0 api
import VueCompositionApi from "@vue/composition-api";
//路由守卫
import "@/router/premit";
// 自定义全局组件
import "./icons";
// 引入按钮权限
import { btnPermission } from "./utils/btnPermission";
Vue.prototype.btnPerm = btnPermission;
Vue.use(ElementUI, { size: "medium" });
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
