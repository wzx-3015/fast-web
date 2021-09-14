<!--
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-03 15:10:14
 * @LastEditTime: 2021-09-03 17:29:29
 * @LastEditors: @Xin (834529118@qq.com)
-->
<script>
import { defineAsyncComponent, ref } from 'vue'
import axios from 'axios'
export default {
  components: {
    asyncComp: defineAsyncComponent(() => import('/dist/vite-vue.iife.js'))
  },
  setup () {
    const show = ref('')

    const script = document.createElement('script')
    script.src = 'http://192.168.10.146:8055/dist/my-lib.umd.js'

    script.onload = e => {
      console.log(window.MyLib)
      show.value = window.MyLib
    }

    return {
      show
    }
  }
}

</script>

<template>
<button @click="show = true">点击</button>
<component :is="show" name="======="></component>
  <a href="#">sdfdsf</a>
</template>

<style scoped lang="less">
a {
  color: #42b983;
}
</style>
