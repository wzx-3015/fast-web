/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-11 13:04:43
 * @LastEditTime: 2021-09-11 14:19:20
 * @LastEditors: @Xin (834529118@qq.com)
 */
import postcss from "rollup-plugin-postcss"
import vue from "rollup-plugin-vue"
import { terser } from "rollup-plugin-terser"

module.exports = [
  {
    input: '/packages/index.js',
    output: {
      file: 'lib/index.js',
    },
    plugins: [
      vue(),
      terser(),
      postcss()
    ]
  }
]
