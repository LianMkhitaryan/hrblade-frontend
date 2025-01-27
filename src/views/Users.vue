<template>
  <app-page class="page-users">
    <template slot="header">
      <a-row
        :gutter="[
          { lg: 20, xs: 10 },
          { lg: 20, xs: 10 }
        ]"
      >
        <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
          <page-title class="mb-10">
            {{ $t('page_users.title') }}
          </page-title>

          <div class="limit-info">
            <div class="limit-info-label">
              {{ `${$t('users_2')}: ${users.length}/${userPlan.usersLimit}` }}
            </div>

            <router-link
              v-if="users.length >= userPlan.usersLimit"
              to="/profile"
              class="limit-info-link"
            >
              <b>
                {{ $t('upgrade') }}
              </b>
            </router-link>
          </div>
        </a-col>

        <a-col :md="{ span: 12 }" :xs="{ span: 24 }" class="text-right-md">
          <app-button
            type="primary"
            size="large"
            @click="handleOpenInviteModal"
          >
            {{ $t('invite') }}
          </app-button>
        </a-col>
      </a-row>
    </template>

    <a-row
      :gutter="[
        { lg: 20, xs: 10 },
        { sm: 10, xs: 10 }
      ]"
    >
      <a-col v-for="user in users" :key="user.id" :span="24">
        <card big-padding>
          <a-spin :spinning="user.id === deleateLoadingUserId">
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size: 24px"
              spin
            />

            <a-row
              type="flex"
              class="align-items-center"
              :gutter="[20, { xs: 10 }]"
            >
              <a-col :md="{ span: 6 }" :sm="{ span: 9 }" :xs="{ span: 24 }">
                <div class="d-flex align-items-center">
                  <a-avatar :size="60">
                    <icon-user-default-avatar></icon-user-default-avatar>
                  </a-avatar>

                  <div class="ml-10">
                    <page-title tag="h3" size="16" class="mb-0-i">
                      {{ user.name }}
                    </page-title>

                    <div class="info-item mt-5">
                      <span class="info-item-label">
                        {{ user.role }}
                      </span>
                    </div>
                  </div>
                </div>
              </a-col>

              <a-col
                :lg="{ span: 12 }"
                :md="{ span: 14 }"
                :sm="{ span: 9 }"
                :xs="{ span: 24 }"
              >
                <a-row :gutter="[20, { sm: 5, xs: 5 }]">
                  <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
                    <div class="info-item font-weight-600">
                      <span class="info-item-label">
                        {{ `${$t('email')}:` }}
                        <span class="text-black">{{ user.email }}</span>
                      </span>
                    </div>
                  </a-col>

                  <a-col
                    v-if="user.phone"
                    :md="{ span: 12 }"
                    :xs="{ span: 24 }"
                  >
                    <div class="info-item font-weight-600">
                      <span class="info-item-label">
                        {{ `${$t('phone')}:` }}
                        <span class="text-black">{{ user.phone }}</span>
                      </span>
                    </div>
                  </a-col>
                </a-row>
              </a-col>

              <a-col
                :lg="{ span: 6 }"
                :md="{ span: 4 }"
                :sm="{ span: 6 }"
                :xs="{ span: 24 }"
              >
                <span
                  class="d-flex justify-content-end justify-content-xs-start"
                >
                  <router-link
                    :to="
                      user.id === userInfo.id
                        ? '/profile/edit'
                        : `/users/edit/${user.id}`
                    "
                  >
                    <a-button type="link" class="px-0">
                      <icon-edit class="fill-warning"></icon-edit>
                    </a-button>
                  </router-link>

                  <a-popconfirm
                    v-if="user.id !== userInfo.id"
                    :title="`${$t('are_you_sure')}?`"
                    class="ml-10"
                    @confirm="handleDeleteUser(user.id)"
                  >
                    <a-button type="link" class="px-0">
                      <icon-del class="fill-danger"></icon-del>
                    </a-button>
                  </a-popconfirm>
                </span>
              </a-col>
            </a-row>
          </a-spin>
        </card>
      </a-col>
    </a-row>

    <a-modal
      class="invite-modal"
      centered
      width="700px"
      :footer="null"
      :visible="inviteModalVisible"
      @cancel="handleCloseInviteModal"
    >
      <div class="invite-modal-header">
        <page-title tag="div" size="20">
          {{ $t('invite_user') }}
        </page-title>
      </div>

      <div class="invite-modal-body">
        <a-form>
          <a-row>
            <a-col :span="24">
              <a-form-item
                class="w-100 mr-10"
                has-feedback
                :label="iviteData.email.value && $t('placeholders.email')"
                :validate-status="iviteData.email.status"
              >
                <a-input
                  v-model="iviteData.email.value"
                  size="large"
                  type="email"
                  :placeholder="$t('placeholders.email')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row class="invite-modal-company-list" :gutter="[0, 20]">
            <a-col
              v-for="company in iviteData.companies"
              :key="company.id"
              :span="24"
              class="invite-modal-company-list-item"
            >
              <a-row type="flex" class="align-items-end">
                <a-col :lg="{ span: 6 }" :xs="{ span: 12 }">
                  <a-checkbox
                    :checked="company.active"
                    @change="(e) => onChangeActiveCompany(company.id, e)"
                  >
                    {{ company.name }}
                  </a-checkbox>
                </a-col>

                <a-col :lg="{ span: 18 }" :xs="{ span: 12 }">
                  <a-form-item
                    class="mb-0-i"
                    has-feedback
                    :validate-status="company.status"
                  >
                    <a-select
                      mode="multiple"
                      size="small"
                      :placeholder="$t('placeholders.permission')"
                      :value="company.permissions"
                      @change="(val) => onChangePermission(company.id, val)"
                    >
                      <template slot="notFoundContent">
                        <div class="ant-empty ant-empty-normal ant-empty-small">
                          <div class="ant-empty-image">
                            <icon-more fill="rgba(0, 0, 0, 0.25)"></icon-more>
                          </div>
                          <p class="ant-empty-description">
                            {{ $t('no_data') }}
                          </p>
                        </div>
                      </template>

                      <a-select-option
                        v-for="(permission, index) in permissions"
                        :key="index"
                        :value="Object.keys(permission)[0]"
                      >
                        {{ permission[Object.keys(permission)[0]] }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>

          <a-row class="invite-modal-action">
            <a-col :span="24">
              <app-button
                type="primary"
                size="large"
                :loading="inviteLoading"
                @click="handleInviteUser"
              >
                {{ $t('invite') }}
              </app-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </app-page>
</template>

<script>
import { mapState } from 'vuex';
import apiRequest from '../js/helpers/apiRequest.js';
import declOfNum from '../js/helpers/declOfNum.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';

import IconUserDefaultAvatar from '../components/icons/UserDefaultAvatar.vue';
import IconDel from '../components/icons/Del.vue';
import IconEdit from '../components/icons/Edit.vue';
import IconMore from '../components/icons/More.vue';

export default {
  name: 'Users',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    IconUserDefaultAvatar,
    IconDel,
    IconEdit,
    IconMore
  },

  data() {
    return {
      inviteLoading: false,
      inviteModalVisible: false,
      deleateLoadingUserId: null,
      iviteData: {
        email: { value: '', status: '' },
        companies: []
      }
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.$t('page_users.title')}`
    };
  },

  computed: {
    ...mapState({
      userInfo: ({ user }) => user.info,
      userPlan: ({ user }) => user.plan,
      users: ({ company }) => company.users,
      permissions: ({ app }) => app.permissions,
      companies: ({ company }) => company.companies
    })
  },

  methods: {
    declOfNum,

    handleOpenInviteModal() {
      this.inviteModalVisible = true;

      this.companies.forEach((company) => {
        this.iviteData.companies.push({
          id: company.id,
          name: company.name,
          active: false,
          permissions: [],
          status: ''
        });
      });
    },

    handleCloseInviteModal() {
      this.inviteModalVisible = false;

      const { iviteData } = this;

      iviteData.email.value = '';
      iviteData.email.status = '';
      iviteData.companies = [];
    },

    onChangePermission(companyId, val) {
      const company = this.iviteData.companies.find(
        (company) => company.id === companyId
      );

      if (val.length) {
        company.active = true;
      } else {
        company.active = false;
      }

      company.permissions = val;
    },

    onChangeActiveCompany(companyId, e) {
      this.iviteData.companies.find(
        (company) => company.id === companyId
      ).active = e.target.checked;
    },

    checkInviteForm() {
      let valid = true;
      const {
        iviteData: { email, companies }
      } = this;

      email.status = '';
      companies.forEach((company) => {
        company.status = '';
      });

      if (!email.value) {
        email.status = 'error';
        valid = false;
      }

      companies.forEach((company) => {
        if (company.active && !company.permissions.length) {
          company.status = 'error';
          valid = false;
        }
      });

      return valid;
    },

    async handleInviteUser() {
      const valid = this.checkInviteForm();

      if (valid) {
        try {
          const {
            iviteData: { email, companies }
          } = this;

          const body = new FormData();

          body.append('email', email.value);

          companies.forEach((company, i) => {
            if (company.active) {
              const data = {
                id: company.id,
                permissions: company.permissions.map((permission) => ({
                  active: 1,
                  name: permission
                }))
              };

              body.append(`companies[${i}]`, JSON.stringify(data));
            }
          });

          this.inviteLoading = true;
          const res = await apiRequest('invitev2/create', 'POST', body, true);
          this.inviteLoading = false;

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
            this.handleCloseInviteModal();
          }
        } catch (error) {
          console.log('handleInviteUser', error);
          this.inviteLoading = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    },

    async handleDeleteUser(id) {
      try {
        this.deleateLoadingUserId = id;
        const res = await apiRequest(`user/remove/${id}`, 'POST', null, true);
        this.deleateLoadingUserId = null;

        const { error, response } = res;

        if (!error) {
          await this.$store.dispatch('company/getCompanyUsers');
        }

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
      } catch (error) {
        console.log('handleDeleteUser:', error);
      }
    }
  }
};
</script>

<style lang="scss">
.page-companies-card {
  .card-inner {
    flex-direction: row;
  }

  .ant-avatar {
    flex-shrink: 0;
  }
}

.page-companies-card-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.user-card-action {
  padding: 0;
  margin: 0;
  border: 0 !important;
  background-color: transparent;
  cursor: pointer;
  outline: none !important;

  &:hover {
    svg {
      width: 18px;
      height: 18px;
      fill: $grayish-blue-200;
    }
  }
}

.page-companies-card-actions {
  svg {
    width: 18px;
    height: 18px;
    fill: #969696;
    transition: 0.15s;

    &:hover {
      fill: $black;
    }
  }
}

.invite-modal-company-list {
  margin-top: 30px;
}

.invite-modal-company-list-item {
  // border-bottom: 1px solid #b6b7c6;

  .ant-checkbox-group {
    width: 100%;
  }
}

.invite-modal-action {
  margin-top: 50px;
}
</style>
