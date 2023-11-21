<template>
  <div id="main" class="h100%" style="padding: 40px 80px">
    <div
      class="h100% flex flex-col relative b-rd-10px p-10px"
      style="background-color: rgba(246, 246, 246, 0.7)"
    >
      <div> <TopVue /> </div>
      <div
        class="h50% w50px absolute left--50px top-50% flex-c items-center color-#CCFFFF"
        style="
          transform: translateY(-50%);
          border-radius: 20% 0px 0px 20%;
          background-color: rgba(206, 221, 226, 0.7);
        "
      >
        <el-icon class="mb-20px hvr-wobble-vertical" size="30" @click="$router.push('jurisdiction')"
          ><HomeFilled
        /></el-icon>
        <el-icon class="mb-20px hvr-wobble-vertical" size="30"><List /></el-icon>
        <el-icon class="mb-20px hvr-wobble-vertical" size="30"><MoreFilled /></el-icon>
        <el-icon class="hvr-wobble-vertical" size="30"><TrendCharts /></el-icon>
      </div>
      <el-divider class="mt-10px! mb-10px!" border-style="double" style="border-top: 1px solid #90a2c7" />
      <div id="container" class="flex-1">
        <IndexVue />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import IndexVue from './index.vue'
  import TopVue from './top.vue'
</script>
<style lang="scss" scoped>
  #main {
    background: url('/public/images/bg.png');
  }
  #container {
    height: calc(100% - 110px);
  }
</style>
