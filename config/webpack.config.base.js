/*
 * @Description:
 * @Date: 2021-09-14 17:29:48
 */
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const webpack = require('webpack')
const ENV_MODE = process.env.ENV_MODE
require('dotenv').config({ path: `.env.${ENV_MODE}` })
const IS_PROD = process.env.NODE_ENV === 'production'
process.env.VUE_APP_VERSION = require('../package.json').version

// 正则匹配以 VUE_APP_ 开头的 变量
const prefixRE = /^VUE_APP_/
let env = {}
// 只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中
for (const key in process.env) {
  if (key === 'NODE_ENV' || key === 'BASE_URL' || prefixRE.test(key)) {
    env[key] = JSON.stringify(process.env[key])
  }
}

// 鉴于cdn的不稳定性 暂时取消项目包的cdn引用
// cdn预加载使用
const EXTERNALS = {
  // vue: 'Vue',
  // axios: 'axios',
  // 'vue-router': 'VueRouter'
}

const CDN = {
  // 开发环境
  dev: {
    css: [],
    js: [],
    custom: []
  },
  // 生产环境
  prod: {
    css: [],
    js: [],
    custom: [
      `<script>console.info('%c当前版本：%c^${process.env.VUE_APP_VERSION}','background: yellow; color: #333; font-size:20px;padding:4px 8px;border-top-left-radius: 4px;border-bottom-left-radius: 4px;','background: #1155bb; color: #fff;font-size:20px;padding:4px 8px;border-top-right-radius: 4px;border-bottom-right-radius: 4px;')</script>`
    ]
  }
}

/* 把资源文件放到目录下 */
function getAssetPath(filePath, options = {}) {
  return options.assetsDir ? path.posix.join(options.assetsDir, filePath) : filePath
}

module.exports = {
  devtool: IS_PROD ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
  entry: path.resolve(__dirname, '../src/main.ts'), // 入口
  externals: EXTERNALS,
  // externals: IS_PROD ? EXTERNALS : {},
  output: {
    filename: IS_PROD ? './js/[name].[contenthash:8].js' : './js/[name].js',
    chunkFilename: './js/vendor.[id].[contenthash:8].js', // 异步chunk
    path: path.join(__dirname, '../dist'),
    publicPath: process.env.BASE_URL,
    clean: true
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['lodash'],
              cacheDirectory: true
            }
          },
          {
            loader: 'thread-loader',
            options: {
              workers: 3
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          IS_PROD
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../'
                }
              }
            : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.resolve(__dirname, '../src/style/each/mixins.scss'),
                path.resolve(__dirname, '../src/style/each/variable.scss')
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 0.1 * 1024 * 1024 // 100k----小于100k表现形式为baser64 大于100k就是 模块文件会被生成到输出的目标目录
          }
        },
        generator: {
          filename: getAssetPath('assets/images/[name].[contenthash:8][ext]') // [ext]代表文件后缀
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 0.1 * 1024 * 1024 // 100k
          }
        },
        generator: {
          filename: getAssetPath('assets/medias/[name].[contenthash:8][ext]')
        }
      },
      {
        test: /\.(eot|svg|ttf|woff2?|)$/,
        type: 'asset/resource',
        generator: {
          filename: getAssetPath('assets/fonts/[name].[contenthash:8][ext]')
        }
      },
      // {
      //   test: /\.js$/,
      //   include: path.resolve(__dirname, '../src'),
      //   use: [
      //     {
      //       loader: 'thread-loader',
      //       options: {
      //         workers: 3
      //       }
      //     },
      //     'babel-loader'
      //   ]
      // },
      {
        test: /\.(mj|mt)s$/,
        resolve: {
          fullySpecified: false
        },
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    extensions: ['.vue', '.ts', '.js', '.tsx', '.jsx', 'json', '.scss', '.css'],
    alias: {
      '@': path.resolve('src'), // 这样配置后 @ 可以指向 src 目录
      _: path.resolve('src'),
      '#': path.resolve('types')
    },
    fallback: {
      stream: 'stream-browserify'
    }
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new VueLoaderPlugin(),

    new HtmlWebpackPlugin({
      template: './public/index.html', // 相对于根目录
      title: '',
      filename: './index.html', // 相对于output的路径
      minify: {
        collapseWhitespace: true, // 移除空格
        removeComments: true, // 删除注释
        html5: true, // 根据HTML5规范解析输入
        preserveLineBreaks: false,
        minifyCSS: true, // 压缩文内css
        minifyJS: true // 压缩文内js
      },
      files: IS_PROD ? CDN.prod : CDN.dev
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      // 定义环境和变量
      'process.env': {
        ...env
      }
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
    // new ProgressBarPlugin({
    //   format: `:msg : [${Chalk.magenta.bold(":bar")}] ${Chalk.yellow.bold(":percent")} (elapsed: ${Chalk.cyan.bold(":elapsed")} s)`,
    //   width: 60,
    // })
  ],
  performance: {
    hints: 'warning',
    maxEntrypointSize: 50000 * 1024,
    maxAssetSize: 50000 * 1024
  },
  cache: {
    // 使用文件缓存
    type: 'filesystem',
    // 可选配置
    buildDependencies: {
      config: [__filename] // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
    }
  }
}
