<template>
  <div>
    <div class="note-action" @click="actionClick">
      <div class="note-action-icon-title">
        <div :class="['el-icon-' + iconName]"></div>
        <div>{{ title }}</div>
      </div>
      <div v-if="isDropdown" class="el-icon-arrow-down note-action-dropdown">
      </div>
    </div>
    <el-popover
        ref="noteColorSelectPopover"
        placement="top"
        width="400"
        trigger="manual"
        v-model="visible"
        visible-arrow
        class="note-color-select-popover"
    >
      <note-color-select />
    </el-popover>
  </div>
</template>

<script>
import NoteColorSelect from './note-color-select';

export default {
  name: 'note-action',
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: 'house'
    },
    isDropdown: {
      type: Boolean,
      default: false
    },
    clickHandler: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      colors: [
        {name: '红色', value: 'red'},
        {name: '蓝色', value: 'blue'},
        {name: '绿色', value: 'green'},
        {name: '黄色', value: 'yellow'},
        {name: '紫色', value: 'purple'},
        {name: '粉色', value: 'pink'}
      ]
    };
  },
  components: {
    NoteColorSelect
  },
  methods: {
    actionClick() {
      if (this.isDropdown) {
        console.log('isDropdown');
        this.visible = true;
      } else {
        this.clickHandler();
      }
    }
  }
};
</script>

<style scoped>
.note-action {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  user-select: none;
}

.note-action-icon-title {
  text-align: center;
}

.note-action-dropdown {
  margin-left: 5px;
}
</style>
