import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
 },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    federation({
      //定义模块服务名称
      name: "remoteReactComponents",
      //build后的入口文件
      filename: "remoteEntry.js",
      //需要暴露的组件
      exposes: {
        "./Home": "./src/views/HomeView.vue",
        "./About": "./src/views/AboutView.vue",
      },
      remotes: {
        //vue 组件的远程模块
        remoteWrap: "http://localhost:4174/assets/remoteEntry.js",
      },
      //声明共享的依赖库
      shared: ['vue', 'vue-router']
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
