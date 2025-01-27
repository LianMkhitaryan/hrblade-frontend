<template>
  <footer class="app-footer">
    <div class="app-footer-container">
      <div class="app-footer-bottom">
        <a-row :gutter="{ lg: 20, md: 10, sm: 10, xs: 10 }" type="flex">
          <a-col :md="8" :span="24" class="app-footer-bottom-left">
            <span>
              &copy; HRBLADE
            </span>
          </a-col>

          <a-col v-if="withHelp" :md="8">
            <div class="app-footer-help-link">
              <a
                :href="
                  `https://${
                    $i18n.locale === 'ru' ? 'ru.' : ''
                  }hrblade.com/docs`
                "
                target="_blank"
              >
                <icon-help width="18" height="18"></icon-help>
                Help
              </a>
            </div>
          </a-col>

          <a-col
            :md="withHelp ? 8 : 16"
            :span="24"
            class="app-footer-bottom-right"
          >
            <a
              :href="
                `${BASE_PATH_URL[$i18n.locale]}privacy${
                  $i18n.locale === 'ru' ? '#ru' : ''
                }`
              "
              target="_blank"
              class="app-footer-privacy-link"
            >
              {{ $t('footer.links.privacy_policy') }}
            </a>
            <a
              :href="
                `${BASE_PATH_URL[$i18n.locale]}terms${
                  $i18n.locale === 'ru' ? '#ru' : ''
                }`
              "
              target="_blank"
              class="app-footer-privacy-link"
            >
              {{ $t('footer.links.terms_and_conditions') }}
            </a>
            <!-- <a href="#" target="_blank" class="app-footer-privacy-link">
              {{ $t('footer.links.refund_return_policy') }}
            </a> -->
          </a-col>
        </a-row>
      </div>
    </div>
  </footer>
</template>

<script>
import { BASE_PATH_URL } from '../js/const/index.js';

import IconHelp from '../components/icons/Help';

export default {
  name: 'AppFooter',

  components: {
    IconHelp
  },

  props: {
    withHelp: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      BASE_PATH_URL
    };
  }
};
</script>

<style lang="scss">
.app-footer {
  margin-top: auto;
}

.app-footer-container {
  width: 100%;
  padding: 20px 40px;

  @media (max-width: $lg) {
    padding: 20px;
  }

  @media (max-width: $sm) {
    padding: 10px;
  }
}

.app-footer-right,
.app-footer-left,
.app-footer-center {
  display: flex !important;
  align-items: center;
  align-self: center;
}

.app-footer-center {
  justify-content: center;

  @media (max-width: $md) {
    margin-top: 25px;
    justify-content: flex-start;
  }
}

.app-footer-right {
  justify-content: flex-end;

  @media (max-width: $md) {
    margin-top: 25px;
    justify-content: flex-start;
  }
}

.app-footer-bottom {
  font-size: 13px;
  color: #adadad;

  @media (max-width: $xl) {
    margin-top: 20px;
    font-size: 12px;
  }

  a {
    text-decoration: underline;
  }
}

.app-footer-bottom-right {
  text-align: right;

  @media (max-width: $md) {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }
}

.app-footer-privacy-link {
  margin-left: 20px;
  white-space: nowrap;

  @media (max-width: $md) {
    margin: 0;
  }

  @media (max-width: $md) {
    margin-top: 10px;
  }
}

.app-footer-help-link {
  text-align: center;

  @media (max-width: $md) {
    margin-top: 10px;
  }

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    text-decoration: none;
    color: #adadad;

    &:hover {
      color: #adadad;
      text-decoration: underline;
    }

    svg {
      margin-right: 5px;
      fill: currentColor;
    }
  }
}
</style>
