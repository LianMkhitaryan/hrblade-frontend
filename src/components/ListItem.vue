<template>
  <li class="list-item">
    <router-link v-if="to" :to="to">
      <div class="list-item-inner">
        <div v-if="media" class="list-item-media">
          <slot name="media"></slot>
        </div>
        <div class="list-item-content">
          <div class="list-item-title">
            <slot></slot>
          </div>
          <div class="list-item-subtitle">
            <slot name="subtitle"></slot>
          </div>
        </div>
      </div>
    </router-link>

    <div v-else class="list-item-inner">
      <div v-if="media" class="list-item-media">
        <slot name="media"></slot>
      </div>
      <div class="list-item-content">
        <div class="list-item-title">
          <slot></slot>
        </div>
        <div class="list-item-subtitle">
          <slot name="subtitle"></slot>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ListItem',

  props: {
    media: {
      type: Boolean,
      default: false
    },

    to: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss">
.list-item {
  &:not(:last-of-type) {
    border-bottom: 1px solid $grayish-blue-400;
  }
}

.list-item-inner {
  display: flex;
  padding: 10px 0;
}

.list-item-media {
  margin-right: 10px;
}

.list-item-title {
  font-weight: 600;
  font-size: 14px;
  color: $black;
}

.list-item-subtitle {
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 12px;
  color: $gray-300;
}
</style>
