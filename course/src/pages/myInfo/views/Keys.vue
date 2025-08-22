<template>
  <div class="keys-container">
    <h1>绑定信息</h1>

    <!-- 绑定信息表格 -->
    <div class="bind-table">
      <div class="table-row" v-for="(item, index) in bindItems" :key="index">
        <div class="table-cell type">{{ item.type }}</div>
        <div class="table-cell value">{{ item.value }}</div>
        <div class="table-cell action">
          <button @click="toggleForm(item.key)" class="modify-btn">
            {{ item.buttonText }}
          </button>
        </div>

        <!-- 手机号修改表单 -->
        <div v-if="activeForm === 'phone' && item.key === 'phone'" class="form-section">
          <h3>更换手机号</h3>
          <div class="form-group">
            <label>原手机号：</label>
            <input v-model="changePhoneForm.phone" type="text" placeholder="原手机号" class="captcha-input">
          </div>
          <div class="form-group">
            <label>原手机验证码：</label>
            <input v-model="changePhoneForm.captcha" type="text" placeholder="原手机验证码" class="captcha-input">
            <button @click="sendSmsCaptcha(form.phone, 'old')" class="send-captcha" :disabled="!form.phone">
              发送验证码
            </button>
          </div>
          <div class="form-group">
            <label>新手机号：</label>
            <input v-model="changePhoneForm.newPhone" type="text" placeholder="请输入新手机号">
          </div>
          <div class="form-group">
            <label>新手机验证码：</label>
            <input v-model="changePhoneForm.newCaptcha" type="text" placeholder="新手机验证码" class="captcha-input">
            <button @click="sendSmsCaptcha(changePhoneForm.newPhone)" class="send-captcha"
              :disabled="!changePhoneForm.newPhone">
              发送验证码
            </button>
          </div>
          <button @click="changePhone" class="save-btn">确认更换</button>
        </div>

        <!-- 邮箱修改表单 -->
        <!-- 
       
        <div v-if="activeForm === 'email' && item.key === 'email'" class="form-section">
          <h3>更换邮箱</h3>
          <div class="form-group">
            <label>原邮箱：</label>
            <input v-model="changeemailForm.email" type="text" placeholder="原邮箱" class="captcha-input">
          </div>
          <div class="form-group">
            <label>原手机验证码：</label>
            <input v-model="changeemailForm.captcha" type="text" placeholder="原手机验证码" class="captcha-input">
            <button @click="sendSmsCaptcha(form.email, 'old')" class="send-captcha" :disabled="!form.email">
              发送验证码
            </button>
          </div>
          <div class="form-group">
            <label>新邮箱：</label>
            <input v-model="changeemailForm.newemail" type="text" placeholder="请输入新手机号">
          </div>
          <div class="form-group">
            <label>新手机验证码：</label>
            <input v-model="changeemailForm.newCaptcha" type="text" placeholder="新手机验证码" class="captcha-input">
            <button @click="sendSmsCaptcha(changeemailForm.newemail)" class="send-captcha"
              :disabled="!changeEmailForm.newemail">
              发送验证码
            </button>
          </div>
          <button @click="changeemail" class="save-btn">确认更换</button>
        </div> 
      -->


        <!-- 密码修改表单  -->
        <div v-if="activeForm === 'password' && item.key === 'password'" class="form-section">
          <h3>{{ form.passwordSet ? '修改密码' : '设置密码' }}</h3>

          <div v-if="changePasswordMethod === 'phone'">
            <div class=" form-group">
              <label>手机号：</label>
              <input v-model="changePasswordByPhoneForm.account" type="text" placeholder="手机号" class="captcha-input">
            </div>
            <div class="form-group">
              <label>验证码：</label>
              <input v-model="changePasswordByPhoneForm.captcha" type="text" placeholder="验证码" class="captcha-input">
              <button type='button' @click="sendPasswordCaptcha" class="send-captcha" :disabled="!form.phone">
                发送验证码
              </button>
            </div>
            <div class="form-group">
              <label>新密码：</label>
              <input v-model="changePasswordByPhoneForm.newPassword" type="password" placeholder="8-20位，包含字母和数字">
            </div>
            <button @click="changePassword" class="save-btn">确认{{ form.passwordSet ? '修改' : '设置' }}</button>
            <button type='button' @click="changePasswordMethod = 'email'" class="save-btn">使用邮箱{{ form.passwordSet ?
              '修改' : '设置'
            }}</button>

          </div>

          <div v-if="changePasswordMethod === 'email'">
            <div class=" form-group">
              <label>邮箱：</label>
              <input v-model="changePasswordByEmailForm.email" type="text" placeholder="邮箱" class="captcha-input">
            </div>
            <div class="form-group">
              <label>验证码：</label>
              <input v-model="changePasswordByEmailForm.captcha" type="text" placeholder="验证码" class="captcha-input">
              <button type='button' @click="sendPasswordCaptcha" class="send-captcha" :disabled="!form.phone">
                发送验证码
              </button>
            </div>
            <div class="form-group">
              <label>新密码：</label>
              <input v-model="changePasswordByEmailForm.newPassword" type="password" placeholder="8-20位，包含字母和数字">
            </div>
            <button @click="changePassword" class="save-btn">确认{{ form.passwordSet ? '修改' : '设置' }}</button>
            <button type='button' @click="changePasswordMethod = 'phone'" class="save-btn">使用手机号{{ form.passwordSet ?
              '修改' : '设置'
            }}</button>
          </div>



        </div>

        <!-- 微信绑定表单 -->
        <div v-if="activeForm === 'wxInfo' && item.key === 'wxInfo'" class="form-section">
          <h3>更换微信</h3>
          <div class="form-group">
            <p>请扫描下方二维码绑定微信</p>
            <button @click="bindWechat" class="save-btn">生成二维码</button>
          </div>
        </div>

        <!-- 邮箱和QQ的占位表单 -->
        <div v-if="(activeForm === 'email' && item.key === 'email') ||
          (activeForm === 'qqInfo' && item.key === 'qqInfo')" class="form-section">
          <h3>更换{{ item.type }}</h3>
          <div class="form-group">
            <p>该功能暂未开放</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 微信绑定模态框 -->
    <div v-if="showWechatModal" class="modal">
      <div class="modal-content">
        <h3>微信绑定</h3>
        <div v-if="wxQrcode" class="qrcode-container">
          <img :src="wxQrcode" alt="微信绑定二维码" class="qrcode">
          <p>请使用微信扫描二维码完成绑定</p>
        </div>
        <button @click="closeWechatModal" class="cancel-btn">关闭</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { userApi, authApi } from '@/api/user';
