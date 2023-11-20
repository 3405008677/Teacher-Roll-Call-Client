<template>
  <div class="bg-red h100%" style="padding: 40px 80px">
    <div class="bg-green h100% relative b-rd-10px p-10px">
      <div> <TopVue /> </div>
      <div
        class="bg-blue h50% w50px absolute left--50px top-50% flex-c items-center color-#CCFFFF"
        style="transform: translateY(-50%); border-radius: 20% 0px 0px 20%"
      >
        <el-icon class="mb-20px hvr-wobble-vertical" size="30"><HomeFilled /></el-icon>
        <el-icon class="mb-20px hvr-wobble-vertical" size="30"><List /></el-icon>
        <el-icon class="mb-20px hvr-wobble-vertical" size="30"><MoreFilled /></el-icon>
        <el-icon class="hvr-wobble-vertical" size="30"><TrendCharts /></el-icon>
      </div>
      <div>
        <IndexVue />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import IndexVue from './index.vue'
  import TopVue from './top.vue'
</script>
<style lang="scss"></style>
