/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-03 11:00:24
 * @LastEditTime: 2021-09-14 18:25:27
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/',
  server: {
    proxy: {
      '/rest': {
        target: 'http://192.168.11.144:8801',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/rest/, '')
      }
    },
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'packages/index.js'),
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`
    },
    minify: false,
    // rollupOptions: {
    //   // 请确保外部化那些你的库中不需要的依赖
    //   external: ['vue'],
    // }
  }
})
