<template>
  <div class="note-colors">
    <div class="group-title">最近使用</div>
    <div class="color-item" @click="handleColor(lastUsed)">
      <span :style="{color: lastUsed.val}">A</span>
      <span>{{ lastUsed.name }}</span>
      <span class="shortcut-key">{{ shortcutKey }}</span>
    </div>
    <div class="group-title">颜色</div>
    <div class="color-item" v-for="(item, index) in colors" :key="index" @click="handleColor(item)">
      <span :style="{color: item.val}">A</span>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'note-color-select',
  props: {
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
  methods: {
    handleColor(color) {
      console.log('note-color-select: color selected', JSON.stringify(color));
      this.$emit('color-selected', color);
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
