<template>
  <div class="video-card">
    <div class="video-card-inner">
      <div class="video-card-header">
        <page-title tag="div" size="16">
          {{ $t('question') }} {{ index + 1 }}
        </page-title>
        <p class="text-gray-300">
          {{
            `${data.question.slice(0, 120)}${
              data.question.length > 120 ? '...' : ''
            }`
          }}
        </p>
      </div>
      <video-player
        :src="data.file ? getUrl(data.file) : data.link ? data.link : ''"
        :options="options"
      ></video-player>
    </div>

    <!-- <app-button type="primary" size="large" ghost>
      <icon-reload
        width="14"
        heigh="14"
        fill="#0636cc"
        class="mr-5"
      ></icon-reload>
      Re-take
    </app-button> -->
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue';
// import AppButton from './AppButton.vue';
import VideoPlayer from './VideoPlayer.vue';

// import IconReload from './icons/Reload.vue';

export default {
  name: 'VideoCard',

  components: {
    PageTitle,
    // AppButton,
    VideoPlayer
    // IconReload
  },

  props: {
    index: {
      type: Number,
      default: 0
    },

    data: {
      type: Object,
      required: true
    },

    options: {
      type: Object,
      default() {
        return {
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'settings'
          ]
        };
      }
    }
  },

  methods: {
    getUrl(file) {
      return URL.createObjectURL(file);
    }
  }
};
</script>

<style lang="scss">
.video-card {
  height: 100%;

  .app-button {
    margin-top: 20px;
  }

  .plyr {
    height: 280px;
    flex-shrink: 0;
    width: 100%;
  }
}

.video-card-inner {
  height: 100%;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: $white;
}

.video-card-header {
  padding: 15px;
  height: 100%;

  .page-title {
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 0;
  }
}
</style>
