<template>
  <div>
    <el-row>
      <!-- 搜索按钮 -->
      <el-col :span="20">
        <div class="label_wrap">
          <label>关键字：</label>
          <div class="wrap_content">
            <el-row :gutter="16">
              <!-- 关键字下拉框 -->
              <el-col :span="3">
                <v-select :config="data.configSelect" />
              </el-col>
              <!-- 请输入搜索的关键字 -->
              <el-col :span="4">
                <el-input placeholder="请输入搜索的关键字"></el-input
              ></el-col>
              <!-- 搜索 -->
              <el-col :span="16">
                <el-button type="danger">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <!-- 添加用户按钮 -->
      <el-col :span="4">
        <el-button
          type="danger"
          class="pull_right"
          @click="data.dialog_add = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 间距 -->
    <div class="black_space_30"></div>
    <!-- 表格 -->
    <v-table
      ref="userTable"
      :config="data.configTable"
      :tableRow.sync="data.tableRow"
    >
      <!-- 禁启用开关按钮 -->
      <template v-slot:status="slotData"
        ><el-switch
          v-model="slotData.data.status"
          active-value="2"
          inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
      <!-- 操作按钮 -->
      <template v-slot:operation="slotData">
        <el-button
          size="mini"
          type="danger"
          @click="handlerDelete(slotData.data)"
          >删除</el-button
        >
        <el-button size="mini" type="success">编辑</el-button>
      </template>
      <!-- 操作按钮 -->
      <template v-slot:tableFooterLeft>
        <el-button size="mini" @click="batchDelete">批量删除</el-button>
      </template>
    </v-table>
    <!-- 添加用户弹框 -->
    <dialog-add :flag.sync="data.dialog_add" />
  </div>
</template>

<script>
import { reactive } from "@vue/composition-api";
import { Userdelete } from "@/api/user";
// 组件
import vSelect from "@/components/Select";
import vTable from "@/components/Table";
import dialogAdd from "./dialog/add";
import { global } from "@/utils/global";

export default {
  name: "userList",
  components: { vSelect, vTable, dialogAdd },
  setup(props, { root, refs }) {
    const { confirm } = global();
    /**
     * data
     */
    const data = reactive({
      // table选择的数据
      tableRow: {},
      // 下拉框组件配置参数
      configSelect: {
        // 下拉框key集合
        init: ["name", "phone", "email"]
      },
      // table组件配置参数
      configTable: {
        // 多选框
        selection: true,
        // 翻页记录checkbox
        recordCheckbox: true,
        // 请求接口数据
        requestData: {
          url: "getUserList",
          data: { pageNumber: 1, pageSize: 10 }
        },
        // paginationShow: false,
        // paginationLayout: "",
        // 表头数据
        tableHead: [
          { label: "邮箱/用户名", field: "username", width: "200" },
          { label: "真实姓名", field: "truename", width: "120" },
          { label: "手机号", field: "phone" },
          { label: "地区", field: "region" },
          { label: "角色", field: "role" },
          {
            label: "禁启用状态",
            field: "status",
            columnType: "slot",
            slotName: "status"
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          }
        ]
      },
      //添加用户弹框显示
      dialog_add: false
    });
    //  批量删除用户
    const batchDelete = () => {
      let idItem = data.tableRow.idItem;
      if (!idItem || idItem.length === 0) {
        root.$message.error("请勾选需要删除的用户！");
        return false;
      }
      confirm({
        content: "确认删除当前信息，删除后将无法恢复！！",
        tip: "警告",
        fn: userDelete
      });
    };
    // 单个删除用户
    const handlerDelete = params => {
      data.tableRow.idItem = [params.id];
      confirm({
        content: "确认删除当前信息，删除后将无法恢复！！",
        tip: "警告",
        fn: userDelete
      });
    };
    // 删除用户
    const userDelete = () => {
      Userdelete({ id: data.tableRow.idItem })
        .then(res => {
          root.$message({
            message: res.data.message,
            type: "success"
          });
          // 刷新数据
          refs.userTable.refreshData();
        })
        .catch(err => {
          console.log(err);
        });
    };
    return {
      data,
      batchDelete,
      handlerDelete
    };
  }
};
</script>

<style lang="scss" scoped>
.label_wrap {
  @include labelDom(left, 60, 36);
}
</style>
