<template>
  <app-page class="page-interview-process page-interview-done">
    <template v-if="interview.id">
      <div class="page-interview-done-header">
        <a-row :gutter="{ lg: 20, sm: 10, xs: 10 }">
          <a-col :span="12">
            <a-row :gutter="[0, 20]">
              <a-col :span="24">
                <a-row type="flex" align="middle" :gutter="[0, 10]">
                  <a-col :span="24">
                    <span>{{ interview.company.name }}</span>
                  </a-col>

                  <a-col :span="24">
                    <PageTitle tag="h2" size="25" style="margin-bottom: 0px;">
                      {{ interview.name }}
                    </PageTitle>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-col>

          <a-col :span="12">
            <div class="page-interview-done-header-avatar">
              <a-avatar :size="65" :src="interview.company.logo">
                <icon-user-default-avatar />
              </a-avatar>
            </div>
          </a-col>
        </a-row>
      </div>

      <div class="page-interview-done-content">
        <a-row>
          <a-col :span="24">
            <card class="text-align-center">
              <page-title tag="div" size="20">
                {{ $t('almost_done') }}
              </page-title>

              <page-title tag="div" size="20">
                {{ $t('please_review_your_answers') }}
              </page-title>

              <p class="text-gray-300">
                {{ $t('please_provide_your_personal_details') }}
              </p>

              <a-form class="mt-20">
                <a-row :gutter="20">
                  <a-col :md="8" :span="24">
                    <a-form-item
                      has-feedback
                      :label="data.name.value && $t('placeholders.full_name')"
                      :validate-status="data.name.status"
                    >
                      <a-input
                        v-model="data.name.value"
                        type="text"
                        :placeholder="$t('placeholders.full_name')"
                        size="large"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="12" :span="24">
                    <a-form-item
                      has-feedback
                      :label="data.email.value && $t('placeholders.email')"
                      :validate-status="data.email.status"
                    >
                      <a-input
                        v-model="data.email.value"
                        type="email"
                        :placeholder="$t('placeholders.email')"
                        size="large"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="12" :span="24">
                    <a-form-item
                      has-feedback
                      :label="data.phone.value && $t('placeholders.phone')"
                      :validate-status="data.phone.status"
                    >
                      <a-input
                        v-model="data.phone.value"
                        type="tel"
                        :placeholder="$t('placeholders.phone')"
                        size="large"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col v-if="interview.cv" :lg="8" :sm="12" :span="24">
                    <a-form-item class="ant-form-item-file-picker">
                      <app-button block size="large" @click="getCVFile">
                        {{ $t('cv') }}
                      </app-button>

                      <div
                        v-if="data.cv"
                        class="ant-form-item-file-picker-value"
                      >
                        {{ data.cv.name }}

                        <a-popconfirm
                          :title="`${$t('are_you_sure')}?`"
                          @confirm="data.cv = null"
                        >
                          <a href="#">
                            <icon-del />
                          </a>
                        </a-popconfirm>
                      </div>
                    </a-form-item>
                  </a-col>

                  <a-col
                    v-if="interview.motivationLatter"
                    :lg="8"
                    :sm="12"
                    :span="24"
                  >
                    <a-form-item class="ant-form-item-file-picker">
                      <app-button
                        block
                        size="large"
                        @click="getmotivationLatterFile"
                      >
                        {{ $t('motivational_letter') }}
                      </app-button>

                      <div
                        v-if="data.motivationLatter"
                        class="ant-form-item-file-picker-value"
                      >
                        {{ data.motivationLatter.name }}

                        <a-popconfirm
                          :title="`${$t('are_you_sure')}?`"
                          @confirm="data.motivationLatter = null"
                        >
                          <a href="#">
                            <icon-del />
                          </a>
                        </a-popconfirm>
                      </div>
                    </a-form-item>
                  </a-col>

                  <a-col :lg="8" :span="24">
                    <a-form-item>
                      <app-button
                        block
                        type="primary"
                        size="large"
                        class="blue-gradient hover-light"
                        :style="{
                          backgroundColor: style.btnColor,
                          borderColor: style.btnColor
                        }"
                        :loading="isUpload || isWaitResponse"
                        @click="handleSubmit"
                      >
                        <template v-if="!isWaitResponse">
                          <template v-if="!isUpload">
                            {{ $t('send_to_employer') }}
                          </template>

                          <template v-else>
                            {{ `${$t('loading')}: ${loadingProgress}%` }}
                          </template>
                        </template>

                        <template v-else>
                          {{ $t('please_wait') }}
                        </template>
                      </app-button>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </card>
          </a-col>
        </a-row>

        <div v-if="answers.length" class="mt-20">
          <a-row type="flex" :gutter="[20, 20]">
            <a-col
              v-for="(answer, index) in answers"
              :key="answer.id"
              :lg="{ span: 8 }"
              :md="{ span: 12 }"
              :xs="{ span: 24 }"
            >
              <video-card
                v-if="answer.type === 'VIDEO'"
                :index="index"
                :data="answer"
                :options="videoPlayerOptions"
              />

              <quiz-card
                v-if="answer.type === 'TEST'"
                :index="index"
                :data="answer"
              />

              <text-card
                v-if="answer.type === 'TEXT'"
                :index="index"
                :data="answer"
              />

              <code-card
                v-if="answer.type === 'CODE'"
                :index="index"
                :data="answer"
              ></code-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </template>
  </app-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { API_BASE_PATH } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

