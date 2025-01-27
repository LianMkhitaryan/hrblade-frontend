<template>
  <app-page class="page-jobs">
    <template slot="header">
      <a-row :gutter="[
        { lg: 20, xs: 10 },
        { lg: 20, xs: 10 }
      ]">
        <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
          <page-title class="mb-10">
            {{ $t('page_jobs.title') }}
          </page-title>

          <div class="limit-info">
            <div class="limit-info-label">
              {{ `${$t('interviews')}: ${jobs.length}/${jobsLimit}` }}
            </div>

            <router-link v-if="jobs.length >= jobsLimit" to="/profile" class="limit-info-link">
              <b>
                {{ $t('upgrade') }}
              </b>
            </router-link>
          </div>

          <!-- <app-button
            type="link"
            class="pl-0"
            :loading="downloadVideosLoading"
            @click="handleDowloadVideos"
          >
            <icon-download class="mr-5" />
            {{ $t('Export all videos') }}
          </app-button> -->
        </a-col>

        <a-col :md="{ span: 12 }" :xs="{ span: 24 }" class="text-right-md">
          <router-link to="/jobs/create">
            <app-button type="primary" size="large">
              {{ $t('create_new_interview') }}
            </app-button>
          </router-link>
        </a-col>
      </a-row>
    </template>

    <card class="filter-card filter-card-normal mb-10">
      <a-row type="flex" align="bottom" :gutter="[
        { sm: 10, xs: 10 },
        { xl: 0, sm: 10, xs: 10 }
      ]">
        <a-col :xl="{ span: 6 }" :xs="{ span: 24 }">
          <a-input v-model="filter.search" size="small" :placeholder="$t('placeholders.search_by_name')">
            <icon-search slot="prefix" class="ant-input-prefix-icon" />
          </a-input>
        </a-col>

        <a-col class="page-support-filters" :xl="{ span: 18 }" :xs="{ span: 24 }">
          <a-select mode="multiple" size="small" :placeholder="$t('placeholders.all_compamies')"
            :class="{ 'hide-label': filter.company.length }" :value="filter.company" data-label="*"
            @change="onChangeFilterCompany">
            <template slot="notFoundContent">
              <div class="ant-empty ant-empty-normal ant-empty-small">
                <div class="ant-empty-image">
                  <icon-more fill="rgba(0, 0, 0, 0.25)" />
                </div>

                <p class="ant-empty-description">{{ $t('no_data') }}</p>
              </div>
            </template>

            <a-select-option v-for="company in companies" :key="company.id">
              {{ company.name }}
            </a-select-option>
          </a-select>

          <a-select mode="multiple" size="small" :placeholder="$t('placeholders.all_statuses')"
            :class="['ml-10', { 'hide-label': filter.status.length }]" :value="filter.status" data-label="*"
            @change="onChangeFilterStatus">
            <template slot="notFoundContent">
              <div class="ant-empty ant-empty-normal ant-empty-small">
                <div class="ant-empty-image">
                  <icon-more fill="rgba(0, 0, 0, 0.25)" />
                </div>

                <p class="ant-empty-description">{{ $t('no_data') }}</p>
              </div>
            </template>

            <a-select-option value="ACTIVE">
              {{ $t('active') }}
            </a-select-option>

            <a-select-option value="NOT_ACTIVE">
              {{ $t('not_active') }}
            </a-select-option>
          </a-select>

          <a-select size="small" mode="tags" :placeholder="$t('placeholders.date_sort')"
            :class="['ml-10', { 'hide-label': filter.date.length }]" :value="filter.date" data-label="*"
            @change="onChangeFilterDate">
            <template slot="notFoundContent">
              <div class="ant-empty ant-empty-normal ant-empty-small">
                <div class="ant-empty-image">
                  <icon-more fill="rgba(0, 0, 0, 0.25)" />
                </div>

                <p class="ant-empty-description">{{ $t('no_data') }}</p>
              </div>
            </template>

            <a-select-option value="CREATE_DATE">
              {{ $t('placeholders.creation_date') }}
            </a-select-option>

            <a-select-option value="UPDATE_DATE">
              {{ $t('placeholders.update_date') }}
            </a-select-option>

            <a-select-option value="START_DATE">
              {{ $t('placeholders.start_date') }}
            </a-select-option>

            <a-select-option value="END_DATE">
              {{ $t('placeholders.end_date') }}
            </a-select-option>
          </a-select>

          <app-button class="ml-10" @click="clearFilters">
            {{ $t('clear_all') }}
          </app-button>
        </a-col>
      </a-row>
    </card>

    <a-row :gutter="[
      { lg: 20, xs: 10 },
      { sm: 10, xs: 10 }
    ]">
      <a-col v-for="job in filtredJobs" :key="job.id" :span="24">
        <job-card :info="job" :disabled="job.disabled" @change-active="onChangeJobActive" />
      </a-col>
    </a-row>
  </app-page>
