<template>
  <component :is="tag" :class="['page-title', `page-title-${size}`]">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'PageTitle',

  props: {
    tag: {
      type: String,
      default: 'h1',
      validator(value) {
        return (
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'].indexOf(value) !== -1
        );
      }
    },

    size: {
      type: String,
      default: '22'
    }
  }
};
</script>

<style lang="scss">
.page-title {
  margin-bottom: 0;
  font-weight: 400;
  font-family: 'Open Sans', sans-serif;
  color: $black;
  line-height: 1.2;
  // word-break: break-all;

  // &.normal-break {
  //   word-break: initial;
  // }
}

.page-title-22 {
  margin-bottom: 20px;
  font-size: 22px;

  @media (max-width: $sm) {
    font-size: 28px;
  }
}

.page-title-25 {
  margin-bottom: 20px;
  font-size: 25px;
  font-weight: 600;

  @media (max-width: $sm) {
    font-size: 21px;
  }
}

.page-title-32 {
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: 600;

  @media (max-width: $sm) {
    font-size: 28px;
  }
}

.page-title-20 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;

  @media (max-width: $sm) {
    font-size: 18px;
  }
}

.page-title-18 {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
}

.page-title-18-normal {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
}

.page-title-16 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}

.page-title-14 {
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 600;
}

.page-title-12 {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
}

.page-title-icon {
  width: 24px;
  height: 24px;
  fill: $grayish-blue-400;
}
</style>
