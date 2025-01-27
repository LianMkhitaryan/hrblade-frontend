<template>
  <app-page
    :class="[
      'page-interview',
      `page-interview-template-${style ? style.template.toLowerCase() : ''}`
    ]"
    :loading="pageLoading"
  >
    <template v-if="interview.id">
      <a-row
        v-if="style && style.template === 'BLOCK'"
        type="flex"
        :gutter="[20, 20]"
        class="mt-auto"
      >
        <a-col :lg="{ offset: 5, span: 14 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card" big-padding>
            <div class="page-interview-company">
              <a-avatar
                class="page-interview-company-logo"
                shape="square"
                :size="85"
                :src="interview.company.logo"
              >
                <icon-user-default-avatar />
              </a-avatar>

              <div class="page-interview-company-info">
                <page-title tag="div" size="20">
                  <a
                    v-if="interview.company.website"
                    :href="interview.company.website"
                    target="_blank"
                    :style="{ color: style.btnColor }"
                    class="page-interview-company-link hover-light"
                  >
                    <span>{{ interview.company.name }}</span>
                    <icon-blank />
                  </a>
                </page-title>
              </div>
            </div>

            <a-divider />

            <page-title tag="h1" size="25" class="page-interview-title">
              {{ interview.name }}
            </page-title>

            <div class="page-interview-meta">
              <div v-if="interview.salary" class="info-item">
                <icon-wallet class="info-item-icon" />
                <span class="info-item-label">
                  {{ interview.salary }}
                </span>
              </div>

              <div v-if="interview.location" class="info-item">
                <icon-point class="info-item-icon" />
                <span class="info-item-label">
                  {{ interview.location }}
                </span>
              </div>
            </div>

            <a-divider />

            <a-checkbox
              class="privacy-checkbox custome-main-color mt-auto"
              :style="{ '--checkbox-main-color': style.btnColor }"
              @change="onChangeAgree"
            >
              {{ $t('i_agree_to_the') }}
              <a
                :href="
                  `${BASE_PATH_URL[$i18n.locale]}privacy${
                    $i18n.locale === 'ru' ? '#ru' : ''
                  }`
                "
                target="_blank"
                class="text-decoration-underline"
              >
                {{ $t('footer.links.privacy_policy') }}
              </a>
            </a-checkbox>

            <div class="d-flex mt-20">
              <app-button
                type="primary"
                size="large"
                class="page-interview-start-btn hover-light"
                :style="{
                  backgroundColor: style.btnColor,
                  borderColor: style.btnColor
                }"
                @click="getStarted"
              >
                {{ $t('get_started') }}
              </app-button>

              <!-- <app-button
                size="large"
                class="ml-20"
                @click="toggleFaqModalVisible"
              >
                <a-icon type="question" />
              </app-button> -->
            </div>
          </card>
        </a-col>

        <a-col :lg="{ offset: 5, span: 14 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card" big-padding>
            <div class="max-height-container">
              <img
                v-if="style.headerImage"
                :src="style.headerImage"
                class="mb-20"
                alt="image"
              />
              <div class="page-interview-info-card-text">
                <div v-html="interview.description"></div>
              </div>
            </div>
          </card>
        </a-col>
      </a-row>

      <a-row
        v-else-if="style && style.template === 'STANDARD'"
        type="flex"
        :gutter="[20, 20]"
        class="mt-auto"
      >
        <a-col :lg="{ offset: 5, span: 14 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card" big-padding>
            <div class="page-interview-company">
              <a-avatar
                class="page-interview-company-logo"
                shape="square"
                :size="85"
                :src="interview.company.logo"
              >
                <icon-user-default-avatar />
              </a-avatar>

              <div class="page-interview-company-info">
                <page-title tag="div" size="20">
                  <a
                    v-if="interview.company.website"
                    :href="interview.company.website"
                    target="_blank"
                    :style="{ color: style.btnColor }"
                    class="page-interview-company-link hover-light"
                  >
                    <span>{{ interview.company.name }}</span>
                    <icon-blank />
                  </a>
                </page-title>
              </div>
            </div>

            <a-divider />

            <page-title tag="h1" size="25" class="page-interview-title">
              {{ interview.name }}
            </page-title>

            <div class="page-interview-meta">
              <div v-if="interview.salary" class="info-item">
                <icon-wallet class="info-item-icon" />
                <span class="info-item-label">
                  {{ interview.salary }}
                </span>
              </div>

              <div v-if="interview.location" class="info-item">
                <icon-point class="info-item-icon" />
                <span class="info-item-label">
                  {{ interview.location }}
                </span>
              </div>
            </div>

            <card class="page-interview-info-card mt-20" big-padding>
              <div class="max-height-container">
                <img
                  v-if="style.headerImage"
                  :src="style.headerImage"
                  class="mb-20"
                  alt="image"
                />
                <div class="page-interview-info-card-text">
                  <div v-html="interview.description"></div>
                </div>
              </div>
            </card>

            <a-checkbox
              class="privacy-checkbox custome-main-color mt-20"
              :style="{ '--checkbox-main-color': style.btnColor }"
              @change="onChangeAgree"
            >
              {{ $t('i_agree_to_the') }}
              <a
                :href="
                  `${BASE_PATH_URL[$i18n.locale]}privacy${
                    $i18n.locale === 'ru' ? '#ru' : ''
                  }`
                "
                target="_blank"
                class="text-decoration-underline"
              >
                {{ $t('footer.links.privacy_policy') }}
              </a>
            </a-checkbox>

            <div class="d-flex mt-20">
              <app-button
                type="primary"
                size="large"
                class="page-interview-start-btn hover-light"
                :style="{
                  backgroundColor: style.btnColor,
                  borderColor: style.btnColor
                }"
                @click="getStarted"
              >
                {{ $t('get_started') }}
              </app-button>
            </div>
          </card>
        </a-col>
      </a-row>

      <a-row
        v-else-if="
          (style && style.template === 'LEFT_TO_RIGHT') || !style.template
        "
        type="flex"
        :gutter="[20, 20]"
        class="mt-auto"
      >
        <a-col :lg="{ span: 12 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card" big-padding>
            <page-title tag="div" size="16" class="page-interview-top-title">
              <span>
                {{ $t('you_are_invited_for_a_remote_interview') }}
              </span>
            </page-title>

            <page-title tag="h1" size="25" class="page-interview-title">
              {{ interview.name }}
            </page-title>

            <div class="page-interview-meta">
              <div v-if="interview.salary" class="info-item">
                <icon-wallet class="info-item-icon" />
                <span class="info-item-label">
                  {{ interview.salary }}
                </span>
              </div>

              <div v-if="interview.location" class="info-item">
                <icon-point class="info-item-icon" />
                <span class="info-item-label">
                  {{ interview.location }}
                </span>
              </div>
            </div>

            <a-divider />

            <div
              class="page-interview-company"
              style="align-items: flex-start;"
            >
              <a-avatar
                class="page-interview-company-logo"
                shape="square"
                :size="85"
                :src="interview.company.logo"
              >
                <icon-user-default-avatar />
              </a-avatar>

              <div class="page-interview-company-info">
                <page-title tag="div" size="20">
                  <a
                    v-if="interview.company.website"
                    :href="interview.company.website"
                    target="_blank"
                    :style="{ color: style.btnColor }"
                    class="page-interview-company-link hover-light"
                  >
                    <span>{{ interview.company.name }}</span>
                    <icon-blank />
                  </a>
                </page-title>
              </div>
            </div>

            <a-divider />

            <a-checkbox
              class="privacy-checkbox custome-main-color mt-auto"
              :style="{ '--checkbox-main-color': style.btnColor }"
              @change="onChangeAgree"
            >
              {{ $t('i_agree_to_the') }}
              <a
                :href="
                  `${BASE_PATH_URL[$i18n.locale]}privacy${
                    $i18n.locale === 'ru' ? '#ru' : ''
                  }`
                "
                target="_blank"
                class="text-decoration-underline"
              >
                {{ $t('footer.links.privacy_policy') }}
              </a>
            </a-checkbox>

            <div class="d-flex mt-20">
              <app-button
                type="primary"
                size="large"
                class="w-100 hover-light"
                :style="{
                  backgroundColor: style.btnColor,
                  borderColor: style.btnColor
                }"
                @click="getStarted"
              >
                {{ $t('get_started') }}
              </app-button>

              <!-- <app-button
                size="large"
                class="ml-20"
                @click="toggleFaqModalVisible"
              >
                <a-icon type="question" />
              </app-button> -->
            </div>
          </card>
        </a-col>

        <a-col :lg="{ span: 12 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card max-height" big-padding>
            <div class="max-height-container">
              <img
                v-if="style.headerImage"
                :src="style.headerImage"
                class="mb-20"
                alt="image"
              />
              <div class="page-interview-info-card-text">
                <div v-html="interview.description"></div>
              </div>
            </div>
          </card>
        </a-col>
      </a-row>

      <interview-faq-modal
        :visible="faqModalVisible"
        @close="toggleFaqModalVisible"
      />
    </template>
  </app-page>
