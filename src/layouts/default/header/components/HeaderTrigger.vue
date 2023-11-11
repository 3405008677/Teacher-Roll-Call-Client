<template>
  <el-icon class="h-48px!" size="18" @click="appStore.setCollapseAside(!appStore.isCollapseAside)">
    <Expand v-if="appStore.isCollapseAside" />
    <Fold v-else />
  </el-icon>
</template>
<script lang="ts" setup>
  import { appStore } from '@/store'
</script>

<style lang="scss"></style>
