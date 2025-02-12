<template>
  <div class="user-dropdown-container" @mouseleave="isOpen = false">
    <router-link :to="to" class="user">
      <a-avatar
        class="avatar-wrapper"
        @click="toggleDropdown"
        @mouseover="isOpen = true"
        :size="50"
        :src="avatar"
      >
        <icon-user-default-avatar></icon-user-default-avatar>
      </a-avatar>
    </router-link>
    <!-- Dropdown Menu -->
    <transition name="fade">
      <div v-if="isOpen" class="dropdown-menu">
        <router-link to="/profile" class="dropdown-item">{{
          $t('Profile')
        }}</router-link>
        <router-link to="/profile/plan" class="dropdown-item">{{
          $t('Choose a Plan')
        }}</router-link>
        <router-link to="/profile/usage" class="dropdown-item">{{
          $t('Billing & Usage')
        }}</router-link>
        <router-link to="/profile/integrations" class="dropdown-item">{{
          $t('Integrations')
        }}</router-link>

        <button @click="logout" class="dropdown-item logout mt-10">
          {{ $t('Logout') }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import IconUserDefaultAvatar from './icons/UserDefaultAvatar.vue';
import removeTokenFromLocalStorage from '../js/helpers/removeTokenFromLocalStorage.js';

export default {
  name: 'User',

  components: {
    IconUserDefaultAvatar
  },

  props: {
    to: {
      type: String,
      default: '/'
    },

    avatar: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    logout() {
      removeTokenFromLocalStorage();
      this.$router.go('/login');
    }
  }
};
</script>

<style lang="scss">
.user {
  padding: 0 20px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #dedede;

  @media (max-width: $osx) {
    padding: 0 10px;
  }

  @media (max-width: $lg) {
    padding: 0;
    width: 90px;
  }

  @media (max-width: $sm) {
    width: 80px;
    height: 80px;
  }
}

.avatar-wrapper {
  cursor: pointer;
}
.user-dropdown-container {
  position: relative;
  display: inline-block;
  z-index: 2000;

  .dropdown-menu {
    position: absolute;
    top: 70px;
    right: 10px;
    width: 300px;
    height: 275;
    padding: 31px 46px 28px;
    background: white;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.25);
    z-index: 1;
    display: flex;
    flex-direction: column;
    visibility: visible;
    opacity: 1;
  }

  .dropdown-item {
    display: block;
    padding-bottom: 10px;
    color: black;
    text-decoration: none;
    transition: background 0.3s, color 0.3s;
    font-size: 18px;
    font-weight: 600;
    line-height: 2.2;

    &:hover {
      color: #ffab42;
    }
  }

  .dropdown-divider {
    margin: 5px 0;
  }

  .logout {
    width: 100%;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
  }
}

/* Ensure all parent containers allow overflow */
.navbar,
.navbar-container,
.some-other-parent {
  overflow: visible !important;
}

/* Smooth fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
