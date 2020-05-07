<template>
  <div class="login-container">
    <div class="login-head">
      <div class="logo"></div>
    </div>
    <!--
      配置 form表单验证
      1.必须给 el-form组件绑定model为表单数据对象
      2.给需要验证的表单项 绑定prop属性
      注意; prop属性需要制定表单对象中的数据名称
      3.给 el-form 组件的rules属性配置验证规则
      4.手动触发表单验证:
      给 el-form 设置ref 起个名字
      通过ref 获取 el-form组件, 调用组件的validate进行验证
    -->
    <div class="login-form-wrap">
      <el-form ref="login-form" :model="user" class="logo-form" :rules="formRules">
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loginLoading"
            class="login-form-btn"
            type="primary"
            @click="onLogin"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: '',
        agree: false // 是否同意协议
      },
      loginLoading: false,
      formRules: {
        // 表单验证规则
        // 要验证的数据名称: 规则列表[]
        // trigger 触发验证的时机 blur 失去焦点
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '请输入正确的号码格式',
            trigger: 'change'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          // 自定义验证规则
          // 验证通过; callback
          // 验证失败: callback(new Error('错误消息))
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      // 表单验证
      // validate是异步的
      this.$refs['login-form'].validate((valid, err) => {
        if (!valid) {
          // 表单验证失败
          return
        }
        // 通过验证,提交登录
        this.login()
      })
    },
    async login () {
      // 获取表单数据
      // const user = this.user

      // 开启登录中 loading...
      this.loginLoading = true

      // 对于代码中的请求操作
      // 1.接口请求可能需要重用
      // 2.实际工作中 ,接口非常容易变动, 改起来麻烦
      // 建议的做法是把所有请求都封装成函数然后统一的组织到模块中进行管理
      // 这样做的好处是: 管理维护更方便,便于重用
      try {
        const res = await login(this.user)
        // 登陆成功
        this.$message({
          message: '登陆成功',
          type: 'success'
        })

        // 关闭loading
        this.loginLoading = false

        // 将接口返回的用户相关数据,存储到本地存储中,方便应用数据共享
        // 本地存储只能存字符串
        // 存数组格式,串成Json
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        // this.$router.push('/')

        // 根据名字跳转
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        // 登录失败
        console.log(err)
        this.$message.error('登录失败,手机号或验证码错误')

        // 关闭loading
        this.loginLoading = false
      }
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
  .login-head {
    display: flex;
    justify-content: center;
    padding: 20px 100px 0;
    background-color: #fff;
    .logo {
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
    .login-form-btn {
      width: 100%
    }
  }
}
</style>
