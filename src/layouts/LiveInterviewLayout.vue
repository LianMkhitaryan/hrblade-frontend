<template>
  <div class="live-interview-layout">
    <div class="live-interview-header">
      <div class="live-interview-header-container">
        <a-row type="flex" class="align-items-center" :gutter="20">
          <a-col :span="4">
            <logo-icon></logo-icon>
          </a-col>

          <a-col :span="16">
            <page-title
              tag="h1"
              size="22"
              class="live-interview-layout-title text-align-center mb-0-i"
            >
              Live Interview
            </page-title>
          </a-col>
        </a-row>
      </div>
    </div>

    <router-view></router-view>

    <app-footer v-if="!$store.state.app.isMobileApp"></app-footer>
  </div>
</template>

<script>
import AppFooter from '../components/AppFooter.vue';
import LogoIcon from '../components/LogoIcon.vue';
import PageTitle from '../components/PageTitle.vue';

export default {
  name: 'LiveInterviewLayout',

  components: {
    AppFooter,
    LogoIcon,
    PageTitle
  }
};
</script>

<style lang="scss">
.live-interview-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: calc(0px + env(safe-area-inset-top)) 0
    calc(0px + env(safe-area-inset-bottom));
}

.live-interview-header {
  position: relative;
  overflow: hidden;
  background-color: $white;
  box-shadow: 0 0 10px 5px rgba(71, 71, 71, 0.1);
}

.live-interview-header-container {
  width: 100%;
  height: 90px;
  padding: 0 20px;
}

.live-interview-layout {
  .app-footer-privacy-link {
    color: #adadad;
  }
}

.live-interview-layout-title {
  @media (max-width: $sm) {
    font-size: 14px;
  }
}
</style>
