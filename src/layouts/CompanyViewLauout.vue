<template>
  <div class="company-view-lauout">
    <router-view></router-view>
    <app-footer v-if="!$store.state.app.isMobileApp" with-help></app-footer>
  </div>
</template>

<script>
import AppFooter from '../components/AppFooter.vue';

export default {
  name: 'CompanyViewLauout',

  components: {
    AppFooter
  },

  data() {
    return {};
  }
};
</script>

<style lang="scss"></style>
