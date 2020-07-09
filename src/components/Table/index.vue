<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%" stripe>
      <!-- 多选框 -->
      <el-table-column
        v-if="data.tableConfig.selection"
        type="selection"
        width="55"
        align="center"
      >
      </el-table-column>
      <!-- 文本数据渲染 -->
      <template v-for="item in data.tableConfig.tableHead">
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
      v-if="data.tableConfig.paginationShow"
      @size-change="pageSizeChange"
      @current-change="pageChange"
      :current-page="pageData.currentPage"
      :page-sizes="pageData.pageSizes"
      :page-size="pageData.pageSize"
      :layout="data.tableConfig.paginationLayout"
      :total="pageData.total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
import { reactive, onBeforeMount, watch } from "@vue/composition-api";

// 引用表格加载数据
import { loadData } from "./tableLoadData";
import { paginationHook } from "./paginationHook";
export default {
  name: "tableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    // 加载数据
    const { tableData, tableLoadData } = loadData({ root });
    // 页码
    const {
      pageData,
      pageSizeChange,
      pageChange,
      totalCount
    } = paginationHook();

    /**
     * 数据
     */
    const data = reactive({
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
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    });

    /**
     * watch
     */
    // 表格数据渲染
    watch(
      [() => tableData.item, () => tableData.total],
      ([tableData, tableCount]) => {
        data.tableData = tableData;
        totalCount(tableCount);
      }
    );
    // 页码监听
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([currentPage, pageSize]) => {
        let resData = data.tableConfig.requestData;
        if (resData.data) {
          resData.data.pageNumber = currentPage;
          resData.data.pageSize = pageSize;
          // 加载数据
          tableLoadData(data.tableConfig.requestData);
        }
      }
    );

    /**
     * 方法 methods
     */
    // 初始化表格配置
    // 匹配相同的key，如果存在，则替换
    const initTableConfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = configData[key];
        }
      }
    };

    /**
     * onBeforeMount
     */
    onBeforeMount(() => {
      // 初始化表格配置
      initTableConfig();
      // 加载数据
      tableLoadData(data.tableConfig.requestData);
    });
    return {
      data,
      pageData,
      pageSizeChange,
      pageChange
    };
  }
};
</script>

<style lang="scss" scoped></style>

<!--
表格封装
-->
