<template>
  <a-modal
    centered
    width="620px"
    :visible="visible"
    :footer="null"
    @cancel="handleClose"
  >
    <a-spin :spinning="loading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

      <page-title tag="h2" size="16">
        {{ info.question }}
      </page-title>

      <template v-if="info.video && info.video.recognitionText">
        <p class="mb-5 text-size-10">
          {{ $t('recognized_text_by') }}
        </p>

        <p class="text-size-14">
          {{ info.video.recognitionText }}
        </p>
      </template>

      <a-row type="flex" :gutter="[10, 10]">
        <a-col :sm="{ span: 20 }">
          <div class="rate-container">
            <b>
              {{ `${$t('answer_rating')}:` }}
            </b>

            <div class="rate-buttons">
              <a-button
                type="link"
                :class="[
                  'px-0',
                  'mr-10',
                  { 'rate-button-current': info.rate === 'good' }
                ]"
                @click.stop="handleRate('good')"
              >
                <icon-check class="mr-5 small"></icon-check>
                <span>
                  {{ $t('good') }}
                </span>
              </a-button>

              <a-button
                type="link"
                :class="[
                  'px-0',
                  'mr-10',
                  { 'rate-button-current': info.rate === 'middling' }
                ]"
                @click.stop="handleRate('middling')"
              >
                <icon-question-round class="mr-5 small"></icon-question-round>
                <span>
                  {{ $t('middling') }}
                </span>
              </a-button>

              <a-button
                type="link"
                :class="[
                  'px-0',
                  'mr-10',
                  { 'rate-button-current': info.rate === 'bad' }
                ]"
                @click.stop="handleRate('bad')"
              >
                <icon-remove class="mr-5 small"></icon-remove>
                <span>
                  {{ $t('bad') }}
                </span>
              </a-button>
            </div>
          </div>
        </a-col>

        <!-- <a-col :sm="{ span: 4 }" class="self-center">
          <div class="rate-ai">
            <b class="mr-5">AI</b>
            <icon-lighting></icon-lighting>
            <b class="text-black">-</b>
          </div>
        </a-col> -->
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest';

import PageTitle from './PageTitle.vue';

import IconCheck from './icons/Check.vue';
import IconQuestionRound from './icons/QuestionRound.vue';
import IconRemove from './icons/Remove.vue';
// import IconLighting from './icons/Lighting.vue';

export default {
  name: 'CandidateAnswersRateModal',

  components: {
    PageTitle,
    IconCheck,
    IconQuestionRound,
    IconRemove
    // IconLighting
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    answerId: {
      type: [Number, String],
      required: true
    },

    info: {
      type: Object,
      required: true
    }

    // questionInfo: {
    //   type: Object,
    //   required: true
    // }
  },

  data() {
    return {
      loading: false
    };
  },

  methods: {
    async handleRate(rate) {
      try {
        const body = new FormData();
        const { answerId } = this;

        body.append('answer_id', answerId);
        body.append('rate', rate);

        this.loading = true;
        const res = await apiRequest('video/rate', 'POST', body, true);
        this.loading = false;

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
          this.$emit('update-info');
          this.handleClose();
        }
      } catch (error) {
        console.log('handleRate:', error);
        this.loading = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss">
.rate-container {
  display: flex;
  align-items: center;
}

.rate-buttons {
  margin-left: 10px;
  display: flex;
  align-items: center;

  .ant-btn {
    &:hover {
      svg {
        fill: lighten(#373151, 20%);
      }
    }

    svg {
      fill: #373151;
    }

    &.rate-button-current {
      &:hover {
        svg {
          fill: lighten(#fda94c, 10%);
        }
      }
      svg {
        fill: #fda94c;
      }
    }
  }
}

.rate-ai {
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  line-height: 1;
  color: #f539f9;

  svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
    margin-right: 5px;
  }
}
</style>
