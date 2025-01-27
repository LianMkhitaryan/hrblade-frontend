<template>
  <a v-if="href" :href="href" target="_blank" class="logo">
    <img
      v-if="dark"
      src="@/assets/logo-dark.svg"
      class="logo-image"
      alt="Logo"
    />
    <img v-else src="@/assets/logo.svg" class="logo-image" alt="Logo" />
  </a>

  <router-link v-else to="/" class="logo">
    <img
      v-if="dark"
      src="@/assets/logo-dark.svg"
      class="logo-image"
      alt="Logo"
    />
    <img v-else src="@/assets/logo.svg" class="logo-image" alt="Logo" />
  </router-link>
</template>

<script>
export default {
  name: 'Logo',

  props: {
    dark: {
      type: Boolean,
      default: false
    },

    href: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
.logo {
  max-width: 105px;
  display: inline-block;
}

.logo-image {
  width: 100%;
  display: block;
}
</style>
