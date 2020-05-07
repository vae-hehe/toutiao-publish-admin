<template>
<div class="fans-container">
  <el-card class="filter-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- :to="{name:'home'}"  to='/'-->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- /面包屑导航 -->
    </div>
    <!-- tab栏 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="粉丝列表" name="first" @tab-click="loadFans">
        <el-row :gutter="10">
          <el-col :lg="4" :md="6" :sm="6" :xs="12" v-for="(item,index) in fansList" :key="index" style="padding-top:5px">
            <div  class="fans-list">
              <img :src="item.photo" alt="">
              <p>{{ item.name }}</p>
            </div>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="totalCount"
            :disabled="onDisabled"
            @current-change="loadFans"
            style="margin:20px 0 0 -10px"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="粉丝画像" name="second">
        <!-- 图表设置 -->
        <!-- 1. 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div ref="main" style="width: 600px;height:400px;"></div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</div>
</template>

<script>
import { getFans } from '@/api/user'
// 2.加载echarts
import echarts from 'echarts'

export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {
      activeName: 'first',
      fansList: [],
      pageSize: 20, // 每页多少条
      totalCount: 0, // 总共多少条
      onDisabled: false // 设置禁用状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadFans(1)
  },
  // 注意: 初始化操作DOM 一定写到 mounted 钩子函数中
  mounted () {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '粉丝统计表'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 获取粉丝列表
    async loadFans (page = 1) {
      this.onDisabled = true
      const res = await getFans({
        page, // 当前在第几页,默认是第一页
        per_page: this.pageSize // 每页有多少数据
      })
      this.fansList = res.data.data.results
      this.totalCount = res.data.data.total_count
      this.onDisabled = false
    }
  }
}
</script>

<style scoped lang="less">
.fans-list {
    width: 100px;
    height: 150px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    }
img{
    width: 70px;
    border-radius: 50%;
}
</style>
