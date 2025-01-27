<template>
  <div :class="['card', { 'big-padding': bigPadding }]">
    <div class="card-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',

  props: {
    bigPadding: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.card {
  width: 100%;
  height: 100%;
  background: $white;
  box-shadow: 0 0 12px 0 rgba(150, 152, 163, 0.2);
  border-radius: 5px;

  &.big-padding {
    .card-inner {
      padding: 20px;
    }
  }
}

.card-inner {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
