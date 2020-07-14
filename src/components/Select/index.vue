<template>
  <el-select
    v-model="data.selectValue"
    placeholder="请选择"
    @change="selectChange"
  >
    <el-option
      v-for="item in data.initOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { reactive, onMounted } from "@vue/composition-api";
export default {
  name: "selectT",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    selectData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    /**
     * data
     */
    const data = reactive({
      selectValue: "",
      initOptions: [],
      options: [
        { value: "truename", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "username", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" }
      ]
    });

    /**
     * 初始化下拉选择
     */
    const initOptions = () => {
      let initData = props.config.init;
      // 数据校验
      if (initData.length === 0) {
        console.log(
          `%c%s`,
          `color:red`,
          `config的参数是空的，无法显示下拉菜单`
        );
        return false;
      }

      let optionArr = [];
      initData.forEach(item => {
        // filter匹配成功后是一个数组，需要取下标第一个
        let arr = data.options.filter(el => el.value == item);
        if (arr.length > 0) {
          optionArr.push(arr[0]);
        }
      });
      // 数据校验
      if (optionArr.length === 0) {
        console.log(`%c%s`, `color:red`, `匹配的数据为空！`);
        return false;
      }
      // 初始化赋值
      data.initOptions = optionArr;
      // 初始化搜索类型
      data.selectValue = optionArr[0].value;
      // 返回初始值
      emit("update:selectData", optionArr[0]);
    };

    /**
     * 选择触发
     */
    const selectChange = val => {
      let filterData = data.options.filter(item => item.value === val)[0];
      emit("update:selectData", filterData);
    };

    /**
     * onMounted
     */
    onMounted(() => {
      // 初始化下拉选择
      initOptions();
    });

    return {
      data,
      selectChange
    };
  }
};
</script>

<style lang="scss" scoped></style>

<!--
下拉框组件封装
组件目录位置：src > components > Select > index.vue
组件引用方式：import vSelect from "@/components/Select";
teplate： <v-select :config="data.configOptions" />

参数配置：
configOptions: {
  init: ["username", "phone"]
}
configOptions： Object;
init: 
  数据类型：Array;
  可配置的数据："username", "phone", "username", "id", "title";
-->
