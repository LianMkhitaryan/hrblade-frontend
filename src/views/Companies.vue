<template>
  <app-page class="page-companies" :loading="pageLoading || appLoading">
    <template slot="header">
      <a-row :gutter="[
          { lg: 20, xs: 10 },
          { lg: 20, xs: 10 }
        ]">
        <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
          <page-title class="mb-10">
            {{ $t('page_companies.title') }}
          </page-title>

          <div class="limit-info">
            <div class="limit-info-label">
              {{ `${$t('companies')}: ${companies.length}/${companiesLimit}` }}
            </div>

            <router-link v-if="companies.length >= companiesLimit" to="/profile" class="limit-info-link">
              <b>
                {{ $t('upgrade') }}
              </b>
            </router-link>
          </div>
        </a-col>

        <a-col :md="{ span: 12 }" :xs="{ span: 24 }" class="text-right-md">
          <router-link to="/companies/create">
            <app-button type="primary" size="large">
              {{ $t('create_new_company') }}
            </app-button>
          </router-link>
        </a-col>
      </a-row>
    </template>

    <card class="filter-card filter-card-normal mb-10">
      <a-row type="flex" align="bottom" :gutter="[
        { xl: 10, lg: 10, md: 10, sm: 10, xs: 10 },
        { xl: 0, lg: 10, md: 10, sm: 10, xs: 10 }
      ]">
        <a-col :xl="{ span: 6 }" :xs="{ span: 24 }">
          <a-input v-model="filter.search" size="small" :placeholder="$t('placeholders.search_by_name')">
            <icon-search slot="prefix" class="ant-input-prefix-icon" />
          </a-input>
        </a-col>

        <a-col class="page-support-filters" :xl="{ span: 18 }" :xs="{ span: 24 }">
          <a-select mode="multiple" size="small" :placeholder="$t('industry')"
            :class="{ 'hide-label': filter.industry.length }" :value="filter.industry" data-label="*"
            @change="onChangeFilterIndustry">
            <template slot="notFoundContent">
              <div class="ant-empty ant-empty-normal ant-empty-small">
                <div class="ant-empty-image">
                  <icon-more fill="rgba(0, 0, 0, 0.25)" />
                </div>

                <p class="ant-empty-description">{{ $t('no_data') }}</p>
              </div>
            </template>

            <a-select-option v-for="industry in industries" :key="industry.id" :value="industry.id">
              {{ industry.name }}
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
      <a-col v-for="(company, index) in filtredCompanies" :key="company.id" :span="24">
        <a-spin :spinning="cardLoadingId === company.id">
          <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

          <router-link :to="`/companies/view/${company.id}`" :class="[
              'company-card',
              { 'company-card-disabled': company.disabled }
            ]">
            <card class="page-companies-card">
              <a-avatar shape="square" :size="90" :src="company.logo">
                <icon-user-default-avatar />
              </a-avatar>

              <div class="page-companies-card-info">
                <span class="text-black font-weight-600">
                  {{ company.name }}
                </span>

                <div>
                  <div>
                    {{ `${$t('location')}:` }}
                    <span class="text-black font-weight-600">
                      {{ company.location || '-' }}
                    </span>
                  </div>

                  <div>
                    {{ `${$t('industry')}:` }}
                    <span class="text-black font-weight-600">
                      {{
                        company.industryId && industries.length
                        ? industries.find(
                          (industry) => industry.id === company.industryId
                        ).name
                        : '-'
                      }}
                    </span>
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-auto">
                  <span>
                    {{ `${$t('jobs')}:` }}

                    <span class="text-black font-weight-600">
                      {{ company.jobsCount }}
                    </span>
                  </span>

                  <span class="page-companies-card-actions">
                    <router-link :to="`/companies/edit/${company.id}`" class="mr-10">
                      <icon-edit class="fill-warning" />
                    </router-link>

                    <a-input class="page-companies-card-share-input" ref="companyInviteLink" readonly
                      :value="`${BASE_PATH_APP_URL}c/${company.shareHash}`" />

                    <b class="mr-10" @click.stop.prevent="() => onCopyCompanyLink(index)">
                      <icon-share class="fill-warning" />
                    </b>

                    <a-popconfirm :title="`${$t('are_you_sure')}?`" @confirm="handleRemoveCompany(company.id)">
                      <a href="#">
                        <icon-del class="fill-danger" />
                      </a>
                    </a-popconfirm>
                  </span>
                </div>
              </div>
            </card>
          </router-link>
        </a-spin>
      </a-col>
    </a-row>
  </app-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { BASE_PATH_APP_URL } from '../js/const/index.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';

