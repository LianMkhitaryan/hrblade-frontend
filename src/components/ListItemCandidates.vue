<template>
  <li class="list-item-candidates">
    <a-spin :spinning="loading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

      <router-link :to="`/jobs/candidate/${data.id}`">
        <div class="list-item-candidates-inner">
          <div class="list-item-candidates-title">
            <div class="list-item-candidates-title-name">
              <img v-if="data.videoThumb" :src="data.videoThumb" class="list-item-candidates-preview" :alt="data.name" />

              <div class="d-flex flex-column">
                {{ data.name }}

                <div class="list-item-candidates-info-item note" @click.stop.prevent="$emit('add-note', data.id)">
                  <icon-comment></icon-comment>
                  <b>{{ data.note || $t('add_quick_note') }}</b>
                </div>
              </div>
            </div>
          </div>

          <div class="list-item-candidates-info">
            <div class="list-item-candidates-info-item">
              <!-- <span>{{ $t('submitted') }}</span> -->
              <b>{{ data.createdAt }}</b>
            </div>

            <div v-if="data.location" class="list-item-candidates-info-item">
              <!-- <span>{{ $t('location') }}</span> -->

              <b>{{ data.location }}</b>
            </div>

            <div v-if="data.rate" :class="[
              'list-item-candidates-info-item',
              'rate',
              `rate-${data.rate.value}`
            ]">
              <b></b>
            </div>

            <div class="list-item-candidates-info-item stars">
              <!-- <span>{{ $t('ranking') }}</span> -->

              <b @click.stop.prevent="() => null">
                <a-rate v-model="rating" @change="onChangeRating"></a-rate>
              </b>
            </div>

            <div class="list-item-candidates-info-item remove">
              <a href="#" @click.prevent.stop="onDeleteResponse">
                <icon-del class="small fill-danger" />
              </a>
            </div>

            <div class="list-item-candidates-info-item">
              <app-button class="list-item-candidates-status-btn" @click.stop.prevent="isPipelinesVisible = true">
                <b>{{ $t(`response_status.${data.status.toLowerCase()}`) }}</b>
                <span v-if="data.pipeline">
                  {{
                    pipelines.find((item) => item.id === data.pipeline.id).name
                  }}
                </span>
              </app-button>
            </div>

            <!-- <div class="list-item-candidates-info-item">
              <b>{{ $t(`response_status.${data.status.toLowerCase()}`) }}</b>
            </div>

            <div class="list-item-candidates-info-item actions">
              <a-button
                type="link"
                @click.stop.prevent="changeCandidateStatus(data.id, 'ACCEPTED')"
              >
                <icon-check class="fill-warning"></icon-check>
              </a-button>

              <a-button
                type="link"
                @click.stop.prevent="changeCandidateStatus(data.id, 'REJECTED')"
              >
                <icon-remove></icon-remove>
              </a-button>

              <a-button
                type="link"
                @click.stop.prevent="changeCandidateStatus(data.id, 'WAIT')"
              >
                <icon-question></icon-question>
              </a-button>
            </div> -->
          </div>
        </div>
      </router-link>
    </a-spin>

    <a-modal v-model="isPipelinesVisible" class="pipelines-modal" centered :footer="false" destroyOnClose
      :closable="false" @cancel="closePipelines">
      <a-row>
        <a-col :span="24">
          <page-title tag="h3" size="25" class="mb-15">
            {{ data.name }}
          </page-title>
        </a-col>

        <a-col :span="24">
          <a-row :gutter="[20, 20]">
            <a-col :span="12">
              <a-row>
                <a-col :span="24">
                  <page-title class="pipelines-modal-title" tag="h4" size="16">
                    <img src="../assets/rocket.png" width="15" alt="Pipeline" />
                    {{ $t('Pipeline') }}
                  </page-title>
                </a-col>

                <a-col :span="24">
                  <a-button v-for="item in pipelines" :key="item.id" :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current':
                        data.pipeline && item.id === data.pipeline.id
                    }
                  ]" block @click="onChangePipelineStatus(data.id, item.id)">
                    <b>
                      {{ item.name }}
                    </b>
                  </a-button>
                </a-col>
              </a-row>
            </a-col>

            <a-col :span="12">
              <a-row :gutter="[0, 10]">
                <a-col :span="24">
                  <page-title class="pipelines-modal-title" tag="h4" size="16">
                    <img src="../assets/video.png" width="20" alt="Status" />
                    {{ $t('status') }}
                  </page-title>
                </a-col>

                <a-col :span="24">
                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current': data.status === 'NEW'
                    }
                  ]" block type="link" @click.stop.prevent="changeCandidateStatus(data.id, 'NEW')">
                    <b>
                      {{ $t('response_status.new') }}
                    </b>
                  </a-button>

                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current': data.status === 'INVITED'
                    }
                  ]" block type="link" @click.stop.prevent="
  changeCandidateStatus(data.id, 'INVITED')
