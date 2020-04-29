/**
 * ESLint 代码格式规范校验规范的配置文件
 * 注意: 该文件如果修改,必须重启才能生效
 */

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 自定义代码校验规范
  rules: {
    // process.env.NODE_ENV === 'production' 判定代码运行的环境
    // 我们开发的时候是: npm run serve 启动开发模式
    // 代码开发好了部署到线上: npm run bulid 构建生产环境(发布环境) 运行的代码
    // process.env.NODE_ENV 有两种值
    //   production 生产环境
    //   development 开发环境
    // no-console 不允许代码中出现 console.xxx之类的代码  例如 console.log  生产环境不允许出现
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'warn' : 'off' // 关闭这个规则验证 off 或者 0
    // 'semi': ['error', 'always'] // 永远关闭末尾没有分号,要一直永远有分号,建议不设置
  }
}
