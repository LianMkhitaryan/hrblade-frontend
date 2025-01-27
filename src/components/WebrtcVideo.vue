<template>
  <div v-if="videoList.length <= 2" class="video-list">
    <div v-for="item in videoList" :key="item.id" class="video-item">
      <div v-if="userName" class="video-item-user-name">
        {{
          users.find((user) => user.userStreamId === item.id)
            ? users.find((user) => user.userStreamId === item.id).userName
            : userName
        }}

        <div
          v-if="item.id !== localVideo.id && item.muted"
          class="video-item-user-status"
        >
          <icon-mic-off></icon-mic-off>
        </div>
      </div>

      <div v-if="item.id === localVideo.id" class="video-item-actions">
        <a-button
          shape="circle"
          class="video-item-action-button"
          @click="toggleMute(item.muted, item.id)"
        >
          <icon-mic-off v-if="item.muted"></icon-mic-off>
          <icon-mic v-else></icon-mic>
        </a-button>
      </div>

      <video
        controls
        autoplay
        playsinline
        ref="videos"
        :height="cameraHeight"
        :muted="item.muted"
        :id="item.id"
      ></video>
    </div>
  </div>

  <div v-else class="video-grid">
    <div
      v-for="item in videoList"
      :key="item.id"
      class="video-grid-item"
      :style="{ width: videoList.length % 2 === 0 ? '50%' : '33.333%' }"
    >
      <div v-if="userName" class="video-item-user-name">
        {{
          users.find((user) => user.userStreamId === item.id)
            ? users.find((user) => user.userStreamId === item.id).userName
            : userName
        }}

        <div
          v-if="item.id !== localVideo.id && item.muted"
          class="video-item-user-status"
        >
          <icon-mic-off></icon-mic-off>
        </div>
      </div>

      <div v-if="item.id === localVideo.id" class="video-item-actions">
        <a-button
          shape="circle"
          class="video-item-action-button"
          @click="toggleMute(item.muted, item.id)"
        >
          <icon-mic-off v-if="item.muted"></icon-mic-off>
          <icon-mic v-else></icon-mic>
        </a-button>
      </div>

      <video
        controls
        autoplay
        playsinline
        ref="videos"
        :height="cameraHeight"
        :muted="item.muted"
        :id="item.id"
      ></video>
    </div>
  </div>
</template>

<script>
import RTCMultiConnection from 'rtcmulticonnection';
require('adapterjs');

import IconMic from './icons/Mic.vue';
import IconMicOff from './icons/MicOff.vue';

