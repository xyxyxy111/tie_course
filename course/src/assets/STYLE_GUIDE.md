# 成熟项目样式组织指南

## 🎯 设计原则

### 1. 原子化设计 (Atomic Design)
```
Atoms (原子) → Molecules (分子) → Organisms (有机体) → Templates (模板) → Pages (页面)
```

### 2. 组件化思维
- 每个组件都是独立的样式单元
- 组件样式应该自包含，不依赖外部样式
- 使用CSS Modules或Scoped Styles避免样式冲突

### 3. 设计系统 (Design System)
- 统一的颜色、字体、间距、阴影等设计令牌
- 可复用的组件库
- 清晰的设计规范文档

## 📁 文件组织结构

```
src/
├── assets/
│   ├── styles/
│   │   ├── base/                 # 基础样式
│   │   │   ├── reset.css         # 重置样式
│   │   │   ├── typography.css    # 字体样式
│   │   │   ├── variables.css     # CSS变量
│   │   │   └── utilities.css     # 工具类
│   │   ├── components/           # 组件样式
│   │   │   ├── buttons.css
│   │   │   ├── forms.css
│   │   │   ├── cards.css
│   │   │   └── navigation.css
│   │   ├── layouts/              # 布局样式
│   │   │   ├── grid.css
│   │   │   ├── header.css
│   │   │   ├── sidebar.css
│   │   │   └── footer.css
│   │   ├── pages/                # 页面样式
│   │   │   ├── home.css
│   │   │   ├── login.css
│   │   │   └── dashboard.css
│   │   ├── themes/               # 主题样式
│   │   │   ├── light.css
│   │   │   └── dark.css
│   │   └── main.css              # 主样式文件
│   └── icons/                    # 图标资源
├── components/
│   ├── ui/                       # 基础UI组件
│   │   ├── Button/
│   │   │   ├── Button.vue
│   │   │   ├── Button.css
│   │   │   └── index.ts
│   │   └── Card/
│   └── layout/                   # 布局组件
└── pages/
    └── [page]/
        ├── [Page].vue
        └── [Page].css
```

## 🎨 CSS变量系统

### 1. 设计令牌 (Design Tokens)
```css
:root {
  /* 颜色系统 */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  /* 字体系统 */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* 间距系统 */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-8: 2rem;
  --spacing-16: 4rem;
  
  /* 圆角系统 */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* 阴影系统 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* 动画系统 */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}
```

### 2. 语义化变量
```css
:root {
  /* 语义化颜色 */
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-muted: var(--color-gray-500);
  --color-background-primary: var(--color-white);
  --color-background-secondary: var(--color-gray-50);
  --color-border-primary: var(--color-gray-200);
  --color-border-secondary: var(--color-gray-100);
  
  /* 状态颜色 */
  --color-success: var(--color-green-500);
  --color-warning: var(--color-yellow-500);
  --color-error: var(--color-red-500);
  --color-info: var(--color-blue-500);
}
```

## 🧩 组件样式规范

### 1. 组件样式结构
```css
/* 组件基础样式 */
.component {
  /* 布局 */
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  
  /* 尺寸 */
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  
  /* 颜色 */
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  
  /* 字体 */
  font-family: var(--font-family-sans);
  font-size: var(--font-size-sm);
  font-weight: 500;
  
  /* 动画 */
  transition: all var(--transition-normal);
}

/* 组件状态 */
.component:hover {
  background-color: var(--color-background-secondary);
  border-color: var(--color-border-secondary);
}

.component:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.component:active {
  transform: translateY(1px);
}

/* 组件变体 */
.component--primary {
  background-color: var(--color-primary-500);
  color: var(--color-white);
  border-color: var(--color-primary-500);
}

.component--secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  border-color: var(--color-gray-200);
}

.component--danger {
  background-color: var(--color-error);
  color: var(--color-white);
  border-color: var(--color-error);
}

/* 组件尺寸 */
.component--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-xs);
}

.component--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
}

/* 组件禁用状态 */
.component:disabled,
.component--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### 2. 响应式设计
```css
/* 移动优先 */
.component {
  /* 基础样式 (移动端) */
  width: 100%;
  padding: var(--spacing-3);
}

