<template>
  <app-page class="page-interview-process" :loading="pageLoading">
    <template v-if="interview.id">
      <div class="page-interview-process-header">
        <a-row :gutter="{ lg: 20, sm: 10, xs: 10 }">
          <a-col :span="12">
            <a-row :gutter="[0, 20]">
              <a-col :span="24">
                <a-row type="flex" align="middle" :gutter="[0, 10]">
                  <a-col :span="24">
                    <span>{{ interview.company.name }}</span>
                  </a-col>

                  <a-col :span="24">
                    <PageTitle tag="h2" size="25" style="margin-bottom: 0px;">
                      {{ interview.name }}
                    </PageTitle>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-col>

          <a-col :span="12">
            <div class="page-interview-process-header-avatar">
              <a-avatar :size="65" :src="interview.company.logo">
                <icon-user-default-avatar />
              </a-avatar>
            </div>
          </a-col>
        </a-row>
      </div>

      <card class="page-interview-process-content">
        <a-row class="page-interview-process-content-row" type="flex" :gutter="[20, 20]">
          <!-- Question details -->
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }" class="d-flex flex-column">
            <progress-bar :percent="((step + 1) * 100) / interview.questions.length" class="orange mb-10">
              <template slot="label">
                {{
                  `${step + 1}/${interview.questions.length} ${$t('questions')}`
                }}
              </template>
            </progress-bar>

            <!-- Question postion -->
            <a-row :gitter="20" class="mb-20">
              <a-col :span="12">
                <page-title tag="div" size="16" class="mb-0-i">
                  {{ `${$t('question')} ${step + 1}` }}
                </page-title>
              </a-col>
            </a-row>

            <div v-if="question.preparationTime &&
              question.preparationTime !== 'Unlim' &&
              !isPreparation &&
              !stepPreparePassed
              ">
              <icon-time width="50" />
              <page-title tag="div" size="20" style="white-space: pre-line; line-height: 1.4;">
                {{
                  $t('Time to prepare for the answer is limited!', {
                    time: question.preparationTime
                  })
                }}
              </page-title>
            </div>

            <template v-else>
              <!-- Question title -->
              <page-title tag="div" size="20" style="white-space: pre-line;">
                {{ question.question }}
              </page-title>

              <a-row :gutter="[20, 20]">
                <a-col v-if="question.imageFilePreview" :span="24" :sm="question.videoQuestionLink ? 12 : 24">
                  <div class="interview-image-question">
                    <a :href="question.imageFilePreview" data-fancybox="gallery" style="cursor: zoom-in;">
                      <img :src="question.imageFilePreview" :alt="question.question" />
                    </a>
                  </div>
                </a-col>

                <a-col v-if="question.videoQuestionLink" :span="24" :sm="question.imageFilePreview ? 12 : 24">
                  <div class="interview-video-question">
                    <!-- <video-player
                      :key="question.videoQuestionLink"
                      :src="question.videoQuestionLink"
                      :options="{ controls: ['play-large'] }"
                      isAutoplay
                    /> -->
                    <video :key="question.videoQuestionLink" controls crossorigin playsinline autoplay width="100%">
                      <source :src="question.videoQuestionLink" />
                    </video>
                  </div>
                </a-col>
              </a-row>
            </template>
          </a-col>

          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <!-- Question info -->
            <a-row :gitter="20" class="mb-20">
              <a-col :span="12">
                <page-title tag="div" size="16" class="mb-0-i">
                  {{ $t('Answer time') }}:
                </page-title>
              </a-col>

              <a-col :span="12">
                <div class="grayish-blue-400 d-flex align-items-center justify-content-end">
                  <icon-time width="14px" heigh="14px" style="fill: currentColor" />

                  <span class="timer-value-wrapper" v-if="stepDuration">
                    <b :class="[
                        'timer-value',
                        {
                          'timer-value-large':
                            Math.floor(
                              currentStepRecordDuration - stepDuration
                            ) <= 10 &&
                            Math.floor(
                              currentStepRecordDuration - stepDuration
                            ) !== 0
                        }
                      ]">
                      {{
                        (currentStepRecordDuration - stepDuration) | timeInHours
                      }}
                    </b>
                  </span>

                  <span v-else>
                    <b>{{ question.time }}</b>
                  </span>
                </div>
              </a-col>
            </a-row>

            <!-- Question types -->
            <div class="video-placeholder">
              <!-- Video question -->
              <template v-if="question.type === 'VIDEO'">
                <!-- <video-player v-if="useFile" :src="filePreviewSrc" /> -->
                <video class="ios-video-preview" v-if="useFile && filePreviewSrc" :src="filePreviewSrc" controls
                  crossorigin playsinline />

                <video-record v-if="!useFile" ref="videoRecorder" :duration="currentStepRecordDuration"
                  :preview-exists="!!data[step]" :preview-play="previewPlay" @player-init="onPlayerInit"
                  @device-ready="onDeviceReady" @device-error="onDeviceError" @use-file="handleUserFile"
                  @progress-record="onProgressRecordChange" @start-recording="onStartRecording"
                  @finish-recording="onFinishRecording" @preview-play="togglePlayPreview" />
              </template>

              <!-- Quiz question -->
              <interview-quiz v-if="question.type === 'TEST' && stepPreparePassed" ref="interviewQuiz" :options="question.tests.map(({ test_id, text }) => ({
                  label: text,
                  value: test_id
                }))
                " @result="onGetQuizResult" />

              <!-- Code question -->
              <div v-if="question.type === 'CODE' && stepPreparePassed">
                <page-title tag="div" size="16">
                  {{ `${$t('write_your_answer_here')}:` }}
                </page-title>

                <code-editor ref="interviewCodeEditor" @result="onGetCodeResult" />
              </div>

              <!-- Text question -->
              <div v-if="question.type === 'TEXT' && stepPreparePassed">
                <page-title tag="div" size="16">
                  {{ `${$t('write_your_answer_here')}:` }}
                </page-title>

                <text-editor ref="interviewTextEditor" @result="onGetTextResult" />
              </div>
            </div>
          </a-col>

          <a-divider />

          <a-col :span="24">
            <!-- Preparation controls -->
            <div v-if="question.preparationTime &&
              question.preparationTime !== 'Unlim' &&
              !stepPreparePassed
              " class="page-interview-process-prepare-actions">
              <app-button type="primary" size="large" class="mr-10 hover-light"
                :disabled="isPreparation && !stepPreparePassed" :style="{
                    backgroundColor: style.btnColor,
                    borderColor: style.btnColor
                  }" @click="startPreparation">
                <template v-if="isPreparation && !stepPreparePassed">
                  {{ $t('Left') }}
                  {{
                    (currentStepPrepareDuration - stepPrepareDuration)
                    | timeInHours
                  }}
                </template>

                <template v-else>
                  {{ $t('Show question') }}
                </template>
              </app-button>

              <app-button v-if="isPreparation && !stepPreparePassed" type="link" size="small" class="mt-10"
                @click="onSkipPreparationTime">
                {{ $t('Skip preparation time') }}
              </app-button>
            </div>

            <template v-else>
              <!-- Video question controls -->
              <div v-if="question.type === 'VIDEO'" class="page-interview-process-actions">
                <template v-if="deviceReady">
                  <!-- Start / Stop buttons -->
                  <template v-if="!data[step] && !useFile">
                    <app-button v-if="!videoRecord" type="primary" size="large" class="mr-10 hover-light"
                      :loading="videoRecordStartLoading || loadDeviceUpdate" :style="{
                          backgroundColor: style.btnColor,
                          borderColor: style.btnColor
                        }" @click="startRecord">
                      {{ $t('record_video') }}
                    </app-button>

                    <app-button v-if="videoRecord" type="primary" size="large" class="mr-10 hover-light" :style="{
                        backgroundColor: style.btnColor,
                        borderColor: style.btnColor
                      }" @click="stopRecord">
                      {{ $t('stop_record_video') }}
                    </app-button>
                  </template>

                  <!-- Record video -->
                  <app-button v-if="!data[step] && useFile" type="primary" size="large" class="mr-10 hover-light" :style="{
                      backgroundColor: style.btnColor,
                      borderColor: style.btnColor
                    }" @click="handleChoseFile">
                    {{ isMobileSafari ? $t('record_video') : $t('chose_file') }}
                  </app-button>

                  <!-- Next step -->
                  <app-button v-if="data[step] && !isFinally" type="primary" size="large" class="mr-10 hover-light"
                    :loading="videoRecordStartLoading" :style="{
                        backgroundColor: style.btnColor,
                        borderColor: style.btnColor
                      }" @click="handleNext">
                    {{ $t('next_question') }}
                  </app-button>

                  <!-- Finish interview -->
                  <app-button v-if="data.length === interview.questions.length && isFinally
                    " type="primary" size="large" class="mr-10 hover-light" :style="{
      backgroundColor: style.btnColor,
      borderColor: style.btnColor
    }" @click="handleFinish">
                    {{ $t('finish') }}
                  </app-button>

                  <!-- Re-take video -->
                  <a-popconfirm v-if="data[step] &&
                    question.retake &&
                    question.preparationTime === 'Unlim'
                    " :title="$t('are_you_sure_you_want_to_overwrite_the_video')" @confirm="reRecord">
                    <app-button type="primary" size="large" ghost :style="{
                        borderColor: style.btnColor
                      }">
                      <icon-reload width="14" heigh="14" :fill="style.btnColor" class="mr-5" />
                      {{ $t('re_take') }}
                    </app-button>
                  </a-popconfirm>
                </template>
              </div>

              <div v-if="['TEST', 'TEXT', 'CODE'].indexOf(question.type) >= 0" class="page-interview-process-actions">
                <!-- Next step -->
                <app-button v-if="!isFinally" type="primary" size="large" class="mr-10 hover-light" :style="{
                    backgroundColor: style.btnColor,
                    borderColor: style.btnColor
                  }" @click="handleNext">
                  {{ $t('next_question') }}
                </app-button>

                <!-- Finish interview -->
                <app-button v-if="isFinally" type="primary" size="large" class="mr-10 hover-light" :style="{
                    backgroundColor: style.btnColor,
                    borderColor: style.btnColor
                  }" @click="handleFinish">
                  {{ $t('finish') }}
                </app-button>
              </div>
            </template>
          </a-col>
        </a-row>
      </card>
    </template>
  </app-page>
