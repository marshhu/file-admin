<template>
  <div class="app-container">
    <el-row>
      <el-upload
        ref="upload"
        class="upload"
        :action="uploadUrl"
        :name="uploadName"
        :http-request="uploadFile"
        :before-upload="beforeUpload"
        drag
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过100m</div>
      </el-upload>
    </el-row>
   
  </div>
</template>

<script>
import{ upload,getFileList }  from '@/api/upload'
export default {
  data() {
    return {
      uploadUrl: '/api/upload', // 上传URL
      uploadName: 'file', // 图片或视频名称
      fileList: [],
      imgs: []
    }
  },
  created: function() {
    getFileList().then((resp) => {
      if (resp.code === 200) {
        this.fileList = resp.data
        resp.data.forEach(v=>{
           this.imgs.push(v.file_address)
        })
      }
    })
  },
  methods: {
    beforeUpload(file) {
        const isImg = file.type === 'image/jpeg'||file.type === 'image/jpg'||file.type === 'image/png';
        const isLtSize = file.size / 1024 / 1024 < 5;

        if (!isImg) {
          this.$message.error('上传图片只能是 jpg/png 格式!');
        }
        if (!isLtSize) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return isImg && isLtSize;
      },
    uploadFile: function(params) {
      var file = params.file
      console.log(file)
      // var fileUrl = this.$refs.upload.uploadFiles[0].url
      console.log(this.$refs.upload.uploadFiles)
      var formData = new FormData()
      formData.append(this.uploadName, file)
      upload(this.uploadUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(resp => {
          console.log(resp)
          if (resp.code === 200) {
            this.fileList.push(resp.data)
            this.imgs.push(resp.data.file_address)
            this.$message({
              showClose: true,
              message: resp.msg,
              type: 'success'
            })
          } else {
            this.$message.error(resp.msg)
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.upload {
  padding: 10px;
}
.block{
  padding: 20px;
  border:1px solid rgb(184, 184, 184);
  margin: 10px;
}
.block el-image{
  width: 25%;
  height: 200px;
  
}
.block .image-button{
  float:right;
}
</style>
