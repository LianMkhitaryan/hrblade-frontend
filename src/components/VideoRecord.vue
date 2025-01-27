<template>
  <a-spin :spinning="!playerLoad">
    <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />

    <div class="video-record-wrapper">
      <video
        id="recordVideo"
        class="video-js vjs-default-skin video-record"
        playsinline
      />

      <a-button
        v-if="previewExists"
        class="video-record-play"
        type="primary"
        shape="circle"
        :icon="previewPlay ? 'pause' : 'caret-right'"
        @click="togglePlayPreview"
      />
    </div>
  </a-spin>
</template>

<script>
/* eslint-disable */
import videojs from 'video.js';
import 'recordrtc/RecordRTC.js';
import 'webrtc-adapter/out/adapter.js';
// import '@ffmpeg/ffmpeg/dist/ffmpeg.min.js';
import 'videojs-record/dist/videojs.record.min.js';
// import 'videojs-record/dist/plugins/videojs.record.ffmpegjs.js';
// import 'videojs-record/dist/plugins/videojs.record.ffmpeg-wasm.js';

import 'videojs-record/dist/css/videojs.record.css';
import 'video.js/dist/video-js.css';

import AppButton from '../components/AppButton.vue';

// const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default {
  name: 'VideoRecord',

  components: {
    AppButton
  },

  props: {
    duration: {
      type: Number,
      default: 180
    },

    previewExists: {
      type: Boolean,
      default: false
    },

    previewPlay: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      player: null,
      videoNode: null,
      playerLoad: false,
      options: {
        controls: false,
        autoplay: false,
        fluid: true,
        loop: false,
        bigPlayButton: false,
        displayMilliseconds: false,
        controlBar: {
          fullscreenToggle: false,
          volumePanel: false
        },
        plugins: {
          record: {
            audio: true,
            video: true,
            debug: true,
            maxLength: this.duration,
            displayMilliseconds: true
          }
        }
      }
    };
  },

  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },

  mounted() {
    const isMobileSafari = this.сheckIsMobileOrTablet();

    if (
      typeof MediaRecorder === 'undefined' ||
      !navigator.getUserMedia ||
      !!isMobileSafari
    ) {
      this.playerLoad = true;
      this.$emit('use-file');
    } else {
      this.initPlayer();

      this.player.on('deviceReady', () => {
        this.$emit('device-ready');
      });

      this.player.on('enumerateReady', () => {
        const devices = this.player.record().devices;
        const inputDevices = devices.filter(
          (device) =>
            device.kind === 'audioinput' || device.kind === 'videoinput'
        );

        console.log('input devices:', inputDevices);
      });

      this.player.on('startRecord', () => {
        this.$emit('start-recording');
      });

      this.player.on('finishRecord', () => {
        this.$emit('finish-recording', this.player.recordedData);
        // this.player.record().reset();
      });

      this.player.on('progressRecord', () => {
        this.$emit('progress-record', this.player.record().getCurrentTime());
      });

      this.player.on('error', (element, error) => {
        this.$emit('error', error);
      });

      this.player.on('deviceError', (val) => {
        this.$emit('use-file');
        this.$emit('device-error', this.player.deviceErrorCode);
      });
    }
  },

  methods: {
    сheckIsMobileOrTablet() {
      return (
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/)
      );
    },

    getDevice() {
      this.player.record().getDevice();
    },

    startRecord() {
      this.player.record().start();
    },

    stopRecord() {
      this.player.record().stop();
    },

    togglePlayPreview() {
      if (this.previewPlay) {
        this.videoNode.pause();
        this.videoNode.currentTime = 0;
        this.$emit('preview-play', false);
      } else {
        this.videoNode.play();
        this.$emit('preview-play', true);
      }
    },

    deleteRecordVideo() {
      this.videoNode.removeAttribute('src');
      this.player.record().stopDevice();
      this.player.record().getDevice();
    },

    initPlayer() {
      this.player = videojs('#recordVideo', this.options, () => {
        this.playerLoad = true;
        this.$emit('player-init');

        this.videoNode = document.getElementById('recordVideo_html5_api');
        this.player.record().enumerateDevices();
      });
    }
  }
};
</script>

<style lang="scss">
.video-record {
  width: 100%;
  padding-top: 56.25% !important;
  overflow: hidden;
  border-radius: 5px;
  background-image: linear-gradient(
    137deg,
    #202020 0%,
    #5f5f5f 48%,
    #444444 100%
  );

  .vjs-device-button {
    display: none !important;
  }
}

.recordVideo-dimensions.vjs-fluid {
  padding-top: 56.25% !important;
}

.video-record-play {
  opacity: 0;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transform: translate(-50%, -50%);
  font-size: 24px;
  border: 0;
  background-color: rgba(#fda94c, 0.9);

  &:hover {
    background-color: rgba(#fda94c, 0.7);
  }

  i {
    line-height: 0 !important;
    margin-top: -2px;
    // margin-right: -3px;
  }
}

.video-record-wrapper {
  &:hover {
    .video-record-play {
      opacity: 1;
    }
  }
}

.vjs-record.video-js .vjs-control.vjs-record-indicator:before {
  font-size: 1.3em;
}

// .vjs-record.video-js .vjs-control.vjs-record-indicator:after {
//   height: calc(1em - 4px);
//   width: calc(1em - 4px);
// }
</style>
