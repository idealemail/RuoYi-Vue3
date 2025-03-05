<template>
    <div class="app-container">
      <el-form ref="formRef" :model="formData" :rules="rules" size="default" label-width="100px">
        <el-form-item label="内容名称" prop="field101">
          <el-input v-model="formData.field101" type="text" placeholder="请输入内容名称" clearable
            :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="内容来源" prop="field102">
          <el-select v-model="formData.field102" placeholder="请选择内容来源" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in field102Options" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传" prop="field104" required>
          <el-upload ref="field104" :file-list="field104fileList" :action="field104Action"
            :before-upload="field104BeforeUpload">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script setup>
  const {
    proxy
  } = getCurrentInstance()
  const formRef = ref()
  const data = reactive({
    formData: {
      field101: '',
      field102: undefined,
      field104: null,
    },
    rules: {
      field101: [{
        required: true,
        message: '请输入内容名称',
        trigger: 'blur'
      }],
      field102: [{
        required: true,
        message: '请选择内容来源',
        trigger: 'change'
      }],
    }
  })
  const {
    formData,
    rules
  } = toRefs(data)
  const field102Options = ref([{
    "label": "新浪新闻",
    "value": 1
  }, {
    "label": "CCTV",
    "value": 2
  }, {
    "label": "搜狐新闻",
    "value": 3
  }])
  // 上传请求路径
  const field104Action = ref('https://jsonplaceholder.typicode.com/posts/')
  // 上传文件列表
  const field104fileList = ref([])
  /**
   * @name: 上传之前的文件判断
   * @description: 上传之前的文件判断，判断文件大小文件类型等
   * @param {*} file
   * @return {*}
   */
  function field104BeforeUpload(file) {
    let isRightSize = file.size / 1024 / 1024 < 2
    if (!isRightSize) {
      proxy.$modal.msgError('文件大小超过 2MB')
    }
    return isRightSize
  }
  /**
   * @name: 表单提交
   * @description: 表单提交方法
   * @return {*}
   */
  function submitForm() {
    formRef.value.validate((valid) => {
      if (!valid) return
      // TODO 提交表单
    })
  }
  /**
   * @name: 表单重置
   * @description: 表单重置方法
   * @return {*}
   */
  function resetForm() {
    formRef.value.resetFields()
  }
  
  </script>
  <style>
  .el-upload__tip {
    line-height: 1.2;
  }
  
  </style>
  