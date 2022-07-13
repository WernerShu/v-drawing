/*
 * @Description:
 * @Date: 2021-09-14 17:29:48
 */
// const path = require('path')
// const glob = require('glob')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') // 包性能可视化
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin') // 打包警告/错误日志输出
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin') // 引入gzip压缩插件
const PurgeCSSPlugin = require('purgecss-webpack-plugin') // 删除无用css
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const baseConfig = require('./webpack.config.base.js')

// const PATHS = {
//   src: path.join(__dirname, '../src')
// }

module.exports = merge(baseConfig, {
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].[contenthash:8].css',
      chunkFilename: './css/[id].[contenthash:8].css'
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   generateStatsFile: true,
    //   reportFilename: '../monitor/webpack.build.monitor.html',
    //   statsFilename: '../monitor/webpack.build.monitor.json',
    //   openAnalyzer: false
    // }),
    /* new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: './dist',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['.*']
          }
        }
      ]
    }), */
    new FriendlyErrorsWebpackPlugin({
      onErrors: (severity, errors) => {
        const error = errors[0]
        setTimeout(() => {
          console.log('webpack编译失败:')
          console.log('error.file :>> ', error.file)
          console.log('error.name :>> ', severity + ': ' + error.name)
        }, 1000)
      },
      clearConsole: true
    }),
    new CompressionPlugin({
      // gzip压缩配置
      test: /\.js$|\.ts$|\.html$|\.scss$|\.css/, // 匹配文件名
      threshold: 10240, // 对超过10kb的数据进行压缩
      deleteOriginalAssets: false // 是否删除原文件
    })
    // new PurgeCSSPlugin({
    //   // 净化这个目录下所有文件
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    // })
  ],
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      // 选择对哪些文件进行拆分，默认是async，即只对动态导入的文件进行拆分
      chunks: 'all',
      // 提取chunk的最小体积
      minSize: 10000,
      // 要提取的chunk最少被引用次数
      minChunks: 1,
      // 对要提取的trunk进行分组
      cacheGroups: {
        // 匹配node_modules中的三方库，将其打包成一个trunk
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10
        },
        default: {
          // 将至少被两个trunk引入的模块提取出来打包成单独trunk
          minChunks: 2,
          name: 'default',
          priority: -20
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 多进程
        parallel: true,
        //删除注释
        extractComments: false,
        terserOptions: {
          compress: {
            // 生产环境去除console
            drop_console: true,
            drop_debugger: true
          }
        }
      }),
      new CssMinimizerWebpackPlugin()
    ]
  }
})
