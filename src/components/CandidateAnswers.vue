<template>
  <div class="candidate-answers">
    <a-row type="flex">
      <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
        <div class="candidate-answers-content">
          <div class="candidate-answers-content-header">
            <!-- <page-title tag="div" size="16">
              {{ $t('answers_on_questions') }}
            </page-title> -->
            <div class="candidate-answers-result-item">
              {{ $t('all') }}
              <a-badge show-zero :count="data.answers.length" :number-style="{ backgroundColor: '#DEDEDE' }" />
            </div>

            <div class="candidate-answers-result-item">
              {{ $t('good') }}
              <a-badge show-zero :count="goodAnswers.count" :number-style="{ backgroundColor: '#00BC01' }" />
            </div>

            <div class="candidate-answers-result-item">
              {{ $t('middling') }}
              <a-badge show-zero :count="middlingAnswers.count" :number-style="{ backgroundColor: '#FDA94C' }" />
            </div>

            <div class="candidate-answers-result-item">
              {{ $t('bad') }}
              <a-badge show-zero :count="badAnswers.count" :number-style="{ backgroundColor: '#DD2705' }" />
            </div>
          </div>

          <div class="candidate-answers-content-body">
            <perfect-scrollbar>
              <candidate-answers-item v-for="(answer, index) in data.answers" :key="answer.id" :data="answer"
                :num="index + 1" :active="currentAnswerId === answer.id" @change-answer="onChangeAnswer"
                @open-rate="handleOpenRateModal"></candidate-answers-item>
            </perfect-scrollbar>
          </div>
        </div>
      </a-col>

      <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
        <div v-if="currentAnswerInfo.type === 'VIDEO'" :key="`VIDEO-${currentAnswerId}`" class="candidate-answers-player">
          <video-player :src="currentAnswerInfo.video.file" />
        </div>

        <div v-if="currentAnswerInfo.type === 'TEST'" :key="`TEST-${currentAnswerId}`" class="candidate-answers-test">
          <interview-quiz readonly show-result :options="currentAnswerInfo.tests" :values="currentAnswerInfo.answer" />
        </div>

        <div v-if="currentAnswerInfo.type === 'TEXT'" :key="`TEXT-${currentAnswerId}`" class="candidate-answers-text">
          <text-editor readonly :value="currentAnswerInfo.answer" />
        </div>

        <div v-if="currentAnswerInfo.type === 'CODE'" :key="`CODE-${currentAnswerId}`" class="candidate-answers-code">
          <code-editor readonly :value="currentAnswerInfo.answer" />
        </div>
      </a-col>
    </a-row>

    <candidate-answers-rate-modal v-if="rateModal.answerId" :visible="rateModal.visible" :answerId="rateModal.answerId"
      :info="data.answers.find((answer) => answer.id === rateModal.answerId)" @update-info="$emit('update-info')"
      @close="handleCloseRateModal" />
  </div>
</template>

<script>
import { BASE_PATH } from '../js/const/index.js';

import VideoPlayer from './VideoPlayer.vue';
import InterviewQuiz from './InterviewQuiz.vue';
import CodeEditor from './CodeEditor.vue';
import TextEditor from './TextEditor.vue';
// import PageTitle from './PageTitle.vue';
import CandidateAnswersItem from './CandidateAnswersItem.vue';
import CandidateAnswersRateModal from './CandidateAnswersRateModal';

