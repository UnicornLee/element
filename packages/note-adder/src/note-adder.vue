<template>
  <el-popover
      ref="noteActionPopover"
      placement="top"
      width="400"
      trigger="manual"
      v-model="visible"
      visible-arrow
      class="note-action-popover"
  >
    <div class="note-actions">
      <note-action title="复制" icon-name="house" />
      <note-action title="背景色" icon-name="house" is-dropdown />
      <note-action title="波浪线" icon-name="house" is-dropdown />
      <note-action title="直线" icon-name="house" is-dropdown />
      <note-action title="知易" icon-name="house" />
      <note-action title="清除" icon-name="house" />
    </div>
  </el-popover>
</template>

<script>
import NoteAction from './note-action';
export default {
  name: 'ElNoteAdder',

  componentName: 'ElNoteAdder',
  components: {
    NoteAction
  },
  data() {
    return {
      visible: false

    };
  },
  created() {
    // document.addEventListener('mouseup', this.handleTextSelection);
  },
  mounted() {
    document.addEventListener('mouseup', this.handleTextSelection);
    document.addEventListener('mousedown', this.handleDocumentClick);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.handleTextSelection);
    document.removeEventListener('mousedown', this.handleDocumentClick);
  },
  methods: {
    handleTextSelection() {
      const selection = window.getSelection();
      // eslint-disable-next-line no-debugger
      debugger;
      console.log('63  note-adder: ', JSON.stringify(selection));
      console.log('63  selection.toString().length: ', selection.toString().length);
      console.log('63  selection.toString(): ', selection.toString());
      if (!!selection && selection.rangeCount > 0 && !selection.isCollapsed && selection.toString().length > 0 && selection.toString().trim() !== '' && selection.toString() !== '{}') {
        const selectedText = selection.toString();
        console.log('66  note-adder: ', selectedText);
        // 当选区非空时，处理选中文本
        this.visible = true;
      }
    },
    handleDocumentClick(event) {
      if (this.visible) {
        // 判断点击事件是否发生在Popover外部
        const popoverEl = this.$refs.noteActionPopover.$el;
        if (!popoverEl.contains(event.target)) {
          // 点击的是Popover外部，关闭Popover
          this.visible = false;
        }
      }
    }
  }
};
</script>

<style scoped>
.note-action-popover {
  user-select: none;
}
.note-actions {
  display: flex;
  justify-content: space-between;
}
</style>
