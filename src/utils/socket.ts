/*
 * @Description: webSocket封装
 * @Date: 2021-04-28 18:16:49
 */

/*
===========================================参数初始化===================================================
 */
let socket: any

const heartbeatTime = 5000, // 心跳检测时间
  reconnectionTime = 4000 // 重连延迟时间
let setIntervalWesocketPush: any = null, // 心跳状态
  heartRateRecovery = false, // 心跳是否得到响应  true为为未得到响应
  heartbeat = 'heartbeat', // 心跳值
  callback: (msg: any, obj: any) => void, // 回调函数
  url: string, // 处理后地址
  params = { url: '', data: '' }, // 传参值
  reconnectionState: any = null, // 重连状态
  lockReconnect = false //避免重复连接
const address = document.location.port
  ? document.location.hostname + ':' + document.location.port
  : document.location.hostname // 配置地址

const proxyNameWs = process.env.VUE_APP_BASE_API_WS

/*
===========================================连接主体===================================================
 */

/**
 * @description: 参数输入处理
 * @param {*} obj  api地址
 * {
 *  url:XXX API地址
 *  heartbeat:XXX 心跳值，
 *  data:XXX 连接成功后发送给服务器的第一条消息
 * }
 * @param {*} fun   返回函数
 * @return {*}
 * @author: 舒
 */
export default function getSocket(obj: any, fun: any) {
  // 参数深拷贝
  params = JSON.parse(JSON.stringify(obj))
  if (obj.heartbeat) {
    heartbeat = obj.heartbeat
  }
  // 回调函数提升至全局
  callback = fun
  // 参数处理
  // url = `${proxyNameWs}/gateway${obj.url}`
  url = `${proxyNameWs}${obj.url}`
  // 建立连接
  setEvent()
}

/**
 * @description: 建立连接及事件方法定义
 * @param {*}
 * @return {*}
 * @author: 舒
 */
const setEvent = () => {
  // 判断浏览器是否支持WebSocket长连接
  if (typeof WebSocket === 'undefined') {
    console.error('您的浏览器不支持WebSocket,这可能会导致某些功能无法正常使用,建议使用Chrome浏览器')
  } else {
    // 初始化 WebSocket 对象，指定要连接的服务器地址与端口建立连接
    socket = new WebSocket(url)
    // 定义 主动关闭判断类型
    socket.initiativeClose = false
    // 定义主动关闭事件
    socket.manualClose = function () {
      socket.initiativeClose = true
      socket.close()
    }
    // 事件方法定义
    socket.onopen = onopenWS
    socket.onerror = onerrorWS
    socket.onmessage = onmessageWS
    socket.onclose = oncloseWS
  }
}

/*
===========================================websocket钩子===================================================
 */

/**
 * @description: 连接成功钩子
 * @param {*}
 * @return {*}
 * @author: 舒
 */
const onopenWS = () => {
  consolePrompt('连接成功', 1)
  // 若有传入参数则发送参数
  if (params.data) {
    sendMsg(params.data)
  }
  // 开启心跳
  sendPing()
}

/**
 * @description: 连接异常钩子
 * @param {*}
 * @return {*}
 * @author: 舒
 */
const onerrorWS = () => {
  consolePrompt('连接异常', 3)
  // if (socket.readyState !== 3) {
  // 重新连接
  reconnect()
  // }
}

/**
 * @description: 消息接收钩子
 * @param {*} msg 服务器发送端消息内容
 * @return {*}
 * @author: 舒
 */
const onmessageWS = (msg: any): any => {
  // 得到心跳响应
  heartRateRecovery = false
  // 如若响应消息不等于心跳值则进行回调
  if (JSON.stringify(heartbeat) !== msg.data) {
    // 回调消息
    callback(msg, socket)
  }
}

/**
 * @description: 关闭断开钩子
 * @param {*}
 * @return {*}
 * @author: 舒
 */
