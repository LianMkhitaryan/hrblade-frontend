<template>
  <div class="billing-info">
    <app-button @click="toggleFormVisible">
      {{ isFormVisible ? $t('cancel') : $t('change_billing_info') }}
    </app-button>

    <card v-if="isFormVisible" class="mt-20">
      <page-title tag="h3" size="16" class="stripe-form-title">
        <span>
          {{ $t('billing_information') }}
        </span>

        <div class="stripe-form-toggle-business">
          <a-switch size="small" v-model="isBusiness" />
          {{ $t('business') }}
        </div>
      </page-title>

      <a-row :gutter="[{ sm: 10, xs: 0 }, 10]">
        <a-col :sm="12" :span="24">
          <div class="billing-input-wrapper">
            <span v-if="userName.value.length" class="billing-input-label">
              {{ $t('placeholders.name') }}
            </span>

            <input
              type="text"
              :class="[
                'billing-input',
                { 'billing-input-error': userName.error }
              ]"
              :placeholder="$t('placeholders.name')"
              v-model="userName.value"
            />
          </div>
        </a-col>

        <a-col v-if="isBusiness" :sm="12" :span="24">
          <div class="billing-input-wrapper">
            <span v-if="companyName.value.length" class="billing-input-label">
              {{ $t('placeholders.company_name') }}
            </span>

            <input
              type="text"
              :class="[
                'billing-input',
                { 'billing-input-error': companyName.error }
              ]"
              :placeholder="$t('placeholders.company_name')"
              v-model="companyName.value"
            />
          </div>
        </a-col>

        <a-col :sm="12" :span="24">
          <div class="billing-input-wrapper">
            <span v-if="userEmail.value.length" class="billing-input-label">
              {{ $t('placeholders.email') }}
            </span>

            <input
              type="email"
              :class="[
                'billing-input',
                { 'billing-input-error': userEmail.error }
              ]"
              :placeholder="$t('placeholders.email')"
              v-model="userEmail.value"
            />
          </div>
        </a-col>

        <a-col :sm="12" :span="24">
          <div class="billing-input-wrapper">
            <span v-if="userCountry.value.length" class="billing-input-label">
              {{ $t('placeholders.country') }}
            </span>

            <select
              :class="[
                'billing-input',
                { 'billing-input-error': userCountry.error }
              ]"
              v-model="userCountry.value"
            >
              <option
                v-for="country in countries"
                :key="country.code"
                :value="country.code"
              >
                {{ country.name }}
              </option>
            </select>

            <icon-arrow-down class="billing-input-arrow" />
          </div>
        </a-col>

        <a-col :sm="12" :span="24">
          <div class="billing-input-wrapper">
            <span v-if="userCity.value.length" class="billing-input-label">
              {{ $t('placeholders.сity') }}
            </span>

            <input
              type="text"
              :class="[
                'billing-input',
                { 'billing-input-error': userCity.error }
              ]"
              :placeholder="$t('placeholders.сity')"
              v-model="userCity.value"
            />
          </div>
        </a-col>

        <a-col :sm="12" :span="24">
          <div class="billing-input-wrapper">
            <span v-if="userState.value.length" class="billing-input-label">
              {{ $t('placeholders.state') }}
            </span>

            <input
              type="text"
              :class="[
                'billing-input',
                { 'billing-input-error': userState.error }
              ]"
              :placeholder="$t('placeholders.state')"
              v-model="userState.value"
            />
          </div>
        </a-col>

        <a-col :sm="12" :span="24">
          <div class="billing-input-wrapper">
            <span v-if="userAddress.value.length" class="billing-input-label">
              {{ $t('placeholders.address') }}
            </span>

            <input
              type="text"
              :class="[
                'billing-input',
                { 'billing-input-error': userAddress.error }
              ]"
              :placeholder="$t('placeholders.address')"
              v-model="userAddress.value"
            />
          </div>
        </a-col>

        <a-col :sm="12" :span="24">
          <div class="billing-input-wrapper">
            <span v-if="userZip.value.length" class="billing-input-label">
              {{ $t('placeholders.zip') }}
            </span>

            <input
              type="text"
              :class="[
                'billing-input',
                { 'billing-input-error': userZip.error }
              ]"
              :placeholder="$t('placeholders.zip')"
              v-model="userZip.value"
            />
          </div>
        </a-col>

        <a-col v-if="isBusiness && isEU" :span="24">
          <div class="billing-input-wrapper">
            <span
              v-if="companyVatNumber.value.length"
              class="billing-input-label"
            >
              {{ $t('placeholders.vat_number') }}
            </span>

            <input
              type="text"
              :class="[
                'billing-input',
                { 'billing-input-error': companyVatNumber.error }
              ]"
              :placeholder="$t('placeholders.vat_number')"
              @input="validateVatNumber"
              v-model="companyVatNumber.value"
            />

            <span class="billing-input-error-message">
              {{ $t('incorrect_vat_number') }}
            </span>
          </div>
        </a-col>

        <a-col :span="24">
          <app-button :loading="isChangeBillingInfoLoading" @click="onSaveInfo">
            {{ $t('save') }}
          </app-button>
        </a-col>
      </a-row>
    </card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { debounce } from 'lodash';
import apiRequest from '../js/helpers/apiRequest';
import countries from '../js/const/countries';

import Card from './Card';
import AppButton from './AppButton';
import PageTitle from './PageTitle';

import IconArrowDown from './icons/ArrowDown';

