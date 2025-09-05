// src/stores/colorStore.js
import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useColorStore = defineStore('color', () => {
  // 状态管理
  const colors = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // 搜索和筛选状态
  const searchQuery = ref('')
  const activeFilters = ref({
    category: '',
    tags: [],
    hasGuofeng: false
  })
  
  // 排序状态
  const sortBy = ref('name')
  const sortOrder = ref('asc')
  const currentSort = ref('name_asc')
  
  // 计算属性 - 过滤和排序后的颜色
  const filteredColors = computed(() => {
    let result = [...colors.value]
    
    // 1. 搜索过滤
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      result = result.filter(color => {
        return (
          (color.chinese && color.chinese.toLowerCase().includes(query)) ||
          (color.english && color.english.toLowerCase().includes(query)) ||
          (color.hex && color.hex.toLowerCase().includes(query)) ||
          (color.guofeng && color.guofeng.toLowerCase().includes(query))
        )
      })
    }
    
    // 2. 分类过滤
    if (activeFilters.value.category) {
      result = result.filter(color => color.category === activeFilters.value.category)
    }
    
    // 3. 标签过滤
    if (activeFilters.value.tags.length > 0) {
      result = result.filter(color => {
        if (!color.tags) return false
        return activeFilters.value.tags.some(tag => color.tags.includes(tag))
      })
    }
    
    // 4. 国风过滤
    if (activeFilters.value.hasGuofeng) {
      result = result.filter(color => {
        return color.guofeng && 
               color.guofeng !== null && 
               color.guofeng !== '' && 
               color.guofeng !== 'null'
      })
    }
    
    // 5. 排序
    result = sortColors(result, sortBy.value, sortOrder.value)
    
    return result
  })
  
  // 计算属性 - 统计信息
  const categories = computed(() => {
    const categorySet = new Set()
    colors.value.forEach(color => {
      if (color.category) {
        categorySet.add(color.category)
      }
    })
    return Array.from(categorySet).sort()
  })
  
  const allTags = computed(() => {
    const tagSet = new Set()
    colors.value.forEach(color => {
      if (color.tags && Array.isArray(color.tags)) {
        color.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  })
  
  const colorCount = computed(() => ({
    total: colors.value.length,
    filtered: filteredColors.value.length,
    withGuofeng: colors.value.filter(color => 
      color.guofeng && 
      color.guofeng !== 'null' && 
      color.guofeng !== null && 
      color.guofeng !== ''
    ).length
  }))
  
  // 数据加载
  const loadColors = async () => {
    if (colors.value.length > 0) {
      console.log('颜色数据已存在，跳过加载')
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      console.log('开始加载颜色数据...')
      const response = await fetch('/colors.json')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 无法加载颜色数据`)
      }
      
      const data = await response.json()
      
      if (!data || !Array.isArray(data.colors)) {
        throw new Error('颜色数据格式不正确')
      }
      
      // 处理颜色数据，添加计算属性
      colors.value = data.colors.map(color => enhanceColorData(color))
      
      console.log(`成功加载 ${colors.value.length} 个颜色`)
      
    } catch (err) {
      error.value = err.message
      console.error('颜色数据加载失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // 搜索功能
  const setSearchQuery = (query) => {
    searchQuery.value = query
    console.log('搜索查询设置为:', query)
  }
  
  // 筛选功能
  const setFilter = (filterType, value) => {
    console.log('设置筛选:', filterType, value)
    
    switch (filterType) {
      case 'category':
        activeFilters.value.category = activeFilters.value.category === value ? '' : value
        break
        
      case 'hasGuofeng':
        activeFilters.value.hasGuofeng = value
        break
        
      case 'tags':
        const tagIndex = activeFilters.value.tags.indexOf(value)
        if (tagIndex > -1) {
          activeFilters.value.tags.splice(tagIndex, 1)
        } else {
          activeFilters.value.tags.push(value)
        }
        break
        
      default:
        console.warn('未知的筛选类型:', filterType)
    }
  }
  
  const clearFilters = () => {
    activeFilters.value = {
      category: '',
      tags: [],
      hasGuofeng: false
    }
    searchQuery.value = ''
    console.log('已清除所有筛选条件')
  }
  
  // 排序功能
  const setSorting = (field, order = 'asc') => {
    console.log('设置排序:', field, order)
    sortBy.value = field
    sortOrder.value = order
    currentSort.value = `${field}_${order}`
  }
  
  const setSortOrder = (field, direction = 'asc') => {
    setSorting(field, direction)
  }
  
  const toggleSortOrder = () => {
    const newOrder = sortOrder.value === 'asc' ? 'desc' : 'asc'
    setSorting(sortBy.value, newOrder)
  }
  
  // 相似颜色查找
  const getSimilarColors = (targetColor, limit = 6, threshold = 0.6) => {
    if (!targetColor || !targetColor.hex) {
      console.warn('目标颜色无效')
      return []
    }
    
    const targetHSL = targetColor.hsl || hexToHSL(targetColor.hex)
    
    return colors.value
      .filter(color => color.hex !== targetColor.hex)
      .map(color => {
        const colorHSL = color.hsl || hexToHSL(color.hex)
        const similarity = calculateColorSimilarity(targetHSL, colorHSL)
        return { ...color, similarity }
      })
      .filter(color => color.similarity >= threshold * 100)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }
  
  // 配色方案生成
  const generateColorScheme = (baseColor, type = 'complementary') => {
    if (!baseColor || !baseColor.hex) {
      console.warn('基础颜色无效')
      return []
    }
    
    const baseHSL = baseColor.hsl || hexToHSL(baseColor.hex)
    const schemes = {
      complementary: [
        { ...baseHSL, h: (baseHSL.h + 180) % 360 }
      ],
      triadic: [
        { ...baseHSL, h: (baseHSL.h + 120) % 360 },
        { ...baseHSL, h: (baseHSL.h + 240) % 360 }
      ],
      analogous: [
        { ...baseHSL, h: (baseHSL.h + 30) % 360 },
        { ...baseHSL, h: (baseHSL.h - 30 + 360) % 360 }
      ],
      monochromatic: [
        { ...baseHSL, l: Math.min(100, baseHSL.l + 20) },
        { ...baseHSL, l: Math.max(0, baseHSL.l - 20) },
        { ...baseHSL, s: Math.min(100, baseHSL.s + 20) }
      ],
      tetradic: [
        { ...baseHSL, h: (baseHSL.h + 90) % 360 },
        { ...baseHSL, h: (baseHSL.h + 180) % 360 },
        { ...baseHSL, h: (baseHSL.h + 270) % 360 }
      ],
      splitComplementary: [
        { ...baseHSL, h: (baseHSL.h + 150) % 360 },
        { ...baseHSL, h: (baseHSL.h + 210) % 360 }
      ]
    }
    
    const schemeColors = schemes[type] || []
    return schemeColors.map(hsl => ({
      hex: hslToHex(hsl.h, hsl.s, hsl.l),
      hsl,
      role: `${type}_color`
    }))
  }
  
  // 返回的公共接口
  return {
    // 状态（只读）
    colors: readonly(colors),
    isLoading: readonly(isLoading),
    error: readonly(error),
    searchQuery: readonly(searchQuery),
    activeFilters: readonly(activeFilters),
    sortBy: readonly(sortBy),
    sortOrder: readonly(sortOrder),
    currentSort: readonly(currentSort),
    
    // 计算属性
    filteredColors,
    categories,
    allTags,
    colorCount,
    
    // 方法
    loadColors,
    setSearchQuery,
    setFilter,
    clearFilters,
    setSorting,
    setSortOrder,
    toggleSortOrder,
    getSimilarColors,
    generateColorScheme
  }
})

// 辅助函数
function enhanceColorData(color) {
  const hsl = rgbToHSL(color.rgb.r, color.rgb.g, color.rgb.b)
  const brightness = calculateBrightness(color.rgb.r, color.rgb.g, color.rgb.b)
  const contrast = getContrastColor(color.hex)
  
  return {
    ...color,
    hsl,
    brightness,
    contrast
  }
}

function sortColors(colors, field, order) {
  return colors.sort((a, b) => {
    let aValue, bValue
    
    switch (field) {
      case 'name':
        aValue = a.chinese || a.english || ''
        bValue = b.chinese || b.english || ''
        return order === 'asc' 
          ? aValue.localeCompare(bValue, 'zh-CN')
          : bValue.localeCompare(aValue, 'zh-CN')
      
      case 'hue':
        aValue = a.hsl?.h || 0
        bValue = b.hsl?.h || 0
        break
        
      case 'brightness':
        aValue = a.brightness || 0
        bValue = b.brightness || 0
        break
        
      case 'category':
        aValue = a.category || ''
        bValue = b.category || ''
        return order === 'asc' 
          ? aValue.localeCompare(bValue, 'zh-CN')
          : bValue.localeCompare(aValue, 'zh-CN')
      
      case 'random':
        return Math.random() - 0.5
        
      default:
        return 0
    }
    
    if (order === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })
}

function rgbToHSL(r, g, b) {
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

function hexToHSL(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)  
  const b = parseInt(hex.slice(5, 7), 16)
  return rgbToHSL(r, g, b)
}

function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  
  let r, g, b
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }
  
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

function calculateBrightness(r, g, b) {
  return Math.round((r * 299 + g * 587 + b * 114) / 1000)
}

function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

function calculateColorSimilarity(hsl1, hsl2) {
  const hDiff = Math.min(Math.abs(hsl1.h - hsl2.h), 360 - Math.abs(hsl1.h - hsl2.h))
  const sDiff = Math.abs(hsl1.s - hsl2.s)
  const lDiff = Math.abs(hsl1.l - hsl2.l)
  
  // 权重：色相最重要，饱和度次之，亮度最轻
  const similarity = 100 - (hDiff * 0.6 + sDiff * 0.25 + lDiff * 0.15)
  return Math.max(0, Math.min(100, similarity))
}