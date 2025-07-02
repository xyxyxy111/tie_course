/// <reference types="vite/client" />

// 声明Vite环境变量
interface ImportMetaEnv {
  /**
   * 后端API基础地址（必须）
   * @example 'http://localhost:3000/api'
   */
  readonly VITE_API_BASE_URL: string;

  /**
   * 是否启用Mock数据（可选）
   * @default 'false'
   */
  readonly VITE_MOCK_ENABLED?: 'true' | 'false';

  // 添加其他自定义变量...
}

// 扩展ImportMeta接口
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Vue文件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
