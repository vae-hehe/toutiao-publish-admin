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
    <!-- 引入image-list组件 -->
    <image-list></image-list>
  </el-card>
    <!-- /引入image-list组件 -->
</div>
</template>

<script>
import ImageList from './components/image-list'

export default {
  name: 'ImageIndex',
  components: {
    ImageList
  },
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
