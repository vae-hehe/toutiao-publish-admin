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
        <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
        <el-select v-model="form.region" placeholder="请选择频道">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="日期">
        <el-date-picker
            v-model="form.date1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
        </el-date-picker>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
    <!-- /数据筛选表单 -->
  </el-card>

    <el-card class="box-card">
    <div slot="header" class="clearfix">
      根据筛选条件共查询到46147条
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
      class="list-table"
      size="mini"
      style="width: 100%">
      <el-table-column
        label="封面">
        <template slot-scope="scope">
          <img
            v-if="scope.row.cover.images[0]"
            class="article-cover" :src="scope.row.cover.images[0]" alt="">
          <!-- <img v-else class="article-cover" src="./no-cover.gif" alt=""> -->
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
        <template>
          <el-button
          size="mini"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
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
      @current-change="oncurrentchange"
      :page-size="pageSize"
    >
    </el-pagination>
    <!-- /列表分页 -->
  </el-card>
</div>
</template>

<script>
import { getArticles } from '@/api/article'
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
      pageSize: 20
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      getArticles({
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    oncurrentchange (page) {
      this.loadArticles(page)
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
  width: 100px;
  background-size: cover;
}
</style>
