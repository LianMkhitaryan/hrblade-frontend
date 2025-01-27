<template>
  <app-page :class="[
    'page-interview',
    `page-interview-template-${style ? style.template.toLowerCase() : ''}`
  ]" :loading="pageLoading">
    <template v-if="interview.id && style && style.template === 'BASIC_NEW'">
      <div class="page-interview-header" style="text-align: left;">
        <a-row :gutter="{ lg: 20, sm: 10, xs: 10 }">
          <a-col :span="12">
            <a-row :gutter="[0, 20]">
              <a-col :span="24">
                <a-avatar :size="85" :src="interview.company.logo">
                  <icon-user-default-avatar />
                </a-avatar>
              </a-col>

              <a-col :span="24">
                <a-row :gutter="[0, 10]">
                  <a-col :span="24">
                    <span>{{ interview.company.name }}</span>
                  </a-col>

                  <a-col :span="24">
                    <PageTitle tag="h2" size="25" style="margin-bottom: 0px;">
                      {{ interview.name }}
                    </PageTitle>
                  </a-col>

                  <a-col v-if="interview.location || interview.salary" :span="24">
                    <span>
                      {{
                        `${interview.location} ${interview.salary ? `/ ${interview.salary}` : ''
                          }`
                      }}
                    </span>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-col>

          <!-- <a-col :span="12">
            <div class="page-interview-header-video">
              <VideoPlayer :src="interview.previewVideo" isAutoplay />
            </div>
          </a-col> -->
        </a-row>
      </div>

      <div class="page-interview-content">
        <a-row :gutter="[0, 20]">
          <a-col :span="24">
            <div class="page-interview-content-img">
              <img v-if="style.headerImage" :src="style.headerImage" alt="image" />
            </div>
          </a-col>

          <a-col v-if="isIntBlocked" :span="24">
            <div class="blocked-info">
              <h2>The interview with this link is blocked</h2>
              <p>
                Please contact {{ interview.company.name }} to get an updated
                invite link
              </p>
            </div>
          </a-col>

          <a-col v-else :span="24" v-html="interview.description"></a-col>
        </a-row>
      </div>

      <div v-if="!isIntBlocked" class="page-interview-footer">
        <a-row type="flex" align="middle" :gutter="[20, 20]">
          <a-col :sm="{ order: 0, span: 6 }" :xs="{ order: 1, span: 24 }">
            <app-button type="primary" size="large" block class="page-interview-start-btn hover-light" :style="{
                backgroundColor: style.btnColor,
                borderColor: style.btnColor
              }" @click="getStarted">
              {{ $t('get_started') }}
            </app-button>
          </a-col>

          <a-col :sm="{ order: 1, span: 18 }" :xs="{ order: 0, span: 24 }">
            <a-checkbox class="privacy-checkbox custome-main-color mt-auto"
              :style="{ '--checkbox-main-color': style.btnColor }" @change="onChangeAgree">
              {{ $t('i_agree_to_the') }}
              <a :href="`${BASE_PATH_URL[$i18n.locale]}privacy${$i18n.locale === 'ru' ? '#ru' : ''
                }`
                " target="_blank" class="text-decoration-underline">
                {{ $t('footer.links.privacy_policy_s') }}
              </a>
              {{ $t('and_the') }}
              <a :href="`${BASE_PATH_URL[$i18n.locale]}terms${$i18n.locale === 'ru' ? '#ru' : ''
                }`
                " target="_blank" class="text-decoration-underline">
                {{ $t('footer.links.terms_and_conditions_s') }}
              </a>
            </a-checkbox>
          </a-col>
        </a-row>
      </div>
    </template>

    <template v-else-if="interview.id && style && style.template === 'ALTERNATIVE'">
      <a-row type="flex" :gutter="[20, 20]" class="mt-auto">
        <a-col :lg="{ offset: 5, span: 14 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card" big-padding>
            <div class="page-interview-company">
              <a-avatar class="page-interview-company-logo" shape="square" :size="85" :src="interview.company.logo">
                <icon-user-default-avatar />
              </a-avatar>

              <div class="page-interview-company-info">
                <page-title tag="div" size="20">
                  <a v-if="interview.company.website" :href="interview.company.website" target="_blank"
                    :style="{ color: style.btnColor }" class="page-interview-company-link hover-light">
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
                <img v-if="style.headerImage" :src="style.headerImage" class="mb-20" alt="image" />

                <div v-if="isIntBlocked" class="page-interview-info-card-text">
                  <div class="blocked-info">
                    <h2>The interview with this link is blocked</h2>
                    <p>
                      Please contact {{ interview.company.name }} to get an
                      updated invite link
                    </p>
                  </div>
                </div>

                <div v-else class="page-interview-info-card-text">
                  <div v-html="interview.description"></div>
                </div>
              </div>
            </card>

            <template v-if="!isIntBlocked">
              <a-checkbox class="privacy-checkbox custome-main-color mt-20"
                :style="{ '--checkbox-main-color': style.btnColor }" @change="onChangeAgree">
                {{ $t('i_agree_to_the') }}
                <a :href="`${BASE_PATH_URL[$i18n.locale]}privacy${$i18n.locale === 'ru' ? '#ru' : ''
                  }`
                  " target="_blank" class="text-decoration-underline">
                  {{ $t('footer.links.privacy_policy_s') }}
                </a>
                {{ $t('and_the') }}
                <a :href="`${BASE_PATH_URL[$i18n.locale]}terms${$i18n.locale === 'ru' ? '#ru' : ''
                  }`
                  " target="_blank" class="text-decoration-underline">
                  {{ $t('footer.links.terms_and_conditions_s') }}
                </a>
              </a-checkbox>

              <div class="d-flex mt-20">
                <app-button type="primary" size="large" class="page-interview-start-btn hover-light" :style="{
                  backgroundColor: style.btnColor,
                  borderColor: style.btnColor
                }" @click="getStarted">
                  {{ $t('get_started') }}
                </app-button>
              </div>
            </template>
          </card>
        </a-col>
      </a-row>
    </template>

    <template v-if="interview.id && style && style.template === 'BASIC'">
      <a-row type="flex" :gutter="[20, 20]" class="mt-auto">
        <a-col :lg="{ offset: 5, span: 14 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card" big-padding>
            <div class="page-interview-company">
              <a-avatar class="page-interview-company-logo" shape="square" :size="85" :src="interview.company.logo">
                <icon-user-default-avatar />
              </a-avatar>

              <div class="page-interview-company-info">
                <page-title tag="div" size="20">
                  <a v-if="interview.company.website" :href="interview.company.website" target="_blank"
                    :style="{ color: style.btnColor }" class="page-interview-company-link hover-light">
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

            <template v-if="!isIntBlocked">
              <a-divider />

              <a-checkbox class="privacy-checkbox custome-main-color mt-auto"
                :style="{ '--checkbox-main-color': style.btnColor }" @change="onChangeAgree">
                {{ $t('i_agree_to_the') }}
                <a :href="`${BASE_PATH_URL[$i18n.locale]}privacy${$i18n.locale === 'ru' ? '#ru' : ''
                  }`
                  " target="_blank" class="text-decoration-underline">
                  {{ $t('footer.links.privacy_policy_s') }}
                </a>
                {{ $t('and_the') }}
                <a :href="`${BASE_PATH_URL[$i18n.locale]}terms${$i18n.locale === 'ru' ? '#ru' : ''
                  }`
                  " target="_blank" class="text-decoration-underline">
                  {{ $t('footer.links.terms_and_conditions_s') }}
                </a>
              </a-checkbox>

              <div class="d-flex mt-20">
                <app-button type="primary" size="large" class="page-interview-start-btn hover-light" :style="{
                  backgroundColor: style.btnColor,
                  borderColor: style.btnColor
                }" @click="getStarted">
                  {{ $t('get_started') }}
                </app-button>
              </div>
            </template>
          </card>
        </a-col>

        <a-col :lg="{ offset: 5, span: 14 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card" big-padding>
            <div class="max-height-container">
              <img v-if="style.headerImage" :src="style.headerImage" class="mb-20" alt="image" />

              <div v-if="isIntBlocked" class="page-interview-info-card-text">
                <div class="blocked-info">
                  <h2>The interview with this link is blocked</h2>
                  <p>
                    Please contact {{ interview.company.name }} to get an
                    updated invite link
                  </p>
                </div>
              </div>

              <div v-else class="page-interview-info-card-text">
                <div v-html="interview.description"></div>
              </div>
            </div>
          </card>
        </a-col>
      </a-row>
    </template>

    <template v-else-if="interview.id &&
      ((style && style.template === 'LEFT_TO_RIGHT') || !style.template)
      ">
      <a-row type="flex" :gutter="[20, 20]" class="mt-auto">
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

            <div class="page-interview-company" style="align-items: flex-start;">
              <a-avatar class="page-interview-company-logo" shape="square" :size="85" :src="interview.company.logo">
                <icon-user-default-avatar />
              </a-avatar>

              <div class="page-interview-company-info">
                <page-title tag="div" size="20">
                  <a v-if="interview.company.website" :href="interview.company.website" target="_blank"
                    :style="{ color: style.btnColor }" class="page-interview-company-link hover-light">
                    <span>{{ interview.company.name }}</span>
                    <icon-blank />
                  </a>
                </page-title>
              </div>
            </div>

            <template v-if="!isIntBlocked">
              <a-divider />

              <a-checkbox class="privacy-checkbox custome-main-color mt-auto"
                :style="{ '--checkbox-main-color': style.btnColor }" @change="onChangeAgree">
                {{ $t('i_agree_to_the') }}
                <a :href="`${BASE_PATH_URL[$i18n.locale]}privacy${$i18n.locale === 'ru' ? '#ru' : ''
                  }`
                  " target="_blank" class="text-decoration-underline">
                  {{ $t('footer.links.privacy_policy_s') }}
                </a>
                {{ $t('and_the') }}
                <a :href="`${BASE_PATH_URL[$i18n.locale]}terms${$i18n.locale === 'ru' ? '#ru' : ''
                  }`
                  " target="_blank" class="text-decoration-underline">
                  {{ $t('footer.links.terms_and_conditions_s') }}
                </a>
              </a-checkbox>

              <div class="d-flex mt-20">
                <app-button type="primary" size="large" class="w-100 hover-light" :style="{
                  backgroundColor: style.btnColor,
                  borderColor: style.btnColor
                }" @click="getStarted">
                  {{ $t('get_started') }}
                </app-button>
              </div>
            </template>
          </card>
        </a-col>

        <a-col :lg="{ span: 12 }" :xs="{ span: 24 }">
          <card class="page-interview-info-card max-height" big-padding>
            <div class="max-height-container">
              <img v-if="style.headerImage" :src="style.headerImage" class="mb-20" alt="image" />

              <div v-if="isIntBlocked" class="page-interview-info-card-text">
                <div class="blocked-info">
                  <h2>The interview with this link is blocked</h2>
                  <p>
                    Please contact {{ interview.company.name }} to get an
                    updated invite link
                  </p>
                </div>
              </div>

              <div v-else class="page-interview-info-card-text">
                <div v-html="interview.description"></div>
              </div>
            </div>
          </card>
        </a-col>
      </a-row>
    </template>
  </app-page>
</template>

<script>
import { mapMutations } from 'vuex';
import { BASE_PATH_URL } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

import AppPage from '../components/AppPage.vue';
import Card from '../components/Card.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
// import VideoPlayer from '../components/VideoPlayer.vue';

import IconUserDefaultAvatar from '../components/icons/UserDefaultAvatar.vue';
import IconBlank from '../components/icons/Blank.vue';
import IconPoint from '../components/icons/Point.vue';
import IconWallet from '../components/icons/Wallet.vue';

export default {
  name: 'Interview',

  components: {
    AppPage,
    PageTitle,
    Card,
    AppButton,
    // VideoPlayer,
    IconUserDefaultAvatar,
    IconBlank,
    IconPoint,
    IconWallet
  },

  data() {
    return {
      BASE_PATH_URL,
      pageLoading: false,
      faqModalVisible: false,
      agree: false,
      isIntBlocked: false
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
    onChangeAgree(e) {
      this.agree = e.target.checked;
    },

    getStarted() {
      if (!this.agree) {
        return this.$notification.warning({
          message: this.$t('notify.warning'),
          description: this.$t('notify.please_agree_to_the_privacy_policy'),
          icon: () => <icon-error class="warning-icon" />
        });
      }

      const {
        params: { hash }
      } = this.$route;

      const isSafari =
        /Safari/i.test(navigator.userAgent) &&
        /Apple Computer/.test(navigator.vendor) &&
        !/Mobi|Android/i.test(navigator.userAgent);

      if (isSafari) {
        this.$router.push(`/i/unsupported/${hash}`);
      } else {
        window.scrollTo(0, 0);
        this.$router.push(`/i/process/${hash}`);
      }
    },

    async getInterviewInfo() {
      try {
        const {
          params: { hash }
        } = this.$route;

        this.pageLoading = true;
        const res = await apiRequest(
          `interview/${hash}?random_now=1`,
          'GET',
          null
        );
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
            data: { blocked, job, response: user }
          } = response;

          if (job.limit) {
            this.$router.replace('/i/result/error');
          }

          this.SET_INTERVIEW_INFO(parseJobs(job, true));

          if (user) {
            this.SET_INTERVIEW_USER_INFO({
              id: user.id,
              email: user.email,
              phone: user.phone,
              name: user.full || ''
            });
          }

          this.isIntBlocked = !!blocked;

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
// .page-interview {
//   .ant-spin-nested-loading {
//     width: 100%;
//   }

//   .app-page-inner {
//     padding: 50px 0;
//   }

//   .app-page-header {
//     display: none;
//   }
// }

.page-interview {
  display: flex;
  align-items: center;
  background-color: #ffffff;

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

.page-interview-content {
  position: relative;
  margin-top: 60px;
  padding: 50px 0;

  @media (max-width: $sm) {
    margin-top: 30px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100vw;
    width: 500vw;
    height: 100%;
    background-color: rgba(#e2e1e9, 0.25);
  }
}

.page-interview-content-img {
  width: 100%;

  img {
    width: 100%;
    height: 350px;
    object-fit: cover;
    object-position: center;
  }
}

.page-interview-footer {
  margin-top: 60px;

  @media (max-width: $sm) {
    margin-top: 30px;
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
      +li {
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

.page-interview-header-video {
  display: flex;
  justify-content: flex-end;

  .plyr {
    width: 215px;
    height: 215px;
    max-width: 215px;
    min-width: 215px;
    border-radius: 50%;

    video {
      width: 100%;
      height: 100%;
    }
  }

  .plyr__controls {
    display: none;
  }
}

.blocked-info {
  h2 {
    font-size: 30px;
    font-weight: bold;

    @media (max-width: $sm) {
      font-size: 24px;
    }
  }

  p {
    font-size: 18px;

    @media (max-width: $sm) {
      font-size: 16px;
    }
  }
}
</style>
