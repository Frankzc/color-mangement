Fashion Color 色彩分类与配色推荐技术文档
📋 文档概览
本文档专门针对 Fashion Color 项目的色彩分类系统和配色推荐引擎进行详细的技术设计和实现指导。

🎯 系统架构设计
整体架构图
色彩分析引擎
├── 颜色分类系统
│   ├── 自动计算分类 (算法驱动)
│   ├── 文化标签分类 (数据库驱动)
│   └── 混合分类策略
└── 配色推荐引擎
    ├── 几何配色算法 (色彩理论)
    ├── 语义配色推荐 (基于分类)
    ├── 文化主题配色 (文化标签)
    └── 个性化推荐 (用户画像)
数据流设计
输入颜色 (#87CEEB)
    ↓
色彩属性计算 (HSL, 亮度, 饱和度等)
    ↓
分类算法处理 (季节色, 场景色等)
    ↓
配色算法生成 (几何+语义+文化)
    ↓
推荐结果输出 (排序优化后的配色方案)

🎨 颜色分类系统
1. 自动计算分类
1.1 季节色彩体系
基于四季色彩分析理论，通过色温、饱和度、明度自动判定：
javascriptclass SeasonalColorClassifier {
  
  classifyColor(hsl, rgb) {
    const { h, s, l } = hsl
    const warmth = this.calculateWarmth(h) // 色温计算
    const brightness = this.calculateBrightness(rgb)
    const saturation = s / 100
    const lightness = l / 100
    
    // 春季色：高亮度，中高饱和度，暖色调
    if (warmth > 0 && lightness > 0.6 && saturation >= 0.4 && saturation <= 0.8) {
      return 'spring'
    }
    
    // 夏季色：冷调，亮度中等，饱和度偏低
    if (warmth < 0 && lightness > 0.5 && saturation < 0.5) {
      return 'summer'
    }
    
    // 秋季色：暖调，低亮度，中饱和度
    if (warmth > 0 && lightness < 0.5 && saturation >= 0.3 && saturation <= 0.7) {
      return 'autumn'
    }
    
    // 冬季色：冷调，高对比，高饱和
    if (warmth < 0 && saturation > 0.6 && this.calculateContrast(rgb) > 0.6) {
      return 'winter'
    }
    
    return 'neutral'
  }
  
  calculateWarmth(hue) {
    // 色温计算：0-60°和300-360°为暖色，其他为冷色
    if ((hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360)) {
      return 1 // 暖色
    } else {
      return -1 // 冷色
    }
  }
}
推荐配色策略：

春季色 → 相邻暖色 + 浅中性色（白、米色）
夏季色 → 单色调渐变 + 冷中性色
秋季色 → 互补色（绿-橙） + 暖中性色（驼、棕）
冬季色 → 黑白对比 + 冷色互补

1.2 时装场景分类
javascriptclass FashionSceneClassifier {
  
  classifyByScene(hsl, rgb) {
    const { s, l } = hsl
    const saturation = s / 100
    const lightness = l / 100
    const contrast = this.calculateContrast(rgb)
    
    const scenes = []
    
    // 职场色：低饱和度，中性
    if (saturation < 0.2 && lightness >= 0.2 && lightness <= 0.6) {
      scenes.push('office')
    }
    
    // 晚礼服色：高对比，深色调
    if (lightness < 0.3 && saturation > 0.5) {
      scenes.push('evening')
    }
    
    // 休闲色：低对比度，舒适
    if (contrast < 0.3 && saturation >= 0.2 && saturation <= 0.6) {
      scenes.push('casual')
    }
    
    // 运动色：高饱和，强烈冲击感
    if (saturation > 0.7 && lightness > 0.5) {
      scenes.push('sport')
    }
    
    return scenes
  }
}
推荐配色策略：

职场色 → 单色调 + 经典对比（黑+白、灰+蓝）
晚礼服色 → 金属色（金、银） + 珠宝色对比
休闲色 → 相邻色 + 中性色
运动色 → 黑/白基底 + 高饱和点缀色

1.3 时尚语义分类
javascriptclass FashionSemanticClassifier {
  
  classifyByStyle(hsl, rgb) {
    const { s, l } = hsl
    const saturation = s / 100
    const lightness = l / 100
    const isMetallic = this.detectMetallic(rgb) // 金属光泽检测
    
    const styles = []
    
    // 奢华色：金属光泽 or 中高饱和度
    if (isMetallic || (saturation >= 0.4 && lightness >= 0.3 && lightness <= 0.6)) {
      styles.push('luxury')
    }
    
    // 极简色：低饱和度
    if (saturation < 0.2) {
      styles.push('minimalist')
    }
    
    // 复古色：中低饱和度，偏暖
    if (this.isWarm(hsl.h) && saturation < 0.5) {
      styles.push('vintage')
    }
    
    // 未来感色：银色、金属蓝、荧光色
    if (isMetallic || this.isNeonColor(rgb)) {
      styles.push('futuristic')
    }
    
    return styles
  }
}
1.4 审美风格分类
javascriptclass AestheticStyleClassifier {
  
  classifyByAesthetic(hsl, rgb) {
    const { h, s, l } = hsl
    const saturation = s / 100
    const lightness = l / 100
    const warmth = this.calculateWarmth(h)
    
    const aesthetics = []
    
    // 少女色：粉色系、马卡龙色
    if (lightness > 0.7 && saturation >= 0.3 && saturation <= 0.6 && warmth > 0) {
      aesthetics.push('girly')
    }
    
    // 暗黑色：低亮度，冷色调或高对比
    if (lightness < 0.3 && (warmth < 0 || this.calculateContrast(rgb) > 0.6)) {
      aesthetics.push('dark')
    }
    
    // 文艺色：低饱和，灰度高
    if (saturation < 0.3 && lightness >= 0.3 && lightness <= 0.7) {
      aesthetics.push('artistic')
    }
    
    // 赛博色：荧光紫、蓝+黑基调
    if (this.isCyberpunkColor(rgb)) {
      aesthetics.push('cyberpunk')
    }
    
    return aesthetics
  }
}
2. 文化标签分类
2.1 文化色彩数据库设计
javascriptconst culturalColorDatabase = {
  chinese: {
    name: '中国传统色',
    colors: {
      '#DC143C': { name: '中国红', meaning: '喜庆、吉祥', era: '古代' },
      '#FFD700': { name: '明黄', meaning: '皇权、尊贵', era: '封建' },
      '#006400': { name: '竹青', meaning: '清雅、高洁', era: '文人' },
      '#8B4513': { name: '赭石', meaning: '大地、稳重', era: '民间' }
    },
    themes: {
      '宫廷风': ['#FFD700', '#DC143C', '#8B0000', '#4B0082'],
      '文人风': ['#006400', '#2F4F4F', '#D2B48C', '#F5F5DC'],
      '民俗风': ['#DC143C', '#FF8C00', '#228B22', '#4169E1']
    }
  },
  
  japanese: {
    name: '日式传统色',
    colors: {
      '#FFB6C1': { name: '樱色', meaning: '纯洁、美好', season: '春' },
      '#DDA0DD': { name: '藤色', meaning: '优雅、浪漫', season: '夏' },
      '#F0E68C': { name: '山吹色', meaning: '温暖、希望', season: '秋' },
      '#2F4F4F': { name: '墨色', meaning: '深沉、静谧', season: '冬' }
    }
  },
  
  western: {
    name: '西方色彩',
    colors: {
      '#800080': { name: '皇室紫', meaning: '尊贵、神秘', context: '贵族' },
      '#000080': { name: '海军蓝', meaning: '专业、可靠', context: '制服' },
      '#DC143C': { name: '玫瑰红', meaning: '爱情、激情', context: '浪漫' }
    }
  }
}
2.2 文化标签匹配算法
javascriptclass CulturalTagMatcher {
  
  matchCulturalTags(hexColor) {
    const matches = []
    
    // 精确匹配
    const exactMatch = this.findExactMatch(hexColor)
    if (exactMatch) {
      matches.push(exactMatch)
    }
    
    // 相似色匹配
    const similarMatches = this.findSimilarColors(hexColor, 0.1) // 10%色差容忍度
    matches.push(...similarMatches)
    
    // 主题匹配
    const themeMatches = this.findThemeMatches(hexColor)
    matches.push(...themeMatches)
    
    return matches
  }
  
  calculateColorDistance(color1, color2) {
    // 使用Delta E CIE76算法计算色差
    const lab1 = this.rgbToLab(this.hexToRgb(color1))
    const lab2 = this.rgbToLab(this.hexToRgb(color2))
    
    return Math.sqrt(
      Math.pow(lab1.l - lab2.l, 2) +
      Math.pow(lab1.a - lab2.a, 2) +
      Math.pow(lab1.b - lab2.b, 2)
    )
  }
}
3. 混合分类策略
3.1 分类优先级系统
javascriptclass ColorClassificationEngine {
  
  classifyColor(color) {
    const result = {
      primary: [],      // 主要分类（算法计算）
      secondary: [],    // 次要分类（扩展属性）
      cultural: [],     // 文化标签
      confidence: {}    // 置信度评分
    }
    
    // 1. 基础算法分类
    result.primary.push({
      category: 'seasonal',
      value: this.seasonalClassifier.classify(color),
      confidence: 0.9
    })
    
    result.primary.push({
      category: 'scene',
      value: this.sceneClassifier.classify(color),
      confidence: 0.85
    })
    
    // 2. 文化标签匹配
    const culturalMatches = this.culturalMatcher.match(color.hex)
    if (culturalMatches.length > 0) {
      result.cultural = culturalMatches
    }
    
    // 3. 综合评分
    result.overallScore = this.calculateOverallScore(result)
    
    return result
  }
}

🎯 配色推荐引擎
1. 几何配色算法
1.1 核心算法实现
javascriptclass GeometricColorPalettes {
  
  // 单色系配色
  generateMonochromatic(baseColor, variants = 3) {
    const hsl = this.hexToHsl(baseColor)
    const palettes = []
    
    // 变体1：明度变化
    const lightnessVariants = this.generateLightnessVariants(hsl, variants)
    palettes.push({
      name: '明度渐变',
      type: 'monochromatic_lightness',
      colors: lightnessVariants,
      description: '同色相，不同明度层次',
      mood: '统一、层次分明'
    })
    
    // 变体2：饱和度变化
    const saturationVariants = this.generateSaturationVariants(hsl, variants)
    palettes.push({
      name: '饱和度渐变',
      type: 'monochromatic_saturation', 
      colors: saturationVariants,
      description: '从鲜艳到柔和的过渡',
      mood: '柔和、舒缓'
    })
    
    // 变体3：混合变化
    const mixedVariants = this.generateMixedVariants(hsl, variants)
    palettes.push({
      name: '综合渐变',
      type: 'monochromatic_mixed',
      colors: mixedVariants,
      description: '明度和饱和度同时变化',
      mood: '丰富、有层次'
    })
    
    return palettes
  }
  
  // 类似色配色
  generateAnalogous(baseColor, angle = 30) {
    const hsl = this.hexToHsl(baseColor)
    const palettes = []
    
    // 变体1：±30度
    palettes.push({
      name: '经典相邻',
      type: 'analogous_classic',
      colors: [
        this.rotateHue(hsl, -30),
        baseColor,
        this.rotateHue(hsl, 30)
      ],
      description: '色环上相邻的颜色组合',
      mood: '和谐、自然'
    })
    
    // 变体2：±45度  
    palettes.push({
      name: '扩展相邻',
      type: 'analogous_extended',
      colors: [
        this.rotateHue(hsl, -45),
        baseColor,
        this.rotateHue(hsl, 45)
      ],
      description: '更大跨度的相邻色',
      mood: '活泼、有变化'
    })
    
    return palettes
  }
  
  // 互补色配色
  generateComplementary(baseColor) {
    const hsl = this.hexToHsl(baseColor)
    const complementary = this.rotateHue(hsl, 180)
    
    return [{
      name: '经典互补',
      type: 'complementary_classic',
      colors: [baseColor, complementary],
      description: '色环上正对的颜色',
      mood: '对比强烈、充满活力'
    }]
  }
  
  // 分裂互补配色
  generateSplitComplementary(baseColor, angle = 30) {
    const hsl = this.hexToHsl(baseColor)
    
    return [{
      name: '分裂互补',
      type: 'split_complementary',
      colors: [
        baseColor,
        this.rotateHue(hsl, 180 - angle),
        this.rotateHue(hsl, 180 + angle)
      ],
      description: '主色加上互补色两侧的颜色',
      mood: '平衡的对比效果'
    }]
  }
  
  // 三角配色
  generateTriad(baseColor) {
    const hsl = this.hexToHsl(baseColor)
    
    return [{
      name: '等距三角',
      type: 'triad',
      colors: [
        baseColor,
        this.rotateHue(hsl, 120),
        this.rotateHue(hsl, 240)
      ],
      description: '色环上等距分布的三种颜色',
      mood: '活泼、均衡'
    }]
  }
  
  // 四方配色
  generateTetrad(baseColor) {
    const hsl = this.hexToHsl(baseColor)
    
    return [{
      name: '矩形配色',
      type: 'tetrad',
      colors: [
        baseColor,
        this.rotateHue(hsl, 90),
        this.rotateHue(hsl, 180),
        this.rotateHue(hsl, 270)
      ],
      description: '两对互补色构成的矩形',
      mood: '丰富、复杂'
    }]
  }
}
1.2 辅助计算函数
javascriptclass ColorCalculationUtils {
  
  // 色相旋转
  rotateHue(hsl, degrees) {
    const newHue = (hsl.h + degrees + 360) % 360
    return this.hslToHex({ ...hsl, h: newHue })
  }
  
  // 明度变化
  adjustLightness(hsl, factor) {
    const newLightness = Math.max(0, Math.min(100, hsl.l * factor))
    return this.hslToHex({ ...hsl, l: newLightness })
  }
  
  // 饱和度变化
  adjustSaturation(hsl, factor) {
    const newSaturation = Math.max(0, Math.min(100, hsl.s * factor))
    return this.hslToHex({ ...hsl, s: newSaturation })
  }
  
  // 颜色距离计算
  calculateColorHarmony(colors) {
    // 计算配色和谐度
    let harmonyScore = 0
    // ... 实现和谐度算法
    return harmonyScore
  }
}
2. 语义配色推荐
2.1 基于分类的配色策略
javascriptclass SemanticColorPalettes {
  
  generateSemanticPalettes(baseColor, classifications) {
    const palettes = []
    
    classifications.forEach(classification => {
      switch(classification.category) {
        case 'seasonal':
          palettes.push(...this.generateSeasonalPalettes(baseColor, classification.value))
          break
        case 'scene':
          palettes.push(...this.generateScenePalettes(baseColor, classification.value))
          break
        case 'style':
          palettes.push(...this.generateStylePalettes(baseColor, classification.value))
          break
      }
    })
    
    return palettes
  }
  
  generateSeasonalPalettes(baseColor, season) {
    const strategies = {
      spring: () => this.generateSpringPalette(baseColor),
      summer: () => this.generateSummerPalette(baseColor),
      autumn: () => this.generateAutumnPalette(baseColor),
      winter: () => this.generateWinterPalette(baseColor)
    }
    
    return strategies[season] ? strategies[season]() : []
  }
  
  generateSpringPalette(baseColor) {
    // 春季配色：相邻暖色 + 浅中性色
    const hsl = this.hexToHsl(baseColor)
    
    return [{
      name: '春日暖阳',
      type: 'spring_warm',
      colors: [
        baseColor,
        this.rotateHue(hsl, 30),  // 相邻暖色
        '#FFFFFF',                // 白色
        '#F5F5DC'                 // 米色
      ],
      description: '温暖明亮的春季配色',
      mood: '清新、活力、希望',
      occasions: ['休闲', '约会', '春游']
    }]
  }
  
  generateOfficePalette(baseColor) {
    // 职场配色：单色调 + 经典组合
    const hsl = this.hexToHsl(baseColor)
    
    return [{
      name: '职场精英',
      type: 'office_professional',
      colors: [
        baseColor,
        this.adjustSaturation(hsl, 0.6),  // 降低饱和度
        '#000000',                        // 黑色
        '#FFFFFF'                         // 白色
      ],
      description: '专业稳重的职场配色',
      mood: '专业、可靠、权威',
      occasions: ['工作', '商务', '正式场合']
    }]
  }
}
3. 文化主题配色
3.1 文化配色生成器
javascriptclass CulturalColorPalettes {
  
  generateCulturalPalettes(baseColor, culturalTags) {
    const palettes = []
    
    culturalTags.forEach(tag => {
      if (tag.culture === 'chinese') {
        palettes.push(...this.generateChinesePalettes(baseColor, tag))
      } else if (tag.culture === 'japanese') {
        palettes.push(...this.generateJapanesePalettes(baseColor, tag))
      }
    })
    
    return palettes
  }
  
  generateChinesePalettes(baseColor, tag) {
    const palettes = []
    
    // 宫廷风配色
    if (tag.theme === '宫廷风') {
      palettes.push({
        name: '紫禁城',
        type: 'chinese_imperial',
        colors: [
          baseColor,
          '#FFD700',  // 明黄
          '#DC143C',  // 中国红  
          '#4B0082'   // 紫色
        ],
        description: '庄重华贵的宫廷配色',
        cultural: '体现皇家威严与尊贵',
        occasions: ['正式', '庆典', '晚宴']
      })
    }
    
    // 文人风配色
    if (tag.theme === '文人风') {
      palettes.push({
        name: '墨竹雅韵',
        type: 'chinese_scholarly',
        colors: [
          baseColor,
          '#006400',  // 竹青
          '#2F4F4F',  // 墨色
          '#F5F5DC'   // 米白
        ],
        description: '清雅脱俗的文人配色',
        cultural: '体现文人的清高与雅致',
        occasions: ['文艺', '茶会', '书法']
      })
    }
    
    return palettes
  }
}
4. 个性化推荐引擎
4.1 用户画像分析
javascriptclass PersonalizedRecommendationEngine {
  
  generatePersonalizedPalettes(baseColor, userProfile) {
    const palettes = []
    
    // 肤色适配
    if (userProfile.skinTone) {
      palettes.push(...this.generateSkinToneCompatiblePalettes(baseColor, userProfile.skinTone))
    }
    
    // 场合推荐
    if (userProfile.occasion) {
      palettes.push(...this.generateOccasionPalettes(baseColor, userProfile.occasion))
    }
    
    // 季节适配
    if (userProfile.season) {
      palettes.push(...this.generateSeasonalRecommendations(baseColor, userProfile.season))
    }
    
    // 风格偏好
    if (userProfile.stylePreferences) {
      palettes.push(...this.generateStyleBasedPalettes(baseColor, userProfile.stylePreferences))
    }
    
    return this.rankPalettesByPersonalFit(palettes, userProfile)
  }
  
  generateSkinToneCompatiblePalettes(baseColor, skinTone) {
    const strategies = {
      warm: () => this.generateWarmSkinPalettes(baseColor),
      cool: () => this.generateCoolSkinPalettes(baseColor),
      neutral: () => this.generateNeutralSkinPalettes(baseColor)
    }
    
    return strategies[skinTone] ? strategies[skinTone]() : []
  }
}

🛠️ 技术实现方案
1. 数据结构设计
1.1 颜色对象扩展结构
javascriptconst ExtendedColorObject = {
  // 基础属性
  hex: '#87CEEB',
  rgb: { r: 135, g: 206, b: 235 },
  hsl: { h: 195, s: 71, l: 73 },
  
  // 计算属性
  computed: {
    brightness: 203,
    warmth: -1,
    contrast: 0.45,
    seasonal: 'summer',
    scenes: ['casual', 'office'],
    styles: ['minimalist', 'fresh'],
    aesthetics: ['calm', 'professional']
  },
  
  // 文化标签
  cultural: [
    {
      culture: 'western',
      tags: ['天空蓝', '宁静'],
      confidence: 0.8
    }
  ],
  
  // 配色推荐缓存
  palettes: {
    geometric: [
      {
        name: '天空渐变',
        type: 'monochromatic',
        colors: ['#87CEEB', '#A7DCF0', '#C2E7F5'],
        mood: '清新宁静'
      }
    ],
    semantic: [
      {
        name: '夏日清凉',
        type: 'summer_cool',
        colors: ['#87CEEB', '#98FB98', '#F0F8FF'],
        mood: '清凉舒适'
      }
    ],
    cultural: [],
    personalized: []
  }
}
1.2 配色方案数据结构
javascriptconst ColorPaletteSchema = {
  id: 'palette_001',
  name: '春日暖阳',
  type: 'spring_warm',
  category: 'seasonal',
  
  colors: [
    { hex: '#87CEEB', role: 'primary' },
    { hex: '#98FB98', role: 'secondary' },
    { hex: '#FFFFFF', role: 'neutral' },
    { hex: '#F5F5DC', role: 'accent' }
  ],
  
  metadata: {
    description: '温暖明亮的春季配色方案',
    mood: ['清新', '活力', '希望'],
    occasions: ['休闲', '约会', '春游'],
    style: 'fresh',
    season: 'spring',
    cultural: null
  },
  
  recommendations: {
    usage: '主色作为上装，辅色作为下装，中性色作为配饰',
    combinations: [
      { primary: '#87CEEB', secondary: '#98FB98', neutral: '#FFFFFF' },
      { primary: '#98FB98', secondary: '#87CEEB', accent: '#F5F5DC' }
    ]
  },
  
  quality: {
    harmony: 0.85,
    contrast: 0.65,
    versatility: 0.80,
    trendiness: 0.75
  }
}
2. 核心算法引擎
2.1 主引擎类
javascriptclass ColorRecommendationEngine {
  constructor() {
    this.geometricGenerator = new GeometricColorPalettes()
    this.semanticGenerator = new SemanticColorPalettes()
    this.culturalGenerator = new CulturalColorPalettes()
    this.personalizedGenerator = new PersonalizedRecommendationEngine()
    
    this.classifier = new ColorClassificationEngine()
    this.qualityEvaluator = new PaletteQualityEvaluator()
  }
  
  async generateAllRecommendations(baseColor, userProfile = null) {
    // 1. 颜色分类
    const classifications = await this.classifier.classifyColor(baseColor)
    
    // 2. 生成各类配色
    const recommendations = {
      geometric: this.geometricGenerator.generateAll(baseColor),
      semantic: this.semanticGenerator.generate(baseColor, classifications),
      cultural: this.culturalGenerator.generate(baseColor, classifications.cultural),
      personalized: userProfile ? 
        this.personalizedGenerator.generate(baseColor, userProfile) : []
    }
    
    // 3. 质量评估和排序
    const rankedRecommendations = this.rankRecommendations(recommendations, userProfile)
    
    // 4. 返回结构化结果
    return {
      baseColor,
      classifications,
      recommendations: rankedRecommendations,
      summary: this.generateSummary(rankedRecommendations)
      }
}
rankRecommendations(recommendations, userProfile) {
const allPalettes = [
...recommendations.geometric,
...recommendations.semantic,
...recommendations.cultural,
...recommendations.personalized
]
// 评估每个配色方案
const scoredPalettes = allPalettes.map(palette => {
  const qualityScore = this.qualityEvaluator.evaluate(palette)
  const personalFit = userProfile ? 
    this.calculatePersonalFit(palette, userProfile) : 0.5
  
  return {
    ...palette,
    scores: {
      quality: qualityScore,
      personalFit,
      overall: (qualityScore * 0.6 + personalFit * 0.4)
    }
  }
})

// 按综合评分排序
return scoredPalettes.sort((a, b) => b.scores.overall - a.scores.overall)
}
}

#### **2.2 质量评估器**

```javascript
class PaletteQualityEvaluator {
  
  evaluate(palette) {
    const scores = {
      harmony: this.evaluateHarmony(palette.colors),
      contrast: this.evaluateContrast(palette.colors),
      versatility: this.evaluateVersatility(palette),
      uniqueness: this.evaluateUniqueness(palette)
    }
    
    // 加权平均
    return (
      scores.harmony * 0.3 +
      scores.contrast * 0.25 +
      scores.versatility * 0.25 +
      scores.uniqueness * 0.2
    )
  }
  
  evaluateHarmony(colors) {
    // 基于色彩理论计算和谐度
    let harmonyScore = 0
    
    for (let i = 0; i < colors.length - 1; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const distance = this.calculateColorDistance(colors[i], colors[j])
        const idealDistance = this.getIdealDistance(colors.length)
        
        // 距离越接近理想值，和谐度越高
        harmonyScore += 1 - Math.abs(distance - idealDistance) / idealDistance
      }
    }
    
    return harmonyScore / (colors.length * (colors.length - 1) / 2)
  }
  
  evaluateContrast(colors) {
    // 评估对比度适中性
    const contrasts = []
    
    for (let i = 0; i < colors.length - 1; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        contrasts.push(this.calculateLuminanceContrast(colors[i], colors[j]))
      }
    }
    
    const avgContrast = contrasts.reduce((a, b) => a + b, 0) / contrasts.length
    
    // 理想对比度在1.5-4.5之间
    if (avgContrast >= 1.5 && avgContrast <= 4.5) {
      return 1.0
    } else if (avgContrast < 1.5) {
      return avgContrast / 1.5
    } else {
      return Math.max(0, 1 - (avgContrast - 4.5) / 4.5)
    }
  }
}
3. API接口设计
3.1 RESTful API规范
javascript// API端点设计
const API_ENDPOINTS = {
  
  // 颜色分类
  POST: '/api/colors/classify',
  body: {
    hex: '#87CEEB',
    options: {
      includeCultural: true,
      includePersonalized: false
    }
  },
  response: {
    color: '#87CEEB',
    classifications: {
      seasonal: 'summer',
      scenes: ['casual', 'office'],
      styles: ['minimalist'],
      cultural: [{ culture: 'western', tags: ['sky'] }]
    }
  },
  
  // 配色推荐
  POST: '/api/colors/recommend',
  body: {
    baseColor: '#87CEEB',
    userProfile: {
      skinTone: 'cool',
      occasions: ['office', 'casual'],
      stylePreferences: ['minimalist', 'modern']
    },
    options: {
      maxResults: 20,
      includePersonalized: true,
      categories: ['geometric', 'semantic', 'cultural']
    }
  },
  response: {
    baseColor: '#87CEEB',
    totalResults: 18,
    recommendations: [
      {
        id: 'rec_001',
        name: '天空渐变',
        type: 'monochromatic',
        category: 'geometric',
        colors: ['#87CEEB', '#A7DCF0', '#C2E7F5'],
        scores: {
          quality: 0.92,
          personalFit: 0.85,
          overall: 0.89
        },
        metadata: {
          mood: '清新宁静',
          occasions: ['办公', '休闲'],
          description: '柔和的单色渐变，适合日常穿搭'
        }
      }
    ]
  },
  
  // 批量分析
  POST: '/api/colors/batch-analyze',
  body: {
    colors: ['#87CEEB', '#FF6B6B', '#4ECDC4'],
    analysisType: 'full' // 'basic' | 'full' | 'custom'
  }
}
3.2 前端服务层
javascriptclass ColorRecommendationService {
  
  async classifyColor(hex, options = {}) {
    try {
      const response = await fetch('/api/colors/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hex, options })
      })
      
      if (!response.ok) {
        throw new Error(`分类请求失败: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('颜色分类失败:', error)
      // 降级到本地算法
      return this.fallbackClassify(hex)
    }
  }
  
  async getRecommendations(baseColor, userProfile = null, options = {}) {
    const requestBody = {
      baseColor,
      userProfile,
      options: {
        maxResults: 20,
        includePersonalized: !!userProfile,
        categories: ['geometric', 'semantic', 'cultural'],
        ...options
      }
    }
    
    try {
      const response = await fetch('/api/colors/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      
      const data = await response.json()
      
      // 缓存结果
      this.cacheRecommendations(baseColor, data)
      
      return data
    } catch (error) {
      console.error('获取推荐失败:', error)
      // 尝试使用缓存或本地算法
      return this.fallbackRecommendations(baseColor, userProfile)
    }
  }
  
  // 本地降级算法
  fallbackClassify(hex) {
    const localClassifier = new LocalColorClassifier()
    return localClassifier.classify(hex)
  }
  
  fallbackRecommendations(baseColor, userProfile) {
    const localEngine = new LocalRecommendationEngine()
    return localEngine.generateBasicRecommendations(baseColor)
  }
}
4. 前端组件设计
4.1 配色推荐组件
vue<!-- ColorRecommendations.vue -->
<template>
  <div class="color-recommendations">
    <!-- 推荐头部 -->
    <div class="recommendations-header">
      <h3>为 {{ baseColor }} 推荐的配色方案</h3>
      <div class="filter-tabs">
        <button 
          v-for="category in categories"
          :key="category"
          @click="activeCategory = category"
          :class="{ active: activeCategory === category }"
        >
          {{ getCategoryLabel(category) }}
        </button>
      </div>
    </div>
    
    <!-- 推荐列表 -->
    <div class="recommendations-grid">
      <PaletteCard
        v-for="palette in filteredRecommendations"
        :key="palette.id"
        :palette="palette"
        @select="handlePaletteSelect"
        @favorite="handlePaletteFavorite"
      />
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在生成配色推荐...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!isLoading && recommendations.length === 0" class="empty-state">
      <p>暂无推荐配色</p>
      <button @click="generateMoreRecommendations">生成更多推荐</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useColorRecommendationStore } from '@/stores/colorRecommendationStore'
