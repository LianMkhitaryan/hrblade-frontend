<template>
  <app-page class="page-job" :loading="pageLoading">
    <template v-if="jobInfo.id">
      <template slot="header">
        <a-breadcrumb class="mb-5" separator=">">
          <a-breadcrumb-item>
            <router-link to="/">
              {{ $t('breadcrumbs.jobs') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            {{ pageTitle }}
          </a-breadcrumb-item>
        </a-breadcrumb>

        <a-row type="flex" :gutter="[
          { lg: 20, md: 10, sm: 10, xs: 10 },
          { md: 0, sm: 20, xs: 20 }
        ]">
          <a-col :lg="{ span: 12 }" :span="24">
            <page-title class="mb-0-i">
              {{ pageTitle }}
            </page-title>
          </a-col>

          <a-col :lg="{ span: 12 }" :span="24" class="page-actions-col text-right-md">
            <div class="page-actions">
              <div class="button-block mr-20">
                <router-link :to="`/jobs/edit/${jobInfo.id}`" class="button-block-item mr-20-i mb-0-i">
                  <a-button type="link" class="px-0 mb-0-i">
                    <icon-edit class="small fill-warning mr-5" />

                    {{ $t('edit') }}
                  </a-button>
                </router-link>

                <a-popconfirm :title="`${$t('are_you_sure')}?`" class="button-block-item" @confirm="handleDeleteInteview">
                  <a-button type="link" class="px-0 mb-0-i" :loading="loadRemoveJob">
                    <icon-del class="small fill-danger mr-5" />
                    {{ $t('delete') }}
                  </a-button>
                </a-popconfirm>
              </div>

              <div style="flex-shrink: 0;">
                <span class="text-black">
                  {{ $t('active') }}
                </span>

                <a-switch class="ml-10" size="small" :loading="loadActiveChange" :checked="jobInfo.active"
                  @change="onChangeActive" />
              </div>
            </div>
          </a-col>
        </a-row>

        <a-row :gutter="{ lg: 20, md: 10, sm: 10, xs: 10 }" class="mt-15">
          <a-col :lg="{ span: 12 }" :span="24">
            <div class="button-block">
              <router-link :to="`/jobs/invite/${jobInfo.id}`" class="button-block-item">
                <app-button type="primary">
                  <icon-share class="mr-10" />

                  {{ $t('invite') }}
                </app-button>
              </router-link>

              <a :href="`${BASE_PATH_APP_URL}i/${jobInfo.hashLink}`" target="_blank" class="button-block-item">
                <app-button type="primary">
                  {{ $t('look') }}
                </app-button>
              </a>
            </div>
          </a-col>

          <a-col v-if="isEnterprise" class="text-right-lg" :lg="{ span: 12 }" :span="24">
            <app-button type="link" class="px-0" :loading="downloadVideosLoading" @click="handleDowloadVideos">
              <icon-download class="mr-5" />
              {{ $t('Export all videos') }}
            </app-button>
          </a-col>
        </a-row>
      </template>

      <a-row :gutter="[
        { md: 20, sm: 10, xs: 10 },
        { lg: 0, sm: 10, xs: 10 }
      ]">
        <a-col :lg="4" :sm="8" :span="12">
          <div class="d-flex flex-column">
            <div class="text-gray-300">
              {{ $t('invited') }}
            </div>

            <div class="text-black font-weight-600">
              {{ `${jobInfo.invitedCount} ${$t('people')}` }}
            </div>
          </div>
        </a-col>

        <a-col :lg="4" :sm="8" :span="12">
          <div class="d-flex flex-column">
            <div class="text-gray-300">
              {{ $t('responses') }}
            </div>

            <div class="text-black font-weight-600">
              {{ `${jobInfo.interviewedCount} ${$t('people')}` }}
            </div>
          </div>
        </a-col>

        <a-col :lg="4" :sm="8" :span="12">
          <div class="d-flex flex-column">
            <div class="text-gray-300">
              {{ $t('start_date') }}
            </div>

            <div class="text-black font-weight-600">
              {{ jobInfo.startDate }}
            </div>
          </div>
        </a-col>

        <a-col :lg="4" :sm="8" :span="12">
          <div class="d-flex flex-column">
            <div class="text-gray-300">
              {{ $t('end_date') }}
            </div>

            <div class="text-black font-weight-600">
              {{ jobInfo.endDate }}
            </div>
          </div>
        </a-col>

        <a-col :lg="4" :sm="8" :span="12">
          <div class="d-flex flex-column">
            <div class="text-gray-300">
              {{ $t('company') }}
            </div>
            <div>
              <router-link :to="`/companies/view/${jobInfo.company.id}`" class="text-black font-weight-600">
                {{ jobInfo.company.name }}
              </router-link>
            </div>
          </div>
        </a-col>

        <a-col :lg="4" :sm="8" :span="12">
          <div class="d-flex flex-column">
            <div class="text-gray-300">
              {{ $t('location') }}
            </div>

            <div class="text-black font-weight-600">
              {{ jobInfo.location || '-' }}
            </div>
          </div>
        </a-col>
      </a-row>

      <template>
        <a-row class="mt-50" :gutter="[
          { lg: 20, xs: 10 },
          { md: 0, sm: 10, xs: 10 }
        ]">
          <a-col :md="{ span: 12 }" :span="24">
            <!-- <page-title tag="h3" size="16" class="mb-15">
              {{ $t('page_jobs.list_of_candidates') }}
            </page-title> -->
            <a-space>
              <app-button :class="[
                  'toggle-response-view',
                  { 'toggle-response-view-active': viewType === 'LIST' }
                ]" @click="onChangeViewType('LIST')">
                <a-icon type="unordered-list" />
                {{ $t('List view') }}
              </app-button>

              <app-button v-if="jobInfo.pipelines.length" :class="[
                  'toggle-response-view',
                  { 'toggle-response-view-active': viewType === 'BOARD' }
                ]" @click="onChangeViewType('BOARD')">
                <icon-board style="margin-right: 8px;" />
                {{ $t('Board') }}
              </app-button>
            </a-space>
          </a-col>

          <a-col :md="{ span: 12 }" :span="24" class="export-csv">
            <a-space>
              <app-button type="primary" @click="() => (isInviteModalVisible = true)">
                <icon-plus class="mr-10" />
                {{ $t('Add candidate') }}
              </app-button>

              <a v-if="token" :href="`${API_BASE_PATH}job/export/${$route.params.id}/${token}`
                " download="candidate.csv">
                <app-button type="primary">
                  {{ $t('export_to_csv') }}
                </app-button>
              </a>
            </a-space>
          </a-col>
        </a-row>

        <card class="filter-card mt-20">
          <a-row type="flex" align="bottom" :gutter="[
            { sm: 10, xs: 10 },
            { xl: 0, sm: 10, xs: 10 }
          ]">
            <a-col :xl="6" :span="24">
              <a-input v-model="filter.search" size="small" :placeholder="$t('placeholders.search_by_name')">
                <icon-search slot="prefix" class="ant-input-prefix-icon" />
              </a-input>
            </a-col>

            <a-col class="page-support-filters" :xl="18" :span="24">
              <a-select mode="multiple" size="small" :placeholder="$t('placeholders.interview')"
                :class="{ 'hide-label': filter.statuses.length }" :value="filter.statuses" data-label="*"
                @change="onChangeFilterStatuses">
                <template slot="notFoundContent">
                  <div class="ant-empty ant-empty-normal ant-empty-small">
                    <div class="ant-empty-image">
                      <icon-more fill="rgba(0, 0, 0, 0.25)" />
                    </div>
                    <p class="ant-empty-description">{{ $t('no_data') }}</p>
                  </div>
                </template>

                <a-select-option value="NEW">
                  {{ $t('response_status.new') }}
                </a-select-option>

                <a-select-option value="INVITED">
                  {{ $t('invited') }}
                </a-select-option>

                <a-select-option value="REVIEW">
                  {{ $t('in_review') }}
                </a-select-option>

                <a-select-option value="ACCEPTED">
                  {{ $t('accepted') }}
                </a-select-option>

                <a-select-option value="REJECTED">
                  {{ $t('rejected') }}
                </a-select-option>

                <a-select-option value="WAIT">
                  {{ $t('wait') }}
                </a-select-option>
              </a-select>

              <a-select v-if="viewType === 'LIST'" mode="multiple" size="small" :placeholder="$t('placeholders.pipeline')"
                :class="['ml-10', { 'hide-label': filter.pipeline.length }]" :value="filter.pipeline" data-label="*"
                @change="onChangeFilterPipeline">
                <template slot="notFoundContent">
                  <div class="ant-empty ant-empty-normal ant-empty-small">
                    <div class="ant-empty-image">
                      <icon-more fill="rgba(0, 0, 0, 0.25)" />
                    </div>
                    <p class="ant-empty-description">{{ $t('no_data') }}</p>
                  </div>
                </template>

                <a-select-option v-for="pipe in jobInfo.pipelines" :key="pipe.id" :value="pipe.id">
                  {{ pipe.name }}
                </a-select-option>
              </a-select>

              <a-select mode="multiple" size="small" :placeholder="$t('placeholders.all_rank')"
                :class="['ml-10', { 'hide-label': filter.ranking.length }]" :value="filter.ranking" data-label="*"
                @change="onChangeFilterRanking">
                <template slot="notFoundContent">
                  <div class="ant-empty ant-empty-normal ant-empty-small">
                    <div class="ant-empty-image">
                      <icon-more fill="rgba(0, 0, 0, 0.25)" />
                    </div>
                    <p class="ant-empty-description">{{ $t('no_data') }}</p>
                  </div>
                </template>

                <a-select-option value="0">
                  0
                </a-select-option>

                <a-select-option value="1">
                  1
                </a-select-option>

                <a-select-option value="2">
                  2
                </a-select-option>

                <a-select-option value="3">
                  3
                </a-select-option>

                <a-select-option value="4">
                  4
                </a-select-option>

                <a-select-option value="5">
                  5
                </a-select-option>
              </a-select>

              <!-- <a-select
                mode="multiple"
                size="small"
                :placeholder="$t('placeholders.all_grades')"
                :class="['ml-10', { 'hide-label': filter.rate.length }]"
                :value="filter.rate"
                data-label="*"
                @change="onChangeFilterRate"
              >
                <template slot="notFoundContent">
                  <div class="ant-empty ant-empty-normal ant-empty-small">
                    <div class="ant-empty-image">
                      <icon-more fill="rgba(0, 0, 0, 0.25)" />
                    </div>
                    <p class="ant-empty-description">{{ $t('no_data') }}</p>
                  </div>
                </template>

                <a-select-option value="good">
                  {{ $t('good') }}
                </a-select-option>

                <a-select-option value="middling">
                  {{ $t('middling') }}
                </a-select-option>

                <a-select-option value="bad">
                  {{ $t('bad') }}
                </a-select-option>

                <a-select-option value="notrated">
                  {{ $t('not_rated') }}
                </a-select-option>
              </a-select> -->

              <app-button class="ml-10" @click="clearFilters">
                {{ $t('clear_all') }}
              </app-button>
            </a-col>
          </a-row>
        </card>

        <a-row v-if="viewType === 'LIST'" :gutter="{ lg: 20, xs: 10 }">
          <a-col :span="24">
            <list>
              <list-item-candidates v-for="job in responses" :key="job.id" :data="job" :pipelines="jobInfo.pipelines"
                :loading="job.id === loadUpdateCandidateStatusId" @add-note="openQuickNote"
                @change-candidate-status="handleChangeCandidateStatus"
                @change-candidate-pipeline="handleChangeCandidatePipelineStatus" @on-delete-response="onDeleteResponse"
                @on-invite="onInvite" />
            </list>
          </a-col>
        </a-row>

        <div v-if="viewType === 'BOARD'" class="board">
          <div class="board-container"
            style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">
            <div class="board-coll" v-for="column in boardColumns" :key="column.pipelineId"
              style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">
              <page-title class="board-coll-title"
                style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;"
                tag="h3" size="16">
                {{ column.title }}
              </page-title>

              <draggable :list="column.tasks" class="ghost-draggable-col"
                style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;"
                group="tasks" @change="onChangePipe">
                <div v-for="task in column.tasks" :key="task.id" class="ghost-draggable-card"
                  @click="$router.push(`/jobs/candidate/${task.id}`)">
                  <a-spin :spinning="task.id === loadUpdateCandidateStatusId">
                    <div class="ghost-draggable-card-info-header">
                      <div class="d-flex flex-column">
                        <router-link class="ghost-draggable-card-info-header-link" :to="`/jobs/candidate/${task.id}`"
                          target="_blank">
                          {{ task.name }}
                          <icon-blank />
                        </router-link>

                        <div v-if="task.note" class="list-item-candidates-info-item note">
                          <icon-comment></icon-comment>
                          <b>{{ task.note }}</b>
                        </div>

                        <b class="mt-5">
                          {{
                            $t(`response_status.${task.status.toLowerCase()}`)
                          }}
                        </b>
                      </div>

                      <img v-if="task.videoThumb" :src="task.videoThumb" class="ghost-draggable-card-info-img"
                        :alt="task.name" />
                    </div>

                    <div class="ghost-draggable-card-info">
                      <div class="ghost-draggable-card-item">
                        <b>{{ task.createdAt }}</b>
                      </div>

                      <div class="ghost-draggable-card-item">
                        <div :class="[
                          'ghost-draggable-card-item-rate',
                          `ghost-draggable-card-item-rate-${task.rate.value}`
                        ]">
                          <b></b>
                        </div>

                        <div class="ghost-draggable-card-item-stars">
                          <b @click.stop.prevent="() => null">
                            <a-rate v-model="task.rating" @change="(e) => onChangeRating(task.id, e)" />
                          </b>
                        </div>
                      </div>
                    </div>
                  </a-spin>
                </div>
              </draggable>
            </div>
          </div>
        </div>

        <a-modal v-model="isExportVideoVisible" class="quick-note-modal" centered destroyOnClose :closable="true"
          :footer="null" @cancel="closeExportVideo">
          <page-title tag="h3" size="25" class="mb-15">
            {{ $t('Export all videos') }}
          </page-title>

          <ul class="unstuled-list">
            <li v-for="(item, index) in exportVideos.filter(({ url }) => url)" :key="index">
              <a :href="item.url" target="_blank" rel="noopener noreferrer">
                {{ item.url }}
              </a>
            </li>
          </ul>
        </a-modal>

        <a-modal v-model="quickNote.visible" class="quick-note-modal" centered destroyOnClose :closable="false"
          @cancel="closeQuickNote">
          <page-title tag="h3" size="25" class="mb-15">
            {{ $t('quick_note') }}
          </page-title>

          <a-form>
            <a-form-item class="mb-0-i">
              <a-input v-model="quickNote.note" type="textarea" :placeholder="$t('placeholders.description')" />
            </a-form-item>
          </a-form>

          <template slot="footer">
            <app-button type="primary" class="blue-gradient" :loading="quickNote.isUpload" @click="handleSaveQuickNote">
              {{ $t('save') }}
            </app-button>

            <app-button type="primary" ghost @click="closeQuickNote">
              {{ $t('close') }}
            </app-button>
          </template>
        </a-modal>

        <a-modal v-model="isInviteModalVisible" class="quick-note-modal" centered destroyOnClose :footer="null"
          @cancel="closeInviteModal">
          <page-title tag="h3" size="25" class="mb-10">
            {{ $t('Add candidate') }}
          </page-title>

          <page-title class="mb-5" tag="h4" size="16">
            {{ pageTitle }}
          </page-title>

          <div class="mb-10" style="font-size: 12px;">
            <!-- <icon-share style="width: 12px;" /> -->
            {{ `${BASE_PATH_APP_URL}i/${jobInfo.hashLink}` }}
          </div>

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
                  <a-input v-model="data.email.value" type="email" :placeholder="$t('placeholders.email')" size="large" />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item has-feedback :label="data.phone.value && $t('placeholders.phone')"
                  :validate-status="data.phone.status">
                  <a-input v-model="data.phone.value" type="tel" :placeholder="$t('placeholders.phone')" size="large" />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <page-title style="color: #7a7c97; font-weight: 400;" class="mb-10" tag="h4" size="16">
                  {{ $t('Upload CV') }}
                </page-title>

                <file-pond ref="cvFilePond" :label-idle="$t('Drop file here...')" :acceptedFileTypes="[
                    'application/msword',
                    'text/plain',
                    'application/pdf',
                    'image/png',
                    'image/jpg',
                    'image/jpeg'
                  ]" :server="{
      url: `${API_BASE_PATH}filepond/api/process`,
      process: {
        onload: onloadCvFilepond
      }
    }" :allow-multiple="false" />
              </a-col>

              <a-col :span="24">
                <a-form-item has-feedback :label="data.note.value && $t('comments')" :validate-status="data.note.status">
                  <a-input v-model="data.note.value" type="textarea" :placeholder="$t('comments')" />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <page-title class="mb-15" tag="h4" size="16">
                  {{
                    $t('Invite candidate to the interview via email and SMS')
                  }}
                </page-title>

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
        </a-modal>
      </template>
    </template>
  </app-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// import JSZip from 'jszip';
