<template lang="html">
  <div class="file-upload">
    主要用于梁王开发者的文件相关传输，提供上传和删除
    <el-input :value="password"></el-input>
    <el-upload
      class="upload-demo"
      action="http://lwio.me/api/file/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">需要你提供上传密码</div>
    </el-upload>
    <div class="files">
      <div class="file-card" v-for="file in fileList" @click="handleFileClick(file)">
        <p>{{file.name}}</p>
      </div>
    </div>
    <el-dialog
      title="内容"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>{{file && file.url}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
import { getFiles } from 'api/file'

export default {
  name: 'login',
  data() {
    return {
      fileList: [],
      file: null,
      password: '',
      dialogVisible: false
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {
    getFiles().then(res => {
      this.fileList = res.data
    })
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    handleFileClick(file) {
      this.file = file
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      console.log(fileList)
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
}
</script>
 
<style lang="scss" scoped>

</style>