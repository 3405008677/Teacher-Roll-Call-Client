import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import { createProxy } from './build/proxy'
import { wrapperEnv } from './build/utils'
import { createVitePlugins } from './build/plugin'
import { pathResolve } from './build/utils'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  // 加载 vite 的环境变量 env
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)
  const isBuild = command === 'build'
  return {
    base: viteEnv.VITE_PUBLIC_PATH, //公共路径
    root, //项目根目录
    resolve: {
      alias: [
        { find: /@\//, replacement: pathResolve('src') + '/' },
        { find: /#\//, replacement: pathResolve('types') + '/' },
      ],
    },
    css: {
      // 适合只引入scss变量，不适合全局样式
      preprocessorOptions: {
        // scss: { additionalData: '@import "@/style/index.scss";' },
      },
    },
    server: {
      host: true,
      port: viteEnv.VITE_PORT,
      proxy: createProxy(viteEnv.VITE_PROXY),
      strictPort: false,
    },
    esbuild: {
      drop: viteEnv.VITE_DROP_CONSOLE ? ['console', 'debugger'] : [], //删除所有的console和debugger
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'src/js/[name]-[hash].js',
          assetFileNames: 'src/css/[name].css',
        },
      },
      assetsDir: 'src/assets/',
      target: 'modules',
      outDir: 'dist',
      // 是否复制Public文件
      copyPublicDir: true,
      // 构建时清空该目录
      emptyOutDir: true,
      //启用gzip压缩大小报告-关闭可能会提高大型项目构建性能
      reportCompressedSize: false,
      minify: 'esbuild', //混淆器
      sourcemap: false,
      //规定触发警告的 chunk 大小（以 kbs 为单位）
      chunkSizeWarningLimit: 2000,
    },
    plugins: createVitePlugins(viteEnv, isBuild),
  }
}
