import { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { pathResolve } from './utils'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// element
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from "unocss/vite";

import mkcert from 'vite-plugin-mkcert'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()]
  vitePlugins.push(
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: pathResolve('types/AutoImportVue.d.ts'),
    }),
  )
  vitePlugins.push(
    Components({
      dts: pathResolve('types/AutoImportElement.d.ts'),
      resolvers: [ElementPlusResolver()],
    }),
  )
  vitePlugins.push(
    AutoImport({
      dts: pathResolve('types/AutoImportElement.d.ts'),
      resolvers: [ElementPlusResolver()],
    }),
  )
  vitePlugins.push(
    UnoCSS({
      configFile: "/build/uno.config.ts",
    }),
  )

  if(viteEnv.VITE_HTTPS){
    vitePlugins.push(mkcert() )
  }

  return vitePlugins
}
