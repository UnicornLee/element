<template>
  <el-popover
      :ref="`noteColorSelectPopover_${type}`"
      placement="top"
      trigger="manual"
      :value="computedVisible"
  >
    <div class="group-title">上次使用</div>
    <div class="color-item" @click="handleColor(lastUsed)">
      <div style="height: 20px; width: 20px; border-radius: 10px;" :style="{backgroundColor: lastUsed}"></div>
    </div>
    <div v-if="!isShortcutKeyClose">
      <span>快捷键：</span>
      <span class="shortcut-key">{{ shortcutKey }}</span>
    </div>
    <div style="display: flex;">
      <div class="color-item" @click.prevent="$emit('color-selected', {color: null, actionClose: true, isColorSelect: true})">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9.25" fill="white" stroke="#C1C1C1" stroke-width="1.5"/>
          <line x1="3.53033" y1="3.46967" x2="16.5303" y2="16.4697" stroke="#C1C1C1" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="color-item" v-for="(item, index) in colors" :key="index" @click.prevent="handleColor(item)" style="margin-left: 10px;">
        <div :style="{backgroundColor: item}">
          <svg v-if="selectedColors.length === 1 && checkColorSame(item, selectedColors[0])" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.42011 7.48303L1.42066 7.48357L4.98574 11.0268C4.98584 11.0269 4.98594 11.027 4.98604 11.0271C5.11888 11.1598 5.29113 11.2312 5.46876 11.2312C5.55433 11.2312 5.64239 11.2146 5.72088 11.1871C5.79686 11.1605 5.88354 11.1169 5.95179 11.0487L5.95205 11.0484L13.2143 3.76428C13.4869 3.49165 13.4869 3.07085 13.2143 2.79822C12.9417 2.52559 12.5209 2.52559 12.2482 2.79822L5.46817 9.57829L2.38616 6.51697C2.38606 6.51687 2.38596 6.51677 2.38586 6.51667C2.11322 6.24434 1.69264 6.24444 1.42011 6.51697C1.14748 6.7896 1.14748 7.2104 1.42011 7.48303Z" fill="white" stroke="white" stroke-width="0.5"/>
          </svg>
        </div>
      </div>
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
    type: {
      type: String,
      default: ''
    },
    lastUsed: {
      type: String,
      default: ''
    },
    isShortcutKeyClose: {
      type: Boolean,
      default: true
    },
    shortcutKey: {
      type: String,
      default: 'Ctrl+Shift+H'
    },
    colors: {
      type: Array,
      default: () => []
    },
    selectedColors: {
      type: Array,
      default: () => []
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
    checkColorSame(color1, color2) {
      if (color1.startsWith('rgba')) {
        const colors = color1.substring(5, color1.length - 1).split(',');
        color1 = this.rgbToHex(colors[0], colors[1], colors[2]);
      } else if (color1.startsWith('rgb')) {
        const colors = color1.substring(4, color1.length - 1).split(',');
        color1 = this.rgbToHex(colors[0], colors[1], colors[2]);
      }
      if (color2.startsWith('rgba')) {
        const colors = color2.substring(5, color1.length - 1).split(',');
        color2 = this.rgbToHex(colors[0], colors[1], colors[2]);
      } else if (color2.startsWith('rgb')) {
        const colors = color2.substring(4, color2.length - 1).split(',');
        color2 = this.rgbToHex(colors[0], colors[1], colors[2]);
      }
      return color1.toUpperCase() === color2.toUpperCase();
    },
    rgbToHex(r, g, b) {
      r = Number(r);
      g = Number(g);
      b = Number(b);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    },
    handleClick(event) {
      if (this.computedVisible) {
        event.preventDefault();
        event.stopPropagation();
        // 判断点击事件是否发生在Popover外部
        const actionPopover = document.getElementById('noteActionPopover').children[0].children[1];
        const popoverEl = this.$refs[`noteColorSelectPopover_${this.type}`].$el;
        if (this.isElementInside(actionPopover, event.target)) {
          this.$emit('color-selected', {color: null, actionClose: false, isColorSelect: false});
        } else if (!popoverEl.contains(event.target)) {
          // 点击的是Popover外部，关闭Popover
          this.$emit('color-selected', {color: null, actionClose: true, isColorSelect: false});
        }
      }
    },
    isElementInside(elementA, elementB) {
      const rectA = elementA.getBoundingClientRect();
      const rectB = elementB.getBoundingClientRect();

      return (rectA.left <= rectB.left &&
          rectB.right <= rectA.right &&
          rectA.top <= rectB.top &&
          rectB.bottom <= rectA.bottom
      );
    },
    handleColor(color) {
      this.$emit('color-selected', {color, actionClose: true, isColorSelect: true});
    }
  }
};
</script>

