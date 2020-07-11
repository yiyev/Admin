<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_flag"
    @close="close"
    @open="open"
    width="750px"
  >
    <el-form :model="data.form" ref="form" :rules="data.rules">
      <!-- 用户名 -->
      <el-form-item
        label="用户名："
        :label-width="data.formLabelWidth"
        prop="username"
        required
      >
        <el-input
          v-model="data.form.username"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item
        label="密码："
        :label-width="data.formLabelWidth"
        prop="password"
        required
      >
        <el-input
          v-model="data.form.password"
          placeholder="请输入6至20位数字+字母"
          minlength="6"
          maxlength="20"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <!-- 真实姓名 -->
      <el-form-item
        label="真实姓名："
        :label-width="data.formLabelWidth"
        prop="truename"
      >
        <el-input
          v-model="data.form.truename"
          placeholder="请输入真实姓名"
          minlength="2"
          maxlength="4"
        ></el-input>
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item
        label="手机号："
        :label-width="data.formLabelWidth"
        prop="phone"
      >
        <el-input
          v-model.trim="data.form.phone"
          placeholder="请输入手机号"
          minlength="11"
          maxlength="11"
        ></el-input>
      </el-form-item>
      <!-- 地区 -->
      <el-form-item
        label="地区："
        :label-width="data.formLabelWidth"
        prop="region"
      >
        <city-picker :cityPickerData.sync="data.cityPickerData" />
      </el-form-item>
      <!-- 是否启用 -->
      <el-form-item
        label="是否启用："
        :label-width="data.formLabelWidth"
        prop="status"
        required
      >
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>
      <!-- 角色 -->
      <el-form-item
        label="角色："
        :label-width="data.formLabelWidth"
        prop="role"
        required
      >
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox
            v-for="item in data.roleItem"
            :key="item.role"
            :label="item.name"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="data.dialog_flag = false">取消</el-button>
      <el-button type="danger" @click="submit" :loading="data.submit_loading"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { reactive, watch } from "@vue/composition-api";
import { GetRole, UserAdd } from "@/api/user";
// 地区组件
import cityPicker from "@/components/CityPicker";
// 加密
import sha1 from "js-sha1";
// 校验
import {
  stripscript,
  validateEmail,
  validatePass,
  validateTrueName,
  validatePhone
} from "@/utils/validate";
export default {
  name: "dialogInfo",
  components: { cityPicker },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit, root, refs }) {
    // 验证用户名
    let validateusername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback(); //true
      }
    };
    // 验证密码
    let validatepassword = (rule, value, callback) => {
      // 过滤后的数据
      data.form.password = stripscript(value);
      value = data.form.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };
    // 验证真实姓名
    let validatetruename = (rule, value, callback) => {
      // 过滤后的数据
      data.form.truename = stripscript(value);
      value = data.form.truename;
      // 非必填项，如果不填的话，默认通过，否则校验
      if (value === "") {
        callback();
      } else if (validateTrueName(value)) {
        callback(new Error("真实姓名为2至4位汉字"));
      } else {
        callback();
      }
    };
    // 验证手机号
    let validateUserphone = (rule, value, callback) => {
      // 过滤后的数据
      data.form.phone = stripscript(value);
      value = data.form.phone;
      // 非必填项，如果不填的话，默认通过，否则校验
      if (value === "") {
        callback();
      } else if (validatePhone(value)) {
        callback(new Error("手机号格式有误"));
      } else {
        callback();
      }
    };
    // 验证角色类型
    let validaterole = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("至少选择一个角色类型"));
      } else {
        callback();
      }
    };
    /**
     * 数据+++++++++++++++++++++++++++++++
     */
    const data = reactive({
      dialog_flag: false, //弹窗标记
      form: {
        username: "", //用户名*
        password: "", //密码*
        truename: "", //真实姓名
        phone: "", //手机号
        region: "", //地区
        status: "1", //禁启用状态*
        role: [] //角色类型*
      },
      // 表单校验规则
      rules: {
        username: [{ validator: validateusername, trigger: "blur" }], //用户名*
        password: [{ validator: validatepassword, trigger: "blur" }], //密码*
        truename: [{ validator: validatetruename, trigger: "blur" }], //真实姓名++++++
        phone: [{ validator: validateUserphone, trigger: "blur" }], //手机号++++++
        role: [{ validator: validaterole, trigger: "blur" }] //角色类型*++++++
      },
      formLabelWidth: "100px",
      // 城市数据
      cityPickerData: {},
      // 角色数据
      roleItem: [],
      // 省市区街道联动类型
      // cityPickerLevel: ["province", "city"],
      submit_loading: false //loading
    });

    /**
     * watch+++++++++++++++++++++++++++++++
     */
    watch(() => {
      data.dialog_flag = props.flag;
    });

    /**
     *
     */

    /**
     * methods+++++++++++++++++++++++++++++++
     */
    /**
     * 请求角色
     */
    const getRole = () => {
      GetRole().then(res => {
        data.roleItem = res.data.data;
      });
    };
    // submit
    const submit = () => {
      refs["form"].validate(valid => {
        // 表单验证通过
        if (valid) {
          let requestData = JSON.parse(JSON.stringify(data.form));
          requestData.role = requestData.role.join(); //数组转字符串，默认以逗号隔开
          requestData.region = JSON.stringify(data.cityPickerData);
          requestData.password = sha1(requestData.password);
          console.log(`phone`, requestData.phone.length);
          console.log(`requestData`, requestData);
          UserAdd(requestData)
            .then(res => {
              root.$message({
                message: res.data.message,
                type: "success"
              });
              // 重置表单
              resetForm();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**
     * 重置表单-----地区未重置
     */
    const resetForm = () => {
      refs["form"].resetFields();
    };

    // 打开弹框，动画结束时
    const open = () => {
      getRole();
    };

    // 关闭弹框
    const close = () => {
      // 关闭弹框
      data.dialog_flag = false;
      emit("update:flag", false);
    };

    return {
      data,
      getRole,
      open,
      close,
      submit,
      resetForm
    };
  }
};
</script>

<style lang="scss" scoped></style>
