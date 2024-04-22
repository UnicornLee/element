<template>
  <el-popover
      ref="noteActionPopover"
      placement="top"
      offset="10"
      trigger="manual"
      v-model="visible"
      visible-arrow
      class="note-action-popover"
  >
    <div class="note-actions">
      <note-action title="复制" type="copy" icon-name="document-copy" :shortcut-key="copyTextShortcutKey"
                   :click-handler="copyText" />
      <note-action title="背景" type="background" icon-name="house" :shortcut-key="backgroundShortcutKey"
                   :colors="backgroundColors" :last-used="backgroundLastUsed" is-dropdown
                   :click-handler="backgroundTextColor" @action-color-selected="selectColor" @action-clicked="handleActionClicked" />
      <note-action title="波浪线" type="wave" icon-name="house" :shortcut-key="waveLineShortcutKey"
                   :colors="waveLineColors":last-used="waveLineLastUsed" is-dropdown
                   :click-handler="underlineText" @action-color-selected="selectColor" @action-clicked="handleActionClicked" />
      <note-action title="直线" type="straight" icon-name="house" :shortcut-key="straightLineShortcutKey"
                   :colors="straightLineColors" :last-used="straightLineLastUsed" is-dropdown
                   :click-handler="underlineText" @action-color-selected="selectColor" @action-clicked="handleActionClicked" />
      <note-action title="写想法" type="idea" icon-name="edit" :shortcut-key="writeIdeaShortcutKey"
                   :click-handler="writeIdea" />
      <note-action title="知易" type="ai" icon-name="magic-stick" :shortcut-key="askAIShortcutKey"
                   :click-handler="askAI" />
      <note-action title="清除" type="clear" icon-name="delete" :shortcut-key="clearNoteShortcutKey"
                   :click-handler="clearNote" />
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
      visible: false,
      backgroundColors: [
        {name: '红', val: 'red'},
        {name: '蓝', val: 'blue'},
        {name: '绿', val: 'green'},
        {name: '黄', val: 'yellow'},
        {name: '紫', val: 'purple'},
        {name: '粉', val: 'pink'}
      ],
      waveLineColors: [
        {name: '红', val: 'red'},
        {name: '蓝', val: 'blue'},
        {name: '绿', val: 'green'},
        {name: '黄', val: 'yellow'},
        {name: '紫', val: 'purple'},
        {name: '粉', val: 'pink'}
      ],
      straightLineColors: [
        {name: '红', val: 'red'},
        {name: '蓝', val: 'blue'},
        {name: '绿', val: 'green'},
        {name: '黄', val: 'yellow'},
        {name: '紫', val: 'purple'},
        {name: '粉', val: 'pink'}
      ],
      copyTextShortcutKey: 'Ctrl+Shift+C',
      backgroundShortcutKey: 'Ctrl+Shift+H',
      waveLineShortcutKey: 'Ctrl+Shift+W',
      straightLineShortcutKey: 'Ctrl+Shift+S',
      writeIdeaShortcutKey: 'Ctrl+Shift+I',
      askAIShortcutKey: 'Ctrl+Shift+A',
      clearNoteShortcutKey: 'Ctrl+Shift+C',
      backgroundLastUsed: {
        name: '红',
        val: 'red'
      },
      waveLineLastUsed: {
        name: '红',
        val: 'red'
      },
      straightLineLastUsed: {
        name: '红',
        val: 'red'
      }
    };
  },
  created() {
    // document.addEventListener('mouseup', this.handleTextSelection);
  },
  mounted() {
    document.addEventListener('mouseup', this.handleSelection);
    document.addEventListener('mousedown', this.handleClick);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.handleSelection);
    document.removeEventListener('mousedown', this.handleClick);
  },
  methods: {
    handleSelection() {
      if (!this.visible) {
        requestAnimationFrame(() => {
          const selection = window.getSelection();
          // eslint-disable-next-line no-debugger
          debugger;
          console.log('-----------------------------------------');
          console.log('63  selection.anchorNode: ', selection.anchorNode);
          console.log('63  selection.anchorOffset: ', selection.anchorOffset);
          console.log('63  selection.focusNode: ', selection.focusNode);
          console.log('63  selection.focusOffset: ', selection.focusOffset);
          console.log('63  selection.isCollapsed: ', selection.isCollapsed);
          console.log('63  selection.toString().length: ', selection.toString().length);
          console.log('63  selection.toString(): ', selection.toString());
          console.log('63  selection.rangeCount: ', selection.rangeCount);
          console.log('63  selection.type: ', selection.type);
          console.log('63  selection.ranges: ', JSON.stringify(selection.ranges));
          console.log('63  selection.getRangeAt(0): ', selection.getRangeAt(0));
          if (!!selection && selection.rangeCount > 0 && !selection.isCollapsed && selection.toString().length > 0 && selection.toString().trim() !== '' && selection.toString() !== '{}') {
            const selectedText = selection.toString();
            console.log('66  note-adder: ', selectedText);
            // 当选区非空时，处理选中文本
            this.visible = true;
          }
        });
      }
    },
    handleClick(event) {
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
      return true;
    },
    underlineText() {
      console.log('underlineText');
    },
    writeIdea() {
      console.log('noteText');
    },
    askAI() {
      console.log('askAI');
    },
    clearNote() {
      console.log('clearNote');
      // 关闭Popover
      this.visible = false;
    },
    selectColor(actionColor) {
      document.addEventListener('mousedown', this.handleClick);
      console.log('note-adder: selectColor: ', JSON.stringify(actionColor));
      if (actionColor.type === 'background') {
        this.backgroundLastUsed = actionColor.color;
      } else if (actionColor.type === 'wave') {
        this.waveLineLastUsed = actionColor.color;
      } else if (actionColor.type === 'straight') {
        this.straightLineLastUsed = actionColor.color;
      }
    },
    handleActionClicked(colorVisible) {
      console.log('note-adder: handleActionClicked: ', colorVisible);
      if (colorVisible) {
        document.removeEventListener('mousedown', this.handleClick);
      } else {
        document.addEventListener('mousedown', this.handleClick);
      }
    }
  }
};
</script>

<style scoped>
.note-action-popover {
  position: relative;
  user-select: none;
}
.note-actions {
  display: flex;
}
</style>
