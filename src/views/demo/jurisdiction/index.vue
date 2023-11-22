<template>
  <div id="ThreeContainer" ref="ThreeContainer" class="relative h100%">
    <div ref="ThreeRef" class="absolute w100% h100%"></div>
    <div class="absolute right-20px top-10px z10" @click="toggle">
      <el-tooltip class="box-item" effect="dark" content="全屏" placement="right">
        <el-icon size="30" color="#00fffff2"><FullScreen /></el-icon>
      </el-tooltip>
    </div>
    <div class="absolute right-20px top-50px z10" @click="permutationDomSphere">
      <el-tooltip class="box-item" effect="dark" content="球形" placement="right">
        <el-icon size="30" color="#00fffff2"><Football /></el-icon>
      </el-tooltip>
    </div>
    <div class="absolute right-20px top-90px z10" @click="permutationDom">
      <el-tooltip class="box-item" effect="dark" content="平面" placement="right">
        <el-icon size="30" color="#00fffff2"><Box /></el-icon>
      </el-tooltip>
    </div>
    <div class="startDom">
      <p>{{ startText }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import T, { CSS3DObject, THREE } from '@/utils/Three'
  import { gsap } from 'gsap'
  import { useFullscreen } from '@vueuse/core'
  import { appStore } from '@/store'
  let Three: T
  const ThreeRef = ref<HTMLDivElement>()
  const ThreeContainer = ref<HTMLDivElement>()
  const { toggle } = useFullscreen(ThreeContainer)
  const nameList = [
    { name: '陈冠希', gender: '男' },
    { name: '彭于晏', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '吴彦祖', gender: '男' },
    { name: '彭于晏', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '吴彦祖', gender: '男' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '彭于晏', gender: '男' },
    { name: '吴彦祖', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '彭于晏', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '吴彦祖', gender: '男' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '彭于晏', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '吴彦祖', gender: '男' },
    { name: '韩红', gender: '女' },
    { name: '陈冠希', gender: '男' },
    { name: '韩红', gender: '女' },
  ]
  const CSS3DObjectList: CSS3DObject[] = []
  const domeObjectList: HTMLDivElement[] = []
  let interval: number = 200,
    distance: number = 0,
    cameraDistance: number = 1200,
    row: number,
    col: number
  let CarStart = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  }
  let isMagnifyDiv = ref(false) // 是否有放大Div了
  let scaleNumber = 2
  let oldActive: number // 放大倍数
  let startText = ref('开始')
  appStore.setTitle('随机抽取一位幸运观众')

  onMounted(() => {
    Three = new T(ThreeRef.value!, 'CSS')
    Three.cameraPositionSet({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 })
    // 创建卡片
    nameList.forEach((item, index) => {
      createDivElement(index)
    })
    function init() {
      DivCreateEvent()
      createParticle(4000)
      permutationDom()
      CallInit()
    }
    // 抽人逻辑
    function CallStart() {
      const randomIndex = Math.floor(Math.random() * nameList.length)
      // 返回数组中对应随机索引的值
      CarSizeFun(randomIndex)
      return
    }
    // 初始化抽人
    function CallInit() {
      watch(
        () => isMagnifyDiv.value,
        (newValue) => {
          if (newValue === true) startText.value = '结束'
          if (newValue === false) startText.value = '开始'
        },
      )
      const startDom = document.querySelector('.startDom') as HTMLDivElement
      startDom.addEventListener('pointerdown', () => {
        CallStart()
        if (startText.value === '开始') {
          startText.value = '结束'
        } else if (startText.value === '结束') {
          isMagnifyDiv.value = false
          startText.value = '开始'
        }
      })
      const css3DObject = new CSS3DObject(startDom)
      css3DObject.position.x = (row * 200) / 2 - 100
      css3DObject.position.y = col * 200 + 100
      css3DObject.position.z = distance
      Three.scene.add(css3DObject)
    }
    // 放大Div
    function DivMagnify(index: number) {
      let Vector = new THREE.Object3D()
      Vector.position.set(
        CSS3DObjectList[oldActive].position.x,
        CSS3DObjectList[oldActive].position.y,
        CSS3DObjectList[oldActive].position.z,
      )
      Vector.rotation.set(
        CSS3DObjectList[oldActive].rotation.x,
        CSS3DObjectList[oldActive].rotation.y,
        CSS3DObjectList[oldActive].rotation.z,
      )
      CarStart.position = Vector.position
      CarStart.rotation = Vector.rotation
      console.log(CarStart.position)

      gsap.to(CSS3DObjectList[index].position, {
        x: (interval * row) / 2 - (domeObjectList[index].clientWidth / 2) * scaleNumber,
        y: (interval * col) / 2 - domeObjectList[index].clientHeight / 2,
        z: (CSS3DObjectList[index].position.z += 150),
      })
      gsap.to(CSS3DObjectList[index].scale, {
        x: scaleNumber,
        y: scaleNumber,
        z: scaleNumber,
      })
    }
    // 恢复Div大小
    function DivResize(index: number) {
      gsap.to(CSS3DObjectList[index].scale, {
        x: 1,
        y: 1,
        z: 1,
      })
      gsap.to(CSS3DObjectList[index].position, {
        x: CarStart.position.x,
        y: CarStart.position.y,
        z: CarStart.position.z,
      })
      gsap.to(CSS3DObjectList[index].rotation, {
        x: CarStart.rotation.x,
        y: CarStart.rotation.y,
        z: CarStart.rotation.z,
      })
    }

    // 卡片放大缩小逻辑
    async function CarSizeFun(index: number) {
      if (!isMagnifyDiv.value) {
        isMagnifyDiv.value = true
        oldActive = index
        DivMagnify(index)
        return
      }
      isMagnifyDiv.value = false
      DivResize(oldActive)
      // permutationDom()
    }
    // 给卡片添加点击事件
    function DivCreateEvent() {
      domeObjectList.forEach((item, index) => {
        item.addEventListener('pointerdown', (event) => {
          event.stopPropagation()
          // 如果当前没有放大的元素就进入
          CarSizeFun(index)
        })
      })
    }
    // 矩阵排列Dom元素
    permutationDom = () => {
      return new Promise((resolve, reject) => {
        ;[row, col] = calculateSquareRoot(nameList.length)
        let newList: CSS3DObject[][] = []
        let index = 0
        for (let i = 0; i < row; i++) {
          newList.push([])
          for (let j = 0; j < col; j++) {
            if (!CSS3DObjectList[index]) break
            newList[i].push(CSS3DObjectList[index])
            gsap.to(CSS3DObjectList[index].position, {
              x: i * interval,
              y: j * interval,
              z: distance,
              onUpdate: () => {},
              onStart: () => {},
              onComplete: () => {},
            })
            gsap.to(CSS3DObjectList[index].rotation, { x: 0, y: 0, z: 0 })
            index++
          }
        }
        Three.cameraPositionSet(
          { x: (row * interval) / 2, y: (col * interval) / 2, z: cameraDistance },
          { x: (row * interval) / 2, y: (col * interval) / 2, z: 0 },
        )
        resolve(newList)
      })
    }
    // 球形排列Dom元素
    permutationDomSphere = () => {
      ;[row, col] = calculateSquareRoot(nameList.length)
      row = (row * 200) / 2 - 100
      col = (col * 200) / 2
      const vector = new THREE.Vector3()
      for (let i = 0, l = nameList.length; i < l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l)
        const theta = Math.sqrt(l * Math.PI) * phi
        const object = new THREE.Object3D()
        object.position.setFromSphericalCoords(400, phi, theta)
        vector.copy(object.position).multiplyScalar(2)
        object.lookAt(vector)
        gsap.to(CSS3DObjectList[i].position, {
          x: (object.position.x += row),
          y: (object.position.y += col),
          z: (object.position.z += distance),
        })
        gsap.to(CSS3DObjectList[i].rotation, {
          x: object.rotation.x,
          y: object.rotation.y,
          z: object.rotation.z,
        })
      }
      Three.cameraPositionSet({ x: row, y: col, z: 120 }, { x: row, y: col, z: 0 })
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
    init()
  })
  // 球形排列Dom元素
  let permutationDomSphere = () => {}
  let permutationDom = () => {}

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
  .startDom {
    width: 160px;
    height: 160px;
    border: 1px solid rgba(218, 82, 82, 0.25);
    box-shadow: 0 0 12px rgb(255, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #fff;
    font-size: 36px;
    background-color: rgba(216, 41, 41, 0.442);
    &:hover {
      border: 1px solid rgba(248, 75, 75, 0.75);
      box-shadow: 0 0 12px rgb(255, 32, 32);
    }
  }
</style>
