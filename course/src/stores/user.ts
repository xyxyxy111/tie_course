// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { profileApi } from '@/api/user'
import { getValidToken, isValidToken } from '@/utils/request'

// 用户信息类型
export interface UserInfo {
  username: string
  firstName: string
  lastName: string
  major: string
  avatarUrl: string
  allowEmailNotify: boolean
  allowSMSNotify: boolean
  showProfileToLoggedInUsers?: boolean
  showCoursesOnProfile?: boolean
}

// 登录状态类型
export interface LoginStatus {
  loading: boolean
  error: string | null
  success: boolean
}

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)

  // 登录状态
  const loginStatus = ref<LoginStatus>({
    loading: false,
    error: null,
    success: false
  })

  // 是否已初始化
  const isInitialized = ref(false)

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => {
    return isValidToken(getValidToken()) && userInfo.value !== null
  })

  // 计算属性：用户全名
  const fullName = computed(() => {
    if (!userInfo.value) return ''
    return `${userInfo.value.firstName} ${userInfo.value.lastName}`.trim() || userInfo.value.username
  })

  // 计算属性：用户头像
  const avatarUrl = computed(() => {
    return userInfo.value?.avatarUrl || '/src/images/userPic.png'
  })

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      loginStatus.value.loading = true
      loginStatus.value.error = null

      const { data } = await profileApi.getProfile()
      userInfo.value = data as UserInfo
      loginStatus.value.success = true

      return data
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      loginStatus.value.error = error.message || '获取用户信息失败'
      loginStatus.value.success = false
      throw error
    } finally {
      loginStatus.value.loading = false
    }
  }

  // 更新用户信息
  const updateUserInfo = async (updates: Partial<UserInfo>) => {
    try {
      loginStatus.value.loading = true
      loginStatus.value.error = null

      if (!userInfo.value) {
        throw new Error('用户信息不存在')
      }

      const updateData = { ...userInfo.value, ...updates }
      const { data } = await profileApi.updateProfile(updateData)

      // 更新本地用户信息
      userInfo.value = { ...userInfo.value, ...updates }
      loginStatus.value.success = true

      return data
    } catch (error: any) {
      console.error('更新用户信息失败:', error)
      loginStatus.value.error = error.message || '更新用户信息失败'
      loginStatus.value.success = false
      throw error
    } finally {
      loginStatus.value.loading = false
    }
  }

  // 更新头像
  const updateAvatar = async (avatarUrl: string) => {
    return await updateUserInfo({ avatarUrl })
  }

  // 更新隐私设置
  const updatePrivacySettings = async (settings: {
    showProfileToLoggedInUsers?: boolean
    showCoursesOnProfile?: boolean
  }) => {
    return await updateUserInfo(settings)
  }

  // 更新通知设置
  const updateNotificationSettings = async (settings: {
    allowEmailNotify?: boolean
    allowSMSNotify?: boolean
  }) => {
    return await updateUserInfo(settings)
  }

  // 初始化用户状态
  const initializeUser = async () => {
    if (isInitialized.value) return

    try {
      const token = getValidToken()
      if (token) {
        await fetchUserInfo()
      }
    } catch (error) {
      console.error('初始化用户状态失败:', error)
      // 清除无效的token
      localStorage.removeItem('token')
    } finally {
      isInitialized.value = true
    }
  }

  // 登出
  const logout = () => {
    userInfo.value = null
    loginStatus.value = {
      loading: false,
      error: null,
      success: false
    }
    localStorage.removeItem('token')

    // 重定向到登录页面
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = '/login.html'
    }
  }

  // 清除错误状态
  const clearError = () => {
    loginStatus.value.error = null
  }

  // 重置登录状态
  const resetLoginStatus = () => {
    loginStatus.value = {
      loading: false,
      error: null,
      success: false
    }
  }

  return {
    // 状态
    userInfo,
    loginStatus,
    isInitialized,

    // 计算属性
    isLoggedIn,
    fullName,
    avatarUrl,

    // 方法
    fetchUserInfo,
    updateUserInfo,
    updateAvatar,
    updatePrivacySettings,
    updateNotificationSettings,
    initializeUser,
    logout,
    clearError,
    resetLoginStatus
  }
}) 