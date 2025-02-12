<template>
  <div class="cards-container">
    <card :card-title="$t('update_payment_method')">
      <div class="description">
        {{ $t('update_payment_method_description') }}
      </div>
      <a
        href="https://billing.stripe.com/p/login/bIYcQ5azO4DNa0EfYY"
        target="_blank"
        rel="noopener noreferrer"
      >
        <app-button type="link" class="button-link">
          {{ $t('Billing dashboard') }}
          <icon-blank class="ml-10" />
        </app-button>
      </a>
    </card>
    <card :card-title="$t('invoices')">
      <div class="description">{{ $t('invoices_description') }}</div>
      <a
        href="https://billing.stripe.com/p/login/bIYcQ5azO4DNa0EfYY"
        target="_blank"
        rel="noopener noreferrer"
      >
        <app-button type="link" class="button-link">
          {{ $t('Billing dashboard') }}
          <icon-blank class="ml-10" />
        </app-button>
      </a>
    </card>
    <card v-if="plan.id" big-padding :card-title="$t('usage')">
      <div class="billing-header">
        <page-title
          v-if="user.agency"
          tag="h3"
          size="16"
          style="margin-bottom: 15px;"
        >
          {{ `${$t('page_profile.your_current_plan')} ${plan.name}` }}
        </page-title>
      </div>

      <page-title v-if="user.agency" tag="h4" size="14">
        {{ `${$t('users_2')}: ${user.agency.quantity}` }}
      </page-title>

      <page-title
        :class="['plan-status', { active: plan.active }]"
        v-if="user.agency"
        tag="h4"
        size="14"
      >
        {{ `${$t('status')}:` }}

        <span>
          {{
            `${
              plan.active
                ? $t('plan_status.active')
                : $t('plan_status.сanceled')
            } ${
              plan.active
                ? ''
                : `(${$t('plan_status.will_end')} ${format(
                    new Date(plan.endAt),
                    'dd MMMM yyyy',
                    { locale: locales[$i18n.locale] }
                  )})`
            }`
          }}

          <span v-if="plan.endPlanAt" style="color: #b6b7c6!important">
            ({{ plan.endPlanAt }})
          </span>
        </span>
      </page-title>

      <progress-bar
        :percent="(plan.responsesCount * 100) / plan.responsesLimit"
        :class="[
          'mt-auto',
          'mb-20',
          plan.responsesCount > plan.responsesLimit ? 'red' : 'orange-gradient'
        ]"
      >
        <span slot="label">
          {{ $t('responses') }}

          <span class="grayish-blue-400">
            {{
              `(${$t('period')}: ${tariffPlanPeriod.from} - ${
                tariffPlanPeriod.to
              })`
            }}
          </span>
        </span>

        <span slot="value">
          {{ `${plan.responsesCount} / ${plan.responsesLimit}` }}
        </span>
      </progress-bar>

      <progress-bar
        :percent="(jobsCount * 100) / plan.jobsLimit"
        :class="[
          'mt-auto',
          'mb-20',
          jobsCount > plan.jobsLimit ? 'red' : 'orange-gradient'
        ]"
      >
        <span slot="label">
          {{ $t('jobs') }}
        </span>

        <span slot="value">
          {{ `${jobsCount} / ${plan.jobsLimit}` }}
        </span>
      </progress-bar>

      <progress-bar
        :percent="(companiesCount * 100) / plan.companiesLimit"
        :class="[
          'mt-auto',
          'mb-20',
          companiesCount > plan.companiesLimit ? 'red' : 'orange-gradient'
        ]"
      >
        <span slot="label">
          {{ $t('companies') }}
        </span>

        <span slot="value">
          {{ `${companiesCount} / ${plan.companiesLimit}` }}
        </span>
      </progress-bar>
      <app-button type="primary" class="change-plan mt-10 mr-10">
        <router-link to="/profile/plan">
          {{ $t('change_plan') }}
        </router-link>
      </app-button>
    </card>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import locales from '../js/plugins/date-fns';
import { format } from 'date-fns';

import Card from './Card';
import PageTitle from './PageTitle';
import AppButton from './AppButton';
import ProgressBar from './ProgressBar';
import IconBlank from './icons/Blank.vue';

export default {
  name: 'Usage',

  components: {
    Card,
    PageTitle,
    AppButton,
    ProgressBar,
    IconBlank
  },
  data() {
    return {
      locales
    };
  },
  computed: {
    tariffPlanPeriod() {
      const from = format(new Date(this.plan.startAt), 'dd MMM', {
        locale: locales[this.$i18n.locale]
      });
      const to = format(new Date(this.plan.endAt), 'dd MMM', {
        locale: locales[this.$i18n.locale]
      });

      return {
        from,
        to
      };
    },
    ...mapState({
      user: ({ user }) => user.info,
      plan: ({ user }) => user.plan,
      plans: ({ app }) => app.plans,
      jobsCount: ({ jobs }) => jobs.jobs.length,
      companiesCount: ({ company }) => company.companies.length
    })
  }
};
</script>
<style lang="scss" scoped>
.cards-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.card-content {
  .description {
    font-size: 12px;
    font-weight: 500;
    font-family: 'Montserrat';
    font-style: normal;
  }

  a .button-link {
    padding: 0;
  }

  a:hover {
    border-bottom: 1.3px solid black;
  }
}
.change-plan {
  align-self: flex-start;
}
</style>
