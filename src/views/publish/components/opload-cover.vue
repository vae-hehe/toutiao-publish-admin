<template>
<div class="upload-cover" @click="showCoverSelect">
  <div class="cover-wrap">
    <img class="cover-image" ref="cover-image" :src="value">
  </div>
  <el-dialog
    title="选择封面"
    :visible.sync="dialogVisible"
    append-to-body
  >
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <!-- ref的两个作用:
        1. 作用到普通html上就是,获取DOM元素
        2. 作用到组件上就是获取组件
      -->
    <el-tab-pane label="素材库" name="first">
      <image-list ref="image-list" :is-show-add='false' :is-show-action='false' is-show-selected></image-list>
    </el-tab-pane>
      <el-tab-pane label="上传图片" name="second">
        <input ref="file" type="file" @change="onFileChange">
        <img ref="preview-image" width="100" :src="value">
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
       <el-button @click="dialogVisible = false">取  消</el-button>
       <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import ImageList from '@/views/image/components/image-list'
import { uploadImages } from '@/api/image'
export default {
  name: 'UploadCover',
  components: {
    ImageList
  },
  // props: ['cover-image'],
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    showCoverSelect () {
      this.dialogVisible = true
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // input改变事件
    onFileChange () {
      const file = this.$refs.file.files[0]
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
      // 防止用户选择同一个文件不触发事件的事情发生
    //   this.$refs.file.value = ''
    },
    // 点击确定上传图片
    onCoverConfirm () {
      // 如果 tab 是上传图片, 并且 input-file 有选择文件,才执行图片上传操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImages(fd).then(res => {
          console.log(res)
          // 关闭弹层
          this.dialogVisible = false
          // 展示上传的图片
          this.$refs['cover-image'].src = res.data.data.url

          // 将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
        //   this.$emit('update-cover', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件之间通信的方式, 父组件直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        console.log(imageList.selected)
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cover-wrap {
    width: 120px;
    height: 120px;
    border: 1px solid #ccc;
    .cover-image {
        width: 120px;
        max-width: 100%;
    }
}
</style>
