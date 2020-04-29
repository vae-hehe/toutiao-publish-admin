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
            <el-button type="primary" @click="onUserSetting" :loading="updateProfileLoading">保存设置</el-button>
          </el-form-item>
        </el-form>
        <!-- /表单 -->
      </el-col>
      <el-col :xs="4" :sm="8" :md="8" :lg="12">
        <!-- <el-image
        style="width: 150px; height: 150px"
        :src="user.photo"
        fit="fit"></el-image> -->
        <!-- 第一种实现点击上传图片的方式 -->
        <!-- 隐藏输入框,实现点击p标签像点击了input一样 -->
        <!-- <p @click="$refs.file.click()">点击修改头像</p> -->

        <!-- 方法二 使用label,使用input的id和label和for关联
          这种方法点击图片和文字都可以上传
        -->
        <label for="file">
          <el-avatar
            shape="square"
            :size="150"
            fit="fit"
            :src="user.photo"
          ></el-avatar>
          <p>点击修改头像</p>
        </label>
        <!-- 当内容发生变化的时候,调用change事件 -->
        <input
          id="file"
          type="file"
          ref="file"
          hidden
          @change="onFileChange"
        >
      </el-col>
    </el-row>
  </el-card>
  <!-- append-to-body 解决遮罩层在上面的问题
    modal-append-to-body 也可以解决,但是在DOM的结构上来说,上面的比较合适
  -->
  <el-dialog
    title="修改头像"
    :visible.sync="dialogVisible"
    append-to-body
    @opened="onDialogOpend"
    @closed="onDialogClosed"
  >
    <!-- 用块级元素包裹图片 -->
    <div class="preview-image-wrap">
      <!-- 需要预览图片 -->
      <img class="preview-image" :src="previewImage" alt="" ref="preview-image">
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onUpdatePhoto" :loading="updatePhotoLoading">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import { getUserProfile, editUserProfile, editUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        id: null,
        moblie: '',
        name: '',
        intro: '',
        email: '',
        photo: ''
      },
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
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '', // 预览图片
      cropper: '',
      updatePhotoLoading: false, // loading
      updateProfileLoading: false
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
        this.updateProfileLoading = true
        const { name, intro, email } = this.user
        editUserProfile({
          name,
          intro,
          email
        }).then(res => {
          // console.log(res)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.updateProfileLoading = false
          // 发布通知,用户信息修改
          globalBus.$emit('update-user', this.user)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败'
          })
          this.updateProfileLoading = false
        })
      })
    },
    onFileChange () {
      // 图片预览
      const file = this.$refs.file
      // console.dir(file)
      // console.log(file.files[0])
      const blobDate = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobDate
      // 展示弹出层,预览用户选择的图片
      this.dialogVisible = true
      // 解决选择相同文件 不触发change的事件问题
      this.$refs.file.value = ''
    },
    onDialogOpend () {
      // 圖片裁切器必须基于img 进行初始化
      // 注意: img必须是可见状态才能初始化
      // 因为要在对话框中初始化裁切器,,所以在对话框完全打开的状态下初始化
      // 获取图片 DOM 节点
      const image = this.$refs['preview-image']

      // 第1次初始化之后, 如果预览的裁切图片没有发生变化,裁切器默认默认不会更新
      /**
       * 两种方法
       * 1. 裁切器.replace(url[, hasSameSize]) 方法
       * 2. 销毁裁切器,重新初始化,性能更高
       */
      // 初始化裁切器
      // 第二种
      // if (this.cropper) {
      //   this.cropper.replace(this.previewImage)
      //   return
      // }
      this.cropper = new Cropper(image, {
        // 裁切框的比例大小
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none', // 不能移动画布
        cropBoxResizable: false
        // background: false

        // 移动裁切器的时候会触发 crop 方法
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClosed () {
      // 对话框关闭,销毁裁切器
      this.cropper.destroy()
    },
    onUpdatePhoto () {
      // this.updatePhotoLoading = true
      this.cropper.getCroppedCanvas().toBlob(file => {
        this.updatePhotoLoading = true
        console.log(file)
        const fd = new FormData()
        fd.append('photo', file)
        // 请求提交fd 更新头像
        editUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图
          console.log(res)
          // 直接把裁切结果的文件对象 转为bolb数据 本地进行预览
          this.user.photo = window.URL.createObjectURL(file)
          // 关闭确定按钮的loading
          this.updatePhotoLoading = false

          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          // 更新顶部的用户登录信息
          globalBus.$emit('update-user', this.user)
          // 把服务端返回的数据进行展示有点慢
          // this.user.photo = res.data.data.photo
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.preview-image-wrap {
    /* Ensure the size of the image fit the container perfectly */
  .preview-image {
    img {
      display: block;
      /* This rule is very important, please don't ignore this */
      // max-width: 100%;
      height: 200px;
    }
  }
}
// git commit --amend -m "日志名字错误,提交修改的方法"
</style>
