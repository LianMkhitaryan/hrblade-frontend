<template>
  <div class="messages-template-list">
    <a-spin :spinning="isTemplateLoading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

      <div
        v-for="(template, index) in templates"
        :key="index"
        class="messages-template-list-item"
      >
        <div class="messages-template-list-item-title">
          <page-title size="16">
            {{ template.messages[$i18n.locale].name || template.type }}
          </page-title>
        </div>

        <div class="messages-template-list-item-action">
          <a-button type="link" @click="handleEditMessageTemplate(template)">
            <icon-edit width="24" />
          </a-button>
        </div>
      </div>
    </a-spin>

    <messages-template-edit-modal
      v-if="editMessageTemplateVisible"
      :visible="editMessageTemplateVisible"
      :edit-data="editData"
      @close="editMessageTemplateVisible = false"
    />
  </div>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest.js';

import PageTitle from './PageTitle.vue';
import MessagesTemplateEditModal from './MessagesTemplateEditModal.vue';

import IconEdit from './icons/Edit.vue';

export default {
  name: 'MessagesTemplateList',

  components: {
    PageTitle,
    MessagesTemplateEditModal,
    IconEdit
  },

  data() {
    return {
      isTemplateLoading: false,
      editMessageTemplateVisible: false,
      templates: [],
      editData: null
    };
  },

  computed: {},

  created() {
    this.getTemplates();
  },

  methods: {
    handleEditMessageTemplate(template) {
      this.editData = template;
      this.editMessageTemplateVisible = true;
    },

    async getTemplates() {
      const {
        params: { id }
      } = this.$route;

      try {
        this.isTemplateLoading = true;
        const res = await apiRequest(`templates/${id}`, 'GET', null, true);
        this.isTemplateLoading = false;

        if (!res.error) {
          const { data } = res.response;

          const templates = [];

          for (const [key, value] of Object.entries(data)) {
            templates.push({
              type: key,
              messages: value
            });
          }

          this.templates = templates;
        }
      } catch (error) {
        console.log(`getTemplates:`, error);
        this.isTemplateLoading = false;
      }
    }
  }
};
</script>

<style lang="scss">
.messages-template-list {
  width: 100%;
}

.messages-template-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.messages-template-list-item-title {
  .page-title {
    margin-bottom: 0;
  }
}

.messages-template-list-item {
  padding: 25px 0;
  border-bottom: 1px solid #e8e8e8;

  &:first-of-type {
    padding-top: 5px;
  }

  @media (max-width: $sm) {
    padding: 20px 0;
  }
}

.messages-template-list-item-action {
  margin-left: 20px;

  .ant-btn {
    display: inline-block;
    padding: 0;
    width: 24px;
    height: 24px;

    &:hover {
      svg {
        opacity: 0.7;
      }
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