</template>

<script>
import { mapMutations } from 'vuex';
import { BASE_PATH_URL } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import Card from '../components/Card.vue';
import AppButton from '../components/AppButton.vue';
import InterviewFaqModal from '../components/InterviewFaqModal.vue';

import IconBlank from '../components/icons/Blank.vue';
import IconPoint from '../components/icons/Point.vue';
import IconWallet from '../components/icons/Wallet.vue';
import IconUserDefaultAvatar from '../components/icons/UserDefaultAvatar.vue';

export default {
  name: 'Interview',

  components: {
    AppPage,
    PageTitle,
    Card,
    AppButton,
    InterviewFaqModal,
    IconBlank,
    IconPoint,
    IconWallet,
    IconUserDefaultAvatar
  },

  data() {
    return {
      BASE_PATH_URL,
      pageLoading: false,
      faqModalVisible: false,
      agree: false
    };
  },

  metaInfo() {
    return {
      title: this.interview.name,
      meta: [
        { vmid: 'description', name: 'description', content: '' },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: this.interview.name
        },
        { vmid: 'og:description', property: 'og:description', content: '' },
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content:
            this.interview.company && this.interview.company.website
              ? this.interview.company.website
              : BASE_PATH_URL[this.$i18n.locale]
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content:
            this.interview.company && this.interview.company.logo
              ? this.interview.company.logo
              : ''
        }
      ]
    };
  },

  computed: {
    interview() {
      return this.$store.state.interview.info;
    },

    style() {
      const { style } = this.interview;

      return style;
    }
  },

  async created() {
    if (!this.interview.id) {
      await this.getInterviewInfo();
    }
  },

  methods: {
    toggleFaqModalVisible() {
      this.faqModalVisible = !this.faqModalVisible;
    },

    onChangeAgree(e) {
      this.agree = e.target.checked;
    },

    getStarted() {
      if (this.agree) {
        const {
          params: { hash }
        } = this.$route;

        // const isSafari = !!navigator.userAgent.match(
        //   /Version\/[\d\.]+.*Safari/ // eslint-disable-line
        // );

        const isSafari =
          /Safari/i.test(navigator.userAgent) &&
          /Apple Computer/.test(navigator.vendor) &&
          !/Mobi|Android/i.test(navigator.userAgent);

        if (isSafari) {
          this.$router.push(`/i/unsupported/${hash}`);
        } else {
          this.$router.push(`/i/process/${hash}`);
        }
      } else {
        this.$notification.warning({
          message: this.$t('notify.warning'),
          description: this.$t('notify.please_agree_to_the_privacy_policy'),
          icon: () => <icon-error class="warning-icon" />
        });
      }
    },

    async getInterviewInfo() {
      try {
        const {
          params: { hash }
        } = this.$route;

        this.pageLoading = true;
        const res = await apiRequest(`interview/${hash}`, 'GET', null);
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
          this.$router.replace('/404');
        } else {
          const {
            data: { job, response: user }
          } = response;

          if (job.limit) {
            this.$router.replace('/i/result/error');
          }

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
.page-interview {
  display: flex;
  align-items: center;

  .ant-spin-nested-loading {
    width: 100%;
  }

  .app-page-inner {
    padding: 50px 0;
  }

  .app-page-header {
    display: none;
  }
}

.page-interview-navbar {
  padding: 25px 0;
  margin-bottom: 50px;
  text-align: center;

  .logo {
    opacity: 0.25;
    transition: 0.1s;

    &:hover {
      opacity: 1;
    }
  }
}

.page-interview-header {
  text-align: center;
}

.page-interview-top-title {
  margin-bottom: 5px;
  font-weight: 400;
}

.page-interview-title {
  margin-bottom: 20px;
}

.page-interview-header-devider {
  max-width: 500px;
  margin: 0 auto 30px;
}

.page-interview-company {
  display: flex;
  align-items: center;
}

.page-interview-company-logo {
  margin-right: 15px;
  box-shadow: 0 20px 20px -6px rgba(219, 220, 234, 0.8);
}

.page-interview-company-info {
  // margin-right: 15px;
}

.page-interview-company-link {
  display: inline-block;
  font-size: 16px;
  color: $orange;
  font-weight: 600;

  &:hover {
    color: lighten($orange, 5%);
    text-decoration: underline;
  }

  svg {
    margin-left: 5px;
    margin-bottom: -3px;
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
}

.page-interview-meta {
  display: flex;
  align-items: center;

  .info-item {
    &:not(:last-of-type) {
      margin-right: 40px;
    }
  }

  .info-item-icon {
    width: 22px;
    height: 22px;
    margin-right: 10px;
    fill: #000000;
    margin-bottom: -2px;
    // fill: $orange;
  }

  .info-item-label {
    font-weight: 600;
    font-size: 16px;
    color: $black;
  }
}

.page-interview-info-card {
  color: $gray-300;
  font-size: 16px;
  line-height: 1.41;

  &.max-height {
    height: 430px;
    overflow: auto;

    .max-height-container {
      padding-bottom: 20px;
    }
  }

  h3 {
    font-weight: 600;
    color: $black;
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    margin: 0 0 20px 0;
    padding: 0;

    li {
      + li {
        margin-top: 20px;
      }
    }
  }
}

.page-interview-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.page-interview-action-faq {
  color: $white;
  background-color: $grayish-blue-400;
}

.page-interview-template-block,
.page-interview-template-standard {
  .page-interview-info-card {
    text-align: center;
  }

  .page-interview-company {
    flex-direction: column;
    text-align: center;
  }

  .page-interview-company-logo {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .page-interview-title {
    text-align: center;
  }

  .page-interview-meta {
    justify-content: center;
  }

  .page-interview-start-btn {
    max-width: 350px;
    width: 100%;
    margin: auto;
    margin-left: auto;
  }
}

.page-interview-info-card-text {
  text-align: left !important;
}

.privacy-checkbox {
  font-size: 14px;

  .ant-checkbox-inner {
    width: 22px;
    height: 22px;
  }
}
</style>
