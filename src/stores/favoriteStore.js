import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref([])
  
  const favoriteColors = computed(() => favorites.value || [])
  
  const isFavorite = (hex) => {
    return (favorites.value || []).some(color => color.hex === hex)
  }
  
  const toggleFavorite = (color) => {
    if (!favorites.value) {
      favorites.value = []
    }
    
    const index = favorites.value.findIndex(fav => fav.hex === color.hex)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push({
        ...color,
        addedAt: new Date().toISOString()
      })
    }
    
    // 保存到本地存储
    saveFavoritesToStorage()
  }
  
  const initializeFavorites = () => {
    try {
      const stored = localStorage.getItem('fashion-color-favorites')
      if (stored) {
        favorites.value = JSON.parse(stored)
      } else {
        favorites.value = []
      }
    } catch (error) {
      console.error('收藏数据加载失败:', error)
      favorites.value = []
    }
  }
  
  const saveFavoritesToStorage = () => {
    try {
      localStorage.setItem('fashion-color-favorites', JSON.stringify(favorites.value))
    } catch (error) {
      console.error('收藏数据保存失败:', error)
    }
  }
  
  const clearAllFavorites = () => {
    favorites.value = []
    saveFavoritesToStorage()
  }
  
  return {
    favorites,
    favoriteColors,
    isFavorite,
    toggleFavorite,
    initializeFavorites,
    clearAllFavorites
  }
})