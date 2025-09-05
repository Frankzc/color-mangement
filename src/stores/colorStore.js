// ===== src/stores/colorStore.js =====
//import { defineStore } from 'pinia'
//import { ref, computed } from 'vue'
//import { loadColorsData, searchColors, filterColors, sortColors } from '@utils/colorUtils'

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { loadColorsData, searchColors, filterColors, sortColors } from '../utils/colorUtils'

export const useColorStore = defineStore('color', () => {
  // 状态
  const colors = ref([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const activeFilters = ref({
    category: '',
    tags: [],
    hasGuofeng: false
  })
  const sortBy = ref('name') // name, hue, brightness
  const sortOrder = ref('asc') // asc, desc
  
  // 计算属性
  const filteredColors = computed(() => {
    let result = colors.value
    
    // 搜索筛选
    if (searchQuery.value) {
      result = searchColors(result, searchQuery.value)
    }
    
    // 分类筛选
    result = filterColors(result, activeFilters.value)
    
    // 排序
    return sortColors(result, sortBy.value, sortOrder.value)
  })
  
  const categories = computed(() => {
    const categorySet = new Set(colors.value.map(color => color.category))
    return Array.from(categorySet).sort()
  })
  
  const allTags = computed(() => {
    const tagSet = new Set()
    colors.value.forEach(color => {
      color.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })
  
  const colorCount = computed(() => ({
    total: colors.value.length,
    filtered: filteredColors.value.length,
    withGuofeng: colors.value.filter(c => c.guofeng).length
  }))
  
  // 动作
  const loadColors = async () => {
    isLoading.value = true
    try {
      const data = await loadColorsData()
      colors.value = data.colors
      console.log(`✅ 加载了 ${data.colors.length} 个颜色`)
    } catch (error) {
      console.error('❌ 颜色数据加载失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }
  
  const setFilter = (filterType, value) => {
    if (filterType === 'tags') {
      const index = activeFilters.value.tags.indexOf(value)
      if (index > -1) {
        activeFilters.value.tags.splice(index, 1)
      } else {
        activeFilters.value.tags.push(value)
      }
    } else {
      activeFilters.value[filterType] = value
    }
  }
  
  const clearFilters = () => {
    activeFilters.value = {
      category: '',
      tags: [],
      hasGuofeng: false
    }
    searchQuery.value = ''
  }
  
  const setSorting = (field, order = 'asc') => {
    sortBy.value = field
    sortOrder.value = order
  }
  
  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  
  const getColorById = (hex) => {
    return colors.value.find(color => color.hex.toLowerCase() === hex.toLowerCase())
  }
  
  const getSimilarColors = (targetColor, limit = 6) => {
    // 这里可以实现颜色相似度算法
    return colors.value.slice(0, limit)
  }
  
  const initializeUserData = async () => {
    // 初始化用户相关数据
    // 例如：恢复搜索历史、用户偏好等
  }
  
  return {
    // 状态
    colors: readonly(colors),
    isLoading: readonly(isLoading),
    searchQuery: readonly(searchQuery),
    activeFilters: readonly(activeFilters),
    sortBy: readonly(sortBy),
    sortOrder: readonly(sortOrder),
    
    // 计算属性
    filteredColors,
    categories,
    allTags,
    colorCount,
    
    // 动作
    loadColors,
    setSearchQuery,
    setFilter,
    clearFilters,
    setSorting,
    toggleSortOrder,
    getColorById,
    getSimilarColors,
    initializeUserData
  }
})