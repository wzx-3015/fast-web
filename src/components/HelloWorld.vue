<!--
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-03 15:10:14
 * @LastEditTime: 2021-09-06 10:11:42
 * @LastEditors: @Xin (834529118@qq.com)
-->
<script>
import { defineComponent, markRaw, ref } from 'vue'
import axios from 'axios'
export default {
  components: {
    // asyncComp: defineAsyncComponent(() => import('/dist/vite-vue.iife.js'))
  },
  setup () {
    const show = ref({})

    // const script = document.createElement('script')
    // script.src = 'http://192.168.10.146:8055/dist/my-lib.umd.js'

    axios.get('/dist/my-lib.iife.js ').then(res => {
      const demo = new Function(`return ${res.data}`)

      console.log(res)
      // console.log(demo())
      // console.log(show)
      // show.value = defineComponent(window.MyLib)

      // console.log(show.value)
    })

    // script.onload = e => {
    //   show.value = window.MyLib
    // }

    // document.head.appendChild(script)

    return {
      show
    }
  }
}

</script>

<template>
<component :is="show" name="========"></component>
</template>

<style scoped lang="less">
a {
  color: #42b983;
}
*{
  color: #fff;
}
</style>
