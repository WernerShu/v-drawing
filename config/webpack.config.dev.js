/*
 * @Description:
 * @Date: 2021-09-14 17:29:48
 */
const path = require('path')
const baseConfig = require('./webpack.config.base.js')
const { merge } = require('webpack-merge')
const ESLintPlugin = require('eslint-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin') // 打包警告/错误日志输出
const Chalk = require('chalk')
const Portfinder = require('portfinder')
const servicePort = 9000

const os = require('os')

function getNetworkIp() {
  let needHost = '' // 打开的host
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces()
    for (let dev in network) {
      let iface = network[dev]
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          needHost = alias.address
        }
      }
    }
  } catch (e) {
    needHost = 'localhost'
  }
  return needHost
}
const DEVConfig = merge(baseConfig, {
  devtool: 'eval-cheap-module-source-map',
  // webpack5.x 加上之后热更新才有效果
  target: 'web',
  stats: {
    preset: 'none'
  },
  // 在第一个错误出现时抛出失败结果，而不是容忍它。-- 这将迫使 webpack 退出其打包过程
  // bail: true,
  watchOptions: {
    // 重新构建前增加延迟。将这段时间内进行的任何其他更改都聚合到一次重新构建里
    // aggregateTimeout: 600,
    // 排除监听
    ignored: '**/node_modules'
    // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询
    // poll: false
  },
  devServer: {
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌
    hot: true,
    compress: true,
    client: {
      overlay: true
      // progress: true
    },
    // history模式下的url会请求到服务器端，但是服务器端并没有这一个资源文件，就会返回404，所以需要配置这一项
    historyApiFallback: {
      index: '/index.html' // 与output的publicPath有关(HTMLplugin生成的html默认为index.html)
    },
    // 配置多个代理
    proxy: {
      '/test-api': {
        target: process.env.VUE_APP_LOCAL_AGENT, // 本地测试接口
        // ws: true, // 代理的WebSockets
        // secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
        pathRewrite: { '^/test-api': '' }
      },
      '/api': {
        target: process.env.VUE_APP_BASE_AGENT, // 线上测试接口
        // ws: true, // 代理的WebSockets
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
        pathRewrite: { '^/api': '' }
      }
    }
  },
  plugins: [
    new ESLintPlugin({
      fix: true,
      context: path.resolve(__dirname, '../src'),
      extensions: ['js', 'json', 'ts', 'vue'],
      exclude: '/node_modules/'
    })
    // new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = new Promise((resolve, reject) => {
  Portfinder.basePort = process.env.PORT || servicePort
  Portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      DEVConfig.devServer.port = port

      const PROJECT_NAME = process.env.BASE_URL ? process.env.BASE_URL.replace(/\//g, '') : 'APP'

      // Add FriendlyErrorsPlugin
      DEVConfig.plugins.push(
        new FriendlyErrorsWebpackPlugin({
          compilationSuccessInfo: {
            messages: [
              Chalk.bold.blue(PROJECT_NAME) + ` runing at:`,
              `Local: ` + Chalk.bold.blue(`http://localhost:${port}`),
              `Network: ` + Chalk.bold.blue(`http://${getNetworkIp()}:${port}`)
            ]
          },
          clearConsole: true
        })
      )

      resolve(DEVConfig)
    }
  })
})
