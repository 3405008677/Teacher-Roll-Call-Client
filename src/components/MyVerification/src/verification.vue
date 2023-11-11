<template>
  <div @click="replaceValue" class="myCanvas">
    <canvas id="v-canvas" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>
<script lang="ts" setup>
  /**
   * 验证码组件
   */
  import { onMounted, nextTick } from 'vue'
  const emit = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      // 默认注册码
      type: String,
      default: '1234',
    },
    types: {
      // 验证码类型  默认 'default' 英文+数字    数字 'number'    英文　'english'
      type: String,
      default: 'default',
    },
    fontSizeMin: {
      // 字体最小值
      type: Number,
      default: 25,
    },
    fontSizeMax: {
      // 字体最大值
      type: Number,
      default: 35,
    },
    backgroundColorMin: {
      // 验证码图片背景色最小值
      type: Number,
      default: 200,
    },
    backgroundColorMax: {
      // 验证码图片背景色最大值
      type: Number,
      default: 220,
    },
    dotColorMin: {
      // 背景干扰点最小值
      type: Number,
      default: 60,
    },
    dotColorMax: {
      // 背景干扰点最大值
      type: Number,
      default: 120,
    },
    contentWidth: {
      // 容器宽度
      type: Number,
      default: 90,
    },
    contentHeight: {
      // 容器高度
      type: Number,
      default: 38,
    },
  })
  let codeType: string = ''
  switch (props.types) {
    case 'default':
      codeType = '1234567890abcdefjhijklinopqrsduvwxyz'
      break
    case 'number':
      codeType = '1234567890'
      break
    case 'english':
      codeType = 'abcdefjhijklinopqrsduvwxyz'
      break
    default:
      break
  }
  // 生成一个随机数
  const randomNum = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机颜色
    randomColor = (min: number, max: number) => {
      let r = randomNum(min, max),
        g = randomNum(min, max),
        b = randomNum(min, max)
      return `rgb(${r},${g},${b})`
    },
    drawText = (ctx: any, txt: any, i: any) => {
      // 随机生成字体颜色
      ctx.fillStyle = randomColor(50, 160)
      // 随机生成字体大小
      ctx.font = `${randomNum(props.fontSizeMin, props.fontSizeMax)}px serif`
      let x = (i + 1) * (props.contentWidth / (props.modelValue.length + 1)),
        y = randomNum(props.fontSizeMax, props.contentHeight - 5),
        deg = randomNum(-30, 30)
      ctx.translate(x, y)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate((-deg * Math.PI) / 180)
      ctx.translate(-x, -y)
    },
    // 绘制干扰线
    drawLine = (ctx: any) => {
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = randomColor(100, 200)
        ctx.beginPath()
        ctx.moveTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight))
        ctx.lineTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight))
        ctx.stroke()
      }
    },
    // 绘制干扰点
    drawDot = (ctx: any) => {
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(
          randomNum(0, props.contentWidth),
          randomNum(0, props.contentHeight),
          1,
          0,
          2 * Math.PI,
        )
        ctx.fill()
      }
    },
    makeCode = (len: any) => {
      let str = ''
      for (let i = 0; i < len; i++) {
        str += codeType[randomNum(0, codeType.length)]
      }
      emit('update:modelValue', str)
    },
    //创建实例
    drawPic = async () => {
      let canvas = document.getElementById('v-canvas') as HTMLCanvasElement
      let ctx = canvas?.getContext('2d')
      ctx!.textBaseline = 'bottom'
      // 需要绘制的文字
      makeCode(4)
      // 绘制背景
      ctx!.fillStyle = '#e6ecfd'
      ctx!.fillRect(0, 0, props.contentWidth, props.contentHeight)
      // 开始绘制文字
      await nextTick()
      for (let i = 0; i < props.modelValue.length; i++) {
        drawText(ctx, props.modelValue[i], i)
      }
      drawLine(ctx)
      drawDot(ctx)
    }
  //刷新
  const replaceValue = () => {
    drawPic()
  }
  onMounted(() => {
    drawPic()
  })
</script>

<style scoped>
  .myCanvas {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
