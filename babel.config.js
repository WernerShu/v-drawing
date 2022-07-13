/*
 * @Description:
 * @Date: 2021-09-14 17:43:24
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // 这里配置usage 会自动根据你使用的方法以及你配置的浏览器支持版本引入对于的方法。
        corejs: 3 // 指定 corejs 版本
      }
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true //支持所有文件扩展名
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ]
}
