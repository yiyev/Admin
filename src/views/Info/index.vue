<template>
  <div>
    <el-row :gutter="16">
      <!-- 类别 -->
      <el-col :span="4">
        <div class="label_wrap category">
          <label for="">分类：</label>
          <div class="wrap_content">
            <el-select v-model="data.category_value" class="fullWidth">
              <el-option
                v-for="item in data.categoryList"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <!-- 日期 -->
      <el-col :span="7">
        <div class="label_wrap date">
          <label for="">日期：</label>
          <div class="wrap_content">
            <el-date-picker
              v-model="data.date_value"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="fullWidth"
              format="yyyy 年 MM 月 dd 日 HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <!-- 关键字 -->
      <el-col :span="3">
        <div class="label_wrap key_word">
          <label for="">关键字：</label>
          <div class="wrap_content">
            <v-select :config="data.configOptions" />
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="data.search_keywork"
          placeholder="请输入内容"
          class="fullWidth"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" class="btn_height fullWidth" @click="search"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="2" class="pull_right">
        <el-button type="danger" class="btn_height fullWidth" @click="addInfo"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <div class="black_space_30"></div>
    <!-- 表格数据 -->
    <el-table
      :data="data.table_data"
      border
      style="width: 100%"
      v-loading="data.loadingData"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="45" align="center">
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center" width="750">
      </el-table-column>
      <el-table-column
        prop="categoryId"
        label="类别"
        align="center"
        width="130"
        :formatter="toCategory"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        align="center"
        width="237"
        :formatter="toData"
      ></el-table-column>
      <el-table-column prop="user" label="管理员" align="center" width="115">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button type="danger" size="mini" @click="deleteItem(row.id)"
            >删除</el-button
          >
          <el-button type="success" size="mini" @click="editItem(row)"
            >编辑</el-button
          >
          <router-link
            :to="{ name: 'InfoDetailed', query: { id: row.id } }"
            class="margin_left_10"
          >
            <el-button type="success" size="mini">编辑详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="black_space_30"></div>
    <!-- 底部分页 -->
    <el-row>
      <el-col :span="12">
        <el-button @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull_right"
          background
          @size-change="pageSizeChange"
          @current-change="pageChange"
          :current-page="page.pageNumber"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增|编辑弹窗 -->
    <DialogInfo
      :flag.sync="data.dialog_info"
      :category="data.categoryList"
      :isEdit="data.isEdit"
      :infoData="data.infoData"
      @updateData="getList"
    />
  </div>
</template>

<script>
import { global } from "@/utils/global";
import { common } from "@/api/common";
import { GetList, DeleteInfo } from "@/api/news";
import { reactive, onMounted, watch } from "@vue/composition-api";
import { timestampToTime } from "@/utils/common";
// 组件
import DialogInfo from "./dialog/info";
import VSelect from "@/components/Select";
export default {
  name: "infoIndex",
  components: { DialogInfo, VSelect },
  setup(props, { root }) {
    const { confirm } = global();
    const { getInfoCategory, category } = common();
    // 数据+++++++++++
    const data = reactive({
      configOptions: { init: ["id", "title"] },
      category_value: "", //类别id
      date_value: "", //日期
      search_key: "id", //关键字  id/标题
      search_keywork: "", //搜索内容
      dialog_info: false, //新增弹框展示
      dialog_edit: false, //编辑弹框展示+++
      categoryList: [], //类别列表
      table_data: [], //表格数据
      loadingData: false, //loading加载
      deleteInfoId: "", //删除id列表
      isEdit: false, //false新增弹框 true编辑弹框
      infoData: {
        id: "", //信息id
        category: "", //类别id
        title: "", //title
        content: "" //content
      } //新增数据
    });
    // 页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10,
      total: 0
    });
    // methods+++++++++++
    // 搜索数据处理
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      // 分类ID
      if (data.category_value) {
        requestData.categoryId = data.category_value;
      }
      // 日期+++待定
      if (data.data_value && data.data_value.length > 0) {
        requestData.startTiem = data.data_value[0];
        requestData.endTime = data.data_value[1];
      }
      // 关键字
      if (data.search_keywork) {
        requestData[data.search_key] = data.search_keywork;
      }

      return requestData;
    };
    // 获取列表
    const getList = () => {
      // 处理数据
      let requestData = formatData();
      // 加载状态
      data.loadingData = true;
      GetList(requestData)
        .then(res => {
          let resData = res.data.data;
          // 更新数据
          data.table_data = resData.data;
          // 页码统计数量
          page.total = resData.total;
          // 加载状态
          data.loadingData = false;
        })
        .catch(err => {
          data.loadingData = false;
          console.log(err);
        });
    };
    // 新增
    const addInfo = () => {
      // 新增状态
      data.isEdit = false;
      data.dialog_info = true;
    };
    // 搜索框
    const search = () => {
      // 获取列表
      getList();
    };
    // 选中数据
    const selectionChange = val => {
      data.deleteInfoId = val.map(item => item.id);
    };

    // 页码变化
    const pageChange = val => {
      page.pageNumber = val;
      // 获取列表
      getList();
    };
    // 每页记录数变化
    const pageSizeChange = () => {};
    // 删除单条数据
    const deleteItem = id => {
      data.deleteInfoId = [id];
      confirm({
        content: "确认删除当前信息，删除后将无法恢复！！",
        fn: confirmDelete
      });
    };
    // 批量删除
    const deleteAll = () => {
      // 删除前校验
      console.log(Array.isArray(data.deleteInfoId));

      if (!data.deleteInfoId || data.deleteInfoId.length === 0) {
        root.$message.error("请选择要删除的数据！");
        return false;
      }
      confirm({
        content: "确认删除选择数据，删除后将无法恢复！！",
        tip: "警告",
        fn: confirmDelete
      });
    };
    // 确认删除
    const confirmDelete = () => {
      DeleteInfo({ id: data.deleteInfoId })
        .then(res => {
          root.$message({
            message: res.data.message,
            type: "success"
          });
          data.deleteInfoId = [];
          // 获取列表
          getList();
        })
        .catch(err => {
          console.log(err);
        });
    };
    // 编辑
    const editItem = row => {
      // console.log(row);
      // 赋值
      data.infoData.id = row.id; //信息id
      data.infoData.category = row.categoryId; //类别id
      data.infoData.title = row.title; //title
      data.infoData.content = row.content; //content
      // 编辑状态
      data.isEdit = true;
      // 打开弹窗
      data.dialog_info = true;
    };
    // 类别格式化
    const toCategory = row => {
      let categoryData = data.categoryList.filter(
        item => item.id == row.categoryId
      )[0];
      return categoryData.category_name;
    };
    // 日期格式化
    const toData = row => {
      return timestampToTime(row.createDate);
    };

    /**
     * onMounted
     */
    onMounted(() => {
      // 获取信息分类
      getInfoCategory();
      // 获取列表
      getList();
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
      // 数据
      data,
      page,
      // methods
      getList,
      search,
      addInfo,
      pageChange,
      pageSizeChange,
      selectionChange,
      deleteItem,
      deleteAll,
      editItem,
      toData,
      toCategory
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";
.label_wrap {
  &.category {
    @include labelDom(left, 60, 36);
    // @include labelDom(left, 50, 36);
  }
  &.date {
    @include labelDom(right, 93, 36);
    // @include labelDom(right, 63, 36);
  }
  &.key_word {
    @include labelDom(right, 99, 36);
    // @include labelDom(right, 62, 36);
  }
}
.btn_height {
  height: 36px;
}
</style>