import { API_BASE_PATH, BASE_PATH_APP_URL } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

// Import Vue FilePond
import vueFilePond from 'vue-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

import draggable from 'vuedraggable';
import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';
import List from '../components/List.vue';
import ListItemCandidates from '../components/ListItemCandidates.vue';

import IconSearch from '../components/icons/Search.vue';
import IconEdit from '../components/icons/Edit.vue';
import IconDel from '../components/icons/Del.vue';
import IconShare from '../components/icons/Share.vue';
import IconMore from '../components/icons/More.vue';
// import IconComment from '../components/icons/Comment.vue';
import IconBoard from '../components/icons/Board.vue';
import IconPlus from '../components/icons/Plus.vue';
import IconArrowDown from '../components/icons/ArrowDown.vue';
import IconBlank from '../components/icons/Blank.vue';
import IconDownload from '../components/icons/Download.vue';

const FilePond = vueFilePond(FilePondPluginFileValidateType);

export default {
  name: 'Jobs',

  components: {
    draggable,
    AppPage,
    PageTitle,
    AppButton,
    Card,
    List,
    ListItemCandidates,
    IconSearch,
    IconEdit,
    IconDel,
    IconShare,
    IconMore,
    // IconComment,
    IconBoard,
    IconPlus,
    IconArrowDown,
    IconBlank,
    IconDownload,
    FilePond
  },

  data() {
    return {
      API_BASE_PATH,
      BASE_PATH_APP_URL,
      pageLoading: false,
      loadRemoveJob: false,
      loadActiveChange: false,
      isInviteModalVisible: false,
      loadUpdateCandidateStatusId: null,
      token: '',
      exportVideos: [],
      isExportVideoVisible: false,
      viewType:
        localStorage.getItem(`view_type_${this.$route.params.id}`) || 'LIST',
      // boardViewType: 'PIPE',
      quickNote: {
        visible: false,
        note: '',
        responseId: null,
        isUpload: false
      },
      filter: {
        search: '',
        statuses: [],
        submitted: [],
        ranking: [],
        pipeline: [],
        rate: []
      },
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
      //     value: 'es',
      //     title: 'Spanish (ES)'
      //   },
      //   {
      //     value: 'it',
      //     title: 'Italian (IT)'
      //   },
      //   {
      //     value: 'ar',
      //     title: 'Arabic (AR)'
      //   }
      // ],
      loadInvite: false,
      data: {
        name: { value: '', status: '' },
        email: { value: '', status: '' },
        phone: { value: '', status: '' },
        note: { value: '', status: '' },
        cv: { value: [], status: '' },
        cvv: '',
        language: { value: this.$i18n.locale, status: '' },
        isSendInvite: true
      },
      jobInfo: {},
      downloadVideosLoading: false
      // boardColumns: []
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE ${this.pageTitle ? `| ${this.pageTitle}` : ''}`
    };
  },

  watch: {
    async '$route.path'() {
      this.pageLoading = true;
      await this.getJob();
      this.pageLoading = false;

      const filterCache = sessionStorage.getItem(
        `filter-cache-${this.$route.params.id}`
      );

      if (filterCache) {
        this.filter = JSON.parse(filterCache);
      } else {
        this.filter = {
          search: '',
          statuses: [],
          submitted: [],
          ranking: [],
          pipeline: [],
          rate: []
        };
      }
    },

    filter: {
      deep: true,
      handler() {
        sessionStorage.setItem(
          `filter-cache-${this.$route.params.id}`,
          JSON.stringify(this.filter)
        );
      }
    }
  },

  computed: {
    pageTitle() {
      return this.jobInfo.name;
    },

    responses() {
      const {
        filter: { search, statuses, ranking, pipeline, rate },
        jobInfo: { responses }
      } = this;

      return responses
        .filter((response) => {
          const name = response.name.toLowerCase();
          const searchText = search.toLowerCase();

          return name.indexOf(searchText) >= 0 ? response : false;
        })
        .filter(function (response) {
          if (statuses.length) {
            return this.indexOf(response.status) >= 0;
          } else {
            return response;
          }
        }, statuses)
        .filter(function (response) {
          if (ranking.length) {
            return this.indexOf(String(response.rating)) >= 0;
          } else {
            return response;
          }
        }, ranking)
        .filter(function (response) {
          if (pipeline.length) {
            if (response.pipeline !== null) {
              return this.indexOf(response.pipeline.id) >= 0;
            }
          } else {
            return response;
          }
        }, pipeline)
        .filter(function (response) {
          if (rate.length) {
            return this.indexOf(String(response.rate.text)) >= 0;
          } else {
            return response;
          }
        }, rate);
    },

    boardColumns() {
      const {
        filter: { search, statuses, ranking, rate },
        jobInfo: { pipelines, responses }
      } = this;

      const filtredResponses = responses
        .filter((response) => {
          const name = response.name.toLowerCase();
          const searchText = search.toLowerCase();

          return name.indexOf(searchText) >= 0 ? response : false;
        })
        .filter(function (response) {
          if (statuses.length) {
            return this.indexOf(response.status) >= 0;
          } else {
            return response;
          }
        }, statuses)
        .filter(function (response) {
          if (ranking.length) {
            return this.indexOf(String(response.rating)) >= 0;
          } else {
            return response;
          }
        }, ranking)
        .filter(function (response) {
          if (rate.length) {
            return this.indexOf(String(response.rate.text)) >= 0;
          } else {
            return response;
          }
        }, rate)
        .sort((a, b) => a.pipelineIndex - b.pipelineIndex);

      const columns = pipelines.map(({ id, name }) => ({
        pipelineId: id,
        title: name,
        tasks: []
      }));

      columns.forEach((item, index) => {
        filtredResponses.forEach((res) => {
          if (res.pipeline && res.pipeline.id === item.pipelineId) {
            columns[index].tasks.push(res);
          }
        });
      });

      return columns;
    },

    languages() {
      return this.$store.state.app.lng;
    },

    ...mapState({
      isEnterprise: ({ user }) => user.plan.name === 'Enterprise'
    })
  },

  async created() {
    this.pageLoading = true;
    await this.getJob();
    this.pageLoading = false;

    const filterCache = sessionStorage.getItem(
      `filter-cache-${this.$route.params.id}`
    );

    if (filterCache && filterCache.pipeline !== undefined) {
      this.filter = JSON.parse(filterCache);
    } else {
      this.filter = {
        search: '',
        statuses: [],
        submitted: [],
        ranking: [],
        pipeline: [],
        rate: []
      };
    }
  },

  mounted() {
    this.token = localStorage.getItem('access_token');
  },

  methods: {
    onChangeFilterStatuses(value) {
      this.filter.statuses = value;
    },

    onChangeFilterSubmitted(value) {
      this.filter.submitted = value;
    },

    onChangeFilterRanking(value) {
      this.filter.ranking = value;
    },

    onChangeFilterRate(value) {
      this.filter.rate = value;
    },

    onChangeFilterPipeline(value) {
      this.filter.pipeline = value;
    },

    clearFilters() {
      this.filter.search = '';
      this.filter.status = [];
      this.filter.submitted = [];
      this.filter.ranking = [];
      this.filter.pipeline = [];
      this.filter.rate = [];
    },

    openQuickNote(id) {
      const noteText = this.jobInfo.responses.find(
        (response) => response.id === id
      ).note;

      this.quickNote.visible = true;
      this.quickNote.responseId = id;
      this.quickNote.note = noteText;
    },

    closeQuickNote() {
      this.quickNote.visible = false;
      this.quickNote.isUpload = false;
      this.quickNote.note = '';
      this.quickNote.responseId = null;
    },

    onChangePipe(e) {
      if (e.added) {
        const { element } = e.added;
        const pipe = this.boardColumns.find((col) =>
          col.tasks.find((res) => res.id === element.id)
        );
        const newIndex = pipe.tasks.findIndex((res) => res.id === element.id);

        this.handleChangeCandidatePipelineStatus({
          id: element.id,
          pipelineId: pipe.pipelineId,
          index: newIndex
        });
      }

      if (e.moved) {
        const { element } = e.moved;
        const pipe = this.boardColumns.find((col) =>
          col.tasks.find((res) => res.id === element.id)
        );
        const newIndex = pipe.tasks.findIndex((res) => res.id === element.id);

        this.handleChangeCandidatePipelineStatus({
          id: element.id,
          pipelineId: pipe.pipelineId,
          index: newIndex
        });
      }
    },

    closeInviteModal() {
      this.data = {
        name: { value: '', status: '' },
        email: { value: '', status: '' },
        phone: { value: '', status: '' },
        note: { value: '', status: '' },
        cv: { value: [], status: '' },
        cvv: '',
        language: { value: this.$i18n.locale, status: '' },
        isSendInvite: true
      };
      this.isInviteModalVisible = false;
    },

    onChangeLanguage(val) {
      this.data.language.value = val;
    },

    onChangeViewType(type) {
      localStorage.setItem(`view_type_${this.jobInfo.id}`, type);
      this.viewType = type;
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

    onOpenCandidat(id) {
      let routeData = this.$router.resolve({
        path: `/jobs/candidate/${id}`
      });
      window.open(routeData.href, '_blank');
    },

    onloadCvFilepond(res) {
      this.data.cvv = res;
    },

    closeExportVideo() {
      this.isExportVideoVisible = false;
      this.exportVideos = [];
    },

    async handleDowloadVideos() {
      this.downloadVideosLoading = true;
      const res = await apiRequest(
        `job/exports/videos/${this.jobInfo.id}`,
        'GET',
        null,
        true
      );
      this.downloadVideosLoading = false;

      const { data } = res.response;
      const vd = [];

      for (const [, { name, email, ...videos }] of Object.entries(data)) {
        console.log(name, email);

        vd.push(
          ...Object.keys(videos).map((key) => ({
            name: name,
            videoId: +key + 1,
            url: videos[key]
          }))
        );
      }

      this.exportVideos = vd;
      this.isExportVideoVisible = true;

      // Promise.all(vd.map(({ url }) => fetch(url)))
      //   .then((responses) => {
      //     return Promise.all(responses.map((res) => res.blob())).then(
      //       (blobs) => {
      //         return blobs;
      //       }
      //     );
      //   })
      //   .then((blobs) => {
      //     const zip = new JSZip();

      //     blobs.forEach((blob, i) => {
      //       zip.file(`${vd[i].name}-${vd[i].videoId}.mp4`, blob);
      //     });

      //     zip.generateAsync({ type: 'base64' }).then((content) => {
      //       const link = document.createElement('a');
      //       link.href = 'data:application/zip;base64,' + content;
      //       link.download = 'Videos.zip';
      //       document.body.appendChild(link);
      //       link.click();
      //       document.body.removeChild(link);

      //       this.downloadVideosLoading = false;
      //     });
      //   })
      //   .finally(() => {
      //     this.downloadVideosLoading = false;
      //   });
    },

    async handleSubmitForm() {
      try {
        const valid = this.checkForm();

        if (valid) {
          const body = new FormData();
          const id = this.$route.params.id;
          const {
            data: { name, email, phone, language, isSendInvite, cvv, note }
          } = this;

          body.append('job_id', id);
          body.append('name', name.value);
          body.append('email', email.value);
          body.append('language', language.value);
          body.append('send_invite', Number(isSendInvite));

          if (cvv) {
            body.append('filepond', cvv);
          }

          if (phone.value) {
            body.append('phone', phone.value);
          }

          if (note.value) {
            body.append('note', note.value);
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
            this.closeInviteModal();
            this.getJob();
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

    async onChangeRating(id, rating) {
      try {
        const body = new FormData();

        body.append('response_id', id);
        body.append('rating', rating);

        await apiRequest('response/add/rating', 'POST', body, true);
      } catch (error) {
        console.log('onChangeRating', error);
      }
    },

    async handleDeleteInteview() {
      try {
        const jobId = this.$route.params.id;

        this.loadRemoveJob = true;
        const res = await apiRequest(`job/remove/${jobId}`, 'POST', null, true);
        this.loadRemoveJob = false;

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
          this.getCompanies();
          this.getJobs();
          this.$router.push('/');
        }
      } catch (error) {
        console.log('handleDeleteInteview:', error);
      }
    },

    async onChangeActive(val) {
      try {
        const body = new FormData();
        const {
          jobInfo: { id }
        } = this;

        body.append('job_id', id);
        body.append('active', Number(val));

        this.loadActiveChange = true;
        const res = await apiRequest('job/active', 'POST', body, true);
        this.loadActiveChange = false;

        this.getJob();

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
        console.log('onChangeActive:', error);
      }
    },

    async handleChangeCandidateStatus({ id, status }) {
      try {
        const body = new FormData();
        body.append('response_id', id);
        body.append('status', status);

        this.loadUpdateCandidateStatusId = id;
        const res = await apiRequest(
          'response/change/status',
          'POST',
          body,
          true
        );

        const { error, response } = res;

        this.loadUpdateCandidateStatusId = null;

        if (!error) {
          await this.getJob();
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
        this.loadUpdateCandidateStatusId = null;
        console.log('handleChangeCandidateStatus:', error);
      }
    },

    async handleChangeCandidatePipelineStatus({ id, pipelineId, index }) {
      try {
        const body = new FormData();
        body.append('response_id', id);
        body.append('pipeline_id', pipelineId);

        if (index !== undefined) {
          body.append('pipeline_index', index);
        }

        this.loadUpdateCandidateStatusId = id;
        const res = await apiRequest(
          'response/change/pipeline',
          'POST',
          body,
          true
        );

        const { error, response } = res;

        this.loadUpdateCandidateStatusId = null;
        if (!error) {
          await this.getJob();
        }

        if (response.message && index === undefined) {
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

        // if (index !== undefined) {
        //   const boardContainer = document.querySelector(
        //     '.ghost-draggable-card'
        //   );
        //   boardContainer.click();
        //   boardContainer.click();
        //   boardContainer.click();
        //   boardContainer.focus();
        //   boardContainer.focus();
        //   boardContainer.focus();
        // }
      } catch (error) {
        this.loadUpdateCandidateStatusId = null;
        console.log('handleChangeCandidateStatus:', error);
      }
    },

    async onDeleteResponse({ id }) {
      this.loadUpdateCandidateStatusId = id;
      await apiRequest(`response/remove/${id}`, 'POST', null, true);
      await this.getJob();
      this.loadUpdateCandidateStatusId = null;
    },

    async onInvite({ id }) {
      this.loadUpdateCandidateStatusId = id;
      await apiRequest(`response/send/invite/${id}`, 'POST', null, true);
      await this.getJob();
      this.loadUpdateCandidateStatusId = null;
    },

    async handleSaveQuickNote() {
      try {
        const body = new FormData();
        const {
          quickNote: { note, responseId }
        } = this;

        body.append('note', note);
        body.append('response_id', responseId);

        this.quickNote.isUpload = true;
        const res = await apiRequest('response/add/note', 'POST', body, true);
        await this.getJob();
        this.quickNote.isUpload = false;

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
          this.closeQuickNote();
        }
      } catch (error) {
        console.log('handleSaveQuickNote:', error);
      }
    },

    async getJob() {
      try {
        const jobId = this.$route.params.id;

        const res = await apiRequest(`job/get/${jobId}`, 'GET', null, true);

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

          const parsedJob = parseJobs(data);
          this.jobInfo = parsedJob;

          // this.boardColumns = parsedJob.pipelines.map(({ id, name }) => ({
          //   pipelineId: id,
          //   title: name,
          //   tasks: []
          // }));

          // this.boardColumns.forEach((item, index) => {
          //   parsedJob.responses.forEach((res) => {
          //     if (res.pipeline && res.pipeline.id === item.pipelineId) {
          //       this.boardColumns[index].tasks.push(res);
          //     }
          //   });
          // });
        }
      } catch (error) {
        console.log('getJob:', error);
      }
    },

    ...mapActions({
      getCompanies: 'company/getCompanies',
      getJobs: 'jobs/getJobs'
    })
  }
};
</script>

<style lang="scss">
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

.quick-note-modal {
  .ant-modal-body {
    padding: 35px 35px 0;
  }

  .ant-modal-footer {
    display: flex;
    padding: 20px 35px 35px;
    text-align: left;
    border-top: 0;
    justify-content: space-between;

    .app-button {
      max-width: 120px;
      width: 100%;
    }
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

.export-csv {
  text-align: right;

  @media (max-width: $md) {
    text-align: left;
  }
}

.page-actions-col {
  @media (max-width: $lg) {
    margin-top: 10px;
  }
}

.page-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: $lg) {
    justify-content: flex-start;
  }

  @media (max-width: $sm) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  .button-block {
    @media (max-width: $sm) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}

.column-width {
  min-width: 320px;
}

.board {
  display: grid;
}

.board-container {
  margin-top: 10px;
  width: 100%;
  display: flex;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: auto;
}

.board-coll {
  min-width: 300px;
  width: 300px;
  padding: 8px;
  background: #f5f5f5;
  margin: 5px;
  padding: 15px;
  border-radius: 5px;
  height: 100vh;
  max-height: calc(100vh - 283px);
}

.board-coll-title {
  margin-bottom: 10px;
  color: #909090;
  font-weight: 400;
}

.ghost-draggable {
  opacity: 0.5;
  background: #f7fafc;
}

.ghost-draggable-col {
  min-height: 125px;
  padding-bottom: 30px;
  height: 100%;
  overflow-y: auto;
}

.ghost-draggable-card {
  position: relative;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
  user-select: none;

  +.ghost-draggable-card {
    margin-top: 18px;
  }

  // &::after {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  // }
}

.ghost-draggable-card-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.ghost-draggable-card-item {
  display: flex;
  align-items: center;
}

.ghost-draggable-card-item-rate {
  display: inline-block;
  position: relative;
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
  background-color: $grayish-blue-400;

  &.ghost-draggable-card-item-rate-good {
    b {
      background-color: $green;
    }
  }

  &.ghost-draggable-card-item-rate-middling {
    b {
      background-color: $orange;
    }
  }

  &.ghost-draggable-card-item-rate-bad {
    b {
      background-color: $red;
    }
  }
}

.ghost-draggable-card-item-stars {
  margin-top: -5px;
}

.toggle-response-view {
  display: flex;
  align-items: center;
  background-color: transparent;
  border-color: transparent;

  &:hover {
    background-color: #fff;
    border-color: #fff;
  }

  &.toggle-response-view-active {
    color: #4c485e;
    background-color: #fff;
    border-color: #fff;
  }

  svg {
    margin-bottom: 0;
  }
}

.ghost-draggable-card-info-header {
  display: flex;
  justify-content: space-between;
}

.ghost-draggable-card-info-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.ghost-draggable-card-info-header-link {
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-left: 8px;
    margin-bottom: -2px;
    width: 14px;
    height: 14px;
  }
}

.unstuled-list {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-bottom: 35px;

  li {
    +li {
      margin-top: 10px;
    }
  }
}
</style>
