<template>
  <app-page class="page-job-invite" :loading="pageLoading">
    <template v-if="jobInfo.id">
      <template slot="header">
        <a-breadcrumb class="mb-5" separator=">">
          <a-breadcrumb-item>
            <router-link to="/">
              {{ $t('breadcrumbs.jobs') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <router-link :to="`/jobs/vacancy/${jobInfo.id}`">
              {{ jobInfo.name }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            {{ $t('invite') }}
          </a-breadcrumb-item>
        </a-breadcrumb>

        <page-title>
          {{ $t('page_job_invite.title') }}
        </page-title>
      </template>

      <a-row type="flex" :gutter="[
        { lg: 20, md: 10 },
        { lg: 20, sm: 10, xs: 10 }
      ]">
        <a-col :md="12" :span="24">
          <card>
            <page-title tag="h3" size="16" class="mb-15">
              {{ $t('page_job_invite.invite_link') }}
            </page-title>

            <p class="text-gray-300">
              {{ $t('page_job_invite.copy_and_share') }}
              <br />
              {{ `(${$t('page_job_invite.recommended_option')})` }}
            </p>

            <div class="d-flex">
              <a-input ref="inviteLink" class="mr-10 copy" size="large" readonly
                :value="`${BASE_PATH_APP_URL}i/${jobInfo.hashLink}`" @click="handleCopy" />

              <app-button type="primary" size="large" @click="handleCopy">
                {{ $t('copy') }}
              </app-button>
            </div>
          </card>
        </a-col>

        <a-col :md="12" :span="24">
          <card>
            <page-title tag="h3" size="16" class="mb-15">
              {{ $t('share_to_social_networks') }}
            </page-title>

            <ul class="social-sharing">
              <li class="social-sharing-item">
                <a :href="`https://www.facebook.com/sharer/sharer.php?u=${BASE_PATH_APP_URL}i/${jobInfo.hashLink}`
                  " target="_blank" class="social-sharing-link">
                  <icon-fb class="social-sharing-icon" />

                  <div class="social-sharing-label">
                    Facebook
                  </div>
                </a>
              </li>

              <li class="social-sharing-item">
                <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${BASE_PATH_APP_URL}i/${jobInfo.hashLink}&title=&summary=&source=`
                  " target="_blank" class="social-sharing-link">
                  <icon-linkedin class="social-sharing-icon" />

                  <div class="social-sharing-label">
                    Linkedin
                  </div>
                </a>
              </li>

              <li class="social-sharing-item">
                <a :href="`https://twitter.com/intent/tweet?url=${BASE_PATH_APP_URL}i/${jobInfo.hashLink}&text=`
                  " target="_blank" class="social-sharing-link">
                  <icon-twitter class="social-sharing-icon" />

                  <div class="social-sharing-label">
                    Twitter
                  </div>
                </a>
              </li>

              <li class="social-sharing-item">
                <a :href="`https://vk.com/share.php?url=${BASE_PATH_APP_URL}i/${jobInfo.hashLink}`
                  " target="_blank" class="social-sharing-link">
                  <icon-vk class="social-sharing-icon" />

                  <div class="social-sharing-label">
                    VKontakte
                  </div>
                </a>
              </li>
            </ul>
          </card>
        </a-col>

        <a-col :md="12" :span="24">
          <card>
            <page-title tag="h3" size="16" class="mb-15">
              {{ $t('page_job_invite.invite_a_few') }}
            </page-title>

            <p class="text-gray-300">
              {{ $t('page_job_invite.enter_candidates_details') }}
            </p>

            <a-form @submit.prevent="handleSubmitForm">
              <a-row :gutter="{ lg: 20, sm: 10, xs: 10 }">
                <a-col :span="24">
                  <a-form-item has-feedback :label="data.name.value && $t('placeholders.full_name')"
                    :validate-status="data.name.status">
                    <a-input v-model="data.name.value" :placeholder="$t('placeholders.full_name')" size="large" />
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item has-feedback :label="data.email.value && $t('placeholders.email')"
                    :validate-status="data.email.status">
                    <a-input v-model="data.email.value" type="email" :placeholder="$t('placeholders.email')"
                      size="large" />
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item has-feedback :label="data.phone.value && $t('placeholders.phone')"
                    :validate-status="data.phone.status">
                    <a-input v-model="data.phone.value" type="tel" :placeholder="$t('placeholders.phone')" size="large" />
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item has-feedback :label="data.language.value && $t('language')"
                    :validate-status="data.language.status">
                    <a-select :placeholder="$t('language')" :defaultActiveFirstOption="false" :value="data.language.value"
                      @change="onChangeLanguage">
                      <div slot="suffixIcon">
                        <icon-arrow-down />
                      </div>

                      <template slot="notFoundContent">
                        <div class="ant-empty ant-empty-normal ant-empty-small">
                          <div class="ant-empty-image">
                            <icon-more fill="rgba(0, 0, 0, 0.25)" />
                          </div>
                          <p class="ant-empty-description">
                            {{ $t('no_data') }}
                          </p>
                        </div>
                      </template>

                      <a-select-option v-for="(language, index) in languages" :key="index" :value="language.name">
                        {{ language.title }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item>
                    <a-checkbox :checked="data.isSendInvite" @change="(e) => (data.isSendInvite = e.target.checked)">
                      {{ $t('Send invite') }}
                    </a-checkbox>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item>
                    <app-button htmlType="submit" type="primary" size="large" :loading="loadInvite">
                      {{ $t('invite') }}
                    </app-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </card>
        </a-col>

        <a-col :md="12" :span="24">
          <card>
            <page-title tag="h3" size="16" class="mb-15">
              {{ $t('page_job_invite.invite_many') }}
            </page-title>

            <p class="text-gray-300">
              {{ $t('page_job_invite.upload_a_spreadsheet_of_candidates') }}
            </p>

            <a-form>
              <a-form-item has-feedback :label="csvInviteData.language.value && $t('language')"
                :validate-status="csvInviteData.language.status">
                <a-select :placeholder="$t('language')" :value="csvInviteData.language.value"
                  @change="onChangeCsvLanguage">
                  <div slot="suffixIcon">
                    <icon-arrow-down />
                  </div>

                  <template slot="notFoundContent">
                    <div class="ant-empty ant-empty-normal ant-empty-small">
                      <div class="ant-empty-image">
                        <icon-more fill="rgba(0, 0, 0, 0.25)" />
                      </div>
                      <p class="ant-empty-description">{{ $t('no_data') }}</p>
                    </div>
                  </template>

                  <a-select-option v-for="(language, index) in languages" :key="index" :value="language.name">
                    {{ language.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-form>

            <div class="d-flex flex-xs-column">
              <app-button type="primary" size="large" class="mr-tablet-10 mb-sm-15" block @click="getCsv">
                {{ $t('browse') }}
              </app-button>

              <a href="/import.csv" download="import.csv">
                <app-button size="large" block>
                  {{ $t('page_job_invite.download_example_file') }}
                </app-button>
              </a>
            </div>

            <div v-if="csvInviteData.file" class="d-flex flex-column mt-20">
              <page-title tag="div" size="16" class="mb-10">
                {{ csvInviteData.file.name }}
              </page-title>

              <app-button type="primary" size="large" block class="mr-tablet-10 mb-sm-15" :loading="csvUpload"
                @click="uploadCsv">
                {{ $t('send') }}
              </app-button>
            </div>
          </card>
        </a-col>
      </a-row>
    </template>
  </app-page>
</template>

<script>
import { mapActions } from 'vuex';
import { BASE_PATH_APP_URL, BASE_PATH_URL } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';

import IconArrowDown from '../components/icons/ArrowDown.vue';
import IconFb from '../components/icons/Facebook2.vue';
import IconLinkedin from '../components/icons/Linkedin.vue';
import IconTwitter from '../components/icons/Twitter2.vue';
import IconVk from '../components/icons/Vk.vue';
import IconMore from '../components/icons/More.vue';

export default {
  name: 'JobInvite',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    IconArrowDown,
    IconFb,
    IconLinkedin,
    IconTwitter,
    IconVk,
    IconMore
  },

  data() {
    return {
      BASE_PATH_APP_URL,
      pageLoading: false,
      csvUpload: false,
      loadInvite: false,
      // languages: [
      //   {
      //     name: 'en',
      //     title: 'English (EN)'
      //   },
      //   {
      //     name: 'ru',
      //     title: 'Russian (RU)'
      //   },
      //   {
      //     name: 'de',
      //     title: 'German (DE)'
      //   },
      //   {
      //     name: 'es',
      //     title: 'Spanish (ES)'
      //   },
      //   {
      //     name: 'it',
      //     title: 'Italian (IT)'
      //   },
      //   {
      //     value: 'ar',
      //     title: 'Arabic (AR)'
      //   }
      // ],
      jobInfo: {},
      data: {
        name: { value: '', status: '' },
        email: { value: '', status: '' },
        phone: { value: '', status: '' },
        language: { value: this.$i18n.locale, status: '' },
        isSendInvite: true
      },
      csvInviteData: {
        language: { value: this.$i18n.locale, status: '' },
        file: null
      }
    };
  },

  metaInfo() {
    return {
      title: this.jobInfo.name,
      meta: [
        { vmid: 'description', name: 'description', content: '' },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: this.jobInfo.name
        },
        { vmid: 'og:description', property: 'og:description', content: '' },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content:
            this.jobInfo.company && this.jobInfo.company.website
              ? this.jobInfo.company.website
              : BASE_PATH_URL[this.$i18n.locale]
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content:
            this.jobInfo.company && this.jobInfo.company.logo
              ? this.jobInfo.company.logo
              : ''
        }
      ]
    };
  },

  computed: {
    responsesCount() {
      return this.$store.state.user.plan.responsesCount;
    },

    responsesLimit() {
      return this.$store.state.user.plan.responsesLimit;
    },

    languages() {
      return this.$store.state.app.lng;
    }
  },

  created() {
    this.getJob();
  },

  methods: {
    handleCopy() {
      this.$refs.inviteLink.$el.select();
      this.$refs.inviteLink.$el.setSelectionRange(0, 99999);

      document.execCommand('copy');
      document.getSelection().removeAllRanges();

      this.$notification.success({
        message: this.$t('notify.success'),
        description: this.$t('notify.link_added_to_clipboard'),
        icon: () => <icon-success class="success-icon" />
      });
    },

    onChangeLanguage(val) {
      this.data.language.value = val;
    },

    onChangeCsvLanguage(val) {
      this.csvInviteData.language.value = val;
    },

    checkForm() {
      let valid = true;

      const {
        data: { name, email, phone }
      } = this;

      name.status = '';
      email.status = '';
      phone.status = '';

      if (!name.value) {
        name.status = 'error';
        valid = false;
      }

      if (!email.value) {
        email.status = 'error';
        valid = false;
      }

      // if (!phone.value) {
      //   phone.status = 'error';
      //   valid = false;
      // }

      return valid;
    },

    getCsv() {
      const input = document.createElement('input');

      input.type = 'file';
      input.accept = '.csv';

      input.onchange = (e) => {
        const file = e.target.files[0];

        if (file.type.match('text/csv')) {
          this.csvInviteData.file = file;
        } else {
          this.$notification.warning({
            message: this.$t('notify.warning'),
            description: this.$t('notify.check_file_format'),
            icon: () => <icon-error class="warning-icon" />
          });
        }
      };

      input.click();
    },

    async uploadCsv() {
      if (this.responsesCount === this.responsesLimit) {
        this.$store.commit('app/TOGGLE_UPGRADE_MODAL', true);

        return;
      }

      try {
        const body = new FormData();
        const {
          $route: {
            params: { id }
          },
          csvInviteData: { language, file }
        } = this;

        body.append('job_id', id);
        body.append('csv', file);
        body.append('language', language.value);

        this.csvUpload = true;
        const res = await apiRequest(
          'job/invite/create/csv',
          'POST',
          body,
          true
        );
        this.csvUpload = false;

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
          this.csvInviteData.file = null;

          this.getJobs();
        }
      } catch (error) {
        console.log('uploadCsv:', error);
        this.csvUpload = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async handleSubmitForm() {
      if (this.responsesCount === this.responsesLimit) {
        this.$store.commit('app/TOGGLE_UPGRADE_MODAL', true);

        return;
      }

      try {
        const valid = this.checkForm();

        if (valid) {
          const body = new FormData();
          const id = this.$route.params.id;
          const {
            data: { name, email, phone, language, isSendInvite }
          } = this;

          body.append('job_id', id);
          body.append('name', name.value);
          body.append('email', email.value);
          body.append('language', language.value);
          body.append('send_invite', Number(isSendInvite));

          if (phone.value) {
            body.append('phone', phone.value);
          }

          this.loadInvite = true;
          const res = await apiRequest('job/invite/create', 'POST', body, true);
          this.loadInvite = false;

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
            name.value = '';
            email.value = '';
            phone.value = '';

            this.getJobs();
          }
        }
      } catch (error) {
        console.log('handleSubmitForm:', error);
        this.loadInvite = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async getJob() {
      try {
        const id = this.$route.params.id;

        this.pageLoading = true;
        const res = await apiRequest(`job/get/${id}`, 'GET', null, true);
        this.pageLoading = false;

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
          this.$router.push('/');
        } else {
          const { data } = res.response;

          this.jobInfo = parseJobs(data);
        }
      } catch (error) {
        console.log('getJob:', error);
      }
    },

    ...mapActions({
      getJobs: 'jobs/getJobs'
    })
  }
};
</script>

<style lang="scss">
.page-support-form {
  display: flex;
}

.social-sharing {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.social-sharing-item {
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
}

.social-sharing-link {
  display: flex;
  align-items: center;
  color: #363151;
  line-height: 1;
}

.social-sharing-icon {
  fill: currentColor;
  width: 25px;
  height: 25px;
  margin-right: 20px;
}

.social-sharing-label {
  font-size: 24px;
  font-weight: 700;
}
</style>
