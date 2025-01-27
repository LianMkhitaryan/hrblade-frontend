<template>
  <app-page class="page-candidate" :key="$route.params.id" :loading="pageLoading">
    <template v-if="info.id && !pageLoading">
      <template slot="header">
        <a-breadcrumb class="mb-5" separator=">">
          <a-breadcrumb-item>
            <router-link to="/">
              {{ $t('breadcrumbs.jobs') }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            <router-link :to="`/jobs/vacancy/${info.job.id}`">
              {{ info.job.name }}
            </router-link>
          </a-breadcrumb-item>

          <a-breadcrumb-item>
            {{ info.name }}
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div class="mb-20">
          <a-row type="flex" :gutter="20">
            <a-col :span="16">
              <div class="page-candidate-title">
                <page-title class="mb-0-i">{{ info.name }}</page-title>

                <a-rate v-if="info.answers.length" v-model="rating" class="large" @change="onChangeRating" />

                <div v-if="info.overallCompatibility" class="candidate-compatibility">
                  <icon-zap />
                  {{ `${info.overallCompatibility} %` }}
                </div>
              </div>
            </a-col>

            <a-col :span="8" class="change-candidate-col">
              <div class="change-candidate-container">
                <a-button class="change-candidate-btn" @click="prevCandidate">
                  <icon-chevron-left />
                </a-button>

                <a-button class="change-candidate-btn" @click="nextCandidate">
                  <icon-chevron-right />
                </a-button>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-row :gutter="{ lg: 20, sm: 10, xs: 10 }">
          <a-col :span="24" class="page-candidate-header-actions">
            <app-button class="list-item-candidates-status-btn" @click.stop.prevent="isPipelinesVisible = true">
              <b>{{ $t(`response_status.${info.status.toLowerCase()}`) }}</b>
              <span v-if="info.pipelineId">
                {{
                  pipelines.find((item) => item.id === info.pipelineId) &&
                  pipelines.find((item) => item.id === info.pipelineId).name
                }}
              </span>
            </app-button>

            <!-- <app-button
              type="primary"
              size="large"
              class="mr-10"
              :loading="loadUpdateCandidateStatus.accepted"
              @click="handleChangeCandidateStatus('ACCEPTED')"
            >
              {{ $t('accept') }}
            </app-button>

            <app-button
              size="large"
              class="mr-10"
              :loading="loadUpdateCandidateStatus.rejected"
              @click="handleChangeCandidateStatus('REJECTED')"
            >
              {{ $t('reject') }}
            </app-button>

            <app-button
              size="large"
              class="mr-10"
              :loading="loadUpdateCandidateStatus.wait"
              @click="handleChangeCandidateStatus('WAIT')"
            >
              {{ $t('to_think') }}
            </app-button> -->

            <app-button size="large" class="page-candidate-header-actions-right"
              style="padding: 0 20px; max-width: 180px;" @click="handleShareCandidateAnswers">
              {{ $t('showcase') }}
              <icon-share class="ml-10" />
            </app-button>

            <a-input ref="сandidateAnswersLink" class="visually-hidden" readonly
              :value="`https://app.hrblade.com/s/${info.shareHash}`" />

            <app-button size="large" class="page-candidate-header-actions-right"
              style="padding: 0 20px; max-width: 180px;" @click="onOpenSendEmail">
              {{ $t('Send a message') }}
            </app-button>

            <a-popconfirm :title="`${$t('are_you_sure')}?`"
              class="button-block-item page-candidate-header-actions-right-margin"
              @confirm="() => onDeleteResponse(info.id)">
              <a-button type="link" class="px-0 mb-0-i">
                <icon-del class="small fill-danger mr-5" />
                {{ $t('delete') }}
              </a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </template>

      <a-row :gutter="[40, 20]">
        <a-col :md="12" :span="24">
          <list class="user-card-list">
            <list-item-info :label="`${$t('phone')}:`" :value="info.phone" />

            <list-item-info :label="`${$t('email')}:`" :value="info.email" />
          </list>

          <div class="user-card-files">
            <a v-if="info.defaultCv" :href="info.defaultCv" download="cv" target="_blank">
              <icon-file />
              {{ $t('download_cv') }}
            </a>

            <a v-if="info.cv" :href="info.cv" download="cv" target="_blank">
              <icon-file />
              {{ $t('download_cv') }}
            </a>

            <a v-if="info.motivationLetter" :href="info.motivationLetter" download="cv" target="_blank">
              <icon-file />
              {{ $t('download_motivational_letter') }}
            </a>
          </div>
        </a-col>

        <a-col v-if="info.competences.length" :md="12" :span="24">
          <div v-for="competense in info.competences" :key="competense.id" class="competense-progress">
            <a-popover trigger="hover" placement="bottom" destroy-tooltip-on-hide
              overlay-class-name="score-details-popover" @mouseenter="onScorePopoverShow(competense)">
              <template slot="content">
                <page-title size="16">
                  {{ scoreDetail.scoreName }}
                </page-title>

                <list class="score-details-list">
                  <list-item-info v-for="(score, index) in scoreDetail.userScores" :key="index" :label="score.user.name"
                    :value="`${score.score}%`" class="score-details-list-item" />

                  <li class="list-item-info score-details-list-item-total">
                    <span class="list-item-info-label">
                      {{ $t('total') }}
                    </span>

                    <span class="list-item-info-value">
                      {{
                        scoreDetail.totalScore.length
                        ? `${scoreDetail.totalScore.reduce(
                          (a, b) => a + b,
                          0
                        ) / scoreDetail.totalScore.length}%`
                        : '-'
                      }}
                    </span>
                  </li>

                  <li class="list-item-info score-details-list-item-match">
                    <span class="list-item-info-label">
                      {{ $t('match') }} <icon-zap />
                    </span>

                    <span class="list-item-info-label-ideal">
                      {{ `${$t('ideal_profile')} ${scoreDetail.idealScore} %` }}
                    </span>

                    <span class="list-item-info-value">
                      {{
                        `${scoreDetail.scoreCompatibility.length
                          ? `${scoreDetail.scoreCompatibility.reduce(
                            (a, b) => a + b,
                            0
                          ) / scoreDetail.scoreCompatibility.length}%`
                          : '-'
                        }`
                      }}
                    </span>
                  </li>
                </list>
              </template>

              <div class="competense-progress-title">
                {{ competense.name }}
              </div>

              <a-progress :showInfo="false" :percent="competense.value"
                :success-percent="getTotalCompetenseScore(competense.id)" />

              <div class="competense-progress-value">
                {{
                  `${getTotalCompetenseCompatibility(competense.id).toFixed(
                    0
                  )} %`
                }}
              </div>
            </a-popover>
          </div>

          <app-button type="link" class="set-score-button" @click="scoreModalVisible = true">
            <icon-zap />
            {{ $t('set_you_score') }}
          </app-button>
        </a-col>
      </a-row>

      <template v-if="info.answers.length">
        <a-row class="mt-20">
          <a-col :span="24">
            <candidate-answers :data="info" @change-answer="onChangeCandidateAnswer" @update-info="getInfo" />
          </a-col>
        </a-row>

        <a-row class="mt-10">
          <a-col :md="{ offset: 12, span: 12 }" :span="24">
            <a-row type="flex" align="middle" :gutter="20">
              <a-col v-if="this.info.answers.filter((answer) => answer.type === 'VIDEO')
                  .length
                " :sm="{ span: 10, order: 1 }" :span="24" order="2">
                <app-button type="link" class="pl-0" :loading="downloadVideosLoading" @click="handleDowloadVideos">
                  <icon-download class="mr-5" />
                  {{ $t('download_videos') }}
                </app-button>
              </a-col>

              <a-col :sm="{ span: 14, order: 2 }" :span="24" order="1">
                <div v-if="isPast(addDays(new Date(info.createdAt), 90))" class="vide-delete-message text-gray-300">
                  {{
                    $t('video_was_deleted_on', {
                      date: format(
                        addDays(new Date(info.createdAt), 90),
                        'dd/MM/yyyy'
                      )
                    })
                  }}
                </div>

                <div v-else class="vide-delete-message text-gray-300">
                  {{
                    `${$t('video_content_automatically_deleted')} ${format(
                      addDays(new Date(info.createdAt), 90),
                      'dd/MM/yyyy'
                    )}`
                  }}
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </template>

      <card class="mt-10">
        <a-row :gutter="[{ md: 20 }, { md: 0, sm: 10, xs: 10 }]">
          <a-col :md="16" :span="24">
            <page-title tag="h3" size="16">
              {{ $t('comments') }}
            </page-title>

            <a-row :gutter="[{ sm: 20 }, { sm: 0, xs: 20 }]">
              <a-col :span="24">
                <a-form @submit.prevent="handleSaveComments">
                  <a-form-item class="comment-input" has-feedback :validate-status="comments.status">
                    <a-input v-model="comments.value" :placeholder="$t('placeholders.leave_a_comment')" />

                    <app-button html-type="submit" :loading="isUploadComments">
                      <icon-send />
                    </app-button>
                  </a-form-item>
                </a-form>
              </a-col>
            </a-row>

            <div class="mt-10">
              <div v-for="comment in info.comments" :key="comment.id" class="comment-wrapper">
                <a-spin :spinning="comment.id === deleteCommentId">
                  <a-comment>
                    <a slot="author">{{ comment.user.name }}</a>

                    <div slot="datetime">
                      <span>
                        {{
                          format(
                            new Date(comment.createdAt),
                            'dd.MM.yyyy HH:mm'
                          )
                        }}
                      </span>

                      <a-popconfirm v-if="comment.canRemove" :title="`${$t('are_you_sure')}?`"
                        @confirm="handleDeleteComments(comment.id)">
                        <a href="#" class="comment-action">
                          <icon-del />
                        </a>
                      </a-popconfirm>
                    </div>

                    <a-avatar slot="avatar" :src="comment.user.avatar" :alt="comment.user.name" />

                    <p slot="content">
                      {{ comment.comment }}
                    </p>
                  </a-comment>
                </a-spin>
              </div>
            </div>
          </a-col>

          <a-col :md="8" :span="24">
            <page-title tag="h3" size="16">
              {{ $t('notes') }}
            </page-title>

            <!-- <p class="text-gray-300">
                {{
                  $t('notes_are_only_visible_to_those_inside_your_organisation')
                }}
              </p> -->

            <a-form>
              <a-form-item has-feedback :validate-status="comment.status">
                <a-input v-model="comment.value" type="textarea" class="fill"
                  :placeholder="$t('placeholders.description')" />
              </a-form-item>

              <a-form-item class="mb-0-i">
                <app-button :loading="isUploadComment" @click="handleSaveComment">
                  {{ $t('save') }}
                </app-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </card>
    </template>

    <a-modal v-model="isEmailModalVisible" class="email-modal" centered destroyOnClose :footer="false"
      @cancel="closeEmailModal">
      <a-row>
        <a-col :span="24">
          <page-title tag="h3" size="25" class="mb-15">
            {{ `${$t('Send E-mail to')} ${info.name}` }}
          </page-title>
        </a-col>

        <a-col :span="24" class="mt-10">
          <a-row :gutter="[20, 10]">
            <a-col :span="24">
              <a-form-item has-feedback :label="emailData.language.value && $t('language')"
                :validate-status="emailData.language.status">
                <a-select :placeholder="$t('language')" :defaultActiveFirstOption="false"
                  :value="emailData.language.value" @change="(val) => (emailData.language.value = val)">
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
            </a-col>

            <a-col :span="24">
              <a-form-item has-feedback :label="emailData.template.value && $t('Offer template')"
                :validate-status="emailData.template.status">
                <a-select :placeholder="$t('Offer template')" :defaultActiveFirstOption="false"
                  :value="emailData.template.value" @change="(val) => (emailData.template.value = val)">
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

                  <a-select-option v-for="(template, index) in companyTemplates" :key="index" :value="template.type">
                    {{ template.messages[$i18n.locale].name || template.type }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item>
                <a-checkbox :checked="emailData.isSendSms" @change="(e) => (emailData.isSendSms = e.target.checked)">
                  {{ $t('Send SMS') }}
                </a-checkbox>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <app-button block @click="closeEmailModal">
                {{ $t('cancel') }}
              </app-button>
            </a-col>

            <a-col :span="12">
              <app-button type="primary" block :loading="isEmailLoading" @click="handleSendEmail">
                {{ $t('send') }}
              </app-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>

    <a-modal centered width="420px" :footer="null" :visible="scoreModalVisible" @cancel="onCloseScoreModalVisible">
      <page-title tag="h2" size="16">
        {{ $t('set_you_score_to_candidate') }}
      </page-title>

      <a-row :gutter="[20, 20]">
        <a-col :span="24">
          <div v-for="(score, index) in dataScore" :key="index" class="rate-item">
            <div class="rate-item-title">
              {{ score.name }}
            </div>

            <a-rate v-model="score.value" class="medium" />
          </div>
        </a-col>

        <a-col :span="12">
          <app-button block @click="onCloseScoreModalVisible">
            {{ $t('cancel') }}
          </app-button>
        </a-col>

        <a-col :span="12">
          <app-button type="primary" block :loading="setScoresLoading" @click="handleSetScore">
            {{ $t('save') }}
          </app-button>
        </a-col>
      </a-row>
    </a-modal>

    <a-modal v-model="isPipelinesVisible" class="pipelines-modal" centered destroyOnClose :footer="false"
      :closable="false" @cancel="closePipelines">
      <a-row>
        <a-col :span="24">
          <page-title tag="h3" size="25" class="mb-15">
            {{ info.name }}
          </page-title>
        </a-col>

        <a-col :span="24">
          <a-row :gutter="[20, 20]">
            <a-col :span="12">
              <a-row>
                <a-col :span="24">
                  <page-title class="pipelines-modal-title" tag="h4" size="16">
                    <img src="../assets/rocket.png" width="15" alt="Pipeline" />
                    {{ $t('Pipeline') }}
                  </page-title>
                </a-col>

                <a-col :span="24">
                  <a-button v-for="item in pipelines" :key="item.id" :class="[
                      'pipelines-modal-btn',
                      {
                        'pipelines-modal-btn-current':
                          item.id === info.pipelineId
                      }
                    ]" block @click="onChangePipelineStatus(info.id, item.id)">
                    <b>
                      {{ item.name }}
                    </b>
                  </a-button>
                </a-col>
              </a-row>
            </a-col>

            <a-col :span="12">
              <a-row :gutter="[0, 10]">
                <a-col :span="24">
                  <page-title class="pipelines-modal-title" tag="h4" size="16">
                    <img src="../assets/video.png" width="20" alt="Status" />
                    {{ $t('status') }}
                  </page-title>
                </a-col>

                <a-col :span="24">
                  <a-button :class="[
                      'pipelines-modal-btn',
                      {
                        'pipelines-modal-btn-current': info.status === 'NEW'
                      }
                    ]" block type="link" @click.stop.prevent="changeCandidateStatus(info.id, 'NEW')">
                    <b>
                      {{ $t('response_status.new') }}
                    </b>
                  </a-button>

                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current': info.status === 'INVITED'
                    }
                  ]" block type="link" @click.stop.prevent="changeCandidateStatus(info.id, 'INVITED')
  ">
                    <b>
                      {{ $t('response_status.invited') }}
                    </b>
                  </a-button>

                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current':
                        info.status === 'ACCEPTED'
                    }
                  ]" block type="link" @click.stop.prevent="changeCandidateStatus(info.id, 'ACCEPTED')
  ">
                    <b>
                      {{ $t('response_status.accepted') }}
                    </b>
                  </a-button>

                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current':
                        info.status === 'REJECTED'
                    }
                  ]" block type="link" @click.stop.prevent="changeCandidateStatus(info.id, 'REJECTED')
  ">
                    <b>
                      {{ $t('response_status.rejected') }}
                    </b>
                  </a-button>

                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current': info.status === 'WAIT'
                    }
                  ]" block type="link" @click.stop.prevent="changeCandidateStatus(info.id, 'WAIT')">
                    <b>
                      {{ $t('response_status.wait') }}
                    </b>
                  </a-button>
                </a-col>

                <a-col v-if="info.status === 'NEW'" :span="24">
                  <app-button type="primary" @click="() => onInvite(info.id)">
                    {{ $t('Invite to interview') }}
                  </app-button>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
  </app-page>
