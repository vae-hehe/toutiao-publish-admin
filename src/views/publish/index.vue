<template>
<div class="publish-container">
  <el-card class="filter-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- :to="{name:'home'}"  to='/'-->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- /面包屑导航 -->
    </div>
    <!-- 表单 -->
    <el-form ref="publish-form" :model="article" label-width="60px" :rules="fromRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
        <el-tiptap v-model="article.content" :extensions="extensions" height="350" placeholder="请输入文章内容"/>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-radio-group v-model="article.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道" prop="channel_id">
        <el-select v-model="article.channel_id" placeholder="请选择频道">
          <el-option v-for="(channel, index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish(false)">发表</el-button>
        <el-button @click="onPublish(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</div>
</template>

<script>
import { getArticleChannels, AddArticle, getArticle, updateArticle } from '@/api/article'
// 使用局部引入
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  Image,
  CodeBlock
} from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
import { uploadImages } from '@/api/image'
export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  props: {},
  data () {
    return {
      article: {
        title: '',
        content: '', // 文章内容
        cover: {
          type: 0, // 封面的类型 -1,0,1,3
          images: [] // 封面图片的地址
        },
        channel_id: null
      },
      channels: [],
      // 编辑器的 extensions 扩展
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(), // 段落 ,前面这三个必须有
        new Heading({ level: 5 }), // 标题第5级
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 自定义图片上传 生成 base64 字符串 和 内容存储在一起,
          // 如果自定义图片上传
          uploadRequest (file) {
            // 如果要求把请求头中的 Content-Type设置为 multipart/form-data 就必须使用FormData()
            const fd = new FormData()
            fd.append('image', file)
            // 把promise,还有promise里面的结果,都返回给uploadRequest
            // 第一个返回是 Promise对象,因为 axios本身就是返回Promise对象
            // 这个接口的要求就是返回 Promise和里面包裹的地址
            return uploadImages(fd).then(res => {
              // 需要返回地址
              return res.data.data.url
            })
          }
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(), // 全屏
        new Preview(), // 预览
        new CodeBlock() // 文本块
      ],
      fromRules: {
        title: [
          { required: true, message: '请输入文章标题', tigger: 'blur' },
          { min: 5, max: 30, message: '长度在5到30个字符', tigger: 'blur' }
        ],
        content: [
          {
            // 自定义规则
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', tigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择频道' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()

    // 发布和编辑是同一个组件
    // 要判断
    // 如果路由路径参数中有 id ,则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft = false) {
      // 验证表单
      this.$refs['publish-form'].validate(valid => {
        // 验证失败,停止提交表单
        if (!valid) {
          return
        }
        // 验证通过,提交表单

        // 找到数据接口
        // 封装请求方法
        // 请求提交表单
        // 处理响应结果

        // 如果修改文章则执行修改操作,否则执行发布操作
        const articleId = this.$route.query.id
        if (articleId) {
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$router.push('/article')
          })
        } else {
          AddArticle(this.article, draft).then(res => {
            console.log(res)
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        }
      })
    },
    // 编辑文章
    loadArticle () {
      // 找到数据接口
      // 邓庄请求方式
      // 请求获取方式
      // 模板绑定展示

      // 展示编辑文章内容
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
