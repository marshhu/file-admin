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
        accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .PBG, .BMP"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png/pbg图片文件，且不超过5m</div>
      </el-upload>
    </el-row>
    <el-row class="img-list">
      <el-col v-for="file in fileList" :key="file.file_name" :span="6">
        <div class="block">
          <el-image :src="file.file_address" :preview-src-list="imgs" fit="fill">
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
          </el-image>
          <el-row>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              class="image-button"
              :click="deleteFile(file.file_name)"
            ></el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- <el-row class="img-list"> -->
      <vue-waterfall-easy class="waterfall" :imgsArr="imgsArr" @scrollLoadImg="fetchImgsData"></vue-waterfall-easy>
    <!-- </el-row> -->
  </div>
</template>

<script>
import { upload, getFileList } from "@/api/upload";
import vueWaterfallEasy from "vue-waterfall-easy";
export default {
  components: {
    vueWaterfallEasy
  },
  data() {
    return {
      uploadUrl: "/api/upload", // 上传URL
      uploadName: "file", // 图片或视频名称
      fileList: [],
      imgs: [],

      imgsArr: [], //存放所有已加载图片的数组（即当前页面会加载的所有图片）
      fetchImgsArr: [] //存放每次滚动时下一批要加载的图片的数组
    };
  },
  created: function() {
    this.imgsArr = this.initImgsArr(0, 10); //初始化第一次（即页面加载完毕时）要加载的图片数据
    this.fetchImgsArr = this.initImgsArr(5, 10); // 模拟每次请求的下一批新的图片的数据数据

    getFileList().then(resp => {
      if (resp.code === 200) {
        this.fileList = resp.data;
        resp.data.forEach(v => {
          this.imgs.push(v.file_address);
        });
      }
    });


  },
  methods: {
    beforeUpload(file) {
      const isImg =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      const isLtSize = file.size / 1024 / 1024 < 5;

      if (!isImg) {
        this.$message.error("上传图片只能是 jpg/png 格式!");
      }
      if (!isLtSize) {
        this.$message.error("上传图片大小不能超过 5MB!");
      }
      return isImg && isLtSize;
    },
    uploadFile: function(params) {
      var file = params.file;
      console.log(file);
      // var fileUrl = this.$refs.upload.uploadFiles[0].url
      console.log(this.$refs.upload.uploadFiles);
      var formData = new FormData();
      formData.append(this.uploadName, file);
      upload(this.uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          console.log(resp);
          if (resp.code === 200) {
            this.fileList.push(resp.data);
            this.imgs.push(resp.data.file_address);
            this.$message({
              showClose: true,
              message: resp.msg,
              type: "success"
            });
          } else {
            this.$message.error(resp.msg);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    deleteFile(fileName) {
      console.log(fileName);
    },

    initImgsArr(n, m) {
      //初始化图片数组的方法，把要加载的图片装入
      var arr = [];
      for (var i = n; i < m; i++) {
        // arr.push({ src: `../assets/img/${i + 1}.jpg`, link: '', info: '一些图片描述文字' }) //src为加载的图片的地址、link为超链接的链接地址、
        arr.push({
          src: require(`@/assets/img/${i + 1}.jpg`),
          link: "",
          info: "一些图片描述文字"
        }); //info为自定义的图片展示信息，请根据自己的情况自行填写
      }
      return arr;
    },

    fetchImgsData() {
      //获取新的图片数据的方法，用于页面滚动满足条件时调用
      this.imgsArr = this.imgsArr.concat(this.fetchImgsArr); //数组拼接，把下一批要加载的图片放入所有图片的数组中
    }
  }
};
</script>
<style lang="scss" scoped>
.upload {
  padding: 10px;
}
.img-list {
  padding-top: 50px;
}
.block {
  padding: 20px;
  border: 1px dotted rgb(184, 184, 184);
  margin: 10px;
  height: 300;
  overflow: hidden;
}
.block el-image {
  width: 25%;
}
.block .image-button {
  float: right;
}

// .waterfall {
//   background-color: #f40;
// }

</style>
