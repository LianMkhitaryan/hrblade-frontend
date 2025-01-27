<template>
  <app-page class="page-dashboard" :loading="pageLoading">
    <template v-if="!pageLoading">
      <template slot="header">
        <page-title>Welcome to your dashboard</page-title>
        <p class="text-gray-300">
          Here are some key stats and links to help you get the most out
        </p>
      </template>

      <a-row
        type="flex"
        :gutter="[
          { lg: 20, md: 10, sm: 10, xs: 10 },
          { lg: 20, md: 10, sm: 10, xs: 10 }
        ]"
      >
        <a-col :lg="{ span: 16 }" :md="{ span: 14 }" :xs="{ span: 24 }">
          <card>
            <page-title tag="h3" size="16">
              Candidate progress
              <span class="text-gray-300">Last 30 days</span>
            </page-title>

            <div class="page-dashboard-chart">
              <line-chart :chartData="chartData"></line-chart>
            </div>
          </card>
        </a-col>

        <a-col :lg="{ span: 8 }" :md="{ span: 10 }" :xs="{ span: 24 }">
          <card v-if="plan.id">
            <page-title tag="h3" size="16">
              Current plan
            </page-title>
            <page-title>
              {{ plan.name }}
            </page-title>
            <progress-bar
              :percent="(plan.responsesCount * 100) / plan.responsesLimit"
              class="orange-gradient mt-auto"
            >
              <template slot="label">
                <span>
                  Responses
                  <span class="grayish-blue-400">
                    {{
                      `(limit: ${
                        plan.responsesLimit >= 10000
                          ? '&#8734;'
                          : plan.responsesLimit
                      })`
                    }}
                  </span>
                </span>
              </template>
              <template slot="value">
                {{ plan.responsesCount }}
              </template>
            </progress-bar>
            <a href="https://hrblade.com/pricing" target="_blank">
              <app-button type="primary" ghost class="w-100 mt-20">
                View pricing
              </app-button>
            </a>
          </card>
        </a-col>

        <a-col :lg="{ span: 8 }" :md="{ span: 12 }" :xs="{ span: 24 }">
          <card>
            <page-title tag="h3" size="16">
              Your companies
            </page-title>

            <list v-if="companies.length" class="mb-20">
              <list-item
                v-for="company in companies"
                :key="company.id"
                :to="`/companies/view/${company.id}`"
                media
              >
                <a-avatar
                  slot="media"
                  shape="square"
                  :size="44"
                  :src="company.logo"
                  icon="user"
                />
                {{ company.name }}
                <template slot="subtitle">
                  <span>Jobs: {{ company.jobsCount }}</span>
                </template>
              </list-item>
            </list>

            <a-empty v-else :description="false" class="my-auto"></a-empty>

            <router-link to="/companies/create" class="mt-auto">
              <app-button type="primary" class="blue-gradient w-100">
                Add new company
              </app-button>
            </router-link>

            <router-link to="/companies" class="mt-10">
              <app-button type="primary" ghost class="w-100">
                View all companies
              </app-button>
            </router-link>
          </card>
        </a-col>

        <a-col :lg="{ span: 8 }" :md="{ span: 12 }" :xs="{ span: 24 }">
          <card>
            <page-title tag="h3" size="16">
              Last jobs
            </page-title>

            <list v-if="jobs.length" class="mb-20">
              <list-item
                v-for="job in jobs"
                :key="job.id"
                :to="`/jobs/vacancy/${job.id}`"
              >
                {{ job.name }}
                <template slot="subtitle">
                  <div class="info-item">
                    <icon-office class="info-item-icon"></icon-office>
                    <span class="info-item-label">
                      {{ job.company.name }}
                    </span>
                  </div>
                  <div class="info-item">
                    <icon-point class="info-item-icon"></icon-point>
                    <span class="info-item-label">
                      {{ job.location }}
                    </span>
                  </div>
                </template>
              </list-item>
            </list>

            <a-empty v-else :description="false" class="my-auto"></a-empty>

            <router-link to="/jobs/create" class="mt-auto">
              <app-button type="primary" class="blue-gradient w-100">
                Add new interview
              </app-button>
            </router-link>

            <router-link to="/jobs" class="mt-10">
              <app-button type="primary" ghost class="w-100">
                View all interviews
              </app-button>
            </router-link>
          </card>
        </a-col>

        <a-col :lg="{ span: 8 }" :md="{ span: 12 }" :xs="{ span: 24 }">
          <card>
            <page-title tag="h3" size="16">
              Users
            </page-title>

            <list v-if="users.length" class="mb-20">
              <list-item v-for="user in users" :key="user.id" to="/users" media>
                <a-avatar
                  slot="media"
                  shape="square"
                  :size="44"
                  :src="user.avatar"
                  icon="user"
                />
                {{ user.name }}
                <template slot="subtitle">
                  <div class="info-item">
                    <icon-user-square class="info-item-icon"></icon-user-square>
                    <span class="info-item-label">
                      {{ user.role }}
                    </span>
                  </div>
                </template>
              </list-item>
            </list>

            <a-empty v-else :description="false" class="my-auto"></a-empty>

            <router-link to="/users" class="mt-auto">
              <app-button type="primary" class="blue-gradient w-100">
                Add new user
              </app-button>
            </router-link>

            <router-link to="/users" class="mt-10">
              <app-button type="primary" ghost class="w-100">
                View all users
              </app-button>
            </router-link>
          </card>
        </a-col>
      </a-row>
    </template>
  </app-page>
