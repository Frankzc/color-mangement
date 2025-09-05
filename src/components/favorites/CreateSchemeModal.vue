<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <!-- 标题 -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">创建配色方案</h3>
        <button 
          @click="closeModal" 
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 表单 -->
      <form @submit.prevent="createScheme">
        <!-- 方案名称 -->
        <div class="mb-4">
          <label for="schemeName" class="block text-sm font-medium text-gray-700 mb-2">
            方案名称 <span class="text-red-500">*</span>
          </label>
          <input
            id="schemeName"
            v-model="formData.name"
            type="text"
            placeholder="请输入配色方案名称"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- 方案描述 -->
        <div class="mb-4">
          <label for="schemeDescription" class="block text-sm font-medium text-gray-700 mb-2">
            方案描述
          </label>
          <textarea
            id="schemeDescription"
            v-model="formData.description"
            rows="3"
            placeholder="描述这个配色方案的用途或特点"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <!-- 选择的颜色预览 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            选中的颜色 ({{ selectedColors.length }})
          </label>
          <div v-if="selectedColors.length > 0" class="space-y-2 max-h-32 overflow-y-auto">
            <div 
              v-for="color in selectedColors" 
              :key="color.hex"
              class="flex items-center space-x-3 p-2 bg-gray-50 rounded"
            >
              <div 
                class="w-8 h-8 rounded border border-gray-200 flex-shrink-0"
                :style="{ backgroundColor: color.hex }"
              ></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ color.chinese }}</p>
                <p class="text-xs text-gray-500">{{ color.hex }}</p>
              </div>
              <button 
                type="button"
                @click="removeColor(color.hex)"
                class="text-red-400 hover:text-red-600 transition-colors"
                title="移除颜色"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 bg-gray-50 rounded p-3 text-center">
            暂无选中的颜色，请先在颜色列表中选择颜色
          </div>
        </div>

        <!-- 方案标签 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            方案标签
          </label>
          <div class="flex flex-wrap gap-2 mb-2">
            <button
              v-for="tag in commonTags"
              :key="tag"
              type="button"
              @click="toggleTag(tag)"
              :class="[
                'px-3 py-1 text-xs rounded-full border transition-colors',
                formData.tags.includes(tag)
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ tag }}
            </button>
          </div>
          <input
            v-model="customTag"
            type="text"
            placeholder="添加自定义标签"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keypress.enter.prevent="addCustomTag"
          />
        </div>

        <!-- 按钮组 -->
        <div class="flex space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!canCreate"
            :class="[
              'flex-1 px-4 py-2 rounded-md transition-colors',
              canCreate
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            创建方案
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'

export default {
  name: 'CreateSchemeModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    selectedColors: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'created'],
  setup(props, { emit }) {
    const favoriteStore = useFavoriteStore()
    
    // 表单数据
    const formData = ref({
      name: '',
      description: '',
      tags: []
    })
    
    const customTag = ref('')
    
    // 常用标签
    const commonTags = ref([
      '商务风格',
      '时尚搭配',
      '温馨家居',
      '现代简约',
      '复古经典',
      '清新自然',
      '浪漫温馨',
      '高端奢华'
    ])
    
    // 计算属性
    const canCreate = computed(() => {
      return formData.value.name.trim() && props.selectedColors.length > 0
    })
    
    // 方法
    const closeModal = () => {
      emit('close')
      resetForm()
    }
    
    const removeColor = (hex) => {
      // 通知父组件移除颜色
      emit('color-removed', hex)
    }
    
    const toggleTag = (tag) => {
      const index = formData.value.tags.indexOf(tag)
      if (index > -1) {
        formData.value.tags.splice(index, 1)
      } else {
        formData.value.tags.push(tag)
      }
    }
    
    const addCustomTag = () => {
      const tag = customTag.value.trim()
      if (tag && !formData.value.tags.includes(tag)) {
        formData.value.tags.push(tag)
        customTag.value = ''
      }
    }
    
    const createScheme = () => {
      if (!canCreate.value) return
      
      const scheme = {
        id: Date.now().toString(),
        name: formData.value.name.trim(),
        description: formData.value.description.trim(),
        colors: [...props.selectedColors],
        tags: [...formData.value.tags],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // 添加到收藏存储
      favoriteStore.addColorScheme(scheme)
      
      // 通知父组件
      emit('created', scheme)
      
      // 关闭弹窗
      closeModal()
    }
    
    const resetForm = () => {
      formData.value = {
        name: '',
        description: '',
        tags: []
      }
      customTag.value = ''
    }
    
    // 监听弹窗显示状态
    watch(() => props.isVisible, (newVal) => {
      if (!newVal) {
        resetForm()
      }
    })
    
    return {
      formData,
      customTag,
      commonTags,
      canCreate,
      closeModal,
      removeColor,
      toggleTag,
      addCustomTag,
      createScheme
    }
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>