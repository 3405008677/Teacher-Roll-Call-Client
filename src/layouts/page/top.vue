<template>
  <div class="flex items-center justify-between">
    <h1>标题</h1>
    <div class="flex items-center">
      <el-input
        v-model="inputText"
        class="w-50 m-2 rounded-6px shadowIcon"
        size="large"
        placeholder="Please Input"
        :prefix-icon="Search"
      />
      <p class="ml-10px bg-white flex! p-6px rounded-8px shadowIcon hvr-bob">
        <el-icon><Bell /></el-icon>
      </p>
      <p class="ml-10px bg-white flex! p-6px rounded-8px shadowIcon hvr-bob">
        <el-icon><Warning /></el-icon>
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  const inputText = ref('')
</script>
<style lang="scss"></style>
