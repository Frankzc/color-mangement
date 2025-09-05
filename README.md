# 时装设计师颜色管理系统

<div align="center">
  <h3>🎨 专业的时装设计师颜色搜索、管理和配色方案工具</h3>
  
  [![Vue 3](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

## 📖 项目简介

这是一个专为时装设计师打造的颜色管理系统，提供了1302个专业颜色（包含168个国风传统色彩）的智能搜索、筛选、收藏和配色方案生成功能。系统采用现代化的 Vue 3 + Vite 技术栈，提供流畅的用户体验。

## ✨ 核心功能

### 🔍 智能搜索系统
- **多维度搜索**：支持中文名称、英文名称、HEX值搜索
- **模糊匹配**：使用 Fuse.js 实现智能模糊搜索
- **实时预览**：搜索结果实时更新，无需等待
- **搜索建议**：提供智能搜索建议和自动补全

### 🎯 高级筛选功能
- **颜色分类筛选**：红色系、蓝色系、绿色系等10大色系
- **时尚标签筛选**：春夏秋冬季节、商务休闲风格等15+标签
- **国风色彩筛选**：专门筛选168个中国传统色彩
- **组合筛选**：支持多条件同时筛选

### 📊 智能排序系统
- **按名称排序**：中文拼音智能排序
- **按色相排序**：基于HSL色彩空间的色相排序
- **按亮度排序**：从最亮到最暗的亮度排序
- **按饱和度排序**：色彩饱和度高低排序
- **升序/降序切换**：一键切换排序方向

### 💖 收藏管理系统
- **一键收藏**：点击心形图标即可收藏/取消收藏
- **收藏计数**：顶部导航实时显示收藏数量
- **收藏列表**：专门的收藏管理页面
- **本地存储**：收藏数据持久化保存
- **批量操作**：支持批量删除收藏

### 🎨 配色方案生成
- **互补色方案**：基于色彩理论的互补色生成
- **三角色方案**：120度间隔的和谐配色
- **类似色方案**：相邻色相的柔和配色
- **单色系方案**：同色相不同明度的配色
- **相似色查找**：基于HSL算法的颜色相似度计算

### 📱 响应式设计
- **移动端优化**：完美适配手机、平板、桌面端
- **触控友好**：针对触摸设备优化的交互体验
- **自适应网格**：智能调整颜色卡片布局
- **性能优化**：虚拟滚动和分页加载

### 👤 用户系统
- **演示账号登录**：designer/fashion123, admin/admin123
- **用户偏好设置**：记住用户的筛选和排序偏好
- **登录状态管理**：安全的用户状态管理

## 🎯 技术特色

### 🚀 性能优化
- **分页加载**：每页48个颜色，按需加载更多
- **防重复显示**：洗牌算法确保颜色不重复
- **懒加载**：图片和组件的智能懒加载
- **缓存策略**：智能的数据缓存机制

### 🎨 用户体验
- **流畅动画**：CSS3动画和过渡效果
- **视觉反馈**：hover、点击等交互状态反馈
- **加载状态**：友好的加载和空状态提示
- **错误处理**：完善的错误处理和用户提示

### 🔧 开发体验
- **模块化设计**：清晰的组件和状态管理架构
- **TypeScript支持**：完整的类型支持（可选）
- **热重载**：快速的开发调试体验
- **代码规范**：ESLint + Prettier 代码规范

## 🛠️ 技术栈

### 前端框架
- **Vue 3.4+** - 现代化的渐进式框架
- **Vite 5.0+** - 极速的构建工具
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 新一代状态管理

### UI 组件库
- **Tailwind CSS 3.3+** - 原子化CSS框架
- **Heroicons** - 精美的SVG图标库
- **SCSS** - CSS预处理器

### 核心依赖
- **chroma-js** - 强大的颜色处理库
- **fuse.js** - 模糊搜索引擎
- **lodash-es** - 实用工具函数库
- **@vueuse/core** - Vue组合式API工具集

### 开发工具
- **@vitejs/plugin-vue** - Vue单文件组件支持
- **sass** - SCSS编译器
- **autoprefixer** - CSS自动前缀
- **postcss** - CSS后处理器

## 📁 项目结构

```
fashion-color-app/
├── public/                     # 静态资源
│   ├── colors.json            # 颜色数据文件 (1302个颜色)
│   ├── index.html            # HTML模板
│   └── manifest.json         # PWA配置
├── src/
│   ├── components/           # 组件目录
│   │   ├── auth/            # 认证相关组件
│   │   │   └── LoginModal.vue
│   │   ├── color/           # 颜色相关组件
│   │   │   ├── ColorCard.vue
│   │   │   ├── ColorGrid.vue
│   │   │   └── ColorDetailModal.vue
│   │   ├── common/          # 通用组件
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseLoading.vue
│   │   │   └── BaseToast.vue
│   │   ├── favorites/       # 收藏相关组件
│   │   │   ├── FavoriteColorCard.vue
│   │   │   └── FavoritesModal.vue
│   │   ├── navigation/      # 导航组件
│   │   │   └── MainNav.vue
│   │   └── search/          # 搜索相关组件
│   │       ├── FilterPanel.vue
│   │       ├── SearchBar.vue
│   │       └── SortControls.vue
│   ├── stores/              # Pinia状态管理
│   │   ├── colorStore.js    # 颜色数据状态
│   │   ├── favoriteStore.js # 收藏状态
│   │   ├── uiStore.js       # UI状态
│   │   └── index.js         # 状态入口
│   ├── styles/              # 样式文件
│   │   ├── main.scss        # 主样式
│   │   ├── variables.scss   # SCSS变量
│   │   ├── base.scss        # 基础样式
│   │   ├── components.scss  # 组件样式
│   │   └── responsive.scss  # 响应式样式
│   ├── utils/               # 工具函数
│   │   ├── colorUtils.js    # 颜色处理工具
│   │   ├── imageUtils.js    # 图片处理工具
│   │   └── constants.js     # 常量定义
│   ├── views/               # 页面组件
│   │   ├── SearchView.vue   # 搜索主页
│   │   ├── FavoritesView.vue # 收藏页面
│   │   └── ProfileView.vue  # 个人中心
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── App.vue             # 根组件
│   └── main.js             # 应用入口
├── package.json            # 项目配置
├── vite.config.js         # Vite配置
├── tailwind.config.js     # Tailwind配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js 16.0+ 
- npm 7.0+ 或 yarn 1.22+

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/fashion-color-app.git
cd fashion-color-app
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **打开浏览器访问**
```
http://localhost:5173
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📊 数据说明

### 颜色数据结构
```json
{
  "hex": "#FF6B6B",
  "chinese": "珊瑚红",
  "english": "Coral Red",
  "rgb": { "r": 255, "g": 107, "b": 107 },
  "cmyk": { "c": 0, "m": 58, "y": 58, "k": 0 },
  "hsl": { "h": 0, "s": 100, "l": 71 },
  "category": "红色系",
  "tags": ["夏季时尚", "活力色彩", "暖色调"],
  "guofeng": "胭脂",
  "pantone": "Pantone 1787 C",
  "brightness": 149,
  "contrast": "#000000"
}
```

### 数据统计
- **总颜色数量**: 1302个
- **国风传统色彩**: 168个
- **颜色分类**: 10大色系
- **时尚标签**: 15+个标签
- **Pantone色卡**: 覆盖主要色卡

## 🎨 功能演示

### 搜索功能
- 搜索 "红色" - 显示所有红色系颜色
- 搜索 "blue" - 显示所有蓝色英文名称
- 搜索 "#FF0000" - 精确HEX值搜索
- 搜索 "航空" - 模糊匹配相关颜色

### 筛选功能
- 选择 "蓝色系" - 只显示蓝色分类
- 选择 "夏季时尚" - 显示夏季相关颜色
- 勾选 "国风色彩" - 只显示传统色彩
- 组合筛选 - 同时应用多个条件

### 排序功能
- 按名称排序 - 中文拼音排序
- 按色相排序 - 彩虹色谱顺序
- 按亮度排序 - 从亮到暗排列

### 收藏功能
- 点击 ❤️ 收藏颜色
- 顶部显示收藏计数
- 点击计数查看收藏列表

## 👥 演示账号

系统提供以下演示账号：

| 用户类型 | 用户名 | 密码 | 权限说明 |
|---------|--------|------|----------|
| 设计师 | designer | fashion123 | 完整功能权限 |
| 管理员 | admin | admin123 | 系统管理权限 |

## 🌐 部署指南

### Hostinger部署

1. **构建项目**
```bash
npm run build
```

2. **上传文件**
- 将 `dist` 文件夹内容上传到 `public_html`
- 确保 `colors.json` 在根目录

3. **配置 .htaccess**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Vercel部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Netlify部署

1. 连接Git仓库
2. 设置构建命令: `npm run build`
3. 设置发布目录: `dist`

## 🔧 开发指南

### 添加新颜色

1. 编辑 `public/colors.json`
2. 按照数据结构添加新颜色
3. 重新加载页面即可生效

### 自定义主题

1. 修改 `src/styles/variables.scss`
2. 调整 `tailwind.config.js` 配置
3. 重新构建项目

### 添加新功能

1. 在对应目录创建组件
2. 在路由中注册页面
3. 在状态管理中添加逻辑

## 🐛 问题排查

### 常见问题

1. **颜色数据无法加载**
   - 检查 `public/colors.json` 是否存在
   - 确认文件格式是否正确

2. **搜索功能异常**
   - 清除浏览器缓存
   - 检查控制台错误信息

3. **收藏功能失效**
   - 检查浏览器是否支持 localStorage
   - 清除本地存储数据

### 性能优化建议

1. **大数据集优化**
   - 启用虚拟滚动
   - 实现服务端搜索

2. **图片优化**
   - 使用 WebP 格式
   - 实现渐进式加载

## 📈 性能指标

- **首屏加载时间**: < 2秒
- **搜索响应时间**: < 300ms
- **筛选处理时间**: < 100ms
- **移动端适配**: 100%兼容
- **浏览器兼容**: Chrome 90+, Firefox 90+, Safari 14+

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -am '添加新功能'`)
4. 推送分支 (`git push origin feature/新功能`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 📞 联系方式

- 项目作者: [您的姓名]
- 邮箱: your.email@example.com
- GitHub: https://github.com/your-username
- 演示地址: https://your-demo-url.com

## 🙏 致谢

感谢以下开源项目的支持：
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Heroicons](https://heroicons.com/) - 精美的SVG图标
- [chroma-js](https://gka.github.io/chroma.js/) - JavaScript颜色操作库

---

<div align="center">
  <p>🎨 让色彩为设计赋能 | Built with ❤️ by Fashion Designers</p>
</div>