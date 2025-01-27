<template>
  <div class="default-layout">
    <app-menu :menu-collapsed="menuCollapsed"></app-menu>

    <div class="default-layout-content">
      <app-header
        :menu-collapsed="menuCollapsed"
        :mobile-menu-visible="mobileMenuVisible"
        @open-mobile-menu="mobileMenuVisible = !mobileMenuVisible"
        @toggle-menu="menuCollapsed = !menuCollapsed"
      />

      <app-mobile-navigation
        :visible="mobileMenuVisible"
        @close-mobile-menu="mobileMenuVisible = false"
      />

      <div v-if="isTarifNeedUpgrade" class="upgrade-plan-notify">
        {{ $t("You've exceeded your current plan limits.") }}

        <router-link to="/profile">
          {{ $t('Please upgrade your account.') }}
        </router-link>
      </div>

      <router-view />

      <app-footer v-if="!$store.state.app.isMobileApp" />
    </div>

    <!-- <upgrade-tariff-modal
      :visible="upgradeTariffModalVisible"
    ></upgrade-tariff-modal> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AppHeader from '../components/AppHeader.vue';
import AppMenu from '../components/AppMenu.vue';
import AppMobileNavigation from '../components/AppMobileNavigation.vue';
import AppFooter from '../components/AppFooter.vue';
// import UpgradeTariffModal from '../components/UpgradeTariffModal.vue';

export default {
  name: 'DefaultLayout',

  components: {
    AppHeader,
    AppMenu,
    AppMobileNavigation,
    AppFooter
    // UpgradeTariffModal
  },

  data() {
    return {
      menuCollapsed: false,
      mobileMenuVisible: false
    };
  },

  computed: {
    isTarifNeedUpgrade() {
      if (this.responsesCount >= this.responsesLimit) {
        return true;
      } else {
        return false;
      }
    },
    // upgradeTariffModalVisible() {
    //   return this.$store.state.app.upgradeTariffModalVisible;
    // }

    ...mapState({
      responsesCount: ({ user }) => user.plan.responsesCount,
      responsesLimit: ({ user }) => user.plan.responsesLimit,
      usersLimit: ({ user }) => user.plan.usersLimit,
      jobsLimit: ({ user }) => user.plan.jobsLimit,
      companiesLimit: ({ user }) => user.plan.companiesLimit,

      usersCount: ({ company }) => company.users.length,
      jobsCount: ({ jobs }) => jobs.jobs.length,
      companiesCount: ({ company }) => company.companies.length
    })
  }
};
</script>

<style lang="scss">
.default-layout {
  width: 100%;
  display: flex;

  .app-menu {
    @media (max-width: $lg) {
      display: none;
    }
  }
}

.default-layout-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;

  @media (max-width: $lg) {
    padding-top: calc(90px + env(safe-area-inset-top));
  }

  @media (max-width: $sm) {
    padding-top: calc(80px + env(safe-area-inset-top));
  }

  .container {
    max-width: 1600px;
  }
}

.upgrade-plan-notify {
  width: 100%;
  padding: 5px;
  text-align: center;
  background-color: #dd2705;
  color: #ffffff;

  a {
    color: inherit;
    text-decoration: underline;

    &:hover {
      color: inherit;
      text-decoration: none;
    }
  }
}
</style>
