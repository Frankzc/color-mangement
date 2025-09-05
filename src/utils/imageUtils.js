// ===== src/utils/imageUtils.js =====
import ColorThief from 'colorthief'

// 图片上传验证
export const validateImageFile = (file) => {
  const maxSize = import.meta.env.VITE_MAX_UPLOAD_SIZE || 10485760 // 10MB
  const supportedFormats = (import.meta.env.VITE_SUPPORTED_FORMATS || 'image/jpeg,image/png,image/webp').split(',')
  
  if (file.size > maxSize) {
    throw new Error(`图片大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`)
  }
  
  if (!supportedFormats.includes(file.type)) {
    throw new Error(`不支持的图片格式，请使用 ${supportedFormats.join(', ')} 格式`)
  }
  
  return true
}

// 图片预处理
export const preprocessImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // 限制最大尺寸
        const maxWidth = 800
        const maxHeight = 600
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx.drawImage(img, 0, 0, width, height)
        
        resolve({
          canvas,
          dataUrl: canvas.toDataURL('image/jpeg', 0.8),
          width,
          height
        })
      }
      
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

// 从图片中提取颜色
export const extractColorsFromImage = (imageElement, colorCount = 10) => {
  const colorThief = new ColorThief()
  
  try {
    const palette = colorThief.getPalette(imageElement, colorCount)
    return palette.map(rgb => ({
      rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
      hex: chroma.rgb(rgb[0], rgb[1], rgb[2]).hex()
    }))
  } catch (error) {
    console.error('颜色提取失败:', error)
    return []
  }
}

// 获取图片特定位置的颜色
export const getColorAtPosition = (canvas, x, y) => {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(x, y, 1, 1)
  const [r, g, b] = imageData.data
  
  return {
    rgb: { r, g, b },
    hex: chroma.rgb(r, g, b).hex()
  }
}