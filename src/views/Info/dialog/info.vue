<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    @opened="open"
    width="580px"
  >
    <el-form :model="form" ref="form">
      <el-form-item
        label="类别："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-select v-model="form.categoryId" placeholder="请选择类别">
          <el-option
            v-for="item in form.categoryList"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="标题："
        :label-width="data.formLabelWidth"
        prop="title"
      >
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item
        label="概括："
        :label-width="data.formLabelWidth"
        prop="content"
      >
        <el-input
          type="textarea"
          v-model="form.content"
          placeholder="请输入概括"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" @click="submit" :loading="data.submit_loading"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { AddInfo } from "@/api/news";
import { reactive, watch } from "@vue/composition-api";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    infoData: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit, root, refs }) {
    // data+++++
    const data = reactive({
      submit_loading: false, //loading
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "70px"
    });
    const form = reactive({
      categoryId: [], //信息分类id
      categoryList: [], //信息分类列表
      title: [], //信息标题
      content: "" //信息概括
    });
    // watch+++++
    watch(() => (data.dialog_info_flag = props.flag));
    // methods+++++
    // 打开弹框
    const open = () => {
      form.categoryList = props.category;
    };
    // 关闭弹框
    const close = () => {
      data.dialog_info_flag = false;
      refs.form.resetFields();
      emit("update:flag", false);
    };
    // submit
    const submit = () => {
      // 校验
      if (!form.categoryId) {
        return root.$message.error("分类不能为空！");
      }
      if (!form.title) {
        return root.$message.error("标题不能为空！");
      }
      if (!form.content) {
        return root.$message.error("概括不能为空！");
      }
      data.submit_loading = true;
      let requestData = {
        categoryId: form.categoryId,
        title: form.title,
        // imgUrl: form.imgUrl,
        content: form.content
      };
      AddInfo(requestData)
        .then(res => {
          data.submit_loading = false;
          refs.form.resetFields();
          root.$message({
            message: res.data.message,
            type: "success"
          });
        })
        .catch(err => {
          data.submit_loading = false;
          console.log(err);
        });
    };
    return {
      // 数据
      data,
      form,
      // methods
      open,
      close,
      submit
    };
  }
};
</script>

<style lang="scss" scoped></style>
