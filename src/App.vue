<template>
  <div id="app" class="app">
    <!-- 主导航 -->
    <MainNav />
    
    <!-- 主要内容区域 -->
    <main class="app-main">
      <!-- 全局加载状态 -->
      <BaseLoading 
        v-if="uiStore.isLoading" 
        :text="uiStore.loadingText" 
        overlay 
      />
      
      <!-- 路由视图 -->
      <RouterView v-slot="{ Component, route }">
        <Transition 
          :name="route.meta.transition || 'fade'" 
          mode="out-in"
        >
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    
    <!-- Toast 消息容器 -->
    <ToastContainer />
    
    <!-- 颜色详情模态框 -->
    <ColorDetailModal 
      v-if="uiStore.modals.colorDetail.visible"
      :color="uiStore.modals.colorDetail.color"
      @close="uiStore.hideColorDetail"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import MainNav from '@/components/navigation/MainNav.vue'
import BaseLoading from '@/components/common/BaseLoading.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import ColorDetailModal from '@/components/color/ColorDetailModal.vue'
import { useUIStore } from '@/stores/uiStore'
import { useColorStore } from '@/stores/colorStore'
import { useUserStore } from '@/stores/userStore'

const uiStore = useUIStore()
const colorStore = useColorStore()
const userStore = useUserStore()

onMounted(async () => {
  try {
    console.log('开始应用初始化...')
    
    // 初始化 UI 设置
    uiStore.initializeUI()
    
    // 恢复用户会话（如果需要）
    if (userStore.restoreSession) {
      await userStore.restoreSession()
    }
    
    // 加载颜色数据
    await colorStore.loadColors()
    
    console.log('应用初始化完成')
  } catch (error) {
    console.error('应用初始化失败:', error)
    uiStore.showError('应用初始化失败，请刷新页面重试')
  }
})
</script>

<style lang="scss">
// 全局样式重置
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #111827;
  background-color: #f8fafc;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

// 应用布局
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  position: relative;
}

// 路由过渡动画
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
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 响应式辅助类
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 640px) {
    padding: 0 0.75rem;
  }
}

// 工具类
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f3f4;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
  
  &:hover {
    background: #9ca3af;
  }
}

// 焦点样式
:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

// 选择文本样式
::selection {
  background: #dbeafe;
  color: #1e40af;
}

// 暗色主题支持
[data-theme='dark'] {
  .app {
    background: #111827;
    color: #f9fafb;
  }
  
  .app-main {
    background: #111827;
  }
}

// 打印样式
@media print {
  .main-nav,
  .toast-container {
    display: none !important;
  }
  
  .app-main {
    padding: 0;
  }
}
</style>