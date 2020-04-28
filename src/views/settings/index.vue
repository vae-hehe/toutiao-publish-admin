<template>
<div class="settings-container">
  <el-card class="filter-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- :to="{name:'home'}"  to='/'-->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人设置</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- /面包屑导航 -->
    </div>
    <el-row :gutter="300">
      <el-col :xs="20" :sm="16" :md="16" :lg="12">
        <!-- 表单 -->
        <el-form ref="user_form" :model="user" label-width="80px" :rules="formRules">
          <el-form-item label="编号">
            {{ user.id }}
          </el-form-item>
          <el-form-item label="手机">
            {{ user.mobile }}
          </el-form-item>
          <el-form-item label="媒体名称" prop="name">
            <el-input v-model="user.name" placeholder="请输入媒体名称"></el-input>
          </el-form-item>
          <el-form-item label="媒体介绍" prop="intro">
            <el-input type="textarea" v-model="user.intro" placeholder="请输入媒体介绍"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onUserSetting">保存设置</el-button>
          </el-form-item>
        </el-form>
        <!-- /表单 -->
      </el-col>
      <el-col :xs="4" :sm="8" :md="8" :lg="12">
        <el-image
        style="width: 150px; height: 150px"
        :src="user.photo"
        fit="fit"></el-image>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
import { getUserProfile, editUserProfile } from '@/api/user'
export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {},
      formRules: {
        name: [
          { required: true, message: '请输入媒体名称', tigger: 'blur' },
          { min: 1, max: 7, message: '请输入在1到7位之间的名称', tigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', tigger: 'blur' },
          {
            // 自定义规则
            validator (valid, rule, callback) {
              if (valid === '') {
                callback(new Error('请输入媒体介绍'))
              }
              callback()
            }
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', tigger: 'blur' },
          { pattern: /^\w+@\w+(\.\w+)+$/, message: '请输入正确的邮箱地址', tigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    loadUser () {
      getUserProfile().then(res => {
        console.log(res)
        this.user = res.data.data
      })
    },
    onUserSetting () {
      // 表单验证
      this.$refs.user_form.validate(valid => {
        if (!valid) {
          // 验证失败
          return
        }
        // 验证成功
        const { name, intro, email } = this.user
        editUserProfile({
          name,
          intro,
          email
        }).then(res => {
          // console.log(res)
          this.loadUser()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败'
          })
        })
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
