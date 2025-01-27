<template>
  <div
    :class="['burger-wrapper', { 'mobile-menu-visible': mobileMenuVisible }]"
  >
    <button class="burger">
      <icon-burger v-if="!mobileMenuVisible" class="burger-icon"></icon-burger>
      <icon-close v-else class="burger-icon"></icon-close>
    </button>
  </div>
</template>

<script>
import IconBurger from './icons/Burger.vue';
import IconClose from './icons/Close.vue';

export default {
  name: 'Burger',

  props: {
    mobileMenuVisible: {
      type: Boolean,
      default: false
    }
  },

  components: {
    IconBurger,
    IconClose
  }
};
</script>

<style lang="scss">
$buger-color: $black;

.burger-wrapper {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #dedede;

  // &.mobile-menu-visible {
  //   .burger-icon {
  //     fill: $buger-color;
  //   }
  // }

  @media (max-width: $sm) {
    width: 80px;
    height: 80px;
  }
}

.burger {
  display: inline-block;
  width: 24px;
  height: 22px;
  padding: 0;
  border: 0;
  background-color: transparent;

  &:focus {
    outline: none;
  }
}

.burger-icon {
  display: block;
  width: 100%;
  height: 100%;
  fill: $buger-color;
}
</style>
