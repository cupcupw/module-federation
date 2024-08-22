<template>
  <el-container class="wrap">
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">
        <button @click="$router.push('/sub-child')">sub-child</button>
        <button @click="$router.push('/sub-child2')">sub-child2</button>
      </el-aside>
      <el-main @click="handleJump">
        <!-- <remoteVueBtn></remoteVueBtn> -->
        <RouterView/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { createApp, defineAsyncComponent, onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const route = useRouter()

const handleJump = () => {
  route.push('/about')
}

onMounted(()=>{
  // const remoteVueBtn = import("remoteVueComponents/App").then((remoteVueBtn)=>{
  //   remoteVueBtn('#app2')
  // })
  // remoteVueBtn('#app2')
  // const app2 = createApp(remoteVueBtn)
  // app2.mount('#app2')
  // console.log('remoteVueBtn =>' , remoteVueBtn );
})

</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>

