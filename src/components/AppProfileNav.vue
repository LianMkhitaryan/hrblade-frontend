<template>
  <nav class="app-profile-navigation">
    <ul class="app-profile-navigation-list">
      <li
        v-for="(link, index) in links"
        :key="index"
        class="app-profile-navigation-list-item"
      >
        <router-link
          :to="link.to"
          :class="[
            'app-profile-navigation-list-link',
            { 'only-exact': link.to === '/profile' }
          ]"
        >
          <!-- <component
            v-if="link.icon"
            :is="link.icon"
            class="app-desktop-navigation-list-link-icon"
          /> -->

          <span class="app-profile-navigation-list-link-label mr-5">
            {{ link.label }}
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: 'AppProfileNav',

  components: {},

  computed: {
    links() {
      return [
        {
          to: '/profile',
          label: 'Account'
        },
        {
          to: '/profile/plan',
          label: 'Choose a plan'
        },
        {
          to: '/profile/usage',
          label: 'Billing & Usage'
        },
        {
          to: '/profile/integrations',
          label: 'Integrations'
        }
      ].filter((link) => !!link);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-profile-navigation {
  height: 100%;
}

.app-profile-navigation-list {
  display: flex;
  margin: 0;
  padding: 0;
  height: 100%;
  list-style: none;
}

.app-profile-navigation-list-item {
  height: 100%;

  &:not(:last-of-type) {
    margin-right: 30px;
  }
}

.app-profile-navigation-list-link {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  font-family: 'Open Sans', sans-serif;
  padding-bottom: 9px;

  &.router-link-active:not(.only-exact),
  &.only-exact.router-link-exact-active {
    border-bottom: 6px solid #ffab42;
  }
}

.app-profile-navigation-list-link-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  fill: currentColor;

  @media (max-width: $osx) {
    width: 16px;
    height: 16px;
  }
}

.app-profile-navigation-list-link-label {
  font-weight: 300;
}
</style>
