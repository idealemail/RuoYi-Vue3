<template>
    <div class="app-container">
      <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="新闻标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入新闻标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="新闻来源" prop="source">
          <el-input
            v-model="queryParams.source"
            placeholder="请输入新闻来源"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input
            v-model="queryParams.author"
            placeholder="请输入作者"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishedAt">
          <el-date-picker clearable
            v-model="queryParams.publishedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="queryParams.createdAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择记录创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录更新时间" prop="updatedAt">
          <el-date-picker clearable
            v-model="queryParams.updatedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择记录更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form> -->
  
      <el-row :gutter="10" class="mb8">

        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:news:remove']"
          >通过</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:news:remove']"
          >拒绝</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:news:export']"
          >导出</el-button>
        </el-col> -->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="newsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="新闻ID" width="55" align="center" prop="id" />
        <el-table-column label="新闻标题" align="center" prop="title" />
        <el-table-column label="新闻内容" align="center" prop="content">
  <template #default="scope">
    <div v-html="scope.row.content"></div>
  </template>
</el-table-column>


        <!-- <el-table-column label="新闻内容" align="center" prop="content" /> -->
        <!-- <el-table-column label="新闻来源" align="center" prop="source" /> -->
        <!-- <el-table-column label="审核状态" align="center" prop="status" /> -->
        <!-- <el-table-column label="作者" align="center" prop="author" /> -->
        <!-- <el-table-column label="发布时间" align="center" prop="publishedAt" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.publishedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="记录创建时间" align="center" prop="createdAt" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="记录更新时间" align="center" prop="updatedAt" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:news:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:news:remove']"
            >删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
  
      <!-- 添加或修改新闻对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="新闻标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入新闻标题" />
          </el-form-item>
          <el-form-item label="新闻内容">
            <editor v-model="form.content" :min-height="192"/>
          </el-form-item>
          <el-form-item label="新闻来源" prop="source">
            <el-input v-model="form.source" placeholder="请输入新闻来源" />
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" placeholder="请输入作者" />
          </el-form-item>
          <el-form-item label="发布时间" prop="publishedAt">
            <el-date-picker clearable
              v-model="form.publishedAt"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择发布时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="记录创建时间" prop="createdAt">
            <el-date-picker clearable
              v-model="form.createdAt"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择记录创建时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="记录更新时间" prop="updatedAt">
            <el-date-picker clearable
              v-model="form.updatedAt"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择记录更新时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { listNews, getNews, delNews, addNews, updateNews } from "@/api/system/news";
  
  export default {
    name: "News",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 新闻表格数据
        newsList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          content: null,
          source: null,
          status: null,
          author: null,
          publishedAt: null,
          createdAt: null,
          updatedAt: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          title: [
            { required: true, message: "新闻标题不能为空", trigger: "blur" }
          ],
          content: [
            { required: true, message: "新闻内容不能为空", trigger: "blur" }
          ],
          status: [
            { required: true, message: "审核状态不能为空", trigger: "change" }
          ],
          createdAt: [
            { required: true, message: "记录创建时间不能为空", trigger: "blur" }
          ],
          updatedAt: [
            { required: true, message: "记录更新时间不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询新闻列表 */
      getList() {
        this.loading = true;
        listNews(this.queryParams).then(response => {
          this.newsList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          title: null,
          content: null,
          source: null,
          status: null,
          author: null,
          publishedAt: null,
          createdAt: null,
          updatedAt: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加新闻";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getNews(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改新闻";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateNews(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addNews(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除新闻编号为"' + ids + '"的数据项？').then(function() {
          return delNews(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/news/export', {
          ...this.queryParams
        }, `news_${new Date().getTime()}.xlsx`)
      }
    }
  };
  </script>
  