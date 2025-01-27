import { format } from 'date-fns';
import app from '../../main.js';
import locales from '../../js/plugins/date-fns.js';
import apiRequest from '../../js/helpers/apiRequest.js';

import { SET_LIVE_INTERVIEWS } from '../mutations.js';

export default {
  state: {
    interviews: []
  },

  mutations: {
    [SET_LIVE_INTERVIEWS](state, interviews) {
      state.interviews = interviews;
    }
  },

  actions: {
    async getLiveInterviews({ commit }) {
      try {
        const res = await apiRequest('rooms', 'GET', null, true);

        const { error } = res;

        if (!error) {
          commit(
            SET_LIVE_INTERVIEWS,
            res.response.data.map(
              ({
                id,
                created_at,
                updated_at,
                company_id,
                name,
                description,
                link,
                share_hash,
                source,
                start,
                status,
                permissions
              }) => ({
                id,
                createdAt: created_at,
                updatedAt: updated_at,
                startAt: start,
                companyId: company_id,
                name,
                note: description,
                link,
                hash: share_hash,
                source,
                date: format(new Date(start), 'yyyy/MM/dd H:mm'),
                start: format(new Date(start), 'dd MMM yyyy H:mm', {
                  locale: locales[app.$i18n.locale]
                }),
                status,
                permissions
              })
            )
          );
        }
      } catch (error) {
        console.log('getLiveInterviews', error);
      }
    }
  }
};