</template>

<script>
import { format, isSameDay, subDays, eachDayOfInterval } from 'date-fns';
import apiRequest from '../js/helpers/apiRequest.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import AppButton from '../components/AppButton.vue';
import Card from '../components/Card.vue';
import LineChart from '../components/LineChart.vue';
import ProgressBar from '../components/ProgressBar.vue';
import List from '../components/List.vue';
import ListItem from '../components/ListItem.vue';

import IconOffice from '../components/icons/Office.vue';
import IconPoint from '../components/icons/Point.vue';
import IconUserSquare from '../components/icons/UserSquare.vue';

export default {
  name: 'Dashboard',

  components: {
    AppPage,
    PageTitle,
    AppButton,
    Card,
    LineChart,
    ProgressBar,
    List,
    ListItem,
    IconOffice,
    IconPoint,
    IconUserSquare
  },

  data() {
    return {
      pageLoading: false,
      plan: {},
      responses: 0,
      companies: [],
      jobs: [],
      users: [],
      chartData: null
    };
  },

  async created() {
    this.pageLoading = true;
    await this.getInfo();
    this.pageLoading = false;
  },

  methods: {
    generateChartData(responses) {
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      const dates = eachDayOfInterval({
        start: thirtyDaysAgo,
        end: today
      });

      const labels = dates.map((date) => format(date, 'MM.dd'));
      const datasets = [];

      const invitedResponses = responses.filter(
        (response) => !!response.invited
      );

      const responsesExceptInvitedStatus = responses.filter(
        (response) => response.status !== 'INVITED'
      );

      datasets[0] = {
        label: 'Invited',
        backgroundColor: 'rgba(114, 239, 203, 0.5)',
        borderWidth: 1,
        borderColor: '#72EFCB',
        data: []
      };

      datasets[1] = {
        label: 'Responded',
        backgroundColor: 'rgba(6, 54, 204, 0.7)',
        borderWidth: 1,
        borderColor: '#0636cc',
        data: []
      };

      invitedResponses.forEach((response) => {
        dates.forEach((date, index) => {
          if (!datasets[0].data[index]) {
            datasets[0].data[index] = 0;
          }

          if (isSameDay(new Date(response.created_at), new Date(date))) {
            datasets[0].data[index] = datasets[0].data[index] + 1;
          }
        });
      });

      responsesExceptInvitedStatus.forEach((response) => {
        dates.forEach((date, index) => {
          if (!datasets[1].data[index]) {
            datasets[1].data[index] = 0;
          }

          if (isSameDay(new Date(response.created_at), new Date(date))) {
            datasets[1].data[index] = datasets[1].data[index] + 1;
          }
        });
      });

      return {
        labels,
        datasets
      };
    },

    async getInfo() {
      try {
        const res = await apiRequest('dashboard', 'GET', null, true);

        const { error } = res;

        if (!error) {
          const {
            response: {
              data: { plan, responses, companies, jobs, users }
            }
          } = res;

          this.chartData = this.generateChartData(responses);

          this.plan = {
            id: plan.id,
            active: !!plan.active,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            nextPrice: plan.next_price,
            nextPriceLink: plan.next_link,
            responsesCount: plan.responses_count,
            responsesLimit: plan.responses_limit,
            startAt: plan.start_at,
            endAt: plan.end_at
          };

          this.responses = responses.length;

          this.companies = companies.map(({ id, name, logo, jobs_count }) => ({
            id,
            name,
            logo,
            jobsCount: jobs_count
          }));

          this.jobs = jobs.map(({ id, name, logo, location, company }) => ({
            id,
            name,
            logo,
            location,
            company: {
              id: company.id,
              name: company.name
            }
          }));

          this.users = users.map(({ id, name, profile_photo_url, role }) => ({
            id,
            name,
            avatar: profile_photo_url,
            role
          }));
        }
      } catch (error) {
        console.log('getInfo:', error);
      }
    }
  }
};
</script>

<style lang="scss">
.page-dashboard-chart {
  > div {
    height: 260px;
  }
}
</style>