const oncloseWS = () => {
  // 判断是否业务关闭
  if (!socket) {
    consolePrompt('连接已重置', 4)
  } else if (socket.readyState !== 3) {
    consolePrompt('未知断开', 3)
    // 非业务关闭进行重新连接
    reconnect()
  } else if (socket.initiativeClose !== true) {
    consolePrompt('未知异常', 3)
    // 非业务关闭进行重新连接
    reconnect()
  } else {
    // 断开心跳
    if (setIntervalWesocketPush) {
      clearInterval(setIntervalWesocketPush)
      setIntervalWesocketPush = null
    }
    // 重置响应心跳
    heartRateRecovery = false
    // 清除重连
    if (reconnectionState) {
      clearTimeout(reconnectionState)
    }
    consolePrompt('连接已关闭', 4)
  }
}

/**
===========================================逻辑处理===================================================
 */

/**
 * @description: 发送心跳
 * @param {*}
 * @return {*}
 * @author: 舒
 */
const sendPing = () => {
  if (setIntervalWesocketPush) {
    // 初始化心跳反正心跳重复
    clearInterval(setIntervalWesocketPush)
    setIntervalWesocketPush = null
  }
  // 心跳响应初始化
  heartRateRecovery = false
  // 发送心跳内容
  sendMsg(heartbeat)
  // 开启频率心跳
  setIntervalWesocketPush = setInterval(() => {
    // 判断心跳是否得到响应
    if (heartRateRecovery) {
      consolePrompt('心跳异常', 3)
      // 未得到响应进行重新连接
      reconnect()
      return
    }
    // 心跳响应开启
    heartRateRecovery = true
    // 发送心跳内容
    sendMsg(heartbeat)
  }, heartbeatTime)
}

/**
 * @description: 发送消息
 * @param {*} msg 消息内容
 * @return {*}
 * @author: 舒
 */
const sendMsg = (msg: any): any => {
  // 判断连接是否正常
  if (!isOpen(socket)) {
    // 连接不正常进行重连
    reconnect()
    return consolePrompt('连接异常，发送失败', 3)
  }
  // 发送消息
  socket.send(JSON.stringify(msg))
}

/**
 * @description: 判断连接
 * @param {*} ws websocket实例
 * @return {*}
 * @author: 舒
 */
const isOpen = (ws: any): any => {
  // 判断连接是否正常并返回
  return ws && ws.readyState === ws.OPEN
}

/**
 * @description: 重连
 * @param {*}
 * @return {*}
 * @author: 舒
 */
const reconnect = () => {
  // 判断连接是否存在
  if (socket) {
    // 存在连接则关闭
    socket.manualClose()
  }
  // 初始化连接
  socket = null
  // 回调初始化后连接
  callback('', socket)
  // 如若心跳正在进行则关闭心跳
  if (setIntervalWesocketPush) {
    clearInterval(setIntervalWesocketPush)
    setIntervalWesocketPush = null
  }
  // 此次重连是否重复判断
  if (lockReconnect) return
  // 防止重复重连开启
  lockReconnect = true
  // 清除上传重连状态
  clearTimeout(reconnectionState)
  // 开始重连并设置延迟避免请求过多
  reconnectionState = setTimeout(() => {
    consolePrompt('正在重新连接', 2)
    // 重新连接
    getSocket(params, callback)
    // 防止重复重连关闭
    lockReconnect = false
  }, reconnectionTime)
}

/**
 * @description: 提示
 * @param {*} str 提示内容
 * @param {*} type 提示类型
 * @return {*}
 * @author: 舒
 */
const consolePrompt = (str: string, type: number): any => {
  // url提示地址生成
  const urlArr = params.url.split('/')
  // url提示地址赋值
  const urlCurrent = `${urlArr[urlArr.length - 2]}/${urlArr[urlArr.length - 1]}`
  // 当前时间
  const currentTime = new Date().toLocaleTimeString()

  // type => 1：成功 2：警告 3：异常 其他：默认
  // 定义提示颜色
  let color
  switch (type) {
    case 1:
      color = 'color:#42C741'
      break
    case 2:
      color = 'color:#f8bf42'
      break
    case 3:
      color = 'color:#FF4D4F'
      break
    default:
      color = 'color:#5e7cdf'
      break
  }
  // 提示拼接
  const msg = `${urlCurrent} \r\n ${str} => ${currentTime}`
  // 返回提示内容
  return console.info(`%c ${msg}`, color)
}
