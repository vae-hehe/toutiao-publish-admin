<template>
<div class="publish-container">
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
  </el-card>
</div>
</template>

<script>
export default {
  name: 'PublishIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
