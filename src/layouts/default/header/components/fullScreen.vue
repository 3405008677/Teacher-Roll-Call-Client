<template>
  <el-icon size="20" @click="setIsFull"><FullScreen /></el-icon>
</template>
<script lang="ts" setup>
  const setIsFull = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.children[0].requestFullscreen()
    }
  }
</script>
<style lang="scss"></style>
