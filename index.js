/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-11 13:12:27
 * @LastEditTime: 2021-09-11 13:15:22
 * @LastEditors: @Xin (834529118@qq.com)
 */
import demo from './src/components/demo.vue'

demo.install = (app ) => {
  app.use(demo.name, demo)
}

export default demo;
