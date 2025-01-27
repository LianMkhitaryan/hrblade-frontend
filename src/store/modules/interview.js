import {
  SET_INTERVIEW_INFO,
  SET_INTERVIEW_USER_INFO,
  SET_INTERVIEW_ANSWERS
} from '../mutations.js';

export default {
  state: {
    info: {},
    answers: []
  },

  mutations: {
    [SET_INTERVIEW_INFO](state, info) {
      state.info = info;
    },

    [SET_INTERVIEW_USER_INFO](state, info) {
      state.info.user = info;
    },

    [SET_INTERVIEW_ANSWERS](state, answers) {
      state.answers = answers;
    }
  },

  actions: {}
};
