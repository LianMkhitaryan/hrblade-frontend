<template>
  <router-link :to="to" class="user">
    <a-avatar :size="50" :src="avatar">
      <icon-user-default-avatar></icon-user-default-avatar>
    </a-avatar>
  </router-link>
</template>

<script>
import IconUserDefaultAvatar from './icons/UserDefaultAvatar.vue';

export default {
  name: 'User',

  components: {
    IconUserDefaultAvatar
  },

  props: {
    to: {
      type: String,
      default: '/'
    },

    avatar: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss">
.user {
  padding: 0 20px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #dedede;

  @media (max-width: $osx) {
    padding: 0 10px;
  }

  @media (max-width: $lg) {
    padding: 0;
    width: 90px;
  }

  @media (max-width: $sm) {
    width: 80px;
    height: 80px;
  }
}
</style>
