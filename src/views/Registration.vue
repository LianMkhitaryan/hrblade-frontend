<template>
  <div>
    <page-title tag="h2" size="35">
      {{ $t('registration_title') }}
    </page-title>
    <p class="mt-15">
      {{ $t('if_you_have_an_account') }}
      <router-link to="/login" class="text-orange">
        {{ $t('login') }}
      </router-link>
    </p>

    <a-form>
      <a-form-item
        has-feedback
        :label="data.email.value && $t('placeholders.email')"
        :validate-status="data.email.status"
      >
        <a-input
          type="email"
          v-model="data.email.value"
          :placeholder="`${$t('placeholders.email')} *`"
        />
      </a-form-item>

      <a-form-item
        has-feedback
        :label="data.name.value && $t('placeholders.name')"
        :validate-status="data.name.status"
      >
        <a-input
          v-model="data.name.value"
          :placeholder="`${$t('placeholders.name')} *`"
        />
      </a-form-item>

      <a-form-item
        has-feedback
        :label="data.password.value && $t('placeholders.password')"
        :validate-status="data.password.status"
      >
        <a-input-password
          v-model="data.password.value"
          :placeholder="`${$t('placeholders.password')} *`"
        />
      </a-form-item>

      <a-form-item>
        <a-checkbox
          class="privacy-checkbox custome-main-color mt-auto"
          @change="onChangeAgree"
        >
          {{ $t('i_agree_to_the') }}
          <a
            :href="
              `${BASE_PATH_URL[$i18n.locale]}privacy${
                $i18n.locale === 'ru' ? '#ru' : ''
              }`
            "
            target="_blank"
            class="text-decoration-underline"
          >
            {{ $t('footer.links.privacy_policy_s') }}
          </a>
          {{ $t('and_the') }}
          <a
            :href="
              `${BASE_PATH_URL[$i18n.locale]}terms${
                $i18n.locale === 'ru' ? '#ru' : ''
              }`
            "
            target="_blank"
            class="text-decoration-underline"
          >
            {{ $t('footer.links.terms_and_conditions_s') }}
          </a>
        </a-checkbox>
      </a-form-item>

      <a-form-item class="mt-50">
        <app-button
          type="primary"
          size="large"
          class="w-100"
          :loading="sendLoading"
          @click="handleSubmit"
        >
          {{ $t('registration_button') }}
        </app-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import apiRequest from '../js/helpers/apiRequest.js';
import { BASE_PATH_URL } from '../js/const';
import setTokenToLocalStorage from '../js/helpers/setTokenToLocalStorage.js';

import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';

export default {
  name: 'Registration',

  components: {
    PageTitle,
    AppButton
  },

  data() {
    return {
      BASE_PATH_URL,

      sendLoading: false,

      agree: false,

      data: {
        name: { value: '', status: '' },
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
    onChangeAgree(e) {
      this.agree = e.target.checked;
    },

    checkForm() {
      let valid = true;
      const {
        data: { name, email, password }
      } = this;

      name.status = '';
      email.status = '';
      password.status = '';

      if (!name.value) {
        name.status = 'error';
        valid = false;
      }

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

      if (!this.agree) {
        return this.$notification.warning({
          message: this.$t('notify.warning'),
          description: this.$t('notify.please_agree_to_the_privacy_policy'),
          icon: () => <icon-error class="warning-icon" />
        });
      }

      if (valid) {
        try {
          const {
            data: { name, email, password },
            $route: {
              params: { hash }
            }
          } = this;
          const body = new FormData();

          body.append('name', name.value);
          body.append('email', email.value);
          body.append('password', password.value);

          const path = hash ? `register/${hash}` : 'register';
          this.sendLoading = true;
          const res = await apiRequest(path, 'POST', body);
          // this.sendLoading = false;

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
              name.value = '';
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

            if (process.env.NODE_ENV === 'production') {
              window.dataLayer.push({ event: 'RegSendForm' });
            }
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
      getJobs: 'jobs/getJobs',
      getUsers: 'company/getCompanyUsers',
      getLiveInterviews: 'live/getLiveInterviews'
    })
  }
};
</script>

<style lang="less"></style>