</template>

<script>
import { mapMutations } from 'vuex';
import { BASE_PATH_APP_URL } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest.js';
import parseJobs from '../js/helpers/parseJobs.js';

import AppPage from '../components/AppPage.vue';
import Card from '../components/Card.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import ProgressBar from '../components/ProgressBar.vue';
import VideoRecord from '../components/VideoRecord.vue';
// import VideoPlayer from '../components/VideoPlayer.vue';
import InterviewQuiz from '../components/InterviewQuiz.vue';
import CodeEditor from '../components/CodeEditor.vue';
import TextEditor from '../components/TextEditor.vue';

import IconUserDefaultAvatar from '../components/icons/UserDefaultAvatar.vue';
import IconReload from '../components/icons/Reload.vue';
import IconTime from '../components/icons/Time.vue';

export default {
  name: 'InterviewProcess',

  components: {
    AppPage,
    Card,
    PageTitle,
    AppButton,
    ProgressBar,
    VideoRecord,
    // VideoPlayer,
    InterviewQuiz,
    CodeEditor,
    TextEditor,
    IconUserDefaultAvatar,
    IconReload,
    IconTime
  },

  filters: {
    timeInHours(val) {
      const sec = parseInt(val, 10);
      let hours = Math.floor(sec / 3600); // get hours
      let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
      let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      return hours + ':' + minutes + ':' + seconds;
    }
  },

  data() {
    return {
      BASE_PATH_APP_URL,
      pageLoading: false,
      deviceReady: false,
      deviceError: false,
      useFile: false,
      isMobileSafari: false,
      videoRecord: false,
      videoRecordStartLoading: false,
      loadDeviceUpdate: false,
      previewPlay: false,
      isPreparation: false,
      stepPreparePassed: false,
      preparationInterval: null,
      recognition: null,
      calcTimeInterval: null,
      filePreviewSrc: '',
      step: 0,
      stepPrepareDuration: 0,
      stepDuration: 0,
      recognitionText: '',
      data: []
    };
  },

  computed: {
    interview() {
      return this.$store.state.interview.info;
    },

    question() {
      const { questions } = this.interview;
      const question = questions[this.step];

      return question;
    },

    style() {
      const { style } = this.interview;

      return style;
    },

    currentStepPrepareDuration() {
      const {
        step,
        interview: { questions }
      } = this;

      const seconds = (h, m, s) => h * 60 * 60 + m * 60 + +s;
      return Number(seconds(...questions[step].preparationTime.split(':')));
    },

    currentStepRecordDuration() {
      const {
        step,
        interview: { questions }
      } = this;

      const seconds = (h, m, s) => h * 60 * 60 + m * 60 + +s;
      return Number(seconds(...questions[step].time.split(':')));
    },

    isFinally() {
      return this.step + 1 === this.interview.questions.length;
    }
  },

  async created() {
    const isMobileSafari = this.сheckIsMobileOrTablet();
    this.isMobileSafari = !!isMobileSafari;

    if (!this.interview.id) {
      await this.getInterviewInfo();
    } else {
      setTimeout(() => {
        const { questions } = this.interview;
        const question = questions[0];

        if (!question.preparationTime || question.preparationTime === 'Unlim') {
          this.stepPreparePassed = true;
        }

        if (
          ['TEST', 'TEXT', 'CODE'].indexOf(question.type) >= 0 &&
          (!question.preparationTime || question.preparationTime === 'Unlim')
        ) {
          this.calcTime();
        }
      }, 500);
    }
  },

  watch: {
    step(s) {
      const { questions } = this.interview;
      const question = questions[s];

      if (!question.preparationTime || question.preparationTime === 'Unlim') {
        this.stepPreparePassed = true;
      }

      if (
        ['TEST', 'TEXT', 'CODE'].indexOf(question.type) >= 0 &&
        (!question.preparationTime || question.preparationTime === 'Unlim')
      ) {
        this.calcTime();
      }

      if (this.recognition !== null && question?.lngbcp !== 'Default') {
        this.recognition.lang = question?.lngbcp || '';
      }
    }
  },

  mounted() {
    if ('speechSynthesis' in window) {
      const SpeechRecognition =
        window.speechRecognition || window.webkitSpeechRecognition;

      this.recognition = new SpeechRecognition();
      this.recognition.interimResults = false;
      this.recognition.continuous = true;

      if (this.question?.lngbcp !== 'Default') {
        this.recognition.lang = this.question?.lngbcp || '';
      }

      this.recognition.onresult = (e) => {
        let result = '';

        for (let i = 0; i < e.results.length; i++) {
          result = `${result}${result.length ? '.' : ''}${e.results[i][0].transcript
            }`;
        }

        this.recognitionText = result;
      };

      this.recognition.onend = () => {
        this.$nextTick(() => {
          const { step, data } = this;
          const answer = data[step];

          answer.transcript = this.recognitionText;
          this.recognitionText = '';
        });
      };
    } else {
      console.log('Speech recognition not supported 😢');
    }
  },

  methods: {
    calcTime() {
      clearInterval(this.calcTimeInterval);
      this.calcTimeInterval = null;

      this.$nextTick().then(() => {
        this.calcTimeInterval = setInterval(() => {
          this.stepDuration = this.stepDuration + 1;

          if (this.currentStepRecordDuration === this.stepDuration) {
            this.handleNext();
            this.stepDuration = 0;
            clearInterval(this.calcTimeInterval);
            this.calcTimeInterval = null;
          }
        }, 1000);
      });
    },

    onPlayerInit() {
      this.$refs.videoRecorder.getDevice();
    },

    onDeviceReady() {
      this.deviceReady = true;
      this.loadDeviceUpdate = false;
    },

    getUrl(file) {
      return URL.createObjectURL(file);
    },

    onDeviceError() {
      this.deviceError = true;
    },

    handleUserFile() {
      this.deviceReady = true;
      this.useFile = true;
    },

    onProgressRecordChange(sec) {
      this.stepDuration = sec;
    },

    onStartRecording() {
      this.videoRecordStartLoading = false;
      this.videoRecord = true;

      if (this.recognition) {
        this.recognition.start();
      }
    },

    onFinishRecording(file) {
      this.videoRecord = false;
      this.videoRecordEndLoading = false;

      const {
        step,
        interview: { questions }
      } = this;

      const question = questions[step];

      this.data.push({
        id: question.question_id,
        type: 'VIDEO',
        file,
        question: question.question
      });

      if (this.recognition) {
        this.recognition.stop();
      }
    },

    // recognitionOnResult(e) {
    // console.log(e.results, 'e.results');
    // setTimeout(() => {
    //   const transcript = e.results[0][0].transcript;
    //   const { step, data } = this;
    //   const answer = data[step];

    //   answer.transcript = transcript;
    // }, 1500);
    // },

    startPreparation() {
      this.isPreparation = true;

      this.preparationInterval = setInterval(() => {
        this.stepPrepareDuration = this.stepPrepareDuration + 1;

        if (this.stepPrepareDuration >= this.currentStepPrepareDuration) {
          clearInterval(this.preparationInterval);
          this.preparationInterval = null;
          this.stepPreparePassed = true;

          if (this.question.type === 'VIDEO' && !this.useFile) {
            this.startRecord();
          }

          if (['TEST', 'TEXT', 'CODE'].indexOf(this.question.type) >= 0) {
            this.calcTime();
          }
        }
      }, 1000);
    },

    onSkipPreparationTime() {
      clearInterval(this.preparationInterval);
      this.preparationInterval = null;
      this.stepPreparePassed = true;

      if (this.question.type === 'VIDEO' && !this.useFile) {
        this.startRecord();
      }

      if (['TEST', 'TEXT', 'CODE'].indexOf(this.question.type) >= 0) {
        this.calcTime();
      }
    },

    startRecord() {
      this.previewPlay = false;
      this.videoRecordStartLoading = true;
      this.$refs.videoRecorder.startRecord();
    },

    stopRecord() {
      this.previewPlay = false;
      this.videoRecordEndLoading = true;
      this.$refs.videoRecorder.stopRecord();
    },

    handleChoseFile() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.capture = 'user';
      input.className = 'record-video-file';

      if (this.isMobileSafari) {
        document.body.appendChild(input);
        input.addEventListener('change', this.onFileChose);
      } else {
        input.onchange = this.onFileChose;
      }

      input.click();
    },

    onFileChose(e) {
      const file = e.target.files[0];
      const video = document.createElement('video');
      video.preload = 'metadata';

      if (this.isMobileSafari) {
        document
          .querySelector('.record-video-file')
          .removeEventListener('change', this.onFileChose);

        document.querySelector('.record-video-file').remove();
      }

      video.onloadedmetadata = () => {
        const duration = video.duration;
        if (duration > this.currentStepRecordDuration) {
          this.$notification.warning({
            message: this.$t('notify.warning'),
            description: this.$t('maximum_video_length.notify', {
              duration: this.currentStepRecordDuration
            }),
            icon: () => <icon-error class="warning-icon" />
          });
        } else {
          const {
            step,
            interview: { questions }
          } = this;

          const question = questions[step];

          this.data.push({
            id: question.question_id,
            type: 'VIDEO',
            file,
            question: question.question
          });

          this.filePreviewSrc = video.src;
          this.stepDuration = duration;
        }
      };

      video.src = URL.createObjectURL(file);
    },

    reRecord() {
      const {
        step,
        useFile,
        interview: { questions }
      } = this;

      if (!useFile) {
        this.previewPlay = false;
        this.$refs.videoRecorder.deleteRecordVideo();
        this.data[step].file = '';
      } else {
        this.filePreviewSrc = '';
      }

      this.stepDuration = 0;
      this.data = this.data.filter(
        (data) => data.id !== questions[step].question_id
      );
    },

    togglePlayPreview(val) {
      this.previewPlay = val;
    },

    onGetQuizResult(val) {
      // if (!val.length) {
      //   this.$notification.warning({
      //     message: this.$t('notify.warning'),
      //     description: this.$t('notify.please_select_an_answer_option'),
      //     icon: () => <icon-error class="warning-icon" />
      //   });
      // } else {
      const { question } = this;
      const answers = question.tests.map(({ test_id, text }) => ({
        test_id,
        text,
        correct: val.indexOf(test_id) >= 0 ? 1 : 0
      }));

      this.data.push({
        id: question.question_id,
        type: 'TEST',
        tests: answers,
        question: question.question
      });

      if (this.isFinally) {
        const {
          data,
          $route: {
            params: { hash }
          }
        } = this;

        this.SET_INTERVIEW_ANSWERS(data);
        this.$router.push(`/i/done/${hash}`);
      } else {
        this.step++;
        this.stepDuration = 0;
        this.stepPrepareDuration = 0;
        this.isPreparation = false;
        this.stepPreparePassed = false;
      }
      // }
    },

    onGetCodeResult(val) {
      // if (!val.length) {
      //   this.$notification.warning({
      //     message: this.$t('notify.warning'),
      //     description: this.$t('notify.please_write_code'),
      //     icon: () => <icon-error class="warning-icon" />
      //   });
      // } else {
      const { question } = this;

      this.data.push({
        id: question.question_id,
        type: 'CODE',
        answer: val,
        question: question.question
      });

      if (this.isFinally) {
        const {
          data,
          $route: {
            params: { hash }
          }
        } = this;

        this.SET_INTERVIEW_ANSWERS(data);
        this.$router.push(`/i/done/${hash}`);
      } else {
        this.step++;
        this.stepDuration = 0;
        this.stepPrepareDuration = 0;
        this.isPreparation = false;
        this.stepPreparePassed = false;
      }
      // }
    },

    onGetTextResult(val) {
      // if (!val.length) {
      //   this.$notification.warning({
      //     message: this.$t('notify.warning'),
      //     description: this.$t('notify.please_write_text'),
      //     icon: () => <icon-error class="warning-icon" />
      //   });
      // } else {
      const { question } = this;

      this.data.push({
        id: question.question_id,
        type: 'TEXT',
        answer: val,
        question: question.question
      });

      if (this.isFinally) {
        const {
          data,
          $route: {
            params: { hash }
          }
        } = this;

        this.SET_INTERVIEW_ANSWERS(data);
        this.$router.push(`/i/done/${hash}`);
      } else {
        this.step++;
        this.stepDuration = 0;
        this.stepPrepareDuration = 0;
        this.isPreparation = false;
        this.stepPreparePassed = false;
      }
      // }
    },

    handleNext() {
      if (this.question.type === 'VIDEO') {
        if (this.useFile) {
          this.filePreviewSrc = '';
        } else {
          this.loadDeviceUpdate = true;
          this.$refs.videoRecorder.deleteRecordVideo();
        }

        this.stepDuration = 0;
        this.step++;
        this.stepPrepareDuration = 0;
        this.isPreparation = false;
        this.stepPreparePassed = false;
      } else if (this.question.type === 'TEST') {
        this.$refs.interviewQuiz.returnResult();
      } else if (this.question.type === 'CODE') {
        this.$refs.interviewCodeEditor.returnResult();
      } else if (this.question.type === 'TEXT') {
        this.$refs.interviewTextEditor.returnResult();
      }

      clearInterval(this.calcTimeInterval);
      this.calcTimeInterval = null;

      if (this.interview.blockTry) {
        const {
          params: { hash }
        } = this.$route;
        const formData = new FormData();
        formData.append('block', 1);

        apiRequest(`interview/block/${hash}`, 'POST', formData);
      }
    },

    handleFinish() {
      if (this.question.type === 'VIDEO') {
        const {
          data,
          $route: {
            params: { hash }
          }
        } = this;

        this.SET_INTERVIEW_ANSWERS(data);
        window.scrollTo(0, 0);
        this.$router.push(`/i/done/${hash}`);
      } else if (this.question.type === 'TEST') {
        this.$refs.interviewQuiz.returnResult();
      } else if (this.question.type === 'CODE') {
        this.$refs.interviewCodeEditor.returnResult();
      } else if (this.question.type === 'TEXT') {
        this.$refs.interviewTextEditor.returnResult();
      }
    },

    /* eslint-disable no-useless-escape */
    сheckIsMobileOrTablet() {
      return (
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/)
      );
    },

    handleCopyLink() {
      this.$refs.interviewLink.$el.select();
      this.$refs.interviewLink.$el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.getSelection().removeAllRanges();

      this.$notification.success({
        message: this.$t('notify.success'),
        description: this.$t('notify.link_added_to_clipboard'),
        icon: () => <icon-success class="success-icon" />
      });
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
            data: { job, response: user }
          } = response;

          this.SET_INTERVIEW_INFO(parseJobs(job, true));

          if (user) {
            this.SET_INTERVIEW_USER_INFO({
              id: user.id,
              email: user.email,
              phone: user.phone,
              name: user.full || ''
            });
          }

          this.SET_APP_LOADING();

          setTimeout(() => {
            const { questions } = this.interview;
            const question = questions[0];

            if (
              !question.preparationTime ||
              question.preparationTime === 'Unlim'
            ) {
              this.stepPreparePassed = true;
            }

            if (
              ['TEST', 'TEXT', 'CODE'].indexOf(question.type) >= 0 &&
              (!question.preparationTime ||
                question.preparationTime === 'Unlim')
            ) {
              this.calcTime();
            }
          }, 500);
        }
      } catch (error) {
        console.log('getInterviewInfo:', error);
      }
    },

    ...mapMutations({
      SET_APP_LOADING: 'app/SET_APP_LOADING',
      SET_INTERVIEW_INFO: 'interview/SET_INTERVIEW_INFO',
      SET_INTERVIEW_USER_INFO: 'interview/SET_INTERVIEW_USER_INFO',
      SET_INTERVIEW_ANSWERS: 'interview/SET_INTERVIEW_ANSWERS'
    })
  }
};
</script>