</template>

<script>
import { format, addDays, isPast } from 'date-fns';
import JSZip from 'jszip';
import locales from '../js/plugins/date-fns.js';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';
import List from '../components/List.vue';
import ListItemInfo from '../components/ListItemInfo.vue';
import CandidateAnswers from '../components/CandidateAnswers.vue';

import IconDel from '../components/icons/Del.vue';
import IconFile from '../components/icons/File.vue';
import IconShare from '../components/icons/Share.vue';
import IconDownload from '../components/icons/Download.vue';
import IconChevronLeft from '../components/icons/ChevronLeft.vue';
import IconChevronRight from '../components/icons/ChevronRight.vue';
import IconArrowDown from '../components/icons/ArrowDown.vue';
import IconSend from '../components/icons/Send.vue';
import IconZap from '../components/icons/Zap.vue';

export default {
  name: 'Candidate',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    List,
    ListItemInfo,
    CandidateAnswers,
    IconDel,
    IconFile,
    IconShare,
    IconDownload,
    IconArrowDown,
    IconChevronLeft,
    IconChevronRight,
    IconSend,
    IconZap
  },

  data() {
    return {
      pageLoading: false,
      downloadVideosLoading: false,
      isUploadComments: false,
      isUploadComment: false,
      setScoresLoading: false,
      deleteCommentId: null,
      scoreModalVisible: false,
      isPipelinesVisible: false,
      isEmailModalVisible: false,
      pipelines: [],
      loadUpdateCandidateStatus: {
        accepted: false,
        rejected: false,
        wait: false
      },
      comments: { value: '', status: '' },
      comment: { value: '', status: '' },
      rating: 0,
      currentAnswerId: null,
      info: {},
      candidates: [],
      dataScore: [],
      scoreDetail: {
        scoreName: '',
        userScores: [],
        totalScore: [],
        scoreCompatibility: [],
        idealScore: 0
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
      //     name: 'es',
      //     title: 'Spanish (ES)'
      //   },
      //   {
      //     name: 'it',
      //     title: 'Italian (IT)'
      //   },
      //   {
      //     value: 'ar',
      //     title: 'Arabic (AR)'
      //   }
      // ],
      isEmailLoading: false,
      companyTemplates: [],
      emailData: {
        template: { value: 'INVITE', status: '' },
        language: { value: this.$i18n.locale, status: '' },
        isSendSms: true
      }
    };
  },

  metaInfo() {
    const candidateName = this.info.name;

    return {
      title: `HRBLADE ${candidateName ? '|' : ''} ${candidateName ? candidateName : ''
        }`
    };
  },

  watch: {
    async $route() {
      this.currentAnswerId = null;

      this.pageLoading = true;
      await this.getInfo();
      this.pageLoading = false;

      const {
        info: { rating, comment }
      } = this;

      this.rating = rating;
      this.comment.value = comment;
    }
  },

  computed: {
    answerText() {
      return this.currentAnswerId
        ? this.info.answers.find((answer) => answer.id === this.currentAnswerId)
          .text
        : this.info.answers[0].text;
    },

    userId() {
      return this.$store.state.user.info.id;
    },

    languages() {
      return this.$store.state.app.lng;
    }
  },

  beforeDestroy() {
    this.$store.commit('jobs/SET_VIEWED_JOB_ID', null);
  },

  async created() {
    this.pageLoading = true;
    await this.getInfo();
    this.pageLoading = false;

    const {
      info: { rating, comment }
    } = this;

    this.rating = rating;
    this.comment.value = comment;
  },

  methods: {
    format,
    addDays,
    isPast,

    closePipelines() {
      this.isPipelinesVisible = false;
    },

    onOpenSendEmail() {
      this.isEmailModalVisible = true;
    },

    closeEmailModal() {
      this.isEmailModalVisible = false;
    },

    async handleSendEmail() {
      const { template, language, isSendSms } = this.emailData;

      const body = new FormData();
      body.append(
        'template_id',
        this.companyTemplates.find(({ type }) => template.value === type)
          .messages[language.value].id
      );
      body.append('language', language.value);
      body.append('response_id', this.info.id);
      body.append('company_id', this.info.job.companyId);
      body.append('send_sms', Number(isSendSms));

      await apiRequest('templates/send', 'POST', body, true);

      this.closeEmailModal();
    },

    async changeCandidateStatus(id, status) {
      try {
        const body = new FormData();
        body.append('response_id', id);
        body.append('status', status);

        const res = await apiRequest(
          'response/change/status',
          'POST',
          body,
          true
        );

        const { error, response } = res;

        if (!error) {
          await this.getInfo();
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
        console.log('handleChangeCandidateStatus:', error);
      }
    },

    async onChangePipelineStatus(id, pipelineId) {
      try {
        const body = new FormData();
        body.append('response_id', id);
        body.append('pipeline_id', pipelineId);

        const res = await apiRequest(
          'response/change/pipeline',
          'POST',
          body,
          true
        );

        const { error, response } = res;

        if (!error) {
          await this.getInfo();
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
        console.log('handleChangeCandidateStatus:', error);
      }
    },

    async onDeleteResponse(id) {
      await apiRequest(`response/remove/${id}`, 'POST', null, true);
      this.$router.push(`/jobs/vacancy/${this.info.job.id}`);
    },

    async onInvite(id) {
      await apiRequest(`response/send/invite/${id}`, 'POST', null, true);
      await this.getInfo();
    },

    nextCandidate() {
      const {
        candidates,
        info: { id }
      } = this;

      const totalCandidates = candidates.length;
      const currentPosition = candidates.indexOf(id);

      if (totalCandidates === currentPosition + 1) {
        this.$router.push(`/jobs/candidate/${candidates[0]}`);
      } else {
        this.$router.push(`/jobs/candidate/${candidates[currentPosition + 1]}`);
      }
    },

    prevCandidate() {
      const {
        candidates,
        info: { id }
      } = this;

      const totalCandidates = candidates.length;
      const currentPosition = candidates.indexOf(id);

      if (currentPosition === 0) {
        this.$router.push(`/jobs/candidate/${candidates[totalCandidates - 1]}`);
      } else {
        this.$router.push(`/jobs/candidate/${candidates[currentPosition - 1]}`);
      }
    },

    onChangeCandidateAnswer(id) {
      this.currentAnswerId = id;
    },

    handleShareCandidateAnswers() {
      this.$refs.сandidateAnswersLink.$el.select();
      this.$refs.сandidateAnswersLink.$el.setSelectionRange(0, 99999);

      document.execCommand('copy');
      document.getSelection().removeAllRanges();

      this.$notification.success({
        message: this.$t('notify.success'),
        description: this.$t('notify.link_added_to_clipboard'),
        icon: () => <icon-success class="success-icon" />
      });
    },

    handleDowloadVideos() {
      const { answers } = this.info;

      const videos = answers
        .filter((answer) => answer.type === 'VIDEO')
        .map((answer) => answer.video.file);

      this.downloadVideosLoading = true;

      Promise.all(videos.map((url) => fetch(url)))
        .then((responses) => {
          return Promise.all(responses.map((res) => res.blob())).then(
            (blobs) => {
              return blobs;
            }
          );
        })
        .then((blobs) => {
          const zip = new JSZip();

          blobs.forEach((blob, i) => {
            zip.file(`video-${i}.mp4`, blob);
          });

          zip.generateAsync({ type: 'base64' }).then((content) => {
            const link = document.createElement('a');
            link.href = 'data:application/zip;base64,' + content;
            link.download = 'Videos.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.downloadVideosLoading = false;
          });
        });
    },

    onCloseScoreModalVisible() {
      this.scoreModalVisible = false;

      const userScores = this.info.scores.filter(
        (score) => score.user.id === this.userId
      );

      this.dataScore.forEach((item) => {
        item.value =
          userScores.length &&
            userScores.find((score) => score.competenceId === item.id)
            ? userScores.find((score) => score.competenceId === item.id).score /
            20
            : 0;
      });
    },

    getTotalCompetenseCompatibility(id) {
      const userCompatibilities = this.info.scores
        .filter((score) => score.competenceId === id)
        .map(({ compatibility }) => compatibility);

      if (!userCompatibilities.length) {
        return 0;
      }

      const userCompatibilitiesSum = userCompatibilities.reduce(
        (a, b) => a + b,
        0
      );

      const userCompatibilitiesPercent =
        userCompatibilitiesSum / userCompatibilities.length;

      return userCompatibilitiesPercent;
    },

    getTotalCompetenseScore(id) {
      const userScores = this.info.scores
        .filter((score) => score.competenceId === id)
        .map(({ score }) => score);

      if (!userScores.length) {
        return 0;
      }

      const userScoresSum = userScores.reduce((a, b) => a + b, 0);

      const userScoresPercent = userScoresSum / userScores.length;

      return userScoresPercent;
    },

    onScorePopoverShow(competense) {
      const scores = this.info.scores.filter(
        (score) => score.competenceId === competense.id
      );

      this.scoreDetail.userScores = scores;
      this.scoreDetail.scoreName = competense.name;
      this.scoreDetail.totalScore = scores.map((score) => score.score);
      this.scoreDetail.scoreCompatibility = scores.map(
        (score) => score.compatibility
      );
      this.scoreDetail.idealScore = this.info.competences.find(
        (competence) => competence.id === competense.id
      ).value;
    },

    async handleSetScore() {
      try {
        const {
          $route: {
            params: { id }
          },
          dataScore: scores
        } = this;

        const body = new FormData();

        body.append('response_id', id);

        scores.forEach((item) => {
          body.append(
            'scores[]',
            JSON.stringify({
              score_id: item.id,
              scores: item.value * 20
            })
          );
        });

        this.setScoresLoading = true;
        const res = await apiRequest('response/scores/add', 'POST', body, true);
        this.setScoresLoading = false;

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
          this.getInfo();
          this.onCloseScoreModalVisible();
        }
      } catch (error) {
        console.log(`handleSetScore`, error);
        this.setScoresLoading = false;
      }
    },

    async onChangeRating() {
      try {
        const {
          rating,
          info: { id }
        } = this;

        const body = new FormData();

        body.append('response_id', id);
        body.append('rating', rating);

        await apiRequest('response/add/rating', 'POST', body, true);
      } catch (error) {
        console.log('onChangeRating', error);
      }
    },

    // async handleChangeCandidateStatus(status) {
    //   try {
    //     const {
    //       info: { id }
    //     } = this;

    //     const body = new FormData();

    //     body.append('response_id', id);
    //     body.append('status', status);

    //     if (status === 'ACCEPTED') {
    //       this.loadUpdateCandidateStatus.accepted = true;
    //     } else if (status === 'REJECTED') {
    //       this.loadUpdateCandidateStatus.rejected = true;
    //     } else {
    //       this.loadUpdateCandidateStatus.wait = true;
    //     }

    //     const res = await apiRequest(
    //       'response/change/status',
    //       'POST',
    //       body,
    //       true
    //     );

    //     const { error, response } = res;

    //     if (!error) {
    //       await this.getInfo();

    //       if (status === 'ACCEPTED') {
    //         this.loadUpdateCandidateStatus.accepted = false;
    //       } else if (status === 'REJECTED') {
    //         this.loadUpdateCandidateStatus.rejected = false;
    //       } else {
    //         this.loadUpdateCandidateStatus.wait = false;
    //       }
    //     }

    //     if (response.message) {
    //       this.$notification[error ? 'warning' : 'success']({
    //         message: error
    //           ? this.$t('notify.warning')
    //           : this.$t('notify.success'),
    //         description: response.message,
    //         icon: () =>
    //           error ? (
    //             <icon-error class="error-icon" />
    //           ) : (
    //             <icon-success class="success-icon" />
    //           )
    //       });
    //     }
    //   } catch (error) {
    //     console.log('handleChangeCandidateStatus:', error);
    //   }
    // },

    async handleSaveComments() {
      const { comments } = this;

      comments.status = '';

      if (!comments.value) {
        comments.status = 'error';
      } else {
        try {
          const {
            info: { id }
          } = this;
          const body = new FormData();

          body.append('response_id', id);
          body.append('message', comments.value);

          this.isUploadComments = true;
          const res = await apiRequest(
            'response/comments/add',
            'POST',
            body,
            true
          );
          this.isUploadComments = false;

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
            comments.value = '';
            const { id, created_at, comment, user } = response.data;

            this.info.comments.unshift({
              id,
              createdAt: created_at,
              canRemove: true,
              comment,
              user: {
                id: user.id,
                name: user.name,
                avatar: user.profile_photo_url
              }
            });
          }
        } catch (error) {
          this.isUploadComments = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    },

    async handleDeleteComments(id) {
      try {
        this.deleteCommentId = id;
        const res = await apiRequest(
          `response/comments/remove/${id}`,
          'POST',
          null,
          true
        );
        this.deleteCommentId = null;

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
          this.info.comments = this.info.comments.filter(
            (comment) => comment.id !== id
          );
        }
      } catch (error) {
        this.deleteCommentId = null;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async handleSaveComment() {
      const { comment } = this;

      comment.status = '';

      if (!comment.value) {
        comment.status = 'error';
      } else {
        try {
          const {
            info: { id }
          } = this;
          const body = new FormData();

          body.append('response_id', id);
          body.append('comment', comment.value);

          this.isUploadComment = true;
          const res = await apiRequest(
            'response/add/comment',
            'POST',
            body,
            true
          );
          this.isUploadComment = false;

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
            const { comment } = response;
            this.info.comment = comment;
          }
        } catch (error) {
          console.log('handleSaveComment:', error);
          this.isUploadComment = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    },

    async getCompanyTemplates(id) {
      const res = await apiRequest(`templates/${id}`, 'GET', null, true);

      if (!res.error) {
        const { data } = res.response;

        const templates = [];

        for (const [key, value] of Object.entries(data)) {
          templates.push({
            type: key,
            messages: value
          });
        }

        this.companyTemplates = templates;
      }
    },

    async getInfo() {
      try {
        const {
          params: { id: candidateId }
        } = this.$route;

        const res = await apiRequest(
          `response/get/${candidateId}`,
          'GET',
          null,
          true
        );

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
          const {
            data: {
              id,
              job,
              created_at,
              completed_at,
              invited,
              location,
              full,
              phone,
              email,
              note: comment,
              comments,
              answers,
              rating,
              status,
              default_cv,
              ask_cv,
              ask_motivation_letter,
              share_hash,
              competences,
              scores,
              overall_compatibility,
              pipeline_id
            }
          } = response;

          this.getCompanyTemplates(job.company_id);

          console.log('answers', answers);

          this.info = {
            id,
            pipelineId: pipeline_id,
            job: parseJobs(job),
            createdAt: created_at,
            subittedAt: format(new Date(created_at), 'dd MMM yyyy', {
              locale: locales[this.$i18n.locale]
            }),
            completedAt: completed_at,
            invited: !!invited,
            location,
            name: full || email,
            phone,
            email,
            comment,
            comments: comments
              .map(({ id, created_at, can_remove, comment, user }) => ({
                id,
                createdAt: created_at,
                canRemove: can_remove,
                comment,
                user: {
                  id: user.id,
                  name: user.name,
                  avatar: user.profile_photo_url
                }
              }))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            answers: answers.map(
              ({
                id: answerId,
                question: {
                  id: questionId,
                  type,
                  is_count,
                  points,
                  question,
                  tests,
                  time,
                  sorting
                },
                negative,
                neutral,
                positive,
                copyscape_percent,
                copyscapes_count,
                copyscapes,
                ii_score,
                response_id,
                created_at,
                rate,
                answer,
                text,
                video,
                video_thumb,
                video_time
              }) => ({
                id: answerId,
                questionId,
                responseId: response_id,
                createdAt: created_at,
                type,
                rate,
                negative: negative ? Number(negative) : 0,
                neutral: neutral ? Number(neutral) : 0,
                positive: positive ? Number(positive) : 0,
                copyscapePercent: copyscape_percent,
                copyscapesCount: copyscapes_count,
                copyscapesList: copyscapes,
                iiScore: ii_score,
                answer:
                  type === 'TEST'
                    ? answer
                      .map(({ correct, test_id }) => !!correct && test_id)
                      .filter((answer) => answer)
                    : answer,
                points,
                is_count: !!is_count,
                question,
                sorting,
                time,
                video:
                  type === 'VIDEO'
                    ? {
                      file: video,
                      time: video_time,
                      thumb: video_thumb,
                      recognitionText: text
                    }
                    : null,
                tests:
                  type === 'TEST'
                    ? tests.map(({ id: testId, text, correct }) => ({
                      label: text,
                      value: testId,
                      correct: !!correct
                    }))
                    : null
              })
            ).sort((a, b) => a.sorting - b.sorting),
            rating,
            status,
            defaultCv: default_cv,
            cv: ask_cv,
            motivationLetter: ask_motivation_letter,
            shareHash: share_hash,
            competences: competences.map(({ id, name, score }) => ({
              id,
              name,
              value: score
            })),
            scores: scores.map(
              ({ id, competence_id, compatibility, scores, user }) => ({
                id,
                competenceId: competence_id,
                compatibility,
                score: scores,
                user: {
                  id: user.id,
                  name: user.name,
                  avatar: user.profile_photo_url
                }
              })
            ),
            overallCompatibility: overall_compatibility
          };

          const userScores = this.info.scores.filter(
            (score) => score.user.id === this.userId
          );

          this.dataScore = competences.map(({ id, name }) => ({
            id,
            name,
            value:
              userScores.length &&
                userScores.find((item) => item.competenceId === id)
                ? userScores.find((item) => item.competenceId === id).score / 20
                : 0
          }));

          this.$store.commit('jobs/SET_VIEWED_JOB_ID', this.info.job.id);
          this.getJob();
        }
      } catch (error) {
        console.log('getInfo: ', error);
      }
    },

    async getJob() {
      try {
        const {
          info: {
            job: { id }
          }
        } = this;

        const res = await apiRequest(`job/get/${id}`, 'GET', null, true);

        const { error } = res;

        if (!error) {
          const { data } = res.response;
          this.candidates = data.responses.map(({ id }) => id);
          this.pipelines = data.pipelines.map(({ id, name }) => ({ id, name }));
        }
      } catch (error) {
        console.log('getJob:', error);
      }
    }
  }
};
</script>

<style lang="scss">
.page-candidate-title {
  display: flex;
  align-items: center;

  @media (max-width: $lg) {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    @media (max-width: $lg) {
      margin-bottom: 5px;
    }
  }

  .ant-rate {
    margin-left: 20px;

    @media (max-width: $lg) {
      margin-left: 0;
      margin-bottom: 20px;
    }
  }
}

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

.page-companies-card-actions {
  svg {
    width: 18px;
    height: 18px;
    fill: $grayish-blue-300;
  }
}

.page-candidate-header-actions {
  display: flex;
  flex-wrap: wrap;

  @media (max-width: $sm) {
    flex-direction: column;
  }

  .app-button {
    @media (max-width: $sm) {
      margin-left: 0;
      margin-right: 0;
      max-width: 100% !important;
    }

    &:not(:last-of-type) {
      @media (max-width: $sm) {
        margin-bottom: 5px;
      }
    }
  }
}

.page-candidate-header-actions-right {
  margin-left: 10px;

  @media (max-width: $md) {
    margin-top: 10px;
    margin-left: 0;
  }
}

.page-candidate-header-actions-right-margin {
  margin-left: auto;

  @media (max-width: $md) {
    margin-top: 10px;
    margin-left: 0;
  }
}

.change-candidate-col {
  align-self: center;

  @media (max-width: $lg) {
    align-self: start;
  }
}

.change-candidate-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.change-candidate-btn {
  border: 0;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  &:hover {
    svg {
      fill: #000000;
    }
  }

  +.change-candidate-btn {
    margin-left: 10px;
  }

  svg {
    width: 16px;
    height: 16px;
    fill: #969696;
  }
}

.vide-delete-message {
  font-size: 10px;
  text-align: right;

  @media (max-width: $sm) {
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: left;
  }
}

.user-card-files {
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    align-items: center;
    font-size: 16px;

    +a {
      margin-top: 10px;
    }

    svg {
      width: 20px;
      height: 20px;
      margin-right: 15px;
      fill: currentColor;
    }
  }
}

.comment-wrapper {
  position: relative;
}

.comment-input {
  .ant-input {
    padding: 10px 60px 10px 15px;
    border-radius: 5px;
    border-bottom: 0;
    background-color: #f9f9fa;
  }

  .app-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(50% - 15px);
    right: 30px;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 0;
    background-color: transparent;
    box-shadow: none;

    &:hover {
      opacity: 0.7;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .ant-btn.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline):not(.ant-btn-icon-only) .anticon:not(:last-child) {
    display: inline-block;
    // margin: 0;
    width: 14px;
    height: 14px;
  }
}

.competense-progress {
  // display: flex;
  // align-items: center;

  +.competense-progress {
    margin-top: 10px;
  }

  >span {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
  }

  .ant-progress {
    margin: 0 40px;
  }

  .ant-progress-inner {
    overflow: visible;
    background-color: transparent;
  }

  .ant-progress-bg,
  .ant-progress-success-bg {
    border-radius: 0 !important;
    height: 1px !important;
  }

  .ant-progress-bg {
    background-color: #00bc01;
  }

  .ant-progress-success-bg {
    position: relative;
    top: auto;
    left: auto;
    background-color: #fda94c;
  }
}

.competense-progress-title {
  width: 130px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  color: #b6b7c6;
}

.competense-progress-value {
  width: 50px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 14px;
  color: #000000;
  text-align: right;
}

.set-score-button {
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 0;
  font-weight: 600;
  color: #373151;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 22px;
    height: 22px;
    margin-right: 10px;
    fill: #fda94c;
  }
}

.rate-item {
  display: flex;
  align-items: center;

  +.rate-item {
    margin-top: 10px;
  }
}

.rate-item-title {
  width: 200px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  color: #b6b7c6;
}

.ant-rate {
  margin-left: 15px;
}

.candidate-compatibility {
  display: flex;
  align-items: center;
  margin-left: 15px;
  font-weight: 600;
  color: #373151;

  @media (max-width: $lg) {
    margin-left: 0;
  }

  svg {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
}

.score-details-popover {
  width: 280px;

  .ant-popover-inner {
    max-height: 300px;
    overflow: auto;
  }
}

.score-details-list {}

.score-details-list-item {
  &:not(:last-of-type) {
    margin-bottom: 3px;
  }

  .list-item-info-label,
  .list-item-info-value {
    font-size: 13px;
    line-height: 1.25;
  }
}

.score-details-list-item-total {
  margin-top: 20px;
  margin-bottom: 5px !important;

  .list-item-info-label {
    font-size: 16px;
    color: #000000;
  }
}

.score-details-list-item-match {
  margin-top: 0;
  display: flex;
  align-items: center;

  .list-item-info-label {
    display: flex;
    align-items: center;

    svg {
      width: 16px;
      height: 16px;
      margin-left: 5px;
      fill: currentColor;
    }
  }
}

.list-item-info-label-ideal {
  margin-right: auto;
  font-size: 10px;
  color: #b6b7c6;
}

.list-item-candidates-status-btn {
  padding: 10px;
  height: auto !important;
  white-space: initial;
  line-height: 1;
  // text-align: left;

  b {
    display: block;
    margin-bottom: 2px;
  }

  span {
    line-height: 0.7;
    font-size: 12px;
  }
}

.pipelines-modal-btn {
  text-align: left;
  border: 0;
  box-shadow: none;
  padding-left: 25px;

  &:hover {
    background-color: #f8f8f8;
  }

  &.pipelines-modal-btn-current {
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transform: translateY(-50%);
      background-color: #ffab42;
    }
  }

  +.pipelines-modal-btn {
    margin-top: 10px;
  }
}

.page-candidate-header-actions-right,
.list-item-candidates-status-btn {
  display: block;
  max-width: 220px;
  width: 100%;
}
</style>
