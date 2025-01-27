<template>
  <div class="interview-quiz">
    <a-checkbox-group v-model="value" :disabled="readonly" @change="onChange">
      <a-checkbox
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        <span
          v-if="showResult"
          :class="
            `ant-checkbox-label-${option.correct ? 'correct' : 'incorrect'}`
          "
        >
          {{ option.label }}
        </span>

        <template v-else>
          {{ option.label }}
        </template>
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'InterviewQuiz',

  props: {
    readonly: {
      type: Boolean,
      default: false
    },

    showResult: {
      type: Boolean,
      default: false
    },

    options: {
      type: Array,
      default: () => []
    },

    values: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      value: []
    };
  },

  created() {
    if (this.values) {
      this.value = this.values;
    }
  },

  methods: {
    onChange(checkedValues) {
      this.value = checkedValues;
    },

    returnResult() {
      this.$emit('result', this.value);
      this.value = [];
    }
  }
};
</script>

<style lang="scss">
.interview-quiz {
  .ant-checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .ant-checkbox-wrapper {
    margin-left: 0 !important;

    &:not(:last-of-type) {
      margin-bottom: 20px;
    }
  }
}

.ant-checkbox-label-correct {
  color: #07885b;
}

.ant-checkbox-label-incorrect {
  color: #dd2705;
}
</style>
