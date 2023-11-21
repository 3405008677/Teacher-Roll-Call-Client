<template>
  <div id="ThreeContainer" ref="ThreeContainer" class="relative h100%">
    <div ref="ThreeRef" class="absolute w100% h100%"></div>
    <div class="absolute right-0 z10" @click="toggle">
      <el-tooltip class="box-item" effect="dark" content="全屏" placement="right">
        <el-icon size="30" color="#00fffff2"><FullScreen /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import T, { CSS3DObject, CSS3DRenderer, THREE } from '@/utils/Three'
  import { gsap } from 'gsap'
  import { useFullscreen } from '@vueuse/core'
  let Three: T
  const ThreeRef = ref<HTMLDivElement>()
  const ThreeContainer = ref<HTMLDivElement>()
  const { toggle, isFullscreen } = useFullscreen(ThreeContainer)
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
  const CSS3DObjectList: CSS3DObject[] = []
  const domeObjectList: HTMLDivElement[] = []
  let interval: number = 200,
    row: number,
    col: number
  // 是否有放大Div了
  let isMagnifyDiv = false
  let oldActive: number

  onMounted(() => {
    Three = new T(ThreeRef.value!, 'CSS')
    Three.cameraPositionSet({ x: 0, y: 0, z: 1200 }, { x: 0, y: 0, z: 0 })
    // 创建卡片
    nameList.forEach((item, index) => {
      createDivElement(index)
    })
    DivCreateEvent()
    createParticle(4000)
    permutationDom()
    // 放大Div
    function DivMagnify(index: number) {
      gsap.to(CSS3DObjectList[index].position, {
        x: (interval * row) / 2 - (domeObjectList[index].clientWidth / 2) * 1.5,
        y: (interval * col) / 2 - domeObjectList[index].clientHeight / 2,
        z: (CSS3DObjectList[index].position.z += 150),
      })
      gsap.to(CSS3DObjectList[index].scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
      })
    }
    // 恢复Div大小
    function DivResize(index: number) {
      gsap.to(CSS3DObjectList[index].scale, {
        x: 1,
        y: 1,
        z: 1,
      })
    }
    // 给卡片添加点击事件
    function DivCreateEvent() {
      domeObjectList.forEach((item, index) => {
        item.addEventListener('pointerdown', async (event) => {
          event.stopPropagation()
          // 如果当前没有放大的元素就进入
          if (!isMagnifyDiv) {
            isMagnifyDiv = true
            oldActive = index
            DivMagnify(index)
            console.log(1)
            return
          }
          isMagnifyDiv = false
          DivResize(oldActive)
          DivResize(oldActive)
          await permutationDom()
          console.log(2)
        })
      })
    }
    // 矩阵排列Dom元素
    function permutationDom() {
      return new Promise((resolve, reject) => {
        ;[row, col] = calculateSquareRoot(nameList.length)
        let newList: CSS3DObject[][] = []
        let index = 0
        for (let i = 0; i < row; i++) {
          newList.push([])
          for (let j = 0; j < col; j++) {
            if (!CSS3DObjectList[index]) return
            newList[i].push(CSS3DObjectList[index])
            gsap.to(CSS3DObjectList[index].position, {
              x: i * interval,
              y: j * interval,
              z: interval,
              onUpdate: () => {},
              onStart: () => {},
              onComplete: () => {},
            })
            index++
          }
        }
        Three.cameraPositionSet(
          { x: (row * interval) / 2, y: (col * interval) / 2, z: 1200 },
          { x: (row * interval) / 2, y: (col * interval) / 2, z: 0 },
        )
        resolve(newList)
      })
    }
    // 创建卡片
    function createDivElement(index: number) {
      const elementDiv = document.createElement('div')
      elementDiv.className = 'element'
      if (nameList[index].gender === '男') elementDiv.classList.add('man')
      if (nameList[index].gender === '女') elementDiv.classList.add('girl')

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
      CSS3DObjectList.push(css3DObject)
      domeObjectList.push(elementDiv)
    }
    // 创建粒子
    function createParticle(total: number) {
      const height = 5000
      const width = 5000
      const depth = 5000
      const particles = new THREE.BufferGeometry()
      const particlePositions = new Float32Array(total * 3)
      for (let i = 0; i < total * 3; i++) {
        const x = Math.random() * width - width * 0.5
        const y = Math.random() * height - height * 0.5
        const z = -Math.random() * depth + 100
        particlePositions[i] = x
        particlePositions[i + 1] = y
        particlePositions[i + 2] = z
      }
      particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
      const material = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x00ffff,
        fog: true,
      })
      const points = new THREE.Points(particles, material)
      Three.scene.add(points)
      setPosition()
      setInterval(() => {
        setPosition()
      }, 3000)

      function setPosition() {
        const positions = points.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          const offsetX = Math.random() * 10 - 5 // 在 -5 到 5 之间生成随机数
          const offsetY = Math.random() * 10 - 5
          const offsetZ = Math.random() * 10 - 5
          gsap.to(positions, {
            duration: 3,
            onUpdate: () => {
              positions[i] += offsetX
              positions[i + 1] += offsetY
              positions[i + 2] += offsetZ
              points.geometry.attributes.position.needsUpdate = true
              if (positions[i] > width || positions[i] < -width) positions[i] = 0
              if (positions[i + 1] > height || positions[i + 1] < -height) positions[i + 1] = 0
              if (positions[i + 2] > depth || positions[i + 2] < -depth) positions[i + 2] = -depth
            },
            onStart: () => {},
            onComplete: () => {},
          })
        }
        points.geometry.attributes.position.needsUpdate = true
      }
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
</script>
<style lang="scss">
  .man {
    background-color: rgb(43, 112, 112);
    &:hover {
      border: 1px solid rgba(127, 255, 255, 0.75);
      box-shadow: 0 0 12px rgba(0, 255, 255, 0.75);
    }
  }
  .girl {
    background-color: rgb(121, 52, 52);
    &:hover {
      border: 1px solid rgba(248, 75, 75, 0.75);
      box-shadow: 0 0 12px rgb(255, 32, 32);
    }
  }

  .element {
    position: relative;
    width: 120px;
    height: 160px;
    text-align: center;
    border: 1px solid rgba(127, 255, 255, 0.25);
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);

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
