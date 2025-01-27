<template>
  <router-link to="/" class="logo-icon">
    <img src="@/assets/logo-icon.svg" class="logo-icon-image" alt="Logo" />
  </router-link>
</template>

<script>
export default {
  name: 'LogoIcon'
};
</script>

<style lang="scss">
.logo-icon {
  max-width: 40px;
  display: inline-block;
}

.logo-icon-image {
  width: 100%;
  display: block;
}
</style>
