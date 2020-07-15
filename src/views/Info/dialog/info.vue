<template>
  <el-dialog
    :title="data.isEdit ? '编辑' : '新增'"
    :visible.sync="data.dialog_flag"
    @close="close"
    @open="open"
    width="580px"
  >
    <el-form :model="data.form" ref="form">
      <el-form-item
        label="类别："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-select v-model="data.form.categoryId" placeholder="请选择类别">
          <el-option
            v-for="item in data.categoryList"
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
        <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item
        label="概括："
        :label-width="data.formLabelWidth"
        prop="content"
      >
        <el-input
          type="textarea"
          v-model="data.form.content"
          placeholder="请输入概括"
          autosize
        ></el-input>
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
import { AddInfo, EditInfo } from "@/api/news";
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
    /**
     * data+++++++++++++++++++++++++++++++
     */
    const data = reactive({
      submit_loading: false, //loading
      dialog_flag: false, //弹窗标记
      formLabelWidth: "70px",
      isEdit: false, //编辑true | 新增false
      categoryList: [], //信息分类下拉列表
      form: {
        id: "", //信息id
        categoryId: "", //信息分类id
        title: "", //信息标题
        content: "" //信息概括
      }
    });
    /**
     * watch+++++++++++++++++++++++++++++++
     */
    watch(() => {
      data.dialog_flag = props.flag;
      data.isEdit = props.isEdit;
    });
    /**
     * methods+++++++++++++++++++++++++++++++
     */
    // 打开弹框
    const open = () => {
      // 类别下拉列表赋值
      data.categoryList = props.category;
      // 判读是新增还是编辑 编辑的情况赋值
      if (data.isEdit) {
        data.form.id = props.infoData.id;
        data.form.categoryId = props.infoData.category;
        data.form.title = props.infoData.title;
        data.form.content = props.infoData.content;
      }
    };
    // 关闭弹框
    const close = () => {
      // 重置表单
      refs["form"].resetFields();
      //重置信息id
      data.form.id = "";
      // 关闭弹框
      data.dialog_flag = false;
      emit("update:flag", false);
    };
    // 新增信息 提交
    const add_submit = requestData => {
      data.submit_loading = true;
      AddInfo(requestData)
        .then(res => {
          data.submit_loading = false;
          // 关闭弹框
          close();
          // 更新数据
          emit("updateData");
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
    // 编辑信息 提交
    const edit_submit = requestData => {
      data.submit_loading = true;
      EditInfo(requestData)
        .then(res => {
          data.submit_loading = false;
          // 关闭弹框
          close();
          // 更新数据
          emit("updateData");
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
    // submit
    const submit = () => {
      // 校验
      if (!data.form.categoryId) {
        return root.$message.error("分类不能为空！");
      }
      if (!data.form.title) {
        return root.$message.error("标题不能为空！");
      }
      if (!data.form.content) {
        return root.$message.error("概括不能为空！");
      }
      let requestData = {
        categoryId: data.form.categoryId, //分类ID
        title: data.form.title, //标题
        // imgUrl: form.imgUrl,
        content: data.form.content //内容
      };
      if (data.isEdit) {
        requestData.id = data.form.id;
      }
      data.isEdit ? edit_submit(requestData) : add_submit(requestData);
    };

    return {
      // 数据
      data,
      // methods
      open,
      close,
      submit
    };
  }
};
</script>

<style lang="scss" scoped></style>
