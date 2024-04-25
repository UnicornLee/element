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
                   @action-color-selected="selectColor" />
      <note-action title="波浪线" type="wavy" icon-name="house" :shortcut-key="wavyLineShortcutKey"
                   :colors="wavyLineColors":last-used="wavyLineLastUsed" is-dropdown
                   @action-color-selected="selectColor" />
      <note-action title="直线" type="straight" icon-name="house" :shortcut-key="straightLineShortcutKey"
                   :colors="straightLineColors" :last-used="straightLineLastUsed" is-dropdown
                   @action-color-selected="selectColor" />
      <note-action title="写想法" type="idea" icon-name="edit" @action-idea-written="writeIdea" />
      <note-action title="知易" type="ai" icon-name="magic-stick" />
      <note-action title="清除" type="clear" icon-name="delete" :shortcut-key="clearNoteShortcutKey" />
    </div>
  </el-popover>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
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
      wavyLineColors: [
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
      wavyLineShortcutKey: 'Ctrl+Shift+W',
      straightLineShortcutKey: 'Ctrl+Shift+S',
      clearNoteShortcutKey: 'Ctrl+Shift+C',
      backgroundLastUsed: {
        name: '红',
        val: '#FF00FF'
      },
      wavyLineLastUsed: {
        name: '红',
        val: '#FF0000'
      },
      straightLineLastUsed: {
        name: '红',
        val: '#FF0000'
      },
      dottedLineColor: '#A9A9A9',
      notes: [],
      ideas: []
    };
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
          console.log('63  selection.type: ', selection.type);
          // console.log('63  selection.ranges: ', JSON.stringify(selection.ranges));
          console.log('63  selection.getRangeAt(0): ', selection.getRangeAt(0));
          if (!!selection && selection.rangeCount > 0 && !selection.isCollapsed &&
              selection.toString().length > 0 && selection.toString().trim() !== '' &&
              selection.toString() !== '{}') {
            this.range = selection.getRangeAt(0).cloneRange();
            // 校验信息
            const {commonAncestorContainer, startContainer, endContainer} = selection.getRangeAt(0);
            // 获取选中文本的所有直接父标签信息
            let textNodes = [];
            // 起始和结束节点，或者在范围内的节点，如果是文本节点则收集起来
            // let range = document.createRange();
            // range.setStart(startContainer, 0);
            // range.setEnd(endContainer, 0);
            this.walk(commonAncestorContainer, (node) => {
              if (node === startContainer || node === endContainer || this.range.isPointInRange(node, 0)) {
                const nodeType = node.nodeType;
                console.log('143  nodeType: ', nodeType);
                if (nodeType === 3) {
                  textNodes.push(node);
                }
              }
            });
            this.textNodes = textNodes;
            // console.log('66  textNodes: ', JSON.stringify(textNodes));
            this.selectedText = selection.toString();
            // console.log('66  note-adder: ', selectedText);
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
    writeIdea(content) {
      this.ideaId = uuidv4();
      this.mark(4);
      this.ideas.push({
        id: this.ideaId,
        content: content,
        creatTime: new Date().toLocaleString()
      });
    },
    selectColor(actionColor) {
      document.addEventListener('mousedown', this.handleClick);
      console.log('note-adder: selectColor: ', JSON.stringify(actionColor));
      const {type, color} = actionColor;
      if (color) {
        if (type === 'background') {
          this.backgroundLastUsed = color;
          this.mark(3, color.val);
        } else if (type === 'wavy') {
          this.wavyLineLastUsed = color;
          this.mark(1, color.val);
        } else if (type === 'straight') {
          this.straightLineLastUsed = color;
          this.mark(2, color.val);
        }
      } else {
        if (type === 'background') {
          this.mark(3);
        } else if (type === 'wavy') {
          this.mark(1);
        } else if (type === 'straight') {
          this.mark(2);
        }
      }
    },
    mark(type, color) {
      console.log('259  note-adder: mark: ', type, color);
      this.handleTextNodes(type, color);
    },
    handleTextNodes(type, color) {
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
        console.log('*************node: ', node);
        console.log('*************node.parentNode: ', node.parentNode);
        if (node.parentNode && node.parentNode.attributes && node.parentNode.attributes.id) {
          parentNodeId = node.parentNode.attributes.id.value;
        }
        let parentNodeClassName = '';
        if (node.parentNode && node.parentNode.className) {
          parentNodeClassName = node.parentNode.className;
        }
        console.log('*************parentNodeId: ', parentNodeId);
        if (parentNodeId.startsWith('note_adder_') || parentNodeClassName.includes('el-note-action')) {
          // 替换该文本节点
          this.replaceTextNode(node, parentNodeId, startOffset, endOffset, type, color);
        }
      });
    },
    replaceTextNode(node, parentNodeId, startOffset, endOffset, type, color) {
      // 创建一个文档片段用来替换文本节点
      let fragment = document.createDocumentFragment();
      let startNode = null;
      let endNode = null;
      if (parentNodeId.startsWith('note_adder_')) {
        // 如果没有加笔记，点击取消操作，什么也不做。
        if (!color && type !== 4) {
          return;
        }
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
        textNode.className = this.getClassName(type, color);
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
        const newClassName = this.getClassName(type, color, className);
        if (newClassName.trim() === '') {
          let textNode = document.createTextNode(node.nodeValue.slice(startOffset, endOffset));
          fragment.appendChild(textNode);
        } else {
          let textNode = document.createElement('span');
          textNode.textContent = node.nodeValue.slice(startOffset, endOffset);
          textNode.className = this.getClassName(type, color, className);
          textNode.setAttribute('style', this.getStyle(type, color, style));
          fragment.appendChild(textNode);
        }

        endNode && fragment.appendChild(endNode);

        // 替换文本节点
        node.parentNode.parentNode.replaceChild(fragment, node.parentNode);
      }
    },
    getClassName(type, color, className) {
      let classList = className ? className.split(' ').filter(item => item.trim() !== '') : ['el-note-action'];
      let index = -1;
      switch (type) {
        case 1: // 波浪线
          if (color) {
            index = classList.indexOf('el-note-action__straight-line');
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (!classList.includes('el-note-action__wavy-line')) {
              classList.push('el-note-action__wavy-line');
            }
          } else {
            index = classList.indexOf('el-note-action__wavy-line');
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (classList.length === 1 && classList[0] === 'el-note-action') {
              classList = [];
            }
          }
          return classList.join(' ');
        case 2: // 直线
          index = classList.indexOf('el-note-action__wavy-line');
          if (color) {
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (!classList.includes('el-note-action__straight-line')) {
              classList.push('el-note-action__straight-line');
            }
          } else {
            index = classList.indexOf('el-note-action__straight-line');
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (classList.length === 1 && classList[0] === 'el-note-action') {
              classList = [];
            }
          }
          return classList.join(' ');
        case 3: // 背景色
          if (color) {
            if (!classList.includes('el-note-action__mark-bg')) {
              classList.push('el-note-action__mark-bg');
            }
          } else {
            index = classList.indexOf('el-note-action__mark-bg');
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (classList.length === 1 && classList[0] === 'el-note-action') {
              classList = [];
            }
          }
          return classList.join(' ');
        case 4: // 写想法
          index = classList.indexOf('el-note-action__dashed-line');
          if (index === -1) {
            classList.push('el-note-action__dashed-line');
          }
          classList.push(`idea-id-${this.ideaId}`);
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
          if (color) {
            newStyle += '--wavy-line-color:' + color + ';';
            for (const item of styleArr) {
              if (!item.trim().startsWith('--wavy-line-color') && !item.trim().startsWith('--straight-line-color')) {
                newStyle += item.trim() + ';';
              }
            }
          } else {
            for (const item of styleArr) {
              if (!item.trim().startsWith('--wavy-line-color')) {
                newStyle += item.trim() + ';';
              }
            }
          }
          return newStyle;
        case 2: // 直线
          if (color) {
            newStyle += '--straight-line-color:' + color + ';';
            for (const item of styleArr) {
              if (!item.trim().startsWith('--wavy-line-color') && !item.trim().startsWith('--straight-line-color')) {
                newStyle += item.trim() + ';';
              }
            }
          } else {
            for (const item of styleArr) {
              if (!item.trim().startsWith('--straight-line-color')) {
                newStyle += item.trim() + ';';
              }
            }
          }
          return newStyle;
        case 3: // 背景色
          if (color) {
            newStyle += '--mark-bg-color:' + color + ';';
            for (const item of styleArr) {
              if (!item.trim().startsWith('--mark-bg-color')) {
                newStyle += item.trim() + ';';
              }
            }
          } else {
            for (const item of styleArr) {
              if (!item.trim().startsWith('--mark-bg-color')) {
                newStyle += item.trim() + ';';
              }
            }
          }
          return newStyle;
        case 4: // 写想法
          if (style.includes('--dotted-line-color')) {
            newStyle = style;
          } else {
            for (const item of styleArr) {
              newStyle += item.trim() + ';';
            }
            newStyle += `--dotted-line-color: ${this.dottedLineColor};`;
          }
          return newStyle;
        default:
          return style;
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
