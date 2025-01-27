<template>
  <router-link :to="`/jobs/vacancy/${info.id}`" :class="['job-card', { 'job-card-disabled': disabled }]"
    :dir="this.$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <card big-padding>
      <div class="d-flex justify-content-between mb-10">
        <page-title tag="h3" size="16" class="job-card-title mb-0">
          {{ info.name }}
        </page-title>
      </div>

      <div class="d-flex flex-sm-column mt-auto">
        <div class="info-item-wrapper">
          <div class="info-item font-weight-600">
            <span class="info-item-label">
              {{ `${$t('start_date')}:` }}
              <span class="text-black">
                {{ info.startDate }}
              </span>
            </span>
          </div>

          <div class="info-item font-weight-600">
            <span class="info-item-label">
              {{ `${$t('end_date')}:` }}
              <span class="text-black">
                {{ info.endDate }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <a-badge :status="info.active ? 'warning' : 'default'" :text="info.active ? $t('active') : $t('disabled')"
        :class="['job-card-active-state', { bottom: smallCard }]" />

      <a-badge :count="info.interviewedCount" class="job-card-responses-count" show-zero></a-badge>
    </card>
  </router-link>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest';

import PageTitle from './PageTitle.vue';
import Card from './Card.vue';

export default {
  name: 'JobCard',

  props: {
    info: {
      type: Object,
      required: true
    },

    disabled: {
      type: Boolean,
      default: false
    },

    smallCard: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loadActiveChange: false
    };
  },

  components: {
    PageTitle,
    Card
  },

  computed: {
    company() {
      return this.$store.state.company.companies.find(
        (company) => company.id === this.info.companyId
      ).name;
    }
  },

  methods: {
    async onChangeActive(val) {
      try {
        const body = new FormData();
        const {
          info: { id }
        } = this;

        body.append('job_id', id);
        body.append('active', Number(val));

        this.loadActiveChange = true;
        const res = await apiRequest('job/active', 'POST', body, true);
        this.loadActiveChange = false;

        const { error } = res;

        if (!error) {
          this.$emit('change-active', id);
        }
      } catch (error) {
        this.loadActiveChange = false;
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
.job-card {
  display: block;

  &:hover {
    .card {
      box-shadow: 0 0 12px 0 rgba(150, 152, 163, 0.2);
    }
  }

  &.job-card-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .card {
    transition: 0.15s;
  }

  .card-inner {
    padding-right: 50px !important;
  }
}

.job-card-title {
  max-width: 500px;

  @media (max-width: $md) {
    max-width: 300px;
    font-size: 14px;
  }

  @media (max-width: $md) {
    max-width: 100%;
  }
}

.job-card-responses-count {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);

  .ant-badge-count {
    background-color: rgba(#403c54, 0.9);
  }
}

.job-card-active-state {
  position: absolute;
  right: 150px;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: $sm) {
    margin-top: 5px;
    position: static;
    transform: none;
  }

  &.bottom {
    margin-top: 5px;
    position: static;
    transform: none;
  }

  .ant-badge-status-text {
    font-size: 14px;
    color: #7b7c86;
  }
}

body.rtl {
  .job-card-active-state {
    right: auto;
    left: 20px;
  }
}
</style>
