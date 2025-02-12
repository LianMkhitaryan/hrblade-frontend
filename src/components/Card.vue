<template>
  <div :class="['card', { 'big-padding': bigPadding }]">
    <div class="card-inner">
      <div v-if="cardTitle" class="card-header">
        <div class="title">
          {{ cardTitle }}
        </div>

        <app-button
          v-if="buttonName && typeof button === 'function'"
          @click="button"
          class="card-button"
          type="link"
        >
          {{ buttonName }}
          <slot name="button-icon"></slot>
        </app-button>

        <!-- If `button` is a string (URL), make it a link -->
        <a
          v-else-if="buttonName && typeof button === 'string'"
          :href="button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <app-button class="card-button" type="link">
            {{ buttonName }}
            <slot name="button-icon"></slot>
          </app-button>
        </a>
      </div>
      <div v-if="cardTitle" class="card-content">
        <slot></slot>
      </div>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
import AppButton from '../components/AppButton.vue';

export default {
  name: 'Card',

  components: {
    AppButton
  },

  props: {
    bigPadding: {
      type: Boolean,
      default: false
    },
    cardTitle: {
      type: String,
      default: ''
    },
    button: {
      type: [Function, String],
      default: ''
    },
    buttonName: {
      type: String,
      default: ''
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

.card-header {
  width: 100%;
  position: relative;
  max-height: 39px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;

  .title {
    font-size: 16px;
    line-height: 1.2;
    font-family: 'Montserrat';
    font-weight: 800;
    color: #000;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -20px;
    right: -20px;
    height: 1px;
    background-color: #dedede;
  }
}

.card-inner {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-content {
  padding-top: 20px;
}
</style>
<style scoped lang="scss">
.card-button {
  border: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #000;
}
</style>
