<template>
  <app-page class="page-profile-edit">
    <template slot="header">
      <a-breadcrumb class="mb-5" separator=">">
        <a-breadcrumb-item>
          <router-link to="/profile">
            {{ $t('breadcrumbs.profile') }}
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('breadcrumbs.edit_profile') }}
        </a-breadcrumb-item>
      </a-breadcrumb>

      <!-- <page-title>
        {{ $t('page_edit_profile.title') }}
      </page-title> -->
    </template>

    <a-row :gutter="{ lg: 20, md: 10, sm: 10, xs: 10 }">
      <a-col :span="24">
        <card>
          <a-form>
            <a-row :gutter="20">
              <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <a-form-item
                  has-feedback
                  :label="data.name.value && $t('placeholders.name')"
                  :validate-status="data.name.status"
                >
                  <a-input
                    v-model="data.name.value"
                    type="text"
                    :placeholder="$t('placeholders.name')"
                  />
                </a-form-item>
              </a-col>

              <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <a-form-item has-feedback :validate-status="data.email.status">
                  <a-input
                    v-model="data.email.value"
                    type="email"
                    :placeholder="$t('placeholders.email')"
                    disabled
                  />
                </a-form-item>
              </a-col>

              <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <a-form-item>
                  <upload
                    :placeholder="data.avatarPreview"
                    accept="image/*"
                    @change="onChangeAvatar"
                  />
                </a-form-item>
              </a-col>

              <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <a-form-item
                  has-feedback
                  :label="data.phone.value && $t('placeholders.phone')"
                  :validate-status="data.phone.status"
                >
                  <a-input
                    v-model="data.phone.value"
                    type="phone"
                    :placeholder="$t('placeholders.phone')"
                  />
                </a-form-item>
              </a-col>

              <!-- <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <a-form-item>
                  <a-checkbox
                    :checked="data.isOwner"
                    @change="onChangeIsAgency"
                  >
                    {{ $t('page_edit_profile.owner_agency') }}
                  </a-checkbox>
                </a-form-item>

                <a-form-item
                  v-if="data.isOwner"
                  has-feedback
                  :validate-status="data.agencyName.status"
                >
                  <a-input
                    v-model="data.agencyName.value"
                    type="text"
                    :placeholder="$t('placeholders.agency_name')"
                  />
                </a-form-item>
              </a-col> -->

              <a-col :span="24" class="mt-40">
                <a-form-item>
                  <app-button
                    type="primary"
                    size="large"
                    :loading="isUploadForm"
                    @click="handleSubmit"
                  >
                    {{ $t('save') }}
                  </app-button>

                  <router-link to="/profile">
                    <app-button size="large" class="ml-10">
                      {{ $t('cancel') }}
                    </app-button>
                  </router-link>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </card>
      </a-col>
    </a-row>
  </app-page>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest.js';

import AppPage from '../components/AppPage.vue';
import Card from '../components/Card.vue';
// import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Upload from '../components/Upload.vue';

export default {
  name: 'ProfileEdit',

  components: {
    AppPage,
    Card,
    // PageTitle,
    AppButton,
    Upload
  },

  data() {
    return {
      isUploadForm: false,

      data: {
        name: { value: '', status: '' },
        avatar: null,
        avatarPreview: '',
        email: { value: '', status: '' },
        phone: { value: '', status: '' },
        isOwner: false,
        agencyName: { value: '', status: '' }
      }
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.$t('page_edit_profile.title')}`
    };
  },

  watch: {
    user() {
      this.setUserData();
    }
  },

  computed: {
    user() {
      return this.$store.state.user.info;
    }
  },

  created() {
    const { user } = this;

    if (user.id) {
      this.setUserData();
    }
  },

  methods: {
    onChangeIsAgency(e) {
      const { checked } = e.target;

      this.data.isOwner = checked;
    },

    onChangeAvatar(file) {
      this.data.avatar = file;
    },

    setUserData() {
      const {
        data: { name, email, phone, agencyName },
        user
      } = this;

      name.value = user.name;
      email.value = user.email;
      phone.value = user.phone;
      agencyName.value = user.agency.name;
      this.data.avatarPreview = user.avatar;
      this.data.isOwner = !!user.recruitingOwner;
    },

    checkForm() {
      let valid = true;
      const {
        data: { isOwner, agencyName }
      } = this;

      agencyName.status = '';

      if (isOwner && !agencyName.value) {
        agencyName.status = 'error';
        valid = false;
      }

      return valid;
    },

    async handleSubmit() {
      const valid = this.checkForm();

      if (valid) {
        try {
          const {
            data: { name, email, phone, avatar, isOwner, agencyName }
          } = this;

          const body = new FormData();

          body.append('name', name.value);
          body.append('email', email.value);
          body.append('phone', phone.value);

          if (avatar) {
            body.append('avatar', avatar);
          }

          if (isOwner) {
            body.append('recruiting_owner', 1);
            body.append('agency_name', agencyName.value);
          } else {
            body.append('recruiting_owner', 0);
          }

          this.isUploadForm = true;
          const res = await apiRequest('user/settings', 'POST', body, true);
          this.isUploadForm = false;

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
            this.$store.dispatch('user/getUser');
          }
        } catch (error) {
          console.log('handleSubmit:', error);
          this.isUploadForm = false;
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
