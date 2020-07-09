<template>
  <el-upload
    class="avatar-uploader"
    :action="config.action"
    :data="data.uploadKey"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="data.img" :src="data.img" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { reactive, watch, onMounted } from "@vue/composition-api";
import { QiniuToken } from "@/api/common";

export default {
  /**
   * 1.组件的过程要做些什么事？（七牛云token、显示默认图片、选择图片后渲染自身图片）
   * 2.最终结果要做什么？（返回选择后的图片路径）
   */
  name: "uploadImg",
  props: {
    // 图片路径
    imgUrl: {
      type: String,
      default: ""
    },
    // 图片上传配置
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    /**
     * 数据
     */
    const data = reactive({
      img: "",
      uploadKey: {
        token: "",
        key: "" //图片名称
      }
    });

    /**
     * 上传图片前事件
     */
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      // 文件名转码
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      // 图片名称赋值
      data.uploadKey.key = key;
      return isJPG && isLt2M;
    };

    /**
     * 上传图片成功事件
     */
    const handleAvatarSuccess = res => {
      let resImg = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
      data.img = resImg;
      emit("update:imgUrl", resImg);
    };

    /**
     * 获取七牛云token
     */
    const getQiniuToken = () => {
      let requestData = {
        accesskey: props.config.accesskey,
        secretkey: props.config.secretkey,
        buckety: props.config.buckety
      };
      QiniuToken(requestData)
        .then(res => {
          data.uploadKey.token = res.data.data.token;
        })
        .catch(err => {
          console.log(err);
        });
    };

    /**
     * watch监听
     */
    watch(
      () => props.imgUrl,
      value => (data.img = value)
    );

    /**
     * 生命周期
     */
    onMounted(() => {
      // 获取七牛云token
      getQiniuToken();
    });

    return { data, beforeAvatarUpload, handleAvatarSuccess, getQiniuToken };
  }
};
</script>

<style lang="scss" scoped></style>