<style lang="scss">
.page-interview-process {
  background-color: #fff;

  .app-page-header {
    display: none;
  }

  .app-page-inner {
    padding: 50px 0;
  }
}

.ios-video-preview {
  width: 100%;
  height: auto;
}

// .page-interview-process-back {
//   text-align: right;

//   @media (max-width: $sm) {
//     margin-top: 25px;
//     text-align: left;
//   }

//   .app-button {
//     border: 0;
//     box-shadow: 0 8px 16px -8px rgba(46, 13, 104, 0.4);

//     &:hover {
//       box-shadow: 0 8px 16px -8px rgba(46, 13, 104, 0.6);
//     }
//   }
// }

.page-interview-process-actions {
  display: flex;
  justify-content: center;
  margin-top: auto;

  @media (max-width: $sm) {
    flex-direction: column;
    align-items: center;
  }

  .app-button {
    &:not(:last-of-type) {
      @media (max-width: $sm) {
        margin-right: 0 !important;
        margin-bottom: 10px;
      }
    }
  }
}

.page-interview-process-actions-devider {
  margin: 40px 0 30px;
  width: 100px;
  height: 2px;
  background-color: $grayish-blue-400;
}

// .no-suppoet-message {
//   margin: 20px 0;
//   font-size: 14px;
//   color: $red;

