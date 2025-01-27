<template>
  <ul class="social-list">
    <li v-for="(link, index) in links" :key="index" class="social-list-item">
      <a
        v-if="link.href"
        :href="link.href"
        target="_blank"
        class="social-list-link"
      >
        <component :is="link.icon" class="social-list-link-icon" />
      </a>

      <router-link v-if="link.to" :to="link.to" class="social-list-link">
        <component :is="link.icon" class="social-list-link-icon" />
      </router-link>
    </li>
  </ul>
</template>

<script>
import IconFacebook from './icons/Facebook.vue';
import IconInstagram from './icons/Instagram.vue';
import IconTwitter from './icons/Twitter.vue';

export default {
  name: 'SocialList',

  components: {
    IconFacebook,
    IconInstagram,
    IconTwitter
  },

  data() {
    return {
      links: [
        {
          href: '#',
          icon: 'icon-facebook'
        },
        {
          href: '#',
          icon: 'icon-instagram'
        },
        {
          href: '#',
          icon: 'icon-twitter'
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.social-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.social-list-item {
  &:not(:last-of-type) {
    margin-right: 10px;
  }
}

.social-list-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: $grayish-blue-200;
  transition: 0.3s;

  &:hover {
    background-color: lighten($grayish-blue-200, 2%);
  }
}

.social-list-link-icon {
  width: 14px;
  height: 14px;
  fill: $grayish-blue-400;
}
</style>
