<template>
  <div 
    class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
    :class="{ 'ring-2 ring-blue-500': isSelected }"
  >
    <div class="flex items-center space-x-4">
      <!-- 颜色预览 -->
      <div class="flex-shrink-0">
        <div 
          class="w-12 h-12 rounded-lg border-2 border-gray-100 shadow-sm cursor-pointer transition-transform hover:scale-105"
          :style="{ backgroundColor: color.hex }"
          @click="showColorDetail"
        ></div>
      </div>
      
      <!-- 颜色信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2 mb-1">
          <h3 class="text-lg font-medium text-gray-900 truncate">{{ color.chinese }}</h3>
          <span class="text-sm text-gray-500">{{ color.english }}</span>
        </div>
        
        <div class="flex items-center space-x-4 text-sm text-gray-600 mb-2">
          <span class="font-mono font-medium">{{ color.hex }}</span>
          <span class="px-2 py-1 bg-gray-100 rounded text-xs">{{ color.category }}</span>
          <span v-if="color.guofeng" class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
            国风 · {{ color.guofeng }}
          </span>
        </div>
        
        <!-- RGB 和 CMYK 值 -->
        <div class="flex items-center space-x-6 text-xs text-gray-500">
          <div>
            <span class="font-medium">RGB:</span>
            <span>{{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }}</span>
          </div>
          <div>
            <span class="font-medium">CMYK:</span>
            <span>{{ color.cmyk.c }}%, {{ color.cmyk.m }}%, {{ color.cmyk.y }}%, {{ color.cmyk.k }}%</span>
          </div>
          <div v-if="color.pantone">
            <span class="font-medium">Pantone:</span>
            <span>{{ color.pantone }}</span>
          </div>
        </div>
        
        <!-- 标签 -->
        <div v-if="color.tags && color.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
          <span 
            v-for="tag in displayTags" 
            :key="tag"
            class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
          >
            {{ tag }}
          </span>
          <button 
            v-if="color.tags.length > maxDisplayTags"
            @click="showAllTags = !showAllTags"
            class="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs hover:bg-gray-100 transition-colors"
          >
            {{ showAllTags ? '收起' : `+${color.tags.length - maxDisplayTags}` }}
          </button>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex-shrink-0 flex items-center space-x-2">
        <!-- 复制按钮 -->
        <button
          @click="copyHex"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
          title="复制HEX值"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>
        
        <!-- 选择按钮 -->
        <button
          v-if="selectable"
          @click="toggleSelection"
          :class="[
            'p-2 rounded-md transition-colors',
            isSelected 
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          ]"
          :title="isSelected ? '取消选择' : '选择颜色'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
        
        <!-- 取消收藏按钮 -->
        <button
          @click="removeFavorite"
          class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="取消收藏"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        </button>
        
        <!-- 更多操作菜单 -->
        <div class="relative">
          <button
            @click="showMenu = !showMenu"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            title="更多操作"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
          
          <!-- 下拉菜单 -->
          <div 
            v-if="showMenu"
            class="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          >
            <button
              @click="exportColor"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              导出颜色数据
            </button>
            <button
              @click="shareColor"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              分享颜色
            </button>
            <button
              @click="viewSimilar"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              查看相似颜色
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 收藏时间 -->
    <div v-if="favoriteDate" class="mt-3 pt-3 border-t border-gray-100">
      <p class="text-xs text-gray-500">
        收藏于 {{ formatDate(favoriteDate) }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'

export default {
  name: 'FavoriteColorRow',
  props: {
    color: {
      type: Object,
      required: true
    },
    selectable: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    favoriteDate: {
      type: String,
      default: ''
    }
  },
  emits: ['click', 'remove', 'select', 'detail'],
  setup(props, { emit }) {
    const favoriteStore = useFavoriteStore()
    
    const showMenu = ref(false)
    const showAllTags = ref(false)
    const maxDisplayTags = ref(3)
    
    // 计算显示的标签
    const displayTags = computed(() => {
      if (!props.color.tags) return []
      if (showAllTags.value) return props.color.tags
      return props.color.tags.slice(0, maxDisplayTags.value)
    })
    
    // 方法
    const copyHex = async () => {
      try {
        await navigator.clipboard.writeText(props.color.hex)
        // 这里可以添加Toast提示
        console.log('HEX值已复制到剪贴板')
      } catch (err) {
        console.error('复制失败:', err)
      }
    }
    
    const toggleSelection = () => {
      emit('select', props.color)
    }
    
    const removeFavorite = () => {
      favoriteStore.removeFavoriteColor(props.color.hex)
      emit('remove', props.color)
    }
    
    const showColorDetail = () => {
      emit('detail', props.color)
    }
    
    const exportColor = () => {
      const colorData = {
        hex: props.color.hex,
        chinese: props.color.chinese,
        english: props.color.english,
        rgb: props.color.rgb,
        cmyk: props.color.cmyk,
        category: props.color.category,
        tags: props.color.tags,
        guofeng: props.color.guofeng,
        pantone: props.color.pantone
      }
      
      const dataStr = JSON.stringify(colorData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${props.color.chinese}_${props.color.hex}.json`
      link.click()
      
      URL.revokeObjectURL(url)
      showMenu.value = false
    }
    
    const shareColor = async () => {
      const shareData = {
        title: `颜色分享: ${props.color.chinese}`,
        text: `${props.color.chinese} (${props.color.english}) - ${props.color.hex}`,
        url: window.location.href
      }
      
      try {
        if (navigator.share) {
          await navigator.share(shareData)
        } else {
          await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`)
          console.log('分享内容已复制到剪贴板')
        }
      } catch (err) {
        console.error('分享失败:', err)
      }
      
      showMenu.value = false
    }
    
    const viewSimilar = () => {
      // 触发查看相似颜色事件
      emit('view-similar', props.color)
      showMenu.value = false
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // 点击外部关闭菜单
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        showMenu.value = false
      }
    }
    
    // 添加全局点击监听
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClickOutside)
    }
    
    return {
      showMenu,
      showAllTags,
      maxDisplayTags,
      displayTags,
      copyHex,
      toggleSelection,
      removeFavorite,
      showColorDetail,
      exportColor,
      shareColor,
      viewSimilar,
      formatDate
    }
  }
}
</script>

<style scoped>
/* 确保菜单在最上层 */
.relative {
  z-index: 10;
}

/* 菜单动画 */
.absolute {
  animation: fadeIn 0.1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 悬停效果 */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>