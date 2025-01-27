<template>
  <app-page class="page-interview-unsupported">
    <div class="page-interview-unsupported-inner">
      <logo dark></logo>

      <page-title
        tag="h1"
        size="25"
        class="page-interview-unsupported-title normal-break"
      >
        {{ $t('unsupported_browser_message') }}
      </page-title>

      <div class="page-interview-unsupported-browser-list">
        <a
          href="https://www.google.com/intl/en/chrome/"
          target="_blank"
          class="supported-browser"
        >
          <img
            src="../assets/google-icon.png"
            class="supported-browser-img"
            alt="Chrome browser icon"
          />
          <div class="supported-browser-title">Chrome</div>
        </a>

        <a
          href="https://www.mozilla.org/en-US/firefox/new/"
          target="_blank"
          class="supported-browser"
        >
          <img
            src="../assets/firefox-icon.png"
            class="supported-browser-img"
            alt="Firefox browser icon"
          />
          <div class="supported-browser-title">Firefox</div>
        </a>

        <a
          href="https://www.microsoft.com/en-us/edge"
          target="_blank"
          class="supported-browser"
        >
          <img
            src="../assets/edge-icon.png"
            class="supported-browser-img"
            alt="Edge browser icon"
          />
          <div class="supported-browser-title">Edge</div>
        </a>

        <a
          href="https://www.opera.com/x-en-d"
          target="_blank"
          class="supported-browser"
        >
          <img
            src="../assets/opera-icon.png"
            class="supported-browser-img"
            alt="Opera browser icon"
          />
          <div class="supported-browser-title">Opera</div>
        </a>
      </div>

      <div class="page-interview-unsupported-browser-link">
        <div class="page-interview-unsupported-browser-link-title">
          {{ $t('link_supported_browser') }}
        </div>

        <div class="page-interview-unsupported-browser-link-form">
          <a-input
            ref="inviteLink"
            class="mr-10 copy"
            size="large"
            readonly
            :value="`${BASE_PATH_APP_URL}i/${$route.params.hash}`"
            @click="handleCopy"
          />

          <app-button
            type="primary"
            size="large"
            class="w-100 mt-40"
            @click="handleCopy"
          >
            {{ $t('copy_link') }}
          </app-button>
        </div>
      </div>
    </div>
  </app-page>
</template>

<script>
import { BASE_PATH_APP_URL } from '../js/const/index.js';
import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Logo from '../components/Logo.vue';

export default {
  name: 'InterviewUnsupported',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Logo
  },

  data() {
    return {
      BASE_PATH_APP_URL
    };
  },

  methods: {
    handleCopy() {
      this.$refs.inviteLink.$el.select();
      this.$refs.inviteLink.$el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.getSelection().removeAllRanges();

      this.$notification.success({
        message: this.$t('notify.success'),
        description: this.$t('notify.link_added_to_clipboard'),
        icon: () => <icon-success class="success-icon" />
      });
    }
  }
};
</script>

<style lang="scss">
.page-interview-unsupported-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.page-interview-unsupported-title {
  margin-top: 45px;
  max-width: 635px;
  margin-right: auto;
  margin-left: auto;

  @media (max-width: $sm) {
    margin-top: 25px;
  }
}

.page-interview-unsupported-browser-list {
  margin-top: 55px;
  width: 100%;
  max-width: 635px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: $sm) {
    flex-wrap: wrap;
    margin-top: 25px;
  }
}

.supported-browser {
  display: flex;
  flex-direction: column;
  padding: 0 20px;

  @media (max-width: $sm) {
    width: 50%;
    align-items: center;
    margin-bottom: 30px;
  }
}

.supported-browser-img {
  width: 75px;
  flex-shrink: 0;
}

.supported-browser-title {
  margin-top: 40px;
  font-size: 16px;
  font-weight: 700;
  color: #373151;

  @media (max-width: $sm) {
    margin-top: 25px;
  }
}

.page-interview-unsupported-browser-link {
  margin-top: 80px;

  @media (max-width: $sm) {
    margin-top: 20px;
  }
}

.page-interview-unsupported-browser-link-form {
  margin-top: 30px;
}
</style>
