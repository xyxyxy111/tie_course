# 在线教育平台项目

## 项目简介

本项目是一个基于 Vue 3 和 Vite 构建的在线教育平台。它旨在提供一个用户友好的界面，用于浏览课程、管理购物车、查看个人信息以及进行在线学习。

## 技术栈

-   **前端框架**: Vue 3
-   **构建工具**: Vite
-   **状态管理**: Vuex (如果适用，根据实际情况调整)
-   **路由**: Vue Router
-   **HTTP客户端**: Axios
-   **UI库**: (根据实际情况填写，例如：Ant Design Vue, Element Plus等)
-   **其他**: TypeScript, ESLint, Prettier

## 功能特性

-   **首页**：
    -   课程展示：展示热门课程和推荐课程。
    -   分类浏览：支持按分类浏览课程。
    -   用户登录/注册入口。
-   **课程搜索**：
    -   关键词搜索：允许用户输入关键词搜索相关课程。
    -   筛选功能：提供分类、标签、价格范围和排序等筛选条件。
-   **课程详情**：
    -   课程信息：展示课程标题、描述、价格、评分和评价等详细信息。
    -   章节列表：列出课程的所有章节和课时。
    -   加入购物车：允许用户将课程添加到购物车。
-   **购物车**：
    -   课程列表：展示购物车中的所有课程。
    -   数量调整：允许用户修改课程数量。
    -   移除课程：允许用户从购物车中移除课程。
    -   结算功能：提供结算入口。
-   **用户中心**：
    -   个人信息：展示和修改用户的基本信息、头像、密码等。
    -   我的学习：展示用户已购买和正在学习的课程。
    -   订单管理：查看用户的订单历史记录。
-   **在线学习**：
    -   视频播放：支持在线观看课程视频。
    -   学习进度：记录用户的学习进度。
    -   互动功能：提供评论、提问等互动功能。
-   **Token管理**：
    -   Token存储：使用 `localStorage` 安全存储用户 Token。
    -   Token有效性验证：定期检查 Token 是否过期，并自动清除过期 Token。
    -   Token自动刷新：(如果实现) 支持静默刷新 Token，保持用户登录状态。
-   **调试配置**：
    -   提供调试页面，显示环境信息、Token 状态和 API 配置。
    -   支持一键清除 Token 和测试 API 配置。

## 项目结构

```
course/
├── .env.development       # 开发环境配置
├── .env.production        # 生产环境配置
├── .eslintrc.js           # ESLint 配置文件
├── .gitignore             # Git 忽略文件
├── .prettierrc            # Prettier 配置文件
├── env.d.ts               # TypeScript 环境变量声明
├── OPTIMIZATION_SUMMARY.md # 优化总结
├── package.json           # 项目依赖和脚本
├── pnpm-lock.yaml         # 包管理锁定文件
├── README.md              # 项目说明文档
├── TOKEN_TROUBLESHOOTING.md # Token 问题排查指南
├── tsconfig.app.json      # TypeScript 应用配置
├── tsconfig.json          # TypeScript 根配置
├── tsconfig.node.json     # TypeScript Node 配置
├── vite.config.ts         # Vite 配置文件
├── .vscode/               # VSCode 相关配置
│   ├── extensions.json    # 推荐安装的 VSCode 插件
│   └── settings.json      # VSCode 设置
├── public/                # 静态资源目录
│   ├── *.html             # HTML 页面
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码目录
│   ├── api/               # API 接口定义
│   ├── assets/            # 静态资源
│   ├── components/        # Vue 组件
│   ├── composables/       # Vue composables
│   ├── pages/             # 页面组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理 (Vuex 或 Pinia)
│   ├── styles/            # 全局样式
│   ├── utils/             # 工具函数
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
└── ...
```

## 环境变量配置

-   `VITE_API_BASE_URL`: 后端 API 基础地址 (例如: `http://localhost:8080`)。
-   `VITE_MOCK_ENABLED`: 是否启用 Mock 数据 (`true` 或 `false`)。

请根据您的实际环境配置 `.env.development` 和 `.env.production` 文件。

## 快速开始

1.  **克隆项目**

    ```sh
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **安装依赖**

    ```sh
    pnpm install
    ```

3.  **配置环境变量**

    创建 `.env.development` 文件，并配置 `VITE_API_BASE_URL`。

    ```
    VITE_API_BASE_URL=http://localhost:8080
    ```

4.  **运行开发服务器**

    ```sh
    pnpm run dev
    ```

    访问 `http://localhost:5173` 查看效果。

## 脚本命令

-   `dev`: 运行开发服务器。
-   `build`: 构建生产版本。
-   `serve`: 预览生产版本。
-   `lint`: 执行 ESLint 代码检查。
-   `format`: 使用 Prettier 格式化代码。

## Token 问题排查

请参考 [TOKEN_TROUBLESHOOTING.md](TOKEN_TROUBLESHOOTING.md) 文件，了解 Token 管理和问题排查方法。

## API 配置

API 基础地址在 `src/utils/request.ts` 中配置。开发环境使用代理，生产环境直接访问后端 API。

```typescript
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Vite 代理配置

在 `vite.config.ts` 中配置了 Vite 代理，将 `/api` 请求代理到后端服务器。

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```
