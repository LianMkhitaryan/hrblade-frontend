<template>
  <app-page class="page-question">
    <template slot="header">
      <page-title>
        {{ $t('page_question.title') }}
      </page-title>
    </template>

    <a-row :gutter="{ lg: 20, xs: 10 }">
      <a-col :span="24">
        <card>
          <a-form>
            <a-form-item
              has-feedback
              :label="data.email.value && $t('placeholders.email')"
              :validate-status="data.email.status"
            >
              <a-input
                v-model="data.email.value"
                type="email"
                :placeholder="$t('placeholders.email')"
              />
            </a-form-item>

            <a-form-item
              has-feedback
              :label="data.subject.value && $t('placeholders.subject')"
              :validate-status="data.subject.status"
            >
              <a-select
                :placeholder="$t('placeholders.subject')"
                :defaultActiveFirstOption="false"
                :value="data.subject.value"
                @change="onChangeSubject"
              >
                <div slot="suffixIcon">
                  <icon-arrow-down></icon-arrow-down>
                </div>

                <template slot="notFoundContent">
                  <div class="ant-empty ant-empty-normal ant-empty-small">
                    <div class="ant-empty-image">
                      <icon-more fill="rgba(0, 0, 0, 0.25)"></icon-more>
                    </div>
                    <p class="ant-empty-description">{{ $t('no_data') }}</p>
                  </div>
                </template>

                <a-select-option
                  v-for="(subject, index) in subjects"
                  :key="index"
                  :value="subject"
                >
                  {{ subject }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              has-feedback
              :label="data.description.value && $t('placeholders.description')"
              :validate-status="data.description.status"
            >
              <a-input
                v-model="data.description.value"
                type="textarea"
                :placeholder="$t('placeholders.description')"
              />
            </a-form-item>

            <a-form-item class="mt-40">
              <app-button
                type="primary"
                size="large"
                :loading="isFormUpload"
                @click="handleSubmit"
              >
                {{ $t('submit') }}
              </app-button>

              <router-link to="/support">
                <app-button size="large" class="ml-10">
                  {{ $t('back') }}
                </app-button>
              </router-link>
            </a-form-item>
          </a-form>
        </card>
      </a-col>
    </a-row>
  </app-page>
</template>

<script>
import { mapState } from 'vuex';
import apiRequest from '../js/helpers/apiRequest';

import AppPage from '../components/AppPage.vue';
import Card from '../components/Card.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';

import IconArrowDown from '../components/icons/ArrowDown.vue';
import IconMore from '../components/icons/More.vue';

export default {
  name: 'Dashboard',

  components: {
    AppPage,
    Card,
    PageTitle,
    AppButton,
    IconArrowDown,
    IconMore
  },

  data() {
    return {
      isFormUpload: false,

      data: {
        email: { value: '', status: '' },
        subject: { value: undefined, status: '' },
        description: { value: '', status: '' }
      }
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.$t('page_question.title')}`
    };
  },

  watch: {
    user(info) {
      this.data.email.value = info.email;
    }
  },

  computed: {
    ...mapState({
      user: ({ user }) => user.info,
      subjects: ({ app }) => app.subjects
    })
  },

  created() {
    if (this.user.id) {
      this.data.email.value = this.user.email;
    }
  },

  methods: {
    onChangeSubject(val) {
      this.data.subject.value = val;
    },

    checkForm() {
      let valid = true;
      const {
        data: { email, subject, description }
      } = this;

      email.status = '';
      subject.status = '';
      description.status = '';

      if (!email.value) {
        email.status = 'error';
        valid = false;
      }

      if (!subject.value) {
        subject.status = 'error';
        valid = false;
      }

      if (!description.value) {
        description.status = 'error';
        valid = false;
      }

      return valid;
    },

    async handleSubmit() {
      const valid = this.checkForm();

      if (valid) {
        try {
          const {
            data: { email, subject, description }
          } = this;

          const body = new FormData();

          body.append('email', email.value);
          body.append('subject', subject.value);
          body.append('description', description.value);

          this.isFormUpload = true;
          const res = await apiRequest('help', 'POST', body, true);
          this.isFormUpload = false;

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
            subject.value = undefined;
            description.value = '';
          }
        } catch (error) {
          console.log('handleSubmit:', error);
          this.isFormUpload = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    }
  }
};
</script>
