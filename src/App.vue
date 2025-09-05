// ===== src/App.vue =====
<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
    <!-- 全局加载器 -->
    <BaseLoading v-if="isLoading" :text="loadingText" />
    
    <!-- 主布局 -->
    <div v-else class="app-container">
      <!-- 导航栏 -->
      <MainNav v-if="!$route.meta.hideNavigation" />
      
      <!-- 路由视图 -->
      <main class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
      
      <!-- 全局提示 -->
      <BaseToast />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useColorStore } from './stores/colorStore'
import { useUiStore } from './stores/uiStore'
import MainNav from './components/navigation/MainNav.vue'
import BaseLoading from './components/common/BaseLoading.vue'
import BaseToast from './components/common/BaseToast.vue'

const colorStore = useColorStore()
const uiStore = useUiStore()
const isLoading = ref(true)
const loadingText = ref('正在加载颜色数据...')

onMounted(async () => {
  try {
    // 加载颜色数据
    loadingText.value = '正在加载颜色数据...'
    await colorStore.loadColors()
    
    // 初始化用户数据
    loadingText.value = '正在初始化用户数据...'
    await colorStore.initializeUserData()
    
  } catch (error) {
    console.error('应用初始化失败:', error)
    uiStore.showToast('应用加载失败，请刷新页面重试', 'error')
  } finally {
    // 确保加载动画至少显示1秒
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }
})
</script>

<style lang="scss">
// 全局样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  background-color: #f8fafc;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.main-content {
  padding-top: 2rem;
  padding-bottom: 2rem;
  min-height: calc(100vh - 80px);
}

// 滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
  
  &:hover {
    background: #94a3b8;
  }
}
</style>