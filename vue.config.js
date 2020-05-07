/**
 * Vue CLI的配置文件
 * 自定义Vue CLI 中的webpack文件
 */

// 导出一个对象 使用的Node.js的语法
module.exports = {
  configureWebpack: {
    // 告诉webpack打包的时候,不要打包node_modules里面的内容,打包script中引入的
    externals: {
      // 属性名: 加载的包名
      // 属性值: script中暴露的全局变量
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      echarts: 'echarts'
    }
  }
}
