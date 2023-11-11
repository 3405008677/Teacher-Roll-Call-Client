<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbArr"
      :key="index"
      :to="{ path: item.path }"
    >
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts" setup>
  const route = useRoute()
  const breadcrumbArr = computed(() => route.matched)
</script>

<style lang="scss"></style>
