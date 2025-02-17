<template>
  <app-page class="page-company-edit" :loading="loading">
    <template slot="header">
      <a-breadcrumb v-if="companiesCount" class="mb-5" separator=">">
        <a-breadcrumb-item>
          <router-link to="/companies">
            {{ $t('breadcrumbs.companies') }}
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ breadcrumb }}</a-breadcrumb-item>
      </a-breadcrumb>

      <!-- <page-title>{{ pageTitle }}</page-title> -->
    </template>

    <card class="page-company-edit-tab-header">
      <app-button
        :class="[
          'edit-tab-header-link',
          { 'edit-tab-header-link-active': activeTab === 'EDIT' }
        ]"
        type="link"
        @click="activeTab = 'EDIT'"
      >
        {{ $t('company_data') }}
      </app-button>

      <app-button
        v-if="!isCreate"
        :class="[
          'edit-tab-header-link',
          { 'edit-tab-header-link-active': activeTab === 'MESSAGE' }
        ]"
        type="link"
        @click="activeTab = 'MESSAGE'"
      >
        {{ $t('message_templates') }}
      </app-button>
    </card>

    <card v-if="activeTab === 'EDIT'">
      <a-form>
        <a-row :gutter="20">
          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item :label="data.name && $t('placeholders.company_name')">
              <a-input
                v-model="data.name"
                type="text"
                :placeholder="$t('placeholders.company_name')"
              />
            </a-form-item>
          </a-col>

          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item
              :label="data.industryId && $t('placeholders.industry')"
            >
              <a-select
                :placeholder="$t('placeholders.industry')"
                :defaultActiveFirstOption="false"
                :value="data.industryId"
                @change="onChangeIndustry"
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
                  v-for="industry in industries"
                  :key="industry.id"
                  :value="industry.id"
                >
                  {{ industry.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item :label="data.location && $t('placeholders.location')">
              <a-input
                v-model="data.location"
                type="text"
                :placeholder="$t('placeholders.location')"
              />
            </a-form-item>
          </a-col>

          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item :label="data.website && $t('placeholders.website')">
              <a-input
                v-model="data.website"
                type="text"
                :placeholder="$t('placeholders.website')"
              />
            </a-form-item>
          </a-col>

          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item>
              <div class="remove-right-top">
                <upload
                  :label="$t('placeholders.upload_company_logo')"
                  :placeholder="data.logoPreview"
                  @change="onChangeLogo"
                />

                <div
                  v-if="data.logoPreview"
                  class="remove-right-top-icon"
                  @click="
                    () => {
                      data.logo = null;
                      data.logoPreview = '';
                    }
                  "
                >
                  <IconDel />
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider />

        <page-title tag="h2" size="16">
          {{ $t('jobs_pages_design') }}
        </page-title>

        <a-row :gutter="20">
          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item>
              <div class="remove-right-top">
                <upload
                  accept="image/*"
                  :label="$t('upload_background')"
                  :placeholder="data.bgImagePreview"
                  @change="onChangeBackground"
                />

                <div
                  v-if="data.bgImagePreview"
                  class="remove-right-top-icon"
                  @click="
                    () => {
                      data.bgImage = null;
                      data.bgImagePreview = '';
                    }
                  "
                >
                  <IconDel />
                </div>
              </div>
            </a-form-item>
          </a-col>

          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item>
              <div class="remove-right-top">
                <upload
                  accept="image/*"
                  :label="$t('upload_header_image')"
                  :placeholder="data.headerImagePreview"
                  @change="onChangeHeaderImage"
                />

                <div
                  v-if="data.headerImagePreview"
                  class="remove-right-top-icon"
                  @click="
                    () => {
                      data.headerImage = null;
                      data.headerImagePreview = '';
                    }
                  "
                >
                  <IconDel />
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="20" class="mt-40">
          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <page-title tag="h3" size="16">
              {{ `${$t('background_color')}:` }}
            </page-title>

            <a-form-item>
              <v-swatches
                show-fallback
                fallback-input-type="color"
                v-model="data.bgColor"
              >
                <a-input
                  slot="trigger"
                  :value="data.bgColor"
                  :style="{
                    backgroundColor: data.bgColor,
                    paddingLeft: '20px',
                    color:
                      lightOrDark(data.bgColor) === 'light'
                        ? '#000000 !important'
                        : '#ffffff !important'
                  }"
                  readonly
                />
              </v-swatches>
            </a-form-item>
          </a-col>

          <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
            <page-title tag="h3" size="16">
              {{ `${$t('buttons_color')}:` }}
            </page-title>

            <a-form-item>
              <v-swatches
                show-fallback
                fallback-input-type="color"
                v-model="data.btnColor"
              >
                <a-input
                  slot="trigger"
                  :value="data.btnColor"
                  :style="{
                    backgroundColor: data.btnColor,
                    paddingLeft: '20px',
                    color:
                      lightOrDark(data.btnColor) === 'light'
                        ? '#000000 !important'
                        : '#ffffff !important'
                  }"
                  readonly
                />
              </v-swatches>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <page-title tag="h3" size="16">
              {{ `${$t('description')}:` }}
            </page-title>
            <a-form-item class="ant-form-item-children-block">
              <text-editor
                :value="data.description || ''"
                @update="onChangeDescription"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item class="mt-40">
          <app-button
            v-if="isCreate"
            type="primary"
            size="large"
            :loading="isUpload"
            @click="createCompany"
          >
            {{ $t('create') }}
          </app-button>

          <app-button
            v-else
            type="primary"
            size="large"
            :loading="isUpload"
            @click="editCompany"
          >
            {{ $t('save') }}
          </app-button>

          <router-link v-if="companiesCount" to="/companies">
            <app-button size="large" class="ml-10">
              {{ $t('cancel') }}
            </app-button>
          </router-link>
        </a-form-item>
      </a-form>
    </card>

    <card v-if="activeTab === 'MESSAGE'">
      <messages-template-list />
    </card>
  </app-page>