import { successCodes } from '@/utils/request';

interface BindInfo {
  phone: string;
  email: string;
  passwordSet: boolean;
  wxInfo: string;
  qqInfo: string;
}

interface ChangePhoneParams {
  phone: string | null;
  captcha: string | null;
  newPhone: string;
  newCaptcha: string;
}

interface ChangePasswordParams {
  account: string;
  captcha: string;
  newPassword: string;
}

export default defineComponent({
  name: 'AccountBind',
  setup() {
    const activeForm = ref<string>('');
    const showWechatModal = ref(false);
    const wxQrcode = ref<string>('');

    const changePasswordMethod = ref('phone');

    const form = reactive<BindInfo>({
      phone: '',
      email: '',
      passwordSet: false,
      wxInfo: '',
      qqInfo: ''
    });

    const changePhoneForm = reactive({
      phone: '',
      captcha: '',
      newPhone: '',
      newCaptcha: ''
    });

    const changePasswordByPhoneForm = reactive({
      account: '',
      captcha: '',
      newPassword: ''
    });

    const changePasswordByEmailForm = reactive({
      email: '',
      captcha: '',
      newPassword: ''
    });


    // 格式化显示数据
    const formatDisplayValue = (key: string, value: any) => {
      if (!value) return '未绑定';

      switch (key) {
        case 'phone':
          // 手机号中间用*隐藏
          return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        case 'password':
          return '********';
        case 'email':
          // 邮箱部分隐藏
          if (value.includes('@')) {
            const [name, domain] = value.split('@');
            return `${name.substring(0, 2)}****@${domain}`;
          }
          return value;
        default:
          return value;
      }
    };

    // 绑定信息项
    const bindItems = computed(() => [
      {
        key: 'phone',
        type: '手机号',
        value: formatDisplayValue('phone', form.phone),
        buttonText: '更换号码'
      },
      {
        key: 'email',
        type: '邮箱',
        value: formatDisplayValue('email', form.email),
        buttonText: '更换邮箱'
      },
      {
        key: 'password',
        type: '密码',
        value: formatDisplayValue('password', form.passwordSet ? 'set' : ''),
        buttonText: form.passwordSet ? '修改密码' : '设置密码'
      },
      {
        key: 'wxInfo',
        type: '微信',
        value: form.wxInfo || '未绑定',
        buttonText: form.wxInfo ? '更换微信' : '绑定微信'
      },
      {
        key: 'qqInfo',
        type: 'QQ',
        value: form.qqInfo || '未绑定',
        buttonText: form.qqInfo ? '更换QQ' : '绑定QQ'
      }
    ]);

    // 切换表单显示
    const toggleForm = (formKey: string) => {
      if (activeForm.value === formKey) {
        activeForm.value = '';
      } else {
        activeForm.value = formKey;
      }
    };

    // 获取用户绑定信息
    const fetchUserInfo = async () => {
      try {
        const response = await userApi.getAccountInfo();
        Object.assign(form, response.data);
        console.log('格式化后的表单数据:', response.data);
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    // 发送验证码
    const sendSmsCaptcha = async (phone: string) => {
      if (!phone) {
        alert('请输入手机号');
        return;
      }
      try {
        const res = await authApi.sendSmsCaptcha(phone);
        if (!successCodes.includes(res.status)) {
          alert(res.message || '发送验证码失败');
        } else {
          alert('验证码发送成功');
        }
      } catch (error: any) {
        alert(error.message || '发送验证码失败');
      }
    };

    const sendEmailCaptcha = async (email: string) => {
      if (!email) {
        alert('请输入邮箱');
        return;
      }
      try {
        const res = await authApi.sendEmailCaptcha(email);
        if (!successCodes.includes(res.status)) {
          alert(res.message || '发送验证码失败');
        } else {
          alert('验证码发送成功');
        }
      } catch (error: any) {
        alert(error.message || '发送验证码失败');
      }
    };

    // 发送密码验证码
    const sendPasswordCaptcha = async () => {
      if (changePasswordMethod.value === 'phone') {
        await sendSmsCaptcha(changePasswordByPhoneForm.account);
      } else if (changePasswordMethod.value === 'email') {
        await sendEmailCaptcha(changePasswordByEmailForm.email)
      }
    };

    // 修改手机号
    const changePhone = async () => {
      if (!changePhoneForm.newPhone) {
        alert('请输入新手机号');
        return;
      }

      try {
        // 根据是否有原手机号决定参数
        const params: any = form.phone ? {
          phone: form.phone, // 使用当前绑定的手机号
          captcha: changePhoneForm.captcha,
          newPhone: changePhoneForm.newPhone,
          newCaptcha: changePhoneForm.newCaptcha
        } : {
          phone: null,
          captcha: null,
          newPhone: changePhoneForm.newPhone,
          newCaptcha: changePhoneForm.newCaptcha
        };

        const response = await userApi.changePhone(params)
        alert('手机号修改成功');
        await fetchUserInfo();
        activeForm.value = '';
        // 重置表单
        changePhoneForm.captcha = '';
        changePhoneForm.newPhone = '';
        changePhoneForm.newCaptcha = '';

      } catch (error: any) {
        alert(error.message || '修改手机号失败');
      }
    };

    // 修改密码
    const changePassword = async () => {
      if (!changePasswordByPhoneForm.newPassword) {
        alert('请输入新密码');
        return;
      }

      try {
        const params = {
          account: changePasswordByPhoneForm.account, // 使用当前绑定的手机号
          captcha: changePasswordByPhoneForm.captcha,
          newPassword: changePasswordByPhoneForm.newPassword
        };
        const response = await userApi.changePasswordByPhone(params);
        alert('密码修改成功');
        await fetchUserInfo();
        activeForm.value = '';
        // 重置表单
        changePasswordByPhoneForm.captcha = '';
        changePasswordByPhoneForm.newPassword = '';
      } catch (error: any) {
        alert(error.message || '修改密码失败');
      }
    };

    // 微信绑定
    const bindWechat = async () => {
      showWechatModal.value = true;
      try {
        const response = await userApi.getWxBindQrcode();
        const blob = new Blob([response.data], { type: 'image/png' });
        wxQrcode.value = URL.createObjectURL(blob);
      } catch (error) {
        console.error('获取微信二维码失败:', error);
        alert('获取微信绑定二维码失败');
      }
    };

    const closeWechatModal = () => {
      showWechatModal.value = false;
      wxQrcode.value = '';
    };

    onMounted(() => {
      fetchUserInfo();
    });

    return {
      form,
      changePasswordMethod,
      bindItems,
      activeForm,
      showWechatModal,
      wxQrcode,
      changePhoneForm,
      changePasswordByPhoneForm,
      changePasswordByEmailForm,
      toggleForm,
      sendSmsCaptcha,
      sendEmailCaptcha,
      sendPasswordCaptcha,
      changePhone,
      changePassword,
      bindWechat,
      closeWechatModal
    };
  }
});
</script>

<style scoped>
.keys-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.bind-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
  padding: 20px;
  position: relative;
  flex-wrap: wrap;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 0 10px;
}

.table-cell.type {
  flex: 0 0 80px;
  font-weight: 600;
  color: #333;
}

.table-cell.value {
  flex: 1;
  text-align: left;
  color: #666;
  min-width: 150px;
}

.table-cell.action {
  flex: 0 0 100px;
  text-align: right;
}

.modify-btn {
  padding: 6px 12px;
  background: #215496;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.modify-btn:hover {
  background: #1a3f7a;
}

/* 表单样式 */
.form-section {
  width: 100%;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-top: 15px;
}

.form-section h3 {
  margin: 0 0 15px 0;
  color: #215496;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  min-width: 100px;
  margin-right: 15px;
  color: #333;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  max-width: 200px;
}

.current-phone {
  padding: 8px 12px;
  color: #666;
  font-weight: bold;
}

.captcha-input {
  flex: 1;
  margin-right: 10px;
  max-width: 150px;
}

.send-captcha {
  width: 120px;
  padding: 8px;
  background: #215496;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.send-captcha:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.save-btn {
  padding: 10px 20px;
  margin-inline: 20px;
  background: #215496;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.qrcode {
  width: 200px;
  height: 200px;
  margin: 20px 0;
  border: 1px solid #e0e0e0;
}

.cancel-btn {
  padding: 8px 16px;
  background: #ccc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
</style>