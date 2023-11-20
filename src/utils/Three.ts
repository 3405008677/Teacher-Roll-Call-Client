import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import Stats from 'stats.js'
/**
 * id 模型数据ID
 * model 模型数据
 * animation 模型动画数组
 * nowAnimation 当前正在播放的动画
 */
interface modelArrTimeType {
  id: string
  model: THREE.Group<THREE.Object3DEventMap>
  mixer: THREE.AnimationMixer
  animation: THREE.AnimationClip[]
  nowAnimation?: THREE.AnimationClip
}
interface animationFrameItemType {
  id: string
  callback: Function
}
interface controlsArrType {
  id: string
  callbackStart?: Function
  callbackEnd?: Function
}
interface positionType {
  x: number
  y: number
  z: number
}

class Three {
  camera!: THREE.PerspectiveCamera // 相机
  scene!: THREE.Scene // 场景
  renderer!: THREE.WebGLRenderer //
  css3DRender!: CSS3DRenderer
  controls!: OrbitControls // 控制器
  stats!: Stats
  private clockSoul = new THREE.Clock() //
  private type: 'default' | 'CSS'
  canvasDom: HTMLCanvasElement | HTMLDivElement // 挂载的Canvas元素
  private animationFrameArr: animationFrameItemType[] = [] // 存放每一帧需要执行的函数
  private controlsArr: controlsArrType[] = [] // 存放控制器事件的执行函数
  modelArr: modelArrTimeType[] = [] // 存放模型对应数据
  constructor(canvasRef: HTMLCanvasElement | HTMLDivElement, type: 'default' | 'CSS' = 'default') {
    this.canvasDom = canvasRef
    this.type = type
    this.init()
    this.cameraResize()
    this.lightCreate()
    this.render()
    this.addStatsJs()
  }
  /**
   *  创建模型到场景里面
   * @param modelId 模型ID——方便释放数据
   * @param url 模型Path
   * @param callback 回调函数
   */
  modelCreate(
    modelId: string,
    url: string,
    callback: (
      model: THREE.Group<THREE.Object3DEventMap>,
      animations?: THREE.AnimationClip[],
    ) => void,
  ) {
    return new Promise((resolve, reject) => {
      if (url.split('.').at(-1) === 'glb') {
        new GLTFLoader().load(url, (gltf) => {
          let model = gltf.scene
          model.castShadow = true
          model.receiveShadow = true
          model.renderOrder = 999 //  相当于z-index
          // model.material.depthTest = false;
          let mixer = this.animationCreate(model)
          this.modelArr.push({ id: modelId, model, mixer, animation: gltf.animations })
          callback(model, gltf.animations)
          this.scene.add(model)
          console.log(gltf.scene.children[0] === gltf.scene)
          resolve(true)
        })
      } else if (url.split('.').at(-1) === 'gltf') {
      }
    })
  }
  /**
   * 创建动画
   */
  private animationCreate(model: THREE.Group<THREE.Object3DEventMap>) {
    const mixer = new THREE.AnimationMixer(model)
    return mixer
  }
  /**
   * 动画播放
   * @param modelId 模型ID
   * @param animationName 动画名称
   */
  animationPlay(modelId: string, animationName: string) {
    // 获取动画信息
    const modelItem = this.modelArr.filter((item) => item.id === modelId)[0]
    if (!modelItem) return console.log('没有辞模型')
    // 找到需要播放的动画
    let clip = THREE.AnimationClip.findByName(modelItem.animation, animationName)
    if (!clip) return console.log('没找到')
    if (clip === modelItem.nowAnimation) return
    // 转换需要播放的动画
    let clipAction = modelItem.mixer.clipAction(clip)
    let oldClipAction: THREE.AnimationAction
    clipAction.time = 0
    clipAction.play() // 播放动画
    // 判断是否有上一个动画
    if (modelItem.nowAnimation) {
      oldClipAction = modelItem.mixer.clipAction(modelItem.nowAnimation)
      clipAction.crossFadeFrom(oldClipAction, 0.5, true) //设置过渡
      setTimeout(() => {
        oldClipAction.stop()
      }, 500)
    } else {
      clipAction.crossFadeFrom(clipAction, 0.5, true)
    }
    modelItem.nowAnimation = clip
  }
  /**
   * 修改相机的位置和朝向点
   * @param position 相机的位置
   * @param target 相机朝向的位置
   */
  cameraPositionSet(position: positionType, target: positionType = { x: 0, y: 0, z: 0 }) {
    gsap.to(this.camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      onUpdate: () => {
        console.log(target)
        this.camera.lookAt(target.x, target.y, target.z) // 观察物体的中心
        this.controls.update()
      },
      onStart: () => {
        this.controls.dispatchEvent({ type: 'start' })
        gsap.to(this.controls.target, {
          x: target.x,
          y: target.y,
          z: target.z,
        })
      },
      onComplete: () => {
        this.controls.dispatchEvent({ type: 'end' })
      },
    })
  }
  /**
   * 重置相机比例
   */
  cameraResize() {
    this.camera.aspect = this.canvasDom.clientWidth / this.canvasDom.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.canvasDom.clientWidth, this.canvasDom.clientHeight)
    if (this.type !== 'CSS') return
    this.css3DRender.setSize(this.canvasDom.clientWidth, this.canvasDom.clientHeight)
  }
  /**
   * 在requestAnimationFrame里面添加执行函数
   * @param id
   * @param callback
   */
  animationFrameAdd(id: string, callback: Function) {
    this.animationFrameArr.push({ id, callback })
  }
  /**
   * 删除requestAnimationFrame里面指定的函数
   * @param id
   */
  animationFrameDelete(id: string) {
    this.animationFrameArr.forEach((item, index) => {
      if (id === item.id) this.animationFrameArr.splice(index, 1)
    })
  }
  controlsEventAdd(id: string, callbackStart?: Function, callbackEnd?: Function) {
    this.controlsArr.push({ id, callbackStart, callbackEnd })
  }
  controlsEventDelete(id: string) {
    this.controlsArr.forEach((item, index) => {
      if (id === item.id) this.controlsArr.splice(index, 1)
    })
  }
  /**
   * 初始化灯光
   */
  private lightCreate() {
    const directionLight = new THREE.DirectionalLight()
    directionLight.castShadow = true
    directionLight.position.set(1, 1, 1)
    const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 1)
    this.scene.add(ambientLight, directionLight)
  }
  // 初始化基础变量
  private init() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvasDom.clientWidth / this.canvasDom.clientHeight,
      0.1,
      2000,
    )
    this.camera.position.set(0, 5, 5)
    this.scene.add(this.camera)
    // 默认的renderer
    if (this.type === 'default') {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvasDom })
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.shadowMap.enabled = true
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    } else if (this.type === 'CSS') {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.shadowMap.enabled = true
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.css3DRender = new CSS3DRenderer()
      this.css3DRender.domElement.style.position = 'absolute'
      this.css3DRender.domElement.style.top = '0'
      this.css3DRender.domElement.style.left = '0'
      this.controls = new OrbitControls(this.camera, this.css3DRender.domElement)
      this.canvasDom.appendChild(this.renderer.domElement)
      this.canvasDom.appendChild(this.css3DRender.domElement)
      this.animationFrameAdd('css3DRender', () => {
        this.css3DRender.render(this.scene, this.camera)
      })
    }

    this.controls.addEventListener('start', () => {
      this.controlsArr.forEach((item) => {
        item.callbackStart ? item.callbackStart() : ''
      })
    })
    this.controls.addEventListener('end', () => {
      this.controlsArr.forEach((item) => {
        item.callbackEnd ? item.callbackEnd() : ''
      })
    })
  }
  // 渲染
  private render() {
    this.stats?.begin()
    this.renderer?.render(this.scene, this.camera)
    // 更新动画帧
    this.modelArr.forEach((item) => {
      item.mixer?.update(this.clockSoul.getDelta())
    })
    this.animationFrameArr?.forEach((item) => {
      item.callback()
    })
    this.stats?.end()
    requestAnimationFrame(() => this.render())
  }
  /**************************************************************************************************************************
   * 特殊功能
   */
  /**
   * 世界坐标线连接屏幕坐标
   * @param lineName 线的ID——用于定位
   * @param start 世界坐标
   * @param end 屏幕坐标
   * @param color 屏幕坐标
   * @param type false 虚线  tree  实线
   */
  screenLinkThreeLine(
    lineName: string,
    start: { x: number; y: number; z: number },
    end: { x: number; y: number },
    config: {
      color?: THREE.ColorRepresentation
      type?: boolean
    } = {},
  ): THREE.Line {
    config?.color === undefined ? (config!.color = 'red') : ''
    config?.type === undefined ? (config!.type = true) : ''
    let position = this.screenPositionToGLPosition(end.x, end.y)
    let starts = new THREE.Vector3(start.x, start.y, start.z)
    let ends = new THREE.Vector3(position.x, position.y, 0).unproject(this.camera)
    // 设置线段的材质
    let material = config.type
      ? new THREE.LineBasicMaterial({ color: config.color }) // 实线
      : new THREE.LineDashedMaterial({
          // 虚线
          color: config.color,
          dashSize: 0.02,
          gapSize: 0.02,
        })

    let geometry = new THREE.BufferGeometry().setFromPoints([starts, ends])
    let line = new THREE.Line(geometry, material)

    line.renderOrder = 99 //  相当于z-index
    line.material.depthTest = false
    // 计算LineDashedMaterial所需的距离的值的数组
    line.computeLineDistances()
    line.name = lineName
    this.scene.add(line)

    this.controlsEventAdd(
      lineName,
      () => {
        line.visible = false // 隐藏
      },
      () => {
        ends = new THREE.Vector3(position.x, position.y, 0).unproject(this.camera)
        geometry = new THREE.BufferGeometry().setFromPoints([starts, ends])
        line.geometry = geometry
        line.computeLineDistances()
        line.visible = true // 显示
      },
    )
    return line
  }
  /**
   * 更新线条位置
   * @param lineName 线条ID
   * @param start 世界坐标
   * @param end 屏幕坐标
   */
  screenLinkThreeLineMove(
    lineName: string,
    start: { x: number; y: number; z: number },
    end: { x: number; y: number },
  ) {
    // 创建一个THREE.Vector3对象，表示3D世界中的点
    let position = this.screenPositionToGLPosition(end.x, end.y)
    let starts = new THREE.Vector3(start.x, start.y, start.z)
    let ends = new THREE.Vector3(position.x, position.y, 0).unproject(this.camera)
    let geometry = new THREE.BufferGeometry().setFromPoints([starts, ends])
    let line: any
    this.scene.children.forEach((item) => {
      if (item.name === lineName) {
        line = item
      }
    })
    this.controlsArr.forEach((item) => {
      if (item.id === lineName) {
        item.callbackEnd = () => {
          ends = new THREE.Vector3(position.x, position.y, 0).unproject(this.camera)
          geometry = new THREE.BufferGeometry().setFromPoints([starts, ends])
          line.geometry = geometry
          line.computeLineDistances()
          line.visible = true // 显示
        }
        line.geometry = geometry
        line.computeLineDistances()
      }
    })
  }
  floorCreate() {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('static/image/hardwood2_diffuse.jpg', function (map) {
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.anisotropy = 4
      map.repeat.set(10, 24)
      map.colorSpace = THREE.SRGBColorSpace
      floorMat.map = map
      floorMat.needsUpdate = true
    })
    textureLoader.load('static/image/hardwood2_bump.jpg', function (map) {
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.anisotropy = 4
      map.repeat.set(10, 24)
      floorMat.bumpMap = map
      floorMat.needsUpdate = true
    })
    textureLoader.load('static/image/hardwood2_roughness.jpg', function (map) {
      map.wrapS = THREE.RepeatWrapping
      map.wrapT = THREE.RepeatWrapping
      map.anisotropy = 4
      map.repeat.set(10, 24)
      floorMat.roughnessMap = map
      floorMat.needsUpdate = true
    })

    let floorMat = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 1,
    })
    const floorGeometry = new THREE.PlaneGeometry(100, 100)
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat)
    floorMesh.receiveShadow = true
    floorMesh.rotation.x = -Math.PI / 2.0
    this.scene.add(floorMesh)
  }
  /*************************************************************************************************************************
   * 工具
   */
  /**
   * 屏幕坐标转换为WebGl坐标
   * @param X
   * @param Y
   * @returns THREE.Vector2
   */
  screenPositionToGLPosition(X: number, Y: number): THREE.Vector2 {
    const rect = this.canvasDom.getBoundingClientRect()
    let x = ((X - rect.left) * window.innerWidth) / rect.width
    let y = ((Y - rect.top) * window.innerHeight) / rect.height
    x = (x / window.innerWidth) * 2 - 1
    y = (y / window.innerHeight) * -2 + 1
    return new THREE.Vector2(x, y)
  }
  /**
   * WebGl坐标转换为屏幕坐标
   * @param X
   * @param Y
   * @param Z
   * @returns { x: number; y: number }
   */
  glPositionToScreenPosition(X: number, Y: number, Z: number): { x: number; y: number } {
    const centerX = this.canvasDom.clientWidth / 2
    const centerY = this.canvasDom.clientHeight / 2
    const standardVec = new THREE.Vector3(X, Y, Z).project(this.camera)
    const screenX = Math.round(centerX * standardVec.x + centerX)
    const screenY = Math.round(-centerY * standardVec.y + centerY)
    return { x: screenX, y: screenY }
  }

  /**
   *  鼠标选取物体
   * @param x 屏幕坐标X
   * @param y 屏幕坐标Y
   * @param children 匹配的数组——默认scene.children
   * @returns 选中的模型
   */
  getRaycasterPosition(x: number, y: number, children?: any[]): any {
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(this.screenPositionToGLPosition(x, y), this.camera)
    // const intersectedObjects = raycaster.intersectObjects(this.scene.children, true); // 是否递归查询子对象
    const intersectedObjects = raycaster.intersectObjects(children ? children : this.scene.children)
    if (intersectedObjects.length > 0) {
      // 获取第一个相交的模型对象
      let firstIntersectedObject = intersectedObjects[0]
      return firstIntersectedObject
    }
  }
  /**
   * 开启帧数监听
   */
  addStatsJs() {
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)
  }
}

export default Three

export { THREE, OrbitControls, GLTFLoader, CSS3DRenderer, CSS3DObject }
