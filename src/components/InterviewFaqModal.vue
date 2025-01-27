<template>
  <a-modal
    class="interview-faq-modal"
    centered
    :footer="null"
    :visible="visible"
    @cancel="handleClose"
  >
    <div class="interview-faq-modal-header">
      <page-title tag="div" size="20">
        {{ $t('how_to_get_started') }}
      </page-title>

      <p class="grayish-blue-500">
        {{ $t('watch_a_short_video') }}
      </p>
    </div>

    <div class="interview-faq-modal-body">
      <a-row
        :gutter="[
          { lg: 20, md: 10, sm: 10, xs: 10 },
          { lg: 0, md: 0, sm: 20, xs: 20 }
        ]"
      >
        <a-col :md="{ span: 12 }">
          <video-player></video-player>
        </a-col>

        <a-col :md="{ span: 12 }">
          <collapse :list="list"></collapse>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import PageTitle from './PageTitle.vue';
import VideoPlayer from './VideoPlayer.vue';
import Collapse from './Collapse.vue';

export default {
  name: 'InterviewFaqModal',

  components: {
    PageTitle,
    VideoPlayer,
    Collapse
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      list: [
        {
          title: 'Top tips for recording your video responses',
          text:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa aspernatur velit blanditiis optio molestiae dicta eum impedit iure soluta cum quam, temporibus officia? Magnam sint nam nisi non impedit dolor?'
        },
        {
          title: 'Video recording and dubbing',
          text:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa aspernatur velit blanditiis optio molestiae dicta eum impedit iure soluta cum quam, temporibus officia? Magnam sint nam nisi non impedit dolor?'
        },
        {
          title: 'How to answer all the questions without stress',
          text:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa aspernatur velit blanditiis optio molestiae dicta eum impedit iure soluta cum quam, temporibus officia? Magnam sint nam nisi non impedit dolor?'
        }
      ]
    };
  },

  methods: {
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss">
.interview-faq-modal {
  .ant-modal {
    max-width: 1150px;
    width: 100% !important;
  }

  .ant-modal-body {
    padding: 60px 100px;

    @media (max-width: $md) {
      padding: 50px;
    }

    @media (max-width: $sm) {
      padding: 25px;
    }
  }

  .collapse {
    margin-top: 0;
  }
}

.interview-faq-modal-header {
  text-align: center;
}

.interview-faq-modal-body {
  margin-top: 50px;
}
</style>
