// ===== src/stores/favoriteStore.js =====
import { defineStore } from 'pinia'
import { ref, computed , readonly} from 'vue' 
import { useLocalStorage } from '@vueuse/core'

export const useFavoriteStore = defineStore('favorite', () => {
  // 使用本地存储持久化数据
  const favoriteColors = useLocalStorage('fashion_color_favorites', [])
  const colorSchemes = useLocalStorage('fashion_color_schemes', [])
  const currentScheme = ref(null)
  
  // 计算属性
  const favoriteCount = computed(() => favoriteColors.value.length)
  const schemeCount = computed(() => colorSchemes.value.length)
  
  // 检查颜色是否已收藏
  const isFavorite = (hex) => {
    return favoriteColors.value.some(color => color.hex === hex)
  }
  
  // 动作
  const addToFavorites = (color) => {
    if (!isFavorite(color.hex)) {
      favoriteColors.value.push({
        ...color,
        addedAt: new Date().toISOString()
      })
    }
  }
  
  const removeFromFavorites = (hex) => {
    const index = favoriteColors.value.findIndex(color => color.hex === hex)
    if (index > -1) {
      favoriteColors.value.splice(index, 1)
    }
  }
  
  const toggleFavorite = (color) => {
    if (isFavorite(color.hex)) {
      removeFromFavorites(color.hex)
    } else {
      addToFavorites(color)
    }
  }
  
  const createScheme = (name, colors, description = '') => {
    const scheme = {
      id: Date.now().toString(),
      name,
      colors,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    colorSchemes.value.push(scheme)
    return scheme
  }
  
  const updateScheme = (id, updates) => {
    const index = colorSchemes.value.findIndex(scheme => scheme.id === id)
    if (index > -1) {
      colorSchemes.value[index] = {
        ...colorSchemes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }
  
  const deleteScheme = (id) => {
    const index = colorSchemes.value.findIndex(scheme => scheme.id === id)
    if (index > -1) {
      colorSchemes.value.splice(index, 1)
    }
  }
  
  const setCurrentScheme = (scheme) => {
    currentScheme.value = scheme
  }
  
  const clearFavorites = () => {
    favoriteColors.value = []
  }
  
  const exportData = () => {
    return {
      favorites: favoriteColors.value,
      schemes: colorSchemes.value,
      exportedAt: new Date().toISOString()
    }
  }
  
  const importData = (data) => {
    if (data.favorites) {
      favoriteColors.value = data.favorites
    }
    if (data.schemes) {
      colorSchemes.value = data.schemes
    }
  }
  
  return {
    // 状态
    favoriteColors: readonly(favoriteColors),
    colorSchemes: readonly(colorSchemes),
    currentScheme: readonly(currentScheme),
    
    // 计算属性
    favoriteCount,
    schemeCount,
    
    // 动作
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    createScheme,
    updateScheme,
    deleteScheme,
    setCurrentScheme,
    clearFavorites,
    exportData,
    importData
  }
})