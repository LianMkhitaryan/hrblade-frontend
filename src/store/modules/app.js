import apiRequest from '../../js/helpers/apiRequest.js';

import {
  SET_APP_LOADING,
  TOGGLE_UPGRADE_MODAL,
  SET_CONFIG,
  SET_PLANS,
  SET_TAXES,
  SET_PLAN_API_KEY,
  SET_PLAN_INTENT,
  SET_IS_MOBILE_APP,
  SET_MSG,
  SET_LNG,
  SET_BCP
} from '../mutations.js';

export default {
  state: {
    appLoading: true,
    industries: [],
    roles: [],
    subjects: [],
    permissions: [],
    generateQuestions: false,
    emailVars: [],
    videChatServerUrl: '',
    plans: [],
    taxes: [],
    planApiKey: null,
    planIntent: null,
    upgradeTariffModalVisible: false,
    isMobileApp: false,

    msg: {},
    lng: {},
    bcp: []
  },

  mutations: {
    [SET_APP_LOADING](state) {
      state.appLoading = false;
    },

    [SET_CONFIG](
      state,
      {
        industries,
        roles,
        subjects,
        permissions,
        generateQuestions,
        emailVars,
        videoUrl
      }
    ) {
      state.industries = industries;
      state.roles = roles;
      state.subjects = subjects;
      state.permissions = permissions;
      state.generateQuestions = generateQuestions;
      state.emailVars = emailVars;
      state.videChatServerUrl = videoUrl;
    },

    [SET_PLANS](state, plans) {
      state.plans = plans;
    },

    [SET_TAXES](state, taxes) {
      state.taxes = taxes;
    },

    [TOGGLE_UPGRADE_MODAL](state, payload) {
      state.upgradeTariffModalVisible = payload;
    },

    [SET_PLAN_API_KEY](state, key) {
      state.planApiKey = key;
    },

    [SET_PLAN_INTENT](state, intent) {
      state.planIntent = intent;
    },

    [SET_IS_MOBILE_APP](state, payload) {
      state.isMobileApp = payload;
    },

    [SET_MSG](state, payload) {
      state.msg = payload;
    },

    [SET_LNG](state, payload) {
      state.lng = payload;
    },

    [SET_BCP](state, payload) {
      state.bcp = payload;
    }
  },

  actions: {
    async getConfig({ commit }) {
      try {
        const res = await apiRequest('config', 'GET', null, true);

        if (res.error) {
          console.log(res);
        } else {
          const {
            data: {
              industries,
              roles,
              subjects,
              permissions,
              generate_questions,
              email_vars,
              video_url
            }
          } = res.response;

          commit(SET_CONFIG, {
            industries,
            roles: roles.map(({ id, name, description, industry_id }) => ({
              id,
              name,
              description,
              industryId: industry_id
            })),
            subjects,
            permissions,
            generateQuestions: !!Number(generate_questions),
            emailVars: email_vars,
            videoUrl: video_url
          });
        }
      } catch (error) {
        console.log('', error);
      }
    },

    async getPlans({ commit }) {
      try {
        const res = await apiRequest('v2/plans', 'GET', null, true);

        const {
          response: {
            data: { plans }
          }
        } = res;

        commit(
          SET_PLANS,
          plans
            .filter((plan) => !!plan.active)
            .map(
              ({
                id,
                active,
                name,
                description,
                price,
                responses_limit,
                prices
              }) => ({
                // plan_uid,
                description,
                // bonuses,
                // stripe_name,
                // stripe_price
                id,
                active: !!active,
                name,
                price,
                responsesLimit: responses_limit,
                prices: prices
                  .map(
                    ({ price, stripe_price_id, currency, symbol, yearly }) => ({
                      price,
                      stripePriceId: stripe_price_id,
                      name,
                      description,
                      currency,
                      symbol,
                      isYearly: !!yearly
                    })
                  )
                  .sort((a, b) =>
                    a.isYearly === b.isYearly ? 0 : b.isYearly ? -1 : 1
                  )
                // planUid: plan_uid,
                // description,
                // bonuses,
                // stripeName: stripe_name,
                // stripePrice: stripe_price
              })
            )
            .sort((a, b) => a.price - b.price)
        );
      } catch (error) {
        console.log('getPlans :', error);
      }
    },

    async getTaxes({ commit }) {
      try {
        const res = await apiRequest('v2/plans/taxes', 'GET', null, true);

        const { data } = res.response;

        commit(
          SET_TAXES,
          data.map(({ id, country, percent }) => ({ id, country, percent }))
        );
      } catch (error) {
        console.log(`error`, error);
      }
    },

    async getIntent({ commit }, currency) {
      try {
        const body = new FormData();

        body.append('currency', currency);

        const res = await apiRequest('v2/plans/intent', 'POST', body, true);

        const {
          response: {
            data: { api_key, intent }
          }
        } = res;

        commit(SET_PLAN_API_KEY, api_key);
        commit(SET_PLAN_INTENT, intent);
      } catch (error) {
        console.log('getPlans :', error);
      }
    }
  }
};
