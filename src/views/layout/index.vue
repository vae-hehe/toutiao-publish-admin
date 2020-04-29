<template>
<el-container class="layout-container">
  <el-aside class="aside" width="auto">
    <app-aside class="aside-menu" :isCollapse = 'isCollapse'></app-aside>
  </el-aside>
  <el-container>
    <el-header class="header">
      <div>
        <i :class="{'el-icon-s-fold': isCollapse, 'el-icon-s-unfold': !isCollapse}" @click="isCollapse = !isCollapse"></i>
        <span>江苏传智播客科技教育有限公司</span>
      </div>
      <el-dropdown>
        <div class="avatar-wrap">
            <img class="avatar" :src="user.photo">
            <span>{{ user.name }}</span>
        </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <!-- 组件默认不识别原生事件的,除非内部做了处理 -->
        <!-- native监听组件的原生事件 -->
        <el-dropdown-item @click.native="onLogout()">退出</el-dropdown-item>
      </el-dropdown-menu>
      </el-dropdown>
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
// import AppHeader from './components/header'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
    // AppHeader
  },
  props: {},
  data () {
    return {
      user: {}, // 当前登录信息
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()

    // 注册自定义事件
    // 当事件发布之后,这个注册函数就会被调用
    globalBus.$on('update-user', (data) => {
      console.log('update-user', data)
      // this.user = data 错误 对象之间赋值是引用的,这样赋值的时候会影响
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  mounted () {},
  methods: {
    // 获取用户信息
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清除
        window.localStorage.removeItem('user')

        // 跳转到登录页
        this.$router.push('/login')
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
    border-bottom: 1px solid #ccc;
    align-items: center;
}
.avatar-wrap{
    display: flex;
    align-items: center;
    .avatar{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }
}
.main{
    background-color: #e9eef3;
}
</style>
