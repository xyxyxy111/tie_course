<template>
  <div class="profile-title">
    个人资料与设置
  </div>
  <div v-if="$route.path.includes('/profile')" class="profile-sub-nav">
    <router-link to="/my-info/profile/basic-infomation" class="nav-link" active-class="active" exact>
      基本信息
    </router-link>

    <router-link to="/my-info/profile/photo" class="nav-link" active-class="active">
      照片
    </router-link>

    <router-link to="/my-info/profile/privacy" class="nav-link" active-class="active">
      隐私设置
    </router-link>
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Profile',
});
</script>

<style scoped>
.profile-title{
  font-size: 36px;
  margin: 20px 50px;
}

.profile-sub-nav {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.nav-link {
  font-size: 20px;
  padding: 20px 20px 5px;
  color: rgb(4, 35, 58);
  text-decoration: none;
  font-weight: 400;
  margin-inline: 5px;
  transition: all 0.3s;
  border-bottom: 8px solid white;
}

.nav-link.active {
  padding: 20px 50px 5px;;
  font-weight: bolder;
  color: rgb(22,92,145);
  border-bottom: 8px solid rgb(22,92,145);
}
</style>