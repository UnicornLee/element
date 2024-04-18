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
      <note-action title="复制" type="copy" icon-name="house" :click-handler="copyText" />
      <note-action title="背景色" type="background" icon-name="house" :click-handler="backgroundTextColor" is-dropdown />
      <note-action title="波浪线" type="wave" icon-name="house" :click-handler="underlineText('wave')" is-dropdown />
      <note-action title="直线" type="line" icon-name="house" :click-handler="underlineText('line')" is-dropdown />
      <note-action title="写想法" type="idea" icon-name="house" :click-handler="noteText" />
      <note-action title="清除" type="clear" icon-name="house" :click-handler="clearNote" />
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
      if (!this.visible) {
        requestAnimationFrame(() => {
          const selection = window.getSelection();
          // eslint-disable-next-line no-debugger
          debugger;
          console.log('-----------------------------------------');;
          console.log('63  selection.anchorNode: ', selection.anchorNode);
          console.log('63  selection.anchorOffset: ', selection.anchorOffset);
          console.log('63  selection.focusNode: ', selection.focusNode);
          console.log('63  selection.focusOffset: ', selection.focusOffset);
          console.log('63  selection.isCollapsed: ', selection.isCollapsed);
          console.log('63  selection.toString().length: ', selection.toString().length);
          console.log('63  selection.toString(): ', selection.toString());
          console.log('63  selection.rangeCount: ', selection.rangeCount);
          console.log('63  selection.type: ', selection.type);
          if (!!selection && selection.rangeCount > 0 && !selection.isCollapsed && selection.toString().length > 0 && selection.toString().trim() !== '' && selection.toString() !== '{}') {
            const selectedText = selection.toString();
            console.log('66  note-adder: ', selectedText);
            // 当选区非空时，处理选中文本
            this.visible = true;
          }
        });
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
    },
    copyText() {
      // 获取文本内容
      const selection = window.getSelection();
      // 将文本内容写入剪贴板
      navigator.clipboard.writeText(selection.toString());
      // 弹出提示信息
      this.$message({
        showClose: true,
        message: '复制成功',
        type: 'success'
      });
      // 关闭Popover
      this.visible = false;
    },
    backgroundTextColor() {
      console.log('backgroundColor');
    },
    underlineText(type) {
      if (type === 'wave') {
        console.log('wave');
      } else if (type === 'line') {
        console.log('line');
      }
      console.log('underlineText');
    },
    noteText() {
      console.log('noteText');
    },
    clearNote() {
      console.log('clearNote');
      // 关闭Popover
      this.visible = false;
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
