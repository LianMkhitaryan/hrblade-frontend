<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Container'
};
</script>

<style lang="scss">
.container {
  width: 100%;
  max-width: 1200px;
  padding: 0 15px;
  margin-left: auto;
  margin-right: auto;
}
</style>
