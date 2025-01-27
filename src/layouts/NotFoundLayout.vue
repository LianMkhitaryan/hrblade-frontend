<template>
  <a-result :sub-title="$t('page_does_not_exist')">
    <template #icon>
      <not-found-icon class="ant-result-image"></not-found-icon>
    </template>

    <template #extra>
      <a href="https://hrblade.com/">
        <app-button type="primary">
          {{ $t('back_home') }}
        </app-button>
      </a>
    </template>
  </a-result>
</template>

<script>
import AppButton from '../components/AppButton.vue';
import NotFoundIcon from '../components/icons/NotFound.vue';

export default {
  name: 'NotFoundLayout',

  components: {
    AppButton,
    NotFoundIcon
  }
};
</script>

<style lang="scss">
.ant-result {
  height: 100vh;
  padding: calc(0px + env(safe-area-inset-top)) 0
    calc(0px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ant-result-icon {
  max-width: 500px;
  width: 100%;
}

.ant-result-image {
  margin: 24px !important;
  width: 100% !important;
  height: auto !important;
  margin: 0 !important;
}
</style>
