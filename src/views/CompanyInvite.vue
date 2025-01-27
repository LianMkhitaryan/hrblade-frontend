<template>
  <a-spin :spinning="!isInfoLoading">
    <div v-if="isInfoLoading">
      <page-title tag="h2" size="35">
        {{ $t('your_invited_to_work_together_in') }}

        <ul class="company-invite-list">
          <li v-for="(company, index) in companies" :key="index">
            {{ `- ${company}` }}
          </li>
        </ul>
      </page-title>

      <a-row :gutter="20" class="mt-40">
        <a-col :span="12">
          <app-button
            type="primary"
            class="w-100"
            size="large"
            :loading="isLoadingAccept"
            @click="handleSendResult('ACCEPT')"
          >
            {{ $t('accept') }}
          </app-button>
        </a-col>

        <a-col :span="12">
          <app-button
            class="w-100"
            size="large"
            :loading="isLoadingReject"
            @click="handleSendResult('CANCEL')"
          >
            {{ $t('reject') }}
          </app-button>
        </a-col>
      </a-row>
    </div>
  </a-spin>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest.js';
import isTokenExpired from '../js/helpers/isTokenExpired.js';

import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';

export default {
  name: 'CompaniesInvite',

  components: {
    PageTitle,
    AppButton
  },

  data() {
    return {
      isLoadingAccept: false,
      isLoadingReject: false,
      isInfoLoading: false,
      companies: []
    };
  },

  created() {
    this.getInfo();
  },

  methods: {
    async handleSendResult(status) {
      try {
        const body = new FormData();
        const {
          $route: {
            params: { hash }
          }
        } = this;

        body.append('status', status);

        if (status === 'ACCEPT') {
          this.isLoadingAccept = true;
        } else {
          this.isLoadingReject = true;
        }
        const res = await apiRequest(`invitev2/result/${hash}`, 'POST', body);

        if (status === 'ACCEPT') {
          this.isLoadingAccept = false;
        } else {
          this.isLoadingReject = false;
        }

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

        if (!error) {
          if (localStorage.getItem('access_token') && !isTokenExpired()) {
            this.$router.replace('/');
          } else {
            this.$router.replace('/login');
          }
        }
      } catch (error) {
        console.log('handleSendResult', error);
        this.isLoadingAccept = false;
        this.isLoadingReject = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async getInfo() {
      const {
        $route: {
          params: { hash }
        }
      } = this;

      try {
        const res = await apiRequest(`invitev2/get/${hash}`, 'GET', null);

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

        if (!error) {
          const { data } = response;

          const companies = data.companies.map(({ name }) => name);
          this.companies = companies;
          this.isInfoLoading = true;
        } else {
          if (localStorage.getItem('access_token') && !isTokenExpired()) {
            this.$router.replace('/');
          } else {
            this.$router.replace('/login');
          }
        }
      } catch (error) {
        console.log('getInfo', error);
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    }
  }
};
</script>

<style lang="scss">
.company-invite-list {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}
</style>
