<template>
  <app-page
    class="page-company-edit"
    :loading="!userInfo && userPermissionsLoad"
  >
    <template slot="header">
      <a-breadcrumb class="mb-5" separator=">">
        <a-breadcrumb-item>
          <router-link to="/users">
            {{ $t('page_users_edit.users') }}
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ $t('page_users_edit.edit') }}
        </a-breadcrumb-item>
      </a-breadcrumb>

      <page-title>
        {{ $t('page_users_edit.title') }}
      </page-title>
    </template>

    <card v-if="userInfo && userPermissionsLoad">
      <page-title tag="h2" size="16" class="mb-0-i">
        {{ $t('personal_information') }}
      </page-title>

      <a-divider />

      <a-form>
        <a-row :gutter="20">
          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item>
              <a-input
                type="text"
                :placeholder="$t('placeholders.name')"
                :value="userInfo.name"
                disabled
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="20">
          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item>
              <a-input
                type="email"
                :placeholder="$t('placeholders.email')"
                :value="userInfo.email"
                disabled
              />
            </a-form-item>
          </a-col>

          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item>
              <a-input
                type="tel"
                :placeholder="$t('placeholders.phone')"
                :value="userInfo.phone || ''"
                disabled
              />
            </a-form-item>
          </a-col>

          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item>
              <upload disabled :placeholder="userInfo.avatar" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider />

        <page-title tag="h2" size="16">
          {{ $t('permissions') }}
        </page-title>

        <a-row class="invite-modal-company-list" :gutter="[0, 20]">
          <a-col
            v-for="company in data.companies"
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
                        <p class="ant-empty-description">{{ $t('no_data') }}</p>
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

        <a-form-item class="mt-40">
          <app-button
            type="primary"
            size="large"
            :loading="isPendingSave"
            @click="handleSaveInfo"
          >
            {{ $t('save') }}
          </app-button>

          <router-link to="/users">
            <app-button size="large" class="ml-10">
              {{ $t('cancel') }}
            </app-button>
          </router-link>
        </a-form-item>
      </a-form>
    </card>
  </app-page>
</template>

<script>
import { mapState } from 'vuex';
import apiRequest from '../js/helpers/apiRequest';

import AppPage from '../components/AppPage.vue';
import Card from '../components/Card.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Upload from '../components/Upload.vue';

import IconMore from '../components/icons/More.vue';

export default {
  name: 'UserEdit',

  components: {
    AppPage,
    Card,
    PageTitle,
    AppButton,
    Upload,
    IconMore
  },

  data() {
    return {
      isPendingSave: false,
      userPermissionsLoad: false,
      data: {
        companies: []
      }
    };
  },

  // beforeRouteEnter(to, from, next) {
  //   const { params: { id } } = to;

  //   next(async (vm) => {
  //       vm.$store.state.
  //     });

  //   next();
  // },

  watch: {
    async companies() {
      if (!this.userPermissionsLoad) {
        await this.getUserPermissions();
        this.userPermissionsLoad = true;
      }
    }
  },

  computed: {
    userId() {
      const {
        $route: {
          params: { id }
        }
      } = this;

      return Number(id);
    },

    ...mapState({
      userInfo(state) {
        return state.company.users.find((user) => user.id === this.userId);
      },
      permissions: ({ app }) => app.permissions,
      companies: ({ company }) => company.companies
    })
  },

  async created() {
    const { permissions, companies } = this;

    if (permissions.length && companies.length) {
      await this.getUserPermissions();
      this.userPermissionsLoad = true;
    }
  },

  methods: {
    onChangePermission(companyId, val) {
      const company = this.data.companies.find(
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
      this.data.companies.find((company) => company.id === companyId).active =
        e.target.checked;
    },

    checkForm() {
      let valid = true;
      const {
        data: { companies }
      } = this;

      companies.forEach((company) => {
        company.status = '';
      });

      companies.forEach((company) => {
        if (company.active && !company.permissions.length) {
          company.status = 'error';
          valid = false;
        }
      });

      return valid;
    },

    async getUserPermissions() {
      try {
        const res = await apiRequest(
          `permissions/user?user_id=${this.userId}`,
          'GET',
          null,
          true
        );

        const { error, response } = res;

        if (error && response.message) {
          this.$notification.warning({
            message: this.$t('notify.warning'),
            description: response.message,
            icon: () => <icon-error class="warning-icon" />
          });
        }

        if (error) {
          this.$router.replace('/users');
        } else {
          const {
            response: { data }
          } = res;

          if (data.length) {
            this.companies.forEach((company) => {
              const companyPermissions = data.filter(
                (item) => item.company_id === company.id
              );

              this.data.companies.push({
                id: company.id,
                name: company.name,
                active: companyPermissions.map(({ name }) => name).length
                  ? true
                  : false,
                permissions: companyPermissions.map(({ name }) => name),
                status: ''
              });
            });
          } else {
            this.companies.forEach((company) => {
              this.iviteData.companies.push({
                id: company.id,
                name: company.name,
                active: false,
                permissions: [],
                status: ''
              });
            });
          }
        }
      } catch (error) {
        console.log('getUserPermissions:', error);
      }
    },

    async handleSaveInfo() {
      const valid = this.checkForm();

      if (valid) {
        try {
          const {
            userId,
            data: { companies }
          } = this;

          const body = new FormData();

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

          this.isPendingSave = true;
          const res = await apiRequest(
            `permissions/user?user_id=${userId}`,
            'POST',
            body,
            true
          );
          this.isPendingSave = false;

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
        } catch (error) {
          console.log('handleSaveInfo:', error);
        }
      }
    }
  }
};
</script>
