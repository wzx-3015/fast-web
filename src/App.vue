<!--
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-03 15:10:14
 * @LastEditTime: 2021-09-15 10:25:02
 * @LastEditors: @Xin (834529118@qq.com)
-->
<script setup>
// import { duseStore } from '../packages/index'
// console.log(duseStore())
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import vueDraggableNext from '../lib/vue-draggable-next/index'
// import { get } from './request.js'


// const demo = async () => {
//   console.log('await==================')
//   const res = await get('/shopping/algorithm/application/scene/list', { id: 1 })

//   console.log('await==================', res)
// }

// demo()

// get('/shopping/algorithm/application/scene/list', { time: Date.now(), id: 1 }).then(res => {
//   console.log('two-then', res)
// }).catch(err => {
//   console.log('two-catch', err)
// })
</script>

<template>
  <router-view></router-view>
</template>

<style>
#app { 
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.parent{
  height: 400px;
  width: 400px;
  background-color: #2c3e50;
}
</style>
