<template>
  <div class="upload">
    <a-upload-dragger
      list-type="picture-card"
      class="avatar-uploader"
      :accept="accept"
      :disabled="disabled"
      :show-upload-list="false"
      :before-upload="handleBeforeUpload"
    >
      <video-player v-if="type === 'video' && preview" :src="preview" />
      <img
        v-else-if="type !== 'video' && (preview || placeholder)"
        :src="preview || placeholder"
        alt="file"
      />

      <div v-else class="upload-info">
        <icon-upload class="upload-icon"></icon-upload>

        <div class="ant-upload-text">
          {{ label || $t('upload_your_photo') }}
        </div>
      </div>
    </a-upload-dragger>
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer.vue';
import IconUpload from './icons/Upload.vue';

export default {
  name: 'Upload',

  components: {
    VideoPlayer,
    IconUpload
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },

    label: {
      type: String,
      default: ''
    },

    placeholder: {
      type: String,
      default: ''
    },

    accept: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      preview: '',
      type: null
    };
  },

  methods: {
    handleBeforeUpload(file) {
      if (file.type.indexOf('video') >= 0) {
        this.type = 'video';
      } else {
        this.type = null;
      }

      this.getBase64(file, (preview) => {
        this.preview = preview;
        this.$emit('change', file);
      });
    },

    removePreview() {
      this.type = null;
      this.preview = '';
    },

    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }
  }
};
</script>

<style lang="scss">
.upload {
  background-color: #f9f9fa;
}

.ant-upload {
  width: 100% !important;
}

.ant-upload.ant-upload-drag {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100% !important;
  min-height: 95px !important;

  .ant-upload.ant-upload-btn {
    height: 100%;
    padding: 20px !important;
  }
}

.ant-upload.ant-upload-btn {
  padding: 0 !important;
}

.ant-upload-picture-card-wrapper {
  display: block;
}

.upload-info {
  display: flex;
  align-items: center;
}

.upload-icon {
  width: 35px;
  height: 35px;
  fill: #363151;
  margin-right: 20px;
}

.ant-upload.ant-upload-select-picture-card {
  width: 280px;
  height: 170px;
  margin: 0;
  border-radius: 5px;
  background-color: transparent;
  border: 0;
}

.ant-upload-text {
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  color: #363151;
}

.ant-upload-list-picture .ant-upload-list-item-error,
.ant-upload-list-picture-card .ant-upload-list-item-error {
  border-color: #363151;

  &:hover {
    border-color: $blue;
  }
}
</style>
