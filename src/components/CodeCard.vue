<template>
  <div :class="['code-card', { 'light-theme': lightTheme }]">
    <div class="code-card-inner">
      <div class="code-card-header">
        <page-title tag="div" size="16">
          {{ $t('question') }} {{ index + 1 }}
        </page-title>
        <p class="text-gray-300">
          {{ data.question }}
        </p>
      </div>

      <code-editor readonly :value="data.answer"></code-editor>
    </div>
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue';
import CodeEditor from './CodeEditor.vue';

export default {
  name: 'CodeCard',

  components: {
    PageTitle,
    CodeEditor
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

    lightTheme: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.code-card {
  &.light-theme {
    .prism-editor .my-editor {
      background-color: $white;
    }
  }

  .app-button {
    margin-top: 20px;
  }

  .prism-editor {
    max-height: 282px;
    border-radius: 5px;
    overflow: hidden;
  }

  .prism-editor .my-editor {
    max-height: 282px;
  }
}

.code-card-inner {
  background-color: $white;
  border-radius: 5px;
}

.code-card-header {
  padding: 15px;

  .page-title {
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 0;
  }
}
</style>
