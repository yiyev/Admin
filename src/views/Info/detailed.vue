<template>
  <div id="test">
    <el-form ref="form" :model="form" label-width="120px">
      <!-- 信息分类 -->
      <el-form-item label="信息分类：">
        <el-select v-model="form.categoryId" placeholder="请选择信息分类">
          <el-option
            v-for="item in data.categoryList"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 新闻标题 -->
      <el-form-item label="新闻标题：">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <!-- 缩略图 -->
      <el-form-item label="缩略图：">
        <UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig" />
      </el-form-item>
      <!-- 发布日期 -->
      <el-form-item label="发布日期：">
        <el-date-picker
          v-model="form.createDate"
          type="date"
          placeholder="选择日期"
          disabled
        >
        </el-date-picker>
      </el-form-item>
      <!-- 详细内容 -->
      <el-form-item label="详细内容：">
        <quillEditor v-model="form.content" ref="myQuillEditor" />
        <!-- :options="data.editorOption" -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="data.submit_loading"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { GetList, EditInfo } from "@/api/news";
import { timestampToTime } from "@/utils/common";
import { reactive, onMounted, onActivated } from "@vue/composition-api";
// 组件
import UploadImg from "@/components/UploadImg";
// 富文本编辑器
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "detailed",
  components: { quillEditor, UploadImg },
  setup(props, { root }) {
    // 图片上传配置
    const uploadImgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
      secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
      buckety: "webjshtml"
    });
    const data = reactive({
      id: root.$route.query.id,
      categoryList: [],
      submit_loading: false //loading
    });
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      imgUrl: ""
    });

    /**
     * 获取信息分类
     */
    const getInfoCategory = () => {
      root.$store.dispatch("common/getInfoCategory").then(res => {
        data.categoryList = res;
      });
    };

    /**
     * 获取当前ID信息
     */
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 10,
        id: data.id
      };
      GetList(requestData)
        .then(res => {
          let resData = res.data.data.data[0];
          form.categoryId = resData.categoryId;
          form.title = resData.title;
          form.imgUrl = resData.imgUrl;
          form.createDate = timestampToTime(resData.createDate);
          form.content = resData.content;
        })
        .catch(err => {
          console.log(err);
        });
    };

    /**
     * 保存 （修改数据时，必须注意的，一定需要一个ID）
     */
    const submit = () => {
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imgUrl
      };
      // loading加载
      data.submit_loading = true;
      EditInfo(requestData)
        .then(res => {
          root.$message({
            message: res.data.message,
            type: "success"
          });
          data.submit_loading = false;
        })
        .catch(err => {
          data.submit_loading = false;
          console.log(err);
        });
    };

    /**
     * 生命周期
     */
    onMounted(() => {
      // 获取信息分类
      getInfoCategory();
    });
    /**
     * onActivated
     */
    onActivated(() => {
      data.id = root.$route.query.id;
      // 获取信息
      getInfo();
    });
    return {
      uploadImgConfig,
      data,
      form,
      getInfoCategory,
      getInfo,
      submit
    };
  }
};
</script>

<style lang="scss" scoped></style>
