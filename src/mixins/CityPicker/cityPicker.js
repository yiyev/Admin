import { reactive } from "@vue/composition-api";
import { GetCityPicker } from "@/api/common";

export function cityPicker() {
  /**
   * ******************数据*************************
   */
  const data = reactive({
    provinceValue: "",
    cityValue: "",
    areaValue: "",
    streetValue: "",
    provinceData: [],
    cityData: [],
    areaData: [],
    streetData: []
  });
  const resultData = reactive({
    provinceValue: "",
    cityValue: "",
    areaValue: "",
    streetValue: ""
  });

  /**
   * 获取省份
   */
  const getProvince = () => {
    // 获取数据
    getData({ type: "province" });
  };

  /**
   * 选择省份，获取城市
   */
  const provinceChange = val => {
    // 重置选项
    resetValue({ type: "city" });
    // 获取数据
    getData({ type: "city", province_code: val });
  };

  /**
   * 选择城市，获取区县
   */
  const cityChange = val => {
    // 重置选项
    resetValue({ type: "area" });
    // 获取数据
    getData({ type: "area", city_code: val });
  };

  /**
   * 选择区县，获取街道
   */
  const areaChange = val => {
    // 重置选项
    resetValue({ type: "street" });
    // 获取数据
    getData({ type: "street", area_code: val });
  };

  /**
   * 选择街道
   */
  const streeChange = () => {
    // 重置选项
    resetValue({ type: "" });
  };

  /**
   * 获取数据
   */
  const getData = requestData => {
    GetCityPicker(requestData)
      .then(res => {
        data[`${requestData.type}Data`] = res.data.data.data;
      })
      .catch(err => {
        console.log(err);
      });
  };

  /**
   * 重置选项
   */
  const resetValue = params => {
    let valueJson = {
      city: ["cityValue", "areaValue", "streetValue", "areaData", "streetData"],
      area: ["areaValue", "streetValue", "streetData"],
      street: ["streetValue"]
    };
    let arrObj = valueJson[params.type];
    // 清空指定的key值
    if (arrObj) {
      arrObj.forEach(item => (data[item] = ""));
    }
    // 数据集合处理
    result();
  };

  /**
   * 返回数据集合
   */
  const result = () => {
    for (let key in resultData) {
      resultData[key] = data[key];
    }
  };

  return {
    // ...toRefs(data), //把对象类型转为基础数据类型，可进行解构响应
    data,
    resultData,
    getProvince,
    provinceChange,
    cityChange,
    areaChange,
    streeChange,
    resetValue,
    result,
    getData
  };
}

/**
 * 省市区街道方法封装
 * 目录： src >  mixins > CityPicker > cityPicker.js
 * 引用方法：
 *  import { cityPicker } from "@/mixins/CityPicker/cityPicker"
 *  const {
      getProvince,
      provinceChange,
      cityChange,
      areaChange,
      streeChange,
      data,
      resultData
    } = cityPicker();
 */
