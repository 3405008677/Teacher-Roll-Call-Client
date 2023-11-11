<template>
  <el-container class="h100vh bg-white">
    <el-aside class="w-auto!"><Aside class="h100%" /></el-aside>
    <el-container>
      <el-header class="no-padding h48px!"><Header /></el-header>
      <el-main><Main /></el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
  import Aside from './aside/index.vue'
  import Header from './header/index.vue'
  import Main from './main/index.vue'
</script>
<style lang="scss">
  // 此注释别删，有莫名的 bug + 别开 scoped
</style>
