<template>
  <div class="forgot-password">
    <page-title tag="h2" size="35">
      {{ $t('page_forgot_password.title') }}
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
        email: { value: '', status: '' }
      }
    };
  },

  methods: {
    checkForm() {
      let valid = true;
      const {
        data: { email }
      } = this;

      email.status = '';

      if (!email.value) {
        email.status = 'error';
        valid = false;
      }

      return valid;
    },

    async handleSubmit() {
      const valid = this.checkForm();

      if (valid) {
        try {
          const {
            data: { email }
          } = this;
          const body = new FormData();

          body.append('email', email.value);

          this.sendLoading = true;
          const res = await apiRequest('forgot', 'POST', body);
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
            this.$router.push('/login');
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
