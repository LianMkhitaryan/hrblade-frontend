<template>
  <header :class="['app-header', { 'mobile-menu-visible': mobileMenuVisible }]">
    <div class="app-header-container">
      <a-row :gutter="{ lg: 20, sm: 10, xs: 10 }" type="flex">
        <a-col :lg="0" :span="12" class="app-header-right">
          <div class="app-header-logo">
            <logo-icon></logo-icon>
          </div>
        </a-col>

        <a-col :lg="24" :span="12" class="app-header-left">
          <app-desktop-navigation></app-desktop-navigation>

          <div class="app-header-tariff">
            <a-spin :spinning="!plan.name">
              <a-icon
                slot="indicator"
                type="loading"
                style="font-size: 24px"
                spin
              />

              <template v-if="plan.name">
                {{ $t('navbar.tarif.title') }}

                <b>{{ plan.name || '' }}</b>

                <router-link to="/profile">
                  <b>
                    {{ $t('navbar.tarif.link') }}
                  </b>
                </router-link>
              </template>
            </a-spin>
          </div>

          <user to="/profile" :avatar="avatar"></user>

          <burger
            class="app-header-burger"
            :mobile-menu-visible="mobileMenuVisible"
            @click.native="$emit('open-mobile-menu')"
          ></burger>
        </a-col>
      </a-row>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

import User from '../components/User.vue';
// import AppButton from '../components/AppButton.vue';
import AppDesktopNavigation from './AppDesktopNavigation.vue';
// import Logo from './Logo.vue';
import LogoIcon from './LogoIcon.vue';
import Burger from './Burger.vue';

// import IconArrowRight from '../components/icons/ArrowRight.vue';

export default {
  name: 'AppHeader',

  components: {
    User,
    // AppButton,
    AppDesktopNavigation,
    // IconArrowRight,
    // Logo
    LogoIcon,
    Burger
  },

  props: {
    menuCollapsed: {
      type: Boolean,
      default: false
    },

    mobileMenuVisible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState({
      avatar: ({ user }) => user.info.avatar,
      plan: ({ user }) => user.plan
    })
  },

  methods: {
    toggleMenu() {
      this.$emit('toggle-menu');
    }
  }
};
</script>

<style lang="scss">
.app-header {
  position: relative;
  // overflow: hidden;
  background-color: $white;
  box-shadow: 0 0 10px 5px rgba(71, 71, 71, 0.1);

  @media (max-width: $lg) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: calc(0 + env(safe-area-inset-top));
    // border-top: 1px solid #dedede;
    z-index: 10;
  }

  &.mobile-menu-visible {
    box-shadow: none;
    border-bottom: 1px solid #dedede;
    z-index: 999999;
    // background-color: #363151;

    // .switch-lang {
    //   color: #ffffff;
    // }

    // .user,
    // .burger-wrapper {
    //   border-left-color: rgba(#dedede, 0.4);
    // }
  }
}

.app-header-container {
  width: 100%;
  height: 90px;
  padding-left: 20px;
  border-top: 1px solid #dedede;

  @media (max-width: $sm) {
    height: 80px;
  }
}

.ant-row-flex {
  height: 100%;
}

.app-header-right,
.app-header-left {
  display: flex !important;
  align-items: center;
  align-self: center;
}

.app-header-right {
  display: none !important;

  @media (max-width: $lg) {
    display: flex !important;
  }
}

.app-header-left {
  justify-content: flex-end;
}

// .app-header-right {
//   justify-content: flex-end;
// }

// .app-header-toggle-menu {
//   position: absolute !important;
//   top: 50%;
//   left: -15px;
//   padding: 0;
//   border: 0;
//   width: 30px;
//   height: 30px;
//   background-color: #ffffff;
//   transform: rotate(180deg);

//   @media (max-width: $xl) {
//     display: none !important;
//   }

//   &.menu-collapsed {
//     transform: rotate(0);
//   }
// }

.app-header-tariff {
  display: flex;
  align-items: center;
  height: 90px;
  padding: 0 20px;
  margin-left: 20px;
  border-left: 1px solid #dedede;
  text-align: center;

  // @media (max-width: $xl) {
  //   margin-left: 10px;
  //   padding: 0 10px;
  //   font-size: 14px;
  // }

  @media (max-width: $xl) {
    display: none;
  }

  a {
    margin-left: 10px;
    color: #fda94c;
  }
}

.app-header-logo {
  display: none;

  @media (max-width: $lg) {
    display: flex;
    align-items: center;
  }
}

// .app-header-notification-link {
//   width: 24px;
//   height: 24px;
//   margin-right: 40px;

//   @media (max-width: $lg) {
//     margin-right: 20px;
//   }

//   svg {
//     width: 100%;
//     height: 100%;
//     fill: currentColor;
//   }
// }

.app-header-burger {
  display: none;

  @media (max-width: $xl) {
    display: flex;
  }
}
</style>
