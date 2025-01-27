<template>
  <div class="app-footer-navigation">
    <ul class="app-footer-navigation-list">
      <li
        v-for="(link, index) in links"
        :key="index"
        class="app-footer-navigation-list-item"
      >
        <router-link
          v-if="link.to"
          :to="link.to"
          class="app-footer-navigation-list-link"
        >
          {{ link.label }}
        </router-link>

        <a
          v-else
          :href="link.href"
          target="_blank"
          class="app-footer-navigation-list-link"
        >
          {{ link.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppFooterNavigation',

  data() {
    return {
      links: [
        {
          href: 'https://interwoo.com/features',
          label: 'Features'
        },
        {
          href: 'https://interwoo.com/pricing',
          label: 'Pricing'
        },
        {
          href: 'https://interwoo.com/about',
          label: 'About'
        },
        {
          to: '/support',
          label: 'Support'
        },
        {
          href: 'https://interwoo.com/contacts',
          label: 'Contacts'
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.app-footer-navigation-list {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 100%;
  list-style: none;

  @media (max-width: $sm) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.app-footer-navigation-list-item {
  height: 100%;

  &:not(:last-of-type) {
    margin-right: 40px;

    @media (max-width: $lg) {
      margin-right: 20px;
    }

    @media (max-width: $sm) {
      margin-right: 0;
      margin-bottom: 30px;
    }
  }
}

.app-footer-navigation-list-link {
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
}
</style>
