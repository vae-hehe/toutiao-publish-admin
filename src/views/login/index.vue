<template>
  <div class="login-container">
    <div class="login-head">
      <div class="logo"></div>
    </div>
    <div class="login-form-wrap">
      <el-form ref="form" :model="user" class="logo-form">
        <el-form-item>
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loginLoading" class="login-form-btn" type="primary" @click="onLogin">登录</el-button>  </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request.js'
export default {
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      checked: false,
      loginLoading: false
    }
  },
  methods: {
    onLogin () {
      // 获取表单数据
      const user = this.user
      // 表单验证

      // 通过验证,提交登录

      // 开启登录中 loading...
      this.loginLoading = true

      request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        data: user
      }).then(res => {
        // 登陆成功
        console.log(res)
        this.$message({
          message: '登陆成功',
          type: 'success'
        })

        // 关闭loading
        this.loginLoading = false
      }).catch(err => {
        // 登录失败
        console.log(err)
        this.$message.error('登录失败,手机号或验证码错误')

        // 关闭loading
        this.loginLoading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
.login-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  .login-head{
      display: flex;
      justify-content: center;
      padding: 20px 100px 0;
      background-color: #fff;
      .logo{
        width: 200px;
        height: 57px;
        background: url('./logo_index.png') no-repeat;
        background-size: contain;
      }
    }
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-form-btn{
    width: 100%;
    }
  }
}
</style>
