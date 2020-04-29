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
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off' // 关闭这个规则验证 off 或者 0
  }
}
