<template>
  <a-config-provider :locale="configProviderLocale">
    <div v-show="localeLoading" id="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

import en_US from 'ant-design-vue/lib/locale-provider/en_US.js';
import ru_RU from 'ant-design-vue/lib/locale-provider/ru_RU.js';

import { BASE_PATH_APP_URL } from './js/const'

const browserLocale = () => {
  let lang;

  if (navigator.languages && navigator.languages.length) {
    lang = navigator.languages[0].split('-')[0];
  } else if (navigator.userLanguage) {
    lang = navigator.userLanguage;
  } else {
    lang = navigator.language;
  }

  return lang;
};

const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);

  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}

export default {
  name: 'App',

  data() {
    return {
      localeLoading: false
    };
  },

  watch: {
    // '$route.query.lang'(lang) {
    //   console.log('lang', lang);

    //   if (lang) {
    //     localStorage.setItem('lang', lang);
    //     this.$i18n.locale = lang;
    //     // this.localeLoading = true;
    //   }
    // },

    'userInfo'(usr) {
      console.log('usr', usr);
      const div = document.createElement('div');
      div.innerHTML += usr.email;
      div.className = 'visually-hidden';
      console.log('div', div)
      document.body.appendChild(div);
    },

    '$i18n.locale'(lang) {
      if (lang === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    }
  },

  computed: {
    configProviderLocale() {
      if (this.$i18n.locale === 'ru') {
        return ru_RU;
      }

      return en_US;
    },

    companiesCount() {
      return this.$store.state.company.companies.length;
    },

    userInfo() {
      return this.$store.state.user.info
    }
  },

  created() {
    const token = localStorage.getItem('access_token');

    if (token) {
      this.getInitialInfo();
    }
  },

  mounted() {
    if (!document.cookie) {
      this.$store.commit('app/SET_IS_MOBILE_APP', true);
    }

    fetch(`${BASE_PATH_APP_URL}languages.json`).then((v) => v.json()).then((res) => {
      this.SET_LNG(res);

      if (!this.localeLoading) {
        const localLang = localStorage.getItem('lang');
        const langSearch = getQueryVariable('lang');

        if (localLang && localLang != 'undefined') {
          fetch(`${BASE_PATH_APP_URL}messages.json`).then((v) => v.json()).then((res) => {
            window.i18nMsg = res;
            this.SET_MSG(res);
            this.$i18n.setLocaleMessage(langSearch || localLang, res[langSearch || localLang]);
            this.$i18n.locale = langSearch || localLang;

            this.localeLoading = true;
          })
        } else {
          const lang = browserLocale();

          fetch(`${BASE_PATH_APP_URL}messages.json`).then((v) => v.json()).then((res) => {
            window.i18nMsg = res;
            this.SET_MSG(res);
            localStorage.setItem('lang', langSearch || lang);
            this.$i18n.setLocaleMessage(langSearch || lang, res[langSearch || lang]);
            this.$i18n.locale = langSearch || lang;

            this.localeLoading = true;
          })
        }
      }
    });

    fetch(`${BASE_PATH_APP_URL}languages-bcp.json`).then((v) => v.json()).then((res) => {
      this.SET_BCP(res);
    });
  },

  methods: {
    getInitialInfo() {
      return Promise.all([
        this.getConfig(),
        this.getPlans(),
        this.getTaxes(),
        this.getUser(),
        this.getPlan(),
        this.getCompanies(),
        this.getUsers(),
        this.getJobs(),
        this.getLiveInterviews()
      ]).then(() => {
        this.$store.commit('app/SET_APP_LOADING');

        if (!this.companiesCount) {
          this.$router.push('/companies/create');
        }
      });
    },

    ...mapMutations({
      SET_MSG: 'app/SET_MSG',
      SET_LNG: 'app/SET_LNG',
      SET_BCP: 'app/SET_BCP',
    }),

    ...mapActions({
      getConfig: 'app/getConfig',
      getPlans: 'app/getPlans',
      getTaxes: 'app/getTaxes',
      getUser: 'user/getUser',
      getPlan: 'user/getPlan',
      getCompanies: 'company/getCompanies',
      getUsers: 'company/getCompanyUsers',
      getJobs: 'jobs/getJobs',
      getLiveInterviews: 'live/getLiveInterviews'
    })
  }
};
</script>

<style lang="scss"></style>
