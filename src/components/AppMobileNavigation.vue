<template>
  <a-drawer
    wrapClassName="app-mobile-navigation"
    :closable="false"
    :visible="visible"
    :afterVisibleChange="afterVisibleChange"
    @close="onClose"
  >
    <ul class="app-mobile-navigation-list">
      <li
        v-for="(link, index) in links"
        :key="index"
        class="app-mobile-navigation-list-item"
      >
        <router-link
          :to="link.to"
          class="app-mobile-navigation-list-link"
          @click.native="onClose"
        >
          <component
            :is="link.icon"
            class="app-mobile-navigation-list-link-icon"
          />
          <span class="app-mobile-navigation-list-link-label">
            {{ link.label }}
          </span>
        </router-link>
      </li>

      <li class="app-mobile-navigation-list-item">
        <a
          :href="
            `https://${$i18n.locale === 'ru' ? 'ru.' : ''}hrblade.com/docs`
          "
          target="_blank"
          class="app-mobile-navigation-list-link"
        >
          <icon-settings class="app-mobile-navigation-list-link-icon" />
          <span class="app-mobile-navigation-list-link-label">
            {{ $t('sidebar.links.help_center') }}
          </span>
        </a>
      </li>

      <li class="app-mobile-navigation-list-item">
        <a class="app-mobile-navigation-list-link" @click="logout">
          <icon-logout class="app-mobile-navigation-list-link-icon" />
          <span class="app-mobile-navigation-list-link-label">
            {{ $t('sidebar.links.log_out') }}
          </span>
        </a>
      </li>
    </ul>
  </a-drawer>
</template>

<script>
import removeTokenFromLocalStorage from '../js/helpers/removeTokenFromLocalStorage.js';

import IconDashboard from './icons/Dashboard.vue';
import IconJobs from './icons/Jobs.vue';
import IconLive from './icons/Live.vue';
import IconCompanies from './icons/Companies.vue';
import IconUsers from './icons/Users.vue';
import IconSettings from './icons/Settings.vue';
import IconLogout from './icons/Logout.vue';

export default {
  name: 'AppMobileNavigation',

  components: {
    IconDashboard,
    IconJobs,
    IconLive,
    IconCompanies,
    IconUsers,
    IconSettings,
    IconLogout
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    links() {
      return [
        {
          to: '/',
          icon: 'icon-jobs',
          label: this.$t('navbar.links.interviews')
        },
        this.liveAvailable
          ? {
              to: '/live',
              icon: 'icon-live',
              label: this.$t('navbar.links.live')
            }
          : null,
        {
          to: '/companies',
          icon: 'icon-companies',
          label: this.$t('navbar.links.companies')
        },
        {
          to: '/users',
          icon: 'icon-users',
          label: this.$t('navbar.links.users')
        }
      ].filter((link) => !!link);
    },

    liveAvailable() {
      return this.$store.state.user.plan.live;
    }
  },

  methods: {
    onClose() {
      this.$emit('close-mobile-menu');
    },

    afterVisibleChange(visible) {
      if (visible) {
        window.addEventListener('resize', this.onWindowResize);
      } else {
        window.removeEventListener('resize', this.onWindowResize);
      }
    },

    onWindowResize() {
      if (window.innerWidth >= 992) {
        this.$emit('close-mobile-menu');
      }
    },

    logout() {
      removeTokenFromLocalStorage();
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss">
$link-color-active: $orange;

.app-mobile-navigation {
  height: calc(100% - 90px - env(safe-area-inset-top)) !important;
  top: calc(90px + env(safe-area-inset-top)) !important;

  @media (max-width: $sm) {
    height: calc(100% - 80px - env(safe-area-inset-top)) !important;
    top: calc(80px + env(safe-area-inset-top)) !important;
  }

  .ant-drawer-content-wrapper,
  .ant-drawer-content-wrapper {
    // top: 90px;
    width: calc(100% - 300px) !important;
    // height: calc(100% - 90px) !important;

    @media (max-width: $xl) {
      width: 100% !important;
    }
  }

  .ant-drawer-body {
    padding-top: 20px;
    padding-left: 0;
    padding-right: 0;
  }

  .ant-drawer-mask {
    display: none !important;
  }
}

.app-mobile-navigation-list {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  list-style: none;
}

.app-mobile-navigation-list-item {
  border-bottom: 1px solid #dedede;
  padding-bottom: 20px;

  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
}

.app-mobile-navigation-list-link {
  display: flex;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  padding-left: 24px;
  padding-right: 24px;

  &.router-link-exact-active {
    color: $link-color-active;
  }
}

.app-mobile-navigation-list-link-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  fill: currentColor;
}

.app-mobile-navigation-list-link-label {
  font-size: 14px;
}
</style>
