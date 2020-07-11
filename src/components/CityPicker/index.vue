<template>
  <div class="overflow_hidden">
    <el-row :gutter="10">
      <!-- 省份 -->
      <el-col :span="6" v-if="init.province">
        <el-select v-model="data.provinceValue" @change="provinceChange">
          <el-option
            v-for="item in data.provinceData"
            :key="item.PROVINCE_CODE"
            :label="item.PROVINCE_NAME"
            :value="item.PROVINCE_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 城市 -->
      <el-col :span="6" v-if="init.city">
        <el-select v-model="data.cityValue" @change="cityChange">
          <el-option
            v-for="item in data.cityData"
            :key="item.CITY_CODE"
            :label="item.CITY_NAME"
            :value="item.CITY_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 区域 -->
      <el-col :span="6" v-if="init.area">
        <el-select v-model="data.areaValue" @change="areaChange">
          <el-option
            v-for="item in data.areaData"
            :key="item.AREA_CODE"
            :label="item.AREA_NAME"
            :value="item.AREA_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 街道 -->
      <el-col :span="6" v-if="init.street">
        <el-select v-model="data.streetValue" @change="streeChange">
          <el-option
            v-for="item in data.streetData"
            :key="item.STREET_CODE"
            :label="item.STREET_NAME"
            :value="item.STREET_CODE"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { watch, reactive, onBeforeMount } from "@vue/composition-api";
import { cityPicker } from "@/mixins/CityPicker/cityPicker";
export default {
  name: "cityPicker",
  props: {
    cityPickerLevel: {
      type: Array,
      default: () => []
    },
    cityPickerData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    // 初始化省市区街道联动
    const init = reactive({
      province: false,
      city: false,
      area: false,
      street: false
    });
    // 组件方法
    const {
      getProvince,
      provinceChange,
      cityChange,
      areaChange,
      streeChange,
      data,
      resultData
    } = cityPicker();

    /**
     * 初始化
     */
    const initCityPicker = () => {
      let initData = props.cityPickerLevel;
      if (initData.length === 0) {
        for (let key in init) {
          init[key] = true;
        }
      } else {
        initData.forEach(item => {
          init[item] = true;
        });
      }
    };

    /**
     * watch 监听省市区街道值实时更新
     */
    watch(
      [
        () => resultData.provinceValue,
        () => resultData.cityValue,
        () => resultData.areaValue,
        () => resultData.streetValue
      ],
      () => {
        emit("update:cityPickerData", resultData);
      }
    );

    onBeforeMount(() => {
      // 初始化
      initCityPicker();
      // 获取省份
      getProvince();
    });

    return {
      init,
      data,
      resultData,
      // 事件
      getProvince,
      provinceChange,
      cityChange,
      areaChange,
      streeChange
    };
  }
};
</script>

<style lang="scss" scoped></style>
