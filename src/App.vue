<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { useFavoriteStore } from '@stores/favoriteStore'

const colorStore = useColorStore()
const favoriteStore = useFavoriteStore()

onMounted(async () => {
  try {
    console.log('🚀 应用初始化开始...')
    
    // 初始化收藏存储
    favoriteStore.initializeFavorites()
    
    // 加载颜色数据
    await colorStore.loadColors()
    
    console.log('✅ 应用初始化完成')
  } catch (error) {
    console.error('❌ 应用初始化失败:', error)
  }
})
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>