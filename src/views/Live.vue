<template>
  <app-page class="page-jobs" :loading="pageLoading">
    <template v-if="!pageLoading">
      <template slot="header">
        <a-row
          :gutter="[
            { lg: 20, xs: 10 },
            { lg: 20, xs: 10 }
          ]"
        >
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <page-title>
              {{ $t('online_interviews') }}
            </page-title>
          </a-col>

          <a-col :md="{ span: 12 }" :xs="{ span: 24 }" class="text-right-md">
            <app-button
              type="primary"
              size="large"
              @click="handleOpenCreateInterviewModal"
            >
              {{ $t('create_room') }}
            </app-button>
          </a-col>
        </a-row>
      </template>

      <card class="filter-card filter-card-normal mb-10">
        <a-row
          type="flex"
          align="bottom"
          :gutter="[
            { xl: 10, lg: 10, md: 10, sm: 10, xs: 10 },
            { xl: 0, lg: 10, md: 10, sm: 10, xs: 10 }
          ]"
        >
          <a-col :xl="{ span: 6 }" :xs="{ span: 24 }">
            <a-input
              v-model="filter.search"
              size="small"
              :placeholder="$t('placeholders.search_by_name')"
            >
              <icon-search
                slot="prefix"
                class="ant-input-prefix-icon"
              ></icon-search>
            </a-input>
          </a-col>

          <a-col
            class="page-support-filters"
            :xl="{ span: 18 }"
            :xs="{ span: 24 }"
          >
            <a-select
              mode="multiple"
              size="small"
              :placeholder="$t('placeholders.all_compamies')"
              :class="{ 'hide-label': filter.company.length }"
              :value="filter.company"
              data-label="*"
              @change="onChangeFilterCompany"
            >
              <template slot="notFoundContent">
                <div class="ant-empty ant-empty-normal ant-empty-small">
                  <div class="ant-empty-image">
                    <icon-more fill="rgba(0, 0, 0, 0.25)"></icon-more>
                  </div>
                  <p class="ant-empty-description">{{ $t('no_data') }}</p>
                </div>
              </template>

              <a-select-option v-for="company in companies" :key="company.id">
                {{ company.name }}
              </a-select-option>
            </a-select>

            <a-select
              size="small"
              mode="tags"
              :placeholder="$t('placeholders.date_sort')"
              :class="['ml-10', { 'hide-label': filter.date.length }]"
              :value="filter.date"
              data-label="*"
              @change="onChangeFilterDate"
            >
              <template slot="notFoundContent">
                <div class="ant-empty ant-empty-normal ant-empty-small">
                  <div class="ant-empty-image">
                    <icon-more fill="rgba(0, 0, 0, 0.25)"></icon-more>
                  </div>
                  <p class="ant-empty-description">{{ $t('no_data') }}</p>
                </div>
              </template>

              <a-select-option value="CREATE_DATE">
                {{ $t('placeholders.creation_date') }}
              </a-select-option>

              <a-select-option value="UPDATE_DATE">
                {{ $t('placeholders.update_date') }}
              </a-select-option>

              <a-select-option value="START_DATE">
                {{ $t('placeholders.start_date') }}
              </a-select-option>
            </a-select>

            <app-button class="ml-10" @click="clearFilters">
              {{ $t('clear_all') }}
            </app-button>
          </a-col>
        </a-row>
      </card>

      <a-row
        :gutter="[
          { lg: 20, xs: 10 },
          { lg: 20, xs: 10 }
        ]"
      >
        <a-col :span="24">
          <list>
            <list-item-live-interview
              v-for="interview in filtredInterviews"
              :key="interview.id"
              :data="interview"
              :loading="interview.id === interviewLoadingId"
              @edit="handleEditLiveInterview(interview.id)"
              @remove="
                handleRemoveLiveInterview(interview.id, interview.companyId)
              "
            ></list-item-live-interview>
          </list>
        </a-col>
      </a-row>
    </template>

    <a-modal
      class="create-interview-modal"
      centered
      :footer="null"
      :visible="createInterviewModalVisible"
      @cancel="handleCloseCreateInterviewModal"
    >
      <div class="create-interview-modal-header">
        <page-title tag="div" size="20">
          {{ editLiveInterviewModalTitle }}
        </page-title>
      </div>

      <div class="create-interview-modal-body">
        <a-form>
          <a-row :gutter="20">
            <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
              <a-form-item has-feedback :validate-status="data.roomName.status">
                <a-input
                  v-model="data.roomName.value"
                  :placeholder="$t('room_name')"
                />
              </a-form-item>
            </a-col>

            <a-col :sm="{ span: 12 }" :xs="{ span: 24 }">
              <a-form-item has-feedback :validate-status="data.company.status">
                <a-select
                  :placeholder="$t('placeholders.company')"
                  :defaultActiveFirstOption="false"
                  :value="data.company.value"
                  @change="onChangeCompany"
                >
                  <div slot="suffixIcon">
                    <icon-arrow-down></icon-arrow-down>
                  </div>

                  <div
                    slot="notFoundContent"
                    class="d-flex justify-content-center"
                  >
                    <router-link to="/companies/create">
                      <app-button type="link">
                        {{ `+ ${$t('page_company_create.title')}` }}
                      </app-button>
                    </router-link>
                  </div>

                  <a-select-option
                    v-for="company in companies"
                    :key="company.id"
                    :value="company.id"
                  >
                    {{ company.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col
              :sm="{ span: isExternalPlatform ? 12 : 24 }"
              :xs="{ span: 24 }"
            >
              <a-form-item has-feedback :validate-status="data.platform.status">
                <a-select
                  :placeholder="$t('placeholders.platform')"
                  :defaultActiveFirstOption="false"
                  :value="data.platform.value"
                  @change="onChangeInterviewPlatform"
                >
                  <div slot="suffixIcon">
                    <icon-arrow-down></icon-arrow-down>
                  </div>

                  <a-select-option
                    v-for="(platform, index) in platforms"
                    :key="index"
                    :value="platform.name"
                  >
                    {{ platform.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col
              v-if="isExternalPlatform"
              :sm="{ span: 12 }"
              :xs="{ span: 24 }"
            >
              <a-form-item has-feedback :validate-status="data.link.status">
                <a-input v-model="data.link.value" :placeholder="$t('link')" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="20">
            <a-col :span="24">
              <a-form-item has-feedback :validate-status="data.date.status">
                <a-date-picker
                  v-model="data.date.value"
                  :valueFormat="dateFormat"
                  :show-time="{ format: timeFormat }"
                  :disabled-date="disabledDate"
                  :placeholder="$t('date')"
                  style="width: 100%"
                ></a-date-picker>
              </a-form-item>
            </a-col>

            <a-col :span="24" class="mt-30">
              <a-form-item class="mb-0-i">
                <app-button
                  v-if="data.roomId"
                  type="primary"
                  size="large"
                  :loading="loadingUpdateLiveInterview"
                  @click="handleUpdateLiveInterview"
                >
                  {{ $t('update_room') }}
                </app-button>

                <app-button
                  v-else
                  type="primary"
                  size="large"
                  :loading="loadingCreateLiveInterview"
                  @click="handleCreateLiveInterview"
                >
                  {{ $t('create_room') }}
                </app-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </app-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import apiRequest from '../js/helpers/apiRequest.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';
import List from '../components/List.vue';
import ListItemLiveInterview from '../components/ListItemLiveInterview.vue';

import IconArrowDown from '../components/icons/ArrowDown.vue';
import IconSearch from '../components/icons/Search.vue';
import IconMore from '../components/icons/More.vue';

export default {
  name: 'Live',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    List,
    ListItemLiveInterview,
    IconArrowDown,
    IconSearch,
    IconMore
  },

  data() {
    return {
      pageLoading: false,
      createInterviewModalVisible: false,
      loadingCreateLiveInterview: false,
      loadingUpdateLiveInterview: false,
      dateFormat: 'YYYY/MM/DD HH:mm',
      timeFormat: 'HH:mm',
      interviewLoadingId: null,
      platforms: [
        { name: 'HRBLADE', title: 'HRBlade Live', external: false },
        { name: 'ZOOM', title: 'Zoom', external: true },
        { name: 'SKYPE', title: 'Skype', external: true },
        { name: 'GOOGLE-MEET', title: 'Google Meet', external: true },
        { name: 'MICROSOFT-TEAMS', title: 'Microsoft Teams', external: true }
      ],
      filter: {
        search: '',
        company: [],
        date: []
      },
      data: {
        roomId: null,
        roomName: { value: '', status: '' },
        company: { value: undefined, status: '' },
        platform: { value: undefined, status: '' },
        link: { value: '', status: '' },
        date: { value: undefined, status: '' }
      }
    };
  },

  watch: {
    responsesCount() {
      if (
        this.responsesCount !== undefined &&
        this.responsesLimit !== undefined
      ) {
        if (this.responsesCount === this.responsesLimit) {
          this.$store.commit('app/TOGGLE_UPGRADE_MODAL', true);
          this.$router.back();
        }
      }
    }
  },

  computed: {
    isExternalPlatform() {
      const platform = this.platforms.find(
        (platform) => platform.name === this.data.platform.value
      );

      if (platform && platform.external) {
        return true;
      } else {
        return false;
      }
    },

    editLiveInterviewModalTitle() {
      return this.data.roomId
        ? this.$t('edit_interview_live_room')
        : this.$t('create_interview_live_room');
    },

    filtredInterviews() {
      const {
        filter: { search, company, date },
        interviews
      } = this;

      return (
        interviews
          .filter((interview) => {
            const name = interview.name.toLowerCase();
            const searchText = search.toLowerCase();

            return name.indexOf(searchText) >= 0 ? interview : false;
          })
          .filter(function(interview) {
            if (company.length) {
              return this.indexOf(interview.companyId) >= 0;
            } else {
              return interview;
            }
          }, company)
          // .filter(function(interview) {
          //   if (status.length) {
          //     const status = interview.active ? 'ACTIVE' : 'NOT_ACTIVE';

          //     return this.indexOf(status) >= 0;
          //   } else {
          //     return interview;
          //   }
          // }, status)
          .sort((a, b) => {
            if (date[0] === 'CREATE_DATE') {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }

            if (date[0] === 'UPDATE_DATE') {
              return new Date(b.updatedAt) - new Date(a.updatedAt);
            }

            if (date[0] === 'START_DATE') {
              return new Date(a.startAt) - new Date(b.startAt);
            }
          })
      );
    },

    ...mapState({
      companies: ({ company }) => company.companies,
      interviews: (state) => state.live.interviews,
      responsesCount: ({ user }) => user.plan.responsesCount,
      responsesLimit: ({ user }) => user.plan.responsesLimit
    })
  },

  created() {
    if (
      this.responsesCount !== undefined &&
      this.responsesLimit !== undefined
    ) {
      if (this.responsesCount === this.responsesLimit) {
        this.$store.commit('app/TOGGLE_UPGRADE_MODAL', true);
        this.$router.back();
      }
    }
  },

  methods: {
    clearFilters() {},

    onChangeFilterCompany(value) {
      this.filter.company = value;
    },

    onChangeFilterDate(value) {
      this.filter.date = value.filter((date) => date !== this.filter.date[0]);
    },

    disabledDate(current) {
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      return current.valueOf() <= yesterday;
    },

    handleOpenCreateInterviewModal() {
      this.createInterviewModalVisible = true;
    },

    handleCloseCreateInterviewModal() {
      this.createInterviewModalVisible = false;

      const {
        data: { roomName, company, platform, link, date }
      } = this;

      this.data.roomId = null;
      roomName.value = '';
      company.value = undefined;
      platform.value = undefined;
      link.value = '';
      date.value = undefined;
    },

    handleEditLiveInterview(interviewId) {
      const {
        data: { roomName, company, platform, link, date }
      } = this;
      const interviewInfo = this.interviews.find(
        (interview) => interview.id === interviewId
      );

      this.data.roomId = interviewId;
      roomName.value = interviewInfo.name;
      company.value = interviewInfo.companyId;
      platform.value = interviewInfo.source;
      link.value = interviewInfo.link || '';
      date.value = interviewInfo.date;

      this.handleOpenCreateInterviewModal();
    },

    onChangeInterviewPlatform(val) {
      this.data.link.value = '';
      this.data.platform.value = val;
    },

    onChangeCompany(val) {
      this.data.company.value = val;
    },

    checkForm() {
      let valid = true;

      const {
        data: { roomName, company, platform, link, date },
        isExternalPlatform
      } = this;

      roomName.status = '';
      company.status = '';
      platform.status = '';
      link.status = '';
      date.status = '';

      if (!roomName.value) {
        roomName.status = 'error';
        valid = false;
      }

      if (company.value === undefined) {
        company.status = 'error';
        valid = false;
      }

      if (platform.value === undefined) {
        platform.status = 'error';
        valid = false;
      }

      if (!link.value && isExternalPlatform) {
        link.status = 'error';
        valid = false;
      }

      if (date.value === undefined) {
        date.status = 'error';
        valid = false;
      }

      return valid;
    },

    async handleCreateLiveInterview() {
      const valid = this.checkForm();

      if (valid) {
        try {
          const {
            data: { roomName, company, platform, link, date },
            isExternalPlatform
          } = this;

          const body = new FormData();

          body.append('name', roomName.value);
          body.append('company_id', company.value);
          body.append('source', platform.value);
          body.append('start', date.value);

          if (isExternalPlatform) {
            body.append('link', link.value);
          }

          this.loadingCreateLiveInterview = true;
          const res = await apiRequest('rooms/create', 'POST', body, true);
          this.loadingCreateLiveInterview = false;

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
            this.getLiveInterviews();
            this.handleCloseCreateInterviewModal();
          }
        } catch (error) {
          console.log('handleCreateLiveInterview', error);
          this.loadingCreateLiveInterview = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    },

    async handleUpdateLiveInterview() {
      const valid = this.checkForm();

      if (valid) {
        try {
          const {
            data: { roomId, roomName, company, platform, link, date },
            isExternalPlatform
          } = this;

          const body = new FormData();

          body.append('room_id', roomId);
          body.append('name', roomName.value);
          body.append('company_id', company.value);
          body.append('source', platform.value);
          body.append('start', date.value);

          if (isExternalPlatform) {
            body.append('link', link.value);
          }

          this.loadingUpdateLiveInterview = true;
          const res = await apiRequest('rooms/edit', 'POST', body, true);
          this.loadingUpdateLiveInterview = false;

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
            this.getLiveInterviews();
            this.handleCloseCreateInterviewModal();
          }
        } catch (error) {
          console.log('handleCreateLiveInterview', error);
          this.loadingUpdateLiveInterview = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    },

    async handleRemoveLiveInterview(interviewId, companyId) {
      try {
        const body = new FormData();
        body.append('room_id', interviewId);
        body.append('company_id', companyId);

        this.interviewLoadingId = interviewId;
        const res = await apiRequest('rooms/delete', 'POST', body, true);
        await this.getLiveInterviews();
        this.interviewLoadingId = null;

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
        console.log();
      }
    },

    ...mapActions({
      getLiveInterviews: 'live/getLiveInterviews'
    })
  }
};
</script>

<style lang="scss">
.page-jobs-card-title {
  border-bottom: 1px solid #dedede;

  .card-inner {
    padding: 16px 10px;
  }
}

.filter-card:not(.filter-card-normal) {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-bottom: 1px solid #dedede;

  .card-inner {
    padding: 15px;
  }
}

.page-support-filters {
  text-align: right;

  .ant-select {
    max-width: 180px;
  }

  @media (max-width: $xl) {
    display: flex;
    text-align: left;

    .ant-select {
      max-width: 208px;
    }
  }

  @media (max-width: $lg) {
    .ant-select {
      max-width: 268px;
    }
  }

  @media (max-width: $md) {
    flex-wrap: wrap;

    .ant-select {
      max-width: 100%;
      flex-basis: calc(50% - 5px);
      margin: 0 5px 10px;

      &:nth-child(odd) {
        margin-left: 0;
      }

      &:nth-child(even) {
        margin-right: 0;
      }
    }

    .app-button {
      margin-left: 0;
    }
  }

  @media (max-width: $sm) {
    .ant-select {
      max-width: 100%;
      flex-basis: 100%;
      margin: 0 0 10px 0;
    }
  }
}
</style>
