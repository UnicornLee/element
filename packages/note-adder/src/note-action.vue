<template>
  <div>
    <div class="note-action" @click="actionClick">
      <div class="note-action-icon-title">
        <div v-if="type === 'background'">
          <span class="note-action-background" :style="{backgroundColor: lastUsed.val}">A</span>
        </div>
        <div v-else-if="type === 'wave'">
          <span class="note-action-wave" :style="{textDecorationColor: lastUsed.val}">A</span>
        </div>
        <div v-else-if="type === 'straight'">
          <span class="note-action-straight" :style="{textDecorationColor: lastUsed.val}">A</span>
        </div>
        <div v-else :class="['el-icon-' + iconName]" style="font-size: 18px;"></div>
        <div>{{ title }}</div>
      </div>
      <div v-if="isDropdown" class="el-icon-arrow-down note-action-dropdown">
      </div>
    </div>
    <el-popover
        ref="noteColorSelectPopover"
        placement="top"
        trigger="manual"
        v-model="visible"
    >
      <note-color-select :lastUsed="lastUsed" :shortcut-key="shortcutKey" :colors="colors" :last-used="lastUsed"
                         @color-selected="selectColor" />
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
    colors: {
      type: Array,
      items: {
        type: Object,
        properties: {
          name: {
            type: String,
            default: ''
          },
          val: {
            type: String,
            default: ''
          }
        }
      }
    },
    shortcutKey: {
      type: String,
      default: ''
    },
    lastUsed: {
      type: Object,
      default: () => ({
        name: '红',
        val: 'red'
      })
    },
    clickHandler: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false
    };
  },
  components: {
    NoteColorSelect
  },
  mounted() {
    document.addEventListener('mousedown', this.handleClick);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleClick);
  },
  methods: {
    actionClick() {
      if (this.isDropdown) {
        console.log('isDropdown');
        this.visible = true;
        const colorVisible = this.visible;
        this.$emit('action-clicked', colorVisible);
      } else {
        this.clickHandler();
      }
    },
    selectColor(color) {
      console.log('note-action: selectColor', JSON.stringify(color));
      this.visible = false;
      const type = this.type;
      this.$emit('action-color-selected', {type, color});
    },
    handleClick(event) {
      if (this.visible) {
        // 判断点击事件是否发生在Popover外部
        const popoverEl = this.$refs.noteColorSelectPopover.$el;
        if (!popoverEl.contains(event.target)) {
          // 点击的是Popover外部，关闭Popover
          this.visible = false;
          this.$emit('action-clicked', false);
        }
      }
    }
  }
};
</script>

<style scoped>
.note-action {
  display: flex;
  width: 70px;
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
.note-action-background {
  font-size: 18px;
}
.note-action-straight {
  font-size: 18px;
  text-decoration: underline;
}
.note-action-wave {
  font-size: 18px;
  text-decoration: underline;
  text-decoration-style: wavy;
}
</style>
