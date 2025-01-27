<template>
  <app-page :class="['interview-live', { 'user-signin': user && user.id }]">
    <template v-if="userLoged">
      <a-row :gutter="20">
        <a-col v-if="user && user.id" :span="24">
          <card class="interview-live-video-card">
            <video-chat ref="videoChat" v-bind="videoChatOptions" />
          </card>
        </a-col>

        <a-col
          v-else
          :md="{ span: 16, offset: 4 }"
          :xs="{ span: 24, offset: 0 }"
        >
          <card class="interview-live-video-card">
            <video-chat ref="videoChat" v-bind="videoChatOptions" />
          </card>
        </a-col>
      </a-row>
    </template>

    <a-modal
      class="interview-live-modal"
      centered
      :footer="null"
      :mask="false"
      :closable="false"
      :visible="interviewLiveModalVisible"
    >
      <a-spin :spinning="infoLoading">
        <template v-if="roomInfo">
          <div class="interview-live-modal-header">
            <page-title tag="div" size="18">
              {{ roomInfo.interviewName }}
            </page-title>

            <page-title tag="div" size="12">
              {{ roomInfo.companyName }}
            </page-title>
          </div>

          <div class="interview-live-modal-body mt-20">
            <a-form>
              <a-form-item
                :label="`${$t('your_name')} * :`"
                has-feedback
                :validate-status="userData.name.status"
              >
                <a-input
                  v-model="userData.name.value"
                  :placeholder="$t('type_your_name')"
                />
              </a-form-item>

              <a-form-item>
                <a-checkbox
                  class="custome-main-color mt-20"
                  :checked="userData.agree"
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
              </a-form-item>

              <a-form-item>
                <app-button
                  type="primary"
                  size="large"
                  class="page-interview-start-btn hover-light"
                  @click="getStarted"
                >
                  {{ $t('connect') }}
                </app-button>
              </a-form-item>
            </a-form>
          </div>
        </template>
      </a-spin>
    </a-modal>
  </app-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { BASE_PATH_URL } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';
import VideoChat from '../components/VideoChat.vue';

export default {
  name: 'InterviewLive',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    VideoChat
  },

  data() {
    return {
      BASE_PATH_URL,
      infoLoading: false,
      interviewLiveModalVisible: true,
      userLoged: false,
      roomInfo: null,
      userData: {
        agree: false,
        name: { value: '', status: '' }
      }
    };
  },

  watch: {
    user() {
      this.userData.name.value = this.user.name;
    }
  },

  computed: {
    hash() {
      return this.$route.params.hash;
    },

    videoChatOptions() {
      return {
        roomId: this.hash,
        socketURL: this.videChatServerUrl,
        userName: this.userData.name.value,
        canModifyRoom: !!this.user
      };
    },

    ...mapState({
      videChatServerUrl: (state) =>
        state.app.videChatServerUrl || 'https://reallang.chat/',
      user: ({ user }) => user.info
    })
  },

  async created() {
    this.infoLoading = true;
    await this.getInterviewInfo();
    this.infoLoading = false;

    if (this.user.id) {
      this.userData.name.value = this.user.name;
    }
  },

  methods: {
    onChangeAgree(e) {
      this.userData.agree = e.target.checked;
    },

    checkForm() {
      let valid = true;

      const {
        userData: { agree, name }
      } = this;

      if (!agree) {
        valid = false;
        this.$notification.warning({
          message: this.$t('notify.warning'),
          description: this.$t('notify.please_agree_to_the_privacy_policy'),
          icon: () => <icon-error class="warning-icon" />
        });
      }

      if (!name.value) {
        valid = false;
        name.status = 'error';
      }

      return valid;
    },

    getStarted() {
      const valid = this.checkForm();

      if (valid) {
        this.interviewLiveModalVisible = false;
        this.userLoged = true;

        this.$nextTick(() => {
          this.$refs.videoChat.handleJoin();
        });
      }
    },

    async getInterviewInfo() {
      try {
        const {
          params: { hash }
        } = this.$route;

        this.pageLoading = true;
        const res = await apiRequest(`room/${hash}`, 'GET', null);
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
            data: { company_name, name }
          } = response;

          this.roomInfo = { companyName: company_name, interviewName: name };

          this.SET_APP_LOADING();
        }
      } catch (error) {
        console.log('getInterviewInfo:', error);
      }
    },

    ...mapMutations({
      SET_APP_LOADING: 'app/SET_APP_LOADING'
    })
  }
};
</script>

<style lang="scss">
.interview-live {
  &.user-signin {
    //   .app-page-header {
    //     display: block;
    //   }

    .app-page-inner {
      padding: 20px 0 0;
    }

    .video-chat {
      min-height: calc(100vh - 110px);
    }
  }

  .app-page-header {
    display: none;
  }
}

.interview-live-modal {
  .ant-form-item {
    text-align: center;
  }

  .ant-form-item-label {
    font-weight: 400;

    label {
      font-size: 18px;
    }
  }
}

.interview-live-modal-header {
  display: flex;
  flex-direction: column;
  text-align: center;
  text-align: center;

  .page-title {
    font-weight: 400;
  }
}

.interview-live-video-card {
  background-color: transparent;

  .card-inner {
    padding: 0;
  }
}
</style>
