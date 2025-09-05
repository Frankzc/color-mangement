// ===== src/utils/colorUtils.js =====
import chroma from 'chroma-js'
import Fuse from 'fuse.js'

// 加载颜色数据
export const loadColorsData = async () => {
  try {
    const response = await fetch('/colors.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    // 为每个颜色添加计算属性
    data.colors = data.colors.map(color => ({
      ...color,
      hsl: rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b),
      brightness: getBrightness(color.rgb.r, color.rgb.g, color.rgb.b),
      contrast: getContrastColor(color.hex),
      chromaColor: chroma(color.hex)
    }))
    
    return data
  } catch (error) {
    console.error('颜色数据加载失败:', error)
    throw error
  }
}

// RGB转HSL
export const rgbToHsl = (r, g, b) => {
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
export const getBrightness = (r, g, b) => {
  return Math.round((r * 299 + g * 587 + b * 114) / 1000)
}

// 获取对比色
export const getContrastColor = (hex) => {
  const color = chroma(hex)
  return color.luminance() > 0.5 ? '#000000' : '#FFFFFF'
}

// 颜色搜索
export const searchColors = (colors, query) => {
  if (!query.trim()) return colors
  
  const fuse = new Fuse(colors, {
    keys: [
      { name: 'chinese', weight: 0.3 },
      { name: 'english', weight: 0.3 },
      { name: 'hex', weight: 0.2 },
      { name: 'guofeng', weight: 0.2 },
      { name: 'tags', weight: 0.1 },
      { name: 'category', weight: 0.1 },
      { name: 'pantone', weight: 0.1 }
    ],
    threshold: 0.4,
    includeScore: true
  })
  
  const results = fuse.search(query)
  return results.map(result => result.item)
}

// 颜色筛选
export const filterColors = (colors, filters) => {
  return colors.filter(color => {
    // 分类筛选
    if (filters.category && color.category !== filters.category) {
      return false
    }
    
    // 标签筛选
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        color.tags.includes(tag)
      )
      if (!hasMatchingTag) return false
    }
    
    // 国风颜色筛选
    if (filters.hasGuofeng && !color.guofeng) {
      return false
    }
    
    return true
  })
}

// 颜色排序
export const sortColors = (colors, sortBy, order = 'asc') => {
  const sorted = [...colors].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.chinese.localeCompare(b.chinese, 'zh-CN')
        break
      case 'hue':
        comparison = a.hsl.h - b.hsl.h
        break
      case 'brightness':
        comparison = a.brightness - b.brightness
        break
      case 'saturation':
        comparison = a.hsl.s - b.hsl.s
        break
      case 'lightness':
        comparison = a.hsl.l - b.hsl.l
        break
      default:
        comparison = 0
    }
    
    return order === 'desc' ? -comparison : comparison
  })
  
  return sorted
}

// 颜色相似度计算
export const getColorSimilarity = (color1, color2) => {
  const c1 = chroma(color1)
  const c2 = chroma(color2)
  
  // 使用Delta E CIE2000算法计算颜色差异
  return chroma.deltaE(c1, c2)
}

// 获取相似颜色
export const getSimilarColors = (targetColor, colors, limit = 6) => {
  const similarities = colors
    .filter(color => color.hex !== targetColor.hex)
    .map(color => ({
      color,
      similarity: getColorSimilarity(targetColor.hex, color.hex)
    }))
    .sort((a, b) => a.similarity - b.similarity)
    .slice(0, limit)
  
  return similarities.map(item => item.color)
}

// 生成配色方案
export const generateColorScheme = (baseColor, type = 'complementary') => {
  const base = chroma(baseColor.hex)
  let colors = []
  
  switch (type) {
    case 'complementary':
      colors = [
        base,
        base.set('hsl.h', '+180')
      ]
      break
    case 'triadic':
      colors = [
        base,
        base.set('hsl.h', '+120'),
        base.set('hsl.h', '+240')
      ]
      break
    case 'analogous':
      colors = [
        base.set('hsl.h', '-30'),
        base,
        base.set('hsl.h', '+30')
      ]
      break
    case 'split-complementary':
      colors = [
        base,
        base.set('hsl.h', '+150'),
        base.set('hsl.h', '+210')
      ]
      break
    case 'tetradic':
      colors = [
        base,
        base.set('hsl.h', '+90'),
        base.set('hsl.h', '+180'),
        base.set('hsl.h', '+270')
      ]
      break
    case 'monochromatic':
      colors = [
        base.brighten(2),
        base.brighten(1),
        base,
        base.darken(1),
        base.darken(2)
      ]
      break
  }
  
  return colors.map(color => color.hex())
}

// 颜色格式转换
export const convertColor = (color, format) => {
  const c = chroma(color)
  
  switch (format) {
    case 'hex':
      return c.hex()
    case 'rgb':
      return c.css('rgb')
    case 'hsl':
      return c.css('hsl')
    case 'cmyk':
      return c.cmyk()
    case 'lab':
      return c.lab()
    default:
      return color
  }
}













