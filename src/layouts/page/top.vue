<template>
  <div class="flex items-center justify-between">
    <h1>{{ appStore.title }}</h1>
    <div class="flex items-center">
      <el-input
        v-model="inputText"
        class="w-50 m-2 rounded-6px shadowIcon"
        size="large"
        placeholder="Please Input"
        :prefix-icon="Search"
      />
      <p class="ml-16px bg-white flex! p-6px rounded-8px shadowIcon hvr-bob">
        <el-icon size="22"><Bell /></el-icon>
      </p>
      <p class="ml-16px bg-white flex! p-6px rounded-8px shadowIcon hvr-bob">
        <el-icon size="22"><Warning /></el-icon>
      </p>
      <el-dropdown>
        <img class="ml-16px w-40px h-40px border-rd-10px" :src="avatarImgUrl" alt="" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="b" @click="userStore.logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import { userStore, appStore } from '@/store'
  const inputText = ref('')
  const avatarImgUrl = ref('/avatar/1.jpg')
</script>
<style lang="scss" scoped>
  :deep(.el-input__wrapper) {
    box-shadow: none !important;
  }
</style>
