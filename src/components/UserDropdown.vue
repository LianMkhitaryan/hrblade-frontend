<template>
  <a-dropdown placement="bottomRight" overlayClassName="user-dropdown">
    <a class="ant-dropdown-link">
      <a-avatar :size="40" :src="avatar" icon="user" />
    </a>

    <div class="ant-dropdown-body" slot="overlay">
      <div class="ant-dropdown-body-inner">
        <ul class="user-dropdown-list">
          <li class="user-dropdown-list-item">
            <router-link to="/profile" class="user-dropdown-list-link">
              <icon-user class="user-dropdown-list-link-icon"></icon-user>
              <span class="user-dropdown-list-link-label">Profile</span>
            </router-link>
          </li>
          <li class="user-dropdown-list-item">
            <router-link to="/support" class="user-dropdown-list-link">
              <icon-support class="user-dropdown-list-link-icon"></icon-support>
              <span class="user-dropdown-list-link-label">Support</span>
            </router-link>
          </li>

          <a-divider />

          <li class="user-dropdown-list-item">
            <a
              class="user-dropdown-list-link user-dropdown-list-link-log-out"
              @click="logOut"
            >
              <icon-logout class="user-dropdown-list-link-icon"></icon-logout>
              <span class="user-dropdown-list-link-label">Log out</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </a-dropdown>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest.js';
import removeTokenFromLocalStorage from '../js/helpers/removeTokenFromLocalStorage.js';

import IconUser from './icons/User.vue';
import IconSupport from './icons/Support.vue';
import IconLogout from './icons/Logout.vue';

export default {
  name: 'UserDropdown',

  components: {
    IconUser,
    IconSupport,
    IconLogout
  },

  props: {
    avatar: {
      type: String,
      default: ''
    }
  },

  methods: {
    async logOut() {
      await apiRequest('logout', 'POST', null, true);
      removeTokenFromLocalStorage();
      window.location.href = 'https://interwoo.com/logout';
    }
  }
};
</script>

<style lang="scss">
$link-color-active: $blue;

.user-dropdown {
  .ant-dropdown-body {
    width: 155px;
  }
}

.user-dropdown-list {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  list-style: none;
}

.user-dropdown-list-item {
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
}

.user-dropdown-list-link {
  display: flex;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;

  &.user-dropdown-list-link-log-out {
    color: $red;
  }
}

.user-dropdown-list-link-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  fill: currentColor;
}

.user-dropdown-list-link-label {
  font-size: 14px;
}
</style>
