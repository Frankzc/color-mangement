{
  "design_principles": {
    "data_compression": "使用字典映射，压缩数据到1-2个字母",
    "cultural_support": "一个颜色支持多文化描述",
    "grouping_ready": "为4600色分组和合并做准备",
    "performance_first": "主表精简，详细信息分离"
  },

  // =====================================
  // 📊 主颜色表结构 (极度精简)
  // =====================================
  "colors_table": {
    "description": "主表保持极度精简，高频查询优化",
    "sample_record": {
      // 🔑 基础标识
      "id": "c0001",
      "hex": "#DC143C", 
      "rgb": [220, 20, 60],           // 简化：数组格式节省空间
      "hsl": [348, 83, 47],           // 简化：数组格式
      
      // 📝 基础名称
      "name": "中国红",               // 主要名称（中文优先）
      "name_en": "Chinese Red",       // 英文名称
      
      // 🏛️ 文化归属
      "culture": "ch",                // 主文化（压缩）：ch|jp|in|mx|pe|af|tu|my|no
      "cultures": ["ch", "in"],       // 多文化支持
      
      // 🎨 专业分类（压缩码）
      "seasons": ["au", "wi"],        // 季节：sp|su|au|wi
      "apps": ["fo", "tr", "ce"],     // 应用：fo=formal, tr=traditional, ce=celebration
      "moods": ["po", "fe", "pa"],    // 情感：po=powerful, fe=festive, pa=passionate
      "styles": ["tr", "lu"],         // 风格：tr=traditional, lu=luxury
      
      // ⚡ 性能字段
      "group": "g001",                // 分组ID
      "pop": 85,                      // 热门度 0-100
      "has_desc": true                // 是否有详细描述
    }
  },

  // =====================================
  // 📚 分类字典系统 (1-2字母编码)
  // =====================================
  "classification_dictionaries": {
    
    // 文化编码
    "cultures": {
      "ch": {"name": "中国", "name_en": "Chinese"},
      "jp": {"name": "日本", "name_en": "Japanese"},
      "in": {"name": "印度", "name_en": "Indian"},
      "mx": {"name": "墨西哥", "name_en": "Mexican"},
      "pe": {"name": "波斯", "name_en": "Persian"},
      "af": {"name": "非洲", "name_en": "African"},
      "tu": {"name": "土耳其", "name_en": "Turkish"},
      "my": {"name": "玛雅", "name_en": "Mayan"},
      "no": {"name": "北欧", "name_en": "Nordic"},
      "we": {"name": "西方", "name_en": "Western"}
    },
    
    // 季节编码
    "seasons": {
      "sp": {"name": "春季", "name_en": "Spring"},
      "su": {"name": "夏季", "name_en": "Summer"},
      "au": {"name": "秋季", "name_en": "Autumn"},
      "wi": {"name": "冬季", "name_en": "Winter"}
    },
    
    // 应用场景编码
    "applications": {
      "fo": {"name": "正装", "name_en": "Formal"},
      "ca": {"name": "休闲", "name_en": "Casual"},
      "tr": {"name": "传统", "name_en": "Traditional"},
      "ce": {"name": "庆典", "name_en": "Celebration"},
      "we": {"name": "婚礼", "name_en": "Wedding"},
      "bu": {"name": "商务", "name_en": "Business"},
      "ev": {"name": "晚装", "name_en": "Evening"},
      "sp": {"name": "运动", "name_en": "Sport"}
    },
    
    // 情感表达编码
    "moods": {
      "po": {"name": "有力", "name_en": "Powerful"},
      "fe": {"name": "喜庆", "name_en": "Festive"},
      "pa": {"name": "热情", "name_en": "Passionate"},
      "ca": {"name": "冷静", "name_en": "Calm"},
      "el": {"name": "优雅", "name_en": "Elegant"},
      "en": {"name": "活力", "name_en": "Energetic"},
      "so": {"name": "宁静", "name_en": "Soothing"},
      "my": {"name": "神秘", "name_en": "Mysterious"}
    },
    
    // 风格定位编码
    "styles": {
      "tr": {"name": "传统", "name_en": "Traditional"},
      "mo": {"name": "现代", "name_en": "Modern"},
      "lu": {"name": "奢华", "name_en": "Luxury"},
      "mi": {"name": "极简", "name_en": "Minimalist"},
      "vi": {"name": "复古", "name_en": "Vintage"},
      "bo": {"name": "波西米亚", "name_en": "Bohemian"},
      "in": {"name": "工业", "name_en": "Industrial"},
      "na": {"name": "自然", "name_en": "Natural"}
    }
  },

  // =====================================
  // 📊 颜色分组表
  // =====================================
  "color_groups": {
    "description": "Delta E 分组，解决4600色相似问题",
    "sample_record": {
      "id": "g001",
      "name": "中国红族",
      "master": "c0001",              // 主颜色ID
      "members": ["c0001", "c0234", "c0456"],
      "delta_avg": 3.2,               // 平均 Delta E
      "cultures": {"ch": 3, "we": 1}, // 文化分布
      "size": 4                       // 成员数量
    }
  },

  // =====================================
  // 📖 文化描述表 (按需加载)
  // =====================================
  "cultural_descriptions": {
    "description": "详细文化描述，懒加载",
    "sample_record": {
      "id": "d0001",
      "color": "c0001",
      "culture": "ch",
      "priority": 1,                  // 该文化的重要性
      "original_name": "朱红",
      "meaning": "喜庆吉祥，节庆必备色彩",
      "usage": ["春节", "婚礼", "宫廷建筑"],
      "period": "古代",
      "symbolic": ["prosperity", "celebration", "good_fortune"]
    }
  },

  // =====================================
  // 🎯 4600色库应用场景分析
  // =====================================
  "color_library_scenarios": {
    
    "design_professional": {
      "target_users": ["时装设计师", "品牌设计师", "UI设计师"],
      "color_needs": "精确色彩匹配，专业色彩理论支持",
      "group_preference": "保持完整4600色，按分组浏览",
      "key_features": [
        "精确 Delta E 匹配",
        "专业色彩空间支持 (LAB, CMYK)",
        "文化色彩研究",
        "趋势色彩分析"
      ]
    },
    
    "fashion_brands": {
      "target_users": ["时尚品牌", "服装公司", "零售商"],
      "color_needs": "季节性色彩规划，市场趋势跟踪",
      "group_preference": "分组展示，重点突出流行色",
      "key_features": [
        "季节色彩集合",
        "品牌色彩管理",
        "供应链色彩标准化",
        "流行趋势预测"
      ]
    },
    
    "cultural_research": {
      "target_users": ["文化研究者", "博物馆", "教育机构"],
      "color_needs": "完整文化色彩资料，历史准确性",
      "group_preference": "保持所有变体，不合并",
      "key_features": [
        "完整文化背景资料",
        "历史时期分类",
        "地域文化对比",
        "传统工艺应用"
      ]
    },
    
    "general_users": {
      "target_users": ["普通用户", "业余爱好者", "学生"],
      "color_needs": "易用性，基础配色指导",
      "group_preference": "大幅简化，只显示代表色",
      "key_features": [
        "简化分组显示 (300-500色)",
        "基础配色建议",
        "流行色推荐",
        "易懂的分类标签"
      ]
    }
  },

  // =====================================
  // 🔄 颜色合并策略分析
  // =====================================
  "color_merging_strategies": {
    
    "delta_e_grouping": {
      "description": "基于 Delta E < 5 的科学分组",
      "threshold": {
        "professional": 3,    // 专业设计师：严格标准
        "general": 5,         // 普通用户：宽松标准  
        "basic": 8            // 基础用户：很宽松
      },
      "benefits": [
        "减少视觉重复",
        "提升选择效率", 
        "专业科学依据",
        "保持色彩精度"
      ],
      "estimated_result": "4600色 → 约1200组"
    },
    
    "cultural_priority": {
      "description": "优先保留文化重要性高的颜色",
      "rules": [
        "传统文化色彩：优先级1（永不合并）",
        "现代流行色：优先级2（谨慎合并）",
        "机器生成色：优先级3（积极合并）"
      ],
      "benefits": [
        "保护文化价值",
        "维持专业性",
        "兼顾实用性"
      ]
    },
    
    "usage_based": {
      "description": "基于使用频率和热度合并",
      "metrics": [
        "查看次数",
        "收藏频率",
        "搜索热度",
        "下载统计"
      ],
      "strategy": "低使用率的相似色优先合并",
      "benefits": [
        "符合实际需求",
        "动态优化",
        "数据驱动"
      ]
    }
  },

  // =====================================
  // ⏱️ 实施时间计划 (小时)
  // =====================================
  "implementation_timeline": {
    
    "phase_1_data_structure": {
      "description": "设计和实现新数据结构",
      "tasks": {
        "设计分类字典": 8,
        "设计主表结构": 6,
        "设计分组表结构": 4,
        "设计文化描述表": 4,
        "数据结构验证": 2
      },
      "total_hours": 24,
      "deliverables": [
        "完整数据库设计文档",
        "分类字典定义",
        "数据结构 JSON Schema"
      ]
    },
    
    "phase_2_data_migration": {
      "description": "现有数据转换和导入",
      "tasks": {
        "编写数据转换脚本": 12,
        "现有1300色数据迁移": 6,
        "新增3300色数据导入": 8,
        "文化描述提取整理": 10,
        "数据质量验证": 4
      },
      "total_hours": 40,
      "deliverables": [
        "4600色完整数据库",
        "分类标签自动化",
        "数据质量报告"
      ]
    },
    
    "phase_3_grouping": {
      "description": "颜色分组和合并算法",
      "tasks": {
        "Delta E 计算实现": 8,
        "分组算法开发": 12,
        "分组结果优化": 6,
        "多精度分组支持": 4
      },
      "total_hours": 30,
      "deliverables": [
        "1200个颜色分组",
        "多层级分组支持",
        "分组质量评估"
      ]
    },
    
    "phase_4_frontend": {
      "description": "前端界面适配",
      "tasks": {
        "colorStore 重构": 8,
        "筛选组件升级": 6,
        "分组显示功能": 8,
        "文化描述懒加载": 4,
        "性能优化": 6
      },
      "total_hours": 32,
      "deliverables": [
        "升级后的前端界面",
        "分组切换功能",
        "性能提升 50%+"
      ]
    },
    
    "phase_5_testing": {
      "description": "测试和优化",
      "tasks": {
        "功能测试": 8,
        "性能测试": 4,
        "用户体验测试": 6,
        "bug修复和优化": 8
      },
      "total_hours": 26,
      "deliverables": [
        "稳定的生产版本",
        "性能基准报告",
        "用户反馈整理"
      ]
    }
  },

  // =====================================
  // 📊 总结和关键指标
  // =====================================
  "project_summary": {
    "total_implementation_hours": 152,
    "estimated_timeline": "3-4周（全职开发）",
    
    "key_improvements": {
      "data_compression": "字段压缩 60%+",
      "query_performance": "查询速度提升 3-5倍", 
      "cultural_support": "支持10+文化体系",
      "grouping_efficiency": "4600色 → 1200组",
      "scalability": "支持未来扩展到10000+色"
    },
    
    "risk_mitigation": {
      "data_loss": "完整备份现有数据",
      "compatibility": "保持API向后兼容",
      "performance": "渐进式发布，监控性能",
      "user_experience": "A/B测试确保体验提升"
    }
  }
}