">
                    <b>
                      {{ $t('response_status.invited') }}
                    </b>
                  </a-button>

                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current':
                        data.status === 'ACCEPTED'
                    }
                  ]" block type="link" @click.stop.prevent="
  changeCandidateStatus(data.id, 'ACCEPTED')
">
                    <b>
                      {{ $t('response_status.accepted') }}
                    </b>
                  </a-button>

                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current':
                        data.status === 'REJECTED'
                    }
                  ]" block type="link" @click.stop.prevent="
  changeCandidateStatus(data.id, 'REJECTED')
">
                    <b>
                      {{ $t('response_status.rejected') }}
                    </b>
                  </a-button>

                  <a-button :class="[
                    'pipelines-modal-btn',
                    {
                      'pipelines-modal-btn-current': data.status === 'WAIT'
                    }
                  ]" block type="link" @click.stop.prevent="changeCandidateStatus(data.id, 'WAIT')">
                    <b>
                      {{ $t('response_status.wait') }}
                    </b>
                  </a-button>
                </a-col>

                <a-col v-if="data.status === 'NEW'" :span="24">
                  <app-button type="primary" @click="onInvite">
                    {{ $t('Invite to interview') }}
                  </app-button>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
  </li>
</template>

<script>
import apiRequest from '../js/helpers/apiRequest';

import AppButton from '../components/AppButton.vue';
import PageTitle from '../components/PageTitle.vue';

import IconComment from './icons/Comment.vue';
import IconDel from './icons/Del.vue';

export default {
  name: 'ListItemCandidates',

  components: {
    AppButton,
    PageTitle,

    IconComment,
    IconDel
  },

  props: {
    data: {
      type: Object,
      required: true
    },

    pipelines: {
      type: Array,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      rating: 0,
      isPipelinesVisible: false
    };
  },

  created() {
    const {
      data: { rating }
    } = this;
    this.rating = rating;
  },

  methods: {
    changeCandidateStatus(id, status) {
      this.$emit('change-candidate-status', { id, status });
    },

    closePipelines() {
      this.isPipelinesVisible = false;
    },

    onDeleteResponse() {
      const { id } = this.data;
      this.$emit('on-delete-response', { id });
    },

    onInvite() {
      const { id } = this.data;
      this.$emit('on-invite', { id });
    },

    async onChangePipelineStatus(id, pipelineId) {
      this.$emit('change-candidate-pipeline', { id, pipelineId });
    },

    async onChangeRating() {
      try {
        const body = new FormData();
        const {
          rating,
          data: { id }
        } = this;

        body.append('response_id', id);
        body.append('rating', rating);

        await apiRequest('response/add/rating', 'POST', body, true);
      } catch (error) {
        console.log('onChangeRating', error);
      }
    }
  }
};
</script>

