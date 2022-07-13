import axios from 'axios'
import * as qs from 'qs'
import Message from 'vue-m-message'

const proxyName = process.env.VUE_APP_BASE_API
// const proxyName = process.env.VUE_APP_LOCAL_API

/* 全局默认配置 */
const http = axios.create({
  // baseURL: '',
  timeout: 100000
})

// let isRefreshingToken = false
// let freshTokenTime = null

/* 请求拦截器 */
http.interceptors.request.use(
  config => {
    // config.headers.Authorization = 'Bearer ' + getToken()
    config.url = `${proxyName}${config.url}`

    // 默认携带参数
    const defaultParams = {}
    if (
      config.method === 'get' ||
      config.method === 'GET' ||
      config.method === 'delete' ||
      config.method === 'DELETE'
    ) {
      if (config.params) {
        config.params = Object.assign({}, config.params, defaultParams)
      } else {
        config.params = defaultParams
      }
    } else if (config.method === 'post' || config.method === 'POST') {
      let data = null
      if (config.data && config.headers['Content-Type'] !== 'multipart/form-data') {
        data = Object.assign({}, config.data, defaultParams)
      } else {
        data = defaultParams
      }
      if (
        config.headers['content-type'] &&
        (config.headers['content-type'] as string).split(';')[0] === 'application/x-www-form-urlencoded'
      ) {
        config.data = qs.stringify(data) // 模拟form表单提交时使用qs模块
      } else {
        if (!config.data) {
          config.data = data
        }
      }
    }
    // }
    return config
  },
  error => {
    Message.error(error)
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  // 拦截返回response
  response => {
    const res = response.data

    if (res.code === 200 || res.code === '200') {
      // const freshTimeInterval = new Date() - freshTokenTime

      // if (
      //   !isRefreshingToken &&
      //   (freshTimeInterval > 600000 || !freshTokenTime) &&
      //   response.config.url.indexOf('config-system') > 0
      // ) {
      //   isRefreshingToken = true
      //   freshTokenTime = new Date()
      //   vm.$store.dispatch('user/getNewToken')
      // } else {
      //   isRefreshingToken = false
      // }
      return res
    } else if (res.code === 401 || res.code === '401' || res.code === 408 || res.code === '408') {
      // message.error(`${res.message}`)
      // router.push('/login')
    } else if (res.code === 500 || res.code === '500') {
      Message.error(`${res.message}`)
    }
    //  else if (res.code === 407 || res.code === '407') {
    //   message.error(权限验证失败)
    // } else if (res.code === 500 || res.code === '500') {
    //   message.error(res.message)
    // }
    else {
      Message.error(res.message)
    }
    return Promise.reject(res)
  },
  error => {
    if (error.response?.status === 401) {
      Message.error('token失效')
    } else if (error.response?.status === 407 || error.response?.status === '407') {
      Message.error('权限验证失败')
    } else if (error.response?.data) {
      Message.error(`${error.response.status} ${error.response?.data?.message || '请求失败'}`)
    } else {
      Message.error(error.message)
    }
    Promise.reject(error)
  }
)

export default http
