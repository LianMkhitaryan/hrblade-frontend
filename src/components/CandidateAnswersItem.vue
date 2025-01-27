<template>
  <div :class="['candidate-answers-item', { active }]" @click.stop="$emit('change-answer', data.id)"
    :dir="this.$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="candidate-answers-item-body">
      <div class="candidate-answers-item-text">
        <p>
          {{ `${num}. ${data.question}` }}
        </p>

        <div class="candidate-answers-item-meta">
          <div v-if="data.type === 'VIDEO'" class="candidate-answers-item-time">
            <icon-time></icon-time>
            {{ data.video.time }}
          </div>

          <div v-if="data.iiScore !== null" class="candidate-answers-item-time">
            <icon-lighting style="color: #f539f9;" />
            {{ data.iiScore.toFixed(0) }}
          </div>

          <a-tooltip v-if="data.type === 'VIDEO' && data.video.recognitionText" class="recognition-text-tooltip"
            placement="top">
            <template slot="title">
              <span>{{ data.video.recognitionText }}</span>
            </template>
            <icon-alert></icon-alert>
          </a-tooltip>

          <div v-if="data.type === 'VIDEO' && data.video.recognitionText" class="candidate-answers-state">
            <div class="candidate-answers-state-item positive">
              <icon-smile :style="{ transform: `scale(1.${data.positive * 5})` }" />
              <span>{{ `${(data.positive * 100).toFixed(0)} %` }}</span>
            </div>

            <div class="candidate-answers-state-item neutral">
              <icon-meh :style="{ transform: `scale(1.${data.neutral * 5})` }" />
              <span>{{ `${(data.neutral * 100).toFixed(0)} %` }}</span>
            </div>

            <div class="candidate-answers-state-item negative">
              <icon-sad :style="{ transform: `scale(1.${data.negative * 5})` }" />
              <span>{{ `${(data.negative * 100).toFixed(0)} %` }}</span>
            </div>
          </div>

          <div v-if="data.copyscapesCount && data.copyscapesList" class="plagiarism-info">
            <div class="plagiarism-info-title">
              <icon-pen />
              Plagiarism:
              <button @click.prevent.stop="isPlagiarismSourcesVisible = true">
                {{
                  `${data.copyscapePercent}% (${data.copyscapesCount} sources)`
                }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <app-button type="link" :class="['candidate-answers-item-rate', data.rate]"
        @click.stop.prevent="$emit('open-rate', data.id)">
        <icon-star />
      </app-button>
    </div>

    <a-modal v-model="isPlagiarismSourcesVisible" centered destroyOnClose :footer="false"
      @cancel="isPlagiarismSourcesVisible = false">
      <a-row :gutter="[0, 20]">
        <a-col :span="24">
          <page-title tag="h2" size="25" class="mb-15">
            {{ $t('Plagiarism detection') }}
          </page-title>
        </a-col>

        <a-col :span="24">
          <a-row :gutter="[0, 10]">
            <a-col v-for="item in data.copyscapesList" :key="item.id" :span="24">
              <a :href="item.url" class="plagiarism-info-link" target="_blank" rel="noopener noreferrer">
                {{ item.url }}
              </a>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import AppButton from './AppButton.vue';
import PageTitle from './PageTitle.vue';

import IconTime from './icons/Time.vue';
import IconLighting from './icons/Lighting.vue';
import IconStar from './icons/Star.vue';
import IconAlert from './icons/Alert.vue';
import IconSmile from './icons/Smile.vue';
import IconSad from './icons/Sad.vue';
import IconMeh from './icons/Meh.vue';
import IconPen from './icons/Pen.vue';

export default {
  name: 'CandidateAnswersItem',

  components: {
    AppButton,
    PageTitle,
    IconTime,
    IconLighting,
    IconStar,
    IconAlert,
    IconSmile,
    IconSad,
    IconMeh,
    IconPen
  },

  props: {
    data: {
      type: Object,
      required: true
    },

    num: {
      type: Number,
      default: 1
    },

    active: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isPlagiarismSourcesVisible: false
    };
  }
};
</script>

<style lang="scss">
.candidate-answers-item {
  position: relative;
  background-color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.15s;

  &.active {
    background-color: #f9f9fa;

    &:hover {
      background-color: darken(#f9f9fa, 5%);
    }

    .candidate-answers-item-title,
    .candidate-answers-item-text {
      color: $black;
    }

    // .ant-btn-background-ghost.ant-btn-primary {
    //   color: $black;
    //   border-color: $black;
    // }
  }

  &:hover {
    background-color: rgba($gray-200, 0.8);
  }

  &:not(:first-of-type) {
    border-top: 1px solid #dedede;
  }
}

.candidate-answers-item-body {
  display: flex;
  // align-items: center;
  padding: 20px;

  @media (max-width: $sm) {
    padding-right: 20px;
  }
}

.candidate-answers-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.candidate-answers-item-title {
  font-size: 14px;
  color: $black;
  font-weight: 600;
}

.candidate-answers-item-time {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #969696;
  margin-right: 10px;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
    margin-right: 5px;
  }
}

.candidate-answers-item-ai {
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

.candidate-answers-item-text {
  display: flex;
  flex-direction: column;
  color: #969696;
  margin-right: 10px;

  p {
    margin-bottom: 0;
  }

  .app-button {
    margin-left: 10px;
  }
}

.candidate-answers-item-meta {
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.candidate-answers-item-indicator-rate {
  position: absolute;
  top: 50%;
  left: 15px;
  width: 3px;
  height: calc(100% - 46px);
  transform: translateY(-50%);
  border-radius: 3px;

  &.candidate-answers-item-indicator-rate-good {
    background-color: $green;
  }

  &.candidate-answers-item-indicator-rate-middling {
    background-color: $orange;
  }

  &.candidate-answers-item-indicator-rate-bad {
    background-color: $red;
  }
}

.candidate-answers-item-indicator-new {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #363151;
}

.candidate-answers-item-rate {
  height: 24px !important;
  padding: 0 5px;
  margin-left: auto;

  &:hover {
    svg {
      opacity: 1;
    }
  }

  &.good {
    svg {
      fill: $green;
    }
  }

  &.middling {
    svg {
      fill: $orange;
    }
  }

  &.bad {
    svg {
      fill: $red;
    }
  }

  svg {
    width: 24px;
    height: 24px;
    opacity: 0.6;
  }
}

.recognition-text-tooltip {
  width: 14px;
  height: 14px;
  fill: #969696;
}

.candidate-answers-state {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.candidate-answers-state-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 14px;

  +.candidate-answers-state-item {
    margin-left: 10px;
  }

  &.positive {
    svg {
      fill: rgb(0, 188, 1);
    }
  }

  &.neutral {
    svg {
      fill: rgb(253, 169, 76);
    }
  }

  &.negative {
    svg {
      fill: rgb(221, 39, 5);
    }
  }

  span {
    margin-left: 3px;
    font-size: 14px;
    color: #969696;
  }

  svg {
    width: 14px;
    height: 14px;
  }
}

.plagiarism-info {
  font-weight: 600;

  span {
    margin: 0 5px;
  }

  button {
    padding: 0;
    border: 0;
    margin: 0 5px;
    background-color: transparent;
    display: inline-block;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
}

.plagiarism-info-title {
  display: flex;
  align-items: center;

  svg {
    width: 10px;
    margin-right: 5px;
  }
}

.plagiarism-info-link {
  text-decoration: underline;
}
</style>