/* 平板 */
@media (min-width: 768px) {
  .component {
    width: auto;
    padding: var(--spacing-3) var(--spacing-4);
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .component {
    padding: var(--spacing-4) var(--spacing-6);
  }
}

/* 大屏 */
@media (min-width: 1280px) {
  .component {
    padding: var(--spacing-5) var(--spacing-8);
  }
}
```

## 🛠️ 工具类系统

### 1. 布局工具类
```css
/* Flexbox */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: var(--spacing-1); }
.gap-2 { gap: var(--spacing-2); }
.gap-4 { gap: var(--spacing-4); }

/* Grid */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

/* 间距 */
.p-1 { padding: var(--spacing-1); }
.p-2 { padding: var(--spacing-2); }
.p-4 { padding: var(--spacing-4); }
.m-1 { margin: var(--spacing-1); }
.m-2 { margin: var(--spacing-2); }
.m-4 { margin: var(--spacing-4); }
```

### 2. 文本工具类
```css
/* 字体大小 */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }

/* 字体粗细 */
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* 文本颜色 */
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-muted { color: var(--color-text-muted); }
.text-success { color: var(--color-success); }
.text-error { color: var(--color-error); }
```

### 3. 背景和边框工具类
```css
/* 背景 */
.bg-primary { background-color: var(--color-background-primary); }
.bg-secondary { background-color: var(--color-background-secondary); }
.bg-success { background-color: var(--color-success); }
.bg-error { background-color: var(--color-error); }

/* 边框 */
.border { border: 1px solid var(--color-border-primary); }
.border-0 { border: none; }
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
```

## 📱 响应式断点系统

```css
/* 断点定义 */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* 容器最大宽度 */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

## 🎭 主题系统

### 1. 主题切换
```css
/* 浅色主题 (默认) */
:root {
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
}

/* 深色主题 */
[data-theme="dark"] {
  --color-background: #000000;
  --color-foreground: #ffffff;
  --color-primary: #60a5fa;
  --color-secondary: #9ca3af;
}

/* 自动主题 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --color-background: #000000;
    --color-foreground: #ffffff;
    --color-primary: #60a5fa;
    --color-secondary: #9ca3af;
  }
}
```

### 2. 主题切换组件
```vue
<template>
  <button @click="toggleTheme" class="theme-toggle">
    <SunIcon v-if="isDark" />
    <MoonIcon v-else />
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
})
</script>
```

## 🔧 构建和优化

### 1. PostCSS配置
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    }),
  ],
}
```

### 2. CSS模块化
```vue
<template>
  <div :class="$style.container">
    <h1 :class="$style.title">标题</h1>
  </div>
</template>

<style module>
.container {
  padding: var(--spacing-4);
}

.title {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}
</style>
```

## 📋 最佳实践

### 1. 命名规范
- 使用BEM命名法: `.block__element--modifier`
- 组件使用kebab-case: `.user-profile`
- 工具类使用简洁命名: `.text-center`

### 2. 性能优化
- 避免深层嵌套 (最多3层)
- 使用CSS变量减少重复
- 合理使用CSS选择器
- 避免使用!important

### 3. 可维护性
- 每个组件一个样式文件
- 使用语义化的类名
- 添加适当的注释
- 保持样式的一致性

### 4. 可访问性
- 确保足够的颜色对比度
- 支持键盘导航
- 提供焦点指示器
- 支持屏幕阅读器

## 🚀 实施建议

1. **渐进式迁移**: 从新组件开始，逐步迁移现有组件
2. **设计系统**: 建立统一的设计令牌和组件库
3. **文档化**: 维护样式指南和组件文档
4. **代码审查**: 建立样式代码审查流程
5. **自动化**: 使用工具自动检查和格式化样式代码

这个指南提供了一个完整的样式组织框架，可以根据项目需求进行调整和扩展。 