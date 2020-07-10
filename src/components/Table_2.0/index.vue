<template>
  <div>
    <el-table :data="tableData" border style="width: 100%" stripe>
      <!-- 多选框 -->
      <el-table-column
        v-if="tableConfig.selection"
        type="selection"
        width="55"
        align="center"
      >
      </el-table-column>
      <!-- 文本数据渲染 -->
      <template v-for="item in tableConfig.tableHead">
        <!-- v-slot -->
        <el-table-column
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          align="center"
          v-if="item.columnType === 'slot'"
        >
          <template slot-scope="{ row }">
            <slot :name="item.slotName" :data="row"></slot>
          </template>
        </el-table-column>
        <!-- 正常表头 -->
        <el-table-column
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          align="center"
          v-else
        >
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="tableConfig.paginationShow"
      @size-change="pageSizeChange"
      @current-change="pageChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="tableConfig.paginationLayout"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
// 引用表格加载数据
import tableLoadData from "@/mixins/Table/tableLoadData";
// 引用分页
import pagination from "@/mixins/Table/pagination";
export default {
  name: "tableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [tableLoadData, pagination],
  data() {
    return {
      // 表格配置项
      tableConfig: {
        // 多选框
        selection: true,
        // 翻页记录checkbox
        recordCheckbox: false,
        // 请求数据
        requestData: {},
        // 表头数据
        tableHead: [],
        // 控制分页是否显示 true显示  false隐藏
        paginationShow: true,
        // 分页每页记录数集合
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      },
      // 表格数据
      tableData: []
    };
  },
  beforeMount() {
    // 初始化表格配置
    this.initTableConfig();
  },
  methods: {
    // 初始化表格配置
    // 匹配相同的key，如果存在，则替换
    initTableConfig() {
      let configData = this.config;
      let keys = Object.keys(this.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          this.tableConfig[key] = configData[key];
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>

<!--
表格封装
目录： src > components > Table > index.js
引用方式： import vTable from "@/components/Table";
配置参数
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
-->
