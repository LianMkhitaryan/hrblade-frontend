<template>
  <div>
    <page-title tag="h2" size="35">
      {{ $t('login_title') }}
    </page-title>
    <p class="mt-15">
      {{ $t('if_you_dont_have_an_account') }}
      <router-link to="/registration" class="text-orange">
        {{ $t('registration') }}
      </router-link>
    </p>

    <a-form>
      <a-form-item
        has-feedback
        :label="data.email.value && $t('placeholders.email')"
        :validate-status="data.email.status"
      >
        <a-input
          v-model="data.email.value"
          :placeholder="$t('placeholders.email')"
        />
      </a-form-item>

      <a-form-item
        has-feedback
        :label="data.password.value && $t('placeholders.password')"
        :validate-status="data.password.status"
      >
        <a-input-password
          v-model="data.password.value"
          :placeholder="$t('placeholders.password')"
        />
      </a-form-item>

      <a-form-item class="text-align-center mt-50">
        <app-button
          type="primary"
          size="large"
          class="w-100"
          :loading="sendLoading"
          @click="handleSubmit"
        >
          {{ $t('login_button') }}
        </app-button>

        <router-link to="/password/forgot" class="d-block text-orange mt-10">
          {{ `${$t('page_forgot_password.link')}?` }}
        </router-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import apiRequest from '../js/helpers/apiRequest.js';
import setTokenToLocalStorage from '../js/helpers/setTokenToLocalStorage.js';

import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';

export default {
  name: 'Login',

  components: {
    PageTitle,
    AppButton
  },

  data() {
    return {
      sendLoading: false,

      data: {
        email: { value: '', status: '' },
        password: { value: '', status: '' }
      }
    };
  },

  computed: {
    companiesCount() {
      return this.$store.state.company.companies.length;
    }
  },

  methods: {
    checkForm() {
      let valid = true;
      const {
        data: { email, password }
      } = this;

      email.status = '';
      password.status = '';

      if (!email.value) {
        email.status = 'error';
        valid = false;
      }

      if (!password.value) {
        password.status = 'error';
        valid = false;
      }

      return valid;
    },

    async handleSubmit() {
      const valid = this.checkForm();

      if (valid) {
        try {
          const {
            data: { email, password }
          } = this;

          const body = new FormData();

          body.append('email', email.value);
          body.append('password', password.value);

          this.sendLoading = true;
          const res = await apiRequest('login', 'POST', body);

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
            this.sendLoading = false;
          } else {
            const {
              data: { plainTextToken }
            } = response;

            setTokenToLocalStorage(plainTextToken);

            Promise.all([
              this.getConfig(),
              this.getPlans(),
              this.getTaxes(),
              this.getUser(),
              this.getPlan(),
              this.getCompanies(),
              this.getUsers(),
              this.getJobs(),
              this.getLiveInterviews()
            ]).then(() => {
              email.value = '';
              password.value = '';

              this.sendLoading = false;
              this.$store.commit('app/SET_APP_LOADING');

              if (this.companiesCount) {
                this.$router.push('/');
              } else {
                this.$router.push('/companies/create');
              }
            });
          }
        } catch (error) {
          console.log('handleSubmit: ', error);
          this.sendLoading = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    },

    ...mapActions({
      getConfig: 'app/getConfig',
      getPlans: 'app/getPlans',
      getTaxes: 'app/getTaxes',
      getUser: 'user/getUser',
      getPlan: 'user/getPlan',
      getCompanies: 'company/getCompanies',
      getUsers: 'company/getCompanyUsers',
      getJobs: 'jobs/getJobs',
      getLiveInterviews: 'live/getLiveInterviews'
    })
  }
};
</script>

<style lang="less"></style>
