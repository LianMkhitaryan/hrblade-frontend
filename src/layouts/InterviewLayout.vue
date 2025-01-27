<template>
  <div
    class="interview-layout"
    :style="
      style && isStyled && style.template !== 'BASIC_NEW'
        ? {
            backgroundColor: style.bgColor,
            backgroundImage: `url(${style.bgImage})`
          }
        : ''
    "
  >
    <router-view></router-view>

    <app-footer v-if="!$store.state.app.isMobileApp" with-help></app-footer>
  </div>
</template>

<script>
import AppFooter from '../components/AppFooter.vue';

export default {
  name: 'InterviewLayout',

  components: {
    AppFooter
  },

  data() {
    return {
      isStyled: true
    };
  },

  watch: {
    $route(newVal) {
      if (
        newVal.name === 'interview-unsupported-hash' ||
        newVal.name === 'interview-result-status'
      ) {
        this.isStyled = false;
      } else {
        this.isStyled = true;
      }
    }
  },

  computed: {
    style() {
      const {
        info: { style }
      } = this.$store.state.interview;

      return style;
    }
  }
};
</script>

<style lang="scss">
.interview-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: calc(0px + env(safe-area-inset-top)) 0
    calc(0px + env(safe-area-inset-bottom));
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.interview-layout {
  .app-footer-privacy-link {
    color: #adadad;
  }
}
</style>
