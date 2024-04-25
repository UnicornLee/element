<template>
  <el-popover
      ref="noteColorSelectPopover"
      placement="top"
      trigger="manual"
      :value="computedVisible"
  >
    <div class="group-title">最近使用</div>
    <div class="color-item" @click="handleColor(lastUsed)">
      <span :style="{color: lastUsed.val}">A</span>
      <span>{{ lastUsed.name }}</span>
      <span class="shortcut-key">{{ shortcutKey }}</span>
    </div>
    <div class="group-title">颜色</div>
    <div class="color-item" @click.prevent="$emit('color-selected', null)">
      <span>A</span>
      <span>取消</span>
    </div>
    <div class="color-item" v-for="(item, index) in colors" :key="index" @click.prevent="handleColor(item)">
      <span :style="{color: item.val}">A</span>
      <span>{{ item.name }}</span>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'note-color-select',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    lastUsed: {
      name: '红',
      val: 'red'
    },
    shortcutKey: {
      type: String,
      default: 'Ctrl+Shift+H'
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
    }
  },
  computed: {
    computedVisible() {
      return this.visible;
    }
  },
  mounted() {
    document.addEventListener('mousedown', this.handleClick);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleClick);
  },
  methods: {
    handleClick(event) {
      if (this.computedVisible) {
        event.preventDefault();
        // 判断点击事件是否发生在Popover外部
        const popoverEl = this.$refs.noteColorSelectPopover.$el;
        if (!popoverEl.contains(event.target)) {
          // 点击的是Popover外部，关闭Popover
          this.$emit('color-selected', null);
          document.removeEventListener('mousedown', this.handleClick);
        }
      }
    },
    handleColor(color) {
      console.log('note-color-select: color selected', JSON.stringify(color));
      this.$emit('color-selected', color);
      document.removeEventListener('mousedown', this.handleClick);
    }
  }
};
</script>

<style scoped>
.group-title {
  font-size: 12px;
  font-weight: bold;
  color: #9a9898;
}
.shortcut-key {
  color: #9a9898;
}
.color-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 5px 0;
}
.color-item span {
  margin-right: 10px;
}
</style>
