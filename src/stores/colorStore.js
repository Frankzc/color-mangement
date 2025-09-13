// src/stores/colorStore.js - 修复排序功能
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useColorStore = defineStore('color', () => {
  // ===== 状态 =====
  const colors = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const activeFilters = ref({
    category: '',
    tags: [],
    hasGuofeng: false
  })
  
  // 排序状态
  const sortBy = ref('name')
  const sortOrder = ref('asc')
  
  // ===== 计算属性 =====
  const categories = computed(() => {
    const cats = new Set()
    colors.value.forEach(color => {
      if (color.category) cats.add(color.category)
    })
    return Array.from(cats).sort()
  })
  
  const allTags = computed(() => {
    const tags = new Set()
    colors.value.forEach(color => {
      if (color.tags && Array.isArray(color.tags)) {
        color.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  })
  
  // RGB转HSL计算函数
  const rgbToHsl = (r, g, b) => {
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
  
  // 计算亮度
  const calculateBrightness = (r, g, b) => {
    return Math.round((r * 299 + g * 587 + b * 114) / 1000)
  }
  
  // 计算灰度
  const calculateGrayscale = (r, g, b) => {
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b)
  }
  
  // 获取排序值的函数 - 实时计算
  const getSortValue = (color, field) => {
    if (!color || !color.rgb) {
      console.warn('颜色数据不完整:', color)
      return 0
    }
    
    const { r, g, b } = color.rgb
    
    switch (field) {
      case 'name':
        return color.chinese || ''
      case 'english':
        return color.english || ''
      case 'hue':
        const hsl_h = rgbToHsl(r, g, b)
        return hsl_h.h
      case 'brightness':
        return calculateBrightness(r, g, b)
      case 'saturation':
        const hsl_s = rgbToHsl(r, g, b)
        return hsl_s.s
      case 'lightness':
        const hsl_l = rgbToHsl(r, g, b)
        return hsl_l.l
      case 'grayscale':
        return calculateGrayscale(r, g, b)
      case 'category':
        return color.category || ''
      default:
        return color.chinese || ''
    }
  }
  
  // 排序函数 - 重写排序逻辑
  const applySorting = (colorArray, field, order) => {
    if (!colorArray || colorArray.length === 0) return []
    
    console.log(`开始排序: ${field} ${order}`)
    
    const sortedColors = [...colorArray].sort((a, b) => {
      const valueA = getSortValue(a, field)
      const valueB = getSortValue(b, field)
      
      // 处理空值
      if (valueA === null || valueA === undefined) return 1
      if (valueB === null || valueB === undefined) return -1
      
      // 字符串排序
      if (typeof valueA === 'string') {
        const result = valueA.localeCompare(valueB, 'zh-CN')
        return order === 'asc' ? result : -result
      }
      
      // 数值排序
      const numA = Number(valueA)
      const numB = Number(valueB)
      
      if (isNaN(numA) || isNaN(numB)) {
        return 0
      }
      
      const result = numA - numB
      return order === 'asc' ? result : -result
    })
    
    console.log(`排序完成: ${field} ${order}, 结果数量: ${sortedColors.length}`)
    
    // 验证排序结果
    if (sortedColors.length > 1) {
      const first = getSortValue(sortedColors[0], field)
      const last = getSortValue(sortedColors[sortedColors.length - 1], field)
      console.log(`排序验证 - 第一个值: ${first}, 最后一个值: ${last}`)
    }
    
    return sortedColors
  }
  
  // 筛选后的颜色
  const filteredColors = computed(() => {
    let result = [...colors.value]
    
    console.log('开始筛选，总颜色数量:', result.length)
    
    // 1. 搜索查询
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      result = result.filter(color => {
        return color.chinese.toLowerCase().includes(query) ||
               color.english.toLowerCase().includes(query) ||
               color.hex.toLowerCase().includes(query)
      })
      console.log('搜索筛选后颜色数量:', result.length)
    }
    
    // 2. 分类筛选
    if (activeFilters.value.category) {
      result = result.filter(color => color.category === activeFilters.value.category)
      console.log('分类筛选后颜色数量:', result.length)
    }
    
    // 3. 标签筛选
    if (activeFilters.value.tags.length > 0) {
      result = result.filter(color => {
        if (!color.tags || !Array.isArray(color.tags)) return false
        return activeFilters.value.tags.some(tag => color.tags.includes(tag))
      })
      console.log('标签筛选后颜色数量:', result.length)
    }
    
    // 4. 国风筛选
    if (activeFilters.value.hasGuofeng) {
      result = result.filter(color => {
        const hasValidGuofeng = color.guofeng && 
                              color.guofeng !== 'null' && 
                              color.guofeng !== null && 
                              color.guofeng.trim() !== ''
        return hasValidGuofeng
      })
      console.log('国风筛选后颜色数量:', result.length)
    }
    
    // 5. 应用排序
    console.log('应用排序:', sortBy.value, sortOrder.value)
    const sortedColors = applySorting(result, sortBy.value, sortOrder.value)
    
    return sortedColors
  })
  
  // ===== 数据加载 ===== 
  const loadColors = async () => {
    if (colors.value.length > 0) {
      console.log('颜色数据已存在，跳过加载')
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      console.log('开始加载颜色数据...')
      
      const response = await fetch('./colors.json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'default'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} - ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('原始数据结构:', typeof data, Array.isArray(data))
      
      let colorArray = []
      if (data && Array.isArray(data.colors)) {
        colorArray = data.colors
      } else if (Array.isArray(data)) {
        colorArray = data
      } else {
        throw new Error('无效的颜色数据格式')
      }
      
      if (colorArray.length === 0) {
        throw new Error('颜色数据为空')
      }
      
      console.log('找到颜色数据:', colorArray.length, '个颜色')
      
      // 验证和清理数据
      const cleanedColors = colorArray.map((color, index) => {
        try {
          if (!color.hex || !color.rgb) {
            console.warn(`颜色 ${index} 缺少必需字段:`, color)
            return null
          }
          
          const rgb = {
            r: parseInt(color.rgb.r) || 0,
            g: parseInt(color.rgb.g) || 0,
            b: parseInt(color.rgb.b) || 0
          }
          
          return {
            ...color,
            rgb,
            chinese: color.chinese || '未命名',
            english: color.english || 'Unnamed',
            category: color.category || '其他',
            tags: Array.isArray(color.tags) ? color.tags : []
          }
        } catch (err) {
          console.warn(`处理颜色 ${index} 时出错:`, color, err)
          return null
        }
      }).filter(color => color !== null)
      
      colors.value = cleanedColors
      console.log('颜色数据加载完成，共', colors.value.length, '个颜色')
      
    } catch (err) {
      console.error('颜色数据加载失败:', err)
      error.value = err.message || '加载颜色数据时发生错误'
    } finally {
      isLoading.value = false
    }
  }
  
  // ===== 搜索和筛选 =====
  const setSearchQuery = (query) => {
    console.log('设置搜索查询:', query)
    searchQuery.value = query?.toString() || ''
  }
  
  const setFilter = (filterType, value) => {
    console.log('设置筛选:', filterType, value)
    
    try {
      switch (filterType) {
        case 'category':
          activeFilters.value.category = value || ''
          break
        case 'tags':
          if (Array.isArray(value)) {
            activeFilters.value.tags = [...value]
          } else {
            activeFilters.value.tags = []
          }
          break
        case 'hasGuofeng':
          activeFilters.value.hasGuofeng = Boolean(value)
          break
        default:
          console.warn('未知的筛选类型:', filterType)
      }
    } catch (err) {
      console.error('设置筛选时出错:', err)
    }
  }
  
  const addTagFilter = (tag) => {
    if (tag && !activeFilters.value.tags.includes(tag)) {
      activeFilters.value.tags.push(tag)
    }
  }
  
  const removeTagFilter = (tag) => {
    const index = activeFilters.value.tags.indexOf(tag)
    if (index > -1) {
      activeFilters.value.tags.splice(index, 1)
    }
  }
  
  const clearFilters = () => {
    console.log('清除所有筛选')
    searchQuery.value = ''
    activeFilters.value = {
      category: '',
      tags: [],
      hasGuofeng: false
    }
  }
  
  // ===== 排序控制 =====
  const setSorting = (field, order = null) => {
    console.log('设置排序:', field, order)
    
    const validSortFields = ['name', 'english', 'hue', 'brightness', 'saturation', 'lightness', 'grayscale', 'category']
    
    if (validSortFields.includes(field)) {
      sortBy.value = field
    } else {
      console.warn('无效的排序字段:', field)
      sortBy.value = 'name'
    }
    
    if (order !== null) {
      if (['asc', 'desc'].includes(order)) {
        sortOrder.value = order
      } else {
        console.warn('无效的排序顺序:', order)
        sortOrder.value = 'asc'
      }
    }
  }
  
  const toggleSortOrder = () => {
    console.log('切换排序方向')
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  
  // ===== 返回 store 接口 =====
  return {
    // 状态
    colors,
    isLoading,
    error,
    searchQuery,
    activeFilters,
    sortBy,
    sortOrder,
    
    // 计算属性
    categories,
    allTags,
    filteredColors,
    
    // 方法
    loadColors,
    setSearchQuery,
    setFilter,
    addTagFilter,
    removeTagFilter,
    clearFilters,
    setSorting,
    toggleSortOrder
  }
})