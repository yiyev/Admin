<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({ type: 'category_first_add' })"
      >添加一级分类</el-button
    >
    <hr class="hr_e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category_wrap">
            <!-- 一级分类 -->
            <div
              class="category"
              v-for="firstItem in data.categoryList"
              :key="firstItem.id"
            >
              <h4>
                <svg-icon icon-class="plus" />
                {{ firstItem.category_name }}
                <div class="button_group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="
                      editCategory({
                        data: firstItem,
                        type: 'category_first_edit'
                      })
                    "
                    >编辑</el-button
                  >
                  <el-button size="mini" type="success" round
                    >添加子集</el-button
                  >
                  <el-button
                    size="mini"
                    round
                    @click="deleteCategoryConfirm(firstItem.id)"
                    >删除</el-button
                  >
                </div>
              </h4>
              <!-- 二级分类 -->
              <ul v-if="firstItem.children">
                <li
                  v-for="childrenItem in firstItem.children"
                  :key="childrenItem.id"
                >
                  {{ childrenItem.category_name }}
                  <div class="button_group">
                    <el-button size="mini" type="danger" round>编辑</el-button>
                    <el-button size="mini" round>删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu_title">一级分类编辑</h4>
          <el-form
            :model="data.categoryForm"
            label-width="142px"
            class="form_wrap"
            ref="data.categoryForm"
          >
            <el-form-item
              label="一级分类名称："
              prop="categoryName"
              v-if="data.category_first_input"
            >
              <el-input
                v-model="data.categoryForm.categoryName"
                :disabled="data.category_first_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="二级分类名称："
              prop="secCategoryName"
              v-if="data.category_children_input"
            >
              <el-input
                v-model="data.categoryForm.secCategoryName"
                :disabled="data.category_children_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit('data.categoryForm')"
                :loading="data.submit_loading"
                :disabled="data.submit_btn_disabled"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AddFirstCategory, DeleteCategory, EditCategory } from "@/api/news";
import { reactive, onMounted, watch } from "@vue/composition-api";
import { global } from "@/utils/global";
import { common } from "@/api/common";
export default {
  name: "category",
  setup(props, { root, refs }) {
    // global
    const { confirm } = global();
    const { getInfoCategory, category } = common();
    // 数据++++++++
    const data = reactive({
      categoryList: [], //分类列表
      category_first_input: true, //一级分类名称
      category_children_input: true, //子级分类名称
      submit_loading: false, //loading
      category_first_disabled: true, //一级分类
      category_children_disabled: true, //二级分类
      submit_btn_disabled: true, //提交
      submit_btn_type: "", //一级分类| 二级分类
      curData: "", //当前数据
      categoryForm: {
        categoryName: "",
        secCategoryName: ""
      }
    });
    // methods++++++
    // 添加一级分类
    const addFirst = params => {
      console.log(`params`, params);

      data.submit_btn_type = params.type;
      console.log(`type`, data.submit_btn_type);

      // 清空输入框
      data.categoryForm.categoryName = "";
      data.category_first_input = true;
      data.category_children_input = false;
      data.category_first_disabled = false;
      data.category_children_disabled = true;
      data.submit_btn_disabled = false;
    };
    // 确定按钮
    const submit = ruleForm => {
      // 添加一级分类
      if (data.submit_btn_type == "category_first_add") {
        addFirstCategory(ruleForm);
      }
      //
      if (data.submit_btn_type == "category_first_edit") {
        editFirstCategory(ruleForm);
      }
    };
    // 添加一级分类
    const addFirstCategory = ruleForm => {
      // 校验
      if (!data.categoryForm.categoryName) {
        return root.$message.error("分类名称不能为空！");
      }
      let requsetData = {
        categoryName: data.categoryForm.categoryName
      };
      data.submit_loading = true;
      AddFirstCategory(requsetData)
        .then(res => {
          let dataT = res.data;
          if (dataT.resCode === 0) {
            // 获取信息分类
            getInfoCategory();
            root.$message({
              type: "success",
              message: dataT.message
            });
          }
          data.submit_loading = false;
          refs[ruleForm].resetFields();
        })
        .catch(err => {
          data.submit_loading = false;
          refs[ruleForm].resetFields();
          console.log(err);
        });
    };
    // 删除分类前确认
    const deleteCategoryConfirm = categoryId => {
      confirm({
        content: "确认删除当前信息，确认后将无法恢复！",
        fn: deleteCategory,
        data: categoryId,
        catchFn: () => {}
      });
    };
    // 删除分类
    const deleteCategory = categoryId => {
      DeleteCategory({ categoryId: categoryId })
        .then(res => {
          let dataT = res.data;
          if (dataT.resCode === 0) {
            // 获取信息分类
            getInfoCategory();
            root.$message({
              type: "success",
              message: dataT.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
    // 编辑分类
    const editCategory = params => {
      data.submit_btn_type = params.type;
      data.category_children_input = false;
      data.category_first_disabled = false;
      data.submit_btn_disabled = false;
      // 一级分类名称输入还原名称
      data.categoryForm.categoryName = params.data.category_name;
      // 储存当前数据对象
      data.curData = params.data;
    };
    // submit 编辑一级分类
    const editFirstCategory = ruleForm => {
      if (!data.curData.id) {
        return root.$message.error("请选择分类！");
      }
      let requestData = {
        id: data.curData.id,
        categoryName: data.categoryForm.categoryName
      };
      data.submit_loading = true;
      EditCategory(requestData)
        .then(res => {
          let dataT = res.data;
          if (dataT.resCode === 0) {
            root.$message({
              message: dataT.message,
              type: "success"
            });
            // 获取信息分类
            getInfoCategory();
            // 清空输入框
            data.submit_loading = false;
            refs[ruleForm].resetFields();
            data.curData.id = "";
          }
        })
        .catch(err => {
          // 清空输入框
          data.submit_loading = false;
          refs[ruleForm].resetFields();
          console.log(err);
        });
    };

    /**
     * 生命周期
     */
    onMounted(() => {
      // 获取信息分类
      getInfoCategory();
      /**
       * vuex
       */
      // root.$store.dispatch("common/getInfoCategory").then(res => {
      //   console.log(`res`, res);
      // });
    });

    /**
     * watch
     */
    watch(
      () => category.item,
      value => {
        data.categoryList = value;
      }
    );
    return {
      data,
      addFirst,
      submit,
      deleteCategoryConfirm,
      editCategory
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";
.category_wrap {
  div.category:first-child {
    &::before {
      top: 20px;
    }
  }
  div.category:last-child {
    &::before {
      bottom: 21px;
    }
  }
}

.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    // position: relative;
    padding-left: 40px;
    svg {
      position: absolute;
      left: 14px;
      top: 15px;
      font-size: 17px;
    }
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 32px;
      padding-top: 22px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.3s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button_group {
        display: block;
      }
    }
  }
  .button_group {
    display: none;
    position: absolute;
    z-index: 2;
    right: 11px;
    top: -1px;
    button {
      font-size: 12px;
    }
  }
}
.menu_title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.hr_e9 {
  margin-left: -30px;
  margin-right: -30px;
  border: none;
  margin-top: 30px;
  border-bottom: 1px solid #e9e9e9;
}
.form_wrap {
  width: 410px;
  padding-top: 26px;
}
</style>
