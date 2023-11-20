<template>
  <div id="ThreeContainer" class="relative h100%">
    <div ref="ThreeRef" class="absolute w100% h100%"></div>
  </div>
</template>
<script lang="ts" setup>
  import T, { CSS3DObject, CSS3DRenderer, THREE } from '@/utils/Three'
  import { gsap } from 'gsap'

  let Three: T
  const ThreeRef = ref<HTMLDivElement>()
  const nameList = [
    { name: '彭于晏', gender: '男' },
    { name: '吴彦祖', gender: '男' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '彭于晏', gender: '男' },
    { name: '吴彦祖', gender: '男' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '彭于晏', gender: '男' },
    { name: '吴彦祖', gender: '男' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '彭于晏', gender: '男' },
    { name: '吴彦祖', gender: '男' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '彭于晏', gender: '男' },
    { name: '吴彦祖', gender: '男' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
  ]
  const objectList: CSS3DObject[] = []
  onMounted(() => {
    Three = new T(ThreeRef.value!, 'CSS')
    Three.camera.position.z = 1000
    nameList.forEach((item, index) => {
      createDivElement(index)
    })
    setTimeout(() => {
      permutationDom()
    }, 4000)

    /**
     * m:6，【3，2】
     * m:9，【3，3】
     * m:15，【4，4】
     * m:22，【5，5】
     * m:25，【5，5】
     * m:30，【6，5】
     * m:31，【6，6】
     * m:48，【7，7】
     * m:50，【8，7】
     */

    // 矩阵排列Dom元素
    function permutationDom() {
      const [row, col] = calculateSquareRoot(nameList.length)
      let newList: CSS3DObject[][] = []
      let index = 0
      for (let i = 0; i < row; i++) {
        newList.push([])
        for (let j = 0; j < col; j++) {
          if (!objectList[index]) return
          newList[i].push(objectList[index])
          gsap.to(objectList[index].position, {
            x: i * 200,
            y: j * 200,
            z: 200,
            onUpdate: () => {},
            onStart: () => {},
            onComplete: () => {},
          })
          index++
        }
      }
      Three.cameraPositionSet(
        { x: (row * 200) / 2, y: (col * 200) / 2, z: 600 },
        { x: (row * 200) / 2, y: (col * 200) / 2, z: 600 },
      )
      return newList
    }

    function createDivElement(index: number) {
      const elementDiv = document.createElement('div')
      elementDiv.className = 'element'
      const numberDiv = document.createElement('div')
      numberDiv.className = 'number'
      numberDiv.textContent = index.toString()
      const symbolDiv = document.createElement('div')
      symbolDiv.className = 'symbol'
      symbolDiv.textContent = nameList[index].name
      const detailDiv = document.createElement('div')
      detailDiv.className = 'detail'
      detailDiv.textContent = nameList[index].gender

      elementDiv.appendChild(numberDiv)
      elementDiv.appendChild(symbolDiv)
      elementDiv.appendChild(detailDiv)
      const css3DObject = new CSS3DObject(elementDiv)
      css3DObject.position.x = Math.random() * 4000 - 2000
      css3DObject.position.y = Math.random() * 4000 - 2000
      css3DObject.position.z = Math.random() * 4000 - 2000
      Three.scene.add(css3DObject)
      objectList.push(css3DObject)
    }

    window.addEventListener('resize', function (ev) {
      let container = this.document.querySelector('#ThreeContainer')
      ThreeRef.value!.style.height = `${container?.clientHeight}px`
      ThreeRef.value!.style.width = `${container?.clientWidth}px`
      Three.cameraResize()
    })
  })

  function calculateSquareRoot(m: number): [number, number] {
    const squareRoot: number = Math.sqrt(m)
    if (Number.isInteger(squareRoot)) {
      // 如果算术平方根是整数，则返回该整数
      return [Math.floor(squareRoot), Math.floor(squareRoot)]
    } else {
      // 否则，返回向上取整和向下取整的整数，并检查是否需要加1
      const MCeil: number = Math.ceil(squareRoot)
      let NFloor: number = Math.floor(squareRoot)
      if (m - MCeil * NFloor >= MCeil || m - MCeil * NFloor >= NFloor) {
        // MCeil += 1;
        NFloor += 1
      }
      if (m - MCeil * NFloor > 0 && m - MCeil * NFloor < MCeil && m - MCeil * NFloor < NFloor) {
        NFloor += 1
      }
      return [MCeil, NFloor]
    }
  }
  function findDimensions(m: number) {
    let minDifference = Infinity
    let result = [0, 0]
    for (let M = 1; M <= m; M++) {
      for (let N = 1; N <= m; N++) {
        if (M * N - m >= 0 && M * N - m <= Math.min(M, N)) {
          let difference = Math.pow(M - N, 2)
          if (difference < minDifference) {
            minDifference = difference
            result = [M, N]
          }
        }
      }
    }
    return result
  }
</script>
<style lang="scss">
  .element {
    position: relative;
    width: 120px;
    height: 160px;
    text-align: center;
    border: 1px solid rgba(127, 255, 255, 0.25);
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
    &:hover {
      border: 1px solid rgba(127, 255, 255, 0.75);
      box-shadow: 0 0 12px rgba(0, 255, 255, 0.75);
    }
    .number {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 12px;
      color: rgba(127, 255, 255, 0.75);
    }
    .symbol {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 26px;
      font-weight: bold;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      color: rgba(255, 255, 255, 0.75);
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
    }
    .detail {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 15px;
      font-size: 12px;
      color: rgba(127, 255, 255, 0.75);
    }
  }
</style>
