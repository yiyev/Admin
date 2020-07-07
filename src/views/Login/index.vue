<template>
  <div id="login">
    <div class="login_wrap">
      <ul class="menu_tab">
        <li
          :class="{ current: item.current }"
          v-for="item in menuTab"
          :key="item.id"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!-- 表单 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login_form"
        size="medium"
      >
        <!-- 邮箱 -->
        <el-form-item prop="userName" class="item_form">
          <label for="email">邮箱：</label>
          <el-input
            type="text"
            id="email"
            v-model="ruleForm.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="passWord" class="item_form">
          <label for="passWord">密码：</label>
          <el-input
            type="password"
            id="passWord"
            v-model="ruleForm.passWord"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <!-- 重复密码 -->
        <el-form-item
          prop="passWords"
          class="item_form"
          v-show="model === 'register'"
        >
          <label for="passWords">重复密码</label>
          <el-input
            type="password"
            id="passWords"
            v-model="ruleForm.passWords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code" class="item_form">
          <label for="vCode">验证码</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <el-input
                id="vCode"
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
                >{{ codeButtonStatus.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login_btn block"
            :disabled="loginButtonStatus"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
import { GetSms, Register } from "@/api/login";
import { reactive, ref } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate";
export default {
  name: "login",
  setup(props, { refs, root }) {
    // 验证用户名
    let validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback(); //true
      }
    };
    // 验证密码
    let validatePassWord = (rule, value, callback) => {
      // 过滤后的数据
      ruleForm.passWord = stripscript(value);
      value = ruleForm.passWord;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    let validatePassWords = (rule, value, callback) => {
      // 如果模块值为login，直接通过
      if (model.value === "login") {
        callback();
      }
      // 过滤后的数据
      ruleForm.passWords = stripscript(value);
      value = ruleForm.passWords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.passWord) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    // 验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    // *************申明数据*************************
    // 这里放置data数据、生命周期、自定义的函数
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // 模块值
    const model = ref("login");
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true);
    // 验证码按钮状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    // 倒计时
    const timer = ref(null);
    // 表单绑定数据
    const ruleForm = reactive({
      userName: "2669728876@qq.com",
      passWord: "admin7",
      passWords: "",
      code: ""
    });
    const rules = reactive({
      userName: [{ validator: validateUserName, trigger: "blur" }],
      passWord: [{ validator: validatePassWord, trigger: "blur" }],
      passWords: [{ validator: validatePassWords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    // ***********************申明函数*******************************************

    /**
     * 1. 不建议在一个方法里面做多件不同的事件（尽可能只做自己本身的事情）
     * 2. 尽量把相同的事情封装一个方法里面，通过调用函数进行执行
     */

    // 登录注册切换
    const toggleMenu = data => {
      menuTab.forEach(el => {
        el.current = false;
      });
      // 高光
      data.current = true;
      // 修改模块值
      model.value = data.type;
      // 清除表单数据
      resetFormData();
      // 清除倒计时
      clearCountDown();
    };
    // 获取验证码
    const getSms = () => {
      // 邮箱校验
      if (ruleForm.userName == "") {
        root.$message.error("邮箱不能为空！！");
        return false;
      }
      if (validateEmail(ruleForm.userName)) {
        root.$message.error("邮箱格式有误，请重新输入！！");
        return false;
      }
      let requestData = {
        username: ruleForm.userName,
        model: model.value
      };
      // 获取验证码
      GetSms(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 启用登录或注册按钮
          loginButtonStatus.value = false;
          codeButtonStatus.status = true;
          // 调定时器，倒计时
          countDown(60);
        })
        .catch(error => {
          console.log(error);
        });
    };
    //提交表单
    const submitForm = formName => {
      refs[formName].validate(valid => {
        // 表单验证通过
        if (valid) {
          // 三元运算
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 登录
    const login = () => {
      let requestData = {
        username: ruleForm.userName,
        password: sha1(ruleForm.passWord),
        code: ruleForm.code
      };
      root.$store
        .dispatch("app/login", requestData)
        .then(() => {
          // 页面跳转
          root.$router.push({
            name: "Console"
          });
        })
        .catch(err => {
          console.log(err);
        });
      /* Login(requestData)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 页面跳转
          root.$router.push({
            name: "Console"
          });
        })
        .catch(err => {
          console.log(err);
        }); */
    };
    //  注册
    const register = () => {
      let requestData = {
        username: ruleForm.userName,
        password: sha1(ruleForm.passWord),
        code: ruleForm.code
      };
      Register(requestData)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 注册成功
          toggleMenu(menuTab[0]);
          clearCountDown();
        })
        .catch(err => {
          // 失败执行代码
          console.log(err);
        });
    };
    //清除表单数据
    const resetFormData = () => {
      // 重置表单
      refs["loginForm"].resetFields();
    };
    // 更新按钮状态
    const updataButtonStatus = params => {
      // 修改获取验证码状态
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    // 倒计时
    const countDown = number => {
      // 判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }

      let time = number;

      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updataButtonStatus({ status: false, text: "再次获取" });
          return;
        }
        codeButtonStatus.text = `倒计时${time}秒`;
      }, 1000);
    };
    // 清除倒计时
    const clearCountDown = () => {
      // 还原验证码按钮默认状态
      updataButtonStatus({
        status: false,
        text: "获取验证码"
      });
      // 清除倒计时
      clearInterval(timer.value);
    };
    return {
      menuTab,
      model,
      loginButtonStatus,
      codeButtonStatus,
      ruleForm,
      rules,
      timer,
      toggleMenu,
      submitForm,
      getSms
    };
  }
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login_wrap {
  width: 330px;
  margin: auto;
}
.menu_tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login_form {
  margin-bottom: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item_form {
    margin-bottom: 13px;
  }
  .block {
    width: 100%;
    display: block;
  }
  .login_btn {
    margin-top: 19px;
  }
}
</style>
<!--
密码加密：
1、在前端预先加密一次
登录的密码：123456（普通字符串）
经过加密后：sha1('123456') == '541216ad5s4f5ds1f5asd4f65asd4' （加密后的字符串）


2、后台加密
接收到字符串：'541216ad5s4f5ds1f5asd4f65asd4'
后台再次加密：md5('541216ad5s4f5ds1f5asd4f65asd4') == '8f9qwersd3g165y4d1sf3s1f6aew4'（最终的加密后的密码）
最终新的字符串写入数据库：8f9qwersd3g165y4d1sf3s1f6aew4


3、登录
用户名与加密后的密码进行匹配，成功则登录，失败则提示
-->
