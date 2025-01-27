<template>
  <div class="forgot-password">
    <page-title tag="h2" size="35">
      {{ $t('page_reset_password.title') }}
    </page-title>
    <p>
      <router-link to="/login" class="text-orange">
        {{ $t('page_forgot_password.back_link') }}
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
          {{ $t('send') }}
        </app-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest.js';
// import setTokenToLocalStorage from '../js/helpers/setTokenToLocalStorage.js';

import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';

export default {
  name: 'ForgotPassword',

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

  methods: {
    checkForm() {
      let valid = true;
      const {
        data: { email, password }
      } = this;

      email.status = '';
      email.password = '';

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
            $route: {
              params: { token }
            },
            data: { email, password }
          } = this;
          const body = new FormData();

          body.append('email', email.value);
          body.append('password', password.value);
          body.append('password_confirmation', password.value);
          body.append('token', token);

          this.sendLoading = true;
          const res = await apiRequest('reset-password', 'POST', body);
          this.sendLoading = false;

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
            email.value = '';
            password.value = '';

            this.$router.replace('/login');
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
    }
  }
};
</script>

<style lang="less"></style>
