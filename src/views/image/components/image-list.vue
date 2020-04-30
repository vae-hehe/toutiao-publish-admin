<template>
<div class="image-list">
   <el-radio-group v-model="collect" @change="loadImages(1)" size="mini" style="margin-bottom:20px">
      <el-radio-button :label="false">全部</el-radio-button>
      <el-radio-button :label="true">收藏</el-radio-button>
    </el-radio-group>
    <el-button type="success" size="mini" @click="dialogUploadVisible = true" style="float:right" v-if="isShowAdd">上传素材</el-button>
    <!-- 素材列表 -->
    <el-row :gutter="10">
      <el-col :lg="4" :md="6" :sm="6" :xs="12" v-for="(img, index) in images" :key="index" class="list">
        <div>
          <div class="mask"  v-if="isShowAction">
            <!-- 再次优化: 使用button代替i标签,因为button里面有加载的显示形式 -->
            <!-- 显示 loading 形式 -->
            <!-- 必须从img里面取出数据,不然加载的就是全部的数据,但是属性里面本来没有loading,需要自己添加 -->
            <el-button type="warning" circle size="mini" :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"  @click="onCollected(img)" :loading="img.loading"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="ondeleteImage(img)" :loading="img.loading"></el-button>
            <!-- 优化 -->
            <!-- 点击的时候变换显示的图片 -->
            <!-- <i :class="{'el-icon-star-on': img.is_collected, 'el-icon-star-off': !img.is_collected}" @click="onCollected(img.id, img.is_collected)"></i>
            <i v-if="img.is_collected === false" class="el-icon-star-off" :class="{isCollected: img.is_collected}" @click="onCollected(img.id, img.is_collected)"></i>
            <i v-else class="el-icon-star-on" :class="{isCollected: img.is_collected}" @click="onCollected(img.id, img.is_collected)"></i> -->
            <!-- <i class="el-icon-delete" @click="ondeleteImage(img.id)"></i> -->
          </div>
          <el-image
          style="height: 100px"
          @click.native="selected = index"
          :src="img.url"
          fit="cover">
          </el-image>
          <!-- 在素材库中给选中的图片添加对勾图片 -->
          <!-- 现在是图片都选中的状态,设置,让图片都不被选中,然后,点击获取索引再被选中 -->
          <div class="selected" v-if="isShowSelected && selected === index"></div>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <!-- 筛选之后,分页数据改变,但是页码没有变化 :current-page.sync="page" 处理 -->
    <el-pagination
      style="margin-top:20px"
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="onCurrentPage"
    >
    </el-pagination>
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
  name: 'ImageList',
  components: {},
  // 使用数组声明prop,不建议,不够严谨,而且功能不够强大,仅仅适合demo
  // 使用对象声明prop,强烈建议使用
  props: {
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
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
      page: 1, // 当前页码默认是1
      pageSize: 12, // 每页显示的图片的个数
      totalCount: 0, // 图片的总数
      selected: null // 设置图片都不被选中
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(1)
  },
  mounted () {},
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码,防止数据和页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        console.log(res)
        const results = res.data.data.results
        // 遍历results 给每一img里面添加loading属性
        results.forEach(img => {
          // img对象里面本来没有loading数据
          // 在每一个里面添加loading属性,来控制每一个 收藏按钮的 loading 状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    // 改成loadImages 直接调用
    // oncollectChange (value) {
    //   this.loadImages(value)
    // },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false

      // 更新素材列表
      this.loadImages(this.page)
    },
    // 获取当前点击的页数
    onCurrentPage (page) {
      this.loadImages(page)
    },
    // 删除图片
    ondeleteImage (img) {
      img.loading = true
      deleteImages(img.id).then(res => {
        this.$confirm('确定删除这个图片吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadImages(this.page)
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
        img.loading = false
      })
    },
    // 收藏图片
    // 优化参数整体传img
    onCollected (img) {
      img.loading = true
      collectImages(img.id, !img.is_collected).then(res => {
        // 也可以这样写
        // img.is_collected = !img.is_collected
        if (img.is_collected === false) {
          this.loadImages(this.page)
          this.$message({
            type: 'success',
            message: '收藏成功!'
          })

          img.loading = false
        } else {
          this.loadImages(this.page)
          this.$message({
            type: 'success',
            message: '取消收藏成功!'
          })

          // 加载取消
          img.loading = false
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
    left: 5px;
    right: 5px;
    height: 27px;
    background: rgba(1, 1, 1, .3);
    z-index: 100000;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: yellow;
  }
}
.selected {
    width: 100%;
    background: url(./selected.png) no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
