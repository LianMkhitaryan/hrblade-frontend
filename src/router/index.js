import Vue from 'vue';
import VueRouter from 'vue-router';
// import removeTokenFromLocalStorage from '../js/helpers/removeTokenFromLocalStorage.js';
// import setTokenToLocalStorage from '../js/helpers/setTokenToLocalStorage.js';

import AuthLayout from '../layouts/AuthLayout.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import InterviewLayout from '../layouts/InterviewLayout.vue';
import CompanyViewLauout from '../layouts/CompanyViewLauout.vue';
import LiveInterviewLayout from '../layouts/LiveInterviewLayout.vue';
import NotFound from '../layouts/NotFoundLayout.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'default-layout',
    component: DefaultLayout,
    meta: {
      auth: true
    },
    children: [
      {
        path: '/',
        name: 'jobs',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Jobs.vue')
      },
      {
        path: '/jobs/vacancy/:id',
        name: 'jobs-vacancy-id',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Job.vue')
      },
      {
        path: '/jobs/create',
        name: 'jobs-create',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/JobEdit.vue')
      },
      {
        path: '/jobs/edit/:id',
        name: 'jobs-edit-id',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/JobEdit.vue')
      },
      {
        path: '/jobs/invite/:id',
        name: 'jobs-invite-id',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/JobInvite.vue')
      },

      {
        path: '/jobs/candidate/:id',
        name: 'jobs-candidate-id',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Candidate.vue')
      },

      {
        path: '/live',
        name: 'live',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Live.vue')
      },

      {
        path: '/companies',
        name: 'companies',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Companies.vue')
      },
      {
        path: '/companies/view/:id',
        name: 'companies-view-id',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Company.vue')
      },
      {
        path: '/companies/create',
        name: 'companies-create',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/CompanyEdit.vue')
      },
      {
        path: '/companies/edit/:id',
        name: 'companies-edit-id',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/CompanyEdit.vue')
      },

      {
        path: '/users',
        name: 'users',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Users.vue')
      },
      {
        path: '/users/create',
        name: 'user-create',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/UserEdit.vue')
      },
      {
        path: '/users/edit/:id',
        name: 'user-edit-id',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/UserEdit.vue')
      },

      {
        path: '/profile',
        name: 'profile',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Profile.vue'),
        children: [
          {
            path: ''
          },
          {
            path: 'plan'
          },
          {
            path: 'usage'
          },
          {
            path: 'integrations',
            component: () =>
              import(
                /* webpackChunkName: "chank" */ '../views/ProfileIntegrations.vue'
              )
          }
        ]
        // component: () =>
        //   import(/* webpackChunkName: "chank" */ '../views/Profile.vue')
      },
      {
        path: '/profile/edit',
        name: 'profile-edit',
        component: () =>
          import(
            /* webpackChunkName: "chank-profile" */ '../views/ProfileEdit.vue'
          )
      },

      {
        path: '/support',
        name: 'Support',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Support.vue')
      },
      {
        path: '/support/question',
        name: 'support-question',
        component: () =>
          import(
            /* webpackChunkName: "chank-support" */ '../views/Question.vue'
          )
      }
    ]
  },

  {
    path: '/login',
    name: 'auth-layout',
    component: AuthLayout,
    meta: {
      auth: false
    },
    children: [
      {
        path: '/login',
        name: 'login',
        component: () =>
          import(/* webpackChunkName: "auth" */ '../views/Login.vue')
      },
      {
        path: '/registration/:hash?',
        name: 'registration',
        component: () =>
          import(/* webpackChunkName: "auth" */ '../views/Registration.vue')
      },
      {
        path: '/password/forgot',
        name: 'password-forgot',
        component: () =>
          import(/* webpackChunkName: "auth" */ '../views/PasswordForgot.vue')
      },
      {
        path: '/password/reset/:token',
        name: 'password-reset',
        component: () =>
          import(/* webpackChunkName: "auth" */ '../views/PasswordReset.vue')
      }
    ]
  },

  {
    path: '/invite/companies/:hash',
    name: 'invite-companies-hash-layout',
    component: AuthLayout,
    meta: {
      auth: false
    },
    children: [
      {
        path: '/invite/companies/:hash',
        name: 'invite-companies-hash',
        component: () =>
          import(/* webpackChunkName: "auth" */ '../views/CompanyInvite.vue')
      }
    ]
  },

  {
    path: '/i/:hash',
    name: 'interview-layout',
    component: InterviewLayout,
    meta: {
      auth: false
    },
    children: [
      {
        path: '/i/:hash',
        name: 'interview',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/Interview.vue')
      },
      {
        path: '/i/unsupported/:hash',
        name: 'interview-unsupported-hash',
        component: () =>
          import(
            /* webpackChunkName: "chank" */ '../views/InterviewUnsupported.vue'
          )
      },
      {
        path: '/i/process/:hash',
        name: 'interview-process-hash',
        component: () =>
          import(
            /* webpackChunkName: "chank" */ '../views/InterviewProcess.vue'
          )
      },
      {
        path: '/i/done/:hash',
        name: 'interview-done-hash',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/InterviewDone.vue')
      },
      {
        path: '/i/result/:status',
        name: 'interview-result-status',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/InterviewResult.vue')
      }
    ]
  },

  {
    path: '/i/l/:hash',
    name: 'live-interview-layout',
    component: localStorage.getItem('access_token')
      ? DefaultLayout
      : LiveInterviewLayout,
    meta: {
      auth: false
    },
    children: [
      {
        path: '/i/l/:hash',
        name: 'interview-live',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/InterviewLive.vue')
      },
      {
        path: '/i/l/unsupported/:hash',
        name: 'interview-unsupported-hash',
        component: () =>
          import(
            /* webpackChunkName: "chank" */ '../views/InterviewUnsupported.vue'
          )
      }
      // {
      //   path: '/i/l/process/:hash',
      //   name: 'interview-process',
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "chank" */ '../views/InterviewProcess.vue'
      //     )
      // }
    ]
  },

  {
    path: '/s/:hash',
    name: 'interview-layout',
    component: InterviewLayout,
    meta: {
      auth: false
    },
    children: [
      {
        path: '/s/:hash',
        name: 'interview-share-hash',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/InterviewShare.vue')
      }
    ]
  },

  {
    path: '/c/:hash',
    name: 'company-view-layout',
    component: CompanyViewLauout,
    meta: {
      auth: false
    },
    children: [
      {
        path: '/c/:hash',
        name: 'company-view-hash',
        component: () =>
          import(/* webpackChunkName: "chank" */ '../views/CompanyView.vue')
      }
    ]
  },

  {
    path: '/404',
    name: '404',
    component: NotFound
  },
  {
    path: '*',
    redirect: '/404'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const requiredAuth = to.matched.some((m) => m.meta.auth);
  const token = localStorage.getItem('access_token');

  if ((requiredAuth && token) || !requiredAuth) {
    next();
  } else {
    next('/login');
  }
});

export default router;
