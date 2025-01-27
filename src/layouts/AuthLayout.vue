<template>
  <div class="auth-layout">
    <a-row>
      <a-col :xl="{ span: 8 }" :lg="{ span: 12 }" :xs="{ span: 24 }">
        <div class="auth-layout-header">
          <logo :href="BASE_PATH_URL[$i18n.locale || 'en']" dark></logo>
          <switch-lang class="ml-20"></switch-lang>
        </div>
        <div class="auth-layout-content">
          <router-view></router-view>
        </div>
      </a-col>
    </a-row>

    <img src="../assets/login-bg.jpg" class="auth-layout-bg" alt="img" />
  </div>
</template>

<script>
import { BASE_PATH_URL } from '../js/const/index.js';
import Logo from '../components/Logo.vue';
import SwitchLang from '../components/SwitchLang.vue';

export default {
  name: 'AuthLayout',

  components: {
    Logo,
    SwitchLang
  },

  data() {
    return {
      BASE_PATH_URL
    };
  },

  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem('access_token');

    if (token && to.name !== 'invite-companies-hash') {
      next('/');
    } else {
      next();
    }
  }
};
</script>

<style lang="scss">
.auth-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: calc(0px + env(safe-area-inset-top)) 60px 0 120px;

  @media (max-width: $xl) {
    padding-left: 60px;
  }

  @media (max-width: $md) {
    padding: 0 40px;
    padding-top: calc(0px + env(safe-area-inset-top));
  }

  @media (max-width: $sm) {
    padding: 0 20px;
    padding-top: calc(0px + env(safe-area-inset-top));
  }
}

.auth-layout-header {
  height: 90px;
  display: flex;
  align-items: center;
}

.auth-layout-content {
  margin-top: 80px;
}

.auth-layout-bg {
  position: absolute;
  top: 0;
  right: 0;
  object-fit: cover;
  object-position: center;
  width: calc(100% - 33.33333333% - 120px);
  height: 100%;

  @media (max-width: $xl) {
    width: calc(100% - 50% - 60px);
  }

  @media (max-width: $lg) {
    display: none;
  }
}
</style>
