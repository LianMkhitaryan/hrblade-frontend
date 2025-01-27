<template>
  <div class="prism-editor">
    <prism-editor
      v-model="code"
      :highlight="highlighter"
      :readonly="readonly"
      line-numbers
      class="my-editor"
    ></prism-editor>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

export default {
  name: 'CodeEditor',

  components: {
    PrismEditor
  },

  props: {
    readonly: {
      type: Boolean,
      default: false
    },

    value: {
      type: String,
      default: ''
    },

    placeholder: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      code: ''
    };
  },

  created() {
    if (this.value) {
      this.code = this.value;
    }

    if (this.placeholder) {
      this.code = this.$t('write_your_answer_here');
    }
  },

  methods: {
    highlighter(code) {
      return highlight(code, languages.js);
    },

    returnResult() {
      this.$emit('result', this.code);
      this.code = '';
    }
  }
};
</script>

<style lang="scss">
.prism-editor {
  height: 330px;

  .ProseMirror {
    border: 1px solid #e8e8e8;
  }

  .my-editor {
    background-color: #ffffff;
    border: 1px solid #b6b7c6;
    max-height: 400px;
    border-radius: 5px;
    font-size: 14px;
    line-height: 1.5;
    padding: 10px 5px;
  }

  .prism-editor__container,
  .prism-editor__editor {
    height: 100%;
  }

  .prism-editor__textarea {
    &:focus {
      outline: none;
    }
  }
}
</style>
