<template>
<div class="article-container">
  <el-card class="filter-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- :to="{name:'home'}"  to='/'-->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- /面包屑导航 -->
    </div>
    <!-- 数据筛选表单 -->
    <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
        <el-radio-group v-model="status">
            <!-- radio 默认把label作为文本和选中之后的value值 -->
            <!-- lable不加: 就是 文本,我们要的是数据 就要加 : -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
        <!-- 双向绑定数据 -->
        <el-select v-model="channelId" placeholder="请选择频道">
            <!-- 默认在框中显示全部字符串 -->
            <el-option label="全部" :value="null"></el-option>
            <!-- 完成渲染频道输入框 -->
            <el-option v-for="(channel,index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="日期">
        <el-date-picker
            v-model="rangeDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
        </el-date-picker>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" :disabled="loading" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
    </el-form>
    <!-- /数据筛选表单 -->
  </el-card>

    <el-card class="box-card">
    <div slot="header" class="clearfix">
      根据筛选条件共查询到{{totalCount}}条
    </div>
    <!-- 数据列表 -->
    <!-- Table表格组件
        1. 把需要展示的数组列表数据绑定给table组件的
        data属性
          注意:不用v-for遍历,自己会遍历
        2.设计el-table-column表格列 width可以设置表格列的宽度
        lable设置表格列的标题
        prop 设置要渲染的列表项的数据字段,只能展示文本
        3. 表格列默认只能渲染普通文本,如果渲染其他内容,按钮标签之类的,要使用自定义模板 -->
    <el-table
      :data="articles"
      stripe
      v-loading="loading"
      class="list-table"
      size="mini"
      style="width: 100%">
      <el-table-column
        label="封面">
        <template slot-scope="scope">
          <!-- 第一种方法显示没有图片的内容 -->
          <!-- <img
            v-if="scope.row.cover.images[0]"
            class="article-cover" :src="scope.row.cover.images[0]" alt="">
          <img v-else class="article-cover" src="./1.jpeg" alt=""> -->
          <!-- 第二种方法 -->
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.cover.images[0]"
            fit="fit">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <!-- 当有了自定义模板之后prop就没有用了  删掉 -->
      <el-table-column
        label="状态">
        <!-- 在自定义模板中获取当前遍历的数据,在template中加上声明 slot-scope="scope" -->
        <!-- 判断 是什么状态 使用v-if -->
        <!-- slot-scope 固定的名字,scope 随便起的名字 -->
        <!-- row是当前遍历项 -->
        <template slot-scope="scope">
          <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
          <!-- <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
          <el-tag type="success"  v-else-if="scope.row.status === 2">审核通过</el-tag>
          <el-tag type="info"  v-else-if="scope.row.status === 3">审核失败</el-tag>
          <el-tag type="danger"  v-else-if="scope.row.status === 4">已删除</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发表时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 如果需要自定义表格列模板,就把需要的自定义内容放到
        template中,不一定是按钮,可以是自定义的字符串的东西,
        也可以使用图标,circle圆形 -->
        <!-- 任何数据和字符串拼接会自动的toString() -->
        <template slot-scope="scope">
          <el-button
          @click="$router.push('/publish?id='+scope.row.id.toString())"
          size="mini"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="onDeleteArticle(scope.row.id)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /数据列表 -->
    <!-- 列表分页 -->
    <!-- total设定总数据条数,默认按照10条处理 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="loadArticles"
      :disabled="loading"
      :page-size="pageSize"
      :current-page.sync="page"
    >
    </el-pagination>
    <!-- /列表分页 -->
  </el-card>
</div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [],
      articleStatus: [
        { status: 0, text: '草稿', type: '' },
        { status: 1, text: '待审核', type: 'info' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 20,
      // axios 不会发送数据为 null, undefined 之类的数据
      status: null, // 查询文章的状态,不传就是全部
      loading: true,
      page: 1,
      channels: [], // 频道列表
      channelId: null,
      rangeDate: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticleChannels()
    this.loadArticles()
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      // 展示加载中
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始时间
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止时间
      }).then(res => {
        // 解构
        // total_count: totalCount ES6中的重命名,必须使用驼峰
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount

        // 关闭加载中loading
        this.loading = false
      })
    },
    // 分页的函数, 也可以直接调用 loadArticles() 直接渲染
    // @current-change="oncurrentchange" 修改成调用 loadArticles()
    // oncurrentchange (page) {
    //   this.loadArticles(page)
    // },
    // 获取频道
    loadArticleChannels () {
      getArticleChannels().then(res => {
        console.log(res)
        this.channels = res.data.data.channels
      })
    },
    // 删除数据
    onDeleteArticle (articleId) {
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      // js中能表示的整数范围是-2^53到2^53  安全整数范围
      // 安装json-bigint 解决问题
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功 更新列表 获取页码
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.filter-card{
  margin-bottom: 30px;
}
.list-table{
  margin-bottom: 20px;
}
.article-cover{
  width: 50px;
  background-size: cover;
}
</style>