export default {
  name: 'WebrtcVideo',

  components: {
    IconMic,
    IconMicOff
  },

  data() {
    return {
      rtcmConnection: null,
      localVideo: null,
      videoList: [],
      canvas: null
    };
  },

  props: {
    roomId: {
      type: String,
      default: 'public-room'
    },

    socketURL: {
      type: String,
      default: 'https://rtcmulticonnection.herokuapp.com:443/'
    },

    cameraHeight: {
      type: [Number, String],
      default: 160
    },

    autoplay: {
      type: Boolean,
      default: true
    },

    screenshotFormat: {
      type: String,
      default: 'image/jpeg'
    },

    enableAudio: {
      type: Boolean,
      default: true
    },

    enableVideo: {
      type: Boolean,
      default: true
    },

    enableLogs: {
      type: Boolean,
      default: false
    },

    stunServer: {
      type: String,
      default: null
    },

    turnServer: {
      type: String,
      default: null
    },

    userName: {
      type: String,
      default: ''
    },

    users: {
      type: Array,
      default: () => []
    }
  },

  // computed: {
  //   myStream() {
  //     const usersId = this.users.map((user) => user.userStreamId);

  //     return this.videoList.filter((item) => !usersId.includes(item.id));
  //   }
  // },

  mounted() {
    var that = this;

    this.rtcmConnection = new RTCMultiConnection();
    this.rtcmConnection.socketURL = this.socketURL;
    this.rtcmConnection.autoCreateMediaElement = false;
    this.rtcmConnection.enableLogs = this.enableLogs;
    this.rtcmConnection.session = {
      audio: this.enableAudio,
      video: this.enableVideo
    };
    this.rtcmConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: this.enableAudio,
      OfferToReceiveVideo: this.enableVideo
    };

    if (this.stunServer !== null || this.turnServer !== null) {
      this.rtcmConnection.iceServers = []; // clear all defaults
    }

    if (this.stunServer !== null) {
      this.rtcmConnection.iceServers.push({
        urls: this.stunServer
      });
    }

    if (this.turnServer !== null) {
      var parse = this.turnServer.split('%');
      var username = parse[0].split('@')[0];
      var password = parse[0].split('@')[1];
      var turn = parse[1];

      this.rtcmConnection.iceServers.push({
        urls: turn,
        credential: password,
        username: username
      });
    }

    this.rtcmConnection.onstream = function(stream) {
      let found = that.videoList.find((video) => {
        return video.id === stream.streamid;
      });

      if (found === undefined) {
        let video = {
          id: stream.streamid,
          muted: false
        };

        that.videoList.push(video);

        if (stream.type === 'local') {
          that.localVideo = video;
        }
      }

      setTimeout(function() {
        for (var i = 0, len = that.$refs.videos.length; i < len; i++) {
          if (that.$refs.videos[i].id === stream.streamid) {
            that.$refs.videos[i].srcObject = stream.stream;
            break;
          }
        }
      }, 1000);

      that.$emit('joined-room', stream.streamid);
    };

    this.rtcmConnection.onstreamended = function(stream) {
      var newList = [];

      that.videoList.forEach(function(item) {
        if (item.id !== stream.streamid) {
          newList.push(item);
        }
      });

      that.videoList = newList;
      that.$emit('left-room', stream.streamid);
    };

    this.rtcmConnection.onmute = (e) => {
      if (e.type === 'remote') {
        this.videoList.find((item) => item.id === e.streamid).muted = true;
      }
    };

    this.rtcmConnection.onunmute = (e) => {
      if (e.type === 'remote') {
        this.videoList.find((item) => item.id === e.streamid).muted = false;
      }
    };
  },

  methods: {
    join() {
      var that = this;
      this.rtcmConnection.openOrJoin(this.roomId, function(
        isRoomExist,
        roomid
      ) {
        if (isRoomExist === false && that.rtcmConnection.isInitiator === true) {
          that.$emit('opened-room', roomid);
        }
      });
    },

    leave() {
      this.rtcmConnection.attachStreams.forEach(function(localStream) {
        localStream.stop();
      });
      this.videoList = [];
    },

    capture() {
      return this.getCanvas().toDataURL(this.screenshotFormat);
    },

    getCanvas() {
      let video = this.getCurrentVideo();

      if (video !== null && !this.ctx) {
        let canvas = document.createElement('canvas');

        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
      }

      const { ctx, canvas } = this;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas;
    },

    getCurrentVideo() {
      if (this.localVideo === null) {
        return null;
      }

      for (var i = 0, len = this.$refs.videos.length; i < len; i++) {
        if (this.$refs.videos[i].id === this.localVideo.id)
          return this.$refs.videos[i];
      }

      return null;
    },

    shareScreen() {
      var that = this;

      if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
        function addStreamStopListener(stream, callback) {
          var streamEndedEvent = 'ended';

          if ('oninactive' in stream) {
            streamEndedEvent = 'inactive';
          }

          stream.addEventListener(
            streamEndedEvent,
            function() {
              callback();
              callback = function() {};
            },
            false
          );
        }

        function onGettingSteam(stream) {
          that.rtcmConnection.addStream(stream);
          that.$emit('share-started', stream.streamid);

          addStreamStopListener(stream, function() {
            that.rtcmConnection.removeStream(stream.streamid);
            that.$emit('share-stopped', stream.streamid);
          });
        }

        function getDisplayMediaError(error) {
          console.log('Media error: ' + JSON.stringify(error));
        }

        if (navigator.mediaDevices.getDisplayMedia) {
          navigator.mediaDevices
            .getDisplayMedia({ video: true, audio: false })
            .then((stream) => {
              onGettingSteam(stream);
            }, getDisplayMediaError)
            .catch(getDisplayMediaError);
        } else if (navigator.getDisplayMedia) {
          navigator
            .getDisplayMedia({ video: true })
            .then((stream) => {
              onGettingSteam(stream);
            }, getDisplayMediaError)
            .catch(getDisplayMediaError);
        }
      }
    },

    toggleMute(muted, itemId) {
      this.$emit('toggle-mute', muted);
      this.videoList.find((item) => item.id === itemId).muted = !muted;
    }
  }
};
</script>

<style lang="scss">
.video-list {
  background: whitesmoke;
  height: auto;
}

.video-list div {
  padding: 0px;
}

.video-item {
  background: #c5c4c4;
  display: inline-block;
}

.video-item-user-name {
  position: absolute;
  display: flex;
  align-items: center;
  top: 5px;
  left: 5px;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
  padding: 2px 5px !important;
  border-radius: 8px;
  backdrop-filter: blur(20px);
}

.video-item-user-status {
  margin-left: 15px;
  width: 16px;
  height: 16px;
  fill: #dd2705;
}

.video-grid {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}

.video-grid-item {
  position: relative;
  display: inline-block;

  video {
    display: block;
    width: 100%;
    max-width: 100%;
    height: 100%;
    object-fit: cover;

    &:focus {
      outline: none;
    }

    &::-webkit-media-controls {
      display: none;
    }
  }
}

.video-item-actions {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.video-item-action-button {
  height: 36px;
  width: 36px;

  svg {
    width: 20px;
    height: 20px;
  }
}
</style>
