<template>
<el-container class="layout-container">
  <el-aside class="aside" width="200px">
    <app-aside class="aside-menu"></app-aside>
  </el-aside>
  <el-container>
    <el-header class="header">
        <app-header></app-header>
    </el-header>
    <el-main class="main">
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
<!-- <div class="layout-container"> -->
    <!-- <div>顶部导航栏</div>

    <div>侧边导航栏</div> -->
     <!-- 子路由出口 -->
     <!-- 内容 -->
    <!-- <router-view></router-view> -->
<!-- </div> -->
</template>

<script>
import AppAside from './components/aside'
import AppHeader from './components/header'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader
  },
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

<style scoped lang="less">
.layout-container{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.aside{
  background-color: #d3dce6;
  .aside-menu{
    height: 100%;
  }
}
.header{
    // height: 60px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px sold #ccc;
    align-items: center;
}
.main{
    background-color: #e9eef3;
}
</style>
