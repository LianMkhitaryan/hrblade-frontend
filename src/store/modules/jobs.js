import { SET_JOBS, SET_VIEWED_JOB_ID } from '../mutations.js';
import apiRequest from '../../js/helpers/apiRequest.js';
import parseJobs from '../../js/helpers/parseJobs.js';

export default {
  state: {
    jobs: [],
    viewedJobId: null
  },

  mutations: {
    [SET_JOBS](state, jobs) {
      state.jobs = jobs;
    },

    [SET_VIEWED_JOB_ID](state, jobId) {
      state.viewedJobId = jobId;
    }
  },

  actions: {
    async getJobs({ commit }) {
      try {
        this.pageLoading = true;
        const res = await apiRequest('jobs', 'GET', null, true);
        this.pageLoading = false;

        if (res.error) {
          console.log(res);
        } else {
          const { data } = res.response;

          commit(SET_JOBS, data.map(parseJobs));
        }
      } catch (error) {
        console.log('getJobs:', error);
      }
    }
  }
};
