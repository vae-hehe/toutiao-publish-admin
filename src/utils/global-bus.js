/**
 * 全局通信总线
 * 可以让任何组件之间相互通信
 */

import Vue from 'vue'

export default new Vue()

// 假设 a 组件给b 组件 发送数据

// b组件 注册通信事件
// import globalBus from '@utils/global-bus'
// globalBus.$on('foo',(data) => {
// 处理函数
// })

//  a组件 发布通信事件
// import globalBus from '@utils/global-bus'

// 注意: 通信的两端所使用的事件名称必须一致

// 反之, 如果b 要给 a发送数据
// a注册事件,b发布
