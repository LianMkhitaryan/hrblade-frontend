<template>
  <vue-plyr ref="plr" :options="options">
    <video controls crossorigin playsinline :autoplay="isAutoplay">
      <source :src="src" />
    </video>
  </vue-plyr>
</template>

<script>
export default {
  name: 'VideoPlayer',

  props: {
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
          ],
          speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] }
        };
      }
    },

    src: {
      type: String,
      default: ''
    },

    isAutoplay: {
      type: Boolean,
      default: false
    }
  }

  // beforeDestroy() {
  //   this.$refs.plr.player.destroy();
  // }
};
</script>

<style lang="scss">
:root {
  --plyr-color-main: #fda94c;
}

.plyr {
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0 30px 40px -15px rgba(182, 183, 198, 0.53);
}
</style>
