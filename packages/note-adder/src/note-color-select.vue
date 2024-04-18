<template>
  <div class="note-colors">
    <div>最近使用</div>
    <div>
      <div :style="{backgroundColor: lastUsed.val}">A</div>
      <div>{{ lastUsed.name }}</div>
      <div>{{ shortcutKey }}</div>
    </div>
    <div>颜色</div>
    <div v-for="(item, index) in colors" :key="index" @click="handleColor(item.val)">
      <div :style="{backgroundColor: item.val}">A</div>
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'note-color-select',
  props: {
    lastUsed: {
      name: '红色',
      val: 'red'
    },
    shortcutKey: {
      type: String,
      default: 'Ctrl+Shift+H'
    },
    colors: [
      {name: '红色', val: 'red'},
      {name: '蓝色', val: 'blue'},
      {name: '绿色', val: 'green'},
      {name: '黄色', val: 'yellow'},
      {name: '紫色', val: 'purple'},
      {name: '粉色', val: 'pink'}
    ],
    handleColor: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      lastUsed: {
        name: '红色',
        value: 'red'
      },
      shortcutKey: 'Ctrl+Shift+H',
      colors: [
        {name: '红色', val: 'red'},
        {name: '蓝色', val: 'blue'},
        {name: '绿色', val: 'green'},
        {name: '黄色', val: 'yellow'},
        {name: '紫色', val: 'purple'},
        {name: '粉色', val: 'pink'}
      ]
    };
  }
};
</script>

<style scoped>

</style>
