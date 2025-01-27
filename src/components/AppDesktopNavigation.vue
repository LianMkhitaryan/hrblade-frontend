<template>
  <nav class="app-desktop-navigation">
    <ul class="app-desktop-navigation-list">
      <li
        v-for="(link, index) in links"
        :key="index"
        class="app-desktop-navigation-list-item"
      >
        <router-link
          :to="link.to"
          :class="[
            'app-desktop-navigation-list-link',
            { 'only-exact': link.to === '/' }
          ]"
        >
          <!-- <component
            v-if="link.icon"
            :is="link.icon"
            class="app-desktop-navigation-list-link-icon"
          /> -->

          <a-icon
            v-if="link.icon"
            :type="link.icon"
            class="mr-10"
            style="color: #b6b6b9"
          />

          <span class="app-desktop-navigation-list-link-label mr-5">
            {{ link.label }}
          </span>

          <a-badge
            show-zero
            :count="link.count"
            :number-style="{
              color: '#535353',
              fontWeight: 600,
              backgroundColor: '#dedede'
            }"
          />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

// import IconDashboard from './icons/Dashboard.vue';
// import IconJobs from './icons/Jobs.vue';
// import IconCompanies from './icons/Companies.vue';
// import IconUsers from './icons/Users.vue';

export default {
  name: 'AppDesktopNavigation',

  components: {
    // IconDashboard,
    // IconJobs,
    // IconCompanies,
    // IconUsers
  },

  computed: {
    links() {
      return [
        {
          to: '/',
          count: this.jobsCount,
          icon: 'unordered-list',
          label: this.$t('navbar.links.interviews')
        },
        this.liveAvailable
          ? {
              to: '/live',
              count: this.interviewsCount,
              label: this.$t('navbar.links.live')
            }
          : null,
        {
          to: '/companies',
          count: this.companiesCount,
          // icon: 'icon-companies',
          label: this.$t('navbar.links.companies')
        },
        {
          to: '/users',
          count: this.usersCount,
          // icon: 'icon-users',
          label: this.$t('navbar.links.users')
        }
      ].filter((link) => !!link);
    },

    ...mapState({
      liveAvailable: ({ user }) => user.plan.live,
      jobsCount: ({ jobs }) => jobs.jobs.length,
      companiesCount: ({ company }) => company.companies.length,
      usersCount: ({ company }) => company.users.length,
      interviewsCount: (state) => state.live.interviews.length
    })
  }
};
</script>

<style lang="scss">
$link-color-active: #fda94c;

.app-desktop-navigation {
  height: 100%;

  @media (max-width: $xl) {
    margin: 20px;
  }

  @media (max-width: $lg) {
    display: none;
  }
}

.app-desktop-navigation-list {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 100%;
  list-style: none;
}

.app-desktop-navigation-list-item {
  height: 100%;

  &:not(:last-of-type) {
    margin-right: 30px;

    @media (max-width: $osx) {
      margin-right: 20px;
    }
  }
}

.app-desktop-navigation-list-link {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 14px;
  line-height: 1;
  font-family: 'Open Sans', sans-serif;

  &.router-link-active:not(.only-exact) {
    color: $link-color-active;
  }

  &.only-exact.router-link-exact-active {
    color: $link-color-active;
  }
}

.app-desktop-navigation-list-link-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  fill: currentColor;

  @media (max-width: $osx) {
    width: 16px;
    height: 16px;
  }
}

.app-desktop-navigation-list-link-label {
  font-weight: 300;
}
</style>