export default {
  name: 'BillingInfo',

  components: {
    Card,
    AppButton,
    PageTitle,
    IconArrowDown
  },

  data() {
    return {
      countries,

      isFormVisible: false,
      isChangeBillingInfoLoading: false,
      // isVatNumberValid: true,

      isBusiness: true,
      userName: { value: '', error: false },
      userEmail: { value: '', error: false },
      userAddress: { value: '', error: false },
      userCity: { value: '', error: false },
      userState: { value: '', error: false },
      userZip: { value: '', error: false },
      userCountry: { value: '', error: false },
      companyName: { value: '', error: false },
      companyVatNumber: { value: '', error: false }
    };
  },

  computed: {
    isEU() {
      const country = this.countries.find(
        (country) => country.code === this.userCountry.value
      );

      return country ? country.isEU : false;
    },

    ...mapState({
      user: ({ user }) => user.info,
      plan: ({ user }) => user.plan
    })
  },

  created() {
    const {
      plan: { billing_info }
    } = this;

    this.isBusiness = billing_info.isBusiness;
    this.userName.value = billing_info.userName;
    this.userEmail.value = billing_info.userEmail;
    this.userAddress.value = billing_info.userAddress;
    this.userCity.value = billing_info.userCity;
    this.userState.value = billing_info.userState;
    this.userZip.value = billing_info.userZip;
    this.userCountry.value = billing_info.userCountry;
    this.companyName.value = billing_info.companyName;
    this.companyVatNumber.value = billing_info.companyVatNumber;
  },

  methods: {
    toggleFormVisible() {
      this.isFormVisible = !this.isFormVisible;

      if (!this.isFormVisible) {
        const {
          plan: { billing_info }
        } = this;

        this.isBusiness = billing_info.isBusiness;
        this.userName.value = billing_info.userName;
        this.userEmail.value = billing_info.userEmail;
        this.userAddress.value = billing_info.userAddress;
        this.userCity.value = billing_info.userCity;
        this.userState.value = billing_info.userState;
        this.userZip.value = billing_info.userZip;
        this.userCountry.value = billing_info.userCountry;
        this.companyName.value = billing_info.companyName;
        this.companyVatNumber.value = billing_info.companyVatNumber;
      }
    },

    validateVatNumber: debounce(async function() {
      const { companyVatNumber } = this;

      if (companyVatNumber.value.length) {
        const res = await apiRequest(
          `v2/plans/vat/validate?vat=${this.companyVatNumber.value}`,
          'GET',
          null,
          true
        );

        const { error } = res;

        if (error) {
          return (companyVatNumber.error = true);
        } else {
          companyVatNumber.error = false;
        }
      } else {
        companyVatNumber.error = false;
      }
    }, 300),

    checkBillingForm() {
      let valid = true;

      const {
        isBusiness,
        userName,
        userEmail,
        userAddress,
        userCity,
        userState,
        userZip,
        userCountry,
        companyName,
        companyVatNumber
      } = this;

      userName.error = false;
      userEmail.error = false;
      userAddress.error = false;
      userCity.error = false;
      userState.error = false;
      userZip.error = false;
      userCountry.error = false;
      companyName.error = false;

      if (!userName.value) {
        userName.error = true;
        valid = false;
      }

      if (!userEmail.value) {
        userEmail.error = true;
        valid = false;
      }

      if (!userAddress.value) {
        userAddress.error = true;
        valid = false;
      }

      if (!userCity.value) {
        userCity.error = true;
        valid = false;
      }

      if (!userState.value) {
        userState.error = true;
        valid = false;
      }

      if (!userZip.value) {
        userZip.error = true;
        valid = false;
      }

      if (!userCountry.value) {
        userCountry.error = true;
        valid = false;
      }

      if (isBusiness && !companyName.value) {
        companyName.error = true;
        valid = false;
      }

      if (companyVatNumber.error) {
        valid = false;
      }

      return valid;
    },

    async onSaveInfo() {
      const valid = this.checkBillingForm();

      if (!valid) {
        this.$notification.error({
          message: this.$t('notify.warning'),
          description: this.$t('notify.form_imvalid'),
          icon: () => <icon-error class="warning-icon" />
        });
      } else {
        try {
          const {
            isEU,
            isBusiness,
            userName,
            userEmail,
            userAddress,
            userCity,
            userState,
            userZip,
            userCountry,
            companyName,
            companyVatNumber
          } = this;

          const body = new FormData();

          body.append('client_type', isBusiness ? 'business' : 'physical');
          body.append('email', userEmail.value);
          body.append('address', userAddress.value);
          body.append('city', userCity.value);
          body.append('state', userState.value);
          body.append('postal_code', userZip.value);
          body.append('country', userCountry.value);

          if (isBusiness) {
            body.append('real_name', userName.value);
            body.append('name', companyName.value);
          } else {
            body.append('name', userName.value);
          }

          if (isEU && companyVatNumber.value.length) {
            body.append('vat', companyVatNumber.value);
          }

          this.isChangeBillingInfoLoading = true;
          const res = await apiRequest(
            'v2/plans/customer/update',
            'POST',
            body,
            true
          );

          const { error, response } = res;

          if (!error) {
            await this.getPlan();

            this.toggleFormVisible();
          }

          this.isChangeBillingInfoLoading = false;

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
          console.log(`error`, error);
          this.isChangeBillingInfoLoading = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }
      }
    },

    ...mapActions({
      getUser: 'user/getUser',
      getPlan: 'user/getPlan'
    })
  }
};
</script>

<style lang="scss">
.billing-info {
  margin-bottom: 10px;
}
</style>
