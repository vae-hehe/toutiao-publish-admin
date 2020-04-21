<template>
<div class="header-container">
    <div>
        <i class="el-icon-s-fold"></i>
        <span>江苏传智播客科技教育有限公司</span>
    </div>
    <el-dropdown>
        <div class="avatar-wrap">
            <img src="aa" alt="" class="avatar">
            <span>{{ user.name }}</span>
        </div>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <el-dropdown-item>退出</el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
</div>
</template>

<script>
import { getUserProfile } from '@/api/user'

export default {
  name: 'AppHeader',
  components: {},
  props: {},
  data () {
    return {
      user: {} // 当前登录信息
    }
  },
  computed: {},
  watch: {},
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    // 除了登陆接口,其他接口都需要身份令牌才能获取数据
    loadUserProfile () {
      getUserProfile().then(res => {
        console.log(res)
        this.user = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">
.header-container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
}
</style>
