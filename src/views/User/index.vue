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
        <el-button type="danger" class="pull_right">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 间距 -->
    <div class="black_space_30"></div>
    <!-- 表格 -->
    <v-table :config="data.configTable">
      <!-- 禁启用开关按钮 -->
      <template v-slot:status="data"
        ><el-switch active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </template>
      <!-- 操作按钮 -->
      <template v-slot:operation="data">
        <el-button size="mini" type="danger">删除</el-button>
        <el-button size="mini" type="success">编辑</el-button>
      </template>
    </v-table>
  </div>
</template>

<script>
import { reactive } from "@vue/composition-api";
// 组件
import vSelect from "@/components/Select";
import vTable from "@/components/Table";

export default {
  name: "userList",
  components: { vSelect, vTable },
  setup(props, { root }) {
    /**
     * data
     */
    const data = reactive({
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
          { label: "邮箱/用户名", field: "email", width: "200" },
          { label: "真实姓名", field: "name", width: "120" },
          { label: "手机号", field: "phone" },
          { label: "地区", field: "address" },
          { label: "角色", field: "role" },
          {
            label: "禁启用状态",
            field: "type",
            columnType: "slot",
            slotName: "status"
          },
          {
            label: "操作",
            // field: "type",
            columnType: "slot",
            slotName: "operation"
          }
        ]
      }
    });

    return {
      data
    };
  }
};
</script>

<style lang="scss" scoped>
.label_wrap {
  @include labelDom(left, 60, 36);
}
</style>
