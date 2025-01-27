<template>
  <a-modal centered width="840px" wrapClassName="messages-template-edit-modal" :visible="visible" :footer="null"
    @cancel="handleClose">
    <div class="messages-template-edit-modal-header">
      <a-row type="flex" align="middle" :gutter="[0, 20]">
        <a-col :span="24">
          <page-title tag="h2" size="22" class="mb-0-i">
            {{
              `${$t('template')}: ${editData.messages[$i18n.locale].name ||
                editData.type}`
            }}
          </page-title>
        </a-col>

        <a-col :md="12" :span="24">
          <a-select v-model="currentLanguage" :placeholder="$t('language')" :defaultActiveFirstOption="false"
            @change="onChangeLanguage">
            <div slot="suffixIcon">
              <icon-arrow-down></icon-arrow-down>
            </div>

            <template slot="notFoundContent">
              <div class="ant-empty ant-empty-normal ant-empty-small">
                <div class="ant-empty-image">
                  <icon-more fill="rgba(0, 0, 0, 0.25)"></icon-more>
                </div>
                <p class="ant-empty-description">{{ $t('no_data') }}</p>
              </div>
            </template>

            <a-select-option v-for="(language, index) in languages" :key="index" :value="language.name">
              {{ language.title }}
            </a-select-option>
          </a-select>
        </a-col>

        <a-col :span="24">
          <a-form>
            <a-form-item>
              <page-title tag="h3" size="16" class="messages-template-edit-modal-type-title">
                {{ $t('email') }}

                <app-button type="link" :loading="isEmailPreviewLoading" @click="showEmailPreview">
                  {{ $t('preview_email') }}

                  <icon-blank width="16"></icon-blank>
                </app-button>
              </page-title>
            </a-form-item>

            <a-form-item>
              <a-input v-model="data[currentLanguage].email_title" type="text" :placeholder="$t('email_title')" />
            </a-form-item>

            <!-- <a-form-item>
              <a-input
                v-model="data[currentLanguage].email_hello"
                type="text"
                :placeholder="$t('email_greeting')"
              />
            </a-form-item> -->

            <a-form-item>
              <text-editor email ref="emailTextEditor" class="email-text-editor" :value="data[currentLanguage].email"
                @update="onUpdateEmailText">
                <template slot="extra-actions">
                  <a-select size="small" style="width:220px" :value="currentVariable" :defaultActiveFirstOption="false"
                    :placeholder="$t('variables')" @mouseenter="onMouseenterVariable" @change="handleAddVariable">
                    <div slot="suffixIcon">
                      <icon-arrow-down></icon-arrow-down>
                    </div>

                    <template slot="notFoundContent">
                      <div class="ant-empty ant-empty-normal ant-empty-small">
                        <div class="ant-empty-image">
                          <icon-more fill="rgba(0, 0, 0, 0.25)"></icon-more>
                        </div>
                        <p class="ant-empty-description">{{ $t('no_data') }}</p>
                      </div>
                    </template>

                    <a-select-option v-for="(variable, index) in variables" :key="index" :value="variable.value"
                      class="no-wrap">
                      {{ variable.title }}
                    </a-select-option>
                  </a-select>
                </template>
              </text-editor>
            </a-form-item>

            <a-form-item>
              <page-title tag="h3" size="16" class="messages-template-edit-modal-type-title">
                {{ $t('sms') }}

                <!-- <app-button type="link">
                  {{ $t('preview_sms') }}

                  <icon-blank width="16"></icon-blank>
                </app-button> -->
              </page-title>
            </a-form-item>

            <a-form-item>
              <a-textarea v-model="data[currentLanguage].sms" :placeholder="$t('text_of_sms')" :rows="4" class="fill" />
            </a-form-item>

            <a-form-item>
              <div class="messages-template-edit-modal-actions">
                <app-button size="large" type="primary" :loading="isLoadingSave" @click="handleSave">
                  {{ $t('save') }}
                </app-button>

                <app-button type="link" size="small" :loading="isRestoreTemplateLoading" @click="restoreTemplate">
                  {{ $t('restore_defaylt_template') }}
                </app-button>
              </div>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>

    <a-modal centered width="840px" :visible="visibleEmailPreview" :footer="null" @cancel="handleCloseEmailPreview">
      <div class="email-preview-body" v-html="emailPreview"></div>
    </a-modal>
  </a-modal>
</template>

<script>
import PageTitle from './PageTitle.vue';
import AppButton from './AppButton.vue';
import TextEditor from './TextEditor.vue';

import IconArrowDown from './icons/ArrowDown.vue';
import IconMore from './icons/More.vue';
import IconBlank from './icons/Blank.vue';
import apiRequest from '../js/helpers/apiRequest';

function getCharacterPrecedingCaret(containerEl) {
  var precedingChar = '',
    sel,
    range,
    precedingRange;

  if (window.getSelection) {
    sel = window.getSelection();

    if (sel.rangeCount > 0) {
      range = sel.getRangeAt(0).cloneRange();
      range.collapse(true);
      range.setStart(containerEl, 0);
      precedingChar = range.toString().slice(-1);
    }
  } else if ((sel = document.selection) && sel.type != 'Control') {
    range = sel.createRange();
    precedingRange = range.duplicate();
    precedingRange.moveToElementText(containerEl);
    precedingRange.setEndPoint('EndToStart', range);
    precedingChar = precedingRange.text.slice(-1);
  }

  return {
    precedingChar,
    sel
  };
}

