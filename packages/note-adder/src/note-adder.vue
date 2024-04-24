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
        {name: '红', val: '#FF00FF'},
        {name: '蓝', val: '#87CEFA'},
        {name: '绿', val: '#90EE90'},
        {name: '黄', val: '#FFFFE0'},
        {name: '紫', val: '#EE82EE'},
        {name: '粉', val: '#FFB6C1'}
      ],
      waveLineColors: [
        {name: '红', val: '#FF0000'},
        {name: '蓝', val: '#0000FF'},
        {name: '绿', val: '#008000'},
        {name: '黄', val: '#FFFF00'},
        {name: '紫', val: '#800080'},
        {name: '粉', val: '#FF1493'}
      ],
      straightLineColors: [
        {name: '红', val: '#FF0000'},
        {name: '蓝', val: '#0000FF'},
        {name: '绿', val: '#008000'},
        {name: '黄', val: '#FFFF00'},
        {name: '紫', val: '#800080'},
        {name: '粉', val: '#FF1493'}
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
        val: '#FF00FF'
      },
      waveLineLastUsed: {
        name: '红',
        val: '#FF0000'
      },
      straightLineLastUsed: {
        name: '红',
        val: '#FF0000'
      },
      nodes: []
    };
  },
  computed: {
    nextId() {
      if (this.ranges.length === 0) {
        return 1;
      } else {
        return this.ranges[this.ranges.length - 1].id + 1;
      }
    }
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
          // console.log('63  selection.anchorNode: ', selection.anchorNode);
          // console.log('63  selection.anchorOffset: ', selection.anchorOffset);
          // console.log('63  selection.focusNode: ', selection.focusNode);
          // console.log('63  selection.focusOffset: ', selection.focusOffset);
          // console.log('63  selection.isCollapsed: ', selection.isCollapsed);
          // console.log('63  selection.toString().length: ', selection.toString().length);
          // console.log('63  selection.toString(): ', selection.toString());
          // console.log('63  selection.rangeCount: ', selection.rangeCount);
          console.log('63  selection.type: ', selection.type);
          // console.log('63  selection.ranges: ', JSON.stringify(selection.ranges));
          console.log('63  selection.getRangeAt(0): ', selection.getRangeAt(0));
          if (!!selection && selection.rangeCount > 0 && !selection.isCollapsed &&
              selection.toString().length > 0 && selection.toString().trim() !== '' &&
              selection.toString() !== '{}') {
            this.range = selection.getRangeAt(0).cloneRange();
            // 校验信息
            const {commonAncestorContainer, startContainer, endContainer, startOffset, endOffset} = selection.getRangeAt(0);
            // 获取选中文本的所有直接父标签信息
            let nodes = [];
            let textNodes = [];
            // 起始和结束节点，或者在范围内的节点，如果是文本节点则收集起来
            let range = document.createRange();
            range.setStart(startContainer, 0);
            range.setEnd(endContainer, endContainer.nodeValue.length);
            let startNodeId = '';
            let startNodeIdNum = 0;
            let endNodeId = '';
            let endNodeIdNum = 0;
            if (startContainer.attributes && startContainer.attributes.id && startContainer.attributes.id.value.startsWith('note_adder_')) {
              startNodeId = startContainer.attributes.id.value;
              startNodeIdNum = parseInt(startNodeId.replace('note_adder_', ''), 10);
            } else if (startContainer.parentNode.attributes && startContainer.parentNode.attributes.id && startContainer.parentNode.attributes.id.value.startsWith('note_adder_')) {
              startNodeId = startContainer.parentNode.attributes.id.value;
              startNodeIdNum = parseInt(startNodeId.replace('note_adder_', ''), 10);
            }
            if (endContainer.attributes && endContainer.attributes.id && endContainer.attributes.id.value.startsWith('note_adder_')) {
              endNodeId = endContainer.attributes.id.value;
              endNodeIdNum = parseInt(endNodeId.replace('note_adder_', ''), 10);
            } else if (endContainer.parentNode.attributes && endContainer.parentNode.attributes.id && endContainer.parentNode.attributes.id.value.startsWith('note_adder_')) {
              endNodeId = endContainer.parentNode.attributes.id.value;
              endNodeIdNum = parseInt(endNodeId.replace('note_adder_', ''), 10);
            }
            this.walk(commonAncestorContainer, (node) => {
              if (node === startContainer || node === endContainer || range.isPointInRange(node, 0)) {
                let nodeId = '';
                let parentNodeId = '';
                console.log('148  node: ', node);
                console.log('149  typeof node: ', typeof node);
                console.log('150  node.parentNode.attributes.id: ', node.parentNode.attributes.id);
                const nodeType = node.nodeType;
                console.log('143  nodeType: ', nodeType);
                if (nodeType === 3) {
                  textNodes.push(node);
                  parentNodeId = node.parentNode.attributes.id;
                } else if (node.attributes && node.attributes.id) {
                  nodeId = node.attributes.id;
                }
                console.log('143  nodeId: ', nodeId);
                if (nodeId && nodeId.value && (nodeId.value.startsWith('note_adder_') ||
                    nodeId.value.startsWith('note_action_') || parentNodeId.value.startsWith('note_adder_'))) {
                  let nodeIdNum = 0;
                  let parentNodeIdNum = 0;
                  if (nodeId.value.startsWith('note_adder_')) {
                    nodeIdNum = parseInt(nodeId.value.replace('note_adder_', ''), 10);
                    console.log('153  nodeIdNum: ', nodeIdNum);
                  } else {
                    nodeIdNum = parseInt(parentNodeId.value.replace('note_action_', ''), 10);
                    console.log('157  parentNodeIdNum: ', nodeIdNum);
                  }
                  if (parentNodeId && parentNodeId.value) {
                    parentNodeIdNum = parseInt(parentNodeId.value.replace('note_adder_', ''), 10);
                    console.log('157  parentNodeIdNum: ', parentNodeIdNum);
                  }
                  if (nodes.some(node => node.id === nodeIdNum)) {
                    return;
                  }
                  if (startNodeIdNum === endNodeIdNum) {
                  } else {
                    if (node === startContainer || nodeIdNum === startNodeIdNum) {
                      nodes.push({id: nodeIdNum, start: startOffset, end: node.textContent.length});
                    } else if (node === endContainer || nodeIdNum === endNodeIdNum) {
                      nodes.push({id: nodeIdNum, start: 0, end: endOffset});
                    } else {
                      nodes.push({id: nodeIdNum, start: 0, end: node.textContent.length});
                    }
                  }
                }
              }
            });
            console.log('172   textNodes: ', textNodes);
            // if (!startContainer || !endContainer) {
            //   console.error('起始或结束容器为空！');
            //   return;
            // }
            // let startNodeId = startContainer.parentNode.attributes.id;
            // let endNodeId = endContainer.parentNode.attributes.id;
            // console.log('66  startNodeId: ', startNodeId);
            // console.log('69  endNodeId: ', endNodeId);
            // if (!startNodeId || !endNodeId || !startNodeId.value || !endNodeId.value) {
            //   console.error('起始或结束容器的id为空！');
            //   return;
            // }
            // startNodeId = startNodeId.value;
            // endNodeId = endNodeId.value;
            // let startNodeIdNum = startNodeId.replace('note_adder_', '');
            // let endNodeIdNum = endNodeId.replace('note_adder_', '');
            // console.log('66  startNodeIdNum: ', startNodeIdNum);
            // console.log('69  endNodeIdNum: ', endNodeIdNum);
            // if (!startNodeIdNum || !endNodeIdNum || isNaN(startNodeIdNum) || isNaN(endNodeIdNum)) {
            //   console.error('起始或结束容器的id命名不对！');
            //   return;
            // }
            // startNodeIdNum = parseInt(startNodeIdNum, 10);
            // endNodeIdNum = parseInt(endNodeIdNum, 10);
            // if ((!startOffset && startOffset !== 0) || (!endOffset && endOffset !== 0)) {
            //   console.error('起始或结束偏移量为空！');
            //   return;
            // }
            // if (startNodeIdNum <= 0) {
            //   console.error('起始容器的id必须是正整数！');
            //   return;
            // } else if (endNodeIdNum <= 0) {
            //   console.error('结束容器的id必须是正整数！');
            //   return;
            // } else if (startNodeIdNum > endNodeIdNum) {
            //   console.error('起始容器的id大于结束容器的id！');
            //   return;
            // }
            // if (startNodeIdNum === endNodeIdNum) {
            //   if (endOffset <= startOffset) {
            //     console.error('同一容器结束偏移量必须大于起始偏移量！');
            //     return;
            //   } else {
            //     nodes.push({id: startNodeIdNum, start: startOffset, end: endOffset});
            //   }
            // } else {
            //   for (let i = startNodeIdNum; i <= endNodeIdNum; i++) {
            //     const node = document.getElementById(`note_adder_${i}`);
            //     if (!node) {
            //       console.log(`找不到id为note_adder_${i}的节点！`);
            //     } else {
            //       if (i === startNodeIdNum) {
            //         nodes.push({id: i, start: startOffset, end: node.textContent.length});
            //       } else if (i === endNodeIdNum) {
            //         nodes.push({id: i, start: 0, end: endOffset});
            //       } else {
            //         nodes.push({id: i, start: 0, end: node.textContent.length});
            //       }
            //     }
            //   }
            // }
            this.nodes = nodes;
            this.textNodes = textNodes;
            console.log('66  nodes: ', JSON.stringify(nodes));
            const selectedText = selection.toString();
            console.log('66  note-adder: ', selectedText);
            // 当选区非空时，处理选中文本
            this.visible = true;
          }
        });
      }
    },
    walk(node, callback = () => {
    }) {
      callback(node);
      if (node && node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          this.walk(node.childNodes[i], callback);
        }
      }
    },
    getTextOffset(node) {
      let offset = 0;
      let parNode = node;
      // 遍历直到外层第一个非划线元素
      while (parNode && parNode.classList.contains('el-text-edit__line')) {
        // 获取前面的兄弟元素的总字符数
        offset += this.getPrevSiblingOffset(parNode);
        parNode = parNode.parentNode;
      }
      return offset;
    },
    getPrevSiblingOffset(node) {
      let offset = 0;
      let prevNode = node.previousSibling;
      while (prevNode) {
        offset +=
            prevNode.nodeType === 3 ? prevNode.nodeValue.length : prevNode.textContent.length;
        prevNode = prevNode.previousSibling;
      }
      return offset;
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
      this.handleTextNodes(type, color);
    },
    handleNodes(type, color) {
      // 生成本次的唯一id
      let id = this.nextId;
      // 遍历文本节点
      this.nodes.forEach((node) => {
        this.generateNoteNode(id, node, type, color);
      });
      this.ranges.push({
        id,
        nodes: this.nodes,
        type,
        bgColor: color,
        lineColor: color,
        notes: []
      });
      console.log('283  note-adder: handleNodes: ', JSON.stringify(this.ranges));
      this.nodes = [];
      console.log('285  note-adder: handleNodes: ', JSON.stringify(this.ranges));
      // 关闭Popover
      this.visible = false;
    },
    handleTextNodes(value, color) {
      // 遍历文本节点
      this.textNodes.forEach((node) => {
        // 范围的首尾元素需要判断一下偏移量，用来截取字符
        let startOffset = 0;
        let endOffset = node.nodeValue.length;
        if (node === this.range.startContainer && this.range.startOffset !== 0) {
          startOffset = this.range.startOffset;
        }
        if (node === this.range.endContainer && this.range.endOffset !== 0) {
          endOffset = this.range.endOffset;
        }
        let parentNodeId = '';
        if (node.parentNode.attributes && node.parentNode.attributes.id) {
          parentNodeId = node.parentNode.attributes.id.value;
        }
        let parentNodeClassName = '';
        if (node.parentNode.className) {
          parentNodeClassName = node.parentNode.className;
        }
        console.log('*************parentNodeId: ', parentNodeId);
        if (parentNodeId.startsWith('note_adder_') || parentNodeClassName.includes('el-note-action__line')) {
          // 替换该文本节点
          this.replaceTextNode(node, parentNodeId, startOffset, endOffset, value, color);
        }
      });
    },
    replaceTextNode(node, parentNodeId, startOffset, endOffset, type, color) {
      // 创建一个文档片段用来替换文本节点
      let fragment = document.createDocumentFragment();
      let startNode = null;
      let endNode = null;
      if (parentNodeId.startsWith('note_adder_')) {
        // 截取前一段不需要划线的文本
        if (startOffset !== 0) {
          startNode = document.createTextNode(node.nodeValue.slice(0, startOffset));
        }

        // 截取后一段不需要划线的文本
        if (endOffset < node.nodeValue.length) {
          endNode = document.createTextNode(node.nodeValue.slice(endOffset));
        }
        startNode && fragment.appendChild(startNode);

        // 改成直接包裹整块文本
        let textNode = document.createElement('span');
        textNode.textContent = node.nodeValue.slice(startOffset, endOffset);
        textNode.className = this.getClassName(type);
        textNode.setAttribute('style', this.getStyle(type, color));
        fragment.appendChild(textNode);

        endNode && fragment.appendChild(endNode);

        // 替换文本节点
        node.parentNode.replaceChild(fragment, node);
      } else {
        const className = node.parentNode.className;
        const style = node.parentNode.attributes.style.value;
        // 截取前一段不需要划线的文本
        if (startOffset !== 0) {
          startNode = document.createElement('span');
          startNode.textContent = node.nodeValue.slice(0, startOffset);
          startNode.className = className;
          startNode.setAttribute('style', style);
        }
        // 截取后一段不需要划线的文本
        if (endOffset < node.nodeValue.length) {
          endNode = document.createElement('span');
          endNode.textContent = node.nodeValue.slice(endOffset);
          endNode.className = className;
          endNode.setAttribute('style', style);
        }
        startNode && fragment.appendChild(startNode);

        // 改成直接包裹整块文本
        let textNode = document.createElement('span');
        textNode.textContent = node.nodeValue.slice(startOffset, endOffset);
        textNode.className = this.getClassName(type, className);
        textNode.setAttribute('style', this.getStyle(type, color, style));
        fragment.appendChild(textNode);

        endNode && fragment.appendChild(endNode);
        console.log('481  node: ', node);
        console.log('481  node.parentNode: ', node.parentNode);
        console.log('481  fragment: ', fragment);
        // 替换文本节点
        node.parentNode.parentNode.replaceChild(fragment, node.parentNode);
      }
    },
    getClassName(type, className) {
      const classList = className ? className.split(' ') : ['el-note-action__line'];
      let index = -1;
      switch (type) {
        case 1: // 波浪线
          index = classList.indexOf('el-note-action__straight-line');
          if (index !== -1) {
            classList.splice(index, 1);
          }
          if (!classList.includes('el-note-action__wavy-line')) {
            classList.push('el-note-action__wavy-line');
          }
          return classList.join(' ');
        case 2: // 直线
          index = classList.indexOf('el-note-action__wavy-line');
          if (index !== -1) {
            classList.splice(index, 1);
          }
          if (!classList.includes('el-note-action__straight-line')) {
            classList.push('el-note-action__straight-line');
          }
          return classList.join(' ');
        case 3: // 背景色
          if (!classList.includes('el-note-action__mark-bg')) {
            classList.push('el-note-action__mark-bg');
          }
          return classList.join(' ');
        default:
          return className;
      }
    },
    getStyle(type, color, style) {
      const styleArr = style ? style.split(';').filter(item => item.trim() !== '') : [];
      console.log('523  getStyle: ', styleArr);
      let newStyle = '';
      switch (type) {
        case 1: // 波浪线
          newStyle += '--wavy-line-color:' + color + ';';
          for (const item of styleArr) {
            if (!item.trim().startsWith('--wavy-line-color') && !item.trim().startsWith('--straight-line-color')) {
              newStyle += item.trim() + ';';
            }
          }
          return newStyle;
        case 2: // 直线
          newStyle += '--straight-line-color:' + color + ';';
          for (const item of styleArr) {
            console.log('537 item: ', item);
            if (!item.trim().startsWith('--wavy-line-color') && !item.trim().startsWith('--straight-line-color')) {
              newStyle += item.trim() + ';';
            }
          }
          return newStyle;
        case 3: // 背景色
          newStyle += '--mark-bg-color:' + color + ';';
          for (const item of styleArr) {
            if (!item.trim().startsWith('--mark-bg-color')) {
              newStyle += item.trim() + ';';
            }
          }
          return newStyle;
        default:
          return style;
      }
    },
    generateNoteNode(id, nodeInfo, type, color) {
      const node = document.getElementById(`note_adder_${nodeInfo.id}`);
      console.log('275  generateNoteNode: ', node);
      console.log('275  node.innerText.length: ', node.textContent.length);
      console.log('275  node.innerText: ', node.textContent);
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
      if (nodeInfo.end < node.textContent.length) {
        endNode = document.createTextNode(node.textContent.slice(nodeInfo.end));
      }
      startNode && fragment.appendChild(startNode);

      // 改成直接包裹整块文本
      let textNode = document.createElement('span');
      textNode.setAttribute('id', `note_action_${id}`);
      textNode.className = 'el-note-action__line ' + this.setStyle(type);
      if (type === 3) { // 背景色
        textNode.style.setProperty('--mark-bg-color', color);
      } else if (type === 1) { // 波浪线
        textNode.style.setProperty('--wavy-line-color', color);
      } else if (type === 2) { // 直线
        textNode.style.setProperty('--straight-line-color', color);
      }
      textNode.textContent = node.textContent.slice(nodeInfo.start, nodeInfo.end);
      fragment.appendChild(textNode);

      endNode && fragment.appendChild(endNode);
      // 替换文本节点
      node.replaceChild(fragment, node.firstChild);
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

<style scoped lang="scss">
.note-action-popover {
  position: relative;
  user-select: none;
}
.note-actions {
  display: flex;
}
</style>
