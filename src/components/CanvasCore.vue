<!--
 * @Description:画布
 * @Date: 2022-07-14 09:55:27
-->
<template>
  <div class="body-main">
    <div class="size">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { onMounted } from 'vue'

let canvas = null
onMounted(() => {
  canvas = new fabric.Canvas('canvas')
})
//
type Img = Element | File | string
interface ImgOption {
  left?: 100
  top?: 100
  width: 200
  height: 100
  angle?: 30
}

// 创建图片
const createPicture = (img: Img, option: ImgOption): void => {
  console.log('')
}

type Text = string
interface TextOption {
  width: 200 // 文字的宽度
  height: 20 // 文字的高度
  top?: 100 // 文字的顶边距离
  left?: 100 // 文字的左边距离
  fill?: string // 文字填充颜色
  fontFamily?: string //字体
  fontSize: 14 // 字体大小
  paintFirst?: 'fill' | 'stroke' // 先绘制描边还是填充，默认fill,先绘制填充添加的描边是内描边,修改stroke，将变成外描边
  strokeWidth?: 1 //边框宽度
  stroke?: string // 边框颜色
  textAlign: 'left' | 'center' | 'right' | 'justify' | 'justify-left' | 'justify-center' | 'justify-right' //对齐方式
  textBackgroundColor?: string // 文字背景颜色
  lineHeight?: number // 行高
  overline?: false // 上划线
  underline?: false // 下划线
  padding?: number // 内边距
  fontStyle?: 'normal' | 'italic' | 'oblique' // 样式,值有:"normal", "italic" or "oblique",默认normal;
  fontWeight?: number | string // 文字粗细,
  angle?: 0 // 旋转角度
  // shadow: 文字的阴影,值是new fabric.Shadow()
}

// 创建文字
const createText = (text: Text, option: TextOption): void => {
  console.log('')
}
</script>

<style lang="scss">
.body-main {
  width: 100%;
  height: 100%;
  @include flex();
  .size {
    width: 90%;
    height: 90%;
  }
}
.upper-canvas,
.canvas-container,
.lower-canvas {
  width: 100% !important;
  height: 100% !important;
}
#canvas {
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}
</style>
