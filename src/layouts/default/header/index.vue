<template>
  <div class="h-48px flex flex-items-center flex-justify-between b-b-solid b-b-#eee b-b-1px">
    <div class="flex flex-items-center">
      <HeaderTriggerVue />
      <LayoutBreadcrumbVue class="pl-10px" />
    </div>
    <div>
      <FullScreenVue />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { appStore } from '@/store'
  import HeaderTriggerVue from './components/HeaderTrigger.vue'
  import LayoutBreadcrumbVue from './components/LayoutBreadcrumb.vue'
  import FullScreenVue from './components/FullScreen.vue'
</script>
<style lang="scss"></style>
