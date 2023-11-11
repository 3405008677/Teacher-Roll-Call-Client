<template>
  <template v-if="data.children">
    <el-sub-menu :index="data.name">
      <template #title>
        <el-icon>
          <component :is="data.meta.icon" />
        </el-icon>
        <span>{{ data.meta.title }}</span>
      </template>
      <template v-for="item in data.children" :key="item.name">
        <recursionMy :data="item" />
      </template>
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="data.name" router>
      <el-icon>
        <component :is="data.meta.icon" />
      </el-icon>
      <span>{{ data.meta.title }}</span>
    </el-menu-item>
  </template>
</template>
<script lang="ts" setup>
  import recursionMy from './asideMenuItem.vue'
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  })
  const { data } = toRefs(props)
</script>
<style lang="scss"></style>
