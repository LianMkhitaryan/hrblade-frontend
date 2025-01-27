<template>
  <div :class="['app-menu', { 'app-menu-collapsed': menuCollapsed }]">
    <app-button type="link" :class="['app-menu-toggle', { 'menu-collapsed': menuCollapsed }]"
      @click="menuCollapsed = !menuCollapsed">
      <icon-arrow-right />
    </app-button>

    <div class="app-menu-inner">
      <div class="app-menu-header">
        <logo class="app-menu-logo" />
        <logo-icon class="app-menu-logo-icon" />
      </div>

      <app-menu-jobs :menuCollapsed="menuCollapsed" />

      <a-menu mode="inline" theme="dark" class="app-menu-content" :inline-collapsed="menuCollapsed"
        :dir="this.$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
        <a-menu-item key="1">
          <div class="app-menu-lang-switcher">
            <icon-langs class="anticon" />
            <span>
              <switch-lang />
            </span>
          </div>
        </a-menu-item>

        <a-menu-item key="2">
          <a :href="`https://${$i18n.locale === 'ru' ? 'ru.' : ''}hrblade.com/docs`
            " target="_blank">
            <icon-help class="anticon" />
            <span>
              {{ $t('sidebar.links.help_center') }}
            </span>
          </a>
        </a-menu-item>

        <a-menu-item key="3" @click="logout">
          <icon-logout class="anticon" />
          <span>
            {{ $t('sidebar.links.log_out') }}
          </span>
        </a-menu-item>
      </a-menu>
    </div>
  </div>
</template>

<script>
import removeTokenFromLocalStorage from '../js/helpers/removeTokenFromLocalStorage.js';

import Logo from './Logo.vue';
import LogoIcon from './LogoIcon.vue';
import SwitchLang from './SwitchLang.vue';
import AppMenuJobs from './AppMenuJobs.vue';
import AppButton from './AppButton.vue';

import IconLangs from './icons/Langs.vue';
import IconHelp from './icons/Help.vue';
import IconLogout from './icons/Logout.vue';
import IconArrowRight from './icons/ArrowRight.vue';

export default {
  name: 'AppMenu',

  components: {
    Logo,
    LogoIcon,
    SwitchLang,
    AppMenuJobs,
    AppButton,
    IconLangs,
    IconHelp,
    IconLogout,
    IconArrowRight
  },

  data() {
    return {
      menuCollapsed: false
    };
  },

  methods: {
    logout() {
      removeTokenFromLocalStorage();
      this.$router.go('/login');
    }
  }
};
</script>

<style lang="scss">
.app-menu {
  position: relative;
  background-color: #363151;
  width: 345px;
  transition: width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;

  @media (max-width: $osx) {
    width: 300px;
  }

  .app-menu-logo-icon {
    display: none;
  }

  &.app-menu-collapsed {
    width: 80px;

    .app-menu-header {
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .switch-lang {
        margin-top: 5px;
        margin-left: 0;
      }
    }

    .app-menu-logo {
      display: none;
    }

    .app-menu-logo-icon {
      display: inline-block;
    }

    .app-menu-toggle {
      left: 65px;
      transform: rotate(0deg);
    }
  }

  .ant-menu-inline-collapsed>.ant-menu-item,
  .ant-menu-inline-collapsed>.ant-menu-item-group>.ant-menu-item-group-list>.ant-menu-item,
  .ant-menu-inline-collapsed>.ant-menu-item-group>.ant-menu-item-group-list>.ant-menu-submenu>.ant-menu-submenu-title,
  .ant-menu-inline-collapsed>.ant-menu-submenu>.ant-menu-submenu-title {
    padding: 15px 31px !important;
  }
}

.app-menu-inner {
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  height: 100vh;
  overflow: auto;
  flex-direction: column;
}

.app-menu-content {
  margin-top: auto !important;

  &.ant-menu {
    width: 345px;
    // height: calc(100vh - 90px);

    @media (max-width: $osx) {
      width: 300px;
    }

    &.ant-menu-inline-collapsed {
      width: 80px;
    }
  }

  &.ant-menu-dark,
  &.ant-menu-dark .ant-menu-sub {
    background-color: #363151;
  }

  .ant-menu-item .anticon,
  .ant-menu-submenu-title .anticon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
}

.ant-menu-item {
  height: auto !important;
  line-height: initial !important;
  margin: 0 !important;
  padding: 15px 20px !important;
  border-top: 1px solid rgba(#ffffff, 0.2);
  font-size: 14px !important;
}

.ant-menu-dark .ant-menu-item,
.ant-menu-dark .ant-menu-item-group-title,
.ant-menu-dark .ant-menu-item>a {
  color: #ffffff !important;

  &:hover {
    color: darken(#ffffff, 25%) !important;
  }
}

.app-menu-header {
  height: 90px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
  background-color: #363151;

  .switch-lang {
    margin-left: 20px;
    color: #ffffff;
  }
}

.app-menu-toggle {
  position: fixed !important;
  padding: 0 !important;
  width: 26px;
  height: 26px !important;
  top: 32px;
  left: 332px;
  background-color: #ffffff !important;
  border-radius: 50% !important;
  box-shadow: 0 0 12px 0 rgba(150, 152, 163, 0.4) !important;
  z-index: 99;
  transform: rotate(180deg);

  @media (max-width: $osx) {
    left: 287px;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px !important;
    height: 12px !important;
  }
}

.app-menu-lang-switcher {
  display: flex;
  align-items: center;

  .switch-lang {
    width: 100%;
    color: #fff;
  }
}
</style>