import AppPage from '../components/AppPage.vue';
import Card from '../components/Card.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import VideoCard from '../components/VideoCard.vue';
import QuizCard from '../components/QuizCard.vue';
import TextCard from '../components/TextCard.vue';
import CodeCard from '../components/CodeCard.vue';

import IconUserDefaultAvatar from '../components/icons/UserDefaultAvatar.vue';
// import IconDel from '../components/icons/Del.vue';

export default {
  name: 'InterviewDone',

  components: {
    AppPage,
    Card,
    PageTitle,
    AppButton,
    VideoCard,
    QuizCard,
    TextCard,
    CodeCard,
    IconUserDefaultAvatar
    // IconDel
  },

  data() {
    return {
      isUpload: false,
      isWaitResponse: false,
      loadingProgress: 0,
      videoPlayerOptions: {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume'
        ]
      },
      data: {
        name: { value: '', status: '' },
        email: { value: '', status: '' },
        phone: { value: '', status: '' },
        cv: null,
        motivationLatter: null
      }
    };
  },

  computed: {
    style() {
      const { style } = this.interview;

      return style;
    },

    ...mapState({
      interview: (state) => state.interview.info,
      answers: (state) => state.interview.answers
    })
  },

  async created() {
    if (!this.interview.id) {
      await this.getInterviewInfo();
    }

    if (this.interview.user) {
      const {
        interview: { user },
        data: { name, email, phone }
      } = this;

      name.value = user.name;
      email.value = user.email;
      phone.value = user.phone;
    }
  },

  methods: {
    getCVFile() {
      const input = document.createElement('input');

      input.type = 'file';
      input.accept =
        'application/msword, text/plain, application/pdf, .png, .jpg, .jpeg';

      input.onchange = (e) => {
        const file = e.target.files[0];

        this.data.cv = file;
      };

      input.click();
    },

    getmotivationLatterFile() {
      const input = document.createElement('input');

      input.type = 'file';
      input.accept =
        'application/msword, text/plain, application/pdf, .png, .jpg, .jpeg';

      input.onchange = (e) => {
        const file = e.target.files[0];

        this.data.motivationLatter = file;
      };

      input.click();
    },

    checkForm() {
      let valid = true;

      const {
        data: { name, email }
      } = this;

      name.status = '';
      email.status = '';

      if (!name.value) {
        name.status = 'error';
        valid = false;
      }

      if (!email.value) {
        email.status = 'error';
        valid = false;
      }

      return valid;
    },

    async handleSubmit() {
      const {
        data: { name, email, phone, cv, motivationLatter },
        $route: {
          params: { hash }
        },
        answers
      } = this;

      const formData = new FormData();

      formData.append('hash', hash);
      formData.append('name', name.value);
      formData.append('email', email.value);

      if (phone.value) {
        formData.append('phone', phone.value);
      }

      if (cv) {
        formData.append('ask_cv', cv);
      }

      if (motivationLatter) {
        formData.append('ask_motivation_letter', motivationLatter);
      }

      answers.forEach((item, i) => {
        formData.append(`question_id[${i}]`, item.id);

        if (item.type === 'VIDEO') {
          formData.append(`video[${i}]`, item.file);

          if (item.transcript) {
            formData.append(`text[${i}]`, item.transcript);
          } else {
            formData.append(`text[${i}]`, '');
          }
        } else if (item.type === 'TEST') {
          formData.append(`tests[${i}]`, JSON.stringify(item.tests));
        } else {
          formData.append(`answer[${i}]`, item.answer);
        }
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.onloadstart = () => {
        this.isUpload = true;
      };

      xhr.upload.onprogress = (e) => {
        this.loadingProgress = ((e.loaded * 100) / e.total).toFixed(0);
      };

      xhr.upload.onload = () => {
        this.isUpload = false;
        this.isWaitResponse = true;
        this.loadingProgress = 0;
      };

      xhr.upload.onerror = () => {
        this.isUpload = false;
        this.loadingProgress = 0;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      };

      xhr.onload = () => {
        this.isWaitResponse = false;
        const res = JSON.parse(xhr.response);

        const { error, response } = res;

        if (response.message) {
          this.$notification[error ? 'warning' : 'success']({
            message: error
              ? this.$t('notify.warning')
              : this.$t('notify.success'),
            description: response.message,
            icon: () =>
              error ? (
                <icon-error class="error-icon" />
              ) : (
                <icon-success class="success-icon" />
              )
          });
        }

        if (!error) {
          this.$router.replace(`/i/result/success`);
        }
      };

      xhr.open('POST', `${API_BASE_PATH}response`);
      xhr.setRequestHeader('Accept-Language', localStorage.getItem('lang'));
      xhr.setRequestHeader(
        'Authorization',
        `Bearer ${localStorage.getItem('access_token')}`
      );

      xhr.send(formData);
    },

    async getInterviewInfo() {
      try {
        const {
          params: { hash }
        } = this.$route;

        const res = await apiRequest(`interview/${hash}`, 'GET', null);

        const { error, response } = res;

        if (response.message) {
          this.$notification[error ? 'warning' : 'success']({
            message: error
              ? this.$t('notify.warning')
              : this.$t('notify.success'),
            description: response.message,
            icon: () =>
              error ? (
                <icon-error class="error-icon" />
              ) : (
                <icon-success class="success-icon" />
              )
          });
        }

        if (error) {
          this.$router.replace('/404');
        } else {
          const {
            data: { job, response: user }
          } = response;

          this.SET_INTERVIEW_INFO(parseJobs(job));

          if (user) {
            this.SET_INTERVIEW_USER_INFO({
              id: user.id,
              email: user.email,
              phone: user.phone,
              name: user.full || ''
            });
          }

          this.SET_APP_LOADING();
        }
      } catch (error) {
        console.log('getInterviewInfo:', error);
      }
    },

    ...mapMutations({
      SET_APP_LOADING: 'app/SET_APP_LOADING',
      SET_INTERVIEW_INFO: 'interview/SET_INTERVIEW_INFO',
      SET_INTERVIEW_USER_INFO: 'interview/SET_INTERVIEW_USER_INFO'
    })
  }
};
</script>

<style lang="scss">
// .page-interview-done {
//   .ant-form-item-control {
//     text-align: left;
//   }
// }

.page-interview-process {
  .app-page-header {
    display: none;
  }
}

.page-interview-process-back {
  text-align: right;

  @media (max-width: $sm) {
    margin-top: 25px;
    text-align: left;
  }

  .app-button {
    border: 0;
    box-shadow: 0 8px 16px -8px rgba(46, 13, 104, 0.4);

    &:hover {
      box-shadow: 0 8px 16px -8px rgba(46, 13, 104, 0.6);
    }
  }
}

.page-interview-process-actions {
  margin-top: auto;
}

.page-interview-process-actions-devider {
  margin: 40px 0 30px;
  width: 100px;
  height: 2px;
  background-color: #b6b7c6;
}

// .page-interview-header {
//   .page-title {
//     color: #adadad;
//   }
// }

.page-interview-done-header-avatar {
  text-align: right;
}

.page-interview-done-content {
  position: relative;
  margin-top: 60px;
  padding: 50px 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100vw;
    width: 500vw;
    height: 100%;
    background-color: rgba(#e2e1e9, 0.25);
  }

  // .card {
  //   background-color: transparent;
  //   box-shadow: none;
  // }
}

.ant-form-item-file-picker {
  text-align: left;

  // .ant-form-item-children {
  // }
}

.ant-form-item-file-picker-value {
  display: flex;
  align-items: center;
  margin-top: 10px;

  a {
    line-height: 1;
    margin-bottom: -2px;
  }

  svg {
    margin-left: 10px;
    width: 18px;
    height: 18px;
    fill: #dd2705;
  }
}
</style>
