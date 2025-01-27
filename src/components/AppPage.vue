<template>
  <main class="app-page">
    <a-spin :spinning="loading || appLoading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

      <div class="app-page-inner">
        <container>
          <template v-if="!appLoading">
            <div class="app-page-header">
              <slot name="header"></slot>
            </div>

            <div class="app-page-body">
              <slot></slot>
            </div>
          </template>
        </container>
      </div>
    </a-spin>
  </main>
</template>

<script>
import Container from './Container.vue';

export default {
  name: 'AppPage',

  components: {
    Container
  },

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    appLoading() {
      return this.$store.state.app.appLoading;
    }
  }
};
</script>

<style lang="scss">
.app-page {
  position: relative;
  flex-grow: 1;

  .ant-spin-nested-loading {
    position: static;
  }
}

.app-page-inner {
  overflow: hidden;
  padding: 40px 0 70px;

  @media (max-width: $md) {
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }
}

.app-page-header {
  margin-bottom: 40px;

  @media (max-width: $md) {
    margin-bottom: 30px;
  }

  p {
    margin: 0;
  }
}
</style>
