import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './js/plugins/ant-components.js';
import './js/plugins/vue-plur.js';
import './js/plugins/perfect-scrollbar.js';
import './js/plugins/vue-scrollto.js';
import './js/plugins/vue-meta.js';
import './css/index.scss';
import i18n from './i18n';

import IconSuccess from './components/icons/Success.vue';
import IconError from './components/icons/Error.vue';

Vue.config.productionTip = false;

Vue.component('icon-success', IconSuccess);
Vue.component('icon-error', IconError);

window.URL = window.URL || window.webkitURL;

export default new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app');
