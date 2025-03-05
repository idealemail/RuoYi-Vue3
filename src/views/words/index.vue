<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="敏感词" prop="word">
          <el-input
            v-model="queryParams.word"
            placeholder="请输入敏感词"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="敏感词类别" prop="category">
          <el-input
            v-model="queryParams.category"
            placeholder="请输入敏感词类别"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="敏感词级别" prop="level">
          <el-input
            v-model="queryParams.level"
            placeholder="请输入敏感词级别"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="敏感词有效期" prop="expiry">
          <el-date-picker
            clearable
            v-model="queryParams.expiry"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择敏感词有效期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="添加人" prop="addedBy">
          <el-input
            v-model="queryParams.addedBy"
            placeholder="请输入添加人"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="是否生效" prop="isActive">
          <el-input
            v-model="queryParams.isActive"
            placeholder="请输入是否生效"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="记录创建时间" prop="createdAt">
          <el-date-picker
            clearable
            v-model="queryParams.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择记录创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录修改时间" prop="updatedAt">
          <el-date-picker
            clearable
            v-model="queryParams.updatedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择记录修改时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            size="small"
            @click="handleAdd"
            v-hasPermi="['system:words:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            size="small"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:words:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            size="small"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:words:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            size="small"
            @click="handleExport"
            v-hasPermi="['system:words:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="wordsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" />
        <el-table-column label="敏感词" align="center" prop="word" />
        <el-table-column label="敏感词类别" align="center" prop="category" />
        <el-table-column label="敏感词级别" align="center" prop="level" />
        <el-table-column label="敏感词有效期" align="center" prop="expiry" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expiry, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加人" align="center" prop="addedBy" />
        <el-table-column label="是否生效" align="center" prop="isActive" />
        <el-table-column label="记录创建时间" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="记录修改时间" align="center" prop="updatedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              link
              type="primary" 
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:words:edit']"
            >修改</el-button>
            <el-button
              link
              type="primary"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:words:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
  
      <!-- 添加或修改敏感词管理对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="敏感词" prop="word">
            <el-input v-model="form.word" placeholder="请输入敏感词" />
          </el-form-item>
          <el-form-item label="敏感词类别" prop="category">
            <el-input v-model="form.category" placeholder="请输入敏感词类别" />
          </el-form-item>
          <el-form-item label="敏感词级别" prop="level">
            <el-input v-model="form.level" placeholder="请输入敏感词级别" />
          </el-form-item>
          <el-form-item label="敏感词有效期" prop="expiry">
            <el-date-picker
              clearable
              v-model="form.expiry"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择敏感词有效期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="添加人" prop="addedBy">
            <el-input v-model="form.addedBy" placeholder="请输入添加人" />
          </el-form-item>
          <el-form-item label="是否生效" prop="isActive">
            <el-input v-model="form.isActive" placeholder="请输入是否生效" />
          </el-form-item>
          <el-form-item label="记录创建时间" prop="createdAt">
            <el-date-picker
              clearable
              v-model="form.createdAt"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择记录创建时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="记录修改时间" prop="updatedAt">
            <el-date-picker
              clearable
              v-model="form.updatedAt"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择记录修改时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup name="Words">
  import { ref, reactive, getCurrentInstance } from 'vue'
  import { listWords, getWords, delWords, addWords, updateWords } from "@/api/system/words";
  
  const { proxy } = getCurrentInstance();
  
  // 遮罩层
  const loading = ref(true);
  // 选中数组
  const ids = ref([]);
  // 非单个禁用
  const single = ref(true);
  // 非多个禁用
  const multiple = ref(true);
  // 显示搜索条件
  const showSearch = ref(true);
  // 总条数
  const total = ref(0);
  // 敏感词管理表格数据
  const wordsList = ref([]);
  // 弹出层标题
  const title = ref("");
  // 是否显示弹出层
  const open = ref(false);
  
  // 查询参数
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    word: null,
    category: null,
    level: null,
    expiry: null,
    addedBy: null,
    isActive: null,
    createdAt: null,
    updatedAt: null
  });
  
  // 表单参数
  const formRef = ref(null);
  const form = ref({
    id: null,
    word: null,
    category: null,
    level: null,
    expiry: null,
    addedBy: null,
    isActive: null,
    createdAt: null,
    updatedAt: null
  });
  
  // 表单校验规则
  const rules = {
    word: [
      { required: true, message: "敏感词不能为空", trigger: "blur" }
    ],
    category: [
      { required: true, message: "敏感词类别不能为空", trigger: "blur" }
    ],
    level: [
      { required: true, message: "敏感词级别不能为空", trigger: "blur" }
    ],
    addedBy: [
      { required: true, message: "添加人不能为空", trigger: "blur" }
    ],
    isActive: [
      { required: true, message: "是否生效不能为空", trigger: "blur" }
    ],
    createdAt: [
      { required: true, message: "记录创建时间不能为空", trigger: "blur" }
    ],
    updatedAt: [
      { required: true, message: "记录修改时间不能为空", trigger: "blur" }
    ]
  };
  
  /** 查询敏感词管理列表 */
  function getList() {
    loading.value = true;
    listWords(queryParams).then(response => {
      wordsList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  
  // 取消按钮
  function cancel() {
    open.value = false;
    reset();
  }
  
  // 表单重置
  function reset() {
    form.value = {
      id: null,
      word: null,
      category: null,
      level: null,
      expiry: null,
      addedBy: null,
      isActive: "0",
      createdAt: null,
      updatedAt: null
    };
    proxy.resetForm("formRef");
  }
  
  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.pageNum = 1;
    getList();
  }
  
  /** 重置按钮操作 */
  function resetQuery() {
    proxy.resetForm("queryForm");
    handleQuery();
  }
  
  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id)
    single.value = selection.length!==1
    multiple.value = !selection.length
  }
  
  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加敏感词";
  }
  
  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const id = row.id || ids.value;
    getWords(id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改敏感词管";
    });
  }
  
  /** 提交按钮 */
  function submitForm() {
    formRef.value?.validate((valid) => {
      if (valid) {
        const submitData = {
          ...form.value,
          createdAt: form.value.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' '),
          updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        if (form.value.id != null) {
          updateWords(submitData).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addWords(submitData).then(response => {
            proxy.$modal.msgSuccess("新增成功");
            open.value = false;
            getList();
          });
        }
      }
    });
  }
  
  /** 删除按钮操作 */
  function handleDelete(row) {
    const ids = row.id || ids.value;
    proxy.$modal.confirm('是否确认删除敏感词管理编号为"' + ids + '"的数据项？').then(function() {
      return delWords(ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  
  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/words/export', {
      ...queryParams
    }, `words_${new Date().getTime()}.xlsx`)
  }
  
  getList();
  </script>