import IconSearch from '../components/icons/Search.vue';
import IconEdit from '../components/icons/Edit.vue';
import IconDel from '../components/icons/Del.vue';
import IconUserDefaultAvatar from '../components/icons/UserDefaultAvatar.vue';
import IconMore from '../components/icons/More.vue';
import IconShare from '../components/icons/Share.vue';

export default {
  name: 'Companies',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    IconSearch,
    IconEdit,
    IconDel,
    IconUserDefaultAvatar,
    IconMore,
    IconShare
  },

  data() {
    return {
      BASE_PATH_APP_URL,
      pageLoading: false,
      cardLoadingId: null,
      filter: {
        search: '',
        date: [],
        industry: []
      }
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.$t('page_companies.title')}`
    };
  },

  computed: {
    filtredCompanies() {
      const {
        filter: { search, date, industry },
        companies
      } = this;

      return companies
        .map((company, index) => ({
          ...company,
          disabled: index + 1 > this.companiesLimit
        }))
        .filter((company) => {
          const name = company.name.toLowerCase();
          const searchText = search.toLowerCase();

          return name.indexOf(searchText) >= 0 ? company : false;
        })
        .filter(function (company) {
          if (industry.length) {
            return this.indexOf(company.industryId) >= 0;
          } else {
            return company;
          }
        }, industry)
        .sort((a, b) => {
          if (date[0] === 'CREATE_DATE') {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }

          if (date[0] === 'UPDATE_DATE') {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          }
        });
    },

    ...mapState({
      appLoading: ({ app }) => app.appLoading,
      industries: ({ app }) => app.industries,
      companies: ({ company }) => company.companies,
      companiesLimit: ({ user }) => user.plan.companiesLimit
    })
  },

  beforeRouteEnter(to, from, next) {
    if (to.query.reload) {
      next(async (vm) => {
        vm.pageLoading = true;
        await vm.getCompanies();
        vm.pageLoading = false;
      });
    }

    next();
  },

  methods: {
    onChangeFilterIndustry(value) {
      this.filter.industry = value;
    },

    onChangeFilterDate(value) {
      this.filter.date = value.filter((date) => date !== this.filter.date[0]);
    },

    onCopyCompanyLink(index) {
      this.$refs.companyInviteLink[index].$el.select();
      this.$refs.companyInviteLink[index].$el.setSelectionRange(0, 99999);

      document.execCommand('copy');
      document.getSelection().removeAllRanges();

      this.$notification.success({
        message: this.$t('notify.success'),
        description: this.$t('notify.link_added_to_clipboard'),
        icon: () => <icon-success class="success-icon" />
      });
    },

    clearFilters() {
      this.filter.search = '';
      this.filter.date = [];
      this.filter.industry = [];
    },

    async handleRemoveCompany(id) {
      this.cardLoadingId = id;
      await this.removeCompany(id);
      this.getJobs();
      this.cardLoadingId = null;
    },

    ...mapActions({
      getCompanies: 'company/getCompanies',
      removeCompany: 'company/removeCompany',
      getJobs: 'jobs/getJobs'
    })
  }
};
</script>

<style lang="scss">
.company-card {
  display: block;

  &.company-card-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.page-companies-card {
  transition: 0.15s;

  &:hover {
    box-shadow: 0 0 12px 0 rgba(150, 152, 163, 0.2);
  }

  .card-inner {
    flex-direction: row;
  }

  .ant-avatar {
    flex-shrink: 0;
  }
}

.page-companies-card-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-companies-card-actions {
  svg {
    width: 18px;
    height: 18px;
    fill: #969696;
    transition: 0.15s;

    &:hover {
      fill: $black;
    }
  }
}

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

.page-companies-card-share-input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -10;
}
</style>
