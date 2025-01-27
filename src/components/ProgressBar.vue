<template>
  <div class="progress">
    <div v-if="inline" class="progress-inner progress-inner-inline">
      <div class="progress-info">
        <slot name="label"></slot>

        <a-progress :showInfo="false" class="mr-30" :percent="percent" />

        <slot name="value"></slot>
      </div>

      <div class="progress-footer">
        <slot name="footer"></slot>
      </div>
    </div>

    <div v-else class="progress-inner">
      <div class="progress-info">
        <slot name="label"></slot>

        <slot name="value"></slot>
      </div>

      <a-progress :showInfo="false" :percent="percent" />

      <div class="progress-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  props: {
    inline: {
      type: Boolean,
      default: false
    },

    percent: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss">
.progress {
  .ant-progress-bg {
    height: 4px !important;
  }

  &.light-blue-gradient {
    .ant-progress-success-bg,
    .ant-progress-bg {
      background-image: $blue-gradient-300;
    }
  }

  &.blue-gradient {
    .ant-progress-success-bg,
    .ant-progress-bg {
      background-image: $blue-gradient-100;
    }
  }

  &.cyan-gradient {
    .ant-progress-success-bg,
    .ant-progress-bg {
      background-image: $cyan-gradient;
    }
  }

  &.orange-gradient {
    .ant-progress-success-bg,
    .ant-progress-bg {
      background-image: $orange-gradient;
    }
  }

  &.orange {
    .ant-progress-success-bg,
    .ant-progress-bg {
      background-color: $orange;
    }
  }

  &.green {
    .ant-progress-success-bg,
    .ant-progress-bg {
      background-color: $green;
    }
  }

  &.red {
    .ant-progress-success-bg,
    .ant-progress-bg {
      background-color: $red;
    }
  }
}

.progress-inner {
  &.progress-inner-inline {
    .progress-info {
      span:first-child {
        min-width: 100px;
      }
    }
  }
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: $black;
}

.ant-progress-inner {
  background-color: $gray-200;
}

.progress-footer {
  margin-top: 5px;
  font-size: 14px;
}
</style>
