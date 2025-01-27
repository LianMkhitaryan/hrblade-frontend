<template>
  <a-modal
    class="upgrade-tariff-modal"
    centered
    width="700px"
    :footer="null"
    :visible="visible"
    @cancel="handleClose"
  >
    <div class="interview-faq-modal-header">
      <page-title tag="h2" size="20">
        {{ $t('upgrade_to_a_premium_plan') }}
      </page-title>
    </div>

    <div class="interview-faq-modal-body">
      <a-row type="flex" :gutter="[20, 20]">
        <a-col v-for="plan in plans" :key="plan.id" :sm="{ span: 12 }">
          <div class="interview-faq-modal-item">
            <page-title tag="h3" size="18">
              {{ plan.name }}
            </page-title>

            <ul class="upgrade-tariff-modal-list">
              <li v-for="(bonus, index) in plan.bonuses" :key="index">
                {{ bonus }}
              </li>
            </ul>

            <a
              href="#"
              type="primary"
              size="large"
              class="app-button mr-10 ant-btn ant-btn-primary ant-btn-lg button-plans"
              data-fsc-action="Add,Checkout"
              :data-fsc-item-path-value="plan.planUid"
              @click.prevent="() => null"
            >
              {{ `${$t('buy')} ${plan.name}` }}
            </a>
          </div>
        </a-col>

        <a-col :span="24">
          <div class="upgrade-tariff-modal-payments-info grayish-blue-400">
            {{ $t('secure_online_payment') }}

            <img src="../assets/payments.png" alt="Payments" />
          </div>
        </a-col>

        <a-col :span="24">
          {{ $t('or') }}

          <router-link
            to="/profile"
            class="text-orange"
            @click.native="handleClose"
          >
            {{ $t('request_an_invoice') }}
          </router-link>

          {{ $t('to_bank_transfer_payments') }}
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import PageTitle from './PageTitle.vue';

export default {
  name: 'UpgradeTariffModal',

  components: {
    PageTitle
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    plans() {
      return this.$store.state.app.plans.filter((plan) => plan.name !== 'Free');
    }
  },

  methods: {
    handleClose() {
      this.$store.commit('app/TOGGLE_UPGRADE_MODAL', false);
    }
  }
};
</script>

<style lang="scss">
.interview-faq-modal-body {
  margin-top: 50px;
}

.upgrade-tariff-modal-payments-info {
  margin-top: 10px;
  display: flex;
  align-items: center;

  img {
    width: 100%;
    max-width: 200px;
    margin-left: 10px;
  }
}

.interview-faq-modal-item {
  height: 100%;
  display: flex;
  flex-direction: column;

  .button-plans {
    margin-top: auto;
    line-height: 55px;
  }
}

.upgrade-tariff-modal-list {
  list-style: none;
  margin: 0 0 20px 0;
  padding: 0;

  li {
    font-weight: 300;
    font-size: 16px;

    &:not(:last-of-type) {
      margin-bottom: 5px;
    }
  }
}
</style>
