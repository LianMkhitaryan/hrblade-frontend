<template>
  <div :class="['text-card', { 'light-theme': lightTheme }]">
    <div class="text-card-inner">
      <div class="text-card-header">
        <page-title tag="div" size="16">
          {{ $t('question') }} {{ index + 1 }}
        </page-title>
        <p class="text-gray-300">
          {{ data.question }}
        </p>
      </div>

      <text-editor readonly :value="data.answer" />
    </div>
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue';
import TextEditor from './TextEditor.vue';

export default {
  name: 'TextCard',

  components: {
    PageTitle,
    TextEditor
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
.text-card {
  &.light-theme {
    .text-editor .ProseMirror {
      background-color: $white;
    }
  }

  .app-button {
    margin-top: 20px;
  }

  .text-editor .ProseMirror {
    min-height: 282px;
    max-height: 282px;
    height: 100%;
  }
}

.text-card-inner {
  background-color: $white;
  border-radius: 5px;
}

.text-card-header {
  padding: 15px;

  .page-title {
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 0;
  }
}
</style>
