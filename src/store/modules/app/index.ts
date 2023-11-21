export interface AppState {
  isCollapseAside: boolean
  collapseTitle: string
  title: string
}
import { defineStore } from 'pinia'
export default defineStore('app', {
  state: (): AppState => {
    return {
      isCollapseAside: false, // 是否隐藏侧导航
      collapseTitle: import.meta.env.VITE_GLOB_APP_TITLE,
      title: '主页',
    }
  },
  actions: {
    setCollapseAside(params: boolean) {
      this.isCollapseAside = params
    },
    setTitle(params: string) {
      this.title = params
    },
  },
})
