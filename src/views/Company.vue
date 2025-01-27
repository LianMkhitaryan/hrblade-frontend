<template>
  <app-page class="page-company" :loading="pageLoading">
    <template v-if="companyInfo.id">
      <template slot="header">
        <a-breadcrumb class="mb-5" separator=">">
          <a-breadcrumb-item>
            <router-link to="/companies">
              {{ $t('breadcrumbs.companies') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            {{ companyInfo.name }}
          </a-breadcrumb-item>
        </a-breadcrumb>

        <a-row
          type="flex"
          :gutter="[
            { lg: 20, sm: 10, xs: 10 },
            { md: 0, sm: 20, xs: 20 }
          ]"
        >
          <a-col :lg="12" :span="24">
            <page-title class="d-flex align-items-center">
              <a-avatar
                shape="square"
                :size="30"
                :src="companyInfo.logo"
                class="mr-10"
              >
                <icon-user-default-avatar />
              </a-avatar>

              {{ companyInfo.name }}
            </page-title>
          </a-col>

          <a-col :lg="12" :span="24">
            <div class="d-flex align-items-center-sm justify-content-end-lg">
              <div class="button-block">
                <router-link
                  :to="`/companies/edit/${companyId}`"
                  class="button-block-item mr-20-i"
                >
                  <app-button type="link" class="px-0">
                    <icon-edit class="small fill-warning mr-5" />

                    {{ $t('edit') }}
                  </app-button>
                </router-link>

                <a-popconfirm
                  :title="`${$t('are_you_sure')}?`"
                  class="button-block-item"
                  @confirm="handleRemoveCompany"
                >
                  <app-button type="link" class="px-0">
                    <icon-del class="small fill-danger mr-5" />

                    {{ $t('delete') }}
                  </app-button>
                </a-popconfirm>
              </div>
            </div>
          </a-col>
        </a-row>

        <a-row
          :gutter="{ lg: 20, md: 10, sm: 10, xs: 10 }"
          class="mt-tablet-15"
        >
          <a-col :span="24">
            <div class="button-block">
              <router-link to="/jobs/create" class="button-block-item">
                <app-button type="primary" size="large">
                  {{ $t('page_companies.create_new_job') }}
                </app-button>
              </router-link>
            </div>
          </a-col>
        </a-row>
      </template>

      <div class="mb-50">
        <a-row
          :gutter="[
            { md: 20, sm: 10, xs: 10 },
            { lg: 0, sm: 10, xs: 10 }
          ]"
        >
          <a-col :lg="5" :sm="8" :span="12">
            <div class="d-flex flex-column">
              <div class="text-gray-300">
                {{ $t('location') }}
              </div>

              <div class="text-black font-weight-600">
                {{ companyInfo.location || '-' }}
              </div>
            </div>
          </a-col>

          <a-col :lg="5" :sm="8" :span="12">
            <div class="d-flex flex-column">
              <div class="text-gray-300">
                {{ $t('industry') }}
              </div>

              <div class="text-black font-weight-600">
                {{ companyInfo.industry.name }}
              </div>
            </div>
          </a-col>

          <a-col :lg="5" :sm="8" :span="12">
            <div class="d-flex flex-column">
              <div class="text-gray-300">
                {{ $t('page_companies.active_interviews') }}
              </div>

              <div class="text-black font-weight-600">
                {{ companyJobs.filter((job) => job.active).length }}
              </div>
            </div>
          </a-col>
        </a-row>
      </div>

      <a-row
        v-if="companyJobs.length"
        class="w-100"
        type="flex"
        :gutter="[{ lg: 20 }, { lg: 20, md: 20, sm: 10, xs: 10 }]"
      >
        <a-col :span="24">
          <page-title tag="h3" size="25">
            {{ $t('page_companies.active_jobs_listings') }}
          </page-title>
        </a-col>

        <a-col v-for="job in companyJobs" :key="job.id" :lg="12" :span="24">
          <job-card :info="job" small-card @change-active="onChangeJobActive" />
        </a-col>
      </a-row>
    </template>
  </app-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import JobCard from '../components/JobCard.vue';

import IconEdit from '../components/icons/Edit.vue';
import IconDel from '../components/icons/Del.vue';
import IconUserDefaultAvatar from '../components/icons/UserDefaultAvatar.vue';

export default {
  name: 'Company',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    JobCard,
    IconEdit,
    IconDel,
    IconUserDefaultAvatar
  },

  data() {
    return {
      pageLoading: false,
      companyInfo: {},
      companyJobs: []
    };
  },

  metaInfo() {
    const companyName = this.companyInfo.name;

    return {
      title: `HRBLADE ${companyName ? '|' : ''} ${
        companyName ? companyName : ''
      }`
    };
  },

  computed: {
    companyId() {
      return this.$route.params.id;
    },

    ...mapState({
      industries: ({ app }) => app.industries
    })
  },

  created() {
    this.getCompanyInfo();
  },

  methods: {
    onChangeJobActive(jobId) {
      const job = this.companyJobs.find((job) => job.id === jobId);
      job.active = !job.active;
    },

    async handleRemoveCompany() {
      this.pageLoading = true;
      await this.removeCompany(this.companyId);
      this.pageLoading = false;

      this.getJobs();

      this.$router.push({ path: '/companies', query: { reload: true } });
    },

    async getCompanyInfo() {
      try {
        this.pageLoading = true;
        const res = await apiRequest(
          `company/get/${this.companyId}`,
          'GET',
          null,
          true
        );
        this.pageLoading = false;

        const { error, response } = res;

        if (response.message) {
          this.$notification[error ? 'warning' : 'success']({
            message: error
              ? this.$t('notify.warning')
              : this.$t('notify.success'),
            description: response.message,
            icon: () =>
              error ? (
                <icon-error class="error-icon" />
              ) : (
                <icon-success class="success-icon" />
              )
          });
        }

        if (res.error) {
          this.$router.replace('/companies');
        } else {
          const {
            data: {
              id,
              name,
              location,
              industry_id,
              agency_id,
              logo,
              website,
              jobs
            }
          } = response;

          this.companyInfo = {
            id,
            name,
            location,
            industry: {
              id: industry_id,
              name: industry_id
                ? this.industries.find(
                    (industry) => industry.id === industry_id
                  ).name
                : '-'
            },
            agency_id,
            logo,
            website
          };

          this.companyJobs = jobs.map(parseJobs);
        }
      } catch (error) {
        console.log(error);
      }
    },

    ...mapActions({
      removeCompany: 'company/removeCompany',
      getJobs: 'jobs/getJobs'
    })
  }
};
</script>

<style lang="scss">
.page-company-info-card-content {
  display: flex;

  @media (max-width: $sm) {
    flex-direction: column;
  }

  .ant-avatar {
    flex-shrink: 0;
  }

  .user-card-list {
    width: 100%;
    margin-left: 25px;

    @media (max-width: $sm) {
      margin-top: 25px;
      margin-left: 0;
    }
  }
}

.page-company-chart {
  > div {
    height: 260px;
  }
}
</style>
