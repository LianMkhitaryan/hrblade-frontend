<template>
  <li class="list-item-live-iterview">
    <a-spin :spinning="loading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

      <a :href="data.link ? data.link : `/i/l/${data.hash}`" target="_blank">
        <div class="list-item-live-iterview-inner">
          <div class="list-item-live-iterview-title">
            <div class="list-item-live-iterview-title-name">
              <div class="d-flex flex-column">
                {{ data.name }}

                <div class="info-item font-weight-600 mt-10">
                  <span class="info-item-label">
                    {{ `${$t('date_time')}:` }}
                    <span class="text-black">
                      {{ data.start }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="list-item-live-iterview-info">
            <div class="list-item-live-iterview-info-item">
              <a-button
                type="link"
                style="padding-left: 0;"
                @click.stop.prevent="handleCopyLiveIterviewLink"
              >
                <icon-files class="extra-small"></icon-files>
                <b>
                  {{ $t('copy_link') }}
                </b>
              </a-button>
            </div>

            <div class="list-item-live-iterview-info-item actions">
              <a-button
                type="link"
                @click.stop.prevent="handleEditLiveInterview"
              >
                <icon-edit class="fill-warning"></icon-edit>
              </a-button>

              <a-popconfirm
                :title="`${$t('are_you_sure')}?`"
                @confirm="handleRemoveLiveInterview"
              >
                <a-button type="link">
                  <icon-del class="fill-danger"></icon-del>
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </a>
    </a-spin>
  </li>
</template>

<script>
import { BASE_PATH_APP_URL } from '../js/const/index.js';
// import apiRequest from '../js/helpers/apiRequest';

// import IconComment from './icons/Comment.vue';
// import IconCheck from './icons/Check.vue';
// import IconRemove from './icons/Remove.vue';
import IconEdit from './icons/Edit.vue';
import IconDel from './icons/Del.vue';
import IconFiles from './icons/Files.vue';

export default {
  name: 'ListItemLiveInterview',

  components: {
    // IconComment,
    // IconCheck,
    // IconRemove,
    IconEdit,
    IconDel,
    IconFiles
  },

  props: {
    data: {
      type: Object,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      BASE_PATH_APP_URL
    };
  },

  methods: {
    async handleCopyLiveIterviewLink() {
      await navigator.clipboard.writeText(
        this.data.link
          ? this.data.link
          : `${BASE_PATH_APP_URL}i/l/${this.data.hash}`
      );

      this.$notification.success({
        message: this.$t('notify.success'),
        description: this.$t('notify.link_added_to_clipboard'),
        icon: () => <icon-success class="success-icon" />
      });
    },

    handleEditLiveInterview() {
      this.$emit('edit');
    },

    handleRemoveLiveInterview() {
      this.$emit('remove');
    }
  }
};
</script>

<style lang="scss">
.list-item-live-iterview {
  position: relative;
  background-color: $white;
  box-shadow: 0 6px 20px -2px $grayish-blue-100;
  transition: 0.1s;

  &:hover {
    box-shadow: 0 12px 25px -2px darken($grayish-blue-100, 2.5%);
  }

  &:not(:last-of-type) {
    // margin-bottom: 10px;
    margin-bottom: 10px;
    // border-bottom: 1px solid #dedede;
  }
}

.list-item-live-iterview-inner {
  display: flex;
  align-items: center;
  padding: 20px;

  @media (max-width: $sm) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.list-item-live-iterview-title {
  display: flex;
  align-items: center;
}

.list-item-live-iterview-title-name {
  display: flex;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  color: $black;

  @media (max-width: $xl) {
    font-size: 14px;
  }

  @media (max-width: $lg) {
    font-size: 12px;
  }

  @media (max-width: $sm) {
    font-size: 16px;
  }
}

.list-item-live-iterview-preview {
  width: 80px;
  margin-right: 15px;
  border-radius: 5px;
}

.list-item-live-iterview-info {
  margin-left: auto;
  display: flex;
  align-items: center;

  @media (max-width: $sm) {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
    margin-left: 0;
  }
}

.list-item-live-iterview-info-item {
  display: flex;
  flex-direction: column;
  line-height: 1;
  min-width: 110px;

  @media (max-width: $md) {
    min-width: 0;
  }

  &.row {
    flex-direction: row;
  }

  + .list-item-live-iterview-info-item {
    margin-left: 15px;

    @media (max-width: $md) {
      margin-left: 20px;
    }

    @media (max-width: $sm) {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  span {
    font-size: 10px;
    color: $grayish-blue-400;
    margin-bottom: 3px;
  }

  b {
    font-weight: 600;
    font-size: 14px;
    color: $black;

    @media (max-width: $xl) {
      font-size: 12px;
    }

    @media (max-width: $lg) {
      font-size: 10px;
    }

    @media (max-width: $sm) {
      font-size: 14px;
    }
  }

  &.note {
    margin-top: 5px;
    display: flex;
    align-items: center;
    flex-direction: row;
    color: #b6b7c6;
    cursor: pointer;
    transition: 0.15s;

    &:hover {
      color: lighten(#b6b7c6, 0.3);

      b {
        color: lighten(#b6b7c6, 0.3);
      }
    }

    svg {
      width: 14px;
      height: 14px;
      margin-right: 5px;
      fill: currentColor;
    }

    b {
      max-width: 250px;
      overflow: hidden;
      white-space: nowrap;
      font-weight: 400;
      text-overflow: ellipsis;
      color: #b6b7c6;
    }
  }

  &.rate {
    &.rate-good {
      b {
        &::before {
          background-color: $green;
        }
      }
    }

    &.rate-middling {
      b {
        &::before {
          background-color: $orange;
        }
      }
    }

    &.rate-bad {
      b {
        &::before {
          background-color: $red;
        }
      }
    }

    b {
      position: relative;
      padding-left: 13px;

      &::before {
        content: '';
        position: absolute;
        top: calc(50% - 4px);
        left: 0;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: $grayish-blue-400;
      }
    }
  }

  &.actions {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    min-width: 0 !important;

    .ant-btn {
      padding: 0;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
}

.list-item-live-iterview-actions {
  margin-left: 40px;

  @media (max-width: $xl) {
    margin-left: 20px;
  }

  @media (max-width: $lg) {
    margin-left: 15px;
  }

  @media (max-width: $sm) {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>
