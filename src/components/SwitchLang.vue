<template>
  <a-dropdown class="switch-lang">
    <a class="ant-dropdown-link">
      {{ locale.toUpperCase() }} <a-icon type="down" />
    </a>
    <a-menu slot="overlay">
      <a-menu-item v-for="(lang, index) in langs" :key="index">
        <a href="javascript:;" @click="setLang(lang)">
          {{ lang.toUpperCase() }}
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
  name: 'SwitchLang',

  data() {
    return {
      // langs: ['en', 'ru', 'de', 'es', 'it', 'ar']
    };
  },

  computed: {
    locale() {
      return this.$i18n.locale;
    },

    langs() {
      return Object.keys(this.$store.state.app.msg);
    }
  },

  methods: {
    setLang(lang) {
      localStorage.setItem('lang', lang);
      this.$i18n.setLocaleMessage(lang, window.i18nMsg[lang]);
      this.$i18n.locale = lang;
      this.$store.dispatch('app/getConfig');
    }
  }
};
</script>

<style lang="less">
.switch-lang {
  font-size: 14px;
}
</style>
