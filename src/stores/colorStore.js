
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import chroma from 'chroma-js'

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
  const sortBy = ref('name')
  const sortOrder = ref('asc')
  
  // 计算属性
  const filteredColors = computed(() => {
    let result = [...colors.value]
    
    // 搜索筛选
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(color => 
        color.chinese.toLowerCase().includes(query) ||
        color.english.toLowerCase().includes(query) ||
        color.hex.toLowerCase().includes(query)
      )
    }
    
    // 分类筛选
    if (activeFilters.value.category) {
      result = result.filter(color => color.category === activeFilters.value.category)
    }
    
    // 标签筛选
    if (activeFilters.value.tags.length > 0) {
      result = result.filter(color => 
        activeFilters.value.tags.some(tag => color.tags && color.tags.includes(tag))
      )
    }
    
    // 修复国风筛选
    if (activeFilters.value.hasGuofeng === true) {
      result = result.filter(color => {
        return color.guofeng && 
               color.guofeng !== null && 
               color.guofeng !== '' && 
               color.guofeng !== 'null'
      })
    }
    
    // 排序
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy.value) {
        case 'name':
          comparison = a.chinese.localeCompare(b.chinese, 'zh-CN')
          break
        case 'hue':
          comparison = (a.hsl?.h || 0) - (b.hsl?.h || 0)
          break
        case 'brightness':
          comparison = (a.brightness || 0) - (b.brightness || 0)
          break
        case 'saturation':
          comparison = (a.hsl?.s || 0) - (b.hsl?.s || 0)
          break
        case 'lightness':
          comparison = (a.hsl?.l || 0) - (b.hsl?.l || 0)
          break
        default:
          comparison = 0
      }
      
      return sortOrder.value === 'desc' ? -comparison : comparison
    })
    
    return result
  })
  
  const categories = computed(() => {
    const categorySet = new Set(colors.value.map(color => color.category))
    return Array.from(categorySet).sort()
  })
  
  const allTags = computed(() => {
    const tagSet = new Set()
    colors.value.forEach(color => {
      if (color.tags) {
        color.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  })
  
  const colorCount = computed(() => ({
    total: colors.value.length,
    filtered: filteredColors.value.length,
    withGuofeng: colors.value.filter(c => c.guofeng && c.guofeng !== 'null').length
  }))
  
  // 动作
  const loadColors = async () => {
    isLoading.value = true
    try {
      const response = await fetch('/colors.json')
      if (!response.ok) {
        throw new Error('颜色数据加载失败')
      }
      const data = await response.json()
      
      // 为每个颜色添加计算属性
      colors.value = data.colors.map(color => ({
        ...color,
        hsl: rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b),
        brightness: getBrightness(color.rgb.r, color.rgb.g, color.rgb.b),
        contrast: getContrastColor(color.hex)
      }))
      
      console.log(`✅ 加载了 ${colors.value.length} 个颜色`)
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
  
  // 修复相似色查找
  const getSimilarColors = (targetColor, limit = 6) => {
    if (!targetColor.hsl) return []
    
    return colors.value
      .filter(color => color.hex !== targetColor.hex)
      .map(color => ({
        ...color,
        similarity: calculateColorSimilarity(targetColor, color)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }
  
  // 生成配色方案
  const generateColorScheme = (baseColor, type = 'complementary') => {
    const baseChroma = chroma(baseColor.hex)
    const schemes = {
      complementary: [baseChroma.set('hsl.h', '+180')],
      triadic: [
        baseChroma.set('hsl.h', '+120'), 
        baseChroma.set('hsl.h', '+240')
      ],
      analogous: [
        baseChroma.set('hsl.h', '+30'), 
        baseChroma.set('hsl.h', '-30')
      ],
      monochromatic: [
        baseChroma.set('hsl.l', '+0.2'),
        baseChroma.set('hsl.l', '-0.2'),
        baseChroma.set('hsl.s', '+0.2')
      ]
    }
    
    return schemes[type]?.map(color => ({ hex: color.hex() })) || []
  }
  
  return {
    colors,
    isLoading,
    searchQuery,
    activeFilters,
    sortBy,
    sortOrder,
    filteredColors,
    categories,
    allTags,
    colorCount,
    loadColors,
    setSearchQuery,
    setFilter,
    clearFilters,
    setSorting,
    toggleSortOrder,
    getSimilarColors,
    generateColorScheme
  }
})

// 辅助函数
function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function getBrightness(r, g, b) {
  return Math.round((r * 299 + g * 587 + b * 114) / 1000)
}

function getContrastColor(hex) {
  const color = chroma(hex)
  return color.luminance() > 0.5 ? '#000000' : '#FFFFFF'
}

function calculateColorSimilarity(color1, color2) {
  if (!color1.hsl || !color2.hsl) return 0
  
  const hDiff = Math.abs(color1.hsl.h - color2.hsl.h)
  const sDiff = Math.abs(color1.hsl.s - color2.hsl.s)
  const lDiff = Math.abs(color1.hsl.l - color2.hsl.l)
  
  // 色相差异权重最高
  const similarity = 100 - (hDiff * 0.6 + sDiff * 0.2 + lDiff * 0.2)
  return Math.max(0, similarity)
}