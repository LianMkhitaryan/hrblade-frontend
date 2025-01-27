<template>
  <div
    :class="[
      'video-chat',
      {
        'video-chat-with-users': totaluser > 1,
        'video-chat-grid': totaluser > 2
      }
    ]"
  >
    <webrtc-video
      ref="webrtc"
      width="100%"
      :room-id="roomId"
      :socket-u-r-l="socketURL"
      :user-name="userName"
      :users="users"
      @joined-room="onJoinRoom"
      @left-room="onLeftRoom"
      @toggle-mute="handleToggleMute"
    ></webrtc-video>
  </div>
</template>

<script>
import * as io from 'socket.io-client';
window.io = io;

import WebrtcVideo from './WebrtcVideo.vue';

export default {
  name: 'VideoChat',

  components: {
    WebrtcVideo
  },

  props: {
    roomId: {
      type: String,
      required: true
    },

    socketURL: {
      type: String,
      required: true
    },

    userName: {
      type: String,
      default: ''
    },

    canModifyRoom: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      totaluser: 0,
      users: [],
      audioMuteUsers: []
    };
  },

  methods: {
    handleJoin() {
      const rtcmConnection = this.$refs.webrtc.rtcmConnection;

      rtcmConnection.extra = {
        fullName: this.userName,
        canModifyRoom: this.canModifyRoom
      };

      this.$refs.webrtc.join();
    },

    onJoinRoom() {
      this.getUser();
    },

    onLeftRoom() {
      this.getUser();
    },

    getUser() {
      const users = [];
      const rtcmConnection = this.$refs.webrtc.rtcmConnection;

      this.totaluser = rtcmConnection.getAllParticipants().length + 1;

      rtcmConnection.getAllParticipants().forEach((participantId) => {
        const user = rtcmConnection.peers[participantId];
        const userFullName = user.extra.fullName;
        const userIncomingStreams = user.peer.getRemoteStreams();

        users.push({
          userName: userFullName,
          userStreamId: userIncomingStreams[0].streamid
        });
      });

      this.users = users;
    },

    handleToggleMute(muted) {
      const rtcmConnection = this.$refs.webrtc.rtcmConnection;

      const localeAudioStream = rtcmConnection.streamEvents.selectFirst({
        local: true
      }).stream;

      if (muted) {
        localeAudioStream.unmute('audio');
      } else {
        localeAudioStream.mute('audio');
      }
    }
  }
};
</script>

<style lang="scss">
.video-chat {
  height: calc(100vh - 200px);

  &.video-chat-grid {
    height: auto;
    display: flex;
    align-items: center;
    min-height: calc(100vh - 200px);
  }

  .video-list {
    position: relative;
    height: 100% !important;
  }

  .video-item {
    display: inline-block;

    &:nth-child(1) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &:nth-child(n + 3) {
      display: none;
    }

    &:nth-child(2) {
      bottom: 20px;
    }

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

  &.video-chat-with-users {
    .video-item {
      &:nth-child(1) {
        position: absolute;
        top: auto;
        right: 20px;
        bottom: 20px;
        left: auto;
        width: 20%;
        max-width: 100%;
        height: auto;
        z-index: 1;

        .video-item-actions {
          bottom: 5px;
        }

        .video-item-action-button {
          width: 22px;
          height: 22px;
          min-width: 0;

          svg {
            width: 14px;
            height: 14px;
          }
        }
      }

      &:nth-child(2) {
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 0;
      }
    }
  }
}
</style>
