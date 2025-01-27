<template>
  <app-page class="page-interview-process" :loading="false">
    <div v-if="status === 'success'" class="page-interview-status">
      <icon-check-round width="80" height="80" />

      <page-title size="20">
        {{ $t('done') }}
      </page-title>

      <div class="page-interview-status-subtitle">
        {{ $t('thank_you_for_taking_the_time') }}
      </div>
    </div>

    <div v-if="status === 'error'" class="page-interview-status">
      <icon-error fill="#dd2705" width="80" height="80" />

      <page-title size="20">
        {{ 'Interview is temporarily unavailable' }}
      </page-title>

      <div class="page-interview-status-subtitle">
        {{ 'Please try again later' }}
      </div>
    </div>
  </app-page>
</template>

<script>
import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';

import IconCheckRound from '../components/icons/CheckRound.vue';
import IconError from '../components/icons/Error';

export default {
  name: 'InterviewResult',

  components: {
    AppPage,
    PageTitle,
    IconCheckRound,
    IconError
  },

  computed: {
    status() {
      return this.$route.params.status;
    }
  },

  created() {
    this.$store.commit('app/SET_APP_LOADING');
  }
};
</script>

<style lang="scss">
.page-interview-process {
  background-color: #fff;
  .app-page-header {
    display: none;
  }
}

.page-interview-status {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -60px;
  transform: translate(-50%, -50%);
  text-align: center;

  svg {
    margin-bottom: 10px;
  }
}

.page-interview-status-subtitle {
  font-size: 16px;
}
</style>
