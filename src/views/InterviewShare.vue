<template>
  <app-page class="page-interview-share" :loading="false">
    <template>
      <div class="page-interview-share-navbar">
        <logo href="https://hrblade.com/" dark></logo>
      </div>

      <div v-if="user" class="user-name">
        <page-title tag="h1">{{ user.name }}</page-title>
      </div>

      <div v-if="answers.length" class="mt-40">
        <a-row type="flex" :gutter="[20, 20]">
          <a-col
            v-for="(answer, index) in answers"
            :key="answer.id"
            :md="12"
            :xs="24"
          >
            <video-card
              v-if="answer.type === 'VIDEO'"
              :index="index"
              :data="answer.video"
            />

            <quiz-card
              v-if="answer.type === 'TEST'"
              :index="index"
              :data="answer"
              show-result
            />

            <text-card
              v-if="answer.type === 'TEXT'"
              :index="index"
              :data="answer"
              light-theme
            />

            <code-card
              v-if="answer.type === 'CODE'"
              :index="index"
              :data="answer"
              light-theme
            ></code-card>
          </a-col>
        </a-row>
      </div>
    </template>
  </app-page>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest.js';

import AppPage from '../components/AppPage.vue';
import Logo from '../components/Logo.vue';
import PageTitle from '../components/PageTitle';
import VideoCard from '../components/VideoCard.vue';
import QuizCard from '../components/QuizCard.vue';
import TextCard from '../components/TextCard.vue';
import CodeCard from '../components/CodeCard.vue';

export default {
  name: 'InterviewShare',

  components: {
    AppPage,
    Logo,
    PageTitle,
    VideoCard,
    QuizCard,
    TextCard,
    CodeCard
  },

  data() {
    return {
      user: null,
      answers: []
    };
  },

  created() {
    this.getData();
  },

  methods: {
    async getData() {
      try {
        const {
          params: { hash }
        } = this.$route;

        const res = await apiRequest(`interview/response/${hash}`, 'GET', null);

        const { error } = res;

        if (!error) {
          this.$store.commit('app/SET_APP_LOADING', false);

          const {
            response: {
              data: { full, answers }
            }
          } = res;

          this.user = { name: full };

          this.answers = answers.map(
            ({
              id,
              question: {
                id: questionId,
                type,
                is_count,
                points,
                question,
                tests,
                time
              },
              response_id,
              created_at,
              rate,
              answer,
              // text,
              video
              // video_thumb,
              // video_time
            }) => ({
              id,
              questionId,
              responseId: response_id,
              createdAt: created_at,
              type,
              rate,
              answer:
                type === 'TEST'
                  ? answer
                      .map(({ correct, test_id }) => !!correct && test_id)
                      .filter((answer) => answer)
                  : answer,
              points,
              is_count: !!is_count,
              question,
              time,
              video:
                type === 'VIDEO'
                  ? {
                      id,
                      link: video,
                      question
                    }
                  : null,
              tests:
                type === 'TEST'
                  ? tests.map(({ id, text, correct }) => ({
                      label: text,
                      value: id,
                      correct: !!correct
                    }))
                  : null
            })
          );
        }
      } catch (error) {
        this.$router.replace('/404');
      }
    }
  }
};
</script>

<style lang="scss">
.page-interview-share {
  .app-page-inner {
    padding-top: 0;
  }

  .app-page-header {
    display: none;
  }
}

.page-interview-share-navbar {
  padding: 25px 0;
  margin-bottom: 50px;
  text-align: center;

  .logo {
    opacity: 0.25;
    transition: 0.1s;

    &:hover {
      opacity: 1;
    }
  }
}

.user-name {
  text-align: center;
}
</style>
