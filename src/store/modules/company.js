import apiRequest from '../../js/helpers/apiRequest.js';

import { SET_COMPANIES, SET_COMPANY_USERS } from '../mutations.js';

export default {
  state: {
    companies: [],
    users: []
  },

  mutations: {
    [SET_COMPANIES](state, companies) {
      state.companies = companies;
    },

    [SET_COMPANY_USERS](state, users) {
      state.users = users;
    }
  },

  actions: {
    async getCompanies({ commit }) {
      try {
        const res = await apiRequest('companies', 'GET', null, true);

        if (res.error) {
          console.log(res);
        } else {
          const { data } = res.response;

          commit(
            SET_COMPANIES,
            data.map(
              ({
                id,
                created_at,
                updated_at,
                agency_id,
                industry_id,
                location,
                logo,
                name,
                description,
                website,
                jobs_count,
                bg_image,
                bg_color,
                buttons_color,
                header_image,
                share_hash
              }) => ({
                id,
                createdAt: created_at,
                updatedAt: updated_at,
                agencyId: agency_id,
                industryId: industry_id,
                location,
                logo,
                name,
                description,
                website,
                jobsCount: jobs_count,
                style: {
                  bgImage: bg_image,
                  headerImage: header_image,
                  bgColor: bg_color,
                  btnColor: buttons_color
                },
                shareHash: share_hash
              })
            )
          );
        }
      } catch (error) {
        console.log('getCompanies:', error);
      }
    },

    async removeCompany({ dispatch }, id) {
      try {
        const res = await apiRequest(
          `company/remove/${id}`,
          'POST',
          null,
          true
        );

        if (res.error) {
          console.log(res);
        } else {
          await dispatch('getCompanies');
        }
      } catch (error) {
        console.log('removeCompany:', error);
      }
    },

    async getCompanyUsers({ commit }) {
      try {
        const res = await apiRequest('users', 'GET', null, true);

        const { error, response } = res;

        if (!error) {
          commit(
            SET_COMPANY_USERS,
            response.data.map(
              ({ id, name, email, phone, role, profile_photo_url }) => ({
                id,
                name,
                email,
                phone,
                role,
                avatar: profile_photo_url
              })
            )
          );
        }
      } catch (error) {
        console.log('getUsers:', error);
      }
    }
  }
};
