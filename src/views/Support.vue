<template>
  <app-page class="page-support" :loading="pageLoading">
    <template v-if="!pageLoading">
      <template slot="header">
        <page-title>
          {{ $t('page_support.title') }}
        </page-title>
        <a-row
          :gutter="[
            { lg: 20, xs: 10 },
            { md: 10, sm: 10, xs: 10 }
          ]"
        >
          <a-col :span="24">
            <router-link to="/support/question">
              <app-button size="large" type="primary">
                {{ $t('page_support.ask_question') }}
              </app-button>
            </router-link>
          </a-col>
        </a-row>
      </template>

      <a-row
        v-if="faqsList.length"
        :gutter="{ lg: 20, md: 10, sm: 10, xs: 10 }"
      >
        <!-- <a-col span="24">
          <page-title tag="h2" size="25">Active jobs listings</page-title>
        </a-col> -->
        <a-col span="24">
          <card>
            <a-row :gutter="{ lg: 20, md: 10, sm: 10, xs: 10 }">
              <!-- <a-col span="24">
                <page-title tag="h2" size="20">For Individuals</page-title>
              </a-col>
              <a-col :md="{ span: 12 }">
                <collapse
                  title="Technical questions"
                  :list="firstList"
                ></collapse>
                <collapse
                  title="How to interview"
                  :list="secondList"
                ></collapse>
              </a-col> -->
              <a-col :md="{ span: 12 }">
                <collapse :list="faqsList"></collapse>
              </a-col>
            </a-row>
          </card>
        </a-col>

        <!-- <a-col span="24">
          <card>
            <a-row :gutter="{ lg: 20, md: 10, sm: 10, xs: 10 }">
              <a-col span="24">
                <page-title tag="h2" size="20">For Organisations</page-title>
              </a-col>
              <a-col :md="{ span: 12 }">
                <collapse title="Getting Started" :list="firstList"></collapse>
              </a-col>
              <a-col :md="{ span: 12 }">
                <collapse
                  title="Account Management"
                  :list="thirdList"
                ></collapse>
              </a-col>
            </a-row>
          </card>
        </a-col> -->
      </a-row>
    </template>
  </app-page>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';
import Collapse from '../components/Collapse.vue';

export default {
  name: 'Support',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    Collapse
  },

  data() {
    return {
      pageLoading: false,
      search: '',
      faqs: []
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.$t('page_support.title')}`
    };
  },

  computed: {
    faqsList() {
      const { faqs, search } = this;

      if (!search) {
        return faqs;
      } else {
        let results = [];

        faqs.forEach((item) => {
          const findInTitle =
            item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
          const findInText =
            item.text.toLowerCase().indexOf(search.toLowerCase()) >= 0;

          if (findInTitle || findInText) {
            results.push(item);
          }
        });

        return results;
      }
    }
  },

  async created() {
    this.pageLoading = true;
    await this.getFaqs();
    this.pageLoading = false;
  },

  methods: {
    async getFaqs() {
      try {
        const res = await apiRequest('faqs', 'GET', null, true);

        const { error } = res;

        if (!error) {
          const {
            response: { data }
          } = res;

          this.faqs = data
            .filter((item) => !!item.active)
            .map(({ id, question, answer }) => ({
              id,
              title: question,
              text: answer
            }));
        }
      } catch (error) {
        console.log('getFaqs:', error);
      }
    },

    handleSearch() {}
  }
};
</script>

<style lang="scss">
.search-inner {
  display: flex;

  @media (max-width: $sm) {
    display: block;
  }
}

.search-input {
  height: 55px;
  padding: 0 15px 0 0;
  margin-right: 10px;
}

.search-btn {
  @media (max-width: $sm) {
    margin-top: 10px;
  }
}
</style>