import PaletteCard from './PaletteCard.vue'

const props = defineProps({
  baseColor: {
    type: String,
    required: true
  },
  userProfile: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['palette-selected', 'palette-favorited'])

const recommendationStore = useColorRecommendationStore()

const activeCategory = ref('all')
const isLoading = ref(false)

const categories = computed(() => {
  const cats = ['all']
  if (recommendationStore.recommendations.length > 0) {
    const uniqueCategories = [...new Set(
      recommendationStore.recommendations.map(r => r.category)
    )]
    cats.push(...uniqueCategories)
  }
  return cats
})

const filteredRecommendations = computed(() => {
  if (activeCategory.value === 'all') {
    return recommendationStore.recommendations
  }
  return recommendationStore.recommendations.filter(
    r => r.category === activeCategory.value
  )
})

const loadRecommendations = async () => {
  isLoading.value = true
  
  try {
    await recommendationStore.generateRecommendations(
      props.baseColor,
      props.userProfile
    )
  } catch (error) {
    console.error('加载推荐失败:', error)
  } finally {
    isLoading.value = false
  }
}

const handlePaletteSelect = (palette) => {
  emit('palette-selected', palette)
}

const handlePaletteFavorite = (palette) => {
  emit('palette-favorited', palette)
}

const getCategoryLabel = (category) => {
  const labels = {
    all: '全部',
    geometric: '几何配色',
    semantic: '语义配色',
    cultural: '文化主题',
    personalized: '个性推荐'
  }
  return labels[category] || category
}

// 监听基础颜色变化
watch(() => props.baseColor, loadRecommendations, { immediate: true })

onMounted(() => {
  if (props.baseColor) {
    loadRecommendations()
  }
})
</script>
4.2 配色卡片组件
vue<!-- PaletteCard.vue -->
<template>
  <div class="palette-card" @click="$emit('select', palette)">
    <!-- 配色预览 -->
    <div class="palette-preview">
      <div 
        v-for="(color, index) in palette.colors"
        :key="index"
        class="color-swatch"
        :style="{ backgroundColor: color.hex || color }"
        :title="getColorTooltip(color, index)"
      ></div>
    </div>
    
    <!-- 配色信息 -->
    <div class="palette-info">
      <h4 class="palette-name">{{ palette.name }}</h4>
      <p class="palette-description">{{ palette.metadata?.description }}</p>
      
      <!-- 标签 -->
      <div class="palette-tags">
        <span class="tag category-tag">{{ getCategoryLabel(palette.category) }}</span>
        <span 
          v-for="mood in palette.metadata?.mood || []"
          :key="mood"
          class="tag mood-tag"
        >
          {{ mood }}
        </span>
      </div>
      
      <!-- 评分 -->
      <div class="palette-scores" v-if="palette.scores">
        <div class="score-item">
          <span class="score-label">质量:</span>
          <div class="score-bar">
            <div 
              class="score-fill"
              :style="{ width: `${palette.scores.quality * 100}%` }"
            ></div>
          </div>
          <span class="score-value">{{ Math.round(palette.scores.quality * 100) }}%</span>
        </div>
        
        <div class="score-item" v-if="palette.scores.personalFit">
          <span class="score-label">适配:</span>
          <div class="score-bar">
            <div 
              class="score-fill personal"
              :style="{ width: `${palette.scores.personalFit * 100}%` }"
            ></div>
          </div>
          <span class="score-value">{{ Math.round(palette.scores.personalFit * 100) }}%</span>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="palette-actions">
      <button 
        @click.stop="$emit('favorite', palette)"
        class="action-btn favorite-btn"
        :class="{ active: isFavorited }"
      >
        <HeartIcon class="w-4 h-4" />
      </button>
      
      <button 
        @click.stop="copyPalette"
        class="action-btn copy-btn"
      >
        <CopyIcon class="w-4 h-4" />
      </button>
      
      <button 
        @click.stop="exportPalette"
        class="action-btn export-btn"
      >
        <DownloadIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'

const props = defineProps({
  palette: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select', 'favorite'])

const favoriteStore = useFavoriteStore()

const isFavorited = computed(() => {
  return favoriteStore.isPaletteFavorited(props.palette.id)
})

const getColorTooltip = (color, index) => {
  const hex = color.hex || color
  const role = color.role || ['主色', '辅色', '强调色', '中性色'][index] || '配色'
  return `${role}: ${hex}`
}

const getCategoryLabel = (category) => {
  const labels = {
    geometric: '几何',
    semantic: '语义',
    cultural: '文化',
    personalized: '个性'
  }
  return labels[category] || category
}

const copyPalette = () => {
  const colorCodes = props.palette.colors.map(c => c.hex || c).join(', ')
  navigator.clipboard.writeText(colorCodes)
  // 显示复制成功提示
}

const exportPalette = () => {
  // 导出配色方案为图片或文件
  const exportData = {
    name: props.palette.name,
    colors: props.palette.colors,
    metadata: props.palette.metadata
  }
  
  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `${props.palette.name}.json`
  link.click()
}
</script>
5. 状态管理设计
5.1 配色推荐Store
javascript// stores/colorRecommendationStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ColorRecommendationService } from '@/services/colorRecommendationService'

export const useColorRecommendationStore = defineStore('colorRecommendation', () => {
  
  // 状态
  const recommendations = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentBaseColor = ref(null)
  const generationHistory = ref([])
  
  // 缓存
  const recommendationCache = ref(new Map())
  
  // 服务实例
  const service = new ColorRecommendationService()
  
  // 计算属性
  const geometricRecommendations = computed(() => 
    recommendations.value.filter(r => r.category === 'geometric')
  )
  
  const semanticRecommendations = computed(() =>
    recommendations.value.filter(r => r.category === 'semantic')
  )
  
  const culturalRecommendations = computed(() =>
    recommendations.value.filter(r => r.category === 'cultural')
  )
  
  const personalizedRecommendations = computed(() =>
    recommendations.value.filter(r => r.category === 'personalized')
  )
  
  const topRecommendations = computed(() =>
    recommendations.value
      .sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0))
      .slice(0, 6)
  )
  
  // 方法
  const generateRecommendations = async (baseColor, userProfile = null, options = {}) => {
    // 检查缓存
    const cacheKey = generateCacheKey(baseColor, userProfile, options)
    if (recommendationCache.value.has(cacheKey)) {
      recommendations.value = recommendationCache.value.get(cacheKey)
      currentBaseColor.value = baseColor
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const result = await service.getRecommendations(baseColor, userProfile, options)
      
      recommendations.value = result.recommendations || []
      currentBaseColor.value = baseColor
      
      // 更新缓存
      recommendationCache.value.set(cacheKey, recommendations.value)
      
      // 记录生成历史
      generationHistory.value.unshift({
        baseColor,
        userProfile,
        timestamp: new Date(),
        resultCount: recommendations.value.length
      })
      
      // 限制历史记录数量
      if (generationHistory.value.length > 50) {
        generationHistory.value = generationHistory.value.slice(0, 50)
      }
      
    } catch (err) {
      error.value = err.message || '生成推荐失败'
      console.error('推荐生成错误:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const regenerateWithOptions = async (options) => {
    if (currentBaseColor.value) {
      await generateRecommendations(currentBaseColor.value, null, options)
    }
  }
  
  const addCustomRecommendation = (palette) => {
    const customPalette = {
      ...palette,
      id: `custom_${Date.now()}`,
      category: 'custom',
      isCustom: true
    }
    
    recommendations.value.unshift(customPalette)
  }
  
  const removeRecommendation = (paletteId) => {
    const index = recommendations.value.findIndex(r => r.id === paletteId)
    if (index > -1) {
      recommendations.value.splice(index, 1)
    }
  }
  
  const clearRecommendations = () => {
    recommendations.value = []
    currentBaseColor.value = null
    error.value = null
  }
  
  const clearCache = () => {
    recommendationCache.value.clear()
  }
  
  // 辅助函数
  const generateCacheKey = (baseColor, userProfile, options) => {
    return `${baseColor}_${JSON.stringify(userProfile || {})}_${JSON.stringify(options || {})}`
  }
  
  const getRecommendationById = (id) => {
    return recommendations.value.find(r => r.id === id)
  }
  
  const getRecommendationsByCategory = (category) => {
    return recommendations.value.filter(r => r.category === category)
  }
  
  // 返回store接口
  return {
    // 状态
    recommendations,
    isLoading,
    error,
    currentBaseColor,
    generationHistory,
    
    // 计算属性
    geometricRecommendations,
    semanticRecommendations,
    culturalRecommendations,
    personalizedRecommendations,
    topRecommendations,
    
    // 方法
    generateRecommendations,
    regenerateWithOptions,
    addCustomRecommendation,
    removeRecommendation,
    clearRecommendations,
    clearCache,
    getRecommendationById,
    getRecommendationsByCategory
  }
})

📈 性能优化策略
1. 计算优化
javascriptclass OptimizedColorCalculator {
  constructor() {
    this.cache = new LRUCache(1000) // 缓存1000个计算结果
    this.workerPool = new WorkerPool(4) // 4个Web Worker
  }
  
  async calculateHSL(rgb) {
    const cacheKey = `hsl_${rgb.r}_${rgb.g}_${rgb.b}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    // 对于大批量计算，使用Web Worker
    if (this.pendingCalculations.length > 10) {
      return this.workerPool.execute('calculateHSL', rgb)
    }
    
    const result = this.rgbToHsl(rgb)
    this.cache.set(cacheKey, result)
    return result
  }
}
2. 渲染优化
javascript// 虚拟滚动配色列表
const VirtualColorList = {
  setup() {
    const containerRef = ref()
    const itemHeight = 120
    const visibleCount = computed(() => 
      Math.ceil(containerHeight.value / itemHeight) + 2
    )
    
    const visibleItems = computed(() => {
      const start = Math.floor(scrollTop.value / itemHeight)
      const end = Math.min(start + visibleCount.value, items.value.length)
      
      return items.value.slice(start, end).map((item, index) => ({
        ...item,
        index: start + index,
        top: (start + index) * itemHeight
      }))
    })
    
    return { visibleItems, containerRef }
  }
}
3. 数据预加载
javascriptclass ColorDataPreloader {
  async preloadRecommendations(baseColors) {
    const promises = baseColors.map(color => 
      this.service.getRecommendations(color).catch(() => null)
    )
    
    const results = await Promise.allSettled(promises)
    
    // 预缓存成功的结果
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        this.cache.set(baseColors[index], result.value)
      }
    })
  }
}

🔍 测试策略
1. 单元测试
javascript// tests/colorClassification.test.js
describe('颜色分类系统', () => {
  const classifier = new SeasonalColorClassifier()
  
  test('春季色分类', () => {
    const springColor = { h: 45, s: 60, l: 70 } // 暖色，高亮度，中饱和度
    const result = classifier.classifyColor(springColor, { r: 200, g: 180, b: 120 })
    expect(result).toBe('spring')
  })
  
  test('冬季色分类', () => {
    const winterColor = { h: 240, s: 80, l: 30 } // 冷色，高饱和度，低亮度
    const result = classifier.classifyColor(winterColor, { r: 20, g: 40, b: 120 })
    expect(result).toBe('winter')
  })
})

describe('配色算法', () => {
  const generator = new GeometricColorPalettes()
  
  test('单色系配色生成', () => {
    const palettes = generator.generateMonochromatic('#87CEEB')
    expect(palettes).toHaveLength(3)
    expect(palettes[0].type).toBe('monochromatic_lightness')
  })
  
  test('互补色配色', () => {
    const palettes = generator.generateComplementary('#87CEEB')
    expect(palettes).toHaveLength(1)
    expect(palettes[0].colors).toHaveLength(2)
  })
})
2. 集成测试
javascript// tests/integration/recommendationEngine.test.js
describe('配色推荐引擎集成测试', () => {
  const engine = new ColorRecommendationEngine()
  
  test('完整推荐流程', async () => {
    const baseColor = '#87CEEB'
    const userProfile = {
      skinTone: 'cool',
      occasions: ['office'],
      stylePreferences: ['minimalist']
    }
    
    const result = await engine.generateAllRecommendations(baseColor, userProfile)
    
    expect(result.recommendations).toBeDefined()
    expect(result.recommendations.length).toBeGreaterThan(0)
    expect(result.classifications).toBeDefined()
    expect(result.summary).toBeDefined()
  })
})
3. 视觉回归测试
javascript// tests/visual/paletteRender.test.js
describe('配色方案视觉测试', () => {
  test('配色卡片渲染', async () => {
    const palette = {
      name: '测试配色',
      colors: ['#87CEEB', '#98FB98', '#FFFFFF'],
      metadata: { mood: ['清新'] }
    }
    
    const component = mount(PaletteCard, { props: { palette } })
    
    // 截图对比
    const screenshot = await component.screenshot()
    expect(screenshot).toMatchSnapshot('palette-card.png')
  })
})

📚 部署和维护
1. 配置文件
javascript// config/colorSystem.config.js
export const ColorSystemConfig = {
  
  // 算法参数
  algorithms: {
    seasonal: {
      springThresholds: { warmth: 0, lightness: 0.6, saturation: [0.4, 0.8] },
      summerThresholds: { warmth: -1, lightness: 0.5, saturation: [0, 0.5] },
      autumnThresholds: { warmth: 0, lightness: 0.5, saturation: [0.3, 0.7] },
      winterThresholds: { warmth: -1, saturation: 0.6, contrast: 0.6 }
    },
    
    geometric: {
      analogousAngles: [30, 45, 60],
      splitComplementaryAngles: [30, 40, 45],
      triadRotations: [0, 5, -5]
    }
  },
  
  // 缓存配置
  cache: {
    maxSize: 1000,
    ttl: 3600000, // 1小时
    preloadColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000']
  },
  
  // API配置
  api: {
    baseUrl: '/api/colors',
    timeout: 10000,
    retryAttempts: 3
  },
  
  // 性能配置
  performance: {
    workerCount: 4,
    batchSize: 50,
    virtualScrollThreshold: 100
  }
}
2. 监控和日志
javascriptclass ColorSystemMonitor {
  
  trackRecommendationGeneration(baseColor, duration, resultCount) {
    analytics.track('recommendation_generated', {
      baseColor,
      duration,
      resultCount,
      timestamp: new Date()
    })
  }
  
  trackClassificationAccuracy(color, predicted, actual) {
    if (predicted !== actual) {
      logger.warn('分类预测不准确', {
        color,
        predicted,
        actual,
        timestamp: new Date()
      })
    }
  }
  
  trackPerformanceMetrics() {
    const metrics = {
      cacheHitRate: this.calculateCacheHitRate(),
      averageGenerationTime: this.getAverageGenerationTime(),
      errorRate: this.getErrorRate()
    }
    
    logger.info('性能指标', metrics)
    return metrics
  }
}