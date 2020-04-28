<template>
<div class="comment-container">
  <el-card class="filter-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- :to="{name:'home'}"  to='/'-->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- /面包屑导航 -->
    </div>
    <!--
        1.把数据列表绑定给表格的 data
        2. 渲染要使用的表格字段
    -->
    <el-table
      class="table-list"
      :data="articles"
      stripe>
      <el-table-column
      prop="title"
      label="标题">
      </el-table-column>
      <el-table-column
      prop="total_comment_count"
      label="总评论数">
      </el-table-column>
      <el-table-column
      prop="fans_comment_count"
      label="粉丝评论数">
      </el-table-column>
      <el-table-column
      prop="comment_status"
      label="评论状态">
        <template slot-scope="scope">
          {{ scope.row.comment_status ? '正常' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 此时使用开关,比按钮的交互效果好 -->
          <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="scope.row .statusDisabled"
            @change="onStatusChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!--
        绑定页码
        绑定每页大小
        current-page 控制激活的页码,初始是第1页
        page-sizes 控制可选的每页大小
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      background
    >
    </el-pagination>
  </el-card>
</div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [],
      page: 1, // 当前激活的页码
      pageSize: 10,
      totalCount: 0
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // 页码改变,加载页码指定数据
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      // 让分页组件激活的页码和请求数据的页码保持一致
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        console.log(res)
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关,防止多次点击
      article.statusDisabled = true
      // 请求提交修改
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        console.log(res)
        // 启用开关
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.table-list {
    margin-bottom: 30px;
}
</style>
