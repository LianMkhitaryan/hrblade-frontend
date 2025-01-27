import apiRequest from '../../js/helpers/apiRequest.js';

import { SET_USER_INFO, SET_PLAN } from '../mutations.js';

export default {
  state: {
    info: {},
    plan: {
      live: false
    }
  },

  mutations: {
    [SET_USER_INFO](state, info) {
      state.info = info;
    },

    [SET_PLAN](state, plan) {
      state.plan = plan;
    }
  },

  actions: {
    async getUser({ commit }) {
      try {
        const res = await apiRequest('user', 'GET', null, true);

        if (!res.error) {
          const {
            data: {
              id,
              agency,
              name,
              phone,
              email,
              country,
              role,
              recruiting_owner,
              profile_photo_url
            }
          } = res.response;

          commit(SET_USER_INFO, {
            id,
            agency: {
              id: agency.id,
              name: agency.name,
              planExpire: agency.plan_expire,
              planId: agency.plan_id,
              quantity: agency.quantity
            },
            name,
            phone,
            email,
            country,
            role,
            recruitingOwner: recruiting_owner,
            avatar: profile_photo_url
          });
        }
      } catch (error) {
        console.log('getUser:', error);
      }
    },

    async getPlan({ commit }) {
      try {
        const res = await apiRequest('v2/plans/current', 'GET', null, true);

        const { error, response } = res;

        if (!error) {
          const {
            data: {
              id,
              active,
              live,
              trial,
              name,
              description,
              price,
              end_plan_at,
              // next_price,
              // next_link,
              interviews_limit,
              responses_count,
              responses_limit,
              companies_limit,
              users_limit,
              questions_limit,
              billing_info,
              start_at,
              end_at
            }
          } = response;

          commit(SET_PLAN, {
            id,
            active: !!active,
            live: !!live,
            trial: !!trial,
            name,
            description,
            price,
            // nextPrice: next_price,
            // nextPriceLink: next_link,
            jobsLimit: interviews_limit,
            responsesLimit: responses_limit || 0,
            companiesLimit: companies_limit,
            usersLimit: users_limit,
            questionsLimit: questions_limit,
            responsesCount: responses_count,
            billing_info: {
              userName:
                billing_info.client_type === 'business'
                  ? billing_info.real_name
                  : billing_info.name,
              userEmail: billing_info.email || '',
              userAddress: billing_info.address || '',
              userCity: billing_info.city || '',
              userState: billing_info.state || '',
              userZip: billing_info.postal_code || '',
              userCountry: billing_info.country,
              isBusiness:
                billing_info.client_type === 'physical' ? false : true,
              companyName:
                billing_info.client_type === 'business'
                  ? billing_info.name || ''
                  : '',
              companyVatNumber: billing_info.vat || ''
            },
            endPlanAt: end_plan_at,
            startAt: start_at,
            endAt: end_at
          });
        }
      } catch (error) {
        console.log('getPlan:', error);
      }
    }
  }
};
