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
        <el-form ref="user_form" :model="user" label-width="70px">
          <el-form-item label="编号">
            {{ user.id }}
          </el-form-item>
          <el-form-item label="手机">
            {{ user.mobile }}
          </el-form-item>
          <el-form-item label="媒体名称">
            <el-input v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体介绍">
            <el-input type="textarea" v-model="user.intro"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存设置</el-button>
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
import { getUserProfile } from '@/api/user'
export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {}
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
    onSubmit () {
      console.log(11)
    }
  }
}
</script>

<style scoped lang="less"></style>
