// 项目的启动入口

import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 加载全局样式文件
import './style/index.less'

Vue.config.productionTip = false

// 创建vue根实例
// 把router配置到根实例中
// 通过render方法把App根组件渲染到
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
// el:'#app' //等价于$mount('#app')
