<template>
  <a-button class="app-button" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </a-button>
</template>

<script>
export default {
  name: 'AppButton'
};
</script>

<style lang="scss">
.app-button.ant-btn {
  font-size: 14px;
  border-radius: 5px;
  font-weight: 600;
  height: 35px;

  &::after {
    display: none;
  }

  &.ant-btn-lg {
    height: 55px;
    padding: 0 40px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 600;

    @media (max-width: $md) {
      padding: 0 25px;
    }
  }

  &.medium-size {
    height: 50px;
  }

  &.ant-btn-background-ghost {
    border-width: 2px;
  }

  &.ant-btn-primary {
    background-color: #fda94c;
    border-color: #fda94c;

    &:hover {
      background-color: lighten(#fda94c, 5%);
      border-color: lighten(#fda94c, 5%);
    }
  }

  &.ant-btn-dark {
    background-color: #363151;
    border-color: #363151;
    color: #ffffff;

    &:hover {
      background-color: lighten(#363151, 5%);
      border-color: lighten(#363151, 5%);
    }
  }

  &.ant-btn-primary-dark {
    background-color: #ffab42;
    border-color: #ffab42;
    color: #fff;

    &:hover {
      background-color: #4f4967;
      border-color: #4f4967;
      color: #fff;
    }
    &:disabled {
      opacity: 0.7;
      pointer-events: none;
    }
  }

  // &.blue-gradient {
  //   border: 0;
  //   background-image: $blue-gradient-200;
  //   box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.5);

  //   &:hover {
  //     box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.7);
  //   }

  //   &:active {
  //     box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.5);
  //   }
  // }

  // &.cyan-gradient {
  //   border: 0;
  //   color: $white;
  //   background-image: $cyan-gradient;
  //   box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.5);

  //   &:hover {
  //     box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.7);
  //   }

  //   &:active {
  //     box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.5);
  //   }
  // }

  // &.orange-gradient {
  //   border: 0;
  //   color: $white;
  //   background-image: $orange-gradient;
  //   box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.5);

  //   &:hover {
  //     box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.7);
  //   }

  //   &:active {
  //     box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.5);
  //   }
  // }

  // &.yellow-gradient {
  //   border: 0;
  //   color: $white;
  //   background-image: $yellow-gradient;
  //   box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.5);

  //   &:hover {
  //     box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.7);
  //   }

  //   &:active {
  //     box-shadow: 0 10px 20px -10px rgba(46, 13, 104, 0.5);
  //   }
  // }
}

.ant-btn,
.app-button {
  svg {
    width: 18px;
    height: 18px;
    margin-bottom: -2px;
    fill: currentColor;

    &.small {
      width: 16px;
      height: 16px;
    }

    &.extra-small {
      width: 14px;
      height: 14px;
    }
  }
}

.ant-btn > .anticon + span,
.ant-btn > span + .anticon {
  margin-left: 15px;
}
</style>
