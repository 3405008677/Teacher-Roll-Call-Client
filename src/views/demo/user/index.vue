<template>
  <div id="ThreeContent">
    <canvas ref="ThreeCanvas" class="w100% h100%" />
  </div>
</template>
<script lang="ts" setup>
  import T, { THREE } from '@/utils/Three'
  import { gsap } from 'gsap'

  let Three: T
  const ThreeCanvas = ref<HTMLDivElement>()
  let duration = 1 // 动画帧秒数
  let ease = 'power1.inOut' // 动画曲线
  let interval: number = 20,
    distance: number = 0,
    cameraDistance: number = 1200,
    row: number,
    col: number
  const nameList = [
    { name: '韩红', gender: '女' },
    { name: '吴彦祖', gender: '男' },
    { name: '吴彦祖', gender: '男' },
  ]
  onMounted(() => {
    Three = new T(ThreeCanvas.value!)
    let cardPromiseArr: any = []
    nameList.forEach((item) => {
      cardPromiseArr.push(createCard(item.name, 'card', { x: 0, y: 0, z: 0 }))
    })
    Promise.all(cardPromiseArr)
    permutationDom()
    function createCard(name: string, type: string, position: position): Promise<any> {
      return new Promise((resolve, reject) => {
        let group = new THREE.Group()
        Three.modelCreate(name, `/public/glb/${type}.glb`, (module) => {
          console.log(module)
          module.scale.set(0.007, 0.007, 0.007)
          module.position.x = position.x
          module.position.y = position.y
          module.position.z = position.z
          group.add(module)

          let mesh = Three.textCreate({ text: name, size: 12 }).then((mesh) => {
            mesh.scale.set(0.07, 0.07, 0.07)
            mesh.position.x = -1.6
            resolve(true)
          })
          return group
        })

        function createText() {
          return new Promise((resolve, reject) => {
            Three.textCreate({ text: name, size: 12 }).then((mesh) => {
              mesh.scale.set(0.07, 0.07, 0.07)
              mesh.position.x = -1.6
              group.add(mesh)
              resolve(mesh)
            })
          })
        }
      })
    }
    // 矩阵排列Dom元素
    function permutationDom() {
      ;[row, col] = calculateSquareRoot(nameList.length)
      console.log(row, col)
      let index = 0
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          if (!Three.modelArr[index].model) break
          gsap.to(Three.modelArr[index].model.position, {
            x: i * interval,
            y: j * interval,
            z: distance,
            duration,
            ease,
            onUpdate: () => {},
            onStart: () => {},
            onComplete: () => {},
          })
          gsap.to(Three.modelArr[index].model.rotation, { x: 0, y: 0, z: 0, duration, ease })
          index++
        }
      }
      Three.cameraPositionSet(
        { x: (row * interval) / 2, y: (col * interval) / 2, z: cameraDistance },
        { x: (row * interval) / 2, y: (col * interval) / 2, z: 0 },
      )
    }
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
<style lang="scss"></style>
