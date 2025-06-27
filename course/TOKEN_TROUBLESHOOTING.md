# JWT Token 故障排除指南

## 问题描述
在访问需要认证的API接口（如 `/profile`）时，出现以下错误：
```
com.auth0.jwt.exceptions.JWTDecodeException: The token was expected to have 3 parts, but got 0.
```

或者出现静态资源错误：
```
org.springframework.web.servlet.resource.NoResourceFoundException: No static resource profile.
```

## 问题原因
1. **Token为undefined**: 前端传递的token值为 `undefined`，导致JWT解码失败
2. **Token存储问题**: 登录时token没有正确保存到localStorage
3. **Token验证逻辑**: 请求拦截器没有正确验证token的有效性
4. **API响应格式**: 登录API返回的token直接是字符串，而不是包含token字段的对象
5. **API地址配置错误**: baseURL配置错误，导致请求发送到错误的地址
6. **Authorization头格式错误**: 缺少 `Bearer` 前缀
7. **代理配置问题**: 开发环境和生产环境的API地址配置不一致

## 解决方案

### 1. 修复API配置（重要：支持代理）
在 `src/utils/request.ts` 中，确保正确的API地址和请求头格式：

```typescript
const instance = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'http://localhost:8080',  // 开发环境使用代理，生产环境直接访问
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = getValidToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // 确保包含Bearer前缀
    console.log('请求头已设置Authorization:', `Bearer ${token.substring(0, 20)}...`);
  } else {
    console.log('未找到有效token，跳过Authorization设置');
  }
  return config;
});
```

### 2. 确认Vite代理配置
确保 `vite.config.ts` 中有正确的代理配置：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 移除/api前缀
      },
    },
  },
  // ... 其他配置
})
```

### 3. 检查token是否有效
在 `src/utils/request.ts` 中，我们添加了token有效性检查：

```typescript
// 检查token是否有效
export const isValidToken = (token: string | null): boolean => {
  return token !== null && token !== undefined && token !== 'undefined' && token.trim() !== '';
};

// 获取有效的token
export const getValidToken = (): string | null => {
  const token = localStorage.getItem('token');
  return isValidToken(token) ? token : null;
};
```

### 4. 修复登录逻辑
**重要：** 登录API的响应格式是：
```json
{
  "status": 1011,
  "message": "用户登录成功",
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

token直接作为 `data` 字段的值返回，而不是 `data.token`。

在登录成功后，确保token正确保存：

```typescript
// 修复：token直接是res.data，而不是res.data.token
if (res.data && typeof res.data === 'string') {
  localStorage.setItem('token', res.data);
  console.log('Token已保存:', res.data);
} else {
  console.error('登录响应中没有有效的token');
  // 处理错误
}
```

### 5. 更新API类型定义
更新 `src/api/user.ts` 中的类型定义：

```typescript
// 手机号+验证码登录
loginByCaptcha: (data: LoginByCaptchaParams) => {
  return request<string>({  // 注意：这里返回的是string，不是{token: string}
    method: 'POST',
    url: '/auth/sessions/by-captcha',
    data
  });
},
```

### 6. 添加响应拦截器
处理token过期或无效的情况：

```typescript
instance.interceptors.response.use(
  (response) => {
    // 处理成功响应
    return response.data;
  },
  (error) => {
    // 处理token相关错误
    if (error.response) {
      const { status } = error.response;
      
      // 401 未授权，可能是token过期或无效
      if (status === 401) {
        console.log('Token无效或已过期，清除本地token');
        localStorage.removeItem('token');
        
        // 重定向到登录页面
        if (!window.location.pathname.includes('login.html')) {
          window.location.href = '/login.html';
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 7. 修复登出功能
确保登出时正确清除token：

```typescript
const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await authApi.logout();
      console.log('登出成功');
    }
    localStorage.removeItem('token');
    console.log('本地token已清除');
    
    // 重定向到登录页面
    window.location.href = '/login.html';
  } catch (error) {
    console.error('登出失败:', error);
    // 即使API调用失败，也要清除本地token
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
};
```

## 测试方法

### 1. 使用测试页面
访问 `http://localhost:5173/token-test.html` 来测试token的存储和获取。

### 2. 浏览器开发者工具
1. 打开浏览器开发者工具
2. 进入 Application/Storage 标签
3. 查看 Local Storage 中的 token 值
4. 在 Network 标签中查看请求头中的 Authorization

### 3. 控制台日志
查看浏览器控制台的日志输出，确认：
- Token是否正确保存
- 请求头是否正确设置
- API响应是否正常

## 常见问题

### Q: 登录后token仍然为undefined
A: 检查登录API的响应格式，确保token在 `response.data` 中（不是 `response.data.token`）

### Q: 请求头中没有Authorization
A: 检查localStorage中是否有有效的token，使用 `localStorage.getItem('token')` 查看

### Q: Token过期后没有自动跳转
A: 确保响应拦截器正确处理401错误，并重定向到登录页面

### Q: 登出后token没有清除
A: 检查登出逻辑，确保调用 `localStorage.removeItem('token')`

### Q: API响应格式不匹配
A: 确认后端API返回的格式：
- 登录成功：`{status: 1011, message: "用户登录成功", data: "token字符串"}`
- 不是：`{status: 1011, message: "用户登录成功", data: {token: "token字符串"}}`

### Q: 出现静态资源错误
A: 检查API地址配置：
- 确保 `baseURL` 指向正确的后端端口（通常是8080）
- 确保请求包含正确的 `Authorization` 头格式：`Bearer <token>`

### Q: 请求被路由到静态资源处理器
A: 这通常是因为：
1. API地址配置错误
2. 请求头格式不正确
3. 后端路由配置问题
4. **代理配置问题**：确保开发环境使用 `/api` 前缀

### Q: 开发环境和生产环境API地址不一致
A: 使用环境检测：
```typescript
baseURL: import.meta.env.DEV ? '/api' : 'http://localhost:8080'
```

## 预防措施

1. **始终验证token**: 在发送请求前检查token的有效性
2. **错误处理**: 对token相关的错误进行统一处理
3. **自动重定向**: 当token无效时自动跳转到登录页面
4. **日志记录**: 添加详细的日志来帮助调试token问题
5. **API文档**: 确保前后端对API响应格式有明确的约定
6. **配置检查**: 定期检查API地址和请求头格式配置
7. **环境配置**: 确保开发和生产环境使用正确的API地址 