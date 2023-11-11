<template>
  <el-menu
    style="border: none"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :default-active="route.path"
    text-color="#fff"
    :collapse="appStore.isCollapseAside"
    router
  >
    <div class="p10px flex flex-items-center w-210px">
      <img class="h28px" :src="menuImageSrc" alt="" />
      <p v-show="!appStore.isCollapseAside" class="pl color-000 text-white fw700 lh-28px">
        {{ appStore.collapseTitle }}
      </p>
    </div>
    <template v-for="item in userStore.routerList" :key="item.name">
      <asideMenuItemVue :data="item" />
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
  import asideMenuItemVue from './asideMenuItem.vue'
  import { appStore, userStore } from '@/store'
  const menuImageSrc = import.meta.env.VITE_GLOB_APP_IMAGE
  const route = useRoute()
</script>

<style scoped></style>
