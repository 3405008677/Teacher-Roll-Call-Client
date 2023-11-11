export {}
declare global {
  declare type Recordable<T = any> = Record<string, T>
  // env list
  declare interface ViteEnv {
    VITE_PORT: number
    VITE_PROXY: [string, string][]
    VITE_PUBLIC_PATH: string
    VITE_DROP_CONSOLE: boolean
    VITE_HTTPS:boolean
  }
}
declare global {
  const appStore: typeof import('@/store')['appStore']
  const userStore: typeof import('@/store')['userStore']
}
