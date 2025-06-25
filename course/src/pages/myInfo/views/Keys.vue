<template>
  <div class="keys-container">
    <h1>绑定信息</h1>
    <form>
      <div class="form-group">
        <label for="phone">电话号码</label>
        <input type="text" id="phone" name="phone" v-model="form.phone">
      </div>
      <!-- 名字 -->
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="text" id="email" name="email" v-model="form.email">
      </div>

      <!-- 姓氏 -->
      <div class="form-group">
        <label for="wxInfo">微信</label>
        <input type="text" id="wxInfo" name="wxInfo" v-model="form.wxInfo">
      </div>

      <!-- 头衔 -->
      <div class="form-group">
        <label for="qqInfo">QQ</label>
        <input type="text" id="qqInfo" name="qqInfo" v-model="form.qqInfo">
      </div>

      <div class="form-group">
        <label for="newPhone">新电话号码</label>
        <input type="text" id="newphone" name="newphone" v-model="changePhoneform.newPhone" placeholder="新电话号码"
          class="newphone">
        <button :disabled="isSubmitting" @click="changePhone" class="savephone-button">
          {{ isSubmitting ? '提交中...' : '保存号码' }}
        </button>
      </div>

      <div class="form-group">
        <label for="phone">验证码</label>
        <input v-model="changePhoneform.captcha" type="text" placeholder="验证码" class="captcha">
        <button type="button" class="send-msg" :disabled="captchaBtn.disabled" @click="sendCaptcha">
          {{ captchaBtn.text }}
        </button>
      </div>

      <div class="form-group">
        <label for="newPassword">新密码</label>
        <input type="password" id="newPassword" name="newPassword" v-model="changePasswordForm.newPassword"
          class="newpassword">
        <button :disabled="isSubmitting" @click="changePassword" class="savepassword-button">
          {{ isSubmitting ? '提交中...' : '保存密码' }}
        </button>
      </div>



     
    </form>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue';
import { profileApi, userApi, authApi } from '@/api/user'
import { request, successCodes } from '@/utils/request';
const captchaBtn = ref({
  text: '发送验证码',
  disabled: false,
  countdown: 60
});


export default defineComponent({
  name: 'Keys',
  setup() {
    const isSubmitting = ref(false);
    const form = reactive({
      phone: '',
      email: '',
      passwordSet: false,
      wxInfo: '',
      qqInfo: ''
    })
    const changePhoneform = reactive({
      phone: form.phone,
      newPhone: '',
      captcha: ''
    })
    const changePasswordForm = reactive({
      phone: form.phone,
      newPassword: '',
      captcha: ''
    })
    // 获取个人信息
    const fetchBindInfo = async () => {
      try {
        const { data } = await userApi.getBindInfo()
        Object.assign(form, data)
      } catch (error) {
        console.error('获取信绑定息失败:', error)
      }
    }


    const sendCaptcha = async () => {
      captchaBtn.value.disabled = true;
      try {
        let res;
        if (changePhoneform.newPhone) { res = await authApi.sendCaptcha(changePhoneform.newPhone); }
        else {  res = await authApi.sendCaptcha(changePhoneform.newPhone); }
        if (!successCodes.includes(res.status)) {  // 改成 status
          console.log(res.status)
          alert(res.message || '发送验证码失败');
          captchaBtn.value.disabled = false;
          return;
        }
        // 成功，开始倒计时
        const timer = setInterval(() => {
          captchaBtn.value.countdown--;
          captchaBtn.value.text = `${captchaBtn.value.countdown}s后重新获取`;
          if (captchaBtn.value.countdown <= 0) {
            clearInterval(timer);
            captchaBtn.value = {
              text: '发送验证码',
              disabled: false,
              countdown: 60
            };
          }
        }, 1000);
      } catch (error) {
        captchaBtn.value.disabled = false;
        alert(error || '发送验证码失败');
      }
    };

    const changePhone = async () => {
      try {
        changePhoneform.phone = form.phone
        await userApi.changePhone(changePhoneform)
        alert('绑定信息保存成功!')
      } catch (error) {
        console.log(changePhoneform)
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      } finally {
        isSubmitting.value = false
      }
    }


    const changePassword = async () => {
      changePasswordForm.captcha = changePhoneform.captcha
      changePasswordForm.phone = form.phone
      try {
        
        await userApi.changePassword(changePasswordForm)
        alert('绑定信息保存成功!'+changePasswordForm)
      } catch (error) {
        console.log(changePasswordForm)
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      } finally {
        isSubmitting.value = false
      }
    }

    // 组件挂载时获取数据
    onMounted(() => {
      fetchBindInfo()
    })

    return {
      form,
      captchaBtn,
      sendCaptcha,
      changePhoneform,
      changePasswordForm,
      changePhone,
      changePassword,
      isSubmitting
    }
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
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="password"],
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="text"].captcha, input[type="password"].newpassword, input[type="text"].newphone{
display: inline-block;
  width: calc(100% - 140px);
  border-radius: 4px 0px 0px 4px;
}

textarea {
  height: 100px;
  resize: vertical;
}

button {
  display: inline-block;
   width: 130px;
   height:50px;
  background-color: rgb(22, 92, 145);
    color: white;
    border: none;
   margin-top: 20px;
   border-radius: 0px 4px 4px 0px;
 }

.save-button {
  position: relative;
  left: 80%;
  width: fit-content;
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  margin: 5px 20px;
  padding: 2px 15px;
  border-radius: 4px;
  cursor: pointer;
  height: 30px;
  font-size: 12px;
  transition: all 0.3s;
  border: 1px rgb(22, 92, 145) solid;
}

.save-button:hover,.save-button:hover {
  background-color: rgba(22, 92, 145, 0.8);
}
</style>
