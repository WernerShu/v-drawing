/*
 * @Description:
 * @Date: 2021-09-14 17:39:12
 */
import { createApp } from 'vue' // Vue 3.x 引入 vue 的形式
import App from './App.vue' // 引入 APP 页面组建
import 'ant-design-vue/dist/antd.css'
import setTheme from './style/set-theme'
import '@/utils/rem.ts'

setTheme()

import '@/style/app.scss' // glob scss
const app = createApp(App) // 通过 createApp 初始化 app

app.mount('#app') // 将页面挂载到 root 节点
