<template>
  <div :class="['app-menu-jobs', { 'app-menu-jobs-collapsed': menuCollapsed }]">
    <router-link to="/jobs/create">
      <app-button type="primary" class="w-100 app-menu-jobs-button-crete">
        <span class="app-menu-jobs-button-crete-text">
          {{ $t('create_new_interview') }}
        </span>

        <div class="app-menu-jobs-button-crete-icon">
          <icon-plus />
        </div>
      </app-button>
    </router-link>

    <router-link to="/" class="app-menu-jobs-link-all">
      <icon-burger />
    </router-link>

    <ul v-if="jobs.length" class="app-menu-jobs-list" :dir="this.$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
      <template v-for="(job, index) in jobs">
        <li v-if="index + 1 <= jobsLimit" :key="job.id" class="app-menu-jobs-list-item">
          <router-link :to="`/jobs/vacancy/${job.id}`" :class="[
              'app-menu-jobs-list-item-link',
              {
                'app-menu-jobs-list-item-link-disabled': index + 1 > jobsLimit,
                'router-link-exact-active': job.id === viewedJobId
              }
            ]">
            <div class="d-flex flex-column">
              <page-title tag="h3" size="12" class="mb-0">
                {{ job.name }}
              </page-title>

              <span v-if="companies.length">
                {{
                  companies.find((company) => company.id === job.companyId).name
                }}
              </span>
            </div>

            <a-badge :count="job.interviewedCount" show-zero></a-badge>
          </router-link>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AppButton from './AppButton.vue';
import PageTitle from './PageTitle.vue';
import IconPlus from './icons/Plus.vue';
import IconBurger from './icons/Burger.vue';

export default {
  name: 'AppMenuJobs',

  components: {
    AppButton,
    PageTitle,
    IconPlus,
    IconBurger
  },

  props: {
    menuCollapsed: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState({
      jobs: ({ jobs }) => jobs.jobs.filter((job) => job.active),
      jobsLimit: ({ user }) => user.plan.jobsLimit,
      viewedJobId: ({ jobs }) => jobs.viewedJobId,
      companies: ({ company }) => company.companies
    })
  }
};
</script>

<style lang="less">
.app-menu-jobs {
  margin-top: 40px;
  margin-bottom: 20px;
  padding: 0 20px;

  &.app-menu-jobs-collapsed {
    margin-top: 20px;

    .app-menu-jobs-button-crete {
      padding: 0 10px;
    }

    .app-menu-jobs-button-crete-text {
      display: none;
    }

    .app-menu-jobs-button-crete-icon {
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    .app-menu-jobs-list {
      display: none;
    }

    .app-menu-jobs-link-all {
      display: flex;
    }
  }
}

.app-menu-jobs-button-crete-icon {
  display: none;
  color: #fff;
  font-size: 10px;
  text-align: center;

  svg {
    margin-top: -3px !important;
    width: 18px !important;
    height: 18px !important;
    // margin-bottom: 5px !important;
  }
}

.app-menu-jobs-list {
  margin: 20px 0 0 0;
  padding: 0;
  list-style: none;
}

.app-menu-jobs-list-item {
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }

  .ant-badge {
    margin-left: 10px;
  }

  .ant-badge-count {
    background-color: #403c54;
    box-shadow: none;
  }
}

.app-menu-jobs-list-item-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px;
  border-radius: 5px;
  color: #ffffff;
  transition: 0.15s;
  background-color: rgba(#ffffff, 0.1);

  &:hover {
    background-color: rgba(#ffffff, 0.15);
  }

  &.app-menu-jobs-list-item-link-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.router-link-exact-active {
    background-color: #2f2b47;

    &:hover {
      background-color: lighten(#2f2b47, 5%);
    }

    .ant-badge-count {
      background-color: #ffab42;
    }
  }

  h3 {
    margin-bottom: 3px;
    color: #fff;
  }

  span {
    font-size: 10px;
    color: rgba(#ffffff, 0.7);
  }
}

.app-menu-jobs-link-all {
  margin-top: 10px;
  display: none;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 35px;
  padding: 0 10px;
  border-radius: 5px;
  transition: 0.15s;
  background-color: rgba(#ffffff, 0.1);

  &:hover {
    background-color: rgba(#ffffff, 0.15);
  }

  svg {
    width: 18px;
    height: 18px;
    fill: #ffffff;
  }
}
</style>
