<!--
 * @Description:画布
 * @Date: 2022-07-14 09:55:27
-->
<template>
  <div class="body-main">
    <canvas id="canvas" :width="canvasBaseInfo.canvasWidth" :height="canvasBaseInfo.canvasHeight"></canvas>
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { onMounted, reactive, nextTick } from 'vue'

// 画布对象
let canvas = null

// 当前操作对象
let operateObj = null

// 画布中所有对象
let canvasAllIObj = null

// 画布基础信息
const canvasBaseInfo = reactive({
  canvasWidth: 800,
  canvasHeight: 800
})

/* =========================== 初始化 =========================== */
onMounted(() => {
  canvas = new fabric.Canvas('canvas')
  canvas.on('mouse:down', mouseDown)
  canvas.on('mouse:up', mouseUp)
  canvas.on('path:created', pathCreated)
  // canvas.on('mouse:move', mouseMove)
  createText('测试文字')
  createPicture('https://image-static.segmentfault.com/276/474/2764740557-5c2dd81d73227_fix732')
})

/* =========================== 钩子集 =========================== */

// 鼠标按下
const mouseDown = e => {
  // 获取当前活动对象
  operateObj = canvas.getActiveObject()
  // if (e.target) {
  //   console.log(e.target)
  // }
}

// 鼠标弹起
const mouseUp = e => {
  // operateObj = canvas.getActiveObject()
  // if (e.target) {
  //   console.log(e.target)
  // }
}

// 鼠标移动
// const mouseMove = e => {
//   console.log(e)
// }

// 元素创建
const pathCreated = e => {
  console.log(e)
}
/* =========================== 图片集 =========================== */
type Img = object | string
// interface ImgOption {
//   left?: number
//   top?: number
//   width?: number
//   height?: number
//   angle?: number
// }

// 创建图片
// 所有图片对象
let imgObjList = []
// const createPicture = (img: Img, option?: ImgOption): void => {
const createPicture = (img: Img): void => {
  if (typeof img === 'string') {
    new fabric.Image.fromURL(img, function (oImg: object) {
      imgObjList.push(oImg)
      canvasCreate(oImg)
    })
  } else {
    new fabric.Image.fromObject(img, function (oImg: object) {
      imgObjList.push(oImg)
      canvasCreate(oImg)
    })
  }
}

/* =========================== 文本集 =========================== */

type Text = string
interface TextOption {
  width?: number // 文字的宽度
  height?: number // 文字的高度
  top?: number // 文字的顶边距离
  left?: number // 文字的左边距离
  fill?: string // 文字填充颜色
  fontFamily?: string //字体
  fontSize?: number // 字体大小
  paintFirst?: 'fill' | 'stroke' // 先绘制描边还是填充，默认fill,先绘制填充添加的描边是内描边,修改stroke，将变成外描边
  strokeWidth?: number //边框宽度
  stroke?: string // 边框颜色
  textAlign: 'left' | 'center' | 'right' | 'justify' | 'justify-left' | 'justify-center' | 'justify-right' //对齐方式
  textBackgroundColor?: string // 文字背景颜色
  lineHeight?: number // 行高
  overline?: false // 上划线
  underline?: false // 下划线
  padding?: number // 内边距
  fontStyle?: 'normal' | 'italic' | 'oblique' // 样式,值有:"normal", "italic" or "oblique",默认normal;
  fontWeight?: number | string // 文字粗细,
  angle?: number // 旋转角度
  // shadow: 文字的阴影,值是new fabric.Shadow()
}

// 创建文字
// 所有文字对象
let textObjList = []
const createText = (text: Text, option?: TextOption): void => {
  const textObj = new fabric.IText(text, option)
  textObjList.push(textObj)
  canvasCreate(textObj)
  // 获取所有对象
}

/* =========================== 交互集 =========================== */

// 创建对象
const canvasCreate = (obj: object): void => {
  canvas.add(obj)
  canvasAllIObj = canvas.getObjects()
}

// 清除对象
const removeObj = (obj: object): void => {
  canvas.remove(obj)
  canvasAllIObj = canvas.getObjects()
}

// 清除所有对象
const clear = () => {
  canvas.clear()
  canvas = null
  operateObj = null
  canvasAllIObj = null
  textObjList = []
  imgObjList = []
}

// 设置活动对象在画布中的层级
const setLevel = (obj: object, n: 1 | -1 | 'top' | 'bottom'): void => {
  switch (n) {
    case 1:
      canvas.bringForward(obj) //向上跳一层：

      break
    case -1:
      canvas.sendBackwards(obj) //向下跳一层

      break
    case 'top':
      canvas.bringToFront(obj) //向上跳顶层：

      break
    case 'bottom':
      canvas.sendToBack(obj) //向下跳底层：

      break
    default:
      break
  }
}
</script>

<style lang="scss">
.body-main {
  width: 100%;
  height: 100%;
  @include flex();
}
#canvas {
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}
</style>
