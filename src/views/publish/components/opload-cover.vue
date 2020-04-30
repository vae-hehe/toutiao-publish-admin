<template>
<div class="upload-cover" @click="showCoverSelect">
  <div class="cover-wrap">
    <!-- <img class="cover-image" src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" alt=""> -->
  </div>
  <el-dialog
    title="选择封面"
    :visible.sync="dialogVisible"
    append-to-body
    width="27%"
  >
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="素材库" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="上传图片" name="second">
      山川
    </el-tab-pane>
  </el-tabs>
    <span slot="footer" class="dialog-footer">
       <el-button @click="dialogVisible = false">取  消</el-button>
       <el-button type="primary"  @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'UploadCover',
  components: {},
  props: {},
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
