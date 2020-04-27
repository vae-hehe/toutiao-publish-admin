<template>
<div class="image-container">
  <el-card class="filter-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- :to="{name:'home'}"  to='/'-->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>素材管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- /面包屑导航 -->
    </div>
    <el-radio-group v-model="collect" @change="oncollectChange" size="mini" style="margin-bottom:20px">
      <el-radio-button :label="false">全部</el-radio-button>
      <el-radio-button :label="true">收藏</el-radio-button>
    </el-radio-group>
    <el-button type="success" size="mini" @click="dialogUploadVisible = true" style="float:right">上传素材</el-button>
    <!-- 素材列表 -->
    <el-row :gutter="10">
      <el-col :lg="4" :md="6" :sm="6" :xs="12" v-for="(img, index) in images" :key="index" class="list">
        <div>
          <div class="mask">
            <i v-if="img.is_collected === false" class="el-icon-star-off" :class="{isCollected: img.is_collected}" @click="onCollected(img.id, img.is_collected)"></i>
            <i v-else class="el-icon-star-on" :class="{isCollected: img.is_collected}" @click="onCollected(img.id, img.is_collected)"></i>
            <i class="el-icon-delete" @click="ondeleteImage(img.id)"></i>
          </div>
          <el-image
          style="height: 100px"
          :src="img.url"
          fit="cover">
          </el-image>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px"
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="loadImages(false)"
    >
    </el-pagination>
  </el-card>
  <!-- 弹出框 -->
  <el-dialog
    title="上传素材"
    :visible.sync="dialogUploadVisible"
    :append-to-body="true"
    width="30%"
    class="dialog"
  >
    <!-- upload 组件本身支持上传文件的功能
        请求方式默认是 POST
        请求路径 action,必须写完整的路径
        请求头 headers
    -->
    <el-upload
      class="upload-demo"
      drag
      action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
      :headers="uploadHeaders"
      name="image"
      :show-file-list="false"
      :on-success="onUploadSuccess"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-dialog>
</div>
</template>

<script>
import { getImages, deleteImages, collectImages } from '@/api/image'

export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [],
      dialogUploadVisible: false,
      // 请求头
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      page: 1,
      pageSize: 12, // 每页显示的图片的个数
      totalCount: 0 // 图片的总数
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(false)
  },
  mounted () {},
  methods: {
    loadImages (collect = false) {
      getImages({
        collect,
        page: this.page,
        per_page: this.pageSize
      }).then(res => {
        console.log(res)
        this.images = res.data.data.results
        this.totalCount = res.data.data.total_count
      })
    },
    // 改成loadImages 直接调用
    oncollectChange (value) {
      this.loadImages(value)
    },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false

      // 更新素材列表
      this.loadImages(false)
    },
    // 获取当前点击的页数
    // onCurrentPage (page) {
    //   this.loadImages(page)
    // }
    // 删除图片
    ondeleteImage (imageId) {
      deleteImages(imageId).then(res => {
        this.$confirm('确定删除这个图片吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadImages(false)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    // 收藏图片
    onCollected (imageId, isCollected) {
      collectImages(imageId, !isCollected).then(res => {
        if (isCollected === false) {
          this.loadImages(false)
          this.$message({
            type: 'success',
            message: '收藏成功!'
          })
        } else {
          this.loadImages(false)
          this.$message({
            type: 'success',
            message: '取消收藏成功!'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.list {
  position: relative;
  .mask {
    position: absolute;
    bottom: 5px;
    width: 100%;
    background: rgba(1, 1, 1, .3);
    z-index: 100000;
    display: flex;
    justify-content: space-evenly;
  }
}
</style>
