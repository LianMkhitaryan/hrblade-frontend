<template>
  <app-page class="page-profile">
    <template slot="header">
      <a-breadcrumb class="mb-5" separator=">">
        <a-breadcrumb-item>
          {{ $t('breadcrumbs.profile') }}
        </a-breadcrumb-item>
      </a-breadcrumb>

      <a-row :gutter="[
        { lg: 20, xs: 10 },
        { lg: 20, xs: 10 }
      ]">
        <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
          <page-title>
            {{ user.name }}
          </page-title>
        </a-col>

        <a-col :md="{ span: 12 }" :xs="{ span: 24 }" class="text-right-md">
          <app-button type="primary" @click="logout">
            {{ $t('sidebar.links.log_out') }}
          </app-button>
        </a-col>
      </a-row>
    </template>

    <a-row type="flex" :gutter="[
      { lg: 20, xs: 10 },
      { lg: 20, xs: 10 }
    ]">
      <a-col v-if="user.id" :span="24" :dir="this.$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
        <user-card :info="user" />
      </a-col>

      <a-col id="billing" :span="24" :dir="this.$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
        <billing ref="billing" @on-show-invoice="onShowInvoice" />
      </a-col>

      <a-col v-if="isInvoiceFormVisible" :span="24">
        <card id="invoice-form">
          <page-title tag="h3" size="16">
            {{ $t('send_me_invoice_for_bank_transfer') }}
          </page-title>

          <a-form class="invoice-form">
            <a-row :gutter="20">
              <a-col :md="{ span: 14 }" :xs="{ span: 24 }">
                <a-form-item has-feedback :label="
                  invoiceData.description.value &&
                  $t('placeholders.legal_entity_details')
                " :validate-status="invoiceData.description.status">
                  <a-input v-model="invoiceData.description.value" type="textarea"
                    :placeholder="$t('placeholders.legal_entity_details')" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="20" class="mt-10">
              <a-col :md="{ span: 14 }" :xs="{ span: 16 }">
                <a-form-item has-feedback :label="invoiceData.plan.value && $t('placeholders.tariff')"
                  :validate-status="invoiceData.plan.status">
                  <a-select :placeholder="$t('placeholders.tariff')" :defaultActiveFirstOption="false"
                    :value="invoiceData.plan.value" @change="handleChangeInvoiceTariff">
                    <div slot="suffixIcon">
                      <icon-arrow-down></icon-arrow-down>
                    </div>

                    <template slot="notFoundContent">
                      <div class="ant-empty ant-empty-normal ant-empty-small">
                        <div class="ant-empty-image">
                          <icon-more fill="rgba(0, 0, 0, 0.25)"></icon-more>
                        </div>
                        <p class="ant-empty-description">
                          {{ $t('no_data') }}
                        </p>
                      </div>
                    </template>

                    <a-select-option v-for="(tariff, index) in invoiceTariffs" :key="index" :value="tariff">
                      {{ tariff }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="{ span: 6 }" :xs="{ span: 8 }">
                <a-form-item has-feedback :label="
                  invoiceData.currency.value && $t('placeholders.currency')
                " :validate-status="invoiceData.currency.status">
                  <a-select :placeholder="$t('placeholders.currency')" :defaultActiveFirstOption="false"
                    :value="invoiceData.currency.value" @change="handleChangeInvoiceCurrency">
                    <div slot="suffixIcon">
                      <icon-arrow-down></icon-arrow-down>
                    </div>

                    <template slot="notFoundContent">
                      <div class="ant-empty ant-empty-normal ant-empty-small">
                        <div class="ant-empty-image">
                          <icon-more fill="rgba(0, 0, 0, 0.25)"></icon-more>
                        </div>
                        <p class="ant-empty-description">
                          {{ $t('no_data') }}
                        </p>
                      </div>
                    </template>

                    <a-select-option v-for="(value, index) in currency" :key="index" :value="value">
                      {{ value }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24" class="mt-10">
                <div class="invoice-form-action">
                  <app-button size="large" :loading="isLoadingSendInvoice" @click="handleSendInvoice">
                    {{ $t('send_invoice') }}
                  </app-button>

                  <span class="invoice-form-user-email grayish-blue-400">
                    {{ `${$t('to')} ${user.email}` }}
                  </span>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </card>
      </a-col>
    </a-row>
  </app-page>
</template>

<script>
import { mapState } from 'vuex';
import { currency } from '../js/const/index.js';
import apiRequest from '../js/helpers/apiRequest.js';
import removeTokenFromLocalStorage from '../js/helpers/removeTokenFromLocalStorage.js';

import AppPage from '../components/AppPage.vue';
import PageTitle from '../components/PageTitle.vue';
import UserCard from '../components/UserCard.vue';
import Billing from '../components/Billing';
import Card from '../components/Card.vue';
import AppButton from '../components/AppButton.vue';

import IconArrowDown from '../components/icons/ArrowDown.vue';
import IconMore from '../components/icons/More.vue';

export default {
  name: 'Profile',

  components: {
    AppPage,
    PageTitle,
    Billing,
    UserCard,
    Card,
    AppButton,
    IconArrowDown,
    IconMore
  },

  data() {
    return {
      currency,
      isLoadingSendInvoice: false,
      tokenGenerationLoading: false,
      isInvoiceFormVisible: false,
      token: '',
      invoiceData: {
        description: { value: '', status: '' },
        plan: { value: undefined, status: '' },
        currency: { value: undefined, status: '' }
      }
    };
  },

  metaInfo() {
    return {
      title: `HRBLADE | ${this.$t('breadcrumbs.profile')}`
    };
  },

  computed: {
    invoiceTariffs() {
      const { plans } = this;

      const prices = [].concat.apply(
        [],
        plans.map(({ prices }) => [
          ...new Set(
            prices.map(
              (price) =>
                `${price.name} - ${price.isYearly ? '1 year' : '6 month'}`
            )
          )
        ])
      );

      if (!prices) {
        return [];
      }

      return prices;
    },

    ...mapState({
      user: ({ user }) => user.info,
      plan: ({ user }) => user.plan,
      plans: ({ app }) => app.plans
    })
  },

  methods: {
    logout() {
      removeTokenFromLocalStorage();
      this.$router.go('/login');
    },

    handleChangeInvoiceTariff(val) {
      this.invoiceData.plan.value = val;
    },

    handleChangeInvoiceCurrency(val) {
      this.invoiceData.currency.value = val;
    },

    onShowInvoice() {
      this.isInvoiceFormVisible = true;

      this.$nextTick(() => {
        this.$scrollTo('#invoice-form');
      });
    },

    checkForm() {
      let valid = true;

      const {
        invoiceData: { description, plan, currency }
      } = this;

      description.status = '';
      plan.status = '';
      currency.status = '';

      if (!description.value) {
        description.status = 'error';
        valid = false;
      }

      if (!plan.value) {
        plan.status = 'error';
        valid = false;
      }

      if (!currency.value) {
        currency.status = 'error';
        valid = false;
      }

      return valid;
    },

    async handleSendInvoice() {
      const valid = this.checkForm();

      if (valid) {
        try {
          const {
            invoiceData: { description, plan, currency }
          } = this;

          const body = new FormData();

          body.append('description', description.value);
          body.append('plan', plan.value);
          body.append('currency', currency.value);

          this.isLoadingSendInvoice = true;
          const res = await apiRequest('plans/invoice', 'POST', body, true);
          this.isLoadingSendInvoice = false;

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

          if (!error) {
            this.isInvoiceFormVisible = false;
            description.value = '';
            description.plan = '';
            description.currency = '';

            if (process.env.NODE_ENV === 'production') {
              window.dataLayer.push({ event: 'InvoiceSendForm' });
            }
          }
        } catch (error) {
          console.log('handleSendInvoice:', error);
          this.isLoadingSendInvoice = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.invoice-form-action {
  display: flex;
  align-items: center;

  @media (max-width: $sm) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.invoice-form-user-email {
  margin-left: 15px;

  @media (max-width: $sm) {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