export default {
  name: 'CandidateAnswers',

  components: {
    VideoPlayer,
    InterviewQuiz,
    CodeEditor,
    TextEditor,
    // PageTitle,
    CandidateAnswersItem,
    CandidateAnswersRateModal
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      BASE_PATH,
      currentAnswerId: this.data.answers[0].id,
      rateModal: {
        visible: false,
        answerId: null
      }
    };
  },

  computed: {
    currentAnswerInfo() {
      return this.data.answers.find(
        (answer) => answer.id === this.currentAnswerId
      );
    },

    goodAnswers() {
      const {
        data: { answers }
      } = this;
      const goodAnswersCount = answers.filter(
        (answer) => answer.rate === 'good'
      ).length;

      return {
        count: goodAnswersCount,
        percent: ((goodAnswersCount * 100) / answers.length).toFixed(0)
      };
    },

    middlingAnswers() {
      const {
        data: { answers }
      } = this;
      const middlingAnswersCount = answers.filter(
        (answer) => answer.rate === 'middling'
      ).length;

      return {
        count: middlingAnswersCount,
        percent: ((middlingAnswersCount * 100) / answers.length).toFixed(0)
      };
    },

    badAnswers() {
      const {
        data: { answers }
      } = this;
      const badAnswersCount = answers.filter((answer) => answer.rate === 'bad')
        .length;

      return {
        count: badAnswersCount,
        percent: ((badAnswersCount * 100) / answers.length).toFixed(0)
      };
    }
  },

  methods: {
    onChangeAnswer(id) {
      this.currentAnswerId = id;
      this.$emit('change-answer', id);
    },

    handleOpenRateModal(id) {
      console.log(`id`, id);
      this.rateModal.answerId = id;
      this.rateModal.visible = true;
    },

    handleCloseRateModal() {
      this.rateModal.answerId = null;
      this.rateModal.visible = false;
    }
  }
};
</script>

<style lang="scss">
.candidate-answers {
  background-color: $white;
  border-radius: 5px;
}

.candidate-answers-player,
.candidate-answers-test,
.candidate-answers-text,
.candidate-answers-code {
  height: 350px;
}

.candidate-answers-test,
.candidate-answers-text,
.candidate-answers-code {
  padding: 20px;
}

.candidate-answers-player {
  .plyr {
    border-radius: 0 5px 5px 0;

    @media (max-width: $md) {
      border-radius: 10px;
    }
  }
}

.candidate-answers-text {
  .text-editor {
    height: 100%;

    >div,
    .ProseMirror {
      height: 100%;
    }
  }
}

.candidate-answers-code {
  .prism-editor {
    height: 100%;
  }
}

.candidate-answers-content-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid $grayish-blue-400;

  @media (max-width: $sm) {
    padding: 10px 20px 20px;
    height: auto;
    flex-wrap: wrap;
    // margin-top: 15px;
    // flex-direction: column;
    // align-items: flex-start;
  }

  // .page-title {
  //   margin-bottom: 0;
  //   margin-right: 20px;

  //   @media (max-width: $sm) {
  //     margin-right: 0;
  //   }
  // }
}

.candidate-answers-status-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;

  @media (max-width: $sm) {
    margin-top: 10px;
    margin-left: 0;
  }
}

.candidate-answers-status {
  display: flex;
  align-items: center;
  line-height: 1;

  &:not(:last-of-type) {
    margin-right: 20px;
  }

  span {
    display: inline-block;

    &:not(:last-of-type) {
      margin-right: 5px;
    }
  }
}

.candidate-answers-status-indicator {
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 50%;

  &.red {
    background-color: $red;
  }

  &.orange {
    background-color: $orange;
  }

  &.green {
    background-color: $green;
  }
}

.candidate-answers-content {
  height: 350px;
  border-right: 1px solid $grayish-blue-400;

  @media (max-width: $md) {
    height: auto;
    border-right: 0;
  }
}

.candidate-answers-content-body {
  padding: 10px 20px;
  width: 100%;
  height: calc(100% - 60px);

  @media (max-width: $md) {
    padding-bottom: 0;
    height: auto;
  }

  @media (max-width: $sm) {
    padding: 10px;
  }

  .ps {
    height: 100%;
    // position: absolute;
    // top: 20px;
    // left: 20px;
    // width: calc(100% - 40px);
    // height: 100%;

    // @media (max-width: $md) {
    //   position: relative;
    //   top: auto;
    //   left: auto;
    //   width: 100%;
    // }
  }
}

.candidate-answers-result-item {
  display: flex;
  align-items: center;
  font-weight: 600;

  @media (max-width: $sm) {
    flex-basis: 33.333%;
    margin-top: 10px;
  }

  +.candidate-answers-result-item {
    margin-left: 15px;

    @media (max-width: $sm) {
      margin-left: 0;
    }
  }

  .ant-badge {
    margin-left: 10px;
  }
}
</style>