</template>

<script>
import { mapState } from 'vuex';
import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';
import JobCard from '../components/JobCard.vue';

import IconSearch from '../components/icons/Search.vue';
import IconMore from '../components/icons/More.vue';
// import IconDownload from '../components/icons/Download.vue';

export default {
  name: 'Jobs',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    JobCard,
    IconSearch,
    IconMore
    // IconDownload
  },

  data() {
    return {
      filter: {
        search: '',
        company: [],
        status: [],
        date: []
      }
      // downloadVideosLoading: false
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.$t('page_jobs.title')}`
    };
  },

  computed: {
    filtredJobs() {
      const {
        filter: { search, company, status, date },
        jobs
      } = this;

      return jobs
        .map((job, index) => ({ ...job, disabled: index + 1 > this.jobsLimit }))
        .filter((job) => {
          const name = job.name.toLowerCase();
          const searchText = search.toLowerCase();

          return name.indexOf(searchText) >= 0 ? job : false;
        })
        .filter(function (job) {
          if (company.length) {
            return this.indexOf(job.companyId) >= 0;
          } else {
            return job;
          }
        }, company)
        .filter(function (job) {
          if (status.length) {
            const status = job.active ? 'ACTIVE' : 'NOT_ACTIVE';

            return this.indexOf(status) >= 0;
          } else {
            return job;
          }
        }, status)
        .sort((a, b) => {
          if (date[0] === 'CREATE_DATE') {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }

          if (date[0] === 'UPDATE_DATE') {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          }

          if (date[0] === 'START_DATE') {
            return new Date(a.startAt) - new Date(b.startAt);
          }

          if (date[0] === 'END_DATE') {
            return new Date(a.interviewExpiry) - new Date(b.interviewExpiry);
          }
        });
    },

    ...mapState({
      jobs: ({ jobs }) => jobs.jobs,
      jobsLimit: ({ user }) => user.plan.jobsLimit,
      companies: ({ company }) => company.companies
    })
  },

  methods: {
    onChangeJobActive(jobId) {
      const job = this.jobs.find((job) => job.id === jobId);

      job.active = !job.active;
    },

    onChangeFilterCompany(value) {
      this.filter.company = value;
    },

    onChangeFilterStatus(value) {
      this.filter.status = value;
    },

    onChangeFilterDate(value) {
      this.filter.date = value.filter((date) => date !== this.filter.date[0]);
    },

    clearFilters() {
      this.filter.search = '';
      this.filter.status = [];
      this.filter.date = [];
    }

    // async handleDowloadVideos() {
    //   console.log('123', 123);
    // }
  }
};
</script>

<style lang="scss">
.page-support-filters {
  text-align: right;

  .ant-select {
    max-width: 180px;
  }

  @media (max-width: $xl) {
    display: flex;
    text-align: left;

    .ant-select {
      max-width: 208px;
    }
  }

  @media (max-width: $lg) {
    .ant-select {
      max-width: 268px;
    }
  }

  @media (max-width: $md) {
    flex-wrap: wrap;

    .ant-select {
      max-width: 100%;
      flex-basis: calc(50% - 5px);
      margin: 0 5px 10px;

      &:nth-child(odd) {
        margin-left: 0;
      }

      &:nth-child(even) {
        margin-right: 0;
      }
    }

    .app-button {
      margin-left: 0;
    }
  }

  @media (max-width: $sm) {
    .ant-select {
      max-width: 100%;
      flex-basis: 100%;
      margin: 0 0 10px 0;
    }
  }
}
</style>
