export {}
declare global {
  interface RouteMeta {
    title?: string
    icon?: string
    needLogin?: boolean
    keepAlive?: boolean
  }
  interface RouteRule extends Record<string | number | symbol, unknown> {
    path: string
    name: string
    redirect?: string
    meta?: RouteMeta
    component?: any
    children?: Array<RouteRule>
  }
  interface MyRouter {
    pid: number
    path: string
    component: string
    icon: string
    title: string
    keepAlive: number
    father: number
    type: 'teacher' | 'admin'
  }
}
