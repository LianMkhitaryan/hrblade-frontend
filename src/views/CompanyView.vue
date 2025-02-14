<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <div v-if="company !== null" class="page-company-view">
    <div class="page-company-view-header">
      <container>
        <a-row :gutter="[0, 30]">
          <a-col :span="24">
            <div class="page-company-view-logo">
              <a-avatar :size="85" :src="company.logo">
                <icon-user-default-avatar />
              </a-avatar>
            </div>
          </a-col>

          <a-col :span="24">
            <PageTitle tag="h2" size="25" style="margin-bottom: 0px;">
              {{ company.name }}
            </PageTitle>
          </a-col>

          <a-col v-if="company.website" :span="24">
            <a
              :href="company.website"
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>
                {{ company.website }}
              </small>
            </a>
          </a-col>

          <!-- <a-col :md="{ offset: 5, span: 14 }">
            <div>
              We are committed to the professional development of your staff.
              Our world-class instructors together with our organisational team
              deliver public and bespoke training across the globe to develop
              the skills your business needs.
            </div>
          </a-col> -->
        </a-row>
      </container>
    </div>

    <div class="page-company-view-body">
      <container>
        <a-row :gutter="[0, 30]">
          <a-col :span="24">
            <div class="page-company-view-body-title">
              <PageTitle tag="h2" size="25" style="margin-bottom: 0px;">
                {{ $t('Open positions') }}
              </PageTitle>
            </div>
          </a-col>

          <a-col :span="24">
            <a-row :gutter="[20, 20]">
              <a-col :sm="12" :span="24">
                <a-input
                  v-model="filter.search"
                  size="small"
                  :placeholder="$t('placeholders.search_by_name')"
                >
                  <icon-search slot="prefix" class="ant-input-prefix-icon" />
                </a-input>
              </a-col>

              <a-col :sm="12" :span="24">
                <a-select
                  mode="multiple"
                  size="small"
                  :placeholder="$t('placeholders.location')"
                  :class="{ 'hide-label': filter.location.length }"
                  :value="filter.location"
                  data-label="*"
                  @change="onChangeFilterLocation"
                >
                  <template slot="notFoundContent">
                    <div class="ant-empty ant-empty-normal ant-empty-small">
                      <div class="ant-empty-image">
                        <icon-more fill="rgba(0, 0, 0, 0.25)" />
                      </div>
                      <p class="ant-empty-description">{{ $t('no_data') }}</p>
                    </div>
                  </template>

                  <a-select-option
                    v-for="(location, index) in jobs
                      .filter((job) => job.location)
                      .map((job) => job.location)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )"
                    :key="index"
                    :value="location"
                  >
                    {{ location }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-col>

          <a-col :span="24">
            <a-row type="flex" :gutter="[20, 20]">
              <a-col v-for="job in jobsList" :key="job.id" :sm="12" :span="24">
                <card class="page-company-view-card">
                  <a-row type="flex" :gutter="[0, 20]" style="height: 100%;">
                    <a-col :span="24">
                      <PageTitle tag="h3" size="20" style="margin-bottom: 0px;">
                        {{ job.name }}
                      </PageTitle>
                    </a-col>

                    <a-col v-if="job.location || job.salary" :span="24">
                      {{
                        `${job.location || ''} ${
                          job.salary ? `/ ${job.salary}` : ''
                        }`
                      }}
                    </a-col>

                    <a-col v-if="job.description" :span="24">
                      <div>
                        {{
                          `${job.description
                            .replace(/(<([^>]+)>)/gi, '')
                            .substring(0, 200)}...`
                        }}
                      </div>
                    </a-col>

                    <a-col :span="24">
                      <a
                        :href="`${BASE_PATH_APP_URL}i/${job.hash_link}`"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <app-button :style="buttonStyles" size="large">
                          {{ $t('See position') }}
                        </app-button>
                      </a>
                    </a-col>
                  </a-row>
                </card>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </container>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { BASE_PATH_APP_URL } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest';

import PageTitle from '../components/PageTitle.vue';
import Container from '../components/Container.vue';
import Card from '../components/Card.vue';
import AppButton from '../components/AppButton.vue';

import IconUserDefaultAvatar from '../components/icons/UserDefaultAvatar.vue';
import IconSearch from '../components/icons/Search.vue';
import IconMore from '../components/icons/More.vue';

export default {
  name: 'CompanyView',

  components: {
    PageTitle,
    Container,
    Card,
    AppButton,
    IconUserDefaultAvatar,
    IconSearch,
    IconMore
  },

  data() {
    return {
      BASE_PATH_APP_URL,
      company: null,
      jobs: [],
      filter: {
        search: '',
        location: []
      }
    };
  },

  metaInfo() {
    if (this.company) {
      return {
        title: this.company.name,
        meta: [
          { vmid: 'description', name: 'description', content: '' },
          {
            vmid: 'og:title',
            property: 'og:title',
            content: this.company.name
          },
          { vmid: 'og:description', property: 'og:description', content: '' },
          {
            vmid: 'og:site_name',
            property: 'og:site_name',
            content: this.company.website
          },
          {
            vmid: 'og:image',
            property: 'og:image',
            content: this.company.logo
          }
        ]
      };
    }
  },

  computed: {
    jobsList() {
      const {
        filter: { search, location },
        jobs
      } = this;

      return jobs
        .filter((job) => {
          const name = job.name.toLowerCase();
          const searchText = search.toLowerCase();

          return name.indexOf(searchText) >= 0 ? job : false;
        })
        .filter(function(job) {
          if (location.length) {
            return this.indexOf(job.location) >= 0;
          } else {
            return job;
          }
        }, location);
    },
    buttonStyles() {
      const bgColor = this.company?.buttons_color || '#fda94c';
      return {
        backgroundColor: bgColor,
        borderColor: bgColor,
        color:
          parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2
            ? '#000'
            : '#fff'
      };
    }
  },

  created() {
    this.getCompanyInfo();
  },

  methods: {
    onChangeFilterLocation(value) {
      this.filter.location = value;
    },

    async getCompanyInfo() {
      try {
        const {
          params: { hash }
        } = this.$route;

        const res = await apiRequest(`company/${hash}`, 'GET', null);

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

        if (error) {
          this.$router.replace('/404');
        } else {
          console.log(`response`, response);
          this.company = response.data;
          this.jobs = response.data.jobs;

          this.SET_APP_LOADING();
        }
      } catch (error) {
        console.log('getCompanyInfo:', error);
      }
    },

    ...mapMutations({
      SET_APP_LOADING: 'app/SET_APP_LOADING'
    })
  }
};
</script>

<style lang="scss">
.page-company-view {
  padding: 40px 0 70px;

  @media (max-width: $md) {
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }
}

.page-company-view-header {
  text-align: center;
}

.page-company-view-body {
  margin-top: 100px;
  padding: 50px 0;
  text-align: left;
  background-color: rgba(#e2e1e9, 0.25);
}

.page-company-view-body-title {
  text-align: center;
}

.page-company-view-card {
  height: 100%;
}
</style>