export default {
  name: 'MessagesTemplateEditModal',

  components: {
    PageTitle,
    AppButton,
    TextEditor,
    IconArrowDown,
    IconMore,
    IconBlank
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    editData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isLoadingSave: false,
      isEmailPreviewLoading: false,
      isRestoreTemplateLoading: false,
      visibleEmailPreview: false,
      currentLanguage: 'en',
      currentVariable: undefined,
      data: this.editData.messages,
      emailPreview: '',
      // languages: [
      //   {
      //     value: 'en',
      //     title: 'English (EN)'
      //   },
      //   {
      //     value: 'ru',
      //     title: 'Russian (RU)'
      //   },
      //   {
      //     value: 'de',
      //     title: 'German (DE)'
      //   },
      //   {
      //     value: 'es',
      //     title: 'Spanish (ES)'
      //   },
      //   {
      //     value: 'it',
      //     title: 'Italian (IT)'
      //   },
      //   {
      //     value: 'ar',
      //     title: 'Arabic (AR)'
      //   }
      // ]
    };
  },

  computed: {
    variables() {
      return this.$store.state.app.emailVars;
    },

    languages() {
      return this.$store.state.app.lng;
    }
  },

  methods: {
    handleClose() {
      this.$emit('close');
    },

    handleCloseEmailPreview() {
      this.visibleEmailPreview = false;
    },

    onChangeLanguage(value) {
      this.currentLanguage = value;

      this.$nextTick(() => {
        this.$refs.emailTextEditor.updateValue();
      });
    },

    onMouseenterVariable() {
      this.$refs.emailTextEditor.focusEditor();
      getCharacterPrecedingCaret(document.activeElement);
    },

    handleAddVariable(value) {
      this.currentVariable = undefined;
      this.$refs.emailTextEditor.focusEditor();

      setTimeout(() => {
        const prediction = getCharacterPrecedingCaret(document.activeElement);
        const isP = prediction.sel.anchorNode.nodeName === 'P';
        const el = isP
          ? prediction.sel.anchorNode
          : prediction.sel.anchorNode.parentElement;
        const elInnerHTML = isP
          ? prediction.sel.anchorNode.innerHTML
          : prediction.sel.anchorNode.parentElement.innerHTML;
        const cursorPos = prediction.sel.anchorOffset;
        const textBefore = elInnerHTML.substring(0, cursorPos);
        const textAfter = elInnerHTML.substring(cursorPos, elInnerHTML.length);

        el.innerHTML = textBefore + value + textAfter;

        const range = document.createRange();
        const sel = window.getSelection();

        range.setStart(el.childNodes[0], cursorPos + value.length);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
      }, 50);
    },

    onUpdateEmailText(value) {
      this.data[this.currentLanguage].email = value;
    },

    replaceParagraphToDiv(string) {
      return string
        .replace(/(<p>)/gim, '<div style="margin-bottom:20px">')
        .replace(/<\/p>/gim, '</div>');
    },

    async restoreTemplate() {
      try {
        const {
          editData: { type },
          $route: {
            params: { id }
          }
        } = this;

        const body = new FormData();

        body.append('company_id', id);
        body.append('type', type);

        this.isRestoreTemplateLoading = true;
        const res = await apiRequest('templates/default', 'POST', body, true);
        this.isRestoreTemplateLoading = false;

        if (!res.error) {
          const { data } = res.response;

          this.data = data[type];

          this.$nextTick(() => {
            this.$refs.emailTextEditor.updateValue();
          });
        }
      } catch (error) {
        this.isRestoreTemplateLoading = false;
        console.log(`error`, error);
      }
    },

    async showEmailPreview() {
      try {
        const {
          data,
          currentLanguage,
          editData: { type },
          $route: {
            params: { id }
          }
        } = this;
        const { email_title, email, sms } = data[currentLanguage];

        const body = new FormData();

        body.append('company_id', id);
        body.append('type', type);
        body.append('language', currentLanguage);
        body.append('email_title', email_title);
        // body.append('email_hello', email_hello);
        body.append('email', this.replaceParagraphToDiv(email));
        body.append('sms', sms);

        this.isEmailPreviewLoading = true;
        const res = await apiRequest('templates/preview', 'POST', body, true);
        this.isEmailPreviewLoading = false;

        if (!res.error) {
          const {
            data: { email }
          } = res.response;

          this.emailPreview = email;
          this.visibleEmailPreview = true;
        }
      } catch (error) {
        this.isEmailPreviewLoading = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    async handleSave() {
      try {
        const {
          data,
          editData: { type },
          $route: {
            params: { id }
          }
        } = this;

        const body = new FormData();

        body.append('company_id', id);

        for (const [key, value] of Object.entries(data)) {
          const { email_title, email, sms } = value;

          body.append(
            'templates[]',
            JSON.stringify({
              type,
              language: key,
              email_title,
              // email_hello,
              email: this.replaceParagraphToDiv(email),
              sms
            })
          );
        }

        this.isLoadingSave = true;
        const res = await apiRequest('templates/edit', 'POST', body, true);
        this.isLoadingSave = false;

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
      } catch (error) {
        this.isLoadingSave = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    }
  }
};
</script>

<style lang="scss">
.messages-template-edit-modal {
  .menubar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
  }
}

.messages-template-edit-modal-type-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;

  .app-button {
    padding-right: 0;
  }

  svg {
    margin-left: 10px;
    width: 14px;
    height: 14px;
  }
}

.messages-template-edit-modal-actions {
  display: flex;
  align-items: center;

  @media (max-width: $sm) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  .ant-btn {
    +.ant-btn {
      margin-left: 10px;

      @media (max-width: $sm) {
        margin-left: 0;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
