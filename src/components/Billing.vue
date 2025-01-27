<template>
  <card v-if="plan.id" big-padding>
    <a-spin :spinning="isWaitOnPlanChange">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

      <div class="billing-header">
        <page-title v-if="user.agency" tag="h3" size="16" style="margin-bottom: 15px;">
          {{ `${$t('page_profile.your_current_plan')} ${plan.name}` }}
        </page-title>

        <a href="https://billing.stripe.com/p/login/bIYcQ5azO4DNa0EfYY" target="_blank" rel="noopener noreferrer">
          <app-button type="link">
            {{ $t('Billing dashboard') }}
            <icon-blank class="ml-10" />
          </app-button>
        </a>
      </div>

      <page-title v-if="user.agency" tag="h4" size="14">
        {{ `${$t('users_2')}: ${user.agency.quantity}` }}
      </page-title>

      <page-title :class="['plan-status', { active: plan.active }]" v-if="user.agency" tag="h4" size="14">
        {{ `${$t('status')}:` }}

        <span>
          {{
            `${plan.active
              ? $t('plan_status.active')
              : $t('plan_status.сanceled')
              } ${plan.active
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

      <progress-bar :percent="(plan.responsesCount * 100) / plan.responsesLimit" :class="[
          'mt-auto',
          'mb-20',
          plan.responsesCount > plan.responsesLimit ? 'red' : 'orange-gradient'
        ]">
        <span slot="label">
          {{ $t('responses') }}

          <span class="grayish-blue-400">
            {{
              `(${$t('period')}: ${tariffPlanPeriod.from} - ${tariffPlanPeriod.to
              })`
            }}
          </span>
        </span>

        <span slot="value">
          {{ `${plan.responsesCount} / ${plan.responsesLimit}` }}
        </span>
      </progress-bar>

      <progress-bar :percent="(jobsCount * 100) / plan.jobsLimit" :class="[
          'mt-auto',
          'mb-20',
          jobsCount > plan.jobsLimit ? 'red' : 'orange-gradient'
        ]">
        <span slot="label">
          {{ $t('jobs') }}
        </span>

        <span slot="value">
          {{ `${jobsCount} / ${plan.jobsLimit}` }}
        </span>
      </progress-bar>

      <progress-bar :percent="(companiesCount * 100) / plan.companiesLimit" :class="[
          'mt-auto',
          'mb-20',
          companiesCount > plan.companiesLimit ? 'red' : 'orange-gradient'
        ]">
        <span slot="label">
          {{ $t('companies') }}
        </span>

        <span slot="value">
          {{ `${companiesCount} / ${plan.companiesLimit}` }}
        </span>
      </progress-bar>

      <billing-info v-if="!plan.trial && plan.price" />

      <template v-if="!$store.state.app.isMobileApp">
        <div class="mb-10 d-flex flex-wrap">
          <template v-if="plan.trial || plan.price">
            <app-button v-for="plan in plans.filter((item) => item.id !== plan.id)" :key="plan.id" type="primary"
              class="mt-10 mr-10" @click="onChangeSwapPlanId(plan.id)">
              {{ `${$t('change_to')} ${plan.name}` }}
            </app-button>
          </template>

          <template v-else>
            <app-button v-for="plan in plans" :key="plan.id" type="primary" class="mt-10 mr-10"
              :style="{ opacity: selectedPlanId === plan.id ? '0.7' : '1' }" @click="onChangePlanId(plan.id)">
              {{ `${$t('buy')} ${plan.name}` }}
            </app-button>

            <a href="https://hrblade.com/pricing" target="_blank" rel="noopener noreferrer">
              <app-button type="link" class="mt-10 mr-10">
                {{ $t('Compare plans') }}
                <icon-blank class="ml-10" />
              </app-button>
            </a>
          </template>

          <a-popconfirm v-if="plan.price" :title="`${$t('are_you_sure')}?`" @confirm="handleCancelPlan">
            <app-button class="ml-md-auto mt-10" :loading="isCancelPlanLoading">
              {{ $t('cancel_subscription') }}
            </app-button>
          </a-popconfirm>
        </div>

        <card v-if="selectedPlanId" class="mt-20 mb-20">
          <a-spin :spinning="!planApiKey">
            <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

            <a-row v-if="planApiKey">
              <a-col class="mb-20" :span="24">
                <a-row type="flex" align="middle" :gutter="[0, { md: 0, sm: 20, xs: 20 }]">
                  <a-col :xl="4" :md="5" :span="24">
                    <page-title class="mb-0" tag="h3" size="22" style="font-weight:600">
                      {{
                        plans.find((plan) => plan.id === selectedPlanId).name
                      }}
                    </page-title>
                  </a-col>

                  <a-col :xl="8" :md="12" :sm="12" :span="24">
                    <a-radio-group v-model="selectedPlanPeriod" class="change-plan-month" default-value="monthly"
                      button-style="solid">
                      <a-radio-button value="monthly">
                        {{ $t('monthly_title') }}
                      </a-radio-button>

                      <a-radio-button value="annually">
                        {{ $t('annually_title') }}
                      </a-radio-button>
                    </a-radio-group>
                  </a-col>

                  <a-col :xl="4" :md="7" :sm="12" :span="24">
                    <a-select size="small" :value="selectedPlanCurrency" :placeholder="$t('currency')"
                      :defaultActiveFirstOption="false" @change="onChangeCurrency">
                      <div slot="suffixIcon">
                        <icon-arrow-down />
                      </div>

                      <template slot="notFoundContent">
                        <div class="ant-empty ant-empty-normal ant-empty-small">
                          <div class="ant-empty-image">
                            <icon-more fill="rgba(0, 0, 0, 0.25)" />
                          </div>

                          <p class="ant-empty-description">
                            {{ $t('no_data') }}
                          </p>
                        </div>
                      </template>

                      <a-select-option v-for="(currency, index) in new Set(
                        plans
                          .find((plan) => plan.id === selectedPlanId)
                          .prices.map(({ currency }) => currency)
                      )" :key="index" :value="currency">
                        {{ currency }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
              </a-col>

              <a-col :xl="16" :span="24">
                <div class="stripe-form">
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

                        <input type="text" :class="[
                          'billing-input',
                          { 'billing-input-error': userName.error }
                        ]" :placeholder="$t('placeholders.name')" v-model="userName.value" />
                      </div>
                    </a-col>

                    <a-col v-if="isBusiness" :sm="12" :span="24">
                      <div class="billing-input-wrapper">
                        <span v-if="companyName.value.length" class="billing-input-label">
                          {{ $t('placeholders.company_name') }}
                        </span>

                        <input type="text" :class="[
                          'billing-input',
                          { 'billing-input-error': companyName.error }
                        ]" :placeholder="$t('placeholders.company_name')" v-model="companyName.value" />
                      </div>
                    </a-col>

                    <a-col :sm="12" :span="24">
                      <div class="billing-input-wrapper">
                        <span v-if="userEmail.value.length" class="billing-input-label">
                          {{ $t('placeholders.email') }}
                        </span>

                        <input type="email" :class="[
                          'billing-input',
                          { 'billing-input-error': userEmail.error }
                        ]" :placeholder="$t('placeholders.email')" v-model="userEmail.value" />
                      </div>
                    </a-col>

                    <a-col :sm="12" :span="24">
                      <div class="billing-input-wrapper">
                        <span v-if="userCountry.value.length" class="billing-input-label">
                          {{ $t('placeholders.country') }}
                        </span>

                        <select :class="[
                          'billing-input',
                          { 'billing-input-error': userCountry.error }
                        ]" v-model="userCountry.value">
                          <option v-for="country in countries" :key="country.code" :value="country.code">
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

                        <input type="text" :class="[
                          'billing-input',
                          { 'billing-input-error': userCity.error }
                        ]" :placeholder="$t('placeholders.сity')" v-model="userCity.value" />
                      </div>
                    </a-col>

                    <a-col :sm="12" :span="24">
                      <div class="billing-input-wrapper">
                        <span v-if="userState.value.length" class="billing-input-label">
                          {{ $t('placeholders.state') }}
                        </span>

                        <input type="text" :class="[
                          'billing-input',
                          { 'billing-input-error': userState.error }
                        ]" :placeholder="$t('placeholders.state')" v-model="userState.value" />
                      </div>
                    </a-col>

                    <a-col :sm="12" :span="24">
                      <div class="billing-input-wrapper">
                        <span v-if="userAddress.value.length" class="billing-input-label">
                          {{ $t('placeholders.address') }}
                        </span>

                        <input type="text" :class="[
                          'billing-input',
                          { 'billing-input-error': userAddress.error }
                        ]" :placeholder="$t('placeholders.address')" v-model="userAddress.value" />
                      </div>
                    </a-col>

                    <a-col :sm="12" :span="24">
                      <div class="billing-input-wrapper">
                        <span v-if="userZip.length" class="billing-input-label">
                          {{ $t('placeholders.zip') }}
                        </span>

                        <input type="text" :class="[
                          'billing-input',
                          { 'billing-input-error': userZip.error }
                        ]" :placeholder="$t('placeholders.zip')" v-model="userZip.value" />
                      </div>
                    </a-col>

                    <a-col v-if="isBusiness && isEU" :span="24">
                      <div class="billing-input-wrapper">
                        <span v-if="companyVatNumber.value.length" class="billing-input-label">
                          {{ $t('placeholders.vat_number') }}
                        </span>

                        <input type="text" :class="[
                          'billing-input',
                          { 'billing-input-error': companyVatNumber.error }
                        ]" :placeholder="$t('placeholders.vat_number')" @input="validateVatNumber"
                          v-model="companyVatNumber.value" />

                        <span class="billing-input-error-message">
                          {{ $t('incorrect_vat_number') }}
                        </span>
                      </div>
                    </a-col>

                    <a-col :span="24">
                      <div class="billing-input-wrapper">
                        <span v-if="promocode.value.length" class="billing-input-label">
                          {{ $t('placeholders.promocode') }}
                        </span>

                        <input type="text" :class="[
                          'billing-input',
                          { 'billing-input-error': promocode.error }
                        ]" :placeholder="$t('placeholders.promocode')" @blur="onCheckPromocode"
                          v-model="promocode.value" />

                        <app-button class="billing-input-action" type="link" :loading="isCheckPromocode"
                          @click="onCheckPromocode">
                          {{ $t('Apply') }}
                        </app-button>
                      </div>
                    </a-col>

                    <a-col :span="24">
                      <stripe-element-card ref="stripeCard" :hide-postal-code="true" :pk="planApiKey" :elementsOptions="{
                          locale: this.$i18n.locale || 'en'
                        }" :elementStyle="{
      base: {
        fontSize: '16px',
        fontFamily: 'Open Sans, sans-serif',
        '::placeholder': {
          color: 'rgba(0,0,0,0.65)'
        }
      }
    }" />
                    </a-col>
                  </a-row>
                </div>
              </a-col>

              <a-col :xl="16" :span="24">
                <list class="selected-plan-info">
                  <list-item-info :label="$t('plan_price')" class="selected-plan-info-item">
                    <template slot="value">
                      {{
                        `${currentPlanPrice.isYearly
                          ? (currentPlanPrice.price / 12).toFixed(0)
                          : currentPlanPrice.price
                          }${currentPlanPrice.symbol}`
                      }}

                      <small v-if="currentPlanPrice.isYearly">
                        {{
                          `${$t('price_per_month_paid_period', {
                            period: $t('annually')
                          })} ${currentPlanPrice.isYearly
                            ? `(${currentPlanPrice.price}${currentPlanPrice.symbol})`
                            : ''
                          }`
                        }}
                      </small>

                      <small v-else>
                        {{
                          `${$t('per_month')} ${currentPlanPrice.isYearly
                            ? `(${currentPlanPrice.price}${currentPlanPrice.symbol})`
                            : ''
                            }`
                        }}
                      </small>
                    </template>
                  </list-item-info>

                  <list-item-info v-if="priceDiscont > 0" label="" class="selected-plan-info-item">
                    <template slot="value">
                      <small style="color: #dd2705;">
                        {{ `${$t('Discount')}: ${priceDiscont}%` }}
                      </small>
                    </template>
                  </list-item-info>

                  <list-item-info v-if="isVatTaxVisible" :label="`${currentTax.percent}%, VAT Tax`">
                    <template slot="value">
                      {{
                        `${currentPlanPrice.isYearly
                          ? (currentTaxValue / 12).toFixed(0)
                          : currentTaxValue
                          }${currentPlanPrice.symbol}`
                      }}

                      <small v-if="currentPlanPrice.isYearly">
                        {{
                          `${$t('price_per_month_paid_period', {
                            period: $t('annually')
                          })} ${currentPlanPrice.isYearly
                            ? `(${currentTaxValue}${currentPlanPrice.symbol})`
                            : ''
                          }`
                        }}
                      </small>

                      <small v-else>
                        {{
                          `${$t('per_month')} ${currentPlanPrice.isYearly
                            ? `(${currentTaxValue}${currentPlanPrice.symbol})`
                            : ''
                            }`
                        }}
                      </small>
                    </template>
                  </list-item-info>

                  <list-item-info v-if="isVatTaxVisible || newDiscontPrice > 0" :label="$t('total')" :class="[
                        'selected-plan-info-item',
                        { 'selected-plan-info-item-discont': newDiscontPrice > 0 }
                      ]">
                    <template slot="value">
                      {{
                        `${currentPlanPrice.isYearly
                          ? newDiscontPrice > 0
                            ? +(newDiscontPrice / 12).toFixed(0) +
                            +(currentTaxValue / 12).toFixed(0)
                            : +(currentPlanPrice.price / 12).toFixed(0) +
                            +(currentTaxValue / 12).toFixed(0)
                          : newDiscontPrice > 0
                            ? newDiscontPrice + currentTaxValue
                            : +currentPlanPrice.price + currentTaxValue
                          }${currentPlanPrice.symbol}`
                      }}

                      <small v-if="currentPlanPrice.isYearly">
                        {{
                          `${$t('price_per_month_paid_period', {
                            period: $t('annually')
                          })} ${currentPlanPrice.isYearly
                            ? newDiscontPrice > 0
                              ? `(${(
                                newDiscontPrice + currentTaxValue
                              ).toFixed(2)}${currentPlanPrice.symbol})`
                              : `(${(
                                +currentPlanPrice.price + currentTaxValue
                              ).toFixed(2)}${currentPlanPrice.symbol})`
                            : ''
                          }`
                        }}
                      </small>

                      <small v-else>
                        {{
                          `${$t('per_month')} ${currentPlanPrice.isYearly
                            ? newDiscontPrice > 0
                              ? `(${(
                                newDiscontPrice + currentTaxValue
                              ).toFixed(2)}${currentPlanPrice.symbol})`
                              : `(${(
                                +currentPlanPrice.price + currentTaxValue
                              ).toFixed(2)}${currentPlanPrice.symbol})`
                            : ''
                            }`
                        }}
                      </small>
                    </template>
                  </list-item-info>
                </list>

                <small class="plan-info-text">
                  <template v-if="currentPlanPrice.isYearly">
                    {{ $t('plan_info_annually_message') }}

                    <a :href="`${BASE_PATH_URL[$i18n.locale]}privacy${$i18n.locale === 'ru' ? '#ru' : ''
                      }`
                      " target="_blank">
                      {{ $t('privacy_policy') }}
                    </a>

                    {{ $t('and') }}

                    <a :href="`${BASE_PATH_URL[$i18n.locale]}terms${$i18n.locale === 'ru' ? '#ru' : ''
                      }`
                      " target="_blank">
                      {{ $t('terms_and_conditions') }}
                    </a>
                  </template>

                  <template v-else>
                    {{ $t('plan_info_monthly_message') }}

                    <a :href="`${BASE_PATH_URL[$i18n.locale]}privacy${$i18n.locale === 'ru' ? '#ru' : ''
                      }`
                      " target="_blank">
                      {{ $t('privacy_policy') }}
                    </a>

                    {{ $t('and') }}

                    <a :href="`${BASE_PATH_URL[$i18n.locale]}terms${$i18n.locale === 'ru' ? '#ru' : ''
                      }`
                      " target="_blank">
                      {{ $t('terms_and_conditions') }}
                    </a>
                  </template>
                </small>
              </a-col>

              <a-col :span="24">
                <a-row type="flex" align="middle" :gutter="[20, { xsl: 0, sm: 10, xs: 10 }]">
                  <a-col :xl="6" :sm="12" :span="24">
                    <app-button type="primary" size="large" class="medium-size" :loading="isBuyPlanLoading"
                      @click="handleBuyPlan">
                      {{ $t('subscribe') }}
                    </app-button>
                  </a-col>

                  <a-col :xl="9" :sm="12" :span="24">
                    <div class="payments-info">
                      <img src="../assets/payments.svg" alt="Payments" />
                    </div>
                  </a-col>

                  <a-col :xl="9" :span="24">
                    <div class="payments-info-toggle-invoice-wrapper">
                      <app-button class="payments-info-toggle-invoice" type="link" @click="handleShowInvoice">
                        {{ $t('send_me_invoice_for_bank_transfer') }}
                      </app-button>
                    </div>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-spin>
        </card>

        <card v-if="selectedSwapPlanId" class="mt-20 mb-20">
          <a-row>
            <a-col class="mb-20" :span="24">
              <a-row type="flex" align="middle" :gutter="[0, { md: 0, sm: 20, xs: 20 }]">
                <a-col :xl="4" :md="5" :span="24">
                  <page-title class="mb-0" tag="h3" size="22" style="font-weight:600">
                    {{
                      plans.find((plan) => plan.id === selectedSwapPlanId).name
                    }}
                  </page-title>
                </a-col>

                <a-col :xl="8" :md="12" :sm="12" :span="24">
                  <a-radio-group v-model="selectedPlanPeriod" class="change-plan-month" default-value="monthly"
                    button-style="solid">
                    <a-radio-button value="monthly">
                      {{ $t('monthly_title') }}
                    </a-radio-button>

                    <a-radio-button value="annually">
                      {{ $t('annually_title') }}
                    </a-radio-button>
                  </a-radio-group>
                </a-col>

                <a-col :xl="4" :md="7" :sm="12" :span="24">
                  <a-select size="small" style="width:120px" :value="selectedPlanCurrency" :placeholder="$t('currency')"
                    :defaultActiveFirstOption="false" @change="onChangeCurrency">
                    <div slot="suffixIcon">
                      <icon-arrow-down />
                    </div>

                    <template slot="notFoundContent">
                      <div class="ant-empty ant-empty-normal ant-empty-small">
                        <div class="ant-empty-image">
                          <icon-more fill="rgba(0, 0, 0, 0.25)" />
                        </div>

                        <p class="ant-empty-description">
                          {{ $t('no_data') }}
                        </p>
                      </div>
                    </template>

                    <a-select-option v-for="(currency, index) in new Set(
                      plans
                        .find((plan) => plan.id === selectedSwapPlanId)
                        .prices.map(({ currency }) => currency)
                    )" :key="index" :value="currency">
                      {{ currency }}
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-col>

            <!-- <a-col :span="24">
              <div class="billing-input-wrapper">
                <span v-if="promocode.value.length" class="billing-input-label">
                  {{ $t('placeholders.promocode') }}
                </span>

                <input
                  type="text"
                  :class="[
                    'billing-input',
                    { 'billing-input-error': promocode.error }
                  ]"
                  :placeholder="$t('placeholders.promocode')"
                  v-model="promocode.value"
                />
              </div>
            </a-col> -->

            <a-col :xl="16" :span="24">
              <list class="selected-plan-info">
                <list-item-info :label="$t('plan_price')" class="selected-plan-info-item">
                  <template slot="value">
                    {{
                      `${currentPlanPrice.isYearly
                        ? (currentPlanPrice.price / 12).toFixed(0)
                        : currentPlanPrice.price
                        }${currentPlanPrice.symbol}`
                    }}

                    <small v-if="currentPlanPrice.isYearly">
                      {{
                        `${$t('price_per_month_paid_period', {
                          period: $t('annually')
                        })} ${currentPlanPrice.isYearly
                          ? `(${currentPlanPrice.price}${currentPlanPrice.symbol})`
                          : ''
                        }`
                      }}
                    </small>

                    <small v-else>
                      {{
                        `${$t('per_month')} ${currentPlanPrice.isYearly
                          ? `(${currentPlanPrice.price}${currentPlanPrice.symbol})`
                          : ''
                          }`
                      }}
                    </small>
                  </template>
                </list-item-info>

                <template v-if="isVatTaxVisible">
                  <list-item-info :label="`${currentTax.percent}%, VAT Tax`">
                    <template slot="value">
                      {{
                        `${currentPlanPrice.isYearly
                          ? (currentTaxValue / 12).toFixed(0)
                          : currentTaxValue
                          }${currentPlanPrice.symbol}`
                      }}

                      <small v-if="currentPlanPrice.isYearly">
                        {{
                          `${$t('price_per_month_paid_period', {
                            period: $t('annually')
                          })} ${currentPlanPrice.isYearly
                            ? `(${currentTaxValue}${currentPlanPrice.symbol})`
                            : ''
                          }`
                        }}
                      </small>

                      <small v-else>
                        {{
                          `${$t('per_month')} ${currentPlanPrice.isYearly
                            ? `(${currentTaxValue}${currentPlanPrice.symbol})`
                            : ''
                            }`
                        }}
                      </small>
                    </template>
                  </list-item-info>

                  <list-item-info :label="$t('total')" class="selected-plan-info-item">
                    <template slot="value">
                      {{
                        `${currentPlanPrice.isYearly
                          ? +(currentPlanPrice.price / 12).toFixed(0) +
                          +(currentTaxValue / 12).toFixed(0)
                          : +currentPlanPrice.price + currentTaxValue
                          }${currentPlanPrice.symbol}`
                      }}

                      <small v-if="currentPlanPrice.isYearly">
                        {{
                          `${$t('price_per_month_paid_period', {
                            period: $t('annually')
                          })} ${currentPlanPrice.isYearly
                            ? `(${+currentPlanPrice.price + currentTaxValue}${currentPlanPrice.symbol
                            })`
                            : ''
                          }`
                        }}
                      </small>

                      <small v-else>
                        {{
                          `${$t('per_month')} ${currentPlanPrice.isYearly
                            ? `(${+currentPlanPrice.price + currentTaxValue}${currentPlanPrice.symbol
                            })`
                            : ''
                            }`
                        }}
                      </small>
                    </template>
                  </list-item-info>
                </template>
              </list>

              <small class="plan-info-text">
                <template v-if="currentPlanPrice.isYearly">
                  {{ $t('plan_info_annually_message') }}

                  <a :href="`${BASE_PATH_URL[$i18n.locale]}privacy${$i18n.locale === 'ru' ? '#ru' : ''
                    }`
                    " target="_blank">
                    {{ $t('privacy_policy') }}
                  </a>

                  {{ $t('and') }}

                  <a :href="`${BASE_PATH_URL[$i18n.locale]}terms${$i18n.locale === 'ru' ? '#ru' : ''
                    }`
                    " target="_blank">
                    {{ $t('terms_and_conditions') }}
                  </a>
                </template>

                <template v-else>
                  {{ $t('plan_info_monthly_message') }}

                  <a :href="`${BASE_PATH_URL[$i18n.locale]}privacy${$i18n.locale === 'ru' ? '#ru' : ''
                    }`
                    " target="_blank">
                    {{ $t('privacy_policy') }}
                  </a>

                  {{ $t('and') }}

                  <a :href="`${BASE_PATH_URL[$i18n.locale]}terms${$i18n.locale === 'ru' ? '#ru' : ''
                    }`
                    " target="_blank">
                    {{ $t('terms_and_conditions') }}
                  </a>
                </template>
              </small>
            </a-col>

            <a-col :span="24">
              <a-row type="flex" align="middle" :gutter="[20, { xsl: 0, sm: 10, xs: 10 }]">
                <a-col :xl="6" :sm="12" :span="24">
                  <app-button :loading="isSwapPlanLoading" @click="handleSwapPlan">
                    {{ $t('change') }}
                  </app-button>
                </a-col>

                <a-col :xl="9" :sm="12" :span="24">
                  <div class="payments-info">
                    <img src="../assets/payments.svg" alt="Payments" />
                  </div>
                </a-col>

                <a-col :xl="9" :span="24">
                  <div class="payments-info-toggle-invoice-wrapper">
                    <app-button class="payments-info-toggle-invoice" type="link" @click="handleShowInvoice">
                      {{ $t('send_me_invoice_for_bank_transfer') }}
                    </app-button>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </card>
      </template>
    </a-spin>
  </card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { BASE_PATH_URL } from '../js/const/index';
import countries from '../js/const/countries';
import apiRequest from '../js/helpers/apiRequest';
import locales from '../js/plugins/date-fns';

import { StripeElementCard } from '@vue-stripe/vue-stripe';
import BillingInfo from './BillingInfo';
import Card from './Card';
import PageTitle from './PageTitle';
import AppButton from './AppButton';
import ProgressBar from './ProgressBar';
import List from './List';
import ListItemInfo from './ListItemInfo';

import IconArrowDown from './icons/ArrowDown';
import IconBlank from './icons/Blank.vue';

export default {
  name: 'Billing',

  components: {
    StripeElementCard,
    BillingInfo,
    Card,
    PageTitle,
    AppButton,
    ProgressBar,
    List,
    ListItemInfo,
    IconArrowDown,
    IconBlank
  },

  data() {
    return {
      locales,
      BASE_PATH_URL,
      countries,

      isBuyPlanLoading: false,
      isSwapPlanLoading: false,
      isCancelPlanLoading: false,
      isWaitOnPlanChange: false,
      isCheckPromocode: false,
      // isVatNumberValid: true,

      newDiscontPrice: 0,
      priceDiscont: 0,

      isBusiness: true,
      userName: { value: '', error: false },
      userEmail: { value: '', error: false },
      userAddress: { value: '', error: false },
      userCity: { value: '', error: false },
      userState: { value: '', error: false },
      userZip: { value: '', error: false },
      userCountry: { value: '', error: false },
      companyName: { value: '', error: false },
      companyVatNumber: { value: '', error: false },
      promocode: { value: '', error: false },
      selectedPlanId: null,
      selectedSwapPlanId: null,
      selectedPlanPrice: undefined,
      selectedPlanCurrency: undefined,
      selectedPlanPeriod: 'annually'
    };
  },

  watch: {
    selectedPlanCurrency(val) {
      console.log('selectedPlanCurrency', val);
      console.log('this.selectedPlanId', this.selectedPlanId);
      if (this.selectedPlanId) {
        this.getIntent(val);
      }
    },

    plan() {
      if (this.plan.billing_info.userCountry) {
        const {
          billing_info: { isBusiness, userCountry, companyVatNumber }
        } = this.plan;

        this.isBusiness = isBusiness;
        this.userCountry.value = userCountry;
        this.companyVatNumber.value = companyVatNumber;

        this.validateVatNumber();
      }
    },

    selectedPlanPeriod() {
      this.newDiscontPrice = 0;
      this.priceDiscont = 0;
      this.promocode.value = '';
      this.promocode.error = false;
    }
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

    currentPlanPrice() {
      const isYearly = this.selectedPlanPeriod === 'annually';
      const planId = this.selectedPlanId || this.selectedSwapPlanId;
      const plan = this.plans.find((plan) => plan.id === planId);

      if (!plan) {
        return 0;
      }

      const price = plan.prices.find(
        (price) =>
          price.isYearly === isYearly &&
          price.currency === this.selectedPlanCurrency
      );

      return price;
    },

    currentTax() {
      const tax = this.taxes.find(
        (tax) =>
          tax.country.toLowerCase() === this.userCountry.value.toLowerCase()
      );

      return tax || null;
    },

    currentTaxValue() {
      const {
        userCountry,
        currentPlanPrice: { price },
        newDiscontPrice,
        currentTax,
        companyVatNumber
      } = this;

      if (
        (companyVatNumber.value &&
          !companyVatNumber.error &&
          userCountry.value !== 'EE') ||
        !currentTax
      ) {
        return 0;
      } else {
        if (newDiscontPrice > 0) {
          return (newDiscontPrice * currentTax.percent) / 100;
        } else {
          return (price * currentTax.percent) / 100;
        }
      }
    },

    isEU() {
      const country = this.countries.find(
        (country) => country.code === this.userCountry.value
      );

      return country ? country.isEU : false;
    },

    // isRU() {
    //   return this.user.country.toLowerCase() === 'ru';
    // },

    isVatTaxVisible() {
      const { isEU, currentTax, userCountry, companyVatNumber } = this;

      const isVatNumberExistAndValid =
        companyVatNumber.value && !companyVatNumber.error;

      if (
        isEU &&
        currentTax &&
        (!isVatNumberExistAndValid || userCountry.value === 'EE')
      ) {
        return true;
      }

      return false;
    },

    ...mapState({
      appLoading: ({ app }) => app.appLoading,
      planApiKey: ({ app }) => app.planApiKey,
      planIntent: ({ app }) => app.planIntent,
      user: ({ user }) => user.info,
      plan: ({ user }) => user.plan,
      plans: ({ app }) => app.plans,
      taxes: ({ app }) => app.taxes,
      jobsCount: ({ jobs }) => jobs.jobs.length,
      companiesCount: ({ company }) => company.companies.length
    })
  },

  created() {
    if (
      this.$route.query.plan_id ||
      this.$route.query.yearly ||
      this.$route.query.currency
    ) {
      this.parseQueries();
    }

    this.userName.value = this.user.name;
    this.userEmail.value = this.user.email;

    if (this.plan.billing_info.userCountry) {
      const {
        billing_info: { isBusiness, userCountry, companyVatNumber }
      } = this.plan;

      this.isBusiness = isBusiness;
      this.userCountry.value = userCountry;
      this.companyVatNumber.value = companyVatNumber;

      this.validateVatNumber();
    } else {
      this.userCountry.value = this.user.country;
    }

    // if (this.isEU) {
    //   this.selectedPlanCurrency = 'EUR';
    // }
  },

  methods: {
    format,

    handleShowInvoice() {
      this.$emit('on-show-invoice');
    },

    parseQueries() {
      const {
        plan: { price },
        $route: {
          query: { plan_id, yearly, currency }
        }
      } = this;

      if (plan_id) {
        this.selectedPlanPeriod = !yearly ? 'monthly' : 'annually';
        this.selectedPlanCurrency = currency
          ? currency.toUpperCase()
          : undefined;

        if (price === 0) {
          this.onChangePlanId(+plan_id);
        } else {
          this.onChangeSwapPlanId(+plan_id);
        }
      }

      this.$nextTick(() => {
        this.$scrollTo('#billing');
      });
    },

    onChangePlanId(id) {
      // if (this.isRU) {
      //   return this.handleShowInvoice();
      // }

      this.newDiscontPrice = 0;
      this.priceDiscont = 0;
      this.promocode.value = '';
      this.promocode.error = false;

      const currency = [
        ...new Set(
          this.plans
            .find((plan) => plan.id === id)
            .prices.map(({ currency }) => currency)
        )
      ];

      if (this.selectedPlanCurrency === undefined) {
        if (this.isEU) {
          this.selectedPlanCurrency = 'EUR';
        } else {
          this.selectedPlanCurrency = currency[0];
        }
      }

      this.selectedPlanId = id;

      if (process.env.NODE_ENV === 'production') {
        window.dataLayer.push({ event: 'TariffClick' });
      }
    },

    onChangeSwapPlanId(id) {
      // if (this.isRU) {
      //   return this.handleShowInvoice();
      // }

      this.newDiscontPrice = 0;
      this.priceDiscont = 0;
      this.promocode.value = '';
      this.promocode.error = false;

      const currency = [
        ...new Set(
          this.plans
            .find((plan) => plan.id === id)
            .prices.map(({ currency }) => currency)
        )
      ];

      if (this.selectedPlanCurrency === undefined) {
        if (this.isEU) {
          this.selectedPlanCurrency = 'EUR';
        } else {
          this.selectedPlanCurrency = currency[0];
        }
      }

      this.selectedSwapPlanId = id;

      if (process.env.NODE_ENV === 'production') {
        window.dataLayer.push({ event: 'TariffClick' });
      }
    },

    onChangeTariffPrice(val) {
      this.selectedPlanPrice = val;

      this.newDiscontPrice = 0;
      this.priceDiscont = 0;
      this.promocode.value = '';
      this.promocode.error = false;
    },

    onChangeCurrency(val) {
      this.selectedPlanCurrency = val;

      this.newDiscontPrice = 0;
      this.priceDiscont = 0;
      this.promocode.value = '';
      this.promocode.error = false;
    },

    clearBillingForm() {
      this.isBusiness = true;

      this.newDiscontPrice = 0;
      this.priceDiscont = 0;
      this.promocode.value = '';
      this.promocode.error = false;

      this.userName.value = this.user.name;
      this.userEmail.value = this.user.email;
      this.userAddress.value = '';
      this.userCity.value = '';
      this.userState.value = '';
      this.userZip.value = '';
      this.userCountry.value = this.user.country;
      this.companyName.value = '';
      this.companyVatNumber.value = '';

      this.selectedPlanId = null;
      this.selectedSwapPlanId = null;
      this.selectedPlanPrice = undefined;
      this.selectedPlanCurrency = undefined;
      this.selectedPlanPeriod = 'annually';
    },

    async onCheckPromocode() {
      const { promocode } = this;

      if (promocode.value) {
        const isYearly = this.selectedPlanPeriod === 'annually';
        const stripePriceId = this.plans
          .find((plan) => plan.id === this.selectedPlanId)
          .prices.find(
            (price) =>
              price.isYearly === isYearly &&
              price.currency === this.selectedPlanCurrency
          ).stripePriceId;

        this.isCheckPromocode = true;

        const res = await apiRequest(
          `v2/plans/promocode?plan_id=${this.selectedPlanId}&price_id=${stripePriceId}&promocode=${promocode.value}`,
          'GET',
          null,
          true
        );

        this.isCheckPromocode = false;

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

        if (error) {
          promocode.error = true;
        } else {
          promocode.error = false;

          const { price, percent_off } = response.data;

          this.newDiscontPrice = price;
          this.priceDiscont = percent_off;
        }
      } else {
        promocode.error = false;

        this.newDiscontPrice = 0;
        this.priceDiscont = 0;
      }
    },

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
      // companyVatNumber.error = false;

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

    validateVatNumber: debounce(async function () {
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

    async handleBuyPlan() {
      const valid = this.checkBillingForm();

      if (!valid) {
        this.$notification.error({
          message: this.$t('notify.warning'),
          description: this.$t('notify.form_imvalid'),
          icon: () => <icon-error class="warning-icon" />
        });
      } else {
        try {
          const stripe = this.$refs.stripeCard.stripe;
          const card = this.$refs.stripeCard.element;
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
            companyVatNumber,
            promocode,
            planIntent: { client_secret }
          } = this;

          this.isBuyPlanLoading = true;
          const res = await stripe.confirmCardSetup(client_secret, {
            payment_method: {
              type: 'card',
              card: card,
              billing_details: {
                name: userName.value,
                email: userEmail.value,
                address: {
                  line1: userAddress.value,
                  city: userCity.value,
                  state: userState.value,
                  postal_code: userZip.value,
                  country: userCountry.value
                }
              }
            }
          });

          if (res.error) {
            this.$notification.warning({
              message: this.$t('notify.warning'),
              description: res.error.message,
              icon: () => <icon-error class="warning-icon" />
            });
          } else {
            const {
              setupIntent: { payment_method }
            } = res;
            const isYearly = this.selectedPlanPeriod === 'annually';
            const stripePriceId = this.plans
              .find((plan) => plan.id === this.selectedPlanId)
              .prices.find(
                (price) =>
                  price.isYearly === isYearly &&
                  price.currency === this.selectedPlanCurrency
              ).stripePriceId;

            const body = new FormData();

            body.append('plan_id', this.selectedPlanId);
            body.append('price_id', stripePriceId);
            body.append('token', payment_method);
            body.append('client_type', isBusiness ? 'business' : 'physical');
            body.append('email', userEmail.value);
            body.append('address', userAddress.value);
            body.append('city', userCity.value);
            body.append('state', userState.value);
            body.append('postal_code', userZip.value);
            body.append('country', userCountry.value);

            if (promocode.value.length && !promocode.error) {
              body.append('promocode', promocode.value);
            }

            if (isBusiness) {
              body.append('real_name', userName.value);
              body.append('name', companyName.value);
            } else {
              body.append('name', userName.value);
            }

            if (isEU && companyVatNumber.value.length) {
              body.append('vat', companyVatNumber.value);
            }

            const res2 = await apiRequest(
              'v2/plans/subscribe',
              'POST',
              body,
              true
            );

            const { error, response } = res2;

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

            if (error) {
              this.getIntent(this.selectedPlanCurrency);
            } else {
              // delay before plan changed
              this.isWaitOnPlanChange = true;
              setTimeout(() => {
                Promise.all([
                  this.getUser(),
                  this.getPlan(),
                  this.getPlans()
                ]).then(() => {
                  this.isWaitOnPlanChange = false;
                });
              }, 5000);

              this.clearBillingForm();

              if (process.env.NODE_ENV === 'production') {
                window.dataLayer.push({ event: 'PurchaseClick' });
              }
            }
          }
        } catch (error) {
          console.log(`error`, error);
          this.getIntent(this.selectedPlanCurrency);
          this.isBuyPlanLoading = false;
          this.$notification.error({
            message: this.$t('notify.error'),
            description: this.$t('notify.something_went_wrong'),
            icon: () => <icon-error class="error-icon" />
          });
        }

        this.isBuyPlanLoading = false;
      }
    },

    async handleSwapPlan() {
      try {
        const body = new FormData();

        const isYearly = this.selectedPlanPeriod === 'annually';
        const stripePriceId = this.plans
          .find((plan) => plan.id === this.selectedSwapPlanId)
          .prices.find(
            (price) =>
              price.isYearly === isYearly &&
              price.currency === this.selectedPlanCurrency
          ).stripePriceId;

        body.append('plan_id', this.selectedSwapPlanId);
        body.append('price_id', stripePriceId);

        // if (this.promocode.value.length) {
        //   body.append('promocode', this.promocode.value);
        // }

        this.isSwapPlanLoading = true;
        const res = await apiRequest('v2/plans/swap', 'POST', body, true);
        this.isSwapPlanLoading = false;

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
          // delay before plan changed
          this.isWaitOnPlanChange = true;
          setTimeout(() => {
            Promise.all([this.getUser(), this.getPlan(), this.getPlans()]).then(
              () => {
                this.isWaitOnPlanChange = false;
              }
            );
          }, 3500);

          this.clearBillingForm();
        }
      } catch (error) {
        console.log(`error`, error);
        this.isSwapPlanLoading = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }

      this.isSwapPlanLoading = false;
    },

    async handleCancelPlan() {
      try {
        this.isCancelPlanLoading = true;
        const res = await apiRequest('v2/plans/cancel', 'POST', null, true);
        this.isCancelPlanLoading = false;

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
          // delay before plan changed
          this.isWaitOnPlanChange = true;
          setTimeout(() => {
            Promise.all([this.getUser(), this.getPlan(), this.getPlans()]).then(
              () => {
                this.isWaitOnPlanChange = false;
              }
            );
          }, 3500);

          this.clearBillingForm();
        }
      } catch (error) {
        console.log('handleCancelPlan', error);
        this.isCancelPlanLoading = false;
        this.$notification.error({
          message: this.$t('notify.error'),
          description: this.$t('notify.something_went_wrong'),
          icon: () => <icon-error class="error-icon" />
        });
      }
    },

    ...mapActions({
      getUser: 'user/getUser',
      getPlan: 'user/getPlan',
      getPlans: 'app/getPlans',
      getIntent: 'app/getIntent'
    })
  }
};
</script>

<style lang="scss">
.button-plans {
  line-height: 55px !important;

  &:not(:last-of-type) {
    @media (max-width: $sm) {
      margin-bottom: 10px;
    }
  }
}

.stripe-form {
  .InputContainer {
    &:after {
      color: rgba(0, 0, 0, 0.65);
    }
  }

  .InputElement {
    &::placeholder {
      color: red !important;
    }
  }
}

.billing-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.stripe-form-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stripe-form-toggle-business {
  display: flex;
  align-items: center;
  margin-left: 15px;

  .ant-switch {
    margin-right: 10px;
  }
}

.billing-input {
  box-sizing: border-box;
  width: 100%;
  height: 45px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  transition: box-shadow 150ms ease;
  font-size: 16px;
  line-height: 1;
  font-family: 'Open Sans', sans-serif;
  color: #000000;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';

  &::placeholder {
    color: rgba(#000000, 0.65);
  }

  &:focus {
    outline: none;
    box-shadow: 0 1px 3px 0 #cfd7df;
  }

  &::-ms-expand {
    display: none;
  }

  &.billing-input-error {
    border-color: #fa755a;

    +.billing-input-error-message {
      display: block;
    }
  }
}

.billing-input-wrapper {
  position: relative;
}

.billing-input-label {
  position: absolute;
  top: 2px;
  left: 14px;
  line-height: 1;
  font-size: 10px;
  color: #7a7c97;
}

.billing-input-error-message {
  display: none;
}

.billing-input-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  fill: #000000;
}

.payments-info {
  // margin-top: 15px;
  display: flex;
  align-items: center;

  @media (max-width: $sm) {
    // margin-top: 10px;
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  img {
    width: 100%;
    max-width: 300px;
    // margin-left: 10px;

    @media (max-width: $sm) {
      margin-top: 5px;
      margin-bottom: 0;
      margin-left: 0;
      max-width: 230px;
    }
  }
}

.payments-info-toggle-invoice-wrapper {
  text-align: right;

  @media (max-width: $xl) {
    text-align: left;
  }
}

.payments-info-toggle-invoice {
  display: inline;
  margin-left: auto;
  padding: 0;
  text-align: left !important;
  white-space: initial !important;

  span {
    display: inline !important;
    text-decoration: underline;
  }
}

.plan-status {
  span {
    color: #dd2705;
  }

  &.active {
    span {
      color: #07885b;
    }
  }
}

.change-plan-month {
  display: inline-block;

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    border-color: #fda94c;
    background-color: #fda94c;

    &:hover {
      border-color: #fda94c;
      background-color: #fda94c;
    }
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    box-shadow: none !important;
    outline: none !important;
  }
}

.selected-plan-info {
  margin-bottom: 10px;

  span {
    color: rgba(0, 0, 0, 0.65);
  }

  small {
    color: rgba(0, 0, 0, 0.65);
  }
}

.selected-plan-info-item {
  span {
    font-size: 18px;
    color: #000000;
  }
}

.plan-info-text {
  display: block;
  margin-bottom: 15px;
  font-size: 12px;

  a {
    text-decoration: underline;
  }
}

.selected-plan-info-item-discont {

  .list-item-info-label,
  .list-item-info-value,
  .list-item-info-value small {
    color: #07885b;
  }
}

.billing-input-action {
  position: absolute !important;
  top: 50%;
  right: 15px;
  padding: 0;
  color: #fda94c !important;
  transform: translateY(-50%);
}
</style>
