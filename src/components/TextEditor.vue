<template>
  <div class="text-editor">
    <editor-menu-bar
      v-if="!readonly"
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <div v-if="email" class="menubar">
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <a-icon type="bold" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <a-icon type="italic" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <a-icon type="underline" />
        </button>

        <button class="menubar__button" @click="commands.horizontal_rule">
          hr
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          ""
        </button>

        <button class="menubar__button" @click="commands.undo">
          <a-icon type="undo" />
        </button>

        <button class="menubar__button" @click="commands.redo">
          <a-icon type="redo" />
        </button>

        <button class="menubar__button" @click="insertImage">
          <a-icon type="picture" />
        </button>

        <button class="menubar__button" @click="insertYoutubeVideo">
          <a-icon type="youtube" />
        </button>

        <slot name="extra-actions"></slot>
      </div>

      <div v-else class="menubar">
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <a-icon type="bold" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <a-icon type="italic" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <a-icon type="strikethrough" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <a-icon type="underline" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          P
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <a-icon type="unordered-list" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <a-icon type="ordered-list" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          ""
        </button>

        <button class="menubar__button" @click="commands.horizontal_rule">
          hr
        </button>

        <button class="menubar__button" @click="commands.undo">
          <a-icon type="undo" />
        </button>

        <button class="menubar__button" @click="commands.redo">
          <a-icon type="redo" />
        </button>

        <button class="menubar__button" @click="insertImage">
          <a-icon type="picture" />
        </button>

        <button class="menubar__button" @click="insertYoutubeVideo()">
          <a-icon type="youtube" />
        </button>

        <slot name="extra-actions"></slot>
      </div>
    </editor-menu-bar>

    <editor-content :editor="editor"></editor-content>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import YoutubeEmbed from '../js/helpers/embedYoutube';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Code,
  Italic,
  Strike,
  Underline,
  History,
  Image
} from 'tiptap-extensions';

export default {
  name: 'TextEditor',

  components: {
    EditorContent,
    EditorMenuBar
  },

  props: {
    readonly: {
      type: Boolean,
      default: false
    },

    email: {
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

  watch: {
    value(val) {
      if (!this.initialContentPassed && val.length) {
        this.editor.setContent(this.value);
        this.initialContentPassed = true;
      }
    }
  },

  data() {
    return {
      initialContentPassed: false,

      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new YoutubeEmbed(),
          new Image()
        ],
        content: '',
        onUpdate: ({ getHTML }) => {
          const val = getHTML();

          if (val === '<p></p>') {
            this.editor.setContent('');
            this.$emit('update', '');
          } else {
            this.$emit('update', val);
          }
        }
      })
    };
  },

  created() {
    if (this.value) {
      this.editor.setContent(this.value);
      this.initialContentPassed = true;
    }

    if (this.readonly) {
      this.editor.setOptions({
        editable: false
      });
    }

    if (this.placeholder) {
      this.editor.setContent(this.$t('write_your_answer_here'));
      this.initialContentPassed = true;
    }
  },

  methods: {
    focusEditor() {
      this.editor.focus();
    },

    updateValue() {
      this.editor.setContent(this.value);
    },

    returnResult() {
      const val = this.editor.getHTML();

      if (val === '<p></p>') {
        this.editor.setContent('');
        this.$emit('result', '');
      } else {
        this.$emit('result', val);
        this.editor.setContent('');
      }
    },

    insertYoutubeVideo() {
      console.log('aaaa');
      const url = prompt('Введите ссылку на YouTube-видео:');
      if (url) {
        this.editor.commands.setYoutubeVideo(url);
      }
    },

    insertImage() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.editor.commands.image({ src: reader.result }); // Embed as base64
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  },

  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style lang="scss">
.text-editor {
  .ProseMirror {
    outline: none !important;
    padding: 10px 15px;
    border-radius: 5px;
    min-height: 200px;
    background-color: #ffffff;
    border: 1px solid #b6b7c6;
  }
}

.menubar {
  margin-bottom: 1rem;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  &__button {
    // font-weight: bold;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: #000000;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: rgba(#000000, 0.05);
    }

    &.is-active {
      background-color: rgba(#000000, 0.1);
    }
  }

  span#{&}__button {
    font-size: 13.3333px;
  }
}

.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: #000000;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  &__button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: #ffffff;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      background-color: rgba(#ffffff, 0.1);
    }

    &.is-active {
      background-color: rgba(#ffffff, 0.2);
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input {
    font: inherit;
    border: none;
    background: transparent;
    color: #ffffff;
  }
}
</style>
