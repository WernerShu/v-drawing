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
import { onMounted, reactive } from 'vue'

// 画布对象
let canvas = null

// 画布基础信息
const canvasBaseInfo = reactive({
  canvasWidth: 800,
  canvasHeight: 800
})

onMounted(() => {
  canvas = new fabric.Canvas('canvas')
  createText('测试文字')
  createPicture('https://image-static.segmentfault.com/276/474/2764740557-5c2dd81d73227_fix732')
})

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
let imgObjList = []
// const createPicture = (img: Img, option?: ImgOption): void => {
const createPicture = (img: Img): void => {
  if (typeof img === 'string') {
    new fabric.Image.fromURL(img, function (oImg) {
      canvas.add(oImg)
      imgObjList.push(oImg)
    })
  } else {
    new fabric.Image.fromObject(img, function (oImg) {
      canvas.add(oImg)
      imgObjList.push(oImg)
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
let textObjList = []
const createText = (text: Text, option?: TextOption): void => {
  const textObj = new fabric.IText(text, option)
  textObjList.push(textObj)
  canvas.add(textObj)
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
