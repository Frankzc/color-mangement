// ===== README.md =====
# 时装设计师颜色管理系统

一个专业的颜色管理工具，为时装设计师提供完整的色彩解决方案。

## ✨ 特性

- 🔍 **智能搜索** - 支持中英文颜色名称、HEX、RGB值搜索
- 🎨 **1302+ 专业颜色** - 包含168个国风传统色彩
- 📱 **响应式设计** - 完美适配电脑和手机界面
- 📸 **图片取色** - 从图片中提取和匹配颜色
- 🎡 **色环选色** - 12/24色环，4-10阶深度可调
- ❤️ **收藏管理** - 颜色收藏和配色方案管理
- 🎯 **配色推荐** - 基于色彩理论的智能配色建议
- 👤 **用户系统** - 个人偏好和操作记录保存

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 🏗️ 项目结构

```
src/
├── components/          # 组件
│   ├── common/         # 通用组件
│   ├── color/          # 颜色相关组件
│   ├── search/         # 搜索相关组件
│   └── navigation/     # 导航组件
├── views/              # 页面组件
├── stores/             # Pinia状态管理
├── utils/              # 工具函数
├── styles/             # 样式文件
└── assets/             # 静态资源
```

## 📦 部署到 Hostinger

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 文件夹中的所有文件上传到 Hostinger 的 `public_html` 目录

3. 在 `public_html` 目录创建 `.htaccess` 文件：
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🎨 预设用户账号

| 用户名 | 密码 | 说明 |
|--------|------|------|
| designer | fashion123 | 时装设计师账号 |
| admin | admin123 | 管理员账号 |

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Composition API
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS + SCSS
- **构建工具**: Vite
- **颜色处理**: Chroma.js
- **图片处理**: Fabric.js + ColorThief

## 📝 开发计划

- [x] 基础架构搭建
- [x] 颜色搜索功能
- [ ] 图片取色功能
- [ ] 色环选色功能
- [ ] 配色方案生成
- [ ] 用户系统完善
- [ ] 性能优化

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License