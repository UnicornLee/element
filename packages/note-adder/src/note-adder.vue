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
  props: {
    ranges: {
      type: Array,
      default: () => []
    }
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
      },
      nodes: [],
      idx: 0
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
            // 校验信息
            const {startContainer, endContainer, startOffset, endOffset} = selection.getRangeAt(0);
            if (!startContainer || !endContainer) {
              console.error('起始或结束容器为空！');
              return;
            }
            let startNodeId = startContainer.parentNode.attributes.id;
            let endNodeId = endContainer.parentNode.attributes.id;
            console.log('66  startNodeId: ', startNodeId);
            console.log('69  endNodeId: ', endNodeId);
            if (!startNodeId || !endNodeId || !startNodeId.value || !endNodeId.value) {
              console.error('起始或结束容器的id为空！');
              return;
            }
            startNodeId = startNodeId.value;
            endNodeId = endNodeId.value;
            let startNodeIdNum = startNodeId.replace('note_adder_', '');
            let endNodeIdNum = endNodeId.replace('note_adder_', '');
            console.log('66  startNodeIdNum: ', startNodeIdNum);
            console.log('69  endNodeIdNum: ', endNodeIdNum);
            if (!startNodeIdNum || !endNodeIdNum || isNaN(startNodeIdNum) || isNaN(endNodeIdNum)) {
              console.error('起始或结束容器的id命名不对！');
              return;
            }
            startNodeIdNum = parseInt(startNodeIdNum, 10);
            endNodeIdNum = parseInt(endNodeIdNum, 10);
            if ((!startOffset && startOffset !== 0) || (!endOffset && endOffset !== 0)) {
              console.error('起始或结束偏移量为空！');
              return;
            }
            // 获取选中文本的所有直接父标签信息
            let nodes = [];
            if (startNodeIdNum <= 0) {
              console.error('起始容器的id必须是正整数！');
              return;
            } else if (endNodeIdNum <= 0) {
              console.error('结束容器的id必须是正整数！');
              return;
            } else if (startNodeIdNum > endNodeIdNum) {
              console.error('起始容器的id大于结束容器的id！');
              return;
            }
            if (startNodeIdNum === endNodeIdNum) {
              if (endOffset <= startOffset) {
                console.error('同一容器结束偏移量必须大于起始偏移量！');
                return;
              } else {
                nodes.push({id: startNodeIdNum, start: startOffset, end: endOffset});
              }
            } else {
              for (let i = startNodeIdNum; i <= endNodeIdNum; i++) {
                const node = document.getElementById(`note_adder_${i}`);
                if (!node) {
                  console.log(`找不到id为note_adder_${i}的节点！`);
                } else {
                  if (i === startNodeIdNum) {
                    nodes.push({id: i, start: startOffset, end: -1});
                  } else if (i === endNodeIdNum) {
                    nodes.push({id: i, start: 0, end: endOffset});
                  } else {
                    nodes.push({id: i, start: 0, end: -1});
                  }
                }
              }
            }
            this.nodes = nodes;
            console.log('66  nodes: ', JSON.stringify(nodes));
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
        this.mark(3, actionColor.color.val);
      } else if (actionColor.type === 'wave') {
        this.waveLineLastUsed = actionColor.color;
        this.mark(1, actionColor.color.val);
      } else if (actionColor.type === 'straight') {
        this.straightLineLastUsed = actionColor.color;
        this.mark(2, actionColor.color.val);
      }
    },
    mark(type, color) {
      console.log('259  note-adder: mark: ', type, color);
      if (!color) {
        return;
      }
      this.handleNodes(type, color);
    },
    handleNodes(type, color) {
      // 生成本次的唯一id
      let id = ++this.idx;
      this.clickId = id.toString();
      // 遍历文本节点
      this.nodes.forEach((node) => {
        this.generateNoteNode(id, node, type, color);
      });
    },
    generateNoteNode(id, nodeInfo, type, color) {
      const node = document.getElementById(`note_adder_${nodeInfo.id}`);
      console.log('275  generateNoteNode: ', node);
      console.log('275  node.innerText.length: ', node.innerText.length);
      console.log('275  node.innerText: ', node.innerText);
      if (!node) {
        console.error(`找不到id为note_adder_${nodeInfo.id}的节点！`);
        return;
      }
      // 创建一个文档片段用来替换文本节点
      let fragment = document.createDocumentFragment();
      let startNode = null;
      let endNode = null;
      // 截取前一段不需要划线的文本
      if (nodeInfo.start !== 0) {
        startNode = document.createTextNode(node.textContent.slice(0, nodeInfo.start));
      }
      console.log('286  startNode: ', startNode);
      // 截取后一段不需要划线的文本
      if (nodeInfo.end !== -1) {
        endNode = document.createTextNode(node.textContent.slice(nodeInfo.end));
      }
      startNode && fragment.appendChild(startNode);

      // 改成直接包裹整块文本
      let textNode = document.createElement('span');
      textNode.setAttribute('id', `note_action_${id}`);
      textNode.className = 'el-note-action__line ' + this.setStyle(type);
      textNode.style.setProperty('--wavy-line-color', color);
      if (nodeInfo.end !== -1) {
        textNode.textContent = node.textContent.slice(nodeInfo.start, nodeInfo.end);
      } else {
        textNode.textContent = node.textContent.slice(nodeInfo.start);
      }
      fragment.appendChild(textNode);

      endNode && fragment.appendChild(endNode);
      // 替换文本节点
      node.replaceChild(fragment, node.firstChild);
      // let offset = this.getTextOffset(textNode);
      // let textLength = textNode.textContent.length;
      // let params = {
      //   offset,
      //   end: offset + textLength - 1,
      //   start: offset,
      //   text: textNode.innerText,
      //   length: textLength, // ++
      //   id: id.toString(),
      //   lineStyle: type,
      //   bgColor: color,
      //   lineColor: color
      // };
      // let add = true;
      // for (let i = 0; i < this.rangeList.length; i++) {
      //   const maxStart = [this.rangeList[i].start, params.start];
      //   const minEnd = [this.rangeList[i].end, params.end];
      //   if (this.rangeList[i].end === params.start - 1) {
      //     add = false;
      //     this.rangeList[i].end = params.end;
      //     this.rangeList[i].text += params.text;
      //     this.rangeList[i].lineStyle = this.changeLineStyle(this.rangeList[i].lineStyle, params.lineStyle);
      //     break;
      //   } else if (this.rangeList[i].start === params.end + 1) {
      //     add = false;
      //     this.rangeList[i].start = params.start;
      //     this.rangeList[i].text = params.text + this.rangeList[i].text;
      //     this.rangeList[i].lineStyle = this.changeLineStyle(this.rangeList[i].lineStyle, params.lineStyle);
      //     break;
      //   } else if (Math.max(...maxStart) <= Math.min(...minEnd)) {
      //     add = false;
      //     this.rangeList[i].start = Math.min(...maxStart);
      //     this.rangeList[i].end = Math.max(...minEnd);
      //     this.rangeList[i].lineStyle = this.changeLineStyle(this.rangeList[i].lineStyle, params.lineStyle);
      //     break;
      //   }
      // }
      // if (add) {
      //   this.rangeList.push(params);
      // }
    },
    addStyle(lineStyle, lineColor, bgColor) {
      switch (lineStyle) {
        case 0:
          return null;
        case 1: // 波浪线
          return '--wavy-line-color:' + lineColor;
        case 2: // 直线
          return '--straight-line-color:' + lineColor;
        case 3: // 背景色
          return '--mark-bg-color:' + bgColor;
        case 4: // 背景色+波浪线
          return '--mark-bg-color:' + bgColor + ';--wavy-line-color:' + lineColor;
        case 5: // 背景色+直线
          return '--mark-bg-color:' + bgColor + ';--straight-line-color:' + lineColor;
      }
    },
    setStyle(lineStyle) {
      if (lineStyle === 2 || lineStyle === 5) {
        return 'el-note-action__straight-line';
      } else if (lineStyle === 1 || lineStyle === 4) {
        return 'el-note-action__wavy-line';
      } else if (lineStyle === 0) {
        return 'el-note-action__do-line';
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
