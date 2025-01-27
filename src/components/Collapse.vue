<template>
  <div class="collapse">
    <div class="collapse-inner">
      <div v-if="title.length" class="collapse-header">
        <div class="collapse-title">
          <page-title tag="h2" size="20">
            {{ title }}
          </page-title>
        </div>
      </div>

      <div class="collapse-body">
        <a-collapse :bordered="false">
          <a-collapse-panel
            v-for="(item, index) in list"
            :key="index"
            :header="item.title"
            :showArrow="false"
          >
            <p>
              {{ item.text }}
            </p>

            <icon-plus slot="extra" class="collapse-panel-icon"></icon-plus>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle.vue';

import IconPlus from '../components/icons/Plus.vue';

export default {
  name: 'Collapse',

  components: {
    PageTitle,
    IconPlus
  },

  props: {
    title: {
      type: String,
      default: ''
    },

    list: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss">
.collapse {
  // margin-top: 25px;
}

.collapse-title {
  .page-title {
    margin-bottom: 15px;
  }
}

.collapse-panel-icon {
  width: 20px;
  height: 20px;
  fill: #969696;
}

.ant-collapse-borderless {
  background-color: transparent;
}

.ant-collapse-borderless > .ant-collapse-item {
  border-bottom-color: $grayish-blue-200;
}

.ant-collapse > .ant-collapse-item > .ant-collapse-header,
.ant-collapse
  > .ant-collapse-item.ant-collapse-no-arrow
  > .ant-collapse-header {
  padding: 12px 0;
}

.ant-collapse-content > .ant-collapse-content-box {
  padding: 0;
}

.ant-collapse-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
}

.ant-collapse-content {
  color: $black;
}

.ant-collapse-extra {
  margin-left: 10px;
}
</style>
