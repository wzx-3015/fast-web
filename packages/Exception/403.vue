<!--
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-06 17:53:11
 * @LastEditTime: 2021-09-15 17:06:10
 * @LastEditors: @Xin (834529118@qq.com)
-->
<template>
  <div class="exception403">
    <div class="exception403-content">
      <img class="img" draggable="false" src="./assets/403.png" alt="" />
      <p class="title">403 {{ tipData.text }}</p>
      <el-button type="primary" size="medium" @click="handleLogin">
        {{ tipData.btnText }}
      </el-button>
    </div>
  </div>
</template>
<script>
// import { openLoginPage } from '@/utils/index'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  props: {
    a: Boolean,
  },
  setup() {
    const { origin } = window.location

    const route = useRoute()
    const router = useRouter()

    const tipData = computed(() => {
      const voidStatus = route.query.voidStatus
      const voidBoolean = !!(voidStatus && voidStatus === '1')
      return {
        text: voidBoolean ? '请前往权限平台配置权限!' : '无权限-请登录使用!',
        btnText: voidBoolean ? '首页' : '登录',
        voidBoolean,
      }
    })

    const handleLogin = () => {
      if (tipData.value.voidBoolean) {
        router.replace({ path: '/' })
        return
      }
      // openLoginPage(`${origin}`)
    }

    return {
      handleLogin,
      tipData,
    }
  },
}
</script>
<style scoped lang="less">
.exception403 {
  text-align: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  .exception403-content {
    min-width: 299px;
    height: 320px;
    color: #12aef1;
    text-align: center;
    .img {
      max-width: 299px;
      max-height: 308px;
    }
    .title {
      font-weight: 700;
      font-size: 24px;
      letter-spacing: 2px;
    }
    .two-title {
      font-size: 12px;
      margin-top: 10px;
    }
  }
}
</style>
