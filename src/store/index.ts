import type { App } from 'vue'
import { createPinia } from 'pinia'

import app from './modules/app'
import user from './modules/user'

const pinia = createPinia()

const appStore = app(pinia),
  userStore = user(pinia)

export { appStore, userStore }

export function setupStore(app: App<Element>) {
  app.use(pinia)
}
