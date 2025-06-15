// src/api-call-examples.ts
import {
  authApi,
  userApi,
  profileApi
} from '@/api/user';
import type {
  LoginByCaptchaParams,
  LoginByPasswordParams,
  RegisterParams,
  UserProfile,
  ChangePhoneParams,
  ChangePasswordParams
} from '@/types/user';

// 1. 发送验证码
const handleSendCaptcha = async () => {
  try {
    const response = await authApi.sendCaptcha('13800138000');
    console.log('验证码发送成功', response.data);
  } catch (error) {
    console.error('发送验证码失败:', error);
  }
};

// 2. 手机号+验证码登录
const handleLoginByCaptcha = async () => {
  const params: LoginByCaptchaParams = {
    phone: '13800138000',
    captcha: '123456'
  };

  try {
    const response = await authApi.loginByCaptcha(params);
    const token = response.data.token;
    localStorage.setItem('token', token);
    console.log('登录成功，token已保存');
  } catch (error) {
    console.error('登录失败:', error);
  }
};

// 3. 手机号+密码登录
const handleLoginByPassword = async () => {
  const params: LoginByPasswordParams = {
    phone: '13800138000',
    password: 'yourPassword123'
  };

  try {
    const response = await authApi.loginByPassword(params);
    const token = response.data.token;
    localStorage.setItem('token', token);
    console.log('登录成功，token已保存');
  } catch (error) {
    console.error('登录失败:', error);
  }
};

// 4. 手机号注册
const handleRegister = async () => {
  const params: RegisterParams = {
    phone: '13800138000',
    captcha: '123456'
  };

  try {
    const response = await authApi.register(params);
    const token = response.data.token;
    localStorage.setItem('token', token);
    console.log('注册成功，token已保存');
  } catch (error) {
    console.error('注册失败:', error);
  }
};

// 5. 检查手机号是否注册
const checkPhoneAvailability = async () => {
  try {
    const response = await authApi.checkPhoneAvailable('13800138000');
    console.log(response.data.exist ? '手机号已注册' : '手机号可用');
  } catch (error) {
    console.error('检查失败:', error);
  }
};

// 6. 修改手机号
const handleChangePhone = async () => {
  const params: ChangePhoneParams = {
    phone: '13800138000',
    newPhone: '13900139000',
    captcha: '654321'
  };

  try {
    await userApi.changePhone(params);
    console.log('手机号修改成功');
  } catch (error) {
    console.error('修改失败:', error);
  }
};

// 7. 修改密码
const handleChangePassword = async () => {
  const params: ChangePasswordParams = {
    oldPassword: 'oldPassword123',
    newPassword: 'newPassword456'
  };

  try {
    await userApi.changePassword(params);
    console.log('密码修改成功');
  } catch (error) {
    console.error('修改失败:', error);
  }
};

// 8. 获取个人资料
const fetchProfile = async () => {
  try {
    const response = await profileApi.getProfile();
    console.log('个人资料:', response.data);
  } catch (error) {
    console.error('获取资料失败:', error);
  }
};

// 9. 更新个人资料
const updateUserProfile = async () => {
  const params: UserProfile = {
    username: 'newUsername',
    avatarUrl: 'https://example.com/avatar.jpg',
    allowEmailNotify: true
  };

  try {
    await profileApi.updateProfile(params);
    console.log('资料更新成功');
  } catch (error) {
    console.error('更新失败:', error);
  }
};


export {
  authApi,userApi,profileApi
}