<style lang="scss">
.list-item-candidates {
  position: relative;
  background-color: $white;
  box-shadow: 0 6px 20px -2px $grayish-blue-100;
  transition: 0.1s;

  &:hover {
    box-shadow: 0 12px 20px -2px darken(rgba(#9698a3, 0.1), 2.5%);
  }

  &:not(:last-of-type) {
    // margin-bottom: 10px;
    border-bottom: 1px solid #dedede;
  }
}

.list-item-candidates-inner {
  display: flex;
  align-items: center;
  padding: 10px;

  @media (max-width: $sm) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.list-item-candidates-title {
  display: flex;
  align-items: center;
}

// .list-item-candidates-title-status {
//   position: relative;
//   width: 4px;
//   height: 40px;
//   border-radius: 6px;

//   &.invited {
//     background-color: #72efcb;
//   }

//   &.review {
//     background-color: $blue;
//   }

//   &.accepted {
//     background-color: #0dde84;
//   }

//   &.rejected {
//     background-color: #f40000;
//   }
// }

.list-item-candidates-title-name {
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

.list-item-candidates-preview {
  width: 80px;
  margin-right: 15px;
  border-radius: 5px;
}

.list-item-candidates-info {
  margin-left: auto;
  display: flex;
  align-items: center;

  @media (max-width: $sm) {
    flex-direction: row;
    flex-wrap: wrap;
    // align-items: flex-start;
    margin-top: 20px;
    margin-left: 0;
    width: 100%;
  }
}

.list-item-candidates-info-item {
  display: flex;
  flex-direction: column;
  line-height: 1;
  min-width: 110px;

  @media (max-width: $md) {
    min-width: 0;
  }

  @media (max-width: $sm) {
    flex-basis: 33.333%;
  }

  +.list-item-candidates-info-item {
    margin-left: 15px;

    @media (max-width: $md) {
      margin-left: 20px;
    }

    @media (max-width: $sm) {
      margin-left: 0;
      // margin-top: 10px;
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
    transition: 0.25s;

    &:hover {
      color: lighten(#000000, 5%);

      b {
        color: lighten(#000000, 5%);
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
    min-width: 0;

    @media (max-width: $sm) {
      display: none;
    }

    &.rate-good {
      b {
        background-color: $green;
        // &::before {
        // }
      }
    }

    &.rate-middling {
      b {
        background-color: $orange;
        // &::before {
        // }
      }
    }

    &.rate-bad {
      b {
        background-color: $red;
        // &::before {
        // }
      }
    }

    b {
      display: inline-block;
      position: relative;
      padding-left: 0 !important;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $grayish-blue-400;

      // &::before {
      //   content: '';
      //   position: absolute;
      //   top: calc(50% - 4px);
      //   left: 0;
      //   width: 8px;
      //   height: 8px;
      //   border-radius: 50%;
      //   background-color: $grayish-blue-400;
      // }
    }
  }

  &.stars {
    margin-top: -4px;

    @media (max-width: $sm) {
      // margin-top: 0;
    }
  }

  &.remove {
    min-width: auto;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &.actions {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    min-width: 0 !important;

    @media (max-width: $sm) {
      margin-top: 10px;
      margin-left: -5px;
    }

    .ant-btn {
      padding: 0;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
}

.list-item-candidates-actions {
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

.list-item-candidates-status-btn {
  padding: 10px;
  height: auto !important;
  width: 160px !important;
  white-space: initial;
  line-height: 1 !important;
  // text-align: left;

  b {
    display: block;
    margin-bottom: 2px;
  }

  span {
    margin-top: 5px;
    line-height: 1 !important;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.pipelines-modal-title {
  display: flex;
  align-items: center;

  img {
    margin-right: 10px;
  }
}

.pipelines-modal-btn {
  text-align: left;
  border: 0;
  box-shadow: none;
  padding-left: 25px;

  &:hover {
    background-color: #f8f8f8;
  }

  &.pipelines-modal-btn-current {
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transform: translateY(-50%);
      background-color: #ffab42;
    }
  }

  +.pipelines-modal-btn {
    margin-top: 10px;
  }
}
</style>
