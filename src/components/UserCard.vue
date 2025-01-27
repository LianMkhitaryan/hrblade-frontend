<template>
  <card big-padding class="user-card">
    <div class="user-card-avatar">
      <a-avatar shape="square" :size="162" :src="info.avatar">
        <icon-user-default-avatar></icon-user-default-avatar>
      </a-avatar>
    </div>

    <div class="user-card-info">
      <list class="user-card-list mb-20">
        <list-item-info :label="`${$t('email')}:`" :value="info.email" />
        <list-item-info :label="`${$t('phone')}:`" :value="info.phone || '-'" />
      </list>

      <div>
        <router-link to="/profile/edit" class="mr-10 mt-10">
          <app-button size="large">
            {{ $t('page_edit_profile.title') }}
          </app-button>
        </router-link>

        <a-popconfirm
          :title="`${$t('are_you_sure')}?`"
          class="user-card-change-password"
          @confirm="handleChangePassword"
        >
          <app-button size="large" class="mr-10 mt-10">
            {{ $t('change_password') }}
          </app-button>
        </a-popconfirm>

        <a-popconfirm
          :title="`${$t('notify.generate_new_token_notify')}`"
          class="user-card-change-password"
          @confirm="handleGenerateToken"
        >
          <app-button
            size="large"
            class="mt-10"
            :loading="tokenGenerationLoading"
          >
            {{ $t('get_api_token') }}
          </app-button>
        </a-popconfirm>
      </div>
    </div>

    <a-modal
      centered
      :visible="tokenModalVisible"
      :footer="null"
      :closable="false"
      @cancel="onCloseTokenModal"
    >
      <page-title tag="h2" size="16">
        {{ $t('api_key') }}
      </page-title>

      <div class="d-flex">
        <a-input
          ref="apiKey"
          class="mr-10 copy"
          size="large"
          readonly
          :value="token"
          @click="handleCopyApiKey"
        />

        <app-button type="primary" size="large" @click="handleCopyApiKey">
          {{ $t('copy') }}
        </app-button>
      </div>
    </a-modal>

    <!-- <a-modal
      v-model="isChangePassword"
      class="change-password-modal"
      centered
      destroyOnClose
      :closable="false"
      @cancel="handelCloseChangePasswordModal"
    >
      <a-form>
        <a-form-item
          has-feedback
          class="mb-0-i"
          :validate-status="data.email.status"
        >
          <a-input
            v-model="data.email.value"
            :placeholder="$t('placeholders.email')"
          />
        </a-form-item>
      </a-form>

      <template slot="footer">
        <app-button
          type="primary"
          :loading="isChangePasswordLoading"
          @click="handleChangePassword"
        >
          {{ $t('save') }}
        </app-button>

        <app-button
          type="primary"
          ghost
          @click="handelCloseChangePasswordModal"
        >
          {{ $t('close') }}
        </app-button>
      </template>
    </a-modal> -->
  </card>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest.js';
import removeTokenFromLocalStorage from '../js/helpers/removeTokenFromLocalStorage.js';

import Card from './Card.vue';
import PageTitle from './PageTitle.vue';
import List from './List.vue';
import ListItemInfo from './ListItemInfo.vue';
import AppButton from './AppButton.vue';

import IconUserDefaultAvatar from './icons/UserDefaultAvatar.vue';

export default {
  name: 'UserCard',

  components: {
    Card,
    PageTitle,
    List,
    ListItemInfo,
    AppButton,
    IconUserDefaultAvatar
  },

  props: {
    info: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isChangePassword: false,
      isChangePasswordLoading: false,
      tokenGenerationLoading: false,
      tokenModalVisible: false,
      token: ''
      // data: {
      //   email: { value: '', status: '' }
      // }
    };
  },

  computed: {
    userEmail() {
      return this.$store.state.user.info.email;
    }
  },

  methods: {
    // handleOpenChangePasswordModal() {
    //   this.isChangePassword = true;
    // },

    // handelCloseChangePasswordModal() {
    //   this.data.email.value = '';
    //   this.data.email.status = '';
    //   this.isChangePassword = false;
    // },

    // checkForm() {
    //   let valid = true;

    //   const {
    //     data: { email }
    //   } = this;

    //   email.status = '';

    //   if (!email.value) {
    //     email.status = 'error';
    //     valid = false;
    //   }

    //   return valid;
    // },

    onCloseTokenModal() {
      this.token = '';
      this.tokenModalVisible = false;
    },

    handleCopyApiKey() {
      this.$refs.apiKey.$el.select();
      this.$refs.apiKey.$el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.getSelection().removeAllRanges();

      this.$notification.success({
        message: this.$t('notify.success'),
        description: this.$t('notify.token_added_to_clipboard'),
        icon: () => <icon-success class="success-icon" />
      });
    },

    async handleGenerateToken() {
      try {
        this.tokenGenerationLoading = true;
        const res = await apiRequest('create/token', 'POST', null, true);
        this.tokenGenerationLoading = false;

        const { error } = res;

        if (!error) {
          const { data } = res.response;

          this.token = data;
          this.tokenModalVisible = true;
        }
      } catch (error) {
        console.log('handleGenerateToken:', error);
        this.tokenGenerationLoading = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async handleChangePassword() {
      try {
        const { userEmail } = this;
        const body = new FormData();

        body.append('email', userEmail);

        this.isChangePasswordLoading = true;
        const res = await apiRequest('forgot', 'POST', body);
        this.isChangePasswordLoading = false;

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
          // this.handelCloseChangePasswordModal();
          removeTokenFromLocalStorage();
          this.$router.go('/login');
        }
      } catch (error) {
        console.log('handleChangePassword:', error);
        this.isChangePasswordLoading = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    }
  }
};
</script>

<style lang="scss">
.user-card {
  .card-inner {
    flex-direction: row;

    @media (max-width: $sm) {
      flex-direction: column;
    }
  }
}

.user-card-avatar {
  margin-right: 20px;

  .ant-avatar {
    @media (max-width: $sm) {
      width: 95px !important;
      height: 95px !important;
      line-height: 95px !important;
      font-size: 47.5px !important;
    }
  }
}

.user-card-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: $sm) {
    margin-top: 20px;
  }
}

// .user-card-list {
// @media (max-width: $sm) {
//   margin-bottom: 30px;
// }
// }

.user-card-change-password {
  @media (max-width: $sm) {
    margin-top: 10px;
  }
}
</style>
