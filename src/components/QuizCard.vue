<template>
  <div class="quiz-card">
    <div class="quiz-card-inner">
      <div class="quiz-card-header">
        <page-title tag="div" size="16">
          {{ $t('question') }} {{ index + 1 }}
        </page-title>
        <p class="text-gray-300">
          {{ data.question }}
        </p>
      </div>

      <interview-quiz
        v-if="showResult"
        readonly
        show-result
        :options="data.tests"
        :values="data.answer"
      ></interview-quiz>

      <interview-quiz
        v-else
        readonly
        :options="
          data.tests.map(({ test_id, text }) => ({
            label: text,
            value: test_id
          }))
        "
        :values="
          data.tests
            .filter((answer) => !!answer.correct)
            .map(({ test_id }) => test_id)
        "
      ></interview-quiz>
    </div>
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue';
import InterviewQuiz from './InterviewQuiz.vue';

export default {
  name: 'QuizCard',

  components: {
    PageTitle,
    InterviewQuiz
  },

  props: {
    index: {
      type: Number,
      default: 0
    },

    data: {
      type: Object,
      required: true
    },

    showResult: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.quiz-card {
  height: 100%;

  .app-button {
    margin-top: 20px;
  }

  .interview-quiz {
    min-height: 0;
    padding: 15px;
  }
}

.quiz-card-inner {
  height: 100%;
  border-radius: 5px;
  background-color: $white;
}

.quiz-card-header {
  padding: 15px;

  .page-title {
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 0;
  }
}
</style>
