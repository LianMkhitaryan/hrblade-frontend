<template>
  <div class="search">
    <div class="search-inner">
      <a-input
        class="search-input input-gray"
        placeholder="Enter your search term here…"
      />

      <app-button size="large" class="search-btn cyan-gradient">
        Search
      </app-button>
    </div>
  </div>
</template>

<script>
import AppButton from '../components/AppButton.vue';

export default {
  name: 'Search',

  components: {
    AppButton
  }
};
</script>

<style lang="scss">
.search-inner {
  display: flex;

  @media (max-width: $sm) {
    display: block;
  }
}

.search-input {
  height: 55px;
  padding: 0 15px 0 0;
  margin-right: 10px;
}

.search-btn {
  @media (max-width: $sm) {
    margin-top: 10px;
  }
}
</style>