</template>

<script>
import { mapState } from 'vuex';
import apiRequest from '../js/helpers/apiRequest.js';
import lightOrDark from '../js/helpers/lightOrDark.js';

import VSwatches from 'vue-swatches';
import AppPage from '../components/AppPage.vue';
import Card from '../components/Card.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Upload from '../components/Upload.vue';
import MessagesTemplateList from '../components/MessagesTemplateList.vue';

import IconArrowDown from '../components/icons/ArrowDown.vue';
import IconMore from '../components/icons/More.vue';
import IconDel from '../components/icons/Del.vue';
import TextEditor from '../components/TextEditor.vue';

import 'vue-swatches/dist/vue-swatches.css';

export default {
  name: 'CompanyEdit',

  components: {
    VSwatches,
    AppPage,
    Card,
    PageTitle,
    AppButton,
    Upload,
    MessagesTemplateList,
    IconArrowDown,
    IconMore,
    IconDel,
    TextEditor
  },

  data() {
    return {
      loading: false,
      isCreate: false,
      isUpload: false,
      activeTab: 'EDIT',
      fromPath: '/companies',

      data: {
        name: '',
        description: '',
        location: '',
        website: '',
        logo: null,
        bgImage: null,
        headerImage: null,
        logoPreview: '',
        bgImagePreview: '',
        headerImagePreview: '',
        bgColor: '#ffffff',
        btnColor: '#fda94c',
        industryId: undefined
      }
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.pageTitle}`
    };
  },

  computed: {
    companyId() {
      return this.$route.params.id;
    },

    breadcrumb() {
      return !this.companiesCount
        ? this.$t('page_company_create.complete_registration')
        : this.isCreate
        ? this.$t('create')
        : this.$t('edit');
    },

    pageTitle() {
      return !this.companiesCount
        ? this.$t('page_company_create.complete_registration')
        : this.isCreate
        ? this.$t('page_company_create.title')
        : this.$t('page_company_edit.title');
    },

    ...mapState({
      industries: ({ app }) => app.industries,
      companiesCount: ({ company }) => company.companies.length
    })
  },

  beforeRouteEnter(to, from, next) {
    if (from.path !== '/') {
      next((vm) => {
        vm.fromPath = from.path;
      });
    }

    next();
  },

  async created() {
    this.isCreate = this.$route.name === 'companies-create';

    if (!this.isCreate) {
      this.getCompany();
    }
  },

  methods: {
    lightOrDark,

    onChangeLogo(file) {
      this.data.logo = file;
    },

    onChangeBackground(file) {
      this.data.bgImage = file;
    },

    onChangeHeaderImage(file) {
      this.data.headerImage = file;
    },

    onChangeIndustry(val) {
      this.data.industryId = val;
    },

    onChangeDescription(val) {
      this.data.description = val;
    },

    async createCompany() {
      try {
        const {
          name,
          description,
          location,
          website,
          logo,
          industryId,
          bgImage,
          headerImage,
          bgColor,
          btnColor
        } = this.data;

        const body = new FormData();
        body.append('name', name);

        body.append('description', description);

        if (location) {
          body.append('location', location);
        }

        if (website) {
          body.append('website', website);
        }

        if (industryId) {
          body.append('industry_id', industryId);
        }

        // Styles
        body.append('bg_color', bgColor);
        body.append('buttons_color', btnColor);

        if (logo) {
          body.append('logo', logo);
        }

        if (bgImage) {
          body.append('bg_image', bgImage);
        }

        if (headerImage) {
          body.append('header_image', headerImage);
        }

        this.isUpload = true;

        const res = await apiRequest('company/create', 'POST', body, true);

        this.isUpload = false;

        const { message } = res.response;

        if (res.error) {
          if (message) {
            this.$notification.warning({
              message: this.$t('notify.error'),
              description: message,
              icon: () => <icon-error class="warning-icon" />
            });
          }
        } else {
          if (message) {
            this.$notification.success({
              message: this.$t('notify.success'),
              description: message,
              icon: () => <icon-success class="success-icon" />
            });
          }

          this.data.name = '';
          this.description = '';
          this.data.location = '';
          this.data.website = '';
          this.data.logo = null;
          this.data.industryId = 1;

          this.$store.dispatch('company/getCompanies');
          this.$router.push('/companies');
        }
      } catch (error) {
        console.log('createCompany: ', error);
        this.isUpload = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async editCompany() {
      try {
        const {
          name,
          description,
          location,
          website,
          logo,
          logoPreview,
          industryId,
          bgImage,
          bgImagePreview,
          headerImage,
          headerImagePreview,
          bgColor,
          btnColor
        } = this.data;

        const body = new FormData();
        body.append('company_id', this.companyId);
        body.append('name', name);

        body.append('description', description);

        if (location) {
          body.append('location', location);
        }

        if (website) {
          body.append('website', website);
        }

        if (industryId) {
          body.append('industry_id', industryId);
        }

        // Styles
        body.append('bg_color', bgColor);
        body.append('buttons_color', btnColor);

        if (!logo && !logoPreview) {
          body.append('logo', 'clear');
        }

        if (logo) {
          body.append('logo', logo);
        }

        if (!bgImage && !bgImagePreview) {
          body.append('bg_image', 'clear');
        }

        if (bgImage) {
          body.append('bg_image', bgImage);
        }

        if (!headerImagePreview && !headerImage) {
          body.append('header_image', 'clear');
        }

        if (headerImage) {
          body.append('header_image', headerImage);
        }

        this.isUpload = true;

        const res = await apiRequest('company/update', 'POST', body, true);

        this.isUpload = false;

        const { message } = res.response;

        if (res.error) {
          if (message) {
            this.$notification.warning({
              message: this.$t('notify.warning'),
              description: message,
              icon: () => <icon-error class="warning-icon" />
            });
          }
        } else {
          this.data.name = '';
          this.data.description = '';
          this.data.location = '';
          this.data.website = '';
          this.data.logo = null;
          this.data.industryId = 1;

          if (message) {
            this.$notification.success({
              message: this.$t('notify.success'),
              description: message,
              icon: () => <icon-success class="success-icon" />
            });
          }

          this.$router.push({ path: this.fromPath, query: { reload: true } });
        }
      } catch (error) {
        console.log('editCompany: ', error);
        this.isUpload = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async getCompany() {
      try {
        this.loading = true;
        const res = await apiRequest(
          `company/get/${this.companyId}`,
          'GET',
          null,
          true
        );
        this.loading = false;

        if (res.error) {
          const { message } = res.response;

          this.$notification.warning({
            message: this.$t('notify.error'),
            description: message,
            icon: () => <icon-error class="warning-icon" />
          });

          this.$router.replace('/companies');
        } else {
          const { data } = this;
          const {
            data: {
              name,
              description,
              location,
              website,
              logo,
              industry_id,
              bg_image,
              bg_color,
              buttons_color,
              header_image
            }
          } = res.response;

          data.name = name;
          data.description = description;
          data.location = location;
          data.website = website;
          data.logoPreview = logo;
          data.bgImagePreview = bg_image;
          data.headerImagePreview = header_image;
          data.industryId = industry_id;

          if (bg_color) {
            data.bgColor = bg_color;
          }

          if (buttons_color) {
            data.btnColor = buttons_color;
          }
        }
      } catch (error) {
        console.log('removeCompany:', error);
      }
    }
  }
};
</script>

<style lang="scss">
.page-company-edit-tab-header {
  border-radius: 0;

  border-bottom: 1px solid #e8e8e8;

  .card-inner {
    padding-bottom: 0;
    display: block;
  }
}

.edit-tab-header-link {
  height: auto !important;
  padding: 0 0 17px 0;
  border-radius: 0 !important;
  border: 0;
  border-bottom: 3px solid transparent;
  box-sizing: border-box;

  &.edit-tab-header-link-active {
    border-bottom: 3px solid #fda94c;
  }

  + .edit-tab-header-link {
    margin-left: 25px;

    @media (max-width: $sm) {
      margin-left: 15px;
    }
  }
}

.vue-swatches,
.vue-swatches__trigger__wrapper {
  width: 100%;

  .ant-input {
    cursor: pointer;
  }
}

.vue-swatches__fallback__wrapper {
  display: flex;
  align-items: center;
  padding-bottom: 7px !important;
}

.vue-swatches__fallback__input {
  height: 40px;
  padding: 0;
  border: 0;
  cursor: pointer;
  outline: none !important;
}

.vue-swatches__fallback__button {
  background-color: #fda94c;
}
</style>
