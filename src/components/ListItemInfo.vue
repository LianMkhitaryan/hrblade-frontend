<template>
  <li class="list-item-info">
    <span class="list-item-info-label">
      <slot name="title">{{ label }}</slot>
    </span>

    <span class="list-item-info-value">
      <slot name="value">{{ value }}</slot>
    </span>
  </li>
</template>

<script>
export default {
  name: 'ListItemInfo',

  props: {
    label: {
      type: String,
      default: ''
    },

    value: {
      type: [String, Number],
      default: ''
    }
  }
};
</script>

<style lang="scss">
.list-item-info {
  display: flex;
  justify-content: space-between;

  &:not(:last-of-type) {
    margin-bottom: 15px;
  }
}

.list-item-info-label,
.list-item-info-value {
  font-weight: 600;
  font-size: 14px;
  color: $black;
}

.list-item-info-label {
  margin-right: 10px;
  color: $grayish-blue-400;
}

.list-item-info-value {
  text-align: right;
}
</style>