//   a {
//     color: $gray-300;
//     text-decoration: underline;
//     text-decoration-style: dashed;

//     &:hover {
//       color: lighten($gray-300, 5%);
//     }
//   }
// }

.record-video-file,
.copy-hidden {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -10;
  opacity: 0;
  visibility: hidden;
}

// .page-interview-header {
//   .page-title {
//     color: #adadad;
//   }
// }

.page-interview-process-header-avatar {
  text-align: right;
}

.page-interview-process-content {
  position: relative;
  margin-top: 60px;
  padding: 50px 0;
  background: transparent;
  box-shadow: none;
  border-radius: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100vw;
    width: 500vw;
    height: 100%;
    background-color: rgba(#e2e1e9, 0.25);
  }

  .card-inner {
    min-height: 330px;
  }
}

.page-interview-process-content-row {
  min-height: 330px;
}

// .timer-value-wrapper {
// display: flex;
// align-items: center;
// }

.timer-value {
  transition: 0.2s;
  margin-left: 3px;
  color: #dd2705;
}

.timer-value-large {
  font-size: 18px;
}

.interview-image-question {
  width: 100%;
  // margin-bottom: 20px;

  img {
    width: 100%;
  }
}

.interview-video-question {
  width: 100%;
  // margin-bottom: 20px;
}

.page-interview-process-prepare-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
