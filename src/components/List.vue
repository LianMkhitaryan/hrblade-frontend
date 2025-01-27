<template>
  <div class="list">
    <ul>
      <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'List'
};
</script>

<style lang="scss">
.list {
  ul {
    margin: 0;
    padding: 0;
    width: 100%;
    list-style: none;
  }
}
</